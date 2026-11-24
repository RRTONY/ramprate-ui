import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// Password access for the Cato Digital financing briefs (Alex Veytsel's
// briefs, converted to React in src/components/cato-brief). Both briefs use
// the same password; each has its own page, cookie and session signature, so
// signing in to one never opens the other.
export const CATO_BRIEFS = {
  strategic: { path: "/cato-brief-strategic", cookie: "cato_strategic_auth" },
  original: { path: "/cato-digital-financing", cookie: "cato_original_auth" },
} as const;
export type CatoBrief = keyof typeof CATO_BRIEFS;

// SHA-256 of the briefs' access password. Only the hash lives in the repo,
// never the password itself.
const HASH = "7f0d25d71c4a205b768e91d2a5ebceaa7bbd30867d892e1bd591be8bcdb8674b";

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

// The scope keeps each brief's sessions separate. "cato-brief-strategic"
// is the strategic brief's original scope, so its live sessions stay valid.
function signature(brief: CatoBrief, expires: string, secret: string) {
  const scope = CATO_BRIEFS[brief].path.slice(1);
  return createHmac("sha256", secret)
    .update(`${scope}:${expires}`)
    .digest("hex");
}

export function createSession(
  brief: CatoBrief,
  secret: string,
  now = Date.now(),
) {
  if (!secret) throw new Error("Portal auth not configured");
  const expires = String(Math.floor(now / 1000) + SESSION_SECONDS);
  return `${expires}.${signature(brief, expires, secret)}`;
}

export function validSession(
  brief: CatoBrief,
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
    equal(supplied, signature(brief, expires, secret))
  );
}
