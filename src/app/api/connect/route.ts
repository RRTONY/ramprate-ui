import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/admin/resend-client";

const allowedIntents = ["project", "introduction", "partnership", "other"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const text = (value: unknown, limit = 2000) =>
  typeof value === "string" ? value.trim().slice(0, limit) : "";
const list = (value: unknown) =>
  Array.isArray(value)
    ? value
        .filter((v): v is string => typeof v === "string")
        .slice(0, 15)
        .map((v) => v.slice(0, 200))
    : [];

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    if (Number(req.headers.get("content-length") || 0) > 25000)
      return NextResponse.json({ ok: false }, { status: 413 });
    body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error("invalid");
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid form data." },
      { status: 400 },
    );
  }
  const name = text(body.name, 150);
  const email = text(body.email, 250);
  const company = text(body.company, 200);
  const overview = text(body.overview, 5000);
  const intent = text(body.intent, 30);
  const details =
    body.details &&
    typeof body.details === "object" &&
    !Array.isArray(body.details)
      ? (body.details as Record<string, unknown>)
      : {};
  const introduced =
    details.introduced_person && typeof details.introduced_person === "object"
      ? (details.introduced_person as Record<string, unknown>)
      : {};
  if (
    !name ||
    !emailPattern.test(email) ||
    !company ||
    !overview ||
    !allowedIntents.includes(intent) ||
    body.consent !== true ||
    (intent === "introduction" && !text(introduced.name, 150))
  ) {
    return NextResponse.json(
      { ok: false, error: "Please complete all required fields." },
      { status: 400 },
    );
  }
  const fields = [
    ["Inquiry type", intent],
    ["Name", name],
    ["Email", email],
    ["Company or project", company],
    ["Role", text(body.role)],
    ["Phone", text(body.phone)],
    ["Overview", overview],
    ["Needs", list(body.needs).join(", ")],
    ["Timing", text(body.timing)],
    ["How they heard about us", text(body.heard_from)],
    ["Event", text(body.event_tag)],
    ["Preferred contact", text(body.contact_preference)],
    ["Project stage", text(details.stage)],
    ["Desired outcome", text(details.desired_outcome)],
    ["Introduced person's name", text(introduced.name)],
    ["Introduced person's company", text(introduced.company)],
    ["Introduced person's contact", text(introduced.contact)],
    ["How they know them", text(introduced.relationship)],
    ["Introduced person knows", text(details.person_knows)],
    ["Partnership types", list(details.partnership_types).join(", ")],
    ["Previously worked with RampRate", text(details.worked_with_us_before)],
    ["RampRate contact", text(details.rampate_contact)],
    ["Requested contact", text(details.wants_to_reach)],
    ["Received at", new Date().toISOString()],
  ].filter(([, value]) => value);
  const message = fields.map(([key, value]) => key + ": " + value).join("\n\n");
  try {
    await Promise.all(
      ["admin@ramprate.com", "hello@ramprate.com"].map((to) =>
        sendEmail({
          to,
          subject:
            "New RampRate Connect Inquiry - " +
            name.replace(/[\r\n]/g, " ") +
            " - " +
            intent,
          text: message,
        }),
      ),
    );
  } catch (err) {
    console.error("connect: email delivery failed", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "We could not send your inquiry. Please email hello@ramprate.com.",
      },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
