import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-5"
      style={{background: 'var(--dark)'}}
    >
      <div className="text-center">
        <p
          className="font-bold leading-none mb-4"
          style={{fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.06)', fontSize: 'clamp(3rem, 12vw, 6rem)'}}
        >
          404
        </p>
        <h1
          className="font-bold text-white mb-4"
          style={{fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)'}}
        >
          Page Not Found
        </h1>
        <p
          className="mb-10 max-w-md mx-auto"
          style={{color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)'}}
        >
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
          style={{background: 'var(--gold)', color: 'var(--dark)', fontFamily: 'var(--font-body)'}}
        >
          Go Home
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </div>
  )
}
