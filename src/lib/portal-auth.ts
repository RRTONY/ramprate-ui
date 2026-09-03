import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const PORTAL_IDS = [
  "attorney",
  "henry-jannol",
  "josh-bykowski",
  "legal-master",
] as const;

export type PortalId = (typeof PORTAL_IDS)[number];

const PASSWORD_ENV_VAR: Record<PortalId, string> = {
  attorney: "PORTAL_PASSWORD_ATTORNEY",
  "henry-jannol": "PORTAL_PASSWORD_HENRY_JANNOL",
  "josh-bykowski": "PORTAL_PASSWORD_JOSH_BYKOWSKI",
  "legal-master": "PORTAL_PASSWORD_LEGAL_MASTER",
};

function getAuthSecret(): string {
  const secret = process.env.PORTAL_AUTH_SECRET;
  if (!secret) {
    throw new Error("PORTAL_AUTH_SECRET is not set");
  }
  return secret;
}

function sign(portalId: PortalId): string {
  return createHmac("sha256", getAuthSecret()).update(portalId).digest("hex");
}

export function cookieNameFor(portalId: PortalId): string {
  return `portal_auth_${portalId}`;
}

// Constant-time comparison so a failed attempt can't be used to learn the
// password one byte at a time via response-timing differences.
export function verifyPortalPassword(
  portalId: PortalId,
  attempt: string,
): boolean {
  const expected = process.env[PASSWORD_ENV_VAR[portalId]];
  if (!expected) return false;

  const a = Buffer.from(attempt);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function portalCookieValue(portalId: PortalId): string {
  return sign(portalId);
}

export async function isPortalUnlocked(portalId: PortalId): Promise<boolean> {
  const store = await cookies();
  const value = store.get(cookieNameFor(portalId))?.value;
  if (!value) return false;
  return value === sign(portalId);
}
