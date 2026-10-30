import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const ACCESS_HASH =
  "c1491330af9e55145ed0933ab2d7bb106ee342118d13e1a9172d31370a4d1111";
export const AUTH_COOKIE = "kula_proposal_auth";
export const SESSION_SECONDS = 60 * 60 * 8;

function equal(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function matchesPassword(value: unknown) {
  if (typeof value !== "string" || value.length > 256) return false;
  return equal(createHash("sha256").update(value).digest("hex"), ACCESS_HASH);
}

function signature(expires: string, secret: string) {
  return createHmac("sha256", secret)
    .update(`kula-proposal:${expires}`)
    .digest("hex");
}

export function createSession(secret: string, now = Date.now()) {
  if (!secret) throw new Error("Portal authentication is not configured");
  const expires = String(Math.floor(now / 1000) + SESSION_SECONDS);
  return `${expires}.${signature(expires, secret)}`;
}

export function validSession(
  token: string | undefined,
  secret: string,
  now = Date.now(),
) {
  if (!token || !secret) return false;
  const parts = token.split(".");
  if (parts.length !== 2 || !/^\d{10}$/.test(parts[0])) return false;
  const [expires, supplied] = parts;
  const remaining = Number(expires) - Math.floor(now / 1000);
  return (
    remaining > 0 &&
    remaining <= SESSION_SECONDS &&
    equal(supplied, signature(expires, secret))
  );
}
