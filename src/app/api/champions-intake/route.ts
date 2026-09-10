import { NextRequest, NextResponse } from "next/server";

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

  return NextResponse.json({ ok: true, receivedAt });
}
