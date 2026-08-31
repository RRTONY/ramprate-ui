interface JsonLdProps {
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
  // JSON.stringify doesn't escape "<", so a CMS-sourced string containing
  // "</script>" would prematurely close this tag and inject the rest of the
  // page as script content.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

export function organizationJsonLd({
  name = "RampRate",
  url = "https://ramprate.com",
  logo,
  logoWidth,
  logoHeight,
  description,
  address,
  phone,
  email,
  socialLinks,
}: {
  name?: string;
  url?: string;
  logo?: string;
  logoWidth?: number;
  logoHeight?: number;
  description?: string;
  // Sanity's `address` field is a plain text field, not structured
  // street/city/state/zip - emit it as-is rather than building a
  // PostalAddress out of fields that don't exist.
  address?: string;
  phone?: string;
  email?: string;
  socialLinks?: { url: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    name,
    url,
    ...(logo && {
      logo:
        logoWidth && logoHeight
          ? {
              "@type": "ImageObject",
              url: logo,
              width: logoWidth,
              height: logoHeight,
            }
          : logo,
    }),
    ...(description && { description }),
    ...(address && { address }),
    ...(phone && { telephone: phone.replace(/[‎‏‪-‮⁦-⁩]/g, "") }),
    ...(email && { email }),
    ...(socialLinks?.length && { sameAs: socialLinks.map((l) => l.url) }),
  };
}

export function webSiteJsonLd({
  name = "RampRate",
  url = "https://ramprate.com",
}: { name?: string; url?: string } = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    publisher: {
      "@type": "Organization",
      name: "RampRate",
      url: "https://ramprate.com",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function serviceJsonLd({
  name,
  description,
  url,
  serviceType,
  reviews,
}: {
  name: string;
  description: string;
  url: string;
  serviceType?: string;
  reviews?: { author: string; reviewBody: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    ...(serviceType && { serviceType }),
    provider: {
      "@type": "Organization",
      name: "RampRate",
      url: "https://ramprate.com",
    },
    areaServed: "Worldwide",
    ...(reviews?.length && {
      review: reviews.map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.author },
        reviewBody: r.reviewBody,
      })),
    }),
  };
}

export function personJsonLd({
  name,
  jobTitle,
  description,
  image,
  url,
}: {
  name: string;
  jobTitle?: string;
  description?: string;
  image?: string;
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    ...(jobTitle && { jobTitle }),
    ...(description && { description }),
    ...(image && { image }),
    ...(url && { url }),
    worksFor: {
      "@type": "Organization",
      name: "RampRate",
      url: "https://ramprate.com",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function blogPostJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorNames,
  image,
}: {
  title: string;
  description?: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  authorNames?: string[];
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    ...(description && { description }),
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(datePublished && { datePublished }),
    // Fall back to publish date so dateModified is always present (Google prefers both)
    ...((dateModified || datePublished) && {
      dateModified: dateModified || datePublished,
    }),
    ...(authorNames?.length && {
      author:
        authorNames.length === 1
          ? { "@type": "Person", name: authorNames[0] }
          : authorNames.map((name) => ({ "@type": "Person", name })),
    }),
    ...(image && { image: [image] }),
    publisher: {
      "@type": "Organization",
      name: "RampRate",
      url: "https://ramprate.com",
      logo: {
        "@type": "ImageObject",
        url: "https://ramprate.com/og.png",
      },
    },
  };
}
