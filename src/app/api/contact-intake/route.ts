import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import { storeFormSubmission } from "@/lib/submissions/store";

const contactSchema = yup.object({
  name: yup.string().trim().required().max(255),
  email: yup.string().trim().email().required().max(320),
  company: yup.string().trim().max(255).optional(),
  title: yup.string().trim().max(255).optional(),
  phone: yup.string().trim().max(64).optional(),
  practice: yup.string().trim().max(128).optional(),
  message: yup.string().trim().max(10000).optional(),
});

export async function POST(request: NextRequest) {
  let input: unknown;

  try {
    input = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "A valid contact submission is required." },
      { status: 400 },
    );
  }

  let payload: yup.InferType<typeof contactSchema>;
  try {
    payload = await contactSchema.validate(input, { stripUnknown: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Please provide a valid name and email address." },
      { status: 400 },
    );
  }

  try {
    await storeFormSubmission({
      formType: "contact",
      sourceUrl: request.headers.get("referer"),
      payload,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to save your message. Please try again." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
