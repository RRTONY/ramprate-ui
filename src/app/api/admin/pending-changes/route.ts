import { NextResponse } from "next/server";
import { isPortalUnlocked } from "@/lib/portal-auth";
import { getAdminSession } from "@/lib/admin/session";
import * as gh from "@/lib/admin/github-client";
import { listPendingDrafts } from "@/lib/admin/sanity-content";

export async function GET() {
  const unlocked = await isPortalUnlocked("admin");
  if (!unlocked) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { branch, prNumber } = await getAdminSession();
  const drafts = await listPendingDrafts();

  if (!branch || !prNumber) {
    return NextResponse.json({
      branch: null,
      prNumber: null,
      prUrl: null,
      previewUrl: null,
      checkStatus: "unknown",
      failingChecks: [],
      files: [],
      drafts,
      canPublish: drafts.length > 0,
    });
  }

  const [compare, checks] = await Promise.all([
    gh.compareToDefaultBranch(branch),
    gh.getPRChecksDetail(prNumber),
  ]);

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
