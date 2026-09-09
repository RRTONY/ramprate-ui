import { NextRequest, NextResponse } from "next/server";

const NOTIFY_TO = ["admin@ramprate.com"];
const NOTIFY_FROM = "RampRate <admin@ramprate.com>";

// The applicant is waiting on this request before the agreement opens, so the
// notification gets a short leash rather than the function's full timeout.
const NOTIFY_TIMEOUT_MS = 4000;

type ChampionFormData = {
  name?: string;
  email?: string;
  company?: string;
  linkedin?: string;
  practices?: string[];
  signer?: string;
  notes?: string;
};

function buildNotificationText(
  formData: ChampionFormData,
  receivedAt: string,
  sourceUrl: string,
) {
  const practices = formData.practices?.length
    ? formData.practices.join(", ")
    : "none selected";

  return [
    "A new Champion application has been submitted on ramprate.com/champions.",
    "",
    `Name:            ${formData.name || "-"}`,
    `Work email:      ${formData.email || "-"}`,
    `Company:         ${formData.company || "-"}`,
    `LinkedIn:        ${formData.linkedin || "-"}`,
    `Could introduce: ${practices}`,
    `Signs on their side: ${formData.signer || "themselves"}`,
    `Notes:           ${formData.notes || "-"}`,
    "",
    `Submitted:       ${receivedAt}`,
    `Page:            ${sourceUrl || "-"}`,
    "",
    "This confirms the form was filled, not that the agreement was signed.",
    "Adobe Sign sends the countersigned copy separately once they sign.",
  ].join("\n");
}

async function notifyAdmins(text: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error(
      "champions-intake: RESEND_API_KEY is not set - admin notification NOT sent.",
    );
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: NOTIFY_TO,
      subject: "New Champion application - ramprate.com/champions",
      text,
    }),
    signal: AbortSignal.timeout(NOTIFY_TIMEOUT_MS),
  });

  if (!res.ok) {
    console.error(
      `champions-intake: admin notification failed (${res.status}) - ${await res.text()}`,
    );
  }
}

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

  // A Champion's claim on an introduction rests on when it arrived, so the
  // timestamp is stamped server-side on receipt rather than trusted from the
  // client, where it could be absent, skewed, or edited.
  const receivedAt = new Date().toISOString();

  const payload = {
    formData: { ...body.formData, receivedAt },
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

  // The applicant's details are already recorded by this point, so neither a
  // failed nor a slow notification may block them from reaching the agreement.
  try {
    await notifyAdmins(
      buildNotificationText(body.formData || {}, receivedAt, sourceUrl),
    );
  } catch (err) {
    console.error("champions-intake: admin notification threw", err);
  }

  return NextResponse.json({ ok: true, receivedAt });
}
