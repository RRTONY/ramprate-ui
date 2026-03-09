import SanityImage from '@/components/shared/SanityImage'
import Link from 'next/link'

interface HeroProps {
  headline?: string
  subheadline?: string
  backgroundImage?: any
  ctaText?: string
  ctaLink?: string
}

export default function Hero({headline, subheadline, backgroundImage, ctaText, ctaLink}: HeroProps) {
  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{background: 'var(--dark)'}}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        {backgroundImage ? (
          <SanityImage
            image={backgroundImage}
            alt=""
            width={1920}
            height={1080}
            className="w-full h-full object-cover object-right"
            priority
          />
        ) : (
          /* Gradient placeholder when no image */
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 70% 50%, rgba(212,168,67,0.08) 0%, transparent 60%), radial-gradient(ellipse at 30% 80%, rgba(139,69,19,0.06) 0%, transparent 50%)',
            }}
          />
        )}
        {/* Gradient overlays to deepen the left side for text */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, var(--dark), rgba(10,15,26,0.85), transparent)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(10,15,26,0.9), transparent, rgba(10,15,26,0.4))',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen max-w-7xl mx-auto px-5 sm:px-8 w-full">
        <div className="max-w-xl lg:max-w-2xl pt-28 pb-32">
          {/* Label pill */}
          <div className="mb-8">
            <span
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{background: 'var(--gold)'}} />
              <span
                className="text-[11px] sm:text-xs font-medium tracking-[0.2em] uppercase text-white/60"
                style={{fontFamily: 'var(--font-body)'}}
              >
                Enterprise Decisions Collective
              </span>
            </span>
          </div>

          {/* Headline */}
          {headline ? (
            <h1
              className="font-bold leading-[1.08] tracking-[-0.02em] text-white"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 6vw, 4.25rem)',
              }}
            >
              {headline}
            </h1>
          ) : (
            <h1
              className="font-bold leading-[1.08] tracking-[-0.02em] text-white"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 6vw, 4.25rem)',
              }}
            >
              The right person.
              <br />
              The right room.
              <br />
              <span style={{color: 'var(--gold)'}}>The right time.</span>
            </h1>
          )}

          {/* Sub-copy */}
          {subheadline && (
            <p
              className="mt-7 text-base sm:text-lg text-white/55 leading-relaxed max-w-lg"
              style={{fontFamily: 'var(--font-body)'}}
            >
              {subheadline}
            </p>
          )}
          {!subheadline && (
            <p
              className="mt-7 text-base sm:text-lg text-white/55 leading-relaxed max-w-lg"
              style={{fontFamily: 'var(--font-body)'}}
            >
              Since 2000, we&apos;ve brokered $24B+ in trajectory-changing connections across 50+ countries. We clean up intractable messes, speed up &amp; de-risk innovation, and align profit with purpose.
            </p>
          )}

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap gap-4">
            {ctaText && ctaLink ? (
              <Link
                href={ctaLink}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-md text-sm font-semibold transition-all duration-300 hover:opacity-90"
                style={{
                  background: 'var(--gold)',
                  color: 'var(--dark)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {ctaText}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            ) : (
              <Link
                href="/expertise"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-md text-sm font-semibold transition-all duration-300 hover:opacity-90"
                style={{
                  background: 'var(--gold)',
                  color: 'var(--dark)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Explore Our Work
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            )}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-md text-sm font-semibold border border-white/20 text-white/80 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-300"
              style={{fontFamily: 'var(--font-body)'}}
            >
              Start a Conversation
            </Link>
          </div>

          {/* Micro-stats */}
          <div className="mt-16 flex gap-8 sm:gap-12">
            {[
              {value: '$24B+', label: 'Decisions Brokered'},
              {value: '50+', label: 'Countries'},
              {value: '24', label: 'Years Deep'},
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  className="text-xl sm:text-2xl font-bold text-white/90 tracking-tight"
                  style={{fontFamily: 'var(--font-mono)'}}
                >
                  {stat.value}
                </div>
                <div
                  className="mt-0.5 text-[10px] sm:text-xs text-white/35 tracking-wide uppercase"
                  style={{fontFamily: 'var(--font-body)'}}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/30">
        <span className="text-[10px] tracking-[0.3em] uppercase" style={{fontFamily: 'var(--font-body)'}}>
          Scroll
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </section>
  )
}
