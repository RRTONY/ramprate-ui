import { NextRequest, NextResponse } from "next/server";
import { isPortalUnlocked } from "@/lib/portal-auth";
import { ADMIN_BRANCH_PREFIX } from "@/lib/admin/guardrails";
import * as gh from "@/lib/admin/github-client";
import {
  setAdminSessionCookies,
  clearAdminSessionCookies,
} from "@/lib/admin/session";

// `/api/admin/chat` streams its response, so its headers are already on the
// wire by the time a branch gets created mid-turn — it can't set the signed
// session cookie itself any more. The chat client calls this route once a
// turn settles to persist (or clear) that cookie, which is what
// `/api/admin/pending-changes` and `/api/admin/publish` read. The branch is
// re-validated against GitHub here before it's trusted into a signed cookie,
// so a forged body can't point the session at an arbitrary branch.
export async function POST(req: NextRequest) {
  const unlocked = await isPortalUnlocked("admin");
  if (!unlocked) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { branch, prNumber } = (await req.json().catch(() => ({}))) as {
    branch?: string | null;
    prNumber?: number | null;
  };

  if (!branch) {
    const res = NextResponse.json({ ok: true, cleared: true });
    clearAdminSessionCookies(res);
    return res;
  }

  if (
    !branch.startsWith(ADMIN_BRANCH_PREFIX) ||
    !(await gh.branchExists(branch))
  ) {
    return NextResponse.json(
      { error: "Unknown or non-admin branch" },
      { status: 400 },
    );
  }

  const res = NextResponse.json({ ok: true });
  setAdminSessionCookies(res, {
    branch,
    prNumber: typeof prNumber === "number" ? prNumber : undefined,
  });
  return res;
}
