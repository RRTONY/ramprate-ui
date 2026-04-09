import SanityImage from '@/components/shared/SanityImage'

interface Pillar {
  title?: string
  description?: string
  icon?: any
  link?: string
}

interface ServicePillarsProps {
  heading?: string
  pillars?: Pillar[]
}

export default function ServicePillars({heading, pillars}: ServicePillarsProps) {
  if (!pillars?.length) return null

  return (
    <section className="py-24" style={{background: 'var(--dark-mid)', color: '#fff'}}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {heading && (
          <div className="mb-14 text-center">
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-3"
              style={{color: 'var(--gold)', fontFamily: 'var(--font-body)'}}
            >
              What We Do
            </p>
            <h2
              className="font-bold text-white"
              style={{fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)'}}
            >
              {heading}
            </h2>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="rounded-xl p-8"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderTop: '3px solid var(--gold)',
              }}
            >
              {pillar.icon && (
                <div className="mb-5">
                  <SanityImage image={pillar.icon} alt={pillar.title || ''} width={48} height={48} />
                </div>
              )}
              <h3
                className="text-lg font-bold text-white mb-3"
                style={{fontFamily: 'var(--font-display)'}}
              >
                {pillar.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-body)'}}>
                {pillar.description}
              </p>
              {pillar.link && (
                <a
                  href={pillar.link}
                  className="inline-flex items-center gap-1.5 mt-5 text-sm font-medium transition-colors hover:opacity-80"
                  style={{color: 'var(--gold)', fontFamily: 'var(--font-body)'}}
                >
                  Learn more
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
