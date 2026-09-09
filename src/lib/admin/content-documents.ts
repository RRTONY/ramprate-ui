import "server-only";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { contentDocuments } from "@/lib/content/schema";
import { isContentTypeAllowed } from "@/lib/admin/guardrails";

const database = drizzle(process.env.DATABASE_URL ?? "");

type StoredDocument = Record<string, unknown>;

function asRecord(value: unknown): StoredDocument {
  if (typeof value === "string") {
    const parsed = JSON.parse(value) as unknown;
    return parsed && typeof parsed === "object"
      ? (parsed as StoredDocument)
      : {};
  }
  return value && typeof value === "object" ? (value as StoredDocument) : {};
}

function sourceSlug(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (
    value &&
    typeof value === "object" &&
    typeof (value as StoredDocument).current === "string"
  ) {
    return (value as StoredDocument).current as string;
  }
  return null;
}

function contentDocument(
  record: typeof contentDocuments.$inferSelect,
): StoredDocument {
  return {
    ...asRecord(record.data),
    _id: record.sourceId,
    _type: record.contentType,
    _updatedAt: record.sourceUpdatedAt?.toISOString(),
  };
}

export async function getContentDocument(id: string) {
  const [document] = await database
    .select()
    .from(contentDocuments)
    .where(eq(contentDocuments.sourceId, id))
    .limit(1);
  return document ? contentDocument(document) : null;
}

export async function listContentDocuments() {
  const documents = await database
    .select({
      sourceId: contentDocuments.sourceId,
      contentType: contentDocuments.contentType,
      slug: contentDocuments.slug,
      title: contentDocuments.title,
      sourceUpdatedAt: contentDocuments.sourceUpdatedAt,
    })
    .from(contentDocuments)
    .where(eq(contentDocuments.contentType, "post"));
  return documents;
}

export async function patchContentDocument(id: string, patch: StoredDocument) {
  const current = await getContentDocument(id);
  if (!current) throw new Error(`No managed content document found for ${id}`);

  const next: StoredDocument = {
    ...current,
    ...patch,
    _id: id,
    _type: current._type,
  };
  await database
    .update(contentDocuments)
    .set({
      slug: sourceSlug(next.slug),
      route: typeof next.route === "string" ? next.route : null,
      section: typeof next.section === "string" ? next.section : null,
      title:
        typeof next.title === "string"
          ? next.title
          : typeof next.name === "string"
            ? next.name
            : null,
      data: next,
    })
    .where(eq(contentDocuments.sourceId, id));
  return getContentDocument(id);
}

export async function createContentDocument(
  contentType: string,
  fields: StoredDocument,
) {
  if (!isContentTypeAllowed(contentType)) {
    throw new Error(
      `Content type "${contentType}" is not in the admin-editable allowlist`,
    );
  }

  const sourceId = `managed-${randomUUID()}`;
  const document: StoredDocument = {
    ...fields,
    _id: sourceId,
    _type: contentType,
  };
  await database.insert(contentDocuments).values({
    sourceId,
    contentType,
    slug: sourceSlug(document.slug),
    route: typeof document.route === "string" ? document.route : null,
    section: typeof document.section === "string" ? document.section : null,
    title:
      typeof document.title === "string"
        ? document.title
        : typeof document.name === "string"
          ? document.name
          : null,
    data: document,
  });
  return getContentDocument(sourceId);
}
