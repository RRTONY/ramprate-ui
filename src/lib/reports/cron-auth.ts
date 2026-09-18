import { timingSafeEqual } from "crypto";

// Netlify Scheduled Functions call these routes over plain HTTP - this is
// the shared secret that stops anyone else from triggering a report/alert
// send. Same timingSafeEqual pattern as src/lib/admin/mcp-auth.ts.
export function isValidCronSecret(candidate: string | null | undefined): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;

  const a = Buffer.from(candidate ?? "");
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function isCronRequestAuthorized(req: Request): boolean {
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return isValidCronSecret(token);
}
