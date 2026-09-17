import { defineField, defineType } from "sanity";

// One document per Kumbaya event-intake submission
// (https://ramprate.com/kumbaya, POSTed via /api/kumbaya-intake). Written
// directly by the API route via writeClient - no drafts.<id>/publish step,
// since this is the system of record for an internal review queue, not
// public content. `formData` carries the complete raw submission (every
// field the prototype's form can produce) as a JSON string, so nothing is
// lost even as the form evolves; the fields below lift out just the ones
// needed for ClickUp custom fields, Slack/email summaries, and Studio list
// sorting/filtering.
export default defineType({
  name: "kumbayaSubmission",
  title: "Kumbaya Submission",
  type: "document",
  fields: [
    defineField({
      name: "submissionId",
      title: "Submission ID",
      type: "string",
      readOnly: true,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "eventName",
      title: "Event name",
      type: "string",
    }),
    defineField({
      name: "eventDate",
      title: "Event date",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "organizerName",
      title: "Organizer / organization",
      type: "string",
    }),
    defineField({
      name: "organizerContact",
      title: "Organizer name + email + phone (as submitted)",
      type: "string",
    }),
    defineField({
      name: "organizerEmail",
      title: "Organizer email (best-effort, extracted)",
      description:
        "The form only collects a single free-text 'name · email · phone' field, not a dedicated email input - this is a best-effort regex extraction from that text, used for the ClickUp custom field. Always check organizerContact for the authoritative value.",
      type: "string",
    }),
    defineField({
      name: "score",
      title: "Score (1-100)",
      description:
        "Computed client-side by the prototype's existing scoring rubric, sent along with the submission - not re-derived server-side, so it stays exactly in sync with the published tool. Internal triage only, per the form's own disclosure; never treat as authoritative without human review.",
      type: "number",
    }),
    defineField({
      name: "recommendation",
      title: "Recommendation",
      type: "string",
    }),
    defineField({
      name: "scoreBreakdown",
      title: "Score breakdown",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "sponsorPitchPrototype",
      title: "Generated sponsor-pitch prototype",
      type: "text",
      rows: 10,
    }),
    defineField({
      name: "venueImageUrl",
      title: "Venue image URL",
      description:
        "Uploaded to this Sanity project's asset store (unlisted CDN URL, not linked anywhere on the public site) - not a credentialed/access-controlled private store. See CLAUDE.md Kumbaya section for the tradeoff.",
      type: "url",
    }),
    defineField({
      name: "venueImageError",
      title: "Venue image upload error (if any)",
      type: "string",
    }),
    defineField({
      name: "status",
      title: "Submission status",
      type: "string",
      options: {
        list: [
          "New",
          "Internal review",
          "Ask Rob and Alex",
          "Approved",
          "Declined",
          "Recommend elsewhere",
          "Complete",
        ],
      },
      initialValue: "New",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "internalNotes",
      title: "Internal notes",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "consent",
      title: "Consent checkbox value",
      type: "boolean",
    }),
    defineField({
      name: "sourceUrl",
      title: "Source URL (incl. UTM params)",
      type: "string",
    }),
    defineField({
      name: "duplicateOf",
      title: "Possible duplicate of (submission ID)",
      description:
        "Set when this submission matched an existing one (same event name + date + organizer contact) within 24 hours. Not auto-rejected - flagged for a human to reconcile.",
      type: "string",
    }),
    defineField({
      name: "clickupTaskUrl",
      title: "ClickUp task URL",
      type: "url",
    }),
    defineField({
      name: "clickupError",
      title: "ClickUp delivery error (if any)",
      type: "string",
    }),
    defineField({
      name: "slackDelivered",
      title: "Slack notification delivered",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "slackError",
      title: "Slack delivery error (if any)",
      type: "string",
    }),
    defineField({
      name: "emailDelivered",
      title: "team@ramprate.com email delivered",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "emailError",
      title: "Email delivery error (if any)",
      type: "string",
    }),
    defineField({
      name: "formData",
      title: "Complete submission (raw JSON)",
      description:
        "Every field the form posted, verbatim, as a JSON string - the authoritative full record regardless of which fields are lifted out above.",
      type: "text",
      rows: 20,
      readOnly: true,
    }),
    defineField({
      name: "receivedAt",
      title: "Received at",
      type: "datetime",
      readOnly: true,
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: {
      title: "eventName",
      subtitle: "status",
      score: "score",
    },
    prepare({ title, subtitle, score }) {
      return {
        title: title || "Untitled event",
        subtitle: `${subtitle || "New"}${score ? ` · ${score}/100` : ""}`,
      };
    },
  },
});
