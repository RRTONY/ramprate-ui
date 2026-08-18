import Link from 'next/link'
import type {Metadata} from 'next'

export const metadata: Metadata = {
  robots: {index: false, follow: false},
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-dark">
      <div className="text-center">
        <p className="font-mono font-bold leading-none mb-4 text-white/6 text-[clamp(3rem,12vw,6rem)]">
          404
        </p>
        <h1 className="font-display font-bold text-white mb-4 text-[clamp(1.5rem,4vw,2.5rem)]">
          Page Not Found
        </h1>
        <p className="font-body mb-10 max-w-md mx-auto text-white/45">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link
          href="/"
          className="font-body inline-flex items-center gap-2.5 px-7 py-3.5 rounded-md text-sm font-semibold transition-opacity hover:opacity-90 bg-gold text-dark"
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
