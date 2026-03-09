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

export function blogPostJsonLd({
  title,
  description,
  url,
  datePublished,
  authorName,
  image,
}: {
  title: string
  description?: string
  url: string
  datePublished?: string
  authorName?: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    ...(description && {description}),
    url,
    ...(datePublished && {datePublished}),
    ...(authorName && {
      author: {'@type': 'Person', name: authorName},
    }),
    ...(image && {image}),
    publisher: {
      '@type': 'Organization',
      name: 'RampRate',
      url: 'https://ramprate.com',
    },
  }
}
