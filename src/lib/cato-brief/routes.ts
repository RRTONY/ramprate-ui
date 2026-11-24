import { readFile } from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  CATO_BRIEFS,
  SESSION_SECONDS,
  createSession,
  matchesPassword,
  validSession,
  type CatoBrief,
} from "./access";

// Server handlers shared by every Cato brief route (see src/app/<brief>/).

const privateHeaders = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};
const secret = () => process.env.PORTAL_AUTH_SECRET ?? "";

/** For a brief's page: is the reader signed in to this brief? */
export async function isSignedIn(brief: CatoBrief) {
  const token = (await cookies()).get(CATO_BRIEFS[brief].cookie)?.value;
  return validSession(brief, token, secret());
}

/** POST <brief>/content { password } → an 8-hour session cookie for that brief. */
export function signInHandler(brief: CatoBrief) {
  return async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);
    if (!matchesPassword(body?.password)) {
      return NextResponse.json(
        { ok: false },
        { status: 401, headers: privateHeaders },
      );
    }
    if (!secret()) {
      return NextResponse.json(
        { ok: false },
        { status: 503, headers: privateHeaders },
      );
    }
    const response = NextResponse.json(
      { ok: true },
      { headers: privateHeaders },
    );
    response.cookies.set(
      CATO_BRIEFS[brief].cookie,
      createSession(brief, secret()),
      {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: CATO_BRIEFS[brief].path,
        maxAge: SESSION_SECONDS,
      },
    );
    return response;
  };
}

// The briefs' images live in src/lib/cato-brief/media (never public/) and are
// served only to a reader signed in to the brief asking for them.
const FILE = /^[a-f0-9]{16}\.webp$/;

/** GET <brief>/media/<file> */
export function mediaHandler(brief: CatoBrief) {
  return async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ file: string }> },
  ) {
    if (
      !validSession(
        brief,
        req.cookies.get(CATO_BRIEFS[brief].cookie)?.value,
        secret(),
      )
    ) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { file } = await params;
    if (!FILE.test(file)) return new NextResponse("Not found", { status: 404 });
    const data = await readFile(
      path.join(process.cwd(), "src/lib/cato-brief/media", file),
    ).catch(() => null);
    if (!data) return new NextResponse("Not found", { status: 404 });
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": "image/webp",
        // File names are content hashes, so a signed-in browser may keep them.
        "Cache-Control": "private, max-age=28800, immutable",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
        "X-Content-Type-Options": "nosniff",
      },
    });
  };
}
