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
    <section className="py-24 text-white bg-dark-mid">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {heading && (
          <div className="mb-14 text-center">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] mb-3 text-gold">
              What We Do
            </p>
            <h2 className="font-display font-bold text-white text-[clamp(1.75rem,4vw,2.75rem)]">
              {heading}
            </h2>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="rounded-xl p-8 bg-white/3 border border-white/6 border-t-[3px] border-t-gold"
            >
              {pillar.icon && (
                <div className="mb-5">
                  <SanityImage image={pillar.icon} alt={pillar.title || ''} width={48} height={48} />
                </div>
              )}
              <h3 className="font-display text-lg font-bold text-white mb-3">
                {pillar.title}
              </h3>
              <p className="font-body text-sm leading-relaxed text-white/55">
                {pillar.description}
              </p>
              {pillar.link && (
                <a
                  href={pillar.link}
                  className="font-body inline-flex items-center gap-1.5 mt-5 text-sm font-medium transition-colors hover:opacity-80 text-gold"
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
