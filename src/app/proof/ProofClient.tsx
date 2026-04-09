'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface SanityLogo {
  _id: string
  name: string
  url: string | null
  logoUrl: string | null
}

interface SanityTestimonial {
  _id: string
  personName: string
  role: string
  company: string
  quote: string
  tag: string
  tier: 'principal' | 'firm'
  linkedin: string | null
  twitter: string | null
  companyLogoUrl: string | null
  photoUrl: string | null
}

interface SanityBoardAdvisor {
  _id: string
  name: string
  role: string
  bio: string
  whyAdvise: string | null
  linkedin: string | null
  twitter: string | null
  photoUrl: string | null
}

interface SanityCaseStudy {
  _id: string
  title: string
  result: string
  desc: string
  metrics: string[]
}

interface SanityConfidentialTestimonial {
  _id: string
  quote: string
  attribution: string
  division: string
}

interface ProofClientProps {
  clientLogos: SanityLogo[]
  testimonials: SanityTestimonial[]
  boardAdvisors: SanityBoardAdvisor[]
  caseStudies: SanityCaseStudy[]
  confidentialTestimonials: SanityConfidentialTestimonial[]
}

const CATEGORIES = ["All", "Enterprise", "Media", "Blockchain", "Gaming", "Finance"] as const

const divisionColors: Record<string, string> = {
  RampRate: "oklch(0.82 0.15 75)",
  Syzygy: "oklch(0.7 0.2 280)",
  Stratum: "oklch(0.65 0.2 150)",
  ImpactSoul: "oklch(0.7 0.15 30)",
}

export default function ProofClient({ clientLogos, testimonials, boardAdvisors, caseStudies, confidentialTestimonials }: ProofClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>("All")

  const filteredTestimonials = useMemo(() => {
    if (activeFilter === "All") return testimonials
    return testimonials.filter((t) => t.tag === activeFilter)
  }, [activeFilter, testimonials])

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: testimonials.length }
    testimonials.forEach((t) => { map[t.tag] = (map[t.tag] || 0) + 1 })
    return map
  }, [testimonials])

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: 'var(--dark)' }}>
        <div className="glass-orb glass-orb-rust w-[400px] h-[400px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-amber w-[300px] h-[300px] bottom-0 -left-32" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[oklch(0.82_0.15_75)] mb-4 block" style={{ fontFamily: 'var(--font-body)' }}>Proof</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              24 Years of{' '}
              <span className="text-[oklch(0.55_0.15_30)]">Trajectory-Changing</span> Results
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-10" style={{ fontFamily: 'var(--font-body)' }}>
              Don't take our word for it. Here's what our clients say about working with RampRate — and why they keep coming back.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { value: "$24B+", label: "Decisions Brokered" },
                { value: "24%", label: "Avg IT Budget Savings" },
                { value: "50+", label: "Countries" },
                { value: "24yrs", label: "Track Record" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-4">
                  <div className="text-2xl font-bold text-[oklch(0.82_0.15_75)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>{stat.value}</div>
                  <div className="text-xs text-white/50" style={{ fontFamily: 'var(--font-body)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      {caseStudies.length > 0 && (
        <section className="relative section-warm py-20 sm:py-28 overflow-hidden">
          <div className="glass-orb glass-orb-rust w-[300px] h-[300px] -top-32 -right-32" />
          <div className="glass-orb glass-orb-amber w-[200px] h-[200px] bottom-10 -left-20" />
          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
            <div className="mb-14">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[oklch(0.55_0.15_30)]" style={{ fontFamily: 'var(--font-body)' }}>Case Studies</span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Enterprise-Grade <span className="text-[oklch(0.55_0.15_30)]">Results</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseStudies.map((cs) => (
                <div key={cs._id} className="glass-card-warm p-7 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'oklch(0.55 0.15 30 / 0.1)' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    </div>
                    <h3 className="text-sm font-bold leading-tight" style={{ fontFamily: 'var(--font-display)' }}>{cs.title}</h3>
                  </div>
                  <div className="mb-4 px-3 py-2 rounded-md" style={{ background: 'oklch(0.55 0.15 30 / 0.08)' }}>
                    <span className="text-sm font-bold text-[oklch(0.45_0.12_30)]" style={{ fontFamily: 'var(--font-mono)' }}>{cs.result}</span>
                  </div>
                  <p className="text-sm text-[oklch(0.4_0.02_50)] leading-relaxed mb-4" style={{ fontFamily: 'var(--font-body)' }}>{cs.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(cs.metrics || []).map((m) => (
                      <span key={m} className="text-xs px-2 py-1 rounded-full bg-[oklch(0.94_0.03_80)] text-[oklch(0.45_0.02_50)] font-medium" style={{ fontFamily: 'var(--font-body)' }}>{m}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Client Logos — from Sanity (121 logos) */}
      <section className="section-light py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <h3 className="text-center text-xs font-semibold tracking-[0.2em] uppercase mb-10" style={{ color: 'oklch(0.5 0.02 50)', fontFamily: 'var(--font-body)' }}>
            Trusted by Industry Leaders
          </h3>
          {clientLogos.length > 0 ? (() => {
            const withImage = clientLogos.filter(l => l.logoUrl)
            const featuredLogos = withImage.slice(0, 24)
            const remainingWithImage = withImage.slice(24)
            const noImage = clientLogos.filter(l => !l.logoUrl)
            const textNames = [...remainingWithImage.map(l => l.name), ...noImage.map(l => l.name)]
            return (
              <>
                <div className="flex flex-wrap justify-center items-center gap-4">
                  {featuredLogos.map((logo) => (
                    <div
                      key={logo._id}
                      className="flex items-center justify-center transition-all duration-200 hover:scale-105"
                      style={{
                        background: 'oklch(0.94 0.02 75)',
                        borderRadius: '10px',
                        padding: '12px 20px',
                        minWidth: '100px',
                        minHeight: '56px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                      }}
                    >
                      {logo.url ? (
                        <a href={logo.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={logo.logoUrl!} alt={logo.name} className="object-contain" style={{ height: '28px', maxWidth: '100px', width: 'auto' }} loading="lazy" />
                        </a>
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={logo.logoUrl!} alt={logo.name} className="object-contain" style={{ height: '28px', maxWidth: '100px', width: 'auto' }} loading="lazy" />
                      )}
                    </div>
                  ))}
                </div>
                {textNames.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-8">
                    {textNames.map((name) => (
                      <span key={name} className="text-xs font-medium" style={{ color: 'oklch(0.55 0.02 50)', fontFamily: 'var(--font-body)' }}>{name}</span>
                    ))}
                  </div>
                )}
              </>
            )
          })() : (
            <p className="text-center text-sm" style={{ color: 'oklch(0.5 0.02 50)', fontFamily: 'var(--font-body)' }}>250+ enterprise clients across 50+ countries.</p>
          )}
        </div>
      </section>

      {/* Board of Advisors */}
      {boardAdvisors.length > 0 && (
        <section className="relative section-dark py-16 sm:py-20 overflow-hidden">
          <div className="glass-orb glass-orb-rust w-[200px] h-[200px] top-0 -left-20" />
          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8" style={{ fontFamily: 'var(--font-display)' }}>
              Board of <span className="text-[oklch(0.55_0.15_30)]">Advisors</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {boardAdvisors.map((m) => (
                <div key={m._id} className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    {m.photoUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/30 text-lg font-bold">
                        {m.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                    )}
                  </div>
                  {m.linkedin ? (
                    <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white hover:text-[oklch(0.55_0.15_30)] transition-colors" style={{ fontFamily: 'var(--font-body)' }}>{m.name}</a>
                  ) : (
                    <span className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-body)' }}>{m.name}</span>
                  )}
                  <div className="text-xs text-white/50 mt-0.5" style={{ fontFamily: 'var(--font-body)' }}>{m.role}</div>
                  {m.linkedin && (
                    <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex mt-1.5 w-5 h-5 rounded-full items-center justify-center hover:bg-white/20 transition-colors" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-white/60"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* B Corp Badge */}
      <section className="section-light py-12">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-5 rounded-xl border border-black/5" style={{ background: 'oklch(0.97 0.01 80)' }}>
            <div className="text-3xl font-bold text-[oklch(0.55_0.15_30)]" style={{ fontFamily: 'var(--font-display)' }}>B</div>
            <div className="text-left">
              <div className="text-sm font-bold" style={{ fontFamily: 'var(--font-body)' }}>Certified B Corporation</div>
              <div className="text-xs text-[oklch(0.5_0.02_50)]" style={{ fontFamily: 'var(--font-body)' }}>Meeting the highest standards of social and environmental performance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials with category filter */}
      <section className="relative section-light py-20 sm:py-28 overflow-hidden">
        <div className="glass-orb glass-orb-amber w-[300px] h-[300px] -bottom-32 -left-32" />
        <div className="glass-orb glass-orb-rust w-[180px] h-[180px] top-20 -right-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                What Our <span className="text-[oklch(0.55_0.15_30)]">Clients</span> Say
              </h2>
              <p className="text-sm text-[oklch(0.5_0.02_50)]" style={{ fontFamily: 'var(--font-body)' }}>
                {activeFilter === "All" ? `${testimonials.length} voices. Two decades. One consistent thread: Tony and his team deliver.` : `${filteredTestimonials.length} ${activeFilter} testimonials.`}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(0.5 0.02 50)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className="text-xs px-3 py-2 rounded-full font-semibold tracking-wide transition-all shadow-sm"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    background: activeFilter === cat ? 'oklch(0.55 0.15 30)' : 'oklch(0.94 0.03 80)',
                    color: activeFilter === cat ? 'white' : 'oklch(0.45 0.02 50)',
                  }}
                  onMouseEnter={e => { if (activeFilter !== cat) (e.currentTarget as HTMLButtonElement).style.background = 'oklch(0.90 0.04 60)' }}
                  onMouseLeave={e => { if (activeFilter !== cat) (e.currentTarget as HTMLButtonElement).style.background = 'oklch(0.94 0.03 80)' }}
                >
                  {cat} <span style={{ opacity: 0.6, marginLeft: '2px' }}>({counts[cat] || 0})</span>
                </button>
              ))}
            </div>
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredTestimonials.map((t, i) => (
              <div
                key={i}
                className="break-inside-avoid rounded-xl p-7 border hover:shadow-md transition-shadow"
                style={{
                  background: t.tier === 'principal' ? 'oklch(0.97 0.02 30)' : 'oklch(0.97 0.01 80)',
                  borderColor: t.tier === 'principal' ? 'oklch(0.55 0.15 30 / 0.15)' : 'rgba(0,0,0,0.05)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="oklch(0.55 0.15 30 / 0.3)" stroke="none"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wide uppercase" style={{ fontFamily: 'var(--font-mono)', background: 'oklch(0.94 0.03 80)', color: 'oklch(0.45 0.02 50)' }}>{t.tag}</span>
                    {t.tier === 'principal' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wide uppercase" style={{ fontFamily: 'var(--font-mono)', background: 'oklch(0.55 0.15 30 / 0.1)', color: 'oklch(0.45 0.12 30)' }}>Principal</span>
                    )}
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-5 italic" style={{ color: 'oklch(0.35 0.02 50)', fontFamily: 'var(--font-body)' }}>&ldquo;{t.quote}&rdquo;</p>
                <div className="border-t border-black/5 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold" style={{ fontFamily: 'var(--font-body)' }}>{t.personName}</div>
                      <div className="text-xs" style={{ color: 'oklch(0.5 0.02 50)', fontFamily: 'var(--font-body)' }}>
                        {t.role}{t.company ? `, ${t.company}` : ""}
                      </div>
                    </div>
                    {(t.linkedin || t.twitter) && (
                      <div className="flex gap-1.5">
                        {t.linkedin && (
                          <a href={t.linkedin} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-[oklch(0.55_0.15_30)]/20 transition-colors" style={{ background: 'oklch(0.55 0.15 30 / 0.1)' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="oklch(0.55 0.15 30)"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                          </a>
                        )}
                        {t.twitter && (
                          <a href={t.twitter} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-[oklch(0.55_0.15_30)]/20 transition-colors" style={{ background: 'oklch(0.55 0.15 30 / 0.1)' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="oklch(0.55 0.15 30)"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Confidential Engagements */}
      {confidentialTestimonials.length > 0 && (
        <section className="relative section-dark py-20 sm:py-28 overflow-hidden">
          <div className="glass-orb glass-orb-blue w-[350px] h-[350px] -bottom-40 -right-40" />
          <div className="glass-orb glass-orb-amber w-[200px] h-[200px] top-20 -left-20" />
          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 mb-4">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(0.82 0.15 75)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[oklch(0.82_0.15_75)]" style={{ fontFamily: 'var(--font-body)' }}>Confidential Engagements</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                What Our <span className="text-[oklch(0.82_0.15_75)]">Confidential Clients</span> Say
              </h2>
              <p className="text-sm text-white/50 max-w-2xl mx-auto leading-relaxed italic" style={{ fontFamily: 'var(--font-body)' }}>
                Many of our most impactful engagements are protected by NDA. We've shared these with permission, with identifying details removed. References are available to qualified prospects upon request.
              </p>
            </div>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {confidentialTestimonials.map((t, i) => (
                <div key={i} className="glass-card break-inside-avoid p-7 hover:bg-white/[0.08] transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="oklch(0.82 0.15 75 / 0.3)" stroke="none"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wide uppercase"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        background: `color-mix(in oklch, ${divisionColors[t.division] ?? 'oklch(0.82 0.15 75)'}, transparent 85%)`,
                        color: divisionColors[t.division] ?? 'oklch(0.82 0.15 75)',
                      }}
                    >
                      {t.division}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed mb-5 italic" style={{ fontFamily: 'var(--font-body)' }}>"{t.quote}"</p>
                  <div className="border-t border-white/[0.06] pt-4">
                    <div className="flex items-center gap-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" className="shrink-0"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                      <span className="text-xs text-white/40 italic" style={{ fontFamily: 'var(--font-body)' }}>{t.attribution}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold transition-all shadow-lg"
                style={{ background: 'oklch(0.82 0.15 75)', color: 'oklch(0.15 0.02 75)', fontFamily: 'var(--font-body)', boxShadow: '0 10px 30px oklch(0.82 0.15 75 / 0.2)' }}
              >
                Request References
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <p className="text-xs text-white/30 mt-4" style={{ fontFamily: 'var(--font-body)' }}>References available to qualified prospects under NDA</p>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 sm:py-20" style={{ background: 'oklch(0.55 0.15 30)' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Ready to Write Your Own Success Story?
          </h2>
          <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
            The audit is free. The ROI guarantee is real. Let's talk.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold bg-white hover:bg-white/90 transition-all shadow-lg" style={{ color: 'oklch(0.35 0.1 30)', fontFamily: 'var(--font-body)' }}>
              Start a Conversation
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/process#flow-circuit" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-all" style={{ fontFamily: 'var(--font-body)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Flow Circuit Assessment
            </Link>
            <Link href="/process#find-me" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-all" style={{ fontFamily: 'var(--font-body)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
              Find Your Me
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
