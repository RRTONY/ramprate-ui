import SanityImage from '@/components/shared/SanityImage'

interface Testimonial {
  _id?: string
  quote?: string
  personName?: string
  role?: string
  company?: string
  companyLogo?: any
  photo?: any
}

interface TestimonialGridProps {
  heading?: string
  testimonials?: Testimonial[]
}

export default function TestimonialGrid({heading, testimonials}: TestimonialGridProps) {
  if (!testimonials?.length) return null

  return (
    <section className="py-24" style={{background: 'var(--dark-mid)'}}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {heading && (
          <div className="mb-14 text-center">
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-3"
              style={{color: 'var(--gold)', fontFamily: 'var(--font-body)'}}
            >
              Client Voices
            </p>
            <h2
              className="font-bold text-white"
              style={{fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)'}}
            >
              {heading}
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t._id || i}
              className="flex flex-col p-8 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Quote mark */}
              <div
                className="text-5xl leading-none mb-4 select-none"
                style={{color: 'var(--gold)', fontFamily: 'Georgia, serif'}}
                aria-hidden
              >
                &ldquo;
              </div>

              {/* Quote text */}
              <p
                className="flex-1 text-sm leading-relaxed mb-6"
                style={{color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)'}}
              >
                {t.quote}
              </p>

              {/* Attribution */}
              <div className="flex items-center gap-4 pt-4" style={{borderTop: '1px solid rgba(255,255,255,0.08)'}}>
                {t.photo && (
                  <div className="flex-shrink-0 w-11 h-11 rounded-full overflow-hidden ring-1 ring-white/10">
                    <SanityImage
                      image={t.photo}
                      alt={t.personName || ''}
                      width={44}
                      height={44}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p
                    className="text-sm font-semibold text-white truncate"
                    style={{fontFamily: 'var(--font-body)'}}
                  >
                    {t.personName}
                  </p>
                  {(t.role || t.company) && (
                    <p
                      className="text-xs truncate"
                      style={{color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)'}}
                    >
                      {[t.role, t.company].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
                {t.companyLogo && (
                  <div className="ml-auto flex-shrink-0 opacity-50" style={{filter: 'brightness(0) invert(1)'}}>
                    <SanityImage
                      image={t.companyLogo}
                      alt={t.company || ''}
                      width={60}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
