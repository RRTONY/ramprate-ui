import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

const BRANCH_COOKIE = "admin_session_branch";
const PR_COOKIE = "admin_session_pr";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours — an active editing session, not the login itself

function secret(): string {
  const s = process.env.PORTAL_AUTH_SECRET;
  if (!s) throw new Error("PORTAL_AUTH_SECRET is not set");
  return s;
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

// Cookie value is `<value>.<hmac>` so the branch name / PR number can't be
// tampered with client-side to point the session at an arbitrary branch.
function pack(value: string): string {
  return `${encodeURIComponent(value)}.${sign(value)}`;
}

function unpack(cookieValue: string | undefined): string | null {
  if (!cookieValue) return null;
  const idx = cookieValue.lastIndexOf(".");
  if (idx === -1) return null;
  const value = decodeURIComponent(cookieValue.slice(0, idx));
  const sig = cookieValue.slice(idx + 1);
  const expected = sign(value);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return value;
}

export interface AdminSession {
  branch: string | null;
  prNumber: number | null;
}

export async function getAdminSession(): Promise<AdminSession> {
  const store = await cookies();
  const branch = unpack(store.get(BRANCH_COOKIE)?.value);
  const prRaw = unpack(store.get(PR_COOKIE)?.value);
  const prNumber = prRaw !== null ? Number(prRaw) : null;
  return {
    branch,
    prNumber: prNumber !== null && Number.isFinite(prNumber) ? prNumber : null,
  };
}

export function setAdminSessionCookies(
  res: NextResponse,
  session: { branch?: string; prNumber?: number },
) {
  if (session.branch) {
    res.cookies.set(BRANCH_COOKIE, pack(session.branch), {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
  }
  if (session.prNumber != null) {
    res.cookies.set(PR_COOKIE, pack(String(session.prNumber)), {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
  }
}

export function clearAdminSessionCookies(res: NextResponse) {
  res.cookies.set(BRANCH_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set(PR_COOKIE, "", { path: "/", maxAge: 0 });
}
