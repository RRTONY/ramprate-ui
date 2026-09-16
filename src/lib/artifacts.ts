import { writeClient } from "@/lib/sanity/write-client";
import { client } from "@/lib/sanity/client";

export interface Artifact {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  html: string;
  status: "published" | "draft";
  publishedAt?: string;
  createdBy?: string;
  _createdAt: string;
  _updatedAt: string;
}

interface ArtifactDoc extends Omit<Artifact, "html"> {
  html?: string;
  htmlAssetUrl?: string;
}

// A slug colliding with a real route under /artifacts (currently just
// "admin") would be permanently unreachable, since Next.js always resolves
// the static /artifacts/admin route before the dynamic /artifacts/[slug]
// catch-all - block it up front rather than let Sales publish a dead page.
const RESERVED_SLUGS = new Set(["admin"]);

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

// The HTML document is stored as a Sanity FILE ASSET (htmlAsset below), not
// inline in the document - that sidesteps Sanity's ~4MB mutation-document
// limit entirely (confirmed via a live 413 from a real oversized publish
// attempt, back when it was still an inline `text` field). The remaining
// ceiling is the *hosting platform's* own request body limit: Netlify
// Functions (AWS Lambda-based, synchronous) reject any incoming request
// over 6MB, which nothing on our end can raise. Cap well under that to leave
// headroom for JSON-escaping overhead (the browser still ships the HTML as
// a JSON string in the POST/PATCH body) and the request's other fields.
export const MAX_HTML_BYTES = 5_000_000;

export function validateHtmlSize(html: string): string | null {
  const bytes = Buffer.byteLength(html, "utf8");
  if (bytes > MAX_HTML_BYTES) {
    const mb = (bytes / (1024 * 1024)).toFixed(1);
    return `This HTML is too large (${mb}MB) - the limit is ~5MB. That ceiling comes from the hosting platform's own request-size limit, not Sanity, so it can't be raised further. This is almost always caused by images embedded directly as base64 data (data:image/...;base64,...) rather than linked externally. Compress/convert them (e.g. to WebP) or host them elsewhere and link to the URL instead.`;
  }
  return null;
}

// Uploads the HTML document as a Sanity file asset and returns its asset
// _id, ready to reference from an artifact document's `htmlAsset` field.
export async function uploadHtmlAsset(
  html: string,
  slug: string,
): Promise<string> {
  const asset = await writeClient.assets.upload(
    "file",
    Buffer.from(html, "utf8"),
    { filename: `${slug}.html`, contentType: "text/html" },
  );
  return asset._id;
}

export function htmlAssetField(assetId: string) {
  return { _type: "file", asset: { _type: "reference", _ref: assetId } };
}

async function resolveHtml(doc: ArtifactDoc): Promise<string> {
  if (doc.htmlAssetUrl) {
    const res = await fetch(doc.htmlAssetUrl);
    return res.text();
  }
  return doc.html || "";
}

export function validateSlug(slug: string): string | null {
  if (!slug) return "Slug is required.";
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return "Slug can only contain lowercase letters, numbers, and hyphens (no leading/trailing/double hyphens).";
  }
  if (RESERVED_SLUGS.has(slug)) {
    return `"${slug}" is reserved and can't be used as a slug.`;
  }
  return null;
}

// The list view never renders `html` (see ArtifactAdminDashboard) - leaving
// it (and the potentially-large legacy inline field) out keeps that query
// cheap regardless of how many artifacts exist or how big their HTML is.
const ARTIFACT_LIST_FIELDS = `{
  _id, title, "slug": slug.current, description, status,
  publishedAt, createdBy, _createdAt, _updatedAt
}`;

// Single-artifact fetches (edit form, public page) need the actual HTML -
// dereference htmlAsset to its CDN url so resolveHtml() can fetch the real
// content; `html` covers artifacts created before the file-asset switch.
const ARTIFACT_FULL_FIELDS = `{
  _id, title, "slug": slug.current, description, html,
  "htmlAssetUrl": htmlAsset.asset->url, status,
  publishedAt, createdBy, _createdAt, _updatedAt
}`;

export async function listArtifacts(): Promise<Artifact[]> {
  // Admin's own list must always be fresh (right after a create/update/
  // delete) - the write client bypasses the CDN/ISR caching the public
  // read client uses, so there's no stale-for-up-to-60s window here.
  const docs: Omit<Artifact, "html">[] = await writeClient.fetch(
    `*[_type == "artifact"] | order(_createdAt desc) ${ARTIFACT_LIST_FIELDS}`,
  );
  return docs.map((d) => ({ ...d, html: "" }));
}

export async function getArtifactById(id: string): Promise<Artifact | null> {
  const doc: ArtifactDoc | null = await writeClient.fetch(
    `*[_type == "artifact" && _id == $id][0] ${ARTIFACT_FULL_FIELDS}`,
    { id },
  );
  if (!doc) return null;
  return { ...doc, html: await resolveHtml(doc) };
}

export async function findArtifactBySlug(
  slug: string,
  { publishedOnly }: { publishedOnly: boolean },
): Promise<Artifact | null> {
  const fetcher = publishedOnly ? client : writeClient;
  const statusFilter = publishedOnly ? '&& status == "published"' : "";
  const doc: ArtifactDoc | null = await fetcher.fetch(
    `*[_type == "artifact" && slug.current == $slug ${statusFilter}][0] ${ARTIFACT_FULL_FIELDS}`,
    { slug },
  );
  if (!doc) return null;
  return { ...doc, html: await resolveHtml(doc) };
}

export async function slugExists(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const doc = await writeClient.fetch(
    `*[_type == "artifact" && slug.current == $slug && _id != $excludeId][0]{_id}`,
    { slug, excludeId: excludeId || "" },
  );
  return Boolean(doc);
}

export async function listPublishedSlugs(): Promise<string[]> {
  const docs = await client.fetch<{ slug: string }[]>(
    `*[_type == "artifact" && status == "published"]{"slug": slug.current}`,
  );
  return docs.map((d) => d.slug);
}
