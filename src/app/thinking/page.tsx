import {client} from '@/lib/sanity/client'
import {thinkingPostsQuery, thinkingPostCountQuery} from '@/lib/sanity/queries'
import PostCard from '@/components/blog/PostCard'
import Pagination from '@/components/blog/Pagination'
import type {Metadata} from 'next'

export const revalidate = 60
const POSTS_PER_PAGE = 9

export const metadata: Metadata = {
  title: 'Thinking',
  description:
    'Evergreen analysis and thought leadership from RampRate — frameworks, perspectives, and deep dives on IT infrastructure, blockchain, and enterprise strategy.',
}

export default async function ThinkingPage({searchParams}: {searchParams: Promise<{page?: string}>}) {
  const params = await searchParams
  const currentPage = Number(params.page) || 1
  const start = (currentPage - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE

  const [posts, totalCount] = await Promise.all([
    client.fetch(thinkingPostsQuery, {start, end}),
    client.fetch(thinkingPostCountQuery),
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
            Perspectives
          </p>
          <h1
            className="font-bold text-white mb-4"
            style={{fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)'}}
          >
            Thinking
          </h1>
          <p
            className="max-w-2xl"
            style={{color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)', fontSize: '1.05rem'}}
          >
            Evergreen analysis and thought leadership — frameworks, perspectives, and deep dives.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
        {posts?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: Record<string, unknown>) => (
              <PostCard key={post._id as string} post={post} />
            ))}
          </div>
        ) : (
          <p style={{color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)'}}>No posts yet.</p>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/thinking" />
      </div>
    </div>
  )
}
