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
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!matchesPassword(body?.password))
    return NextResponse.json(
      { ok: false },
      { status: 401, headers: privateHeaders },
    );
  const secret = process.env.PORTAL_AUTH_SECRET;
  if (!secret)
    return NextResponse.json(
      { ok: false },
      { status: 503, headers: privateHeaders },
    );
  const response = NextResponse.json({ ok: true }, { headers: privateHeaders });
  response.cookies.set(AUTH_COOKIE, createSession(secret), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/cato-brief",
    maxAge: SESSION_SECONDS,
  });
  return response;
}
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
  const pdf = await readFile(
    path.join(process.cwd(), "src/app/cato-brief/private/brief.pdf"),
  );
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      ...privateHeaders,
      "Content-Type": "application/pdf",
      "Content-Disposition":
        'inline; filename="Cato-Digital-GPU-Financing-Brief.pdf"',
      "X-Content-Type-Options": "nosniff",
    },
  });
}
