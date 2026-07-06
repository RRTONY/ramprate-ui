import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Private Advisory — Because Some Challenges Require More Than an Advisor | RampRate',
  description: 'RampRate Private Advisory: 25 years and $10B+ in enterprise decisions. Crisis management, strategy, transaction communications, and board advisory for leaders navigating moments that matter most.',
  keywords: [
    'crisis management advisory',
    'executive reputation strategy',
    'board advisory',
    'transaction communications',
    'executive media coaching',
  ],
}

const services = [
  {
    title: 'Crisis & Issues Management',
    desc: 'When everything feels like it is moving too fast, we help you slow it down. Our job is to keep you ahead of complex and fast-breaking situations — in the press, in your personal life, or behind closed doors. We help you find your footing, communicate with clarity, and protect what matters most.',
  },
  {
    title: 'Strategy & Reputation',
    desc: 'Your reputation is one of the most valuable things you own, and one of the most fragile. Whether you are a CEO building a public platform, an executive managing a sensitive transition, or a person facing a crisis — we help you take back control of the narrative. Everyone arrives here carrying something. We help you move forward on your terms.',
  },
  {
    title: 'Transaction & Financial Communications',
    desc: 'High-stakes financial moments require more than good advice. Whether you are navigating a merger, a sale, an IPO, or an activist situation, we help you communicate with precision and purpose at every stage. The goal is always the same: protect your value and move decisively.',
  },
  {
    title: 'AI + Innovation',
    desc: 'The way the world communicates is changing faster than most people can track. We help individuals and organizations understand what that means for them, cut through the noise, and use the right tools to their advantage. This is not a future conversation. It is happening now.',
  },
  {
    title: 'Board Advisory',
    desc: "We safeguard the reputation of the board amidst shifts in stakeholder sentiment. We help directors see around corners, navigate activist pressure, and maintain the confidence of the people who matter most to your organization's future.",
  },
  {
    title: 'Presentation & Media Coaching',
    desc: 'You need to communicate effectively and persuasively. We provide best-in-class, personalized training from senior communicators with decades of experience at the highest levels of media, politics, and corporate reputation.',
  },
]

const serviceIcons = [
  <svg key="shield" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  <svg key="star" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  <svg key="trending" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  <svg key="zap" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  <svg key="briefcase" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>,
  <svg key="mic" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
]

export default function PrivateAdvisoryPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: 'var(--dark)' }}>
        <div className="glass-orb glass-orb-amber w-[420px] h-[420px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-rust w-[260px] h-[260px] bottom-0 -left-32" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" style={{ color: 'var(--gold-light)', fontFamily: 'var(--font-body)' }}>
              Private Advisory — RampRate
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Because Some Challenges Require{' '}
              <span style={{ color: 'var(--gold)' }}>More Than an Advisor.</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-10" style={{ fontFamily: 'var(--font-body)' }}>
              We partner with leaders to navigate the moments that matter most — bringing the expertise, relationships, and strategic range to move from uncertainty to decisive action.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: '25 Years', label: 'of enterprise decisions' },
                { value: '$10B+', label: 'in decisions advised' },
                { value: 'B Corp', label: 'Certified · Highest standards' },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-4">
                  <div className="text-xl font-bold mb-1" style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>{stat.value}</div>
                  <div className="text-xs text-white/50" style={{ fontFamily: 'var(--font-body)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="relative section-warm overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-amber w-[300px] h-[300px] -bottom-32 -right-32" />
        <div className="glass-orb glass-orb-rust w-[180px] h-[180px] top-10 -left-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: 'oklch(0.52 0.12 70)', fontFamily: 'var(--font-body)' }}>
            Who We Are
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            The Person Sitting Above the Table.
          </h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed" style={{ color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)' }}>
            <p>
              RampRate is a B Labs certified advisory firm with 25 years and $10B+ in enterprise decisions behind us. We are not your lawyer, your accountant, your publicist, or your investigator. But we work with all of them.
            </p>
            <p>
              Think of us as the person sitting above the table — making sure every professional you have engaged is pointed in the right direction, working from the same page, and focused on what actually matters to you. Most people in complex situations find themselves managing a roster of specialists who are each excellent in their lane but not talking to each other. We close that gap.
            </p>
            <p>
              We coordinate, we pressure-test, and when something falls through the cracks, we catch it. You should not have to be the one holding all of this together. That is what we are here for.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative section-light overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-amber w-[280px] h-[280px] -bottom-32 -left-32" />
        <div className="glass-orb glass-orb-rust w-[160px] h-[160px] top-20 -right-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: 'oklch(0.52 0.12 70)', fontFamily: 'var(--font-body)' }}>
              What We Do
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Six Practice Areas.{' '}
              <span style={{ color: 'oklch(0.52 0.12 70)' }}>One Trusted Partner.</span>
            </h2>
            <p className="mt-4 text-base max-w-2xl mx-auto leading-relaxed" style={{ color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)' }}>
              From crisis to growth, reputation to innovation — we bring the full range of expertise required for the moments that define careers and organizations.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={s.title} className="rounded-xl p-7 border border-black/5 hover:shadow-md transition-shadow" style={{ background: 'oklch(0.97 0.01 80)' }}>
                <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-5" style={{ background: 'oklch(0.72 0.15 75 / 0.12)' }}>
                  {serviceIcons[i]}
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Engage */}
      <section className="relative section-dark overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-amber w-[350px] h-[350px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-rust w-[200px] h-[200px] bottom-20 -left-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: 'var(--gold)', fontFamily: 'var(--font-body)' }}>
            How We Engage
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Structure, Transparency, No Moving Goalposts.
          </h2>
          <p className="mt-6 text-base text-white/60 leading-relaxed max-w-2xl" style={{ fontFamily: 'var(--font-body)' }}>
            We work on a retainer plus a savings or success fee calculated against a mutually agreed baseline. That baseline is established together at the start of the engagement — with no ambiguity and no moving goalposts. Our success fee only triggers when we deliver measurable value above it. If we cannot create leverage for you, we will tell you that fast.
          </p>
          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            {[
              { label: 'Structure', value: 'Retainer + savings or success fee against an agreed baseline' },
              { label: 'Transparency', value: 'Baseline established together at start — no ambiguity' },
              { label: 'Accountability', value: 'Success fee only triggers when we deliver measurable value' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl p-6 border border-white/10" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--gold)', fontFamily: 'var(--font-body)' }}>{item.label}</div>
                <div className="text-sm text-white/80 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B Corp */}
      <section className="relative section-warm overflow-hidden py-16 sm:py-20">
        <div className="glass-orb glass-orb-amber w-[300px] h-[300px] -bottom-32 -right-32" />
        <div className="glass-orb glass-orb-rust w-[180px] h-[180px] top-10 -left-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-black/5 flex flex-col sm:flex-row items-center gap-8">
            <div className="w-20 h-20 shrink-0 rounded-full border-4 flex items-center justify-center" style={{ borderColor: 'var(--gold)' }}>
              <span className="text-3xl font-bold" style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>B</span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>Certified B Corporation</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)' }}>
                RampRate is a Certified B Corp — meeting the highest standards of verified social and environmental performance, public transparency, and legal accountability. We don&apos;t just advise on impact — we live it. Every engagement reflects our commitment to doing business the right way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20" style={{ background: 'oklch(0.52 0.12 70)' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Ready to Move From Uncertainty to Decisive Action?
          </h2>
          <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
            The next step is simple. We connect to confirm mutual fit, then draft a proposal outlining scope and commercial terms. Everything moves at your pace.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold bg-white hover:bg-white/90 transition-all shadow-lg"
              style={{ color: 'oklch(0.35 0.1 70)', fontFamily: 'var(--font-body)' }}
            >
              Start a Conversation
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link
              href="/process"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-all"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              How We Work
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
