import { NextResponse } from "next/server";
import { isPortalUnlocked } from "@/lib/portal-auth";
import { getAdminSession, clearAdminSessionCookies } from "@/lib/admin/session";
import * as gh from "@/lib/admin/github-client";
import { listPendingDrafts, publishDraft } from "@/lib/admin/sanity-content";

export async function POST() {
  const unlocked = await isPortalUnlocked("admin");
  if (!unlocked) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { branch, prNumber } = await getAdminSession();
  const drafts = await listPendingDrafts();

  if (!branch && drafts.length === 0) {
    return NextResponse.json(
      { error: "Nothing pending to publish" },
      { status: 400 },
    );
  }

  let mergeSha: string | null = null;
  if (branch && prNumber) {
    const status = await gh.getPRCombinedStatus(prNumber);
    if (status === "failure") {
      return NextResponse.json(
        {
          error:
            "The pull request's build checks are failing. Fix the issue before publishing.",
        },
        { status: 409 },
      );
    }
    if (status === "pending") {
      return NextResponse.json(
        {
          error:
            "The pull request's build checks are still running. Try again in a moment.",
        },
        { status: 409 },
      );
    }

    const merged = await gh.mergePR(prNumber);
    if (!merged.merged) {
      return NextResponse.json(
        { error: "GitHub could not merge the pull request." },
        { status: 409 },
      );
    }
    mergeSha = merged.sha;

    try {
      await gh.deleteBranch(branch);
    } catch {
      // Branch may already be auto-deleted by GitHub's merge settings — not fatal.
    }
  }

  const publishedIds: string[] = [];
  for (const draft of drafts) {
    await publishDraft(draft.id);
    publishedIds.push(draft.publishedId);
  }

  const res = NextResponse.json({
    ok: true,
    mergeSha,
    publishedIds,
  });
  clearAdminSessionCookies(res);
  return res;
}
