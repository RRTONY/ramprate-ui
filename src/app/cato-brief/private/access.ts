import { createHash, createHmac, timingSafeEqual } from "node:crypto";
const HASH = "9ffa2f3fcf2d3b5ada8ed3a27764b12b96faa8f5c8d426e011ac39cfd3b50301";
export const AUTH_COOKIE = "cato_brief_auth";
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
    .update(`cato-brief:${expires}`)
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
