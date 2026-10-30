import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/admin/resend-client";
import {
  formatProfileText,
  sanitizeMeta,
  validateValues,
} from "@/lib/relationship-profile-fields";

// Both inboxes get every submission so one missed email never loses a profile.
const RECIPIENTS = ["admin@ramprate.com", "business@ramprate.com"];

const MAX_BODY_CHARS = 60_000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// Best-effort only: in-memory, resets on a cold start, same limitation as the
// limiter in src/app/api/ai/route.ts.
const recentHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  for (const [key, times] of recentHits) {
    const fresh = times.filter((t) => now - t < WINDOW_MS);
    if (fresh.length) recentHits.set(key, fresh);
    else recentHits.delete(key);
  }
  const hits = recentHits.get(ip) ?? [];
  if (hits.length >= MAX_PER_WINDOW) return true;
  recentHits.set(ip, [...hits, now]);
  return false;
}

function oneLine(value: unknown): string {
  return typeof value === "string"
    ? value
        .replace(/[\r\n\t]+/g, " ")
        .trim()
        .slice(0, 120)
    : "";
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  if (rawBody.length > MAX_BODY_CHARS) {
    return NextResponse.json(
      { ok: false, error: "That submission is too large." },
      { status: 413 },
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }
  const input = (parsed && typeof parsed === "object" ? parsed : {}) as Record<
    string,
    unknown
  >;

  // Hidden field a real person never fills in. Pretend success so a bot
  // learns nothing, and send nothing.
  if (typeof input.website_url === "string" && input.website_url.trim()) {
    return NextResponse.json({ ok: true });
  }

  const ip =
    req.headers.get("x-nf-client-connection-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again later." },
      { status: 429 },
    );
  }

  const values = (
    input.values && typeof input.values === "object" ? input.values : {}
  ) as Record<string, unknown>;
  const { data, errors } = validateValues(values);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const meta = {
    ...sanitizeMeta(input.meta),
    receivedAt: new Date().toISOString(),
    sourceUrl: oneLine(req.headers.get("referer")) || undefined,
  };
  const text = formatProfileText(data, meta);

  const name = oneLine(data.fullName);
  const company = oneLine(data.company);
  const subject = `New relationship profile: ${name}${company ? ` (${company})` : ""}`;

  // Each inbox is its own send, so one failing never blocks the other.
  const results = await Promise.allSettled(
    RECIPIENTS.map((to) => sendEmail({ to, subject, text })),
  );
  const failures = results.filter((r) => r.status === "rejected");
  for (const failure of failures) {
    console.error(
      "relationship-profile: notification email failed:",
      (failure as PromiseRejectedResult).reason,
    );
  }
  if (failures.length === RECIPIENTS.length) {
    return NextResponse.json(
      { ok: false, error: "We could not send your profile. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
