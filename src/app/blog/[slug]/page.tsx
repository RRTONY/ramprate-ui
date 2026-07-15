import {client} from '@/lib/sanity/client'
import {postBySlugQuery, allPostSlugsQuery, relatedPostsQuery, recentPostsQuery} from '@/lib/sanity/queries'
import {PortableText, portableTextComponents} from '@/lib/sanity/portable-text'
import SanityImage from '@/components/shared/SanityImage'
import JsonLd, {blogPostJsonLd, breadcrumbJsonLd} from '@/components/shared/JsonLd'
import {urlFor} from '@/lib/sanity/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import CtaSection from '@/components/sections/CtaSection'

type RelatedPost = {
  _id: string
  title: string
  slug: {current: string}
  excerpt?: string
  mainImage?: {alt?: string}
}

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await client.fetch(allPostSlugsQuery)
  return posts.map((post: {slug: {current: string}}) => ({slug: post.slug.current}))
}

export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata> {
  const {slug} = await params
  const post = await client.fetch(postBySlugQuery, {slug})
  if (!post) return {}
  const ogImage = post.seo?.ogImage || post.mainImage
  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    keywords: post.seo?.keywords?.length
      ? post.seo.keywords
      : [
          ...(post.categories?.map((c: {title: string}) => c.title) ?? []),
          'RampRate blog',
          'enterprise IT sourcing',
        ],
    alternates: {canonical: `/blog/${slug}`},
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      type: 'article',
      url: `https://ramprate.com/blog/${slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      ...(ogImage && {images: [urlFor(ogImage).width(1200).height(630).url()]}),
    },
  }
}

export default async function BlogPostPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const post = await client.fetch(postBySlugQuery, {slug})

  if (!post) notFound()

  const categorySlugs = (post.categories ?? []).map((c: {slug: {current: string}}) => c.slug.current)
  let relatedPosts: RelatedPost[] = categorySlugs.length
    ? await client.fetch(relatedPostsQuery, {slug, categorySlugs})
    : []
  if (relatedPosts.length === 0) {
    relatedPosts = await client.fetch(recentPostsQuery, {slug})
  }

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div style={{background: 'var(--dark)', minHeight: '100vh'}}>
      <JsonLd
        data={blogPostJsonLd({
          title: post.title,
          description: post.seo?.metaDescription || post.excerpt,
          url: `https://ramprate.com/blog/${slug}`,
          datePublished: post.publishedAt,
          dateModified: post._updatedAt,
          authorName: post.author?.name,
          image: post.mainImage ? urlFor(post.mainImage).width(1200).url() : undefined,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          {name: 'Home', url: 'https://ramprate.com'},
          {name: 'Blog', url: 'https://ramprate.com/blog'},
          {name: post.title, url: `https://ramprate.com/blog/${slug}`},
        ])}
      />

      {/* Post header */}
      <div
        className="pt-32 pb-12 px-5 sm:px-8"
        style={{background: 'var(--dark-mid)'}}
      >
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blog"
            aria-label="Back to Blog"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border mb-8 transition-all hover:opacity-70 hover:border-(--gold)"
            style={{color: 'var(--gold)', borderColor: 'rgba(212,168,67,0.3)', fontFamily: 'var(--font-body)'}}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>

          {post.categories?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {post.categories.map((cat: {title: string; slug: {current: string}}) => (
                <Link
                  key={cat.slug.current}
                  href={`/blog?category=${cat.slug.current}`}
                  className="text-xs font-semibold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full"
                  style={{
                    background: 'rgba(212,168,67,0.12)',
                    color: 'var(--gold)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {cat.title}
                </Link>
              ))}
            </div>
          )}

          <h1
            className="font-bold text-white mb-5 leading-tight"
            style={{fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 3rem)'}}
          >
            {post.title}
          </h1>

          <div className="flex items-center gap-5 text-sm" style={{color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)'}}>
            {post.author?.name && <span>By {post.author.name}</span>}
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
            <PortableText value={post.body} components={portableTextComponents} />
          </div>
        )}

        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t" style={{borderColor: 'rgba(255,255,255,0.1)'}}>
            <h2
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
              style={{color: 'var(--gold)', fontFamily: 'var(--font-body)'}}
            >
              Continue Reading
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <Link key={rp.slug.current} href={`/blog/${rp.slug.current}`} className="group block">
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
                  <h3
                    className="font-semibold text-white leading-snug transition-colors group-hover:text-(--gold)"
                    style={{fontFamily: 'var(--font-display)'}}
                  >
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
  )
}
