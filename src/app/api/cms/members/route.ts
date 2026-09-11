import { and, count, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import {
  getAuthorizedAdmin,
  normalizeCmsEmail,
  type CmsAdminRole,
} from "@/lib/admin/access";
import { cmsAdminMembers } from "@/lib/content/schema";

const roles = ["owner", "admin", "editor"] as const;

const createSchema = yup.object({
  email: yup.string().email().max(320).required(),
  role: yup.mixed<CmsAdminRole>().oneOf(roles).default("editor"),
});

const updateSchema = yup.object({
  id: yup.number().integer().positive().required(),
  role: yup.mixed<CmsAdminRole>().oneOf(roles).optional(),
  isActive: yup.boolean().optional(),
});

function database() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for CMS member management.");
  }
  return drizzle(process.env.DATABASE_URL);
}

async function owner(request: NextRequest) {
  const administrator = await getAuthorizedAdmin(request);
  return administrator?.role === "owner" ? administrator : null;
}

async function validate<T>(schema: yup.Schema<T>, input: unknown) {
  try {
    return await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });
  } catch {
    return null;
  }
}

async function canDemoteOrDeactivateOwner(
  id: number,
  role: CmsAdminRole,
  isActive: number,
) {
  if (role !== "owner" || isActive !== 1) return true;
  const db = database();
  const [owners] = await db
    .select({ total: count() })
    .from(cmsAdminMembers)
    .where(
      and(eq(cmsAdminMembers.role, "owner"), eq(cmsAdminMembers.isActive, 1)),
    );
  return Number(owners?.total ?? 0) > 1;
}

export async function GET(request: NextRequest) {
  const administrator = await getAuthorizedAdmin(request);
  if (!administrator) {
    return NextResponse.json(
      { error: "CMS access is required." },
      { status: 403 },
    );
  }

  const items = await database()
    .select()
    .from(cmsAdminMembers)
    .orderBy(cmsAdminMembers.email);
  return NextResponse.json({ items, currentRole: administrator.role });
}

export async function POST(request: NextRequest) {
  const administrator = await owner(request);
  if (!administrator) {
    return NextResponse.json(
      { error: "CMS owner access is required." },
      { status: 403 },
    );
  }

  const value = await validate(
    createSchema,
    await request.json().catch(() => null),
  );
  const email = normalizeCmsEmail(value?.email);
  if (!value || !email) {
    return NextResponse.json(
      { error: "A valid member email is required." },
      { status: 400 },
    );
  }

  await database()
    .insert(cmsAdminMembers)
    .values({
      email,
      role: value.role,
      isActive: 1,
      invitedByEmail: administrator.email,
    })
    .onDuplicateKeyUpdate({
      set: {
        role: value.role,
        isActive: 1,
        invitedByEmail: administrator.email,
      },
    });

  return NextResponse.json({ ok: true, email });
}

export async function PATCH(request: NextRequest) {
  const administrator = await owner(request);
  if (!administrator) {
    return NextResponse.json(
      { error: "CMS owner access is required." },
      { status: 403 },
    );
  }

  const value = await validate(
    updateSchema,
    await request.json().catch(() => null),
  );
  if (!value) {
    return NextResponse.json(
      { error: "Invalid CMS member update." },
      { status: 400 },
    );
  }

  const db = database();
  const [member] = await db
    .select()
    .from(cmsAdminMembers)
    .where(eq(cmsAdminMembers.id, value.id))
    .limit(1);
  if (!member) {
    return NextResponse.json(
      { error: "CMS member not found." },
      { status: 404 },
    );
  }

  const nextRole = value.role ?? member.role;
  const nextActive =
    value.isActive === undefined ? member.isActive : Number(value.isActive);
  const changingOwner =
    member.role === "owner" &&
    member.isActive === 1 &&
    (nextRole !== "owner" || nextActive !== 1);
  if (
    changingOwner &&
    !(await canDemoteOrDeactivateOwner(member.id, member.role, member.isActive))
  ) {
    return NextResponse.json(
      { error: "Keep at least one active CMS owner." },
      { status: 400 },
    );
  }

  await db
    .update(cmsAdminMembers)
    .set({ role: nextRole, isActive: nextActive })
    .where(eq(cmsAdminMembers.id, member.id));
  return NextResponse.json({ ok: true });
}
