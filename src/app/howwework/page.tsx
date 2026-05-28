import type {Metadata} from 'next'
import Link from 'next/link'
import CtaSection from '@/components/sections/CtaSection'
import HowWeWorkTabs from '@/components/sections/HowWeWorkTabs'

export const metadata: Metadata = {
  title: 'How We Work | RampRate',
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
    description:
      '25 years. $10B+ in decisions structured. One model built on exclusivity, transparency, and win-win outcomes.',
    url: 'https://ramprate.com/howwework',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How We Work | RampRate',
    description:
      '25 years. $10B+ in decisions structured. One model built on exclusivity, transparency, and win-win outcomes.',
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
    <div style={{background: 'var(--dark)', color: '#fff', fontFamily: 'var(--font-body)'}}>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-28 pb-20 px-5 sm:px-8">
        <div className="glass-orb glass-orb-amber absolute w-125 h-125 -top-24 -right-32 opacity-20" />
        <div className="glass-orb glass-orb-blue absolute w-100 h-100 bottom-0 -left-24 opacity-15" />

        <div className="relative max-w-6xl mx-auto">
          {/* Label */}
          <div className="mb-5">
            <span
              className="text-xs font-semibold uppercase tracking-[0.25em] px-3 py-1.5 rounded-full border"
              style={{
                color: 'var(--gold)',
                borderColor: 'rgba(212,168,67,0.3)',
                background: 'rgba(212,168,67,0.08)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              The RampRate Model
            </span>
          </div>

          {/* Heading */}
          <h1
            className="font-bold text-white mb-6"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              lineHeight: 1.05,
            }}
          >
            How We<br />
            <span style={{color: 'var(--gold)'}}>Work.</span>
          </h1>

          {/* Subheading */}
          <p
            className="max-w-2xl mb-8 text-base sm:text-lg leading-relaxed"
            style={{color: 'rgba(255,255,255,0.6)'}}
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
                className="text-xs font-semibold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border"
                style={{
                  color: 'var(--gold)',
                  borderColor: 'rgba(212,168,67,0.3)',
                  background: 'rgba(212,168,67,0.08)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {heroStats.map(stat => (
              <div key={stat.label} className="glass-card p-5 text-center">
                <div
                  className="font-bold mb-1"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                    color: 'var(--gold)',
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs uppercase tracking-wider leading-snug"
                  style={{color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)'}}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA links */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
              style={{background: 'var(--gold)', color: '#000', fontFamily: 'var(--font-body)'}}
            >
              Start a Conversation
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link
              href="/proof"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold border transition-colors hover:bg-white/5"
              style={{borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)'}}
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
