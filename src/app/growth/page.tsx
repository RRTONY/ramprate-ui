import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Syzygy Growth Advisory — Anchor Clients, Advisors, Capital | RampRate',
  description: 'Anchor clients, advisors, capital, impact, strategy, and dispute resolution — all aligned to your vision. For Founders & Impactpreneurs.',
}

const highlightServices = [
  { title: "Anchor Clients", desc: "We leverage our 24-year enterprise network to connect founders with their first Fortune 500 customers — the kind of anchor clients that validate your product and accelerate everything that follows." },
  { title: "Advisors & Board", desc: "Access our board of advisors — former executives from Apple, Sony, Deloitte, Accenture, Sephora, and the US Treasury — as fractional strategic guidance for your company." },
  { title: "Capital & Fundraising", desc: "From pitch refinement to investor introductions to term sheet negotiation. We connect founders with the right capital at the right stage, whether that's venture, grants, or strategic investment." },
  { title: "Impact Alignment", desc: "We help founders build businesses where impact and revenue aren't trade-offs — they're multipliers. ESG strategy, B Corp certification guidance, and impact measurement frameworks." },
  { title: "Strategy & Dispute Resolution", desc: "Go-to-market strategy, partnership structuring, and when things get complicated — dispute resolution with surgical precision. We clean up intractable messes." },
  { title: "Kick Down Barriers", desc: "The barriers that stop most founders — access, credibility, introductions, enterprise procurement cycles — are the barriers we've spent 24 years learning to break down." },
]

const advisoryServices = [
  { num: "01", title: "The Audit", desc: "Validate you can deliver on core promises. Build a roadmap for growth." },
  { num: "02", title: "Positioning", desc: "Core value proposition clarity for all your audiences — investors, customers, partners." },
  { num: "03", title: "Marketing Cleanup", desc: "Investor decks, white papers, website made clear and compelling." },
  { num: "04", title: "Critical Partnerships", desc: "Complementary tech, channels, accelerators connected through our network." },
  { num: "05", title: "Recruiting", desc: "Employees, contractors, advisors, service providers — the right people at the right time." },
  { num: "06", title: "Social Impact Strategies", desc: "Find the lever to do good. Measure and report your impact." },
  { num: "07", title: "Strategic Research", desc: "Customers, competitors, partners identified. Markets quantified with data." },
  { num: "08", title: "Strategy Validation", desc: "Staffing, product roadmap, partners pressure-tested with data." },
  { num: "09", title: "Token / IPO Amplification", desc: "Liquidity management, exchange listings, price/volume optimization." },
  { num: "10", title: "Advisory Board Membership", desc: "Tony Greenberg and network lend name and reputation publicly to your company." },
]

const highlightIcons = [
  <svg key="target" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  <svg key="users" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  <svg key="chart" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  <svg key="handshake" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  <svg key="compass" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  <svg key="rocket" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
]

export default function GrowthPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: 'var(--dark)' }}>
        <div className="glass-orb glass-orb-rust w-[400px] h-[400px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-amber w-[300px] h-[300px] bottom-0 -left-32" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[oklch(0.82_0.15_75)] mb-4 block" style={{ fontFamily: 'var(--font-body)' }}>Syzygy — Since 2018</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Anchor Clients. Advisors. Capital.{' '}
              <span className="text-[oklch(0.55_0.15_30)]">All Aligned to Your Vision.</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-10" style={{ fontFamily: 'var(--font-body)' }}>
              Anchor clients, advisors, capital, impact, strategy, and dispute resolution — all aligned to your vision. For Founders & Impactpreneurs.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: "Since", label: "2018" },
                { value: "For", label: "Founders & Impactpreneurs" },
                { value: "Comp", label: "Equity/tokens + commission + retainers" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-4">
                  <div className="text-xl font-bold text-[oklch(0.82_0.15_75)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>{stat.value}</div>
                  <div className="text-xs text-white/50" style={{ fontFamily: 'var(--font-body)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What is Syzygy */}
      <section className="relative section-warm overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-rust w-[300px] h-[300px] -bottom-32 -right-32" />
        <div className="glass-orb glass-orb-amber w-[180px] h-[180px] top-10 -left-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[oklch(0.55_0.15_30)]" style={{ fontFamily: 'var(--font-body)' }}>The Model</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Kick Down Barriers. Find Allies. Focus on Build.
          </h2>
          <div className="mt-8 space-y-5 text-base text-[oklch(0.4_0.02_50)] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
            <p>
              Syzygy: when celestial bodies align to create extraordinary gravitational force. We align founders with the customers, capital, and connections that create escape velocity.
            </p>
            <p>
              Most growth advisors sell you a methodology. We sell you access. Access to the 350+ vendor relationships, 50+ country network, and 24 years of enterprise trust that our principals have built. When a CIO at a Fortune 500 company takes our call, they're not taking a cold call from an advisor — they're taking a call from someone who saved them millions on their last infrastructure deal. That trust transfers to you.
            </p>
          </div>
        </div>
      </section>

      {/* Highlight Services */}
      <section className="relative section-light overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-amber w-[280px] h-[280px] -bottom-32 -left-32" />
        <div className="glass-orb glass-orb-rust w-[160px] h-[160px] top-20 -right-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              How We Help Founders <span className="text-[oklch(0.55_0.15_30)]">Win</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlightServices.map((s, i) => (
              <div key={s.title} className="rounded-xl p-7 border border-black/5 hover:shadow-md transition-shadow" style={{ background: 'oklch(0.97 0.01 80)' }}>
                <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-5" style={{ background: 'oklch(0.55 0.15 30 / 0.1)' }}>
                  {highlightIcons[i]}
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>{s.title}</h3>
                <p className="text-sm text-[oklch(0.45_0.02_50)] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10 Advisory Services */}
      <section className="relative section-warm overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-rust w-[300px] h-[300px] -bottom-32 -right-32" />
        <div className="glass-orb glass-orb-amber w-[180px] h-[180px] top-10 -left-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[oklch(0.55_0.15_30)]" style={{ fontFamily: 'var(--font-body)' }}>Startup Advisory Services</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight mb-10" style={{ fontFamily: 'var(--font-display)' }}>
            The Full <span className="text-[oklch(0.55_0.15_30)]">Playbook</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {advisoryServices.map((s) => (
              <div key={s.num} className="flex gap-4 bg-white rounded-lg p-5 border border-black/5">
                <div className="text-2xl font-bold shrink-0 w-10" style={{ fontFamily: 'var(--font-mono)', color: 'oklch(0.55 0.15 30 / 0.2)' }}>
                  {s.num}
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>{s.title}</h3>
                  <p className="text-xs text-[oklch(0.45_0.02_50)] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fee Structure & Process */}
      <section className="relative section-dark overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-blue w-[350px] h-[350px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-amber w-[200px] h-[200px] bottom-20 -left-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[oklch(0.55_0.15_30)]" style={{ fontFamily: 'var(--font-body)' }}>Fee Structure</span>
              <h2 className="mt-4 text-3xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>Aligned Incentives</h2>
              <div className="space-y-4">
                {[
                  { label: "Equity / Tokens", desc: "We take a stake in your success, aligning our incentives with your growth trajectory." },
                  { label: "Commission on Revenue", desc: "We earn when you earn — tied to the revenue we help generate through our network." },
                  { label: "Project Fees / Retainers", desc: "Structured engagements for specific deliverables with clear milestones." },
                ].map((f) => (
                  <div key={f.label} className="rounded-lg p-5 border border-white/10" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="text-sm font-bold text-white mb-1" style={{ fontFamily: 'var(--font-body)' }}>{f.label}</div>
                    <p className="text-xs text-white/50 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[oklch(0.55_0.15_30)]" style={{ fontFamily: 'var(--font-body)' }}>Our Process</span>
              <h2 className="mt-4 text-3xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>How We Engage</h2>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Review", desc: "We review your presentations, investor materials, and product documentation." },
                  { step: "2", title: "Down-Select", desc: "We determine fit based on impact potential, market opportunity, and team capability." },
                  { step: "3", title: "Deep Dive", desc: "Interviews with your customers, investors, and partners to validate the opportunity." },
                  { step: "4", title: "Activate", desc: "We deploy our network, advisory board, and enterprise connections on your behalf." },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'oklch(0.55 0.15 30)' }}>
                      <span className="text-xs font-bold text-white" style={{ fontFamily: 'var(--font-mono)' }}>{s.step}</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-body)' }}>{s.title}</div>
                      <p className="text-xs text-white/50 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20" style={{ background: 'oklch(0.55 0.15 30)' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Trust Us With What You Hate to Do
          </h2>
          <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
            And focus on the change you want to create in the world.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold bg-white text-[oklch(0.35_0.1_30)] hover:bg-white/90 transition-all shadow-lg" style={{ fontFamily: 'var(--font-body)' }}>
              Start a Conversation
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/process#flow-circuit" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-all" style={{ fontFamily: 'var(--font-body)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Flow Circuit
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
