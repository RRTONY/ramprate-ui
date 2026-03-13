import Link from 'next/link'
import {client} from '@/lib/sanity/client'
import {allThinkingPostsQuery} from '@/lib/sanity/queries'
import type {Metadata} from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Thinking — 25 Years of Perspectives | RampRate',
  description:
    'Evergreen analysis and thought leadership from RampRate — frameworks, perspectives, and deep dives on IT infrastructure, blockchain, and enterprise strategy.',
}

interface ThinkingPost {
  _id: string
  title: string
  slug: string
  publishedAt: string
  excerpt: string | null
}

function groupByYear(posts: ThinkingPost[]): Record<number, ThinkingPost[]> {
  return posts.reduce<Record<number, ThinkingPost[]>>((acc, post) => {
    const year = new Date(post.publishedAt).getFullYear()
    if (!acc[year]) acc[year] = []
    acc[year].push(post)
    return acc
  }, {})
}

export default async function ThinkingPage() {
  const posts: ThinkingPost[] = await client.fetch(allThinkingPostsQuery) ?? []
  const grouped = groupByYear(posts)
  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a)

  return (
    <main style={{background: 'var(--dark)', minHeight: '100vh'}}>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden" style={{background: 'var(--dark)'}}>
        <div className="glass-orb glass-orb-amber w-[400px] h-[400px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-blue w-[250px] h-[250px] bottom-0 -left-24" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[oklch(0.82_0.15_75)] mb-4 block" style={{fontFamily: 'var(--font-body)'}}>Perspectives</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{fontFamily: 'var(--font-display)'}}>
            25 Years of <span className="text-[oklch(0.82_0.15_75)]">Thinking</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl" style={{fontFamily: 'var(--font-body)'}}>
            Evergreen analysis on IT infrastructure, blockchain, enterprise strategy, and conscious business. Not trends — principles.
          </p>
        </div>
      </section>

      {/* Author bio callout */}
      <section style={{background: '#0d1117'}} className="py-10 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="flex items-center gap-5 p-6 rounded-xl border border-white/10" style={{background: 'rgba(255,255,255,0.03)'}}>
            <div className="w-16 h-16 rounded-full overflow-hidden shrink-0" style={{background: 'rgba(255,255,255,0.1)'}}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/EtSyoZsiJamreUAA.png"
                alt="Tony Greenberg"
                className="w-full h-full object-cover"
                style={{objectPosition: 'center 15%'}}
              />
            </div>
            <div>
              <div className="text-white font-semibold" style={{fontFamily: 'var(--font-display)'}}>Tony Greenberg</div>
              <div className="text-xs text-[oklch(0.82_0.15_75)] mb-1" style={{fontFamily: 'var(--font-body)'}}>Founder & CEO · Published since 2010</div>
              <p className="text-white/50 text-sm" style={{fontFamily: 'var(--font-body)'}}>
                25 years at the intersection of enterprise IT, blockchain, and conscious business. Harvard, USC, Forbes, Business Insider.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Year-grouped archive list */}
      <section className="py-16" style={{background: '#0d1117'}}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          {posts.length === 0 && (
            <p className="text-white/40 text-sm" style={{fontFamily: 'var(--font-body)'}}>No posts yet — check back soon.</p>
          )}
          {years.map((year) => (
            <div key={year} className="mb-14">
              <h2
                className="text-xs font-semibold tracking-[0.25em] uppercase mb-6 pb-3 border-b border-white/10"
                style={{color: 'oklch(0.82 0.15 75)', fontFamily: 'var(--font-mono)'}}
              >
                {year}
              </h2>
              <div className="space-y-1">
                {grouped[year].map((post) => (
                  <article key={post._id}>
                    <Link
                      href={`/thinking/${post.slug}`}
                      className="group flex items-start gap-4 py-4 px-3 rounded-lg -mx-3 border-l-2 border-transparent hover:border-[oklch(0.82_0.15_75)] hover:bg-white/[0.03] transition-all"
                    >
                      <div className="text-xs text-white/30 pt-0.5 shrink-0 w-16 text-right" style={{fontFamily: 'var(--font-mono)'}}>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-white/80 group-hover:text-[oklch(0.82_0.15_75)] transition-colors font-medium leading-snug"
                          style={{fontFamily: 'var(--font-body)'}}
                        >
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-white/35 text-sm mt-1 line-clamp-1" style={{fontFamily: 'var(--font-body)'}}>
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/20 group-hover:text-[oklch(0.82_0.15_75)] shrink-0 mt-0.5 transition-colors"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28" style={{background: 'oklch(0.14 0.02 260)'}}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[oklch(0.82_0.15_75)] mb-4" style={{fontFamily: 'var(--font-mono)'}}>
            A thought for you
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6" style={{fontFamily: 'var(--font-display)'}}>
            Thinking Is Free.<br />
            <span className="text-[oklch(0.82_0.15_75)]">Execution Costs.</span>
          </h2>
          <p className="text-white/60 leading-relaxed mb-10 max-w-xl mx-auto" style={{fontFamily: 'var(--font-body)'}}>
            You've read the thinking. Now let's put it to work. Tell us what's broken and we'll tell you what it's worth to fix.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-bold transition-all shadow-lg"
            style={{background: 'oklch(0.82 0.15 75)', color: 'oklch(0.15 0.02 75)', fontFamily: 'var(--font-body)', boxShadow: '0 10px 30px oklch(0.82 0.15 75 / 0.25)'}}
          >
            Tell Us What's Broken
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>
    </main>
  )
}
