'use client'

import {useState} from 'react'
import Link from 'next/link'

const practiceAreas = [
  'Startup / Entrepreneur Law',
  'Intellectual Property',
  'Employment Law',
  'Real Estate',
  'Corporate / M&A',
  'Litigation',
  'Family Law',
  'Tax Law',
  'Other',
]

const firmSizes = [
  {label: 'Solo practitioner', value: 'solo'},
  {label: '2–10 attorneys', value: 'small'},
  {label: '11–50 attorneys', value: 'mid'},
  {label: '51–200 attorneys', value: 'large'},
  {label: '200+ attorneys', value: 'biglaw'},
]

const interestAreas = [
  'Co-counsel opportunities',
  'Conflict waiver network',
  'Referral partnerships',
  'Deal flow from entrepreneur clients',
  'All of the above',
]

const hearAboutOptions = [
  {label: 'Referral from colleague', value: 'referral'},
  {label: 'RampRate website', value: 'website'},
  {label: 'LinkedIn', value: 'linkedin'},
  {label: 'Conference / event', value: 'event'},
  {label: 'Existing RampRate client', value: 'client'},
  {label: 'Other', value: 'other'},
]

const valueProps = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
    ),
    title: '6 Active Entrepreneur Clients',
    body: 'RampRate is actively supporting entrepreneurs through complex legal challenges — co-counsel opportunities are available now.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
    ),
    title: 'Conflict Waiver Framework',
    body: 'Our CRM enables transparent conflict management and waiver coordination across the attorney network.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
    ),
    title: 'Deal Flow & Referrals',
    body: 'As we help entrepreneurs scale, we connect them with the right legal expertise at every stage of growth.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
    ),
    title: 'B-Corp Values Alignment',
    body: 'RampRate is a certified B-Corp. We partner with attorneys who share a commitment to ethical, purpose-driven practice.',
  },
]

export default function AttorneyRFIPage() {
  const [submitted, setSubmitted] = useState(false)
  const [selectedPracticeAreas, setSelectedPracticeAreas] = useState<string[]>([])
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const togglePracticeArea = (area: string) => {
    setSelectedPracticeAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
    )
  }

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest],
    )
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    // Append multi-select values
    selectedPracticeAreas.forEach((a) => data.append('practice-areas', a))
    selectedInterests.forEach((i) => data.append('interests', i))
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
              Attorney Network
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white max-w-3xl"
            style={{fontFamily: 'var(--font-display)'}}
          >
            Partner With{' '}
            <span style={{color: 'oklch(0.82 0.15 75)'}}>RampRate&apos;s</span>{' '}
            Legal Network
          </h1>
          <p
            className="mt-6 text-base sm:text-lg leading-relaxed max-w-xl"
            style={{color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)'}}
          >
            We&apos;re building a curated network of attorneys who share our commitment to helping entrepreneurs navigate complexity — so they can focus on the change they want to create in the world.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {['Co-Counsel Opportunities', 'Conflict Waiver Network', 'Deal Flow', 'Referral Partnerships'].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium"
                style={{background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-body)'}}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FORM + SIDEBAR ═══ */}
      <section className="relative section-warm overflow-hidden py-20 sm:py-28">
        <div className="absolute -bottom-32 -right-32 w-[300px] h-[300px] rounded-full opacity-20 pointer-events-none" style={{background: 'oklch(0.55 0.15 30)', filter: 'blur(80px)'}} />
        <div className="absolute top-10 -left-20 w-[180px] h-[180px] rounded-full opacity-15 pointer-events-none" style={{background: 'oklch(0.82 0.15 75)', filter: 'blur(80px)'}} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* ── Form ── */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="bg-white rounded-xl p-12 border border-black/5 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{background: 'rgba(100,60,30,0.1)'}}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="oklch(0.55 0.15 30)"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3" style={{fontFamily: 'var(--font-display)'}}>Application Received</h3>
                  <p className="leading-relaxed mb-6" style={{color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)'}}>
                    Thank you for your interest in RampRate&apos;s legal network. One of our principals will review your application and reach out within 48 hours to discuss next steps.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{background: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}
                  >
                    Contact Us Directly
                  </Link>
                </div>
              ) : (
                <form
                  name="attorney-rfi"
                  method="POST"
                  onSubmit={handleSubmit}
                  className="bg-white rounded-xl p-8 border border-black/5 shadow-sm space-y-6"
                >
                  <input type="hidden" name="form-name" value="attorney-rfi" />

                  <div>
                    <h3 className="text-xl font-bold mb-1" style={{fontFamily: 'var(--font-display)'}}>Attorney RFI Application</h3>
                    <p className="text-sm" style={{color: 'oklch(0.5 0.02 50)', fontFamily: 'var(--font-body)'}}>All fields marked * are required.</p>
                  </div>

                  {/* Personal Info */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest mb-3 pb-2 border-b" style={{color: 'oklch(0.55 0.15 30)', borderColor: 'rgba(100,60,30,0.15)', fontFamily: 'var(--font-body)'}}>Personal Information</div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>Full Name *</label>
                        <input type="text" name="name" required placeholder="Jane Smith" className="w-full px-4 py-3 rounded-md border text-sm focus:outline-none" style={{borderColor: 'rgba(0,0,0,0.1)', background: 'oklch(0.97 0.01 80)', fontFamily: 'var(--font-body)'}} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>Email *</label>
                        <input type="email" name="email" required placeholder="jane@firm.com" className="w-full px-4 py-3 rounded-md border text-sm focus:outline-none" style={{borderColor: 'rgba(0,0,0,0.1)', background: 'oklch(0.97 0.01 80)', fontFamily: 'var(--font-body)'}} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>Phone</label>
                        <input type="tel" name="phone" placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 rounded-md border text-sm focus:outline-none" style={{borderColor: 'rgba(0,0,0,0.1)', background: 'oklch(0.97 0.01 80)', fontFamily: 'var(--font-body)'}} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>Bar Number *</label>
                        <input type="text" name="bar-number" required placeholder="State + Bar #" className="w-full px-4 py-3 rounded-md border text-sm focus:outline-none" style={{borderColor: 'rgba(0,0,0,0.1)', background: 'oklch(0.97 0.01 80)', fontFamily: 'var(--font-body)'}} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>State(s) of Admission *</label>
                        <input type="text" name="states" required placeholder="e.g. CA, NY, TX" className="w-full px-4 py-3 rounded-md border text-sm focus:outline-none" style={{borderColor: 'rgba(0,0,0,0.1)', background: 'oklch(0.97 0.01 80)', fontFamily: 'var(--font-body)'}} />
                      </div>
                    </div>
                  </div>

                  {/* Firm Info */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest mb-3 pb-2 border-b" style={{color: 'oklch(0.55 0.15 30)', borderColor: 'rgba(100,60,30,0.15)', fontFamily: 'var(--font-body)'}}>Firm Information</div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>Firm Name *</label>
                        <input type="text" name="firm-name" required placeholder="Smith & Associates" className="w-full px-4 py-3 rounded-md border text-sm focus:outline-none" style={{borderColor: 'rgba(0,0,0,0.1)', background: 'oklch(0.97 0.01 80)', fontFamily: 'var(--font-body)'}} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>Years in Practice *</label>
                        <input type="number" name="years-practice" required min="0" placeholder="e.g. 12" className="w-full px-4 py-3 rounded-md border text-sm focus:outline-none" style={{borderColor: 'rgba(0,0,0,0.1)', background: 'oklch(0.97 0.01 80)', fontFamily: 'var(--font-body)'}} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>Firm Size</label>
                        <select name="firm-size" className="w-full px-4 py-3 rounded-md border text-sm focus:outline-none" style={{borderColor: 'rgba(0,0,0,0.1)', background: 'oklch(0.97 0.01 80)', fontFamily: 'var(--font-body)'}}>
                          <option value="">Select size</option>
                          {firmSizes.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Practice Areas */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest mb-3 pb-2 border-b" style={{color: 'oklch(0.55 0.15 30)', borderColor: 'rgba(100,60,30,0.15)', fontFamily: 'var(--font-body)'}}>Practice Areas (select all that apply)</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {practiceAreas.map((area) => {
                        const checked = selectedPracticeAreas.includes(area)
                        return (
                          <button
                            key={area}
                            type="button"
                            onClick={() => togglePracticeArea(area)}
                            className="text-left px-3 py-2.5 rounded-md text-xs font-medium transition-all border"
                            style={{
                              background: checked ? 'oklch(0.55 0.15 30)' : 'oklch(0.97 0.01 80)',
                              color: checked ? 'white' : 'oklch(0.4 0.02 50)',
                              borderColor: checked ? 'oklch(0.55 0.15 30)' : 'rgba(0,0,0,0.1)',
                              fontFamily: 'var(--font-body)',
                            }}
                          >
                            {area}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Entrepreneur Experience */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest mb-3 pb-2 border-b" style={{color: 'oklch(0.55 0.15 30)', borderColor: 'rgba(100,60,30,0.15)', fontFamily: 'var(--font-body)'}}>Experience & Fit</div>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>Experience with entrepreneurs / startups</label>
                        <textarea name="entrepreneur-experience" rows={3} placeholder="Describe your experience working with founders, startups, or growth-stage companies..." className="w-full px-4 py-3 rounded-md border text-sm focus:outline-none resize-none" style={{borderColor: 'rgba(0,0,0,0.1)', background: 'oklch(0.97 0.01 80)', fontFamily: 'var(--font-body)'}} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>Interests in the RampRate Network (select all that apply)</label>
                        <div className="flex flex-wrap gap-2">
                          {interestAreas.map((interest) => {
                            const checked = selectedInterests.includes(interest)
                            return (
                              <button
                                key={interest}
                                type="button"
                                onClick={() => toggleInterest(interest)}
                                className="px-3 py-2 rounded-full text-xs font-medium transition-all border"
                                style={{
                                  background: checked ? 'oklch(0.55 0.15 30)' : 'oklch(0.97 0.01 80)',
                                  color: checked ? 'white' : 'oklch(0.4 0.02 50)',
                                  borderColor: checked ? 'oklch(0.55 0.15 30)' : 'rgba(0,0,0,0.1)',
                                  fontFamily: 'var(--font-body)',
                                }}
                              >
                                {interest}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>How did you hear about RampRate?</label>
                        <select name="hear-about" className="w-full px-4 py-3 rounded-md border text-sm focus:outline-none" style={{borderColor: 'rgba(0,0,0,0.1)', background: 'oklch(0.97 0.01 80)', fontFamily: 'var(--font-body)'}}>
                          <option value="">Select...</option>
                          {hearAboutOptions.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>Additional Notes</label>
                        <textarea name="notes" rows={4} placeholder="Anything else you'd like us to know about your practice or interest in the network..." className="w-full px-4 py-3 rounded-md border text-sm focus:outline-none resize-none" style={{borderColor: 'rgba(0,0,0,0.1)', background: 'oklch(0.97 0.01 80)', fontFamily: 'var(--font-body)'}} />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold text-white transition-all hover:opacity-90 shadow-lg"
                    style={{background: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    Submit Application
                  </button>
                </form>
              )}
            </div>

            {/* ── Sidebar ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Why Partner */}
              <div className="bg-white rounded-xl p-7 border border-black/5 shadow-sm">
                <h3 className="text-lg font-bold mb-5" style={{fontFamily: 'var(--font-display)'}}>Why Partner With RampRate</h3>
                <div className="space-y-5">
                  {valueProps.map((vp) => (
                    <div key={vp.title} className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0" style={{color: 'oklch(0.55 0.15 30)'}}>{vp.icon}</div>
                      <div>
                        <div className="text-sm font-semibold mb-1" style={{color: 'oklch(0.3 0.02 50)', fontFamily: 'var(--font-body)'}}>{vp.title}</div>
                        <div className="text-xs leading-relaxed" style={{color: 'oklch(0.5 0.02 50)', fontFamily: 'var(--font-body)'}}>{vp.body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* About the Network */}
              <div className="rounded-xl p-7 border" style={{background: 'oklch(0.97 0.01 80)', borderColor: 'rgba(100,60,30,0.1)'}}>
                <h4 className="text-base font-bold mb-2" style={{fontFamily: 'var(--font-display)'}}>About This Network</h4>
                <p className="text-sm leading-relaxed" style={{color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)'}}>
                  RampRate founder Tony Greenberg has spent decades helping entrepreneurs navigate legal complexity that consumed time meant for building. This network is built on one principle: no entrepreneur should face legal challenges alone.
                </p>
              </div>

              {/* Contact CTA */}
              <div className="bg-white rounded-xl p-7 border border-black/5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'oklch(0.55 0.15 30)'}} stroke="currentColor"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <h4 className="text-base font-bold" style={{fontFamily: 'var(--font-display)'}}>Prefer to Talk First?</h4>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)'}}>
                  Reach out directly to discuss fit and partnership opportunities before submitting the full application.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold border-2 transition-all"
                  style={{borderColor: 'oklch(0.55 0.15 30)', color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}
                >
                  Contact Us
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>

              {/* Explore Practice */}
              <div className="bg-white rounded-xl p-7 border border-black/5 shadow-sm">
                <h4 className="text-base font-bold mb-3" style={{fontFamily: 'var(--font-display)'}}>Explore Our Practice</h4>
                <p className="text-xs leading-relaxed mb-4" style={{color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)'}}>See how RampRate works before applying to the network.</p>
                <div className="space-y-2">
                  <Link href="/sourcing" className="flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold transition-all w-full" style={{background: 'rgba(100,60,30,0.1)', color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    IT Sourcing Practice
                  </Link>
                  <Link href="/about" className="flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold transition-all w-full" style={{background: 'rgba(100,60,30,0.07)', color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                    Meet the Team
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
