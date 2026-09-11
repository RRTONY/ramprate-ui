import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import {
  CMS_SESSION_COOKIE,
  CMS_SESSION_MAX_AGE_SECONDS,
  cmsSessionCookieOptions,
  createCmsSessionToken,
  hashCmsSessionToken,
  verifyCmsPassword,
} from "@/lib/cms-auth";
import { normalizeCmsEmail } from "@/lib/admin/access";
import { cmsAdminMembers, cmsAdminSessions } from "@/lib/content/schema";

const loginSchema = yup.object({
  email: yup.string().email().max(320).required(),
  password: yup.string().min(12).max(256).required(),
});

function database() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for CMS login.");
  }
  return drizzle(process.env.DATABASE_URL);
}

export async function POST(request: NextRequest) {
  const input = await loginSchema
    .validate(await request.json().catch(() => null), {
      abortEarly: false,
      stripUnknown: true,
    })
    .catch(() => null);
  const email = normalizeCmsEmail(input?.email);

  if (!input || !email) {
    return NextResponse.json(
      { error: "Enter a valid email address and password." },
      { status: 400 },
    );
  }

  const db = database();
  const [member] = await db
    .select({
      id: cmsAdminMembers.id,
      email: cmsAdminMembers.email,
      role: cmsAdminMembers.role,
      isActive: cmsAdminMembers.isActive,
      passwordHash: cmsAdminMembers.passwordHash,
      mustChangePassword: cmsAdminMembers.mustChangePassword,
    })
    .from(cmsAdminMembers)
    .where(eq(cmsAdminMembers.email, email))
    .limit(1);

  const allowed =
    member?.isActive === 1 &&
    (await verifyCmsPassword(input.password, member?.passwordHash ?? null));
  if (!member || !allowed) {
    return NextResponse.json(
      { error: "The email address or password is incorrect." },
      { status: 401 },
    );
  }

  const token = createCmsSessionToken();
  const expiresAt = new Date(Date.now() + CMS_SESSION_MAX_AGE_SECONDS * 1_000);
  await db.insert(cmsAdminSessions).values({
    memberId: member.id,
    tokenHash: hashCmsSessionToken(token),
    expiresAt,
  });

  const response = NextResponse.json({
    member: {
      email: member.email,
      role: member.role,
      mustChangePassword: member.mustChangePassword === 1,
    },
  });
  response.cookies.set(CMS_SESSION_COOKIE, token, cmsSessionCookieOptions);
  return response;
}
