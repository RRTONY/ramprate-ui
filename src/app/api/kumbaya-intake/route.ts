import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import { storeFormSubmission } from "@/lib/submissions/store";

const optionalUrl = yup
  .string()
  .trim()
  .test(
    "valid-url",
    "A supplied link must use https://.",
    (value) => !value || /^https:\/\/.+/.test(value),
  );

const kumbayaSchema = yup.object({
  companyWebsite: optionalUrl,
  event: yup.string().trim().min(2).max(180).required(),
  eventDetails: yup.string().trim().max(1600),
  date: yup.string().trim().max(32).required(),
  deadline: yup.string().trim().max(32),
  venue: yup.string().trim().min(2).max(180).required(),
  eventLink: optionalUrl,
  venueLink: optionalUrl,
  organizer: yup.string().trim().max(180),
  contact: yup.string().trim().min(5).max(320).required(),
  attendance: yup.string().trim().max(80).required(),
  audience: yup.string().trim().min(10).max(4000).required(),
  eventStage: yup.string().trim().max(160).required(),
  moodboardUrl: optionalUrl,
  priority: yup.string().trim().min(12).max(4000).required(),
  opportunity: yup.string().trim().min(12).max(4000).required(),
});

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const validatedPayload = await kumbayaSchema.validate(payload, {
      abortEarly: false,
      stripUnknown: true,
    });

    await storeFormSubmission({
      formType: "kumbaya-shared-upside-intake",
      sourceUrl: request.headers.get("referer"),
      payload: validatedPayload,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please review the highlighted fields and try again.",
        },
        { status: 400 },
      );
    }

    console.error("[Kumbaya intake] Unable to store submission", error);
    return NextResponse.json(
      { ok: false, error: "We could not send your brief. Please try again." },
      { status: 500 },
    );
  }
}
