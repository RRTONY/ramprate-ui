import SanityImage from '@/components/shared/SanityImage'

interface Logo {
  name?: string
  logo?: any
  url?: string
}

interface LogoBarProps {
  heading?: string
  logos?: Logo[]
}

export default function LogoBar({heading, logos}: LogoBarProps) {
  if (!logos?.length) return null

  return (
    <section className="py-14" style={{background: 'var(--dark-card)'}}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {heading && (
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] text-center mb-10"
            style={{color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)'}}
          >
            {heading}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {logos.map((logo, i) => (
            <div
              key={i}
              className="opacity-40 hover:opacity-80 transition-opacity duration-300 grayscale hover:grayscale-0"
            >
              {logo.url ? (
                <a href={logo.url} target="_blank" rel="noopener noreferrer">
                  <SanityImage image={logo.logo} alt={logo.name || ''} width={120} height={48} />
                </a>
              ) : (
                <SanityImage image={logo.logo} alt={logo.name || ''} width={120} height={48} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
