import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Same mechanism as the site's existing portal-password pages
// (src/lib/portal-auth.ts): an HMAC-signed cookie rather than a random
// session token, keyed by a server-only secret. Kept as its own small
// module instead of extending PORTAL_IDS because this uses its own
// explicitly-named env var (ARTIFACT_ADMIN_PASSWORD) rather than the
// PORTAL_PASSWORD_* convention. Reuses PORTAL_AUTH_SECRET for signing -
// that secret already exists for exactly this purpose, no need for a
// second one.

const COOKIE_NAME = "artifact_admin_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days, matches the portal cookies

function getAuthSecret(): string {
  const secret = process.env.PORTAL_AUTH_SECRET;
  if (!secret) throw new Error("PORTAL_AUTH_SECRET is not set");
  return secret;
}

function sign(): string {
  return createHmac("sha256", getAuthSecret())
    .update("artifact-admin")
    .digest("hex");
}

// Constant-time comparison so a failed attempt can't be used to learn the
// password one byte at a time via response-timing differences.
export function verifyArtifactAdminPassword(attempt: string): boolean {
  const expected = process.env.ARTIFACT_ADMIN_PASSWORD;
  if (!expected) return false;

  const a = Buffer.from(attempt);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function artifactAdminCookieName(): string {
  return COOKIE_NAME;
}

export function artifactAdminCookieValue(): string {
  return sign();
}

export function artifactAdminCookieMaxAge(): number {
  return COOKIE_MAX_AGE;
}

export async function isArtifactAdminUnlocked(): Promise<boolean> {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (!value) return false;
  return value === sign();
}

// Every mutating API route calls this first - an unauthenticated request
// must never be able to reach the Sanity write client by hitting the API
// directly, regardless of what the admin UI itself does or doesn't show.
export async function requireArtifactAdmin(): Promise<NextResponse | null> {
  const unlocked = await isArtifactAdminUnlocked();
  if (!unlocked) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }
  return null;
}

// Best-effort, in-memory brute-force throttle. Resets on every cold start
// (Netlify serverless functions have no shared state between invocations
// without an external store like Redis, which isn't part of this stack) -
// same documented limitation as the existing rate limiter in
// src/app/api/ai/route.ts. Good enough to stop a casual script kiddie
// hammering the endpoint in one warm instance; not a substitute for a real
// distributed rate limiter if this ever needs stronger guarantees.
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS_PER_WINDOW = 8;
const attemptsByIp = new Map<string, number[]>();

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const attempts = (attemptsByIp.get(ip) || []).filter(
    (t) => now - t < ATTEMPT_WINDOW_MS,
  );
  attemptsByIp.set(ip, attempts);
  return attempts.length >= MAX_ATTEMPTS_PER_WINDOW;
}

export function recordAttempt(ip: string): void {
  const attempts = attemptsByIp.get(ip) || [];
  attempts.push(Date.now());
  attemptsByIp.set(ip, attempts);
}
