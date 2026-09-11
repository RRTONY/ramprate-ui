import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { NextRequest, NextResponse } from "next/server";
import {
  CMS_SESSION_COOKIE,
  cmsSessionCookieOptions,
  getCmsSessionToken,
  hashCmsSessionToken,
} from "@/lib/cms-auth";
import { cmsAdminSessions } from "@/lib/content/schema";

function database() {
  if (!process.env.DATABASE_URL) return null;
  return drizzle(process.env.DATABASE_URL);
}

export async function POST(request: NextRequest) {
  const token = getCmsSessionToken(request);
  if (token) {
    await database()
      ?.delete(cmsAdminSessions)
      .where(eq(cmsAdminSessions.tokenHash, hashCmsSessionToken(token)));
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(CMS_SESSION_COOKIE, "", {
    ...cmsSessionCookieOptions,
    maxAge: 0,
  });
  return response;
}
