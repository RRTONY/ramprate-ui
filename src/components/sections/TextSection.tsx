import {PortableText, portableTextComponents} from '@/lib/sanity/portable-text'

interface TextSectionProps {
  heading?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
  alignment?: 'left' | 'center' | 'right'
}

export default function TextSection({heading, body, alignment = 'left'}: TextSectionProps) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[alignment]

  return (
    <section className="py-16 md:py-24" style={{background: 'var(--dark-mid)'}}>
      <div className={`mx-auto max-w-4xl px-5 sm:px-8 ${alignClass}`}>
        {heading && (
          <h2
            className="font-bold text-white mb-8"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            }}
          >
            {heading}
          </h2>
        )}
        {body && (
          <div className="prose prose-lg max-w-none">
            <PortableText value={body} components={portableTextComponents} />
          </div>
        )}
      </div>
    </section>
  )
}
