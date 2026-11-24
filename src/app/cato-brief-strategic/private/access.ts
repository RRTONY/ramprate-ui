import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// SHA-256 of the strategic brief's access password (the same password as the
// encrypted page at /cato-digital-financing-strategic.html). Only the hash
// lives in the repo, never the password itself.
const HASH = "7f0d25d71c4a205b768e91d2a5ebceaa7bbd30867d892e1bd591be8bcdb8674b";

export const AUTH_COOKIE = "cato_strategic_auth";
export const SESSION_SECONDS = 28800;

function equal(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function matchesPassword(value: unknown) {
  return (
    typeof value === "string" &&
    value.length <= 256 &&
    equal(createHash("sha256").update(value).digest("hex"), HASH)
  );
}

function signature(expires: string, secret: string) {
  return createHmac("sha256", secret)
    .update(`cato-brief-strategic:${expires}`)
    .digest("hex");
}

export function createSession(secret: string, now = Date.now()) {
  if (!secret) throw new Error("Portal auth not configured");
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
