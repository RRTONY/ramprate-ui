import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export default function Pagination({currentPage, totalPages, basePath}: PaginationProps) {
  if (totalPages <= 1) return null

  // Build visible page numbers: always show first, last, current ±1, with ellipsis gaps
  const pages: (number | 'ellipsis')[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis')
    }
  }

  return (
    <nav aria-label="Pagination" className="mt-16">
      {/* Mobile: Prev / Page X of Y / Next */}
      <div className="flex sm:hidden items-center justify-between gap-3">
        {currentPage > 1 ? (
          <Link
            href={`${basePath}?page=${currentPage - 1}`}
            className="flex-1 text-center py-3 rounded-md text-sm font-semibold transition-all"
            style={{background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-body)'}}
          >
            ← Previous
          </Link>
        ) : (
          <span className="flex-1" />
        )}

        <span className="text-xs text-white/40 shrink-0" style={{fontFamily: 'var(--font-body)'}}>
          {currentPage} / {totalPages}
        </span>

        {currentPage < totalPages ? (
          <Link
            href={`${basePath}?page=${currentPage + 1}`}
            className="flex-1 text-center py-3 rounded-md text-sm font-semibold transition-all"
            style={{background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-body)'}}
          >
            Next →
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </div>

      {/* Tablet+: full page numbers with ellipsis */}
      <div className="hidden sm:flex flex-wrap justify-center gap-2">
        {currentPage > 1 && (
          <Link
            href={`${basePath}?page=${currentPage - 1}`}
            className="px-5 py-2.5 rounded-md text-sm font-medium transition-all hover:opacity-80"
            style={{background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-body)'}}
          >
            Previous
          </Link>
        )}

        {pages.map((page, i) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${i}`} className="px-3 py-2.5 text-sm text-white/30" style={{fontFamily: 'var(--font-body)'}}>…</span>
          ) : (
            <Link
              key={page}
              href={`${basePath}?page=${page}`}
              className="px-4 py-2.5 rounded-md text-sm font-medium transition-all min-w-[44px] text-center"
              style={
                page === currentPage
                  ? {background: 'var(--gold)', color: 'var(--dark)', fontFamily: 'var(--font-body)'}
                  : {background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-body)'}
              }
            >
              {page}
            </Link>
          )
        )}

        {currentPage < totalPages && (
          <Link
            href={`${basePath}?page=${currentPage + 1}`}
            className="px-5 py-2.5 rounded-md text-sm font-medium transition-all hover:opacity-80"
            style={{background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-body)'}}
          >
            Next
          </Link>
        )}
      </div>
    </nav>
  )
}
