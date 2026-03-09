import {PortableText, portableTextComponents} from '@/lib/sanity/portable-text'
import SanityImage from '@/components/shared/SanityImage'

interface ImpactItem {
  title?: string
  description?: string
  icon?: any
}

interface ImpactSectionProps {
  heading?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
  items?: ImpactItem[]
}

export default function ImpactSection({heading, body, items}: ImpactSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {heading && (
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">{heading}</h2>
        )}
        {body && (
          <div className="prose prose-lg max-w-3xl mx-auto text-center mb-12">
            <PortableText value={body} components={portableTextComponents} />
          </div>
        )}
        {items && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items.map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-6">
                {item.icon && (
                  <div className="mb-4">
                    <SanityImage image={item.icon} alt={item.title || ''} width={48} height={48} />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
