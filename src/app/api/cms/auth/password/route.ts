import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import { getAuthorizedAdmin } from "@/lib/admin/access";
import { hashCmsPassword, verifyCmsPassword } from "@/lib/cms-auth";
import { cmsAdminMembers } from "@/lib/content/schema";

const passwordSchema = yup.object({
  currentPassword: yup.string().min(12).max(256).required(),
  newPassword: yup.string().min(12).max(256).required(),
});

function database() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for CMS password changes.");
  }
  return drizzle(process.env.DATABASE_URL);
}

export async function POST(request: NextRequest) {
  const administrator = await getAuthorizedAdmin(request);
  if (!administrator) {
    return NextResponse.json(
      { error: "RampRate CMS sign-in is required." },
      { status: 401 },
    );
  }

  const input = await passwordSchema
    .validate(await request.json().catch(() => null), {
      abortEarly: false,
      stripUnknown: true,
    })
    .catch(() => null);
  if (!input) {
    return NextResponse.json(
      {
        error:
          "Enter your current password and a new password of at least 12 characters.",
      },
      { status: 400 },
    );
  }

  const db = database();
  const [member] = await db
    .select({
      id: cmsAdminMembers.id,
      passwordHash: cmsAdminMembers.passwordHash,
    })
    .from(cmsAdminMembers)
    .where(eq(cmsAdminMembers.email, administrator.email))
    .limit(1);

  if (
    !(await verifyCmsPassword(
      input.currentPassword,
      member?.passwordHash ?? null,
    ))
  ) {
    return NextResponse.json(
      { error: "Your current password is incorrect." },
      { status: 401 },
    );
  }

  await db
    .update(cmsAdminMembers)
    .set({
      passwordHash: await hashCmsPassword(input.newPassword),
      mustChangePassword: 0,
      passwordUpdatedAt: new Date(),
    })
    .where(eq(cmsAdminMembers.id, member.id));

  return NextResponse.json({ ok: true });
}
