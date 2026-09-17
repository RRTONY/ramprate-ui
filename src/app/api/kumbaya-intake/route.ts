import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { writeClient } from "@/lib/sanity/write-client";
import { sendEmail } from "@/lib/admin/resend-client";
import { createClickupTask } from "@/lib/admin/clickup-client";
import { sendSlackMessage } from "@/lib/admin/slack-client";
import {
  KUMBAYA_STAFF_EMAIL,
  KUMBAYA_WEBMASTER_EMAIL,
  buildSubmissionSummary,
  extractEmail,
  fieldToText,
  findRecentDuplicate,
  isRateLimited,
  isWithinSevenDays,
  validateRequiredFields,
  type KumbayaFormData,
} from "@/lib/kumbaya-intake";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch {
    await new Promise((r) => setTimeout(r, 800));
    return fn();
  }
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again later." },
      { status: 429 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed submission." },
      { status: 400 },
    );
  }

  const rawPayload = form.get("payload");
  if (typeof rawPayload !== "string") {
    return NextResponse.json(
      { ok: false, error: "Missing submission data." },
      { status: 400 },
    );
  }

  let data: KumbayaFormData;
  try {
    data = JSON.parse(rawPayload);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed submission data." },
      { status: 400 },
    );
  }

  // Silently accept-and-drop bot traffic that fills the hidden honeypot
  // field, rather than a 4xx that would tip off a retrying bot.
  if (fieldToText(data.companyWebsite)) {
    console.warn("kumbaya-intake: honeypot triggered, dropping submission");
    return NextResponse.json({ ok: true });
  }

  const missing = validateRequiredFields(data);
  if (missing.length) {
    return NextResponse.json(
      { ok: false, error: `Missing required field(s): ${missing.join(", ")}` },
      { status: 400 },
    );
  }

  const eventName = fieldToText(data.event);
  const eventDate = fieldToText(data.date);
  const location = fieldToText(data.venue);
  const organizerName = fieldToText(data.organizer);
  const organizerContact = fieldToText(data.contact);
  const organizerEmail =
    extractEmail(organizerContact) || extractEmail(fieldToText(data.email));
  const scoreNum = Number(data.score);
  const score = Number.isFinite(scoreNum) ? scoreNum : undefined;
  const recommendation = fieldToText(data.recommendation);
  const scoreBreakdown = fieldToText(data.breakdown);
  const sponsorPitchPrototype = fieldToText(data.prototype);
  const sourceUrl = fieldToText(data.sourceUrl) || req.headers.get("referer") || "";
  const receivedAt = new Date().toISOString();
  const submissionId = randomUUID();

  // Venue image upload - best-effort. A failure here must never block the
  // actual intake record from being saved.
  let venueImageUrl = "";
  let venueImageError = "";
  const venueImageFile = form.get("venueImage");
  if (venueImageFile instanceof File && venueImageFile.size > 0) {
    if (venueImageFile.size > MAX_IMAGE_BYTES) {
      venueImageError = `Image too large (${(venueImageFile.size / 1024 / 1024).toFixed(1)}MB, limit 8MB).`;
    } else if (!venueImageFile.type.startsWith("image/")) {
      venueImageError = `Unsupported file type: ${venueImageFile.type || "unknown"}.`;
    } else {
      try {
        const buffer = Buffer.from(await venueImageFile.arrayBuffer());
        const asset = await writeClient.assets.upload("image", buffer, {
          filename: `kumbaya-${submissionId}-${venueImageFile.name || "venue"}`,
          contentType: venueImageFile.type,
        });
        venueImageUrl = asset.url;
      } catch (err) {
        venueImageError = err instanceof Error ? err.message : "Upload failed.";
        console.error("kumbaya-intake: venue image upload failed:", err);
      }
    }
  }

  const duplicateOf = await findRecentDuplicate(
    eventName,
    eventDate,
    organizerContact,
  ).catch((err) => {
    console.error("kumbaya-intake: duplicate check failed:", err);
    return null;
  });

  // The database write is the record of truth - if this fails, the
  // applicant must see a real failure, not a false success, and their
  // completed prototype (already rendered client-side before this request
  // was sent) must stay on screen. Everything after this point (email,
  // ClickUp, Slack) is best-effort and must never flip a successful save
  // into an apparent failure for the applicant.
  let doc;
  try {
    doc = await writeClient.create({
      _type: "kumbayaSubmission",
      submissionId,
      eventName,
      eventDate,
      location,
      organizerName,
      organizerContact,
      organizerEmail,
      score,
      recommendation,
      scoreBreakdown,
      sponsorPitchPrototype,
      venueImageUrl: venueImageUrl || undefined,
      venueImageError: venueImageError || undefined,
      status: "New",
      consent: data.consent === "true",
      sourceUrl,
      duplicateOf: duplicateOf || undefined,
      formData: JSON.stringify(data),
      receivedAt,
    });
  } catch (err) {
    console.error("kumbaya-intake: Sanity write failed:", err);
    return NextResponse.json(
      { ok: false, error: "We could not save this intake yet. Please try again." },
      { status: 500 },
    );
  }

  const summary = buildSubmissionSummary(data);
  const warning = isWithinSevenDays(eventDate) ? "⚠️ " : "";
  const scoreLabel = score !== undefined ? `${score}/100` : "Not scored";

  let clickupTaskUrl = "";
  let clickupError = "";
  try {
    const task = await withRetry(() =>
      createClickupTask({
        name: `Kumbaya review: ${eventName || "Unknown event"} · ${eventDate || "no date"}`,
        listId: process.env.CLICKUP_KUMBAYA_LIST_ID,
        priority: isWithinSevenDays(eventDate) ? "urgent" : "normal",
        description: [
          "Kumbaya event intake - internal review only.",
          "No sponsorship, speaking, funding, introduction, or distribution commitment has been made.",
          "",
          `Score: ${scoreLabel}`,
          `Recommendation: ${recommendation || "Not provided"}`,
          `Score breakdown: ${scoreBreakdown || "Not provided"}`,
          `Organizer email (best-effort extracted): ${organizerEmail || "Not found"}`,
          `Venue image: ${venueImageUrl || "None uploaded"}`,
          duplicateOf ? `Possible duplicate of submission ${duplicateOf}` : "",
          "",
          "SPONSOR-PITCH PROTOTYPE:",
          sponsorPitchPrototype || "Not generated",
          "",
          "FULL SUBMISSION:",
          summary,
          "",
          `Submission ID: ${submissionId}`,
          `Received at: ${receivedAt}`,
          `Source: ${sourceUrl || "Unknown"}`,
        ].join("\n"),
      }),
    );
    clickupTaskUrl = task.url;
  } catch (err) {
    clickupError = err instanceof Error ? err.message : "ClickUp task creation failed.";
    console.error("kumbaya-intake: ClickUp task creation failed:", err);
  }

  // Slack and the team@ email both want to reference clickupTaskUrl (already
  // resolved above), but don't depend on each other - running them
  // concurrently instead of sequentially matters in practice: a real
  // end-to-end test surfaced ~5.6s of pure serial latency here (two live
  // Resend calls plus, in this test, a ClickUp retry) before the applicant
  // ever saw a result.
  const slackChannel = process.env.SLACK_KUMBAYA_CHANNEL;
  const [slackSettled, emailSettled] = await Promise.allSettled([
    slackChannel
      ? withRetry(() =>
          sendSlackMessage({
            channel: slackChannel,
            text: [
              `${warning}Kumbaya submission received`,
              `Event: ${eventName || "Unknown"}`,
              `Date: ${eventDate || "Unknown"}`,
              `Location: ${location || "Unknown"}`,
              `Score: ${scoreLabel}`,
              `Recommendation: ${recommendation || "Not provided"}`,
              `Organizer: ${organizerName || "Unknown"}${organizerEmail ? ` (${organizerEmail})` : ""}`,
              `ClickUp: ${clickupTaskUrl || "Not created (see webmaster alert)"}`,
              `Submission ID: ${submissionId}`,
            ].join("\n"),
          }),
        )
      : Promise.reject(new Error("SLACK_KUMBAYA_CHANNEL is not configured.")),
    withRetry(() =>
      sendEmail({
        to: KUMBAYA_STAFF_EMAIL,
        subject: `Kumbaya review: ${eventName || "Unknown event"} · ${eventDate || "no date"} · ${scoreLabel}`,
        text: [
          "A new Kumbaya event intake just came in for internal review.",
          "No sponsorship, speaking, funding, introduction, or distribution commitment has been made.",
          "",
          `Score: ${scoreLabel}`,
          `Recommendation: ${recommendation || "Not provided"}`,
          `Score breakdown: ${scoreBreakdown || "Not provided"}`,
          duplicateOf ? `Possible duplicate of submission ${duplicateOf}` : "",
          `Venue image: ${venueImageUrl || "None uploaded"}`,
          `ClickUp task: ${clickupTaskUrl || "Not created - see webmaster alert"}`,
          "",
          "SPONSOR-PITCH PROTOTYPE:",
          sponsorPitchPrototype || "Not generated",
          "",
          "FULL SUBMISSION:",
          summary,
          "",
          `Submission ID: ${submissionId}`,
          `Received at: ${receivedAt}`,
        ]
          .filter(Boolean)
          .join("\n"),
      }),
    ),
  ]);

  const slackDelivered = slackSettled.status === "fulfilled";
  const slackError =
    slackSettled.status === "rejected"
      ? slackSettled.reason instanceof Error
        ? slackSettled.reason.message
        : "Slack delivery failed."
      : "";
  if (slackError) console.error("kumbaya-intake: Slack notification failed:", slackError);

  const emailDelivered = emailSettled.status === "fulfilled";
  const emailError =
    emailSettled.status === "rejected"
      ? emailSettled.reason instanceof Error
        ? emailSettled.reason.message
        : "Email delivery failed."
      : "";
  if (emailError) console.error("kumbaya-intake: team@ramprate.com email failed:", emailError);

  try {
    await writeClient
      .patch(doc._id)
      .set({
        clickupTaskUrl: clickupTaskUrl || undefined,
        clickupError: clickupError || undefined,
        slackDelivered,
        slackError: slackError || undefined,
        emailDelivered,
        emailError: emailError || undefined,
      })
      .commit();
  } catch (err) {
    console.error("kumbaya-intake: failed to patch integration results:", err);
  }

  if (clickupError || slackError || emailError) {
    try {
      await sendEmail({
        to: KUMBAYA_WEBMASTER_EMAIL,
        subject: `Kumbaya intake: integration failure on submission ${submissionId}`,
        text: [
          `Event: ${eventName || "Unknown"} (${eventDate || "no date"})`,
          "The submission itself was saved successfully - only a downstream integration failed.",
          "",
          clickupError ? `ClickUp failed: ${clickupError}` : "ClickUp: OK",
          slackError ? `Slack failed: ${slackError}` : "Slack: OK",
          emailError ? `team@ramprate.com email failed: ${emailError}` : "Email: OK",
          "",
          `Submission ID: ${submissionId}`,
        ].join("\n"),
      });
    } catch (err) {
      console.error("kumbaya-intake: webmaster alert email also failed:", err);
    }
  }

  return NextResponse.json({ ok: true, submissionId });
}
