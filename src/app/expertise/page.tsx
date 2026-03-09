import Link from 'next/link'
import type {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'Expertise | RampRate',
  description:
    'Four practices. One mission: transparency, skin in the game, and principals who execute.',
}

const practices = [
  {
    name: 'RampRate',
    tagline: 'Enterprise IT Sourcing',
    desc: '150K+ data points. 350+ vendors. 80 countries. We benchmark every contract against real transaction intelligence — not theory. $24B+ in enterprise decisions brokered.',
    color: 'oklch(0.82 0.15 75)',
    href: '/sourcing',
    stats: ['$24B+ Brokered', '150K+ Data Points', '350+ Vendors'],
  },
  {
    name: 'Syzygy',
    tagline: 'Growth Strategy for Founders',
    desc: "GTM acceleration, revenue architecture, and strategic introductions for growth-stage companies. We don't advise from the sidelines — we execute with you daily.",
    color: 'oklch(0.65 0.2 150)',
    href: '/growth',
    stats: ['99% Intro-to-Contract', '4+ Year Engagements', 'US Market Entry'],
  },
  {
    name: 'Stratum',
    tagline: 'Web3 & Blockchain Advisory',
    desc: 'Token design, DAO governance, decentralized infrastructure. From protocol architecture to enterprise adoption — we bridge Web3 and the Fortune 500.',
    color: 'oklch(0.6 0.2 280)',
    href: '/web3',
    stats: ['Token Design', 'DAO Governance', 'Enterprise Web3'],
  },
  {
    name: 'ImpactSoul',
    tagline: 'Impact & Regenerative Consulting',
    desc: 'ESG strategy, B Corp certification, grant management, and asset tokenization for regenerative projects. Technology as a delivery mechanism for social and environmental impact.',
    color: 'oklch(0.7 0.15 30)',
    href: '/impactsoul',
    stats: ['B Corp Certified', '$3M+ Grants', 'Regenerative Focus'],
  },
]

export default function ExpertisePage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, oklch(0.14 0.01 250) 0%, oklch(0.18 0.02 260) 50%, oklch(0.14 0.01 250) 100%)',
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          {/* Label */}
          <div className="mb-6">
            <span
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full"
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{background: 'oklch(0.6 0.2 280)'}}
              />
              <span
                className="text-[11px] font-medium uppercase"
                style={{letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)'}}
              >
                Our Practices
              </span>
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white max-w-4xl"
            style={{fontFamily: 'var(--font-display)'}}
          >
            Four Brands.{' '}
            <span style={{color: 'oklch(0.82 0.15 75)'}}>One Mission.</span>
          </h1>

          <p
            className="mt-6 text-base sm:text-lg leading-relaxed max-w-2xl"
            style={{color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)'}}
          >
            Each practice serves a different market with the same values: transparency,
            skin in the game, and principals who execute.
          </p>
        </div>
      </section>

      {/* Practice Cards */}
      <section className="py-24" style={{background: '#0d1117'}}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-12">
          {practices.map((p) => (
            <div
              key={p.name}
              className="relative rounded-2xl overflow-hidden"
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              {/* Colored left border accent */}
              <div
                className="absolute top-0 left-0 w-1 h-full"
                style={{backgroundColor: p.color}}
              />

              <div className="p-8 sm:p-10">
                {/* Tagline */}
                <p
                  className="text-xs uppercase mb-2"
                  style={{
                    color: p.color,
                    letterSpacing: '0.2em',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {p.tagline}
                </p>

                {/* Name */}
                <h2
                  className="text-3xl sm:text-4xl font-bold text-white mb-4"
                  style={{fontFamily: 'var(--font-display)'}}
                >
                  {p.name}
                </h2>

                {/* Description */}
                <p
                  className="leading-relaxed max-w-2xl mb-6"
                  style={{color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)'}}
                >
                  {p.desc}
                </p>

                {/* Stats pills */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {p.stats.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{
                        border: `1px solid color-mix(in oklch, ${p.color} 30%, transparent)`,
                        color: p.color,
                        backgroundColor: `color-mix(in oklch, ${p.color} 8%, transparent)`,
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={p.href}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold transition-all hover:brightness-110"
                  style={{
                    backgroundColor: p.color,
                    color: 'oklch(0.15 0.02 75)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Learn More
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{background: '#0a0f1a'}}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
            style={{fontFamily: 'var(--font-display)'}}
          >
            Not Sure Which Practice Fits?
          </h2>
          <p
            className="mb-10 max-w-xl mx-auto"
            style={{color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)'}}
          >
            Tell us what&apos;s broken. We&apos;ll figure out which team — or combination — gets it
            done.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-bold transition-all hover:brightness-110"
            style={{
              background: 'oklch(0.82 0.15 75)',
              color: 'oklch(0.15 0.02 75)',
              boxShadow: '0 8px 32px color-mix(in oklch, oklch(0.82 0.15 75) 20%, transparent)',
              fontFamily: 'var(--font-body)',
            }}
          >
            Tell Us What&apos;s Broken
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}
