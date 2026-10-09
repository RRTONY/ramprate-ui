import { NextRequest, NextResponse } from "next/server";
import { NUAMINO_QUESTION_IDS } from "@/lib/nuamino-needs-fields";

export async function POST(req: NextRequest) {
  const scriptUrl = process.env.NUAMINO_NEEDS_SCRIPT_URL;
  if (!scriptUrl) {
    return NextResponse.json(
      { ok: false, error: "Questionnaire submissions are not configured yet." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid submission." },
      { status: 400 },
    );
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { ok: false, error: "Invalid submission." },
      { status: 400 },
    );
  }
  const data = body as Record<string, unknown>;
  const respondent = data.respondent as Record<string, unknown> | undefined;
  const answers = data.answers as Record<string, unknown> | undefined;
  const verification = data.verification as Record<string, unknown> | undefined;
  if (
    !respondent ||
    typeof respondent.name !== "string" ||
    !respondent.name.trim() ||
    typeof respondent.email !== "string" ||
    !/^\S+@\S+\.\S+$/.test(respondent.email) ||
    !answers ||
    typeof answers.stabilityTesting !== "string" ||
    !answers.stabilityTesting.trim() ||
    !verification ||
    typeof verification !== "object"
  ) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Please provide your contact details and a direct stability-testing answer.",
      },
      { status: 400 },
    );
  }
  if (
    NUAMINO_QUESTION_IDS.some(
      (key) =>
        answers[key] !== undefined &&
        (typeof answers[key] !== "string" ||
          (answers[key] as string).length > 20000),
    )
  ) {
    return NextResponse.json(
      { ok: false, error: "Invalid answer format." },
      { status: 400 },
    );
  }
  const response = await fetch(scriptUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      form: "NuAmino needs analysis",
      respondent: {
        name: respondent.name,
        email: respondent.email,
        title: typeof respondent.title === "string" ? respondent.title : "",
      },
      answers: Object.fromEntries(
        NUAMINO_QUESTION_IDS.map((key) => [key, answers[key] || ""]),
      ),
      verification: Object.fromEntries(
        [...NUAMINO_QUESTION_IDS, "intakeScope"].map((key) => [
          key,
          typeof verification[key] === "string" ? verification[key] : "",
        ]),
      ),
      submittedAt: new Date().toISOString(),
    }),
    cache: "no-store",
  }).catch(() => null);
  if (!response?.ok) {
    return NextResponse.json(
      { ok: false, error: "We could not save the submission. Please retry." },
      { status: 502 },
    );
  }
  const result = await response.json().catch(() => null);
  if (!result?.ok) {
    return NextResponse.json(
      { ok: false, error: "The submission could not be confirmed as saved." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
