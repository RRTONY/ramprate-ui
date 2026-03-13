'use client'

import {useState} from 'react'
import Link from 'next/link'

const inquiryTypes = [
  {label: 'IT Sourcing / Cost Optimization', value: 'sourcing'},
  {label: 'Growth Advisory / Syzygy', value: 'growth'},
  {label: 'Web3 / Stratum', value: 'web3'},
  {label: 'Impact / ImpactSoul', value: 'impact'},
  {label: 'General Inquiry', value: 'general'},
]

const offices = [
  {city: 'Santa Monica, CA', role: 'US Headquarters'},
  {city: 'Ibiza, Spain', role: 'EU Headquarters'},
  {city: 'Massachusetts', role: 'East Coast Office'},
  {city: 'North Carolina', role: 'Southeast Office'},
  {city: 'Florida', role: 'Southeast Office'},
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    fetch('/', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams(data as any).toString(),
    })
      .then(() => setSubmitted(true))
      .catch(() => setSubmitted(true))
  }

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section
        className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden"
        style={{background: 'linear-gradient(135deg, oklch(0.12 0.01 250) 0%, oklch(0.16 0.02 260) 50%, oklch(0.12 0.01 250) 100%)'}}
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none" style={{background: 'oklch(0.55 0.15 30)', filter: 'blur(80px)'}} />
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full opacity-10 pointer-events-none" style={{background: 'oklch(0.82 0.15 75)', filter: 'blur(80px)'}} />

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

      {/* ═══ FORM + SIDEBAR ═══ */}
      <section className="relative section-warm overflow-hidden py-20 sm:py-28">
        <div className="absolute -bottom-32 -right-32 w-[300px] h-[300px] rounded-full opacity-20 pointer-events-none" style={{background: 'oklch(0.55 0.15 30)', filter: 'blur(80px)'}} />
        <div className="absolute top-10 -left-20 w-[180px] h-[180px] rounded-full opacity-15 pointer-events-none" style={{background: 'oklch(0.82 0.15 75)', filter: 'blur(80px)'}} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="bg-white rounded-xl p-12 border border-black/5 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{background: 'rgba(100,60,30,0.1)'}}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3" style={{fontFamily: 'var(--font-display)'}}>Message Received</h3>
                  <p className="leading-relaxed" style={{color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)'}}>
                    Thank you for reaching out. One of our principals will respond within 24 hours. In the meantime, feel free to book a time directly on our calendar.
                  </p>
                </div>
              ) : (
                <form
                  name="contact"
                  method="POST"
                  onSubmit={handleSubmit}
                  className="bg-white rounded-xl p-8 border border-black/5 shadow-sm"
                >
                  <input type="hidden" name="form-name" value="contact" />
                  <h3 className="text-xl font-bold mb-6" style={{fontFamily: 'var(--font-display)'}}>Start a Conversation</h3>

                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>Name *</label>
                      <input type="text" name="name" required placeholder="Your name" className="w-full px-4 py-3 rounded-md border text-sm focus:outline-none transition-colors" style={{borderColor: 'rgba(0,0,0,0.1)', background: 'oklch(0.97 0.01 80)', fontFamily: 'var(--font-body)'}} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>Email *</label>
                      <input type="email" name="email" required placeholder="you@company.com" className="w-full px-4 py-3 rounded-md border text-sm focus:outline-none transition-colors" style={{borderColor: 'rgba(0,0,0,0.1)', background: 'oklch(0.97 0.01 80)', fontFamily: 'var(--font-body)'}} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>Company</label>
                      <input type="text" name="company" placeholder="Your company" className="w-full px-4 py-3 rounded-md border text-sm focus:outline-none transition-colors" style={{borderColor: 'rgba(0,0,0,0.1)', background: 'oklch(0.97 0.01 80)', fontFamily: 'var(--font-body)'}} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>Title</label>
                      <input type="text" name="title" placeholder="Your title" className="w-full px-4 py-3 rounded-md border text-sm focus:outline-none transition-colors" style={{borderColor: 'rgba(0,0,0,0.1)', background: 'oklch(0.97 0.01 80)', fontFamily: 'var(--font-body)'}} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>Phone</label>
                      <input type="tel" name="phone" placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 rounded-md border text-sm focus:outline-none transition-colors" style={{borderColor: 'rgba(0,0,0,0.1)', background: 'oklch(0.97 0.01 80)', fontFamily: 'var(--font-body)'}} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>I&apos;m interested in</label>
                      <select name="practice" className="w-full px-4 py-3 rounded-md border text-sm focus:outline-none transition-colors" style={{borderColor: 'rgba(0,0,0,0.1)', background: 'oklch(0.97 0.01 80)', fontFamily: 'var(--font-body)'}}>
                        <option value="">Select a topic</option>
                        {inquiryTypes.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>Message</label>
                    <textarea name="message" rows={5} placeholder="Tell us about your challenge..." className="w-full px-4 py-3 rounded-md border text-sm focus:outline-none transition-colors resize-none" style={{borderColor: 'rgba(0,0,0,0.1)', background: 'oklch(0.97 0.01 80)', fontFamily: 'var(--font-body)'}} />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold text-white transition-all hover:opacity-90 shadow-lg"
                    style={{background: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-7 border border-black/5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <h3 className="text-lg font-bold" style={{fontFamily: 'var(--font-display)'}}>Book a Call</h3>
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)'}}>
                  Prefer to schedule directly? Pick a time that works for you and one of our principals will be on the call.
                </p>
                <a
                  href="https://calendly.com/ramprate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold border-2 transition-all"
                  style={{borderColor: 'oklch(0.55 0.15 30)', color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}
                >
                  Schedule a Meeting
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-7 border border-black/5 shadow-sm space-y-5">
                <div className="flex items-start gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider mb-1" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>Email</div>
                    <a href="mailto:hello@ramprate.com" className="text-sm hover:underline" style={{color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}>hello@ramprate.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/></svg>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider mb-1" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>Phone</div>
                    <span className="text-sm" style={{color: 'oklch(0.35 0.02 50)', fontFamily: 'var(--font-body)'}}>+1 (310) 622-8989</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-7 border border-black/5 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                  <h3 className="text-base font-bold" style={{fontFamily: 'var(--font-display)'}}>Office Locations</h3>
                </div>
                <div className="space-y-4">
                  {offices.map((o) => (
                    <div key={o.city} className="flex items-start gap-3">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <div>
                        <div className="text-sm font-semibold" style={{color: 'oklch(0.3 0.02 50)', fontFamily: 'var(--font-body)'}}>{o.city}</div>
                        <div className="text-xs" style={{color: 'oklch(0.5 0.02 50)', fontFamily: 'var(--font-body)'}}>{o.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl p-7 border" style={{background: 'oklch(0.97 0.01 80)', borderColor: 'rgba(100,60,30,0.1)'}}>
                <h4 className="text-base font-bold mb-2" style={{fontFamily: 'var(--font-display)'}}>The RampRate Guarantee</h4>
                <p className="text-sm leading-relaxed" style={{color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)'}}>
                  The audit is always free. If we don&apos;t deliver 300%+ ROI on our sourcing engagements, you don&apos;t pay. We put skin in the game because we believe in what we do.
                </p>
              </div>

              <div className="bg-white rounded-xl p-7 border border-black/5 shadow-sm">
                <h4 className="text-base font-bold mb-3" style={{fontFamily: 'var(--font-display)'}}>Start With an Assessment</h4>
                <p className="text-xs leading-relaxed mb-4" style={{color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)'}}>Not ready to talk? Explore our diagnostic tools first.</p>
                <div className="space-y-2">
                  <Link href="/process" className="flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold transition-all w-full" style={{background: 'rgba(100,60,30,0.1)', color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    Flow Circuit Assessment
                  </Link>
                  <Link href="/process" className="flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold transition-all w-full" style={{background: 'rgba(96,60,180,0.1)', color: 'oklch(0.6 0.2 280)', fontFamily: 'var(--font-body)'}}>
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
