import { NextRequest, NextResponse } from "next/server";
import {
  PORTAL_IDS,
  cookieNameFor,
  portalCookieValue,
  verifyPortalPassword,
  type PortalId,
} from "@/lib/portal-auth";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function isPortalId(value: unknown): value is PortalId {
  return (
    typeof value === "string" &&
    (PORTAL_IDS as readonly string[]).includes(value)
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const portalId = body?.portalId;
  const password = body?.password;

  if (!isPortalId(portalId) || typeof password !== "string") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!verifyPortalPassword(portalId, password)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookieNameFor(portalId), portalCookieValue(portalId), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}
