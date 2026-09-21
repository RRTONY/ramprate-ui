import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const scriptUrl = process.env.ACTIVE_PHARM_INTAKE_SCRIPT_URL;

  if (!scriptUrl) {
    return NextResponse.json(
      { ok: false, error: "Active Pharm intake is not configured." },
      { status: 500 },
    );
  }

  const payload = await req.json();

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

  const data = await res.json();
  if (!data.ok) {
    return NextResponse.json(
      { ok: false, error: data.error || "Submission failed." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
