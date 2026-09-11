import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { cmsAdminMembers } from "@/lib/content/schema";

export type CmsAdminRole = "owner" | "admin" | "editor";

export type AdminIdentity = {
  email: string;
  name: string | null;
  role: CmsAdminRole;
};

type FlowSession = {
  user?: { email?: string | null; name?: string | null } | null;
};

const FLOW_UPSTREAM = "https://flow.tonygreenberg.com";

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
  const cookie = request.headers.get("cookie");
  if (!cookie) return null;

  const response = await fetch(`${FLOW_UPSTREAM}/api/auth/session`, {
    headers: { cookie },
    cache: "no-store",
  }).catch(() => null);
  if (!response?.ok) return null;

  const session = (await response
    .json()
    .catch(() => null)) as FlowSession | null;
  const email = normalizeCmsEmail(session?.user?.email);
  const db = database();
  if (!email || !db) return null;

  const [member] = await db
    .select({
      email: cmsAdminMembers.email,
      role: cmsAdminMembers.role,
      isActive: cmsAdminMembers.isActive,
    })
    .from(cmsAdminMembers)
    .where(eq(cmsAdminMembers.email, email))
    .limit(1);

  if (!isActiveCmsMember(member, email)) return null;

  return {
    email,
    name: session?.user?.name ?? null,
    role: member.role,
  };
}
