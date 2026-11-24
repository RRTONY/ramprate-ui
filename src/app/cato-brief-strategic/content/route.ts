import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  SESSION_SECONDS,
  createSession,
  matchesPassword,
} from "../private/access";

export const runtime = "nodejs";

const privateHeaders = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

// POST { password } → sets an 8-hour signed session cookie scoped to this
// page. The page itself (../page.tsx) then renders the brief on the server.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!matchesPassword(body?.password)) {
    return NextResponse.json(
      { ok: false },
      { status: 401, headers: privateHeaders },
    );
  }

  const secret = process.env.PORTAL_AUTH_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false },
      { status: 503, headers: privateHeaders },
    );
  }

  const response = NextResponse.json({ ok: true }, { headers: privateHeaders });
  response.cookies.set(AUTH_COOKIE, createSession(secret), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/cato-brief-strategic",
    maxAge: SESSION_SECONDS,
  });
  return response;
}
