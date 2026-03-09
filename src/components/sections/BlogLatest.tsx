import {client} from '@/lib/sanity/client'
import {postsQuery} from '@/lib/sanity/queries'
import PostCard from '@/components/blog/PostCard'
import Link from 'next/link'

interface BlogLatestProps {
  heading?: string
  count?: number
}

export default async function BlogLatest({heading, count = 3}: BlogLatestProps) {
  const posts = await client.fetch(postsQuery, {start: 0, end: count})

  if (!posts?.length) return null

  return (
    <section className="py-24" style={{background: 'var(--dark-card)', color: '#fff'}}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-3"
              style={{color: 'var(--gold)', fontFamily: 'var(--font-body)'}}
            >
              Latest Thinking
            </p>
            <h2
              className="font-bold text-white"
              style={{fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)'}}
            >
              {heading || 'From the Blog'}
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
            style={{color: 'var(--gold)', fontFamily: 'var(--font-body)'}}
          >
            View all posts
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post: Record<string, unknown>) => (
            <PostCard key={post._id as string} post={post} />
          ))}
        </div>
        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{color: 'var(--gold)', fontFamily: 'var(--font-body)'}}
          >
            View all posts
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
