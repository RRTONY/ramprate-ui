import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export default function Pagination({currentPage, totalPages, basePath}: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav className="flex justify-center gap-2 mt-16">
      {currentPage > 1 && (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="px-5 py-2.5 rounded-md text-sm font-medium transition-all hover:opacity-80"
          style={{
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: 'var(--font-body)',
          }}
        >
          Previous
        </Link>
      )}

      {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={`${basePath}?page=${page}`}
          className="px-4 py-2.5 rounded-md text-sm font-medium transition-all"
          style={
            page === currentPage
              ? {background: 'var(--gold)', color: 'var(--dark)', fontFamily: 'var(--font-body)'}
              : {
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontFamily: 'var(--font-body)',
                }
          }
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-5 py-2.5 rounded-md text-sm font-medium transition-all hover:opacity-80"
          style={{
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: 'var(--font-body)',
          }}
        >
          Next
        </Link>
      )}
    </nav>
  )
}
