import { NextResponse } from "next/server";
import { isPortalUnlocked } from "@/lib/portal-auth";
import { getAdminSession, clearAdminSessionCookies } from "@/lib/admin/session";
import * as gh from "@/lib/admin/github-client";
import { listPendingDrafts } from "@/lib/admin/sanity-content";

function emptyPendingState(
  drafts: Awaited<ReturnType<typeof listPendingDrafts>>,
) {
  return {
    branch: null,
    prNumber: null,
    prUrl: null,
    previewUrl: null,
    checkStatus: "unknown" as const,
    failingChecks: [],
    files: [],
    drafts,
    canPublish: drafts.length > 0,
  };
}

export async function GET() {
  const unlocked = await isPortalUnlocked("admin");
  if (!unlocked) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { branch, prNumber } = await getAdminSession();
  const drafts = await listPendingDrafts();

  if (!branch || !prNumber) {
    return NextResponse.json(emptyPendingState(drafts));
  }

  let compare: gh.CompareResult;
  let checks: Awaited<ReturnType<typeof gh.getPRChecksDetail>>;
  try {
    [compare, checks] = await Promise.all([
      gh.compareToDefaultBranch(branch),
      gh.getPRChecksDetail(prNumber),
    ]);
  } catch (err) {
    // The session cookie points at a branch that no longer exists on
    // GitHub — e.g. its PR was merged/closed outside this app's own
    // Publish flow (which would have cleared the cookie itself), or the
    // branch was deleted directly. Treat this as "no active session"
    // instead of a 500: clear the stale cookies so the next chat message
    // starts clean rather than repeating this same failure forever.
    if (gh.isNotFound(err)) {
      const res = NextResponse.json(emptyPendingState(drafts));
      clearAdminSessionCookies(res);
      return res;
    }
    throw err;
  }

  return NextResponse.json({
    branch,
    prNumber,
    prUrl: `https://github.com/RRTONY/ramprate-ui/pull/${prNumber}`,
    previewUrl: checks.previewUrl,
    checkStatus: checks.status,
    failingChecks: checks.failingChecks,
    files: compare.files,
    drafts,
    canPublish:
      (compare.files.length > 0 || drafts.length > 0) &&
      checks.status !== "failure" &&
      checks.status !== "pending",
  });
}
