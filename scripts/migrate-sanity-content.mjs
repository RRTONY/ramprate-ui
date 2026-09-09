import { readFile } from "node:fs/promises";
import mysql from "mysql2/promise";

const contentSource = process.argv[2];
const assetSource = process.argv[3];

if (!contentSource || !assetSource) {
  throw new Error(
    "Usage: node scripts/migrate-sanity-content.mjs <content-documents.json> <image-assets.json>",
  );
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set to run a content migration.");
}

function toDatabaseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date;
}

function sourceField(document, field) {
  const value = document[field];
  return typeof value === "string" && value.length > 0 ? value : null;
}

function sourceSlug(document) {
  if (typeof document.slug === "string") return document.slug;
  if (document.slug && typeof document.slug.current === "string") {
    return document.slug.current;
  }
  return null;
}

function expandReferences(value, documents, visited = new Set()) {
  if (Array.isArray(value)) {
    return value.map((item) => expandReferences(item, documents, visited));
  }

  if (!value || typeof value !== "object") return value;

  if ("_ref" in value && typeof value._ref === "string") {
    const referencedDocument = documents.get(value._ref);
    if (!referencedDocument || visited.has(value._ref)) return { ...value };

    const nextVisited = new Set(visited);
    nextVisited.add(value._ref);
    return expandReferences(referencedDocument, documents, nextVisited);
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      expandReferences(item, documents, visited),
    ]),
  );
}

const [contentExport, assetExport] = await Promise.all([
  readFile(contentSource, "utf8"),
  readFile(assetSource, "utf8"),
]);
const authoredDocuments = JSON.parse(contentExport).result;
const imageAssets = JSON.parse(assetExport).result;

if (!Array.isArray(authoredDocuments) || !Array.isArray(imageAssets)) {
  throw new Error("The supplied Sanity exports do not contain result arrays.");
}

const sourceDocuments = [...authoredDocuments, ...imageAssets];
const byId = new Map(sourceDocuments.map((document) => [document._id, document]));
const connection = await mysql.createConnection(process.env.DATABASE_URL);

const statement = `
  INSERT INTO content_documents (
    source_id, content_type, slug, route, section, title,
    published_at, source_updated_at, data
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    content_type = VALUES(content_type),
    slug = VALUES(slug),
    route = VALUES(route),
    section = VALUES(section),
    title = VALUES(title),
    published_at = VALUES(published_at),
    source_updated_at = VALUES(source_updated_at),
    data = VALUES(data)
`;

const counts = new Map();

try {
  await connection.beginTransaction();

  for (const document of sourceDocuments) {
    if (typeof document._id !== "string" || typeof document._type !== "string") {
      throw new Error("Every source document must include _id and _type fields.");
    }

    const expandedDocument = expandReferences(document, byId, new Set([document._id]));
    await connection.execute(statement, [
      document._id,
      document._type,
      sourceSlug(document),
      sourceField(document, "route"),
      sourceField(document, "section"),
      sourceField(document, "title") ?? sourceField(document, "name"),
      toDatabaseDate(document.publishedAt),
      toDatabaseDate(document._updatedAt),
      JSON.stringify(expandedDocument),
    ]);
    counts.set(document._type, (counts.get(document._type) ?? 0) + 1);
  }

  await connection.commit();
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}

console.log(`Migrated ${sourceDocuments.length} content records.`);
for (const [contentType, count] of [...counts.entries()].sort()) {
  console.log(`${contentType}: ${count}`);
}
