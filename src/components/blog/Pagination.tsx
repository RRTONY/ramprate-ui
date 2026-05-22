import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  activeCategory: string | null
}

function buildUrl(page: number, activeCategory: string | null): string {
  const params = new URLSearchParams()
  if (activeCategory) params.set('category', activeCategory)
  if (page > 1) params.set('page', String(page))
  const qs = params.toString()
  return `/blog${qs ? `?${qs}` : ''}`
}

export default function Pagination({currentPage, totalPages, activeCategory}: PaginationProps) {
  if (totalPages <= 1) return null

  /* Build visible pages: first, last, current ±1, ellipsis gaps */
  const pages: (number | 'ellipsis')[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis')
    }
  }

  const btnBase =
    'flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all'
  const ghost: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.65)',
    border: '1px solid rgba(255,255,255,0.08)',
    fontFamily: 'var(--font-body)',
  }
  const goldStyle: React.CSSProperties = {
    background: 'var(--gold)',
    color: 'var(--dark)',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
  }
  const numInactive: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    color: 'rgba(255,255,255,0.45)',
    border: '1px solid rgba(255,255,255,0.08)',
    fontFamily: 'var(--font-mono)',
  }

  const prevUrl = buildUrl(currentPage - 1, activeCategory)
  const nextUrl = buildUrl(currentPage + 1, activeCategory)

  return (
    <nav className="mt-16 sm:mt-20" aria-label="Pagination">

      {/* ── Mobile: icon buttons + page numbers ── */}
      <div className="flex sm:hidden items-center justify-center gap-1.5">
        {currentPage > 1 && (
          <Link href={prevUrl} className={`${btnBase} w-10 h-10 hover:opacity-80`} style={ghost}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
        )}

        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <span
              key={`e${i}`}
              className="w-8 text-center text-sm select-none"
              style={{color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)'}}
            >
              ···
            </span>
          ) : (
            <Link
              key={p}
              href={buildUrl(p, activeCategory)}
              className={`${btnBase} w-10 h-10`}
              style={p === currentPage ? goldStyle : numInactive}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p}
            </Link>
          ),
        )}

        {currentPage < totalPages && (
          <Link href={nextUrl} className={`${btnBase} w-10 h-10 hover:opacity-80`} style={ghost}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        )}
      </div>

      {/* ── Desktop: full page list ── */}
      <div className="hidden sm:flex items-center justify-center gap-1.5">
        {currentPage > 1 && (
          <Link href={prevUrl} className={`${btnBase} w-10 h-10 hover:opacity-80`} style={ghost}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
        )}

        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <span
              key={`e${i}`}
              className="w-10 text-center text-sm select-none"
              style={{color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)'}}
            >
              ···
            </span>
          ) : (
            <Link
              key={p}
              href={buildUrl(p, activeCategory)}
              className={`${btnBase} w-10 h-10`}
              style={p === currentPage ? goldStyle : numInactive}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p}
            </Link>
          ),
        )}

        {currentPage < totalPages && (
          <Link href={nextUrl} className={`${btnBase} w-10 h-10 hover:opacity-80`} style={ghost}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        )}
      </div>

    </nav>
  )
}
