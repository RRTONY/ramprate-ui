'use client'

import Link from 'next/link'
import {useSearchParams} from 'next/navigation'
import {Suspense} from 'react'

interface Category {
  _id: string
  title: string
  slug: {current: string}
}

function FilterPills({categories}: {categories: Category[]}) {
  const searchParams = useSearchParams()
  const active = searchParams.get('category')

  const pill =
    'shrink-0 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.12em] transition-all whitespace-nowrap'

  const activeStyle: React.CSSProperties = {
    background: 'var(--gold)',
    color: 'var(--dark)',
    fontFamily: 'var(--font-body)',
  }

  const inactiveStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    color: 'rgba(255,255,255,0.5)',
    border: '1px solid rgba(255,255,255,0.08)',
    fontFamily: 'var(--font-body)',
  }

  return (
    <div
      className="relative pt-6 mb-10 pb-8"
      style={{borderBottom: '1px solid rgba(255,255,255,0.07)'}}
    >
      {/* Right fade — hint that more pills exist off-screen */}
      <div
        className="absolute right-0 top-6 bottom-8 w-12 z-10 pointer-events-none"
        style={{background: 'linear-gradient(to left, var(--dark) 30%, transparent)'}}
      />

      <div className="flex gap-2 overflow-x-auto no-scrollbar pl-0.5 pr-14 pb-1">
        <Link
          href="/blog"
          className={`${pill} hover:opacity-80`}
          style={!active ? activeStyle : inactiveStyle}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/blog?category=${cat.slug.current}`}
            className={`${pill} hover:opacity-80`}
            style={active === cat.slug.current ? activeStyle : inactiveStyle}
          >
            {cat.title}
          </Link>
        ))}
      </div>
    </div>
  )
}

function FilterSkeleton() {
  return (
    <div
      className="relative pt-6 mb-10 pb-8"
      style={{borderBottom: '1px solid rgba(255,255,255,0.07)'}}
    >
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-1 pb-1">
        {[50, 70, 90, 60, 80, 55, 75, 65, 85].map((w, i) => (
          <div
            key={i}
            className="shrink-0 h-8 rounded-full animate-pulse"
            style={{width: `${w}px`, background: 'rgba(255,255,255,0.07)', animationDelay: `${i * 60}ms`}}
          />
        ))}
      </div>
    </div>
  )
}

export default function CategoryFilter({categories}: {categories: Category[]}) {
  return (
    <Suspense fallback={<FilterSkeleton />}>
      <FilterPills categories={categories} />
    </Suspense>
  )
}
