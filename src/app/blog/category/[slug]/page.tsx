import {client} from '@/lib/sanity/client'
import {
  postsByCategoryQuery,
  postCountByCategoryQuery,
  categoriesQuery,
  allCategorySlugsQuery,
} from '@/lib/sanity/queries'
import PostCard from '@/components/blog/PostCard'
import Pagination from '@/components/blog/Pagination'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import type {Metadata} from 'next'

export const revalidate = 60
const POSTS_PER_PAGE = 9

export async function generateStaticParams() {
  const categories = await client.fetch(allCategorySlugsQuery)
  return categories.map((cat: {slug: {current: string}}) => ({slug: cat.slug.current}))
}

export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata> {
  const {slug} = await params
  const categories = await client.fetch(categoriesQuery)
  const category = categories?.find((c: {slug: {current: string}}) => c.slug.current === slug)
  return {
    title: category ? `${category.title} - Blog` : 'Category',
    description: `Blog posts in ${category?.title || slug}`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{slug: string}>
  searchParams: Promise<{page?: string}>
}) {
  const {slug} = await params
  const sp = await searchParams
  const currentPage = Number(sp.page) || 1
  const start = (currentPage - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE

  const [posts, totalCount, categories] = await Promise.all([
    client.fetch(postsByCategoryQuery, {categorySlug: slug, start, end}),
    client.fetch(postCountByCategoryQuery, {categorySlug: slug}),
    client.fetch(categoriesQuery),
  ])

  const currentCategory = categories?.find(
    (c: {slug: {current: string}}) => c.slug.current === slug,
  )

  if (!currentCategory) notFound()

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)

  return (
    <div style={{background: 'var(--dark)', minHeight: '100vh'}}>
      {/* Page hero */}
      <div
        className="pt-32 pb-16 px-5 sm:px-8"
        style={{background: 'var(--dark-mid)'}}
      >
        <div className="max-w-7xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium mb-6 transition-opacity hover:opacity-70"
            style={{color: 'var(--gold)', fontFamily: 'var(--font-body)'}}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            All posts
          </Link>
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-3"
            style={{color: 'var(--gold)', fontFamily: 'var(--font-body)'}}
          >
            Category
          </p>
          <h1
            className="font-bold text-white mb-3"
            style={{fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)'}}
          >
            {currentCategory.title}
          </h1>
          <p style={{color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem'}}>
            {totalCount} {totalCount === 1 ? 'post' : 'posts'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/blog"
            className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.12em] transition-all hover:opacity-80"
            style={{
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(255,255,255,0.08)',
              fontFamily: 'var(--font-body)',
            }}
          >
            All
          </Link>
          {categories?.map((cat: {_id: string; title: string; slug: {current: string}}) => (
            <Link
              key={cat._id}
              href={`/blog/category/${cat.slug.current}`}
              className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.12em] transition-all hover:opacity-80"
              style={
                cat.slug.current === slug
                  ? {background: 'var(--gold)', color: 'var(--dark)', fontFamily: 'var(--font-body)'}
                  : {
                      background: 'rgba(255,255,255,0.06)',
                      color: 'rgba(255,255,255,0.6)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      fontFamily: 'var(--font-body)',
                    }
              }
            >
              {cat.title}
            </Link>
          ))}
        </div>

        {posts?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: Record<string, unknown>) => (
              <PostCard key={post._id as string} post={post} />
            ))}
          </div>
        ) : (
          <p style={{color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)'}}>No posts in this category yet.</p>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={`/blog/category/${slug}`}
        />
      </div>
    </div>
  )
}
