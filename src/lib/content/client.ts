import "server-only";

import { and, desc, eq, ne } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { cache } from "react";
import { contentDocuments, type ContentDocument } from "./schema";
import type { ContentQuery } from "./queries";

type ContentRecord = Record<string, unknown>;
type ContentParams = Record<string, unknown>;

const database = drizzle(process.env.DATABASE_URL ?? "");

function asRecord(value: unknown): ContentRecord {
  if (typeof value === "string") {
    const parsed = JSON.parse(value) as unknown;
    return parsed && typeof parsed === "object"
      ? (parsed as ContentRecord)
      : {};
  }
  return value && typeof value === "object" ? (value as ContentRecord) : {};
}

function toContentRecord(document: ContentDocument): ContentRecord {
  const data = asRecord(document.data);
  return {
    ...data,
    _id: document.sourceId,
    _type: document.contentType,
    _updatedAt: document.sourceUpdatedAt?.toISOString(),
  };
}

function valueAt(record: ContentRecord, field: string): unknown {
  return record[field];
}

function getSlug(record: ContentRecord): string | undefined {
  const slug = valueAt(record, "slug");
  if (typeof slug === "string") return slug;
  if (
    slug &&
    typeof slug === "object" &&
    typeof (slug as ContentRecord).current === "string"
  ) {
    return (slug as ContentRecord).current as string;
  }
  return undefined;
}

function getCategories(record: ContentRecord): ContentRecord[] {
  const categories = valueAt(record, "categories");
  return Array.isArray(categories)
    ? categories.filter((category): category is ContentRecord =>
        Boolean(category && typeof category === "object"),
      )
    : [];
}

function categoriesMatch(record: ContentRecord, categorySlug: string): boolean {
  return getCategories(record).some(
    (category) => getSlug(category) === categorySlug,
  );
}

function portableTextToPlainText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value.map(portableTextToPlainText).filter(Boolean).join("\n\n");
  }
  if (!value || typeof value !== "object") return "";
  const record = value as ContentRecord;
  if (typeof record.text === "string") return record.text;
  return portableTextToPlainText(record.children);
}

function imageUrl(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const record = value as ContentRecord;
  if (typeof record.url === "string") return record.url;
  return imageUrl(record.asset);
}

function postSummary(record: ContentRecord): ContentRecord {
  const {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    categories,
    section,
  } = record;
  return {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    categories,
    section,
  };
}

function sortByPublishedAt(records: ContentRecord[]): ContentRecord[] {
  return records.sort((left, right) => {
    const leftDate = String(left.publishedAt ?? "");
    const rightDate = String(right.publishedAt ?? "");
    return rightDate.localeCompare(leftDate);
  });
}

const getByType = cache(async (contentType: string) => {
  const documents = await database
    .select()
    .from(contentDocuments)
    .where(eq(contentDocuments.contentType, contentType));
  return documents.map(toContentRecord);
});

const getPostDocuments = cache(async (section?: "thinking" | "blog") => {
  const condition =
    section === "thinking"
      ? and(
          eq(contentDocuments.contentType, "post"),
          eq(contentDocuments.section, "thinking"),
        )
      : section === "blog"
        ? and(
            eq(contentDocuments.contentType, "post"),
            ne(contentDocuments.section, "thinking"),
          )
        : eq(contentDocuments.contentType, "post");
  const documents = await database
    .select()
    .from(contentDocuments)
    .where(condition)
    .orderBy(desc(contentDocuments.publishedAt));
  return documents.map(toContentRecord);
});

async function getPostBySlug(slug: string) {
  const [document] = await database
    .select()
    .from(contentDocuments)
    .where(
      and(
        eq(contentDocuments.contentType, "post"),
        eq(contentDocuments.slug, slug),
      ),
    )
    .limit(1);
  return document ? toContentRecord(document) : null;
}

async function getPageBySlug(slug: string) {
  const [document] = await database
    .select()
    .from(contentDocuments)
    .where(
      and(
        eq(contentDocuments.contentType, "page"),
        eq(contentDocuments.slug, slug),
      ),
    )
    .limit(1);
  return document ? toContentRecord(document) : null;
}

async function getPageSeo(route: string) {
  const [document] = await database
    .select()
    .from(contentDocuments)
    .where(
      and(
        eq(contentDocuments.contentType, "pageSeo"),
        eq(contentDocuments.route, route),
      ),
    )
    .limit(1);
  return document ? toContentRecord(document) : null;
}

async function getRelatedPosts(
  slug: string,
  categorySlugs: string[],
  section: "thinking" | "blog",
) {
  const posts = await getPostDocuments(section);
  const sharedCategoryPosts = posts.filter(
    (post) =>
      getSlug(post) !== slug &&
      categorySlugs.some((categorySlug) => categoriesMatch(post, categorySlug)),
  );
  const candidates =
    sharedCategoryPosts.length > 0
      ? sharedCategoryPosts
      : posts.filter((post) => getSlug(post) !== slug);
  return sortByPublishedAt(candidates).slice(0, 3).map(postSummary);
}

async function executeContentQuery(
  query: ContentQuery,
  params: ContentParams,
): Promise<unknown> {
  const start = Number(params.start ?? 0);
  const end = Number(params.end ?? 12);

  switch (query.name) {
    case "siteSettings": {
      const [settings] = await getByType("siteSettings");
      return settings ?? null;
    }
    case "pageSeo":
      return getPageSeo(String(params.route));
    case "pageBySlug":
      return getPageBySlug(String(params.slug));
    case "spyIndexPage":
      return getPageBySlug("spy-index");
    case "posts":
      return (await getPostDocuments("blog"))
        .slice(start, end)
        .map(postSummary);
    case "thinkingPosts":
      return (await getPostDocuments("thinking"))
        .slice(start, end)
        .map(postSummary);
    case "postBySlug":
      return getPostBySlug(String(params.slug));
    case "postCount":
      return (await getPostDocuments("blog")).length;
    case "thinkingPostCount":
      return (await getPostDocuments("thinking")).length;
    case "relatedPosts":
      return getRelatedPosts(
        String(params.slug),
        (params.categorySlugs as string[] | undefined) ?? [],
        "blog",
      );
    case "recentPosts":
      return getRelatedPosts(String(params.slug), [], "blog");
    case "relatedThinkingPosts":
      return getRelatedPosts(
        String(params.slug),
        (params.categorySlugs as string[] | undefined) ?? [],
        "thinking",
      );
    case "recentThinkingPosts":
      return getRelatedPosts(String(params.slug), [], "thinking");
    case "categories": {
      const [categories, posts] = await Promise.all([
        getByType("category"),
        getPostDocuments("blog"),
      ]);
      return categories
        .map((category) => ({
          _id: category._id,
          title: category.title,
          slug: category.slug,
          postCount: posts.filter((post) =>
            categoriesMatch(post, getSlug(category) ?? ""),
          ).length,
        }))
        .sort(
          (left, right) =>
            Number(right.postCount) - Number(left.postCount) ||
            String(left.title).localeCompare(String(right.title)),
        );
    }
    case "categoryBySlug": {
      const categorySlug = String(params.slug);
      return (
        (await getByType("category")).find(
          (category) => getSlug(category) === categorySlug,
        ) ?? null
      );
    }
    case "postsByCategory": {
      const posts = await getPostDocuments("blog");
      return posts
        .filter((post) => categoriesMatch(post, String(params.categorySlug)))
        .slice(start, end)
        .map(postSummary);
    }
    case "postCountByCategory":
      return (await getPostDocuments("blog")).filter((post) =>
        categoriesMatch(post, String(params.categorySlug)),
      ).length;
    case "teamMembers":
      return (await getByType("teamMember"))
        .sort(
          (left, right) => Number(left.order ?? 0) - Number(right.order ?? 0),
        )
        .map((member) => ({
          ...member,
          bio: portableTextToPlainText(member.bio),
        }));
    case "testimonials":
      return (await getByType("testimonial")).sort(
        (left, right) => Number(left.order ?? 0) - Number(right.order ?? 0),
      );
    case "boardAdvisors":
      return (await getByType("boardAdvisor"))
        .sort(
          (left, right) => Number(left.order ?? 0) - Number(right.order ?? 0),
        )
        .map((advisor) => ({
          ...advisor,
          bio: portableTextToPlainText(advisor.bio),
        }));
    case "caseStudies":
      return (await getByType("caseStudy")).sort(
        (left, right) => Number(left.order ?? 0) - Number(right.order ?? 0),
      );
    case "confidentialTestimonials":
      return (await getByType("confidentialTestimonial")).sort(
        (left, right) => Number(left.order ?? 0) - Number(right.order ?? 0),
      );
    case "clientLogos":
      return (await getByType("clientLogo"))
        .sort(
          (left, right) => Number(left.order ?? 0) - Number(right.order ?? 0),
        )
        .map((logo) => ({ ...logo, logoUrl: imageUrl(logo.logo) }));
    case "allThinkingPosts":
      return (await getPostDocuments("thinking")).map((post) => ({
        ...postSummary(post),
        slug: getSlug(post),
      }));
    case "allPostSlugs":
      return (await getPostDocuments()).map(postSummary);
    case "allCategorySlugs":
      return (await getByType("category")).map((category) => ({
        _id: category._id,
        slug: category.slug,
        _updatedAt: category._updatedAt,
      }));
    case "searchPosts": {
      const queryText = String(params.q ?? "").toLowerCase();
      return (await getPostDocuments())
        .filter((post) =>
          JSON.stringify(post).toLowerCase().includes(queryText),
        )
        .slice(0, 30)
        .map(postSummary);
    }
  }
}

export const client = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Existing page routes rely on Sanity client's permissive generic default during the staged migration.
  fetch<T = any>(
    query: ContentQuery | string,
    params: ContentParams = {},
  ): Promise<T> {
    if (typeof query === "string") {
      throw new Error(
        "Raw GROQ queries are unavailable after the content database migration.",
      );
    }
    return executeContentQuery(query, params) as Promise<T>;
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Existing page routes rely on Sanity client's permissive generic default during the staged migration.
export async function contentFetch<T = any>({
  query,
  params = {},
}: {
  query: ContentQuery;
  params?: ContentParams;
  tags?: string[];
  revalidate?: number | false;
}): Promise<T> {
  return client.fetch<T>(query, params);
}

export { contentFetch as sanityFetch };
