import { drizzle } from "drizzle-orm/mysql2";
import { formSubmissions } from "@/lib/content/schema";

type FormPayload = Record<string, unknown>;

type SubmissionInput = {
  formType: string;
  sourceUrl: string | null;
  payload: unknown;
  attachments?: unknown;
};

function asRecord(value: unknown): FormPayload {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as FormPayload)
    : {};
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function findEmail(value: unknown): string | null {
  const record = asRecord(value);
  const direct = [record.email, record.workEmail, record.contactEmail]
    .map(stringValue)
    .find(Boolean);
  return direct ?? null;
}

function attachmentMetadata(value: unknown): unknown[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;

  return value.map((attachment) => {
    const record = asRecord(attachment);
    return {
      name: stringValue(record.name) ?? stringValue(record.filename),
      type: stringValue(record.type) ?? stringValue(record.mimeType),
      size: typeof record.size === "number" ? record.size : null,
      url: stringValue(record.url) ?? stringValue(record.href),
    };
  });
}

export async function storeFormSubmission({
  formType,
  sourceUrl,
  payload,
  attachments,
}: SubmissionInput): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error("Form storage is unavailable because DATABASE_URL is not set.");
  }

  const database = drizzle(process.env.DATABASE_URL);
  const normalizedPayload = asRecord(payload);
  await database.insert(formSubmissions).values({
    formType,
    sourceUrl: sourceUrl || null,
    submitterEmail: findEmail(normalizedPayload),
    payload: normalizedPayload,
    attachmentMetadata: attachmentMetadata(attachments),
  });
}
