import {client} from '@/lib/sanity/client'
import {postBySlugQuery, allPostSlugsQuery} from '@/lib/sanity/queries'
import {PortableText, portableTextComponents} from '@/lib/sanity/portable-text'
import SanityImage from '@/components/shared/SanityImage'
import JsonLd, {blogPostJsonLd} from '@/components/shared/JsonLd'
import {urlFor} from '@/lib/sanity/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import type {Metadata} from 'next'

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await client.fetch(allPostSlugsQuery)
  return posts.map((post: {slug: {current: string}}) => ({slug: post.slug.current}))
}

export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata> {
  const {slug} = await params
  const post = await client.fetch(postBySlugQuery, {slug})
  if (!post) return {}
  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
    },
  }
}

export default async function BlogPostPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const post = await client.fetch(postBySlugQuery, {slug})

  if (!post) notFound()

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
          authorName: post.author?.name,
          image: post.mainImage ? urlFor(post.mainImage).width(1200).url() : undefined,
        })}
      />

      {/* Post header */}
      <div
        className="pt-32 pb-12 px-5 sm:px-8"
        style={{background: 'var(--dark-mid)'}}
      >
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-opacity hover:opacity-70"
            style={{color: 'var(--gold)', fontFamily: 'var(--font-body)'}}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Blog
          </Link>

          {post.categories?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {post.categories.map((cat: {title: string; slug: {current: string}}) => (
                <Link
                  key={cat.slug.current}
                  href={`/blog/category/${cat.slug.current}`}
                  className="text-[10px] font-semibold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full"
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

        {/* Footer nav */}
        <div className="mt-16 pt-8" style={{borderTop: '1px solid rgba(255,255,255,0.08)'}}>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
            style={{color: 'var(--gold)', fontFamily: 'var(--font-body)'}}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Blog
          </Link>
        </div>
      </article>
    </div>
  )
}
