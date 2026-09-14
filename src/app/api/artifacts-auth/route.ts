import { NextRequest, NextResponse } from "next/server";
import {
  artifactAdminCookieMaxAge,
  artifactAdminCookieName,
  artifactAdminCookieValue,
  isRateLimited,
  recordAttempt,
  verifyArtifactAdminPassword,
} from "@/lib/artifact-auth";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => null);
  const password = body?.password;

  if (typeof password !== "string") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  recordAttempt(ip);

  if (!verifyArtifactAdminPassword(password)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(artifactAdminCookieName(), artifactAdminCookieValue(), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: artifactAdminCookieMaxAge(),
  });
  return res;
}
