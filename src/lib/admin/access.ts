import { and, eq, gt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { hashCmsSessionToken, getCmsSessionToken } from "@/lib/cms-auth";
import { cmsAdminMembers, cmsAdminSessions } from "@/lib/content/schema";

export type CmsAdminRole = "owner" | "admin" | "editor";

export type AdminIdentity = {
  email: string;
  name: string | null;
  role: CmsAdminRole;
  mustChangePassword: boolean;
};

export function normalizeCmsEmail(
  email: string | null | undefined,
): string | null {
  const normalized = email?.trim().toLowerCase();
  return normalized || null;
}

export function isActiveCmsMember(
  member: { email: string; role: CmsAdminRole; isActive: number } | undefined,
  email: string | null | undefined,
): member is { email: string; role: CmsAdminRole; isActive: number } {
  const normalized = normalizeCmsEmail(email);
  return Boolean(
    member &&
    normalized &&
    member.email === normalized &&
    member.isActive === 1,
  );
}

function database() {
  if (!process.env.DATABASE_URL) return null;
  return drizzle(process.env.DATABASE_URL);
}

export async function getAuthorizedAdmin(
  request: Request,
): Promise<AdminIdentity | null> {
  const token = getCmsSessionToken(request);
  const db = database();
  if (!token || !db) return null;

  const [session] = await db
    .select({
      email: cmsAdminMembers.email,
      role: cmsAdminMembers.role,
      isActive: cmsAdminMembers.isActive,
      mustChangePassword: cmsAdminMembers.mustChangePassword,
    })
    .from(cmsAdminSessions)
    .innerJoin(
      cmsAdminMembers,
      eq(cmsAdminSessions.memberId, cmsAdminMembers.id),
    )
    .where(
      and(
        eq(cmsAdminSessions.tokenHash, hashCmsSessionToken(token)),
        gt(cmsAdminSessions.expiresAt, new Date()),
        eq(cmsAdminMembers.isActive, 1),
      ),
    )
    .limit(1);

  if (!session) return null;

  return {
    email: session.email,
    name: null,
    role: session.role,
    mustChangePassword: session.mustChangePassword === 1,
  };
}
