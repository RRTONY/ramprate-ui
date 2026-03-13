import type { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import { clientLogosQuery, testimonialsQuery, boardAdvisorsQuery, caseStudiesQuery, confidentialTestimonialsQuery } from '@/lib/sanity/queries'
import ProofClient from './ProofClient'

export const metadata: Metadata = {
  title: 'Proof — Real Clients, Real Results | RampRate',
  description: '24 years of trajectory-changing results. Fortune 500 case studies, client testimonials, and the data behind our 300%+ ROI guarantee.',
}

export default async function ProofPage() {
  const [clientLogos, testimonials, boardAdvisors, caseStudies, confidentialTestimonials] = await Promise.all([
    client.fetch(clientLogosQuery),
    client.fetch(testimonialsQuery),
    client.fetch(boardAdvisorsQuery),
    client.fetch(caseStudiesQuery),
    client.fetch(confidentialTestimonialsQuery),
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
