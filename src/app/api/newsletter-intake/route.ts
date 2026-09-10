import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import { storeFormSubmission } from "@/lib/submissions/store";

const newsletterSchema = yup.object({
  email: yup.string().email().required(),
});

export async function POST(request: NextRequest) {
  const input = await request.json().catch(() => null);
  let payload: { email: string };

  try {
    payload = await newsletterSchema.validate(input, { stripUnknown: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "A valid email address is required." },
      { status: 400 },
    );
  }

  try {
    await storeFormSubmission({
      formType: "newsletter",
      sourceUrl: request.headers.get("referer"),
      payload,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Unable to save your subscription. Please try again.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
