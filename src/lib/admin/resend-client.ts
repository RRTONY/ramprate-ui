const RESEND_API_BASE = "https://api.resend.com";

// No verified sending domain confirmed for this account yet, so default to
// Resend's own sandbox sender - it works with zero setup but only delivers
// to the address that owns the Resend account. Once a domain is verified in
// the Resend dashboard, pass `from` explicitly (e.g. "RampRate <admin@ramprate.com>").
const DEFAULT_FROM = "RampRate <onboarding@resend.dev>";

function authHeader(): string {
  const token = process.env.RESEND_API_KEY;
  if (!token) throw new Error("RESEND_API_KEY is not configured");
  return `Bearer ${token}`;
}

export interface SendEmailFields {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string;
}

export interface SendEmailResult {
  id: string;
}

export async function sendEmail(
  fields: SendEmailFields,
): Promise<SendEmailResult> {
  const res = await fetch(`${RESEND_API_BASE}/emails`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fields.from ?? DEFAULT_FROM,
      to: [fields.to],
      subject: fields.subject,
      text: fields.text,
      ...(fields.html ? { html: fields.html } : {}),
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data?.message === "string"
        ? data.message
        : `Resend API error (${res.status})`,
    );
  }
  return { id: String(data.id) };
}
