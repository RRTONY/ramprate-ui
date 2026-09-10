import { desc, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import { getAuthorizedAdmin } from "@/lib/admin/access";
import {
  contentCategories,
  contentPages,
  contentPosts,
  postCategories,
  siteSettings,
} from "@/lib/content/schema";

const resources = ["posts", "pages", "categories", "settings"] as const;
type Resource = (typeof resources)[number];
type RecordValue = Record<string, unknown>;
type RouteContext = { params: Promise<{ resource: string }> };

const recordSchema = yup
  .mixed<RecordValue>()
  .test("object", "Metadata must be an object.", (value) =>
    Boolean(value && typeof value === "object" && !Array.isArray(value)),
  )
  .default({});

const postInputSchema = yup.object({
  sourceId: yup.string().min(1).max(128).optional(),
  slug: yup.string().required().max(255),
  section: yup
    .mixed<"blog" | "thinking">()
    .oneOf(["blog", "thinking"])
    .default("blog"),
  title: yup.string().required().max(512),
  excerpt: yup.string().max(10000).nullable().optional(),
  body: yup.array(yup.mixed()).default([]),
  mainImageSourceId: yup.string().max(128).nullable().optional(),
  publishedAt: yup
    .string()
    .test(
      "iso-date",
      "Published date must be ISO formatted.",
      (value) => !value || Number.isFinite(Date.parse(value)),
    )
    .nullable()
    .optional(),
  categorySourceIds: yup.array(yup.string().max(128)).default([]),
  metadata: recordSchema,
});

const pageInputSchema = yup.object({
  sourceId: yup.string().min(1).max(128).optional(),
  slug: yup.string().required().max(255),
  route: yup.string().min(1).max(512).nullable().optional(),
  title: yup.string().max(512).nullable().optional(),
  content: yup.array(yup.mixed()).default([]),
  metadata: recordSchema,
});

const categoryInputSchema = yup.object({
  sourceId: yup.string().min(1).max(128).optional(),
  slug: yup.string().required().max(255),
  title: yup.string().required().max(512),
  description: yup.string().max(10000).nullable().optional(),
  metadata: recordSchema,
});

const settingsInputSchema = yup.object({
  companyName: yup.string().max(255).nullable().optional(),
  email: yup.string().email().nullable().optional(),
  phone: yup.string().max(64).nullable().optional(),
  address: yup.string().max(10000).nullable().optional(),
  logoSourceId: yup.string().max(128).nullable().optional(),
  settings: recordSchema,
});

function database() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for admin content management.");
  }
  return drizzle(process.env.DATABASE_URL);
}

function notFoundResource() {
  return NextResponse.json(
    { error: "Unknown content resource." },
    { status: 404 },
  );
}

async function authorize(request: NextRequest) {
  const administrator = await getAuthorizedAdmin(request);
  return administrator
    ? null
    : NextResponse.json(
        { error: "Administrator access is required." },
        { status: 403 },
      );
}

function parseResource(value: string): Resource | null {
  return resources.includes(value as Resource) ? (value as Resource) : null;
}

function sourceId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

async function validate<T>(
  schema: yup.Schema<T>,
  input: unknown,
): Promise<T | null> {
  try {
    return await schema.validate(input, {
      abortEarly: false,
      stripUnknown: false,
    });
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  const denied = await authorize(request);
  if (denied) return denied;
  const resource = parseResource((await context.params).resource);
  if (!resource) return notFoundResource();
  const db = database();

  switch (resource) {
    case "posts":
      return NextResponse.json({
        items: await db
          .select()
          .from(contentPosts)
          .orderBy(desc(contentPosts.publishedAt)),
      });
    case "pages":
      return NextResponse.json({
        items: await db
          .select()
          .from(contentPages)
          .orderBy(desc(contentPages.updatedAt)),
      });
    case "categories":
      return NextResponse.json({
        items: await db
          .select()
          .from(contentCategories)
          .orderBy(contentCategories.title),
      });
    case "settings": {
      const [settings] = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.settingKey, "primary"))
        .limit(1);
      return NextResponse.json({ item: settings ?? null });
    }
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const denied = await authorize(request);
  if (denied) return denied;
  const resource = parseResource((await context.params).resource);
  if (!resource) return notFoundResource();
  const input = await request.json().catch(() => null);
  const db = database();

  if (resource === "posts") {
    const value = await validate(postInputSchema, input);
    if (!value) {
      return NextResponse.json(
        { error: "Invalid post content." },
        { status: 400 },
      );
    }
    const identifier = value.sourceId ?? sourceId("post");
    const metadata = {
      ...value.metadata,
      title: value.title,
      slug: { current: value.slug },
      excerpt: value.excerpt ?? undefined,
      body: value.body,
      section: value.section,
    };
    await db
      .insert(contentPosts)
      .values({
        sourceId: identifier,
        slug: value.slug,
        section: value.section,
        title: value.title,
        excerpt: value.excerpt ?? null,
        body: value.body,
        mainImageSourceId: value.mainImageSourceId ?? null,
        publishedAt: value.publishedAt ? new Date(value.publishedAt) : null,
        sourceUpdatedAt: new Date(),
        metadata,
      })
      .onDuplicateKeyUpdate({
        set: {
          slug: value.slug,
          section: value.section,
          title: value.title,
          excerpt: value.excerpt ?? null,
          body: value.body,
          mainImageSourceId: value.mainImageSourceId ?? null,
          publishedAt: value.publishedAt ? new Date(value.publishedAt) : null,
          sourceUpdatedAt: new Date(),
          metadata,
        },
      });

    const [post] = await db
      .select({ id: contentPosts.id })
      .from(contentPosts)
      .where(eq(contentPosts.sourceId, identifier))
      .limit(1);
    if (post) {
      await db.delete(postCategories).where(eq(postCategories.postId, post.id));
      const categorySourceIds = value.categorySourceIds.filter(
        (identifier): identifier is string => typeof identifier === "string",
      );
      if (categorySourceIds.length > 0) {
        const categories = await db
          .select({ id: contentCategories.id })
          .from(contentCategories)
          .where(inArray(contentCategories.sourceId, categorySourceIds));
        if (categories.length > 0) {
          await db
            .insert(postCategories)
            .values(
              categories.map((category) => ({
                postId: post.id,
                categoryId: category.id,
              })),
            );
        }
      }
    }
    return NextResponse.json({ ok: true, sourceId: identifier });
  }

  if (resource === "pages") {
    const value = await validate(pageInputSchema, input);
    if (!value) {
      return NextResponse.json(
        { error: "Invalid page content." },
        { status: 400 },
      );
    }
    const identifier = value.sourceId ?? sourceId("page");
    const metadata = {
      ...value.metadata,
      title: value.title ?? value.metadata.title,
      slug: { current: value.slug },
      route: value.route ?? value.metadata.route,
      content: value.content,
    };
    await db
      .insert(contentPages)
      .values({
        sourceId: identifier,
        slug: value.slug,
        route: value.route ?? null,
        title: value.title ?? null,
        content: value.content,
        metadata,
        sourceUpdatedAt: new Date(),
      })
      .onDuplicateKeyUpdate({
        set: {
          slug: value.slug,
          route: value.route ?? null,
          title: value.title ?? null,
          content: value.content,
          metadata,
          sourceUpdatedAt: new Date(),
        },
      });
    return NextResponse.json({ ok: true, sourceId: identifier });
  }

  if (resource === "categories") {
    const value = await validate(categoryInputSchema, input);
    if (!value) {
      return NextResponse.json(
        { error: "Invalid category content." },
        { status: 400 },
      );
    }
    const identifier = value.sourceId ?? sourceId("category");
    const metadata = {
      ...value.metadata,
      title: value.title,
      slug: { current: value.slug },
      description: value.description ?? undefined,
    };
    await db
      .insert(contentCategories)
      .values({
        sourceId: identifier,
        slug: value.slug,
        title: value.title,
        description: value.description ?? null,
        metadata,
        sourceUpdatedAt: new Date(),
      })
      .onDuplicateKeyUpdate({
        set: {
          slug: value.slug,
          title: value.title,
          description: value.description ?? null,
          metadata,
          sourceUpdatedAt: new Date(),
        },
      });
    return NextResponse.json({ ok: true, sourceId: identifier });
  }

  const value = await validate(settingsInputSchema, input);
  if (!value) {
    return NextResponse.json(
      { error: "Invalid site settings." },
      { status: 400 },
    );
  }
  await db
    .insert(siteSettings)
    .values({
      settingKey: "primary",
      companyName: value.companyName ?? null,
      logoSourceId: value.logoSourceId ?? null,
      email: value.email ?? null,
      phone: value.phone ?? null,
      address: value.address ?? null,
      settings: value.settings,
      sourceUpdatedAt: new Date(),
    })
    .onDuplicateKeyUpdate({
      set: {
        companyName: value.companyName ?? null,
        logoSourceId: value.logoSourceId ?? null,
        email: value.email ?? null,
        phone: value.phone ?? null,
        address: value.address ?? null,
        settings: value.settings,
        sourceUpdatedAt: new Date(),
      },
    });
  return NextResponse.json({ ok: true, sourceId: "primary" });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const denied = await authorize(request);
  if (denied) return denied;
  const resource = parseResource((await context.params).resource);
  if (!resource || resource === "settings") return notFoundResource();
  const sourceId = request.nextUrl.searchParams.get("sourceId");
  if (!sourceId) {
    return NextResponse.json(
      { error: "sourceId is required." },
      { status: 400 },
    );
  }

  const db = database();
  if (resource === "posts") {
    await db.delete(contentPosts).where(eq(contentPosts.sourceId, sourceId));
  } else if (resource === "pages") {
    await db.delete(contentPages).where(eq(contentPages.sourceId, sourceId));
  } else {
    await db
      .delete(contentCategories)
      .where(eq(contentCategories.sourceId, sourceId));
  }
  return NextResponse.json({ ok: true });
}
