import type {Metadata} from 'next'
import Link from 'next/link'
import {sanityFetch} from '@/lib/sanity/client'
import {siteSettingsQuery} from '@/lib/sanity/queries'
import {toTelHref} from '@/lib/utils'
import ContactForm from '@/components/sections/ContactForm'

export const metadata: Metadata = {
  title: 'Contact | RampRate',
  description: 'Start a conversation with RampRate. The first conversation is always free.',
}

const offices = [
  {city: 'Santa Monica, CA', role: 'US Headquarters'},
  {city: 'Ibiza, Spain',     role: 'EU Headquarters'},
  {city: 'Massachusetts',    role: 'East Coast Office'},
  {city: 'North Carolina',   role: 'Southeast Office'},
  {city: 'Florida',          role: 'Southeast Office'},
]

const rust = 'oklch(0.55 0.15 30)'

export default async function ContactPage() {
  const settings = await sanityFetch<{phone?: string; email?: string}>({
    query: siteSettingsQuery,
    tags: ['siteSettings'],
    revalidate: 60,
  })

  const phone = settings?.phone || '+1(909)235-9945'
  const email = settings?.email || 'hello@ramprate.com'

  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden"
        style={{background: 'linear-gradient(135deg, oklch(0.12 0.01 250) 0%, oklch(0.16 0.02 260) 50%, oklch(0.12 0.01 250) 100%)'}}
      >
        <div
          className="absolute top-0 right-0 w-100 h-100 rounded-full opacity-15 pointer-events-none"
          style={{background: rust, filter: 'blur(80px)'}}
        />
        <div
          className="absolute bottom-0 left-0 w-62.5 h-62.5 rounded-full opacity-10 pointer-events-none"
          style={{background: 'oklch(0.82 0.15 75)', filter: 'blur(80px)'}}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-4">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-[0.2em]"
              style={{border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)'}}
            >
              Connect
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white max-w-3xl"
            style={{fontFamily: 'var(--font-display)'}}
          >
            Trust Us With What You{' '}
            <span style={{color: 'oklch(0.82 0.15 75)'}}>Hate to Do</span>
          </h1>
          <p
            className="mt-6 text-base sm:text-lg leading-relaxed max-w-xl"
            style={{color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)'}}
          >
            And focus on the change you want to create in the world. The first conversation is always free.
          </p>
        </div>
      </section>

      {/* ── FORM + SIDEBAR ── */}
      <section className="relative section-warm overflow-hidden py-20 sm:py-28">
        <div
          className="absolute -bottom-32 -right-32 w-75 h-75 rounded-full opacity-20 pointer-events-none"
          style={{background: rust, filter: 'blur(80px)'}}
        />
        <div
          className="absolute top-10 -left-20 w-45 h-45 rounded-full opacity-15 pointer-events-none"
          style={{background: 'oklch(0.82 0.15 75)', filter: 'blur(80px)'}}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* Form (client component) */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">

              {/* Book a call */}
              <div className="bg-white rounded-xl p-7 border border-black/5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={rust} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <h3 className="text-lg font-bold" style={{fontFamily: 'var(--font-display)'}}>Book a Call</h3>
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)'}}>
                  Prefer to schedule directly? Pick a time that works for you and one of our principals will be on the call.
                </p>
                <a
                  href="https://calendly.com/ramprate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md text-sm font-semibold border-2 transition-all"
                  style={{borderColor: rust, color: rust, fontFamily: 'var(--font-body)'}}
                >
                  Schedule a Meeting
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>

              {/* Phone + Email from Sanity */}
              <div className="bg-white rounded-xl p-7 border border-black/5 shadow-sm space-y-5">
                <div className="flex items-start gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={rust} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider mb-1" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>Email</div>
                    <a
                      href={`mailto:${email}`}
                      className="text-sm hover:underline"
                      style={{color: rust, fontFamily: 'var(--font-body)'}}
                    >
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={rust} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
                  </svg>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider mb-1" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>Phone</div>
                    <a
                      href={`tel:${toTelHref(phone)}`}
                      className="text-sm hover:underline"
                      style={{color: rust, fontFamily: 'var(--font-body)'}}
                    >
                      {phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Office Locations */}
              <div className="bg-white rounded-xl p-7 border border-black/5 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={rust} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                  </svg>
                  <h3 className="text-base font-bold" style={{fontFamily: 'var(--font-display)'}}>Office Locations</h3>
                </div>
                <div className="space-y-4">
                  {offices.map((o) => (
                    <div key={o.city} className="flex items-start gap-3">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={rust} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      <div>
                        <div className="text-sm font-semibold" style={{color: 'oklch(0.3 0.02 50)', fontFamily: 'var(--font-body)'}}>{o.city}</div>
                        <div className="text-xs" style={{color: 'oklch(0.5 0.02 50)', fontFamily: 'var(--font-body)'}}>{o.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guarantee */}
              <div className="rounded-xl p-7 border" style={{background: 'oklch(0.97 0.01 80)', borderColor: 'rgba(100,60,30,0.1)'}}>
                <h4 className="text-base font-bold mb-2" style={{fontFamily: 'var(--font-display)'}}>The RampRate Guarantee</h4>
                <p className="text-sm leading-relaxed" style={{color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)'}}>
                  The audit is always free. If we don&apos;t deliver 300%+ ROI on our sourcing engagements, you don&apos;t pay. We put skin in the game because we believe in what we do.
                </p>
              </div>

              {/* Assessment */}
              <div className="bg-white rounded-xl p-7 border border-black/5 shadow-sm">
                <h4 className="text-base font-bold mb-3" style={{fontFamily: 'var(--font-display)'}}>Start With an Assessment</h4>
                <p className="text-xs leading-relaxed mb-4" style={{color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)'}}>
                  Not ready to talk? Explore our diagnostic tools first.
                </p>
                <div className="space-y-2">
                  <Link
                    href="/process"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold transition-all w-full"
                    style={{background: 'rgba(100,60,30,0.1)', color: rust, fontFamily: 'var(--font-body)'}}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    Flow Circuit Assessment
                  </Link>
                  <Link
                    href="/process"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold transition-all w-full"
                    style={{background: 'rgba(96,60,180,0.1)', color: 'oklch(0.6 0.2 280)', fontFamily: 'var(--font-body)'}}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 012-2h6a2 2 0 012 2v1.662"/></svg>
                    Find Your Me / Way / Our
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}
