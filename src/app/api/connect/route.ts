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
  const contentType = req.headers
    .get("content-type")
    ?.split(";")[0]
    .trim()
    .toLowerCase();
  if (contentType !== "application/json") {
    return new Response(
      '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Connect with RampRate</title><p>This form needs JavaScript. Please email <a href="mailto:hello@ramprate.com">hello@ramprate.com</a> instead.</p><a href="/connect">Return to Connect</a></html>',
      {
        status: 400,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
        },
      },
    );
  }
  const maxBodyBytes = 20 * 1024;
  const tooLarge = () =>
    NextResponse.json(
      { ok: false, error: "Form data must be 20 KB or smaller." },
      { status: 413 },
    );
  if (Number(req.headers.get("content-length") || 0) > maxBodyBytes)
    return tooLarge();
  let body: Record<string, unknown>;
  try {
    const reader = req.body?.getReader();
    if (!reader) throw new Error("empty");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBodyBytes) {
        await reader.cancel();
        return tooLarge();
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    body = JSON.parse(new TextDecoder().decode(bytes));
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error("invalid");
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid form data." },
      { status: 400 },
    );
  }
  if (body.website) return NextResponse.json({ ok: true });
  const name = text(body.name, 100);
  const email = text(body.email, 254);
  const company = text(body.company, 150);
  const overview = text(body.overview, 2000);
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
  const limitedFields: [string, unknown, number][] = [
    ["name", body.name, 100],
    ["email", body.email, 254],
    ["company", body.company, 150],
    ["role", body.role, 100],
    ["phone", body.phone, 30],
    ["overview", body.overview, 2000],
    ["intro_name", introduced.name, 100],
    ["intro_org", introduced.company, 150],
    ["intro_contact", introduced.contact, 150],
    ["intro_how", introduced.relationship, 300],
    ["outcome", details.desired_outcome, 300],
    ["prior_who", details.rampate_contact, 150],
    ["reach", details.wants_to_reach, 300],
    ["heard", body.heard_from, 200],
  ];
  for (const [field, value, limit] of limitedFields) {
    if (typeof value === "string" && value.length > limit) {
      return NextResponse.json(
        { ok: false, error: `${field} must be ${limit} characters or fewer.` },
        { status: 400 },
      );
    }
  }
  const phone = text(body.phone);
  if (
    phone &&
    (!/^\+?[0-9 .()\-]+$/.test(phone) ||
      !/^[0-9]{7,15}$/.test(phone.replace(/[ .()\-]/g, "").replace(/^\+/, "")))
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please enter a valid phone number, or leave it blank.",
      },
      { status: 400 },
    );
  }
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
