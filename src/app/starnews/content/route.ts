import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { STARNEWS_HTML_BASE64 } from "../starnews-html";

const ACCESS_HASH =
  "49c044226da7aadaf128a3ec026710367941ea477e7e613bd9e6cb615ddf18c4";
const AUTH_COOKIE = "starnews_auth";
const AUTH_COOKIE_VALUE =
  "169575af8b690eee4c5daf2ab9c26a24d276dfc88670d8fa5be039a3b18d666a";

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function matchesPassword(value: string) {
  const candidate = Buffer.from(hash(value), "utf8");
  const expected = Buffer.from(ACCESS_HASH, "utf8");
  return (
    candidate.length === expected.length && timingSafeEqual(candidate, expected)
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const password = body?.password;

  if (typeof password !== "string") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!matchesPassword(password)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, AUTH_COOKIE_VALUE, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/starnews",
    maxAge: 60 * 60 * 8,
  });
  return response;
}

export async function GET(req: NextRequest) {
  if (req.cookies.get(AUTH_COOKIE)?.value !== AUTH_COOKIE_VALUE) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    });
  }

  return new NextResponse(
    Buffer.from(STARNEWS_HTML_BASE64, "base64").toString("utf8"),
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    },
  );
}
