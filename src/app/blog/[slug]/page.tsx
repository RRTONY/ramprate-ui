import { client } from "@/lib/sanity/client";
import {
  postBySlugQuery,
  allPostSlugsQuery,
  relatedPostsQuery,
  recentPostsQuery,
} from "@/lib/sanity/queries";
import {
  PortableText,
  portableTextComponents,
} from "@/lib/sanity/portable-text";
import SanityImage from "@/components/shared/SanityImage";
import JsonLd, {
  blogPostJsonLd,
  breadcrumbJsonLd,
} from "@/components/shared/JsonLd";
import { urlFor } from "@/lib/sanity/image";
import { stripSiteNameSuffix } from "@/lib/sanity/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CtaSection from "@/components/sections/CtaSection";

type RelatedPost = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: { alt?: string };
};

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await client.fetch(allPostSlugsQuery);
  return posts.map((post: { slug: { current: string } }) => ({
    slug: post.slug.current,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch(postBySlugQuery, { slug });
  if (!post) return {};
  const ogImage = post.seo?.ogImage || post.mainImage;
  // The root layout appends " | RampRate" to every title via its template.
  // Sanity-authored metaTitles sometimes already end in "| RampRate", which
  // would otherwise double up (e.g. "Post Title | RampRate | RampRate").
  const title = stripSiteNameSuffix(post.seo?.metaTitle) || post.title;
  const description = post.seo?.metaDescription || post.excerpt;
  const openGraph = {
    title,
    description,
    type: "article" as const,
    url: `https://ramprate.com/blog/${slug}`,
    publishedTime: post.publishedAt,
    modifiedTime: post._updatedAt,
    ...(ogImage && { images: [urlFor(ogImage).width(1200).height(630).url()] }),
  };
  return {
    title,
    description,
    keywords: post.seo?.keywords?.length
      ? post.seo.keywords
      : [
          ...(post.categories?.map((c: { title: string }) => c.title) ?? []),
          "RampRate blog",
          "enterprise IT sourcing",
        ],
    alternates: { canonical: `/blog/${slug}` },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: openGraph.images,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await client.fetch(postBySlugQuery, { slug });

  if (!post) notFound();

  const categorySlugs = (post.categories ?? []).map(
    (c: { slug: { current: string } }) => c.slug.current,
  );
  let relatedPosts: RelatedPost[] = categorySlugs.length
    ? await client.fetch(relatedPostsQuery, { slug, categorySlugs })
    : [];
  if (relatedPosts.length === 0) {
    relatedPosts = await client.fetch(recentPostsQuery, { slug });
  }

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="bg-dark min-h-screen">
      <JsonLd
        data={blogPostJsonLd({
          title: post.title,
          description: post.seo?.metaDescription || post.excerpt,
          url: `https://ramprate.com/blog/${slug}`,
          datePublished: post.publishedAt,
          dateModified: post._updatedAt,
          authorNames: post.authors?.map((a: { name: string }) => a.name),
          image: post.mainImage
            ? urlFor(post.mainImage).width(1200).url()
            : undefined,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Blog", url: "https://ramprate.com/blog" },
          { name: post.title, url: `https://ramprate.com/blog/${slug}` },
        ])}
      />

      {/* Post header */}
      <div className="pt-32 pb-12 px-5 sm:px-8 bg-dark-mid">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blog"
            aria-label="Back to Blog"
            className="font-body inline-flex items-center justify-center w-10 h-10 rounded-full border mb-8 transition-all hover:opacity-70 hover:border-(--gold) text-gold border-gold/30"
          >
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
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>

          {post.categories?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {post.categories.map(
                (cat: { title: string; slug: { current: string } }) => (
                  <Link
                    key={cat.slug.current}
                    href={`/blog?category=${cat.slug.current}`}
                    className="font-body text-xs font-semibold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full bg-gold/12 text-gold"
                  >
                    {cat.title}
                  </Link>
                ),
              )}
            </div>
          )}

          <h1 className="font-display font-bold text-white mb-5 leading-tight text-[clamp(1.75rem,4vw,3rem)]">
            {post.title}
          </h1>

          <div className="font-mono flex items-center gap-5 text-sm text-white/35">
            {post.authors?.length > 0 && (
              <span>
                By{" "}
                {post.authors.map(
                  (
                    a: { name: string; slug?: { current: string } },
                    i: number,
                  ) => (
                    <span key={a.name}>
                      {i > 0 && (i === post.authors.length - 1 ? " & " : ", ")}
                      {a.slug?.current ? (
                        <Link
                          href={`/about#${a.slug.current}`}
                          className="hover:text-gold underline-offset-2 hover:underline"
                        >
                          {a.name}
                        </Link>
                      ) : (
                        a.name
                      )}
                    </span>
                  ),
                )}
              </span>
            )}
            {date && <time>{date}</time>}
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
        {/* Featured image */}
        {post.mainImage && (
          <div className="mb-10 rounded-xl overflow-hidden">
            <SanityImage
              image={post.mainImage}
              alt={post.mainImage.alt || post.title}
              width={896}
              height={504}
              className="w-full"
              priority
            />
          </div>
        )}

        {/* Body */}
        {post.body && (
          <div className="max-w-none">
            <PortableText
              value={post.body}
              components={portableTextComponents}
            />
          </div>
        )}

        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-white/10">
            <h2 className="font-body text-xs font-semibold uppercase tracking-[0.2em] mb-6 text-gold">
              Continue Reading
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.slug.current}
                  href={`/blog/${rp.slug.current}`}
                  className="group block"
                >
                  {rp.mainImage && (
                    <div className="mb-3 rounded-lg overflow-hidden aspect-video">
                      <SanityImage
                        image={rp.mainImage}
                        alt={rp.mainImage.alt || rp.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h3 className="font-display font-semibold text-white leading-snug transition-colors group-hover:text-(--gold)">
                    {rp.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      <CtaSection
        heading="Ready to Talk?"
        body="The first conversation is always free. Let's see if RampRate is the right fit for what you're building."
        buttonText="Start a Conversation"
        buttonLink="/contact"
      />
    </div>
  );
}
