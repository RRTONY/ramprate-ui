import {client} from '@/lib/sanity/client'
import {postsQuery, postCountQuery, categoriesQuery} from '@/lib/sanity/queries'
import PostCard from '@/components/blog/PostCard'
import Pagination from '@/components/blog/Pagination'
import Link from 'next/link'
import type {Metadata} from 'next'

export const revalidate = 60
const POSTS_PER_PAGE = 9

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights on IT infrastructure, sourcing, cloud optimization, and emerging technology from RampRate.',
}

export default async function BlogPage({searchParams}: {searchParams: Promise<{page?: string}>}) {
  const params = await searchParams
  const currentPage = Number(params.page) || 1
  const start = (currentPage - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE

  const [posts, totalCount, categories] = await Promise.all([
    client.fetch(postsQuery, {start, end}),
    client.fetch(postCountQuery),
    client.fetch(categoriesQuery),
  ])

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)

  return (
    <div style={{background: 'var(--dark)', minHeight: '100vh'}}>
      {/* Page hero */}
      <div
        className="pt-32 pb-16 px-5 sm:px-8"
        style={{background: 'var(--dark-mid)'}}
      >
        <div className="max-w-7xl mx-auto">
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-4"
            style={{color: 'var(--gold)', fontFamily: 'var(--font-body)'}}
          >
            Insights
          </p>
          <h1
            className="font-bold text-white mb-4"
            style={{fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)'}}
          >
            Blog
          </h1>
          <p style={{color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)', fontSize: '1.05rem'}}>
            Practical insights on IT infrastructure, sourcing, and emerging technology.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
        {/* Category filter */}
        {categories?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <Link
              href="/blog"
              className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.12em] transition-all"
              style={{
                background: 'var(--gold)',
                color: 'var(--dark)',
                fontFamily: 'var(--font-body)',
              }}
            >
              All
            </Link>
            {categories.map((cat: {_id: string; title: string; slug: {current: string}}) => (
              <Link
                key={cat._id}
                href={`/blog/category/${cat.slug.current}`}
                className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.12em] transition-all hover:opacity-80"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {cat.title}
              </Link>
            ))}
          </div>
        )}

        {posts?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: Record<string, unknown>) => (
              <PostCard key={post._id as string} post={post} />
            ))}
          </div>
        ) : (
          <p style={{color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)'}}>No posts yet.</p>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
      </div>
    </div>
  )
}
