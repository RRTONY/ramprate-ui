import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {sanityFetch} from '@/lib/sanity/client'
import {siteSettingsQuery} from '@/lib/sanity/queries'
import {toTelHref} from '@/lib/utils'
import ContactForm from '@/components/sections/ContactForm'
import {getPageSeo, withSeoOverrides} from '@/lib/sanity/seo'
import JsonLd, {breadcrumbJsonLd} from '@/components/shared/JsonLd'

const FALLBACK_METADATA: Metadata = {
  title: 'Contact',
  description: 'Start a conversation with RampRate. The first conversation is always free.',
  keywords: [
    'contact RampRate',
    'IT sourcing advisory contact',
    'enterprise advisory engagement',
  ],
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact',
    description: 'Start a conversation with RampRate. The first conversation is always free.',
    url: 'https://ramprate.com/contact',
    type: 'website',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact',
    description: 'Start a conversation with RampRate. The first conversation is always free.',
    images: ['/og.png'],
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageSeo('/contact')
  return withSeoOverrides(FALLBACK_METADATA, data?.seo)
}


const offices = [
  {city: 'Santa Monica, CA', role: 'US Headquarters'},
  {city: 'Ibiza, Spain',     role: 'EU Headquarters'},
  {city: 'Massachusetts',    role: 'East Coast'},
  {city: 'North Carolina',   role: 'Southeast'},
  {city: 'Florida',          role: 'Southeast'},
]

const B_CORP_PROFILE = 'https://www.bcorporation.net/en-us/find-a-b-corp/company/ramp-rate-a-team-inc/'

export default async function ContactPage() {
  const settings = await sanityFetch<{phone?: string; email?: string}>({
    query: siteSettingsQuery,
    tags: ['siteSettings'],
    revalidate: 60,
  })

  const phone = settings?.phone || '+1(909)235-9945'
  const email = settings?.email || 'hello@ramprate.com'

  return (
    <div className="bg-ed-ivory text-ed-ink">
      <JsonLd
        data={breadcrumbJsonLd([
          {name: 'Home', url: 'https://ramprate.com'},
          {name: 'Contact', url: 'https://ramprate.com/contact'},
        ])}
      />

      {/* ── HERO ── */}
      <section className="pt-32 pb-12 sm:pt-40 sm:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <span className="font-body text-sm font-semibold tracking-[0.18em] uppercase text-ed-forest">
            Contact
          </span>
          <h1 className="font-display mt-4 text-[clamp(2.25rem,6vw,4rem)] font-bold leading-[1.08] tracking-tight max-w-3xl">
            Trust Us With What You{' '}
            <span className="relative isolate whitespace-nowrap">
              Hate to Do
              <span aria-hidden="true" className="absolute left-0 right-0 -bottom-1 h-2 rounded-full bg-ed-coral/60 -z-10" />
            </span>
          </h1>
          <p className="font-body mt-6 text-lg sm:text-xl leading-relaxed max-w-2xl text-ed-muted">
            And focus on the change you want to create in the world. The first conversation is always free.
          </p>

          <ul className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 font-body text-[15px] text-ed-ink">
            <li className="flex items-center gap-2.5">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ed-forest" />
              Serving clients since 2000
            </li>
            <li className="flex items-center gap-2.5">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ed-forest" />
              Offices in the US and Europe
            </li>
            <li>
              <a
                href={B_CORP_PROFILE}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-md hover:underline underline-offset-4"
              >
                <Image src="/bcorp-logo.svg" alt="" width={20} height={29} className="h-7 w-auto" unoptimized />
                Certified B Corporation
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* ── FORM + DETAILS ── */}
      <section className="pb-20 sm:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-7">
            <ContactForm email={email} />
          </div>

          <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-28" aria-label="Other ways to reach us">
            <div className="rounded-2xl bg-ed-sage p-6 sm:p-8 border-l-4 border-ed-coral">
              <h2 className="font-display text-xl sm:text-2xl font-bold">The RampRate Guarantee</h2>
              <p className="font-body mt-3 text-base leading-relaxed text-ed-ink/85">
                The audit is always free. If we don&apos;t deliver 300%+ ROI on our sourcing engagements, you don&apos;t pay. We put skin in the game because we believe in what we do.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-ed-line p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold">Prefer to talk first?</h2>
              <p className="font-body mt-2 text-base leading-relaxed text-ed-muted">
                Pick a time that suits you and one of our principals will be on the call.
              </p>
              <a
                href="https://calendly.com/ramprate"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body mt-5 inline-flex items-center justify-center gap-2 min-h-12 w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-ed-forest text-base font-semibold text-ed-forest transition-colors hover:bg-ed-forest hover:text-white"
              >
                Schedule a Call
                <span className="sr-only">(opens in a new tab)</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>

              <dl className="mt-8 pt-6 border-t border-ed-line grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-5 font-body">
                <div>
                  <dt className="text-sm font-semibold text-ed-muted">Email</dt>
                  <dd className="mt-1">
                    <a href={`mailto:${email}`} className="text-base font-medium text-ed-ink underline decoration-ed-line underline-offset-4 hover:decoration-ed-forest break-all">
                      {email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-ed-muted">Phone</dt>
                  <dd className="mt-1">
                    <a href={`tel:${toTelHref(phone)}`} className="text-base font-medium text-ed-ink underline decoration-ed-line underline-offset-4 hover:decoration-ed-forest">
                      {phone}
                    </a>
                  </dd>
                </div>
              </dl>

              <div className="mt-6 pt-6 border-t border-ed-line">
                <h3 className="font-body text-sm font-semibold text-ed-muted">Offices</h3>
                <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 font-body">
                  {offices.map((o) => (
                    <li key={o.city}>
                      <span className="block text-[15px] font-medium">{o.city}</span>
                      <span className="block text-sm text-ed-muted">{o.role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="font-body text-base text-ed-muted px-1">
              Not ready to talk?{' '}
              <Link href="/process" className="font-semibold text-ed-violet underline underline-offset-4">
                See how we work
              </Link>
            </p>
          </aside>
        </div>
      </section>
    </div>
  )
}
