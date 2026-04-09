import SanityImage from '@/components/shared/SanityImage'

interface CtaSectionProps {
  heading?: string
  body?: string
  buttonText?: string
  buttonLink?: string
  backgroundImage?: any
}

export default function CtaSection({heading, body, buttonText, buttonLink, backgroundImage}: CtaSectionProps) {
  return (
    <section
      className="relative py-24 text-center"
      style={{background: 'var(--rust)', color: '#fff'}}
    >
      {backgroundImage ? (
        <div className="absolute inset-0 overflow-hidden">
          <SanityImage
            image={backgroundImage}
            alt=""
            aria-hidden="true"
            width={1920}
            height={600}
            className="w-full h-full object-cover opacity-15"
          />
        </div>
      ) : null}
      <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
        {heading && (
          <h2
            className="font-bold text-white mb-6"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            }}
          >
            {heading}
          </h2>
        )}
        {body && (
          <p
            className="max-w-2xl mx-auto mb-10"
            style={{color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)', fontSize: '1rem'}}
          >
            {body}
          </p>
        )}
        {buttonText && buttonLink ? (
          <a
            href={buttonLink}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-md text-sm font-bold transition-opacity hover:opacity-90"
            style={{background: '#fff', color: 'var(--rust)', fontFamily: 'var(--font-body)'}}
          >
            {buttonText}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        ) : (
          <a
            href="/contact"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-md text-sm font-bold transition-opacity hover:opacity-90"
            style={{background: '#fff', color: 'var(--rust)', fontFamily: 'var(--font-body)'}}
          >
            Start a Conversation
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        )}
      </div>
    </section>
  )
}
