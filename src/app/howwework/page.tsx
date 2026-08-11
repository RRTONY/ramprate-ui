import type {Metadata} from 'next'
import Link from 'next/link'
import CtaSection from '@/components/sections/CtaSection'
import HowWeWorkTabs from '@/components/sections/HowWeWorkTabs'
import JsonLd, {breadcrumbJsonLd} from '@/components/shared/JsonLd'

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
    <div className="bg-dark">
      <JsonLd
        data={breadcrumbJsonLd([
          {name: 'Home', url: 'https://ramprate.com'},
          {name: 'How We Work', url: 'https://ramprate.com/howwework'},
        ])}
      />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 px-5 sm:px-8">
        <div className="absolute top-0 right-0 w-125 h-125 rounded-full opacity-20 pointer-events-none bg-amber blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-87.5 h-87.5 rounded-full opacity-10 pointer-events-none bg-[oklch(0.55_0.22_260)] blur-[80px]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Label */}
          <div className="mb-5">
            <span className="font-body inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-[0.2em] border border-white/10 bg-white/5 text-white/50">
              The RampRate Model
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white max-w-3xl mb-6">
            How We{' '}
            <span className="text-amber">Work.</span>
          </h1>

          {/* Body */}
          <p className="font-body text-base sm:text-lg leading-relaxed max-w-2xl mb-8 text-white/50">
            25 years. $10B+ in decisions structured. 250+ enterprise clients.
            One model built on exclusivity, transparency, and win-win outcomes.
            Prepared for attorney review.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-12">
            {badges.map(badge => (
              <span
                key={badge}
                className="font-mono text-[11px] font-semibold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border border-gold/30 bg-gold/8 text-amber"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mb-10">
            {heroStats.map(stat => (
              <div key={stat.label}>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-amber">
                  {stat.value}
                </div>
                <div className="font-body mt-1 text-[10px] uppercase tracking-wider text-white/40">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="font-body inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold transition-all hover:opacity-90 bg-amber text-[oklch(0.18_0.03_50)]"
            >
              Start a Conversation
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link
              href="/proof"
              className="font-body inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold border transition-colors hover:bg-white/5 border-white/15 text-white/70"
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
