import "server-only";

import { asc, desc, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { cache } from "react";
import {
  boardAdvisors,
  caseStudies,
  clientLogos,
  contentCategories,
  contentPages,
  contentPosts,
  mediaAssets,
  contentTestimonials,
  pageSeo,
  postCategories,
  siteSettings,
  teamMembers,
} from "./schema";
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

function toIsoString(value: Date | null): string | undefined {
  return value?.toISOString();
}

function getSlug(record: ContentRecord): string | undefined {
  const slug = record.slug;
  if (typeof slug === "string") return slug;
  if (!slug || typeof slug !== "object") return undefined;
  const current = (slug as ContentRecord).current;
  return typeof current === "string" ? current : undefined;
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

function genericRecord(
  sourceId: string,
  contentType: string,
  metadata: unknown,
  sourceUpdatedAt: Date | null,
): ContentRecord {
  return {
    ...asRecord(metadata),
    _id: sourceId,
    _type: contentType,
    _updatedAt: toIsoString(sourceUpdatedAt),
  };
}

function categoryRecord(
  category: typeof contentCategories.$inferSelect,
): ContentRecord {
  return {
    ...genericRecord(
      category.sourceId,
      "category",
      category.metadata,
      category.sourceUpdatedAt,
    ),
    title: category.title,
    description: category.description,
    slug: { current: category.slug },
  };
}

function mediaRecord(asset: typeof mediaAssets.$inferSelect): ContentRecord {
  return {
    ...genericRecord(
      asset.sourceId,
      "imageAsset",
      asset.metadata,
      asset.sourceUpdatedAt,
    ),
    url: asset.url,
    alt: asset.altText,
  };
}

function postRecord(
  post: typeof contentPosts.$inferSelect,
  categories: ContentRecord[],
  mainImage?: ContentRecord,
): ContentRecord {
  return {
    ...genericRecord(
      post.sourceId,
      "post",
      post.metadata,
      post.sourceUpdatedAt,
    ),
    title: post.title,
    excerpt: post.excerpt,
    slug: { current: post.slug },
    section: post.section,
    body: post.body ?? [],
    publishedAt: toIsoString(post.publishedAt),
    categories,
    ...(mainImage ? { mainImage: mainImage } : {}),
  };
}

function pageRecord(page: typeof contentPages.$inferSelect): ContentRecord {
  return {
    ...genericRecord(
      page.sourceId,
      "page",
      page.metadata,
      page.sourceUpdatedAt,
    ),
    title: page.title,
    slug: { current: page.slug },
    route: page.route,
    content: page.content ?? [],
  };
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

function categoriesMatch(record: ContentRecord, categorySlug: string): boolean {
  const categories = Array.isArray(record.categories) ? record.categories : [];
  return categories.some(
    (category) =>
      category &&
      typeof category === "object" &&
      getSlug(category as ContentRecord) === categorySlug,
  );
}

function sortByPublishedAt(records: ContentRecord[]): ContentRecord[] {
  return records.sort((left, right) =>
    String(right.publishedAt ?? "").localeCompare(
      String(left.publishedAt ?? ""),
    ),
  );
}

async function hydratePosts(posts: (typeof contentPosts.$inferSelect)[]) {
  if (posts.length === 0) return [];
  const postIds = posts.map((post) => post.id);
  const imageSourceIds = posts
    .map((post) => post.mainImageSourceId)
    .filter((sourceId): sourceId is string => Boolean(sourceId));
  const [links, assets] = await Promise.all([
    database
      .select({ postId: postCategories.postId, category: contentCategories })
      .from(postCategories)
      .innerJoin(
        contentCategories,
        eq(postCategories.categoryId, contentCategories.id),
      )
      .where(inArray(postCategories.postId, postIds)),
    imageSourceIds.length > 0
      ? database
          .select()
          .from(mediaAssets)
          .where(inArray(mediaAssets.sourceId, imageSourceIds))
      : Promise.resolve([]),
  ]);

  const categoriesByPost = new Map<number, ContentRecord[]>();
  for (const link of links) {
    const categories = categoriesByPost.get(link.postId) ?? [];
    categories.push(categoryRecord(link.category));
    categoriesByPost.set(link.postId, categories);
  }
  const mediaBySourceId = new Map(
    assets.map((asset) => [asset.sourceId, mediaRecord(asset)]),
  );
  return posts.map((post) =>
    postRecord(
      post,
      categoriesByPost.get(post.id) ?? [],
      post.mainImageSourceId
        ? mediaBySourceId.get(post.mainImageSourceId)
        : undefined,
    ),
  );
}

const getPostDocuments = cache(async (section?: "thinking" | "blog") => {
  const posts = await database
    .select()
    .from(contentPosts)
    .where(section ? eq(contentPosts.section, section) : undefined)
    .orderBy(desc(contentPosts.publishedAt));
  return hydratePosts(posts);
});

async function getPostBySlug(slug: string) {
  const [post] = await database
    .select()
    .from(contentPosts)
    .where(eq(contentPosts.slug, slug))
    .limit(1);
  return post ? ((await hydratePosts([post]))[0] ?? null) : null;
}

async function getPageBySlug(slug: string) {
  const [page] = await database
    .select()
    .from(contentPages)
    .where(eq(contentPages.slug, slug))
    .limit(1);
  return page ? pageRecord(page) : null;
}

export const getPublicPageByRoute = cache(async (route: string) => {
  const [page] = await database
    .select()
    .from(contentPages)
    .where(eq(contentPages.route, route))
    .limit(1);
  return page ? pageRecord(page) : null;
});

async function getPageSeo(route: string) {
  const [seo] = await database
    .select()
    .from(pageSeo)
    .where(eq(pageSeo.route, route))
    .limit(1);
  return seo
    ? genericRecord(seo.sourceId, "pageSeo", seo.metadata, seo.sourceUpdatedAt)
    : null;
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

async function getCategoriesWithCounts() {
  const [categories, posts] = await Promise.all([
    database
      .select()
      .from(contentCategories)
      .orderBy(asc(contentCategories.title)),
    getPostDocuments("blog"),
  ]);
  return categories
    .map((category) => {
      const record = categoryRecord(category);
      return {
        _id: record._id,
        title: record.title,
        slug: record.slug,
        postCount: posts.filter((post) => categoriesMatch(post, category.slug))
          .length,
      };
    })
    .sort(
      (left, right) =>
        Number(right.postCount) - Number(left.postCount) ||
        String(left.title).localeCompare(String(right.title)),
    );
}

async function executeContentQuery(
  query: ContentQuery,
  params: ContentParams,
): Promise<unknown> {
  const start = Number(params.start ?? 0);
  const end = Number(params.end ?? 12);

  switch (query.name) {
    case "siteSettings": {
      const [settings] = await database
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.settingKey, "primary"))
        .limit(1);
      return settings
        ? genericRecord(
            settings.settingKey,
            "siteSettings",
            settings.settings,
            settings.sourceUpdatedAt,
          )
        : null;
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
    case "categories":
      return getCategoriesWithCounts();
    case "categoryBySlug": {
      const [category] = await database
        .select()
        .from(contentCategories)
        .where(eq(contentCategories.slug, String(params.slug)))
        .limit(1);
      return category ? categoryRecord(category) : null;
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
      return (
        await database
          .select()
          .from(teamMembers)
          .orderBy(asc(teamMembers.sortOrder))
      ).map((member) => {
        const record = genericRecord(
          member.sourceId,
          "teamMember",
          member.metadata,
          member.sourceUpdatedAt,
        );
        return { ...record, bio: portableTextToPlainText(record.bio) };
      });
    case "testimonials":
      return (
        await database
          .select()
          .from(contentTestimonials)
          .where(eq(contentTestimonials.kind, "standard"))
          .orderBy(asc(contentTestimonials.sortOrder))
      ).map((item) =>
        genericRecord(
          item.sourceId,
          "testimonial",
          item.metadata,
          item.sourceUpdatedAt,
        ),
      );
    case "boardAdvisors":
      return (
        await database
          .select()
          .from(boardAdvisors)
          .orderBy(asc(boardAdvisors.sortOrder))
      ).map((advisor) => {
        const record = genericRecord(
          advisor.sourceId,
          "boardAdvisor",
          advisor.metadata,
          advisor.sourceUpdatedAt,
        );
        return { ...record, bio: portableTextToPlainText(record.bio) };
      });
    case "caseStudies":
      return (
        await database
          .select()
          .from(caseStudies)
          .orderBy(asc(caseStudies.sortOrder))
      ).map((item) =>
        genericRecord(
          item.sourceId,
          "caseStudy",
          item.metadata,
          item.sourceUpdatedAt,
        ),
      );
    case "confidentialTestimonials":
      return (
        await database
          .select()
          .from(contentTestimonials)
          .where(eq(contentTestimonials.kind, "confidential"))
          .orderBy(asc(contentTestimonials.sortOrder))
      ).map((item) =>
        genericRecord(
          item.sourceId,
          "confidentialTestimonial",
          item.metadata,
          item.sourceUpdatedAt,
        ),
      );
    case "clientLogos":
      return (
        await database
          .select()
          .from(clientLogos)
          .orderBy(asc(clientLogos.sortOrder))
      ).map((logo) => {
        const record = genericRecord(
          logo.sourceId,
          "clientLogo",
          logo.metadata,
          logo.sourceUpdatedAt,
        );
        return { ...record, logoUrl: imageUrl(record.logo) };
      });
    case "allThinkingPosts":
      return (await getPostDocuments("thinking")).map((post) => ({
        ...postSummary(post),
        slug: getSlug(post),
      }));
    case "allPostSlugs":
      return (await getPostDocuments()).map(postSummary);
    case "allCategorySlugs":
      return (await database.select().from(contentCategories)).map(
        (category) => ({
          _id: category.sourceId,
          slug: { current: category.slug },
          _updatedAt: toIsoString(category.sourceUpdatedAt),
        }),
      );
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Existing page routes retain the former CMS client's permissive default during the relational query migration.
  fetch<T = any>(
    query: ContentQuery | string,
    params: ContentParams = {},
  ): Promise<T> {
    if (typeof query === "string") {
      throw new Error(
        "Raw GROQ queries are unavailable after the database migration.",
      );
    }
    return executeContentQuery(query, params) as Promise<T>;
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Existing page routes retain the former CMS client's permissive default during the relational query migration.
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
