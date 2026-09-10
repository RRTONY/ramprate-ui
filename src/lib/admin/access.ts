function configuredAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isConfiguredAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return configuredAdminEmails().includes(email.trim().toLowerCase());
}

export function hasAdminConfiguration(): boolean {
  return configuredAdminEmails().length > 0;
}

type AdminIdentity = { email: string; name: string | null };

type FlowSession = {
  user?: { email?: string | null; name?: string | null } | null;
};

const FLOW_UPSTREAM = "https://flow.tonygreenberg.com";

export async function getAuthorizedAdmin(
  request: Request,
): Promise<AdminIdentity | null> {
  const cookie = request.headers.get("cookie");
  if (!cookie) return null;

  const response = await fetch(`${FLOW_UPSTREAM}/api/auth/session`, {
    headers: { cookie },
    cache: "no-store",
  });
  if (!response.ok) return null;

  const session = (await response.json().catch(() => null)) as FlowSession | null;
  const email = session?.user?.email?.trim().toLowerCase() ?? null;
  if (!email || !isConfiguredAdmin(email)) return null;

  return { email, name: session?.user?.name ?? null };
}
