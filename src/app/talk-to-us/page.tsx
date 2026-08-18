import type {Metadata} from 'next'
import {getPageSeo, withSeoOverrides} from '@/lib/sanity/seo'
import JsonLd, {breadcrumbJsonLd} from '@/components/shared/JsonLd'
import EngagementIntakeForm from '@/components/engage/EngagementIntakeForm'

const FALLBACK_METADATA: Metadata = {
  title: 'Talk to Us',
  description: 'Big moves. Clear thinking. Tell RampRate what you’re seeing and hear back from a real person within five business days.',
  alternates: {canonical: '/talk-to-us'},
  openGraph: {
    title: 'Talk to Us',
    description: 'Big moves. Clear thinking. Tell RampRate what you’re seeing and hear back from a real person within five business days.',
    url: 'https://ramprate.com/talk-to-us',
    type: 'website',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Talk to Us',
    description: 'Big moves. Clear thinking. Tell RampRate what you’re seeing and hear back from a real person within five business days.',
    images: ['/og.png'],
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageSeo('/talk-to-us')
  return withSeoOverrides(FALLBACK_METADATA, data?.seo)
}

const referralContext: Record<string, string> = {
  manufacturer:
    "I'm a health product manufacturer who can't find a processor willing to touch my category, even though my product is legitimate and my books are clean.",
  fintech:
    "I'm a fintech team building toward a post-extractive ethos and looking for a partner who understands compliance, mission, and tech.",
  philanthropist:
    "I'm a philanthropist, foundation, or socially minded enterprise with capital that could sit behind transparent, mission-aligned infrastructure.",
}

export default async function TalkToUsPage({
  searchParams,
}: {
  searchParams: Promise<{ref?: string}>
}) {
  const {ref} = await searchParams
  const initialQ1 = ref ? referralContext[ref] || '' : ''

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          {name: 'Home', url: 'https://ramprate.com'},
          {name: 'Talk to Us', url: 'https://ramprate.com/talk-to-us'},
        ])}
      />

      {/* HERO */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-20 overflow-hidden bg-dark">
        <div className="glass-orb glass-orb-amber w-100 h-100 -top-20 -right-20" />
        <div className="glass-orb glass-orb-rust w-62.5 h-62.5 bottom-0 -left-20" />

        <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <span className="font-mono inline-block text-xs font-bold tracking-[0.2em] uppercase text-gold mb-5">
            RampRate &middot; Engagement Intake
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-white mb-5">
            Big moves.<br />Clear <span className="text-gold">thinking.</span>
          </h1>
          <p className="font-body text-base sm:text-lg text-white/60 mb-6">
            4 taps. 3 short answers. 2 questions. 1 real person.
          </p>
          <p className="font-mono text-xs text-gold/80 mb-1.5">
            $1B+ in contracts sourced and negotiated &middot; 40+ founders taken from idea to real business &middot; $3M+ in grant funding raised
          </p>
          <p className="font-mono text-xs text-white/40">
            Trusted by Microsoft, Disney, CBS, Nike &middot; B Corp &middot; 2X Return Guarantee
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="section-warm py-16 sm:py-20">
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-7 sm:p-10">
            <EngagementIntakeForm initialQ1={initialQ1} />
          </div>
        </div>
      </section>
    </>
  )
}
