interface JsonLdProps {
  data: Record<string, unknown>
}

export default function JsonLd({data}: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
    />
  )
}

export function organizationJsonLd({
  name = 'RampRate',
  url = 'https://ramprate.com',
  logo,
  description,
  address,
  phone,
  email,
  socialLinks,
}: {
  name?: string
  url?: string
  logo?: string
  description?: string
  address?: {street?: string; city?: string; state?: string; zip?: string}
  phone?: string
  email?: string
  socialLinks?: {url: string}[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    ...(logo && {logo}),
    ...(description && {description}),
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: address.street,
        addressLocality: address.city,
        addressRegion: address.state,
        postalCode: address.zip,
        addressCountry: 'US',
      },
    }),
    ...(phone && {telephone: phone}),
    ...(email && {email}),
    ...(socialLinks?.length && {sameAs: socialLinks.map((l) => l.url)}),
  }
}

export function webSiteJsonLd({
  name = 'RampRate',
  url = 'https://ramprate.com',
}: {name?: string; url?: string} = {}) {
  // No SearchAction/sitelinks-searchbox: the site has no general search endpoint,
  // and claiming one produces invalid markup. Add it back if a /search route ships.
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    publisher: {'@type': 'Organization', name: 'RampRate', url: 'https://ramprate.com'},
  }
}

export function serviceJsonLd({
  name,
  description,
  url,
  serviceType,
}: {
  name: string
  description: string
  url: string
  serviceType?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    ...(serviceType && {serviceType}),
    provider: {
      '@type': 'Organization',
      name: 'RampRate',
      url: 'https://ramprate.com',
    },
    areaServed: 'Worldwide',
  }
}

export function breadcrumbJsonLd(items: {name: string; url: string}[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function faqJsonLd(items: {question: string; answer: string}[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {'@type': 'Answer', text: item.answer},
    })),
  }
}

export function blogPostJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName,
  image,
}: {
  title: string
  description?: string
  url: string
  datePublished?: string
  dateModified?: string
  authorName?: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    ...(description && {description}),
    url,
    mainEntityOfPage: {'@type': 'WebPage', '@id': url},
    ...(datePublished && {datePublished}),
    // Fall back to publish date so dateModified is always present (Google prefers both)
    ...((dateModified || datePublished) && {dateModified: dateModified || datePublished}),
    ...(authorName && {
      author: {'@type': 'Person', name: authorName},
    }),
    ...(image && {image: [image]}),
    publisher: {
      '@type': 'Organization',
      name: 'RampRate',
      url: 'https://ramprate.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ramprate.com/og.png',
      },
    },
  }
}
