import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { sanityFetch } from "@/lib/sanity/client";
import {
  postsQuery,
  postsByCategoryQuery,
  postCountQuery,
  postCountByCategoryQuery,
  categoriesQuery,
} from "@/lib/sanity/queries";
import PostCard from "@/components/blog/PostCard";
import Pagination from "@/components/blog/Pagination";
import CategoryFilter from "@/components/blog/CategoryFilter";
import { getPageSeo, withSeoOverrides } from "@/lib/sanity/seo";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

interface SanityPost {
  _id: string;
  title?: string;
  slug?: { current: string };
  publishedAt?: string;
  excerpt?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mainImage?: any;
  categories?: { title?: string; slug?: { current: string } }[];
}

interface SanityCategory {
  _id: string;
  title: string;
  slug: { current: string };
}

export const revalidate = 60;
const POSTS_PER_PAGE = 9;

const FALLBACK_METADATA: Metadata = {
  title: "Blog - IT Sourcing & Infrastructure Insights",
  description:
    "Expert insights on enterprise IT sourcing, cloud optimization, data center procurement, network strategy, and emerging technology from the RampRate advisory team.",
  keywords: [
    "IT sourcing",
    "cloud optimization",
    "data center procurement",
    "enterprise IT",
    "technology",
    "network strategy",
    "managed services",
    "RampRate blog",
  ],
  alternates: {
    canonical: "https://ramprate.com/blog",
  },
  openGraph: {
    title: "Blog | RampRate - IT Sourcing & Infrastructure Insights",
    description:
      "Expert insights on enterprise IT sourcing, cloud optimization, data center procurement, and emerging technology from RampRate.",
    type: "website",
    url: "https://ramprate.com/blog",
    siteName: "RampRate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | RampRate",
    description:
      "Expert insights on enterprise IT sourcing, cloud optimization, and emerging technology from RampRate.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageSeo("/blog");
  return withSeoOverrides(FALLBACK_METADATA, data?.seo);
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const sp = await searchParams;

  return (
    <div style={{ background: "var(--dark)", minHeight: "100vh" }}>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Blog", url: "https://ramprate.com/blog" },
        ])}
      />
      <Suspense fallback={<BlogSkeleton />}>
        <BlogContent page={sp.page} category={sp.category} />
      </Suspense>
    </div>
  );
}

async function BlogContent({
  page,
  category,
}: {
  page?: string;
  category?: string;
}) {
  const currentPage = Number(page) || 1;
  const activeCategory = category ?? null;
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  const [posts, totalCount, categories] = await Promise.all([
    sanityFetch({
      query: activeCategory ? postsByCategoryQuery : postsQuery,
      params: activeCategory
        ? { categorySlug: activeCategory, start, end }
        : { start, end },
      tags: ["posts"],
    }),
    sanityFetch({
      query: activeCategory ? postCountByCategoryQuery : postCountQuery,
      params: activeCategory ? { categorySlug: activeCategory } : {},
      tags: ["posts"],
    }),
    sanityFetch({ query: categoriesQuery, tags: ["categories"] }),
  ]);

  const count = (totalCount as number) ?? 0;
  const totalPages = Math.ceil(count / POSTS_PER_PAGE);
  const postList = (posts as SanityPost[]) ?? [];
  const categoryList = (categories as SanityCategory[]) ?? [];
  const activeCategoryObj = activeCategory
    ? categoryList.find((c) => c.slug?.current === activeCategory)
    : null;

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative pt-32 pb-14 sm:pb-20 overflow-hidden">
        <div className="glass-orb glass-orb-amber absolute w-100 h-100 -top-40 -right-40 opacity-20" />
        <div className="glass-orb glass-orb-blue absolute w-64 h-64 bottom-0 -left-24 opacity-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase mb-4 block text-gold">
            {activeCategoryObj ? "Category" : "Insights"}
          </span>
          <h1 className="font-display font-bold text-white mb-4 leading-tight text-[clamp(2.5rem,5vw,4rem)]">
            {activeCategoryObj ? activeCategoryObj.title : "Blog"}
          </h1>
          <p className="font-body text-base sm:text-lg leading-relaxed max-w-2xl text-white/50">
            {activeCategoryObj
              ? `${count} post${count !== 1 ? "s" : ""} in this category`
              : "Practical insights on technology, sourcing, cloud, and emerging technology."}
          </p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-24">
        {/* Category filter - client component, reads URL search params */}
        <CategoryFilter categories={categoryList} />

        {/* Posts or empty */}
        {postList.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {postList.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              activeCategory={activeCategory}
            />
          </>
        ) : (
          <EmptyState categoryName={activeCategoryObj?.title} />
        )}
      </div>
    </>
  );
}

function BlogSkeleton() {
  return (
    <div className="bg-dark min-h-screen">
      {/* Hero skeleton */}
      <section className="pt-32 pb-14 sm:pb-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="h-3 w-16 rounded-full animate-pulse mb-5 bg-gold/20" />
          <div className="h-12 sm:h-16 w-36 rounded-lg animate-pulse mb-4 bg-white/8" />
          <div className="h-4 w-72 rounded-full animate-pulse bg-white/5" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-24">
        {/* Category filter skeleton */}
        <div className="relative pt-6 mb-10 pb-8 border-b border-white/7">
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-1 pb-1">
            {[50, 38, 90, 64, 76, 52, 68, 82, 58].map((w, i) => (
              <div
                key={i}
                className="shrink-0 h-8 rounded-full animate-pulse bg-white/7"
                style={{ width: `${w}px`, animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Cards grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden bg-white/3 border border-white/6"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div
                className="h-48 w-full animate-pulse bg-white/6"
                style={{ animationDelay: `${i * 50}ms` }}
              />
              <div className="p-6 space-y-3">
                <div
                  className="h-5 w-16 rounded-full animate-pulse bg-gold/10"
                  style={{ animationDelay: `${i * 50 + 30}ms` }}
                />
                <div className="h-5 w-full rounded animate-pulse bg-white/7" />
                <div className="h-5 w-3/4 rounded animate-pulse bg-white/5" />
                <div className="pt-1 space-y-2">
                  <div className="h-3 w-full rounded animate-pulse bg-white/4" />
                  <div className="h-3 w-5/6 rounded animate-pulse bg-white/4" />
                  <div className="h-3 w-4/6 rounded animate-pulse bg-white/4" />
                </div>
                <div className="h-3 w-24 rounded animate-pulse bg-white/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ categoryName }: { categoryName?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-8 bg-gold/7 border border-gold/18">
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          className="stroke-gold"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>
      <h3 className="font-display text-2xl font-bold text-white mb-3">
        {categoryName ? `No posts in "${categoryName}"` : "No posts yet"}
      </h3>
      <p className="font-body text-sm max-w-sm leading-relaxed mb-8 text-white/40">
        {categoryName
          ? "We haven't published anything in this category yet. Browse all posts or try another category."
          : "No blog posts have been published yet. Check back soon."}
      </p>
      {categoryName && (
        <Link
          href="/blog"
          className="font-body inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 bg-gold text-dark"
        >
          View all posts
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
