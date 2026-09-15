import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/admin/resend-client";
import { createClickupTask } from "@/lib/admin/clickup-client";

// Shared inbox, not a named individual - a Champion's introduction shouldn't
// depend on one person seeing one email. Same address as the public
// hello@ramprate.com contact link elsewhere on the Champions page.
const STAFF_NOTIFICATION_EMAIL = "hello@ramprate.com";

export async function POST(req: NextRequest) {
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (!scriptUrl) {
    return NextResponse.json(
      { ok: false, error: "Champion intake is not configured." },
      { status: 500 },
    );
  }

  const body = await req.json();
  const sourceUrl = req.headers.get("referer") || body.sourceUrl || "";
  const formData: Record<string, unknown> = body.formData || {};

  // A Champion's claim on an introduction rests on when it arrived, so the
  // timestamp is stamped server-side on receipt rather than trusted from the
  // client, where it could be absent, skewed, or edited. This exact value -
  // not the Sheet row's own write time or ClickUp's own task-creation time,
  // both of which can lag behind by network delay - is the authoritative
  // claim-time, so it's threaded through into the ClickUp record and the
  // applicant's own confirmation email below as a durable, independent copy.
  const receivedAt = new Date().toISOString();

  const payload = {
    formData: { ...formData, receivedAt },
    files: [],
    sourceUrl,
    projectName: "Champions - RampRate",
  };

  const res = await fetch(scriptUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return NextResponse.json(
      { ok: false, error: "Submission failed." },
      { status: 502 },
    );
  }

  const name = typeof formData.name === "string" ? formData.name : "";
  const email = typeof formData.email === "string" ? formData.email : "";
  const company = typeof formData.company === "string" ? formData.company : "";
  const linkedin =
    typeof formData.linkedin === "string" ? formData.linkedin : "";
  const practices = Array.isArray(formData.practices)
    ? (formData.practices as unknown[]).filter(
        (p): p is string => typeof p === "string",
      )
    : [];
  const signer = typeof formData.signer === "string" ? formData.signer : "";
  const notes = typeof formData.notes === "string" ? formData.notes : "";

  // Everything below is best-effort - the Sheet write above is the record of
  // truth for the submission itself, and a Resend or ClickUp hiccup must
  // never make an already-successful submission look like it failed to the
  // applicant. Logged (not just swallowed) so a real failure is visible in
  // Netlify's function logs instead of looking identical to success - the
  // exact silent-failure pattern that caused problems elsewhere in this
  // project when nothing was logged at all.
  if (email) {
    try {
      await sendEmail({
        to: email,
        from: "RampRate <hello@ramprate.com>",
        subject: "Thanks for applying to become a RampRate Champion",
        text:
          `Hi ${name || "there"},\n\n` +
          `Thanks for your interest in becoming a RampRate Champion${company ? ` on behalf of ${company}` : ""}. ` +
          `We've received your details, timestamped at ${receivedAt}.\n\n` +
          `One step left: sign the Champion Agreement (already signed on our side) to complete your application.\n\n` +
          `Questions in the meantime? Just reply to this email or reach us at hello@ramprate.com.\n\n` +
          `Best,\nThe RampRate Team`,
      });
    } catch (err) {
      console.error(
        "champions-intake: applicant confirmation email failed:",
        err,
      );
    }
  }

  try {
    await sendEmail({
      to: STAFF_NOTIFICATION_EMAIL,
      subject: `New Champion application${company ? `: ${company}` : ""}`,
      text: [
        "A new Champion application just came in.",
        "",
        `Name: ${name || "Unknown"}`,
        `Email: ${email || "Unknown"}`,
        `Company: ${company || "Unknown"}`,
        `LinkedIn: ${linkedin || "Not provided"}`,
        `Could introduce: ${practices.length ? practices.join(", ") : "None selected"}`,
        `Signer (if different): ${signer || "Applicant is signing"}`,
        `Notes: ${notes || "None"}`,
        `Received at: ${receivedAt}`,
      ].join("\n"),
    });
  } catch (err) {
    console.error(
      "champions-intake: staff notification email failed:",
      err,
    );
  }

  try {
    await createClickupTask({
      name: `Champion application: ${name || "Unknown"}${company ? ` (${company})` : ""}`,
      description: [
        `Email: ${email || "Unknown"}`,
        `LinkedIn: ${linkedin || "Not provided"}`,
        `Could introduce: ${practices.length ? practices.join(", ") : "None selected"}`,
        `Signer (if different): ${signer || "Applicant is signing"}`,
        `Notes: ${notes || "None"}`,
        `Received at: ${receivedAt}`,
        `Source: ${sourceUrl || "Unknown"}`,
      ].join("\n"),
    });
  } catch (err) {
    console.error("champions-intake: ClickUp task creation failed:", err);
  }

  return NextResponse.json({ ok: true, receivedAt });
}
