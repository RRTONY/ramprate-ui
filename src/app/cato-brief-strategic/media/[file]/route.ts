import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, validSession } from "../../private/access";

export const runtime = "nodejs";

// The brief's images, only for a signed-in reader. They live in ../private
// (not public/) so they can't be opened without the password.
const FILE = /^[a-f0-9]{16}\.webp$/;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ file: string }> },
) {
  if (
    !validSession(
      req.cookies.get(AUTH_COOKIE)?.value,
      process.env.PORTAL_AUTH_SECRET ?? "",
    )
  ) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { file } = await params;
  if (!FILE.test(file)) return new NextResponse("Not found", { status: 404 });

  const data = await readFile(
    path.join(
      process.cwd(),
      "src/app/cato-brief-strategic/private/media",
      file,
    ),
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
}
