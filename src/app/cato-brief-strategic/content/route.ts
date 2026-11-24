import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  SESSION_SECONDS,
  createSession,
  matchesPassword,
  validSession,
} from "../private/access";

export const runtime = "nodejs";

const privateHeaders = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

// POST { password } → sets an 8-hour signed session cookie scoped to this page.
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

// GET ?view=mobile|desktop → the brief, only with a valid session. The brief
// comes in two layouts made by its author; the page picks one by screen width.
export async function GET(req: NextRequest) {
  if (
    !validSession(
      req.cookies.get(AUTH_COOKIE)?.value,
      process.env.PORTAL_AUTH_SECRET ?? "",
    )
  ) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: privateHeaders,
    });
  }

  const mobile = req.nextUrl.searchParams.get("view") === "mobile";
  const html = await readFile(
    mobile
      ? path.join(process.cwd(), "src/app/cato-brief-strategic/private/mobile.txt")
      : path.join(process.cwd(), "src/app/cato-brief-strategic/private/desktop.txt"),
    "utf8",
  );
  return new NextResponse(html, {
    headers: {
      ...privateHeaders,
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
