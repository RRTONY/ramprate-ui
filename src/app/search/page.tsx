import type { Metadata } from "next";
import Link from "next/link";
import { sanityFetch } from "@/lib/sanity/client";
import { searchPostsQuery } from "@/lib/sanity/queries";
import SearchInput from "@/components/shared/SearchInput";
import SanityImage from "@/components/shared/SanityImage";
import JsonLd from "@/components/shared/JsonLd";
import { matchSitePages, type SitePage } from "@/lib/site-pages";

interface SanityPost {
  _id: string;
  title?: string;
  slug?: { current: string };
  publishedAt?: string;
  excerpt?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mainImage?: any;
  section?: string;
  categories?: { title?: string; slug?: { current: string } }[];
}

export const revalidate = 30;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const q = sp.q?.trim() || "";

  return {
    title: q ? `Results for "${q}"` : "Search",
    description: q
      ? `Search results for "${q}" - browse RampRate pages, blog posts, and insights on enterprise IT sourcing, cloud, and infrastructure.`
      : "Search RampRate - find pages, blog posts, and insights on enterprise IT sourcing, cloud, and infrastructure advisory.",
    alternates: {
      canonical: q
        ? `https://ramprate.com/search?q=${encodeURIComponent(q)}`
        : "https://ramprate.com/search",
    },
    openGraph: {
      title: q ? `Results for "${q}" | RampRate` : "Search | RampRate",
      description:
        "Search RampRate blog posts, insights, and resources on enterprise IT sourcing and infrastructure.",
      type: "website",
      url: q
        ? `https://ramprate.com/search?q=${encodeURIComponent(q)}`
        : "https://ramprate.com/search",
      siteName: "RampRate",
      images: ["/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: q ? `Results for "${q}" | RampRate` : "Search | RampRate",
      description: "Search RampRate blog posts and insights.",
    },
    // Noindex individual search-result pages to avoid duplicate content issues
    robots: {
      index: !q,
      follow: true,
    },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() || "";

  let allPosts: SanityPost[] = [];

  if (q) {
    // Filter stop-words and keep up to 4 meaningful terms with prefix wildcard.
    // GROQ `match` uses AND logic across space-separated tokens, so fewer,
    // more specific words give better recall than a 10-word phrase.
    const STOP = new Set([
      "a",
      "an",
      "the",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "from",
      "up",
      "is",
      "it",
      "its",
      "this",
      "that",
      "are",
      "was",
      "be",
      "do",
      "how",
      "what",
      "why",
      "when",
      "where",
      "who",
    ]);
    const words = q.split(/\s+/).filter(Boolean);
    const significant = words.filter(
      (w) => w.length > 2 && !STOP.has(w.toLowerCase()),
    );
    const searchWords = (significant.length > 0 ? significant : words).slice(
      0,
      4,
    );
    const groqQ = searchWords.map((w) => `${w}*`).join(" ");

    allPosts =
      (await sanityFetch<SanityPost[]>({
        query: searchPostsQuery,
        params: { q: groqQ },
        tags: ["posts"],
        revalidate: 30,
      })) ?? [];
  }

  const blogPosts = allPosts.filter((p) => p.section !== "thinking");
  const thinkingPosts = allPosts.filter((p) => p.section === "thinking");
  const pageMatches = q ? matchSitePages(q, 6) : [];
  const totalCount = allPosts.length + pageMatches.length;

  const searchJsonLd = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: q ? `Results for "${q}" | RampRate` : "Search | RampRate",
    url: q
      ? `https://ramprate.com/search?q=${encodeURIComponent(q)}`
      : "https://ramprate.com/search",
  };

  return (
    <div style={{ background: "var(--dark)", minHeight: "100vh" }}>
      <JsonLd data={searchJsonLd} />

      {/* ── HERO ── */}
      <section className="relative pt-28 sm:pt-36 pb-14 sm:pb-20 overflow-hidden">
        <div className="glass-orb glass-orb-amber absolute w-96 h-96 -top-40 -right-40 opacity-15" />
        <div className="glass-orb glass-orb-blue absolute w-64 h-64 bottom-0 -left-24 opacity-10" />

        {/* max-w-7xl matches the header and results section so left edges align */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
            style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
          >
            Search
          </span>

          <h1
            className="font-bold text-white mb-8 leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
            }}
          >
            {q ? (
              <>
                Results for{" "}
                <span style={{ color: "oklch(0.82 0.15 75)" }}>
                  &ldquo;{q}&rdquo;
                </span>
              </>
            ) : (
              "Search RampRate"
            )}
          </h1>

          {/* Cap search input width so it doesn't stretch across the full 7xl on desktop */}
          <div className="max-w-2xl">
            <SearchInput initialQuery={q} />
          </div>

          {q && totalCount > 0 && (
            <p
              className="mt-4 text-sm"
              style={{
                color: "rgba(255,255,255,0.35)",
                fontFamily: "var(--font-body)",
              }}
            >
              {totalCount} result{totalCount !== 1 ? "s" : ""} found
            </p>
          )}
        </div>
      </section>

      {/* ── RESULTS ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-10 sm:pt-14 pb-24">
        {!q && <EmptyQuery />}
        {q && totalCount === 0 && <NoResults query={q} />}

        {/* Pages */}
        {pageMatches.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-lg sm:text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Pages
                <span
                  className="ml-2 text-sm font-normal"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  ({pageMatches.length})
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageMatches.map((page) => (
                <SearchPageCard key={page.path} page={page} />
              ))}
            </div>
          </section>
        )}

        {/* Blog Posts */}
        {blogPosts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-lg sm:text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Blog Posts
                <span
                  className="ml-2 text-sm font-normal"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  ({blogPosts.length})
                </span>
              </h2>
              <Link
                href="/blog"
                className="text-xs font-medium transition-opacity hover:opacity-70"
                style={{ color: "var(--gold)", fontFamily: "var(--font-mono)" }}
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <SearchPostCard key={post._id} post={post} basePath="/blog" />
              ))}
            </div>
          </section>
        )}

        {/* Thinking Posts */}
        {thinkingPosts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-lg sm:text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Thinking
                <span
                  className="ml-2 text-sm font-normal"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  ({thinkingPosts.length})
                </span>
              </h2>
              <Link
                href="/thinking"
                className="text-xs font-medium transition-opacity hover:opacity-70"
                style={{ color: "var(--gold)", fontFamily: "var(--font-mono)" }}
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {thinkingPosts.map((post) => (
                <SearchPostCard
                  key={post._id}
                  post={post}
                  basePath="/thinking"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ── Card for a matched static page (not a Sanity post) ── */
function SearchPageCard({ page }: { page: SitePage }) {
  return (
    <Link
      href={page.path}
      className="block rounded-xl p-5 sm:p-6 transition-all duration-300 hover:translate-y-[-2px]"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span
        className="inline-block text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full mb-3"
        style={{
          background: "rgba(212,168,67,0.10)",
          color: "var(--gold)",
          border: "1px solid rgba(212,168,67,0.18)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {page.type === "practice" ? "Practice" : "Page"}
      </span>
      <h3
        className="text-base font-bold text-white mb-2 leading-snug hover:opacity-80 transition-opacity"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {page.title}
      </h3>
      <p
        className="text-sm leading-relaxed"
        style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-body)" }}
      >
        {page.description}
      </p>
    </Link>
  );
}

/* ── Card used only on the search results page ── */
function SearchPostCard({
  post,
  basePath,
}: {
  post: SanityPost;
  basePath: string;
}) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const href = `${basePath}/${post.slug?.current}`;

  return (
    <article
      className="rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-2px]"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Thumbnail */}
      {post.mainImage ? (
        <Link href={href} className="block overflow-hidden">
          <SanityImage
            image={post.mainImage}
            alt={post.title || ""}
            width={600}
            height={340}
            className="w-full h-40 sm:h-48 object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
          />
        </Link>
      ) : (
        <Link
          href={href}
          className="block h-40 sm:h-48 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.14 0.03 260) 0%, oklch(0.18 0.04 280) 50%, oklch(0.14 0.02 240) 100%)",
          }}
        >
          <div
            className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-10"
            style={{
              border: "1px solid oklch(0.82 0.15 75)",
              background: "transparent",
            }}
          />
          <div
            className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-15"
            style={{
              border: "1px solid oklch(0.82 0.15 75)",
              background: "transparent",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.25em] px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(212,168,67,0.12)",
                color: "oklch(0.82 0.15 75)",
                border: "1px solid rgba(212,168,67,0.2)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {post.categories?.[0]?.title ?? "RampRate"}
            </span>
          </div>
        </Link>
      )}

      {/* Body */}
      <div className="p-5 sm:p-6">
        {/* Section badge */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full"
            style={{
              background:
                basePath === "/thinking"
                  ? "rgba(100,120,255,0.12)"
                  : "rgba(212,168,67,0.10)",
              color:
                basePath === "/thinking"
                  ? "rgba(160,175,255,0.8)"
                  : "var(--gold)",
              border:
                basePath === "/thinking"
                  ? "1px solid rgba(100,120,255,0.2)"
                  : "1px solid rgba(212,168,67,0.18)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {basePath === "/thinking" ? "Thinking" : "Blog"}
          </span>
          {post.categories?.map((cat) => (
            <Link
              key={cat.slug?.current}
              href={`/blog?category=${cat.slug?.current}`}
              className="text-[9px] font-semibold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full transition-opacity hover:opacity-70"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.35)",
                fontFamily: "var(--font-body)",
              }}
            >
              {cat.title}
            </Link>
          ))}
        </div>

        <h3
          className="text-base font-bold text-white mb-2 leading-snug"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <Link href={href} className="hover:opacity-80 transition-opacity">
            {post.title}
          </Link>
        </h3>

        {post.excerpt && (
          <p
            className="text-sm mb-4 line-clamp-3 leading-relaxed"
            style={{
              color: "rgba(255,255,255,0.45)",
              fontFamily: "var(--font-body)",
            }}
          >
            {post.excerpt}
          </p>
        )}

        {date && (
          <p
            className="text-xs font-medium"
            style={{
              color: "rgba(255,255,255,0.25)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {date}
          </p>
        )}
      </div>
    </article>
  );
}

/* ── Empty state: no query entered ── */
function EmptyQuery() {
  const suggested = [
    "IT Sourcing",
    "Syzygy",
    "Web3",
    "ImpactSoul",
    "Private Advisory",
    "BioChain Sourcing",
    "Payments Advisory",
    "Become a Supplier",
    "Client Intake",
    "SPY Index",
    "B Corp",
    "Data Center",
  ];
  return (
    <div className="flex flex-col items-center justify-center py-20 sm:py-28 text-center px-4">
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-8"
        style={{
          background: "rgba(212,168,67,0.07)",
          border: "1px solid rgba(212,168,67,0.18)",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>
      <h2
        className="text-xl sm:text-2xl font-bold text-white mb-3"
        style={{ fontFamily: "var(--font-display)" }}
      >
        What are you looking for?
      </h2>
      <p
        className="text-sm max-w-sm leading-relaxed mb-8"
        style={{
          color: "rgba(255,255,255,0.4)",
          fontFamily: "var(--font-body)",
        }}
      >
        Search pages, blog posts, and insights across RampRate - enterprise IT
        sourcing, cloud infrastructure, Web3, BioChain Sourcing, and more.
      </p>
      <div className="flex flex-wrap gap-2.5 justify-center">
        {suggested.map((term) => (
          <Link
            key={term}
            href={`/search?q=${encodeURIComponent(term)}`}
            className="px-4 py-2 rounded-full text-sm transition-all hover:opacity-80"
            style={{
              background: "rgba(212,168,67,0.08)",
              color: "var(--gold)",
              border: "1px solid rgba(212,168,67,0.18)",
              fontFamily: "var(--font-body)",
            }}
          >
            {term}
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ── No results state ── */
function NoResults({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 sm:py-28 text-center px-4">
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-8"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>
      <h2
        className="text-xl sm:text-2xl font-bold text-white mb-3"
        style={{ fontFamily: "var(--font-display)" }}
      >
        No results for &ldquo;{query}&rdquo;
      </h2>
      <p
        className="text-sm max-w-sm leading-relaxed mb-8"
        style={{
          color: "rgba(255,255,255,0.4)",
          fontFamily: "var(--font-body)",
        }}
      >
        Try different or shorter keywords, or browse our content directly.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          href="/blog"
          className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
          style={{
            background: "var(--gold)",
            color: "var(--dark)",
            fontFamily: "var(--font-body)",
          }}
        >
          Browse Blog
        </Link>
        <Link
          href="/thinking"
          className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.8)",
            border: "1px solid rgba(255,255,255,0.1)",
            fontFamily: "var(--font-body)",
          }}
        >
          Browse Thinking
        </Link>
      </div>
    </div>
  );
}
