import type {Metadata} from 'next'
import Link from 'next/link'
import CtaSection from '@/components/sections/CtaSection'
import HowWeWorkTabs from '@/components/sections/HowWeWorkTabs'

export const metadata: Metadata = {
  title: 'How We Work',
  description:
    "RampRate's engagement model: exclusive mandates, one-party fees, and fully transparent deal structure. 25 years, $10B+ in decisions structured, 250+ enterprise clients.",
  keywords: [
    'IT sourcing advisory',
    'exclusive mandate',
    'fee transparency',
    'enterprise advisory',
    'RampRate process',
    'B Corp advisory',
    'deal structure',
  ],
  alternates: {canonical: 'https://ramprate.com/howwework'},
  openGraph: {
    title: 'How We Work | RampRate',
    description: '25 years. $10B+ in decisions structured. One model built on exclusivity, transparency, and win-win outcomes.',
    url: 'https://ramprate.com/howwework',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How We Work | RampRate',
    description: '25 years. $10B+ in decisions structured. One model built on exclusivity, transparency, and win-win outcomes.',
    images: ['/og.png'],
  },
}

const heroStats = [
  {value: '25', label: 'Years in Business'},
  {value: '$10B+', label: 'Decisions Structured'},
  {value: '250+', label: 'Enterprise Clients'},
  {value: '50+', label: 'Countries Served'},
]

const badges = ['Buyer Exclusive', 'One-Party Fee', 'Apples-to-Apples', 'B Corp Verified']

export default function HowWeWorkPage() {
  return (
    <div style={{background: 'var(--dark)'}}>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 px-5 sm:px-8">
        <div
          className="absolute top-0 right-0 w-125 h-125 rounded-full opacity-20 pointer-events-none"
          style={{background: 'oklch(0.82 0.15 75)', filter: 'blur(100px)'}}
        />
        <div
          className="absolute bottom-0 left-0 w-87.5 h-87.5 rounded-full opacity-10 pointer-events-none"
          style={{background: 'oklch(0.55 0.22 260)', filter: 'blur(80px)'}}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Label */}
          <div className="mb-5">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-[0.2em]"
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.5)',
                fontFamily: 'var(--font-body)',
              }}
            >
              The RampRate Model
            </span>
          </div>

          {/* Heading */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white max-w-3xl mb-6"
            style={{fontFamily: 'var(--font-display)'}}
          >
            How We{' '}
            <span style={{color: 'oklch(0.82 0.15 75)'}}>Work.</span>
          </h1>

          {/* Body */}
          <p
            className="text-base sm:text-lg leading-relaxed max-w-2xl mb-8"
            style={{color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)'}}
          >
            25 years. $10B+ in decisions structured. 250+ enterprise clients.
            One model built on exclusivity, transparency, and win-win outcomes.
            Prepared for attorney review.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-12">
            {badges.map(badge => (
              <span
                key={badge}
                className="text-[11px] font-semibold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full"
                style={{
                  border: '1px solid rgba(212,168,67,0.3)',
                  background: 'rgba(212,168,67,0.08)',
                  color: 'oklch(0.82 0.15 75)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mb-10">
            {heroStats.map(stat => (
              <div key={stat.label}>
                <div
                  className="text-2xl sm:text-3xl font-bold"
                  style={{color: 'oklch(0.82 0.15 75)', fontFamily: 'var(--font-mono)'}}
                >
                  {stat.value}
                </div>
                <div
                  className="mt-1 text-[10px] uppercase tracking-wider"
                  style={{color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)'}}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold transition-all hover:opacity-90"
              style={{
                background: 'oklch(0.82 0.15 75)',
                color: 'oklch(0.18 0.03 50)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Start a Conversation
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link
              href="/proof"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold border transition-colors hover:bg-white/5"
              style={{
                borderColor: 'rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'var(--font-body)',
              }}
            >
              See Client Proof
            </Link>
          </div>
        </div>
      </section>

      {/* ── TABBED CONTENT ── */}
      <HowWeWorkTabs />

      {/* ── CTA ── */}
      <CtaSection
        heading="Ready to Work With Us?"
        body="No upfront fees. We eat what we hunt. Let's structure a deal built on exclusivity, transparency, and real alignment."
        buttonText="Start a Conversation"
        buttonLink="/contact"
      />

    </div>
  )
}
