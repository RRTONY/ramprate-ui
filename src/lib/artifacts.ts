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

const ARTIFACT_FIELDS = `{
  _id, title, "slug": slug.current, description, html, status,
  publishedAt, createdBy, _createdAt, _updatedAt
}`;

export async function listArtifacts(): Promise<Artifact[]> {
  // Admin's own list must always be fresh (right after a create/update/
  // delete) - the write client bypasses the CDN/ISR caching the public
  // read client uses, so there's no stale-for-up-to-60s window here.
  return writeClient.fetch(
    `*[_type == "artifact"] | order(_createdAt desc) ${ARTIFACT_FIELDS}`,
  );
}

export async function getArtifactById(id: string): Promise<Artifact | null> {
  return writeClient.fetch(
    `*[_type == "artifact" && _id == $id][0] ${ARTIFACT_FIELDS}`,
    { id },
  );
}

export async function findArtifactBySlug(
  slug: string,
  { publishedOnly }: { publishedOnly: boolean },
): Promise<Artifact | null> {
  const fetcher = publishedOnly ? client : writeClient;
  const statusFilter = publishedOnly ? '&& status == "published"' : "";
  return fetcher.fetch(
    `*[_type == "artifact" && slug.current == $slug ${statusFilter}][0] ${ARTIFACT_FIELDS}`,
    { slug },
  );
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
