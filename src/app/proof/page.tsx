import type {Metadata} from 'next'
import {sanityFetch} from '@/lib/sanity/client'
import {clientLogosQuery, testimonialsQuery, boardAdvisorsQuery, caseStudiesQuery, confidentialTestimonialsQuery} from '@/lib/sanity/queries'
import ProofClient, {
  type SanityLogo,
  type SanityTestimonial,
  type SanityBoardAdvisor,
  type SanityCaseStudy,
  type SanityConfidentialTestimonial,
} from './ProofClient'

export const metadata: Metadata = {
  title: 'Proof — Real Clients, Real Results | RampRate',
  description: '24 years of trajectory-changing results. Fortune 500 case studies, client testimonials, and the data behind our 300%+ ROI guarantee.',
}

export default async function ProofPage() {
  const [clientLogos, testimonials, boardAdvisors, caseStudies, confidentialTestimonials] = await Promise.all([
    sanityFetch<SanityLogo[]>({query: clientLogosQuery, tags: ['clientLogo']}),
    sanityFetch<SanityTestimonial[]>({query: testimonialsQuery, tags: ['testimonial']}),
    sanityFetch<SanityBoardAdvisor[]>({query: boardAdvisorsQuery, tags: ['boardAdvisor']}),
    sanityFetch<SanityCaseStudy[]>({query: caseStudiesQuery, tags: ['caseStudy']}),
    sanityFetch<SanityConfidentialTestimonial[]>({query: confidentialTestimonialsQuery, tags: ['confidentialTestimonial']}),
  ])
  return (
    <ProofClient
      clientLogos={clientLogos ?? []}
      testimonials={testimonials ?? []}
      boardAdvisors={boardAdvisors ?? []}
      caseStudies={caseStudies ?? []}
      confidentialTestimonials={confidentialTestimonials ?? []}
    />
  )
}
