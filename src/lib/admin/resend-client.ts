const RESEND_API_BASE = "https://api.resend.com";
const DEFAULT_FROM = "RampRate <reports@ramprate.com>";

export interface EmailAttachment {
  filename: string;
  content: string; // base64
}

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  from?: string;
  attachments?: EmailAttachment[];
}

export async function sendEmail(
  input: SendEmailInput,
): Promise<{ id: string }> {
  const token = process.env.RESEND_API_KEY;
  if (!token) throw new Error("RESEND_API_KEY is not configured");

  const res = await fetch(`${RESEND_API_BASE}/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: input.from ?? DEFAULT_FROM,
      to: input.to,
      subject: input.subject,
      text: input.text,
      ...(input.html ? { html: input.html } : {}),
      ...(input.attachments ? { attachments: input.attachments } : {}),
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
