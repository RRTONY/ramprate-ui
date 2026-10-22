import { createHash, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

const ACCESS_HASH =
  "49c044226da7aadaf128a3ec026710367941ea477e7e613bd9e6cb615ddf18c4";
const AUTH_COOKIE = "starnews_proposal_auth";
const AUTH_COOKIE_VALUE =
  "923c960d503099b3c93a48bf4daaa12a1f8b4b2c40240ed54a6debf735640140";
const CHUNK_COUNT = 27;

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

function chunkPath(index: number) {
  return path.join(
    process.cwd(),
    "src",
    "app",
    "starnews-proposal",
    "private",
    "chunks",
    `part-${String(index).padStart(3, "0")}.txt`,
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
    path: "/starnews-proposal",
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

  const chunks = await Promise.all(
    Array.from({ length: CHUNK_COUNT }, (_, index) =>
      readFile(chunkPath(index), "utf8"),
    ),
  );

  return new NextResponse(chunks.join(""), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}
