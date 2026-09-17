import { writeClient } from "@/lib/sanity/write-client";

export const KUMBAYA_STAFF_EMAIL = "team@ramprate.com";
// Private failure alerts go to the webmaster, never to the applicant or
// the shared staff inbox - matches the spec's "alert the webmaster
// privately" requirement for ClickUp/Slack delivery failures.
export const KUMBAYA_WEBMASTER_EMAIL = "web.master@ramprate.com";

// Ordered (form field name -> human label) so email/ClickUp/Sanity all
// render the complete submission in the same, readable order the form
// itself uses. Deliberately excludes the honeypot field (companyWebsite),
// venueImage (handled separately as an uploaded asset), and the
// score/recommendation/breakdown/prototype/consent/sourceUrl fields, which
// are handled as their own named values rather than generic rows.
export const KUMBAYA_FIELD_LABELS: [string, string][] = [
  ["event", "Event name"],
  ["date", "Event date"],
  ["deadline", "Decision deadline"],
  ["venue", "Location / venue"],
  ["eventLink", "Event link"],
  ["venueLink", "Venue link"],
  ["organizer", "Organizer / organization"],
  ["contact", "Organizer name + email (as submitted)"],
  ["attendance", "Expected attendance"],
  ["audience", "Audience description"],
  ["eventStage", "Event stage"],
  ["priority", "Why this matters now"],
  ["people", "People expected"],
  ["relationship", "Referral source"],
  ["targetSponsors", "Target sponsors"],
  ["existingSponsors", "Existing sponsors"],
  ["investmentLevel", "Investment level"],
  ["asks", "Requested presence"],
  ["ask", "What would make this a win"],
  ["units", "Portfolio categories"],
  ["fit", "Portfolio fit rationale"],
  ["visibility", "Visibility offered"],
  ["eventBudget", "Total event budget"],
  ["budget", "Requested investment"],
  ["contribution", "Organizer contribution capability"],
  ["risks", "Sensitivities / conflicts disclosure"],
  ["nameSource", "Name collection method"],
  ["contactRights", "Contact and mailing rights"],
  ["profilePrep", "Profile preparation status"],
  ["topThree", "Top three desired connections"],
  ["connectionFormat", "Connection format preference"],
  ["followupPermission", "Follow-through permission"],
  ["crmFocus", "CRM focus"],
  ["emailTiming", "Sponsor email timing"],
  ["marketingInventory", "Co-marketing inventory"],
  ["timeSlot", "Available time slot"],
  ["publishingPartnership", "Publishing partnership request"],
  ["articleGoal", "Article goal"],
  ["distributionPlan", "Distribution plan"],
  ["inviteAsset", "Partyful / Luma / Eventbrite status"],
  ["inviteLink", "RSVP link"],
  ["targetAttendees", "Target attendees"],
  ["promotionPlan", "Promotion and PR plan"],
  ["promotionChannels", "Promotion channels / tools"],
  ["journalists", "Journalists and media partners"],
  ["mediaAssets", "Media assets inventory"],
  ["promotionOwner", "Promotion owner"],
  ["promotionTiming", "Promotion timing"],
  ["practicalSupport", "Practical support requested"],
  ["practicalDetails", "Practical support details"],
  ["timeCommitment", "Time commitment requested"],
  ["crmOwner", "Follow-up owner"],
  ["connectionEngine", "Wants Kumbaya to help match top-three connections"],
  ["risks2", "Additional disclosures"],
  ["name", "Submitter name"],
  ["email", "Submitter email"],
];

// Fields the prototype's own client-side `valid(3)` check already requires
// - re-validated here since the client can never be trusted as the only
// gate. "consent" corresponds to the truth checkbox.
const REQUIRED_FIELDS = ["event", "date", "venue", "contact", "priority"];

export type KumbayaFieldValue = string | string[] | undefined;
export type KumbayaFormData = Record<string, KumbayaFieldValue>;

export function validateRequiredFields(data: KumbayaFormData): string[] {
  const missing: string[] = [];
  for (const field of REQUIRED_FIELDS) {
    const v = data[field];
    if (!v || (typeof v === "string" && !v.trim())) missing.push(field);
  }
  if (data.consent !== "true") missing.push("consent");
  return missing;
}

export function fieldToText(v: KumbayaFieldValue): string {
  if (!v) return "";
  return Array.isArray(v) ? v.join(", ") : String(v);
}

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

// The form only has one free-text "name · email · phone" field for the
// organizer, not a dedicated email input - this is a best-effort
// extraction for the ClickUp "Organizer email" custom field, never the
// field used to actually contact anyone.
export function extractEmail(text: string): string {
  const match = text.match(EMAIL_RE);
  return match ? match[0] : "";
}

export function buildSubmissionSummary(data: KumbayaFormData): string {
  const lines: string[] = [];
  for (const [key, label] of KUMBAYA_FIELD_LABELS) {
    const text = fieldToText(data[key]);
    if (text) lines.push(`${label}: ${text}`);
  }
  return lines.join("\n");
}

export function isWithinSevenDays(dateStr: string): boolean {
  const eventDate = new Date(dateStr);
  if (Number.isNaN(eventDate.getTime())) return false;
  const diffMs = eventDate.getTime() - Date.now();
  return diffMs >= 0 && diffMs <= 7 * 24 * 60 * 60 * 1000;
}

// Best-effort duplicate flag, not a hard block - the spec asks for
// duplicates to be "prevented or clearly marked", and silently rejecting a
// resubmission (e.g. after a first attempt appeared to fail) would be
// worse than letting a human notice the flag.
export async function findRecentDuplicate(
  eventName: string,
  eventDate: string,
  organizerContact: string,
): Promise<string | null> {
  if (!eventName || !eventDate || !organizerContact) return null;
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const existing = await writeClient.fetch<{ submissionId: string } | null>(
    `*[_type == "kumbayaSubmission" && eventName == $eventName && eventDate == $eventDate && organizerContact == $organizerContact && receivedAt > $since][0]{submissionId}`,
    { eventName, eventDate, organizerContact, since },
  );
  return existing?.submissionId ?? null;
}

// In-memory sliding-window limiter, keyed by IP - best-effort only, resets
// on cold start, same documented limitation as the existing limiter in
// src/app/api/ai/route.ts and the artifact-admin login limiter. This stack
// has no shared/distributed store for a stronger guarantee.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 8;
const submissionTimestamps = new Map<string, number[]>();

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const existing = (submissionTimestamps.get(ip) ?? []).filter(
    (t) => t > cutoff,
  );
  if (existing.length >= RATE_LIMIT_MAX) {
    submissionTimestamps.set(ip, existing);
    return true;
  }
  existing.push(now);
  submissionTimestamps.set(ip, existing);
  return false;
}
