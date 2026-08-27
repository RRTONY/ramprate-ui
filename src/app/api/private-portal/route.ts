import { NextRequest, NextResponse } from "next/server";
import {
  PORTAL_IDS,
  cookieMaxAgeFor,
  cookieNameFor,
  portalCookieValue,
  verifyPortalPassword,
  type PortalId,
} from "@/lib/portal-auth";

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
    maxAge: cookieMaxAgeFor(portalId),
  });
  return res;
}
