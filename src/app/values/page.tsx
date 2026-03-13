import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Values — Consciousness-Aligned Capital | RampRate',
  description: 'We believe business can be a force for regeneration, not extraction. Everything we do flows from a commitment to conscious, impact-driven investment.',
}

const values = [
  { title: "Transparency Over Opacity", desc: "We benchmark every contract against 150K+ real data points. No hidden fees, no conflicts of interest, no vendor kickbacks. Our clients see what we see.", icon: "shield" },
  { title: "Regenerative, Not Extractive", desc: "As a Certified B Corporation, we measure success by impact — not just revenue. Every engagement leaves systems healthier than we found them.", icon: "leaf" },
  { title: "Principals, Not Pyramids", desc: "The same senior team that wins the engagement executes it. No bait-and-switch staffing. 25 years of the same people doing the work.", icon: "users" },
  { title: "Skin in the Game", desc: "We tie our compensation to outcomes. If we don't create value, we don't get paid. That's not a tagline — it's our business model.", icon: "zap" },
]

const brands = [
  { name: "RampRate", color: "oklch(0.6 0.15 250)", desc: "Enterprise IT sourcing built on transparency and conscious resource allocation." },
  { name: "Syzygy", color: "oklch(0.65 0.2 150)", desc: "Growth strategy for founders who believe in conscious business." },
  { name: "Stratum", color: "oklch(0.6 0.2 280)", desc: "Web3 infrastructure that prioritizes decentralization over extraction." },
  { name: "ImpactSoul", color: "oklch(0.82 0.15 75)", desc: "Asset tokenization for regenerative and cultural projects." },
]

const valueIcons: Record<string, React.ReactNode> = {
  shield: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="oklch(0.82 0.15 75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  leaf: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="oklch(0.82 0.15 75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.34a1 1 0 001.64 1.16C8.62 17.38 12 16 21 16c-4.06-2.84-5-5.7-4-8z"/></svg>,
  users: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="oklch(0.82 0.15 75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  zap: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="oklch(0.82 0.15 75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
}

export default function ValuesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: 'var(--dark)' }}>
        <div className="glass-orb glass-orb-amber w-[400px] h-[400px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-blue w-[300px] h-[300px] bottom-0 -left-32" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" style={{ color: 'oklch(0.82 0.15 75)', fontFamily: 'var(--font-body)' }}>Our Values</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Consciousness-Aligned<br /><span style={{ color: 'oklch(0.82 0.15 75)' }}>Capital</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              We believe business can be a force for regeneration, not extraction. Everything we do — from sourcing decisions to tokenization design — flows from a commitment to conscious, impact-driven investment.
            </p>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-24" style={{ background: '#0d1117' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((v) => (
              <div key={v.title} className="relative p-8 rounded-2xl border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="mb-4">{valueIcons[v.icon]}</div>
                <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>{v.title}</h3>
                <p className="text-white/60 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regenerative vs Extractive */}
      <section className="py-24" style={{ background: '#0a0f1a' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-16" style={{ fontFamily: 'var(--font-display)' }}>The Difference</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl border border-red-500/20" style={{ background: 'rgba(239,68,68,0.03)' }}>
              <h3 className="text-lg font-bold text-red-400 mb-4 uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>Extractive</h3>
              <ul className="space-y-3 text-white/50" style={{ fontFamily: 'var(--font-body)' }}>
                <li>Take value, externalize costs, move on</li>
                <li>Bill hours regardless of outcome</li>
                <li>Junior staff execute, seniors sell</li>
                <li>Vendor relationships are transactional</li>
                <li>Success = revenue captured</li>
              </ul>
            </div>
            <div className="p-8 rounded-2xl border" style={{ borderColor: 'oklch(0.65 0.2 150 / 0.2)', background: 'oklch(0.65 0.2 150 / 0.03)' }}>
              <h3 className="text-lg font-bold mb-4 uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)', color: 'oklch(0.65 0.2 150)' }}>Regenerative</h3>
              <ul className="space-y-3 text-white/70" style={{ fontFamily: 'var(--font-body)' }}>
                <li>Create value, distribute benefit, leave systems healthier</li>
                <li>Compensation tied to value created</li>
                <li>Same principals from pitch to execution</li>
                <li>Vendor relationships are partnerships</li>
                <li>Success = ecosystem strengthened</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Four Brands */}
      <section className="py-24" style={{ background: '#0d1117' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4" style={{ fontFamily: 'var(--font-display)' }}>Four Brands, One Philosophy</h2>
          <p className="text-white/50 text-center mb-16 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
            Across our four brands, we serve different markets with the same values.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {brands.map((b) => (
              <div key={b.name} className="p-6 rounded-xl border border-white/10 text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <h3 className="text-lg font-bold mb-3" style={{ color: b.color, fontFamily: 'var(--font-display)' }}>{b.name}</h3>
                <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B Corp */}
      <section className="py-24" style={{ background: '#0a0f1a' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <p className="text-sm text-white/40 uppercase tracking-widest mb-4" style={{ fontFamily: 'var(--font-mono)' }}>Certified Since 2022</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>Certified B Corporation</h2>
          <p className="text-white/60 leading-relaxed mb-8 max-w-xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
            RampRate meets the highest standards of verified social and environmental performance, public transparency, and legal accountability to balance profit and purpose.
          </p>
          <a
            href="https://www.bcorporation.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold hover:underline"
            style={{ color: 'oklch(0.82 0.15 75)', fontFamily: 'var(--font-body)' }}
          >
            View our B Corp profile
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{ background: '#0d1117' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Let's Build Something Different
          </h2>
          <p className="text-white/60 mb-10 max-w-xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
            Ready to align capital with consciousness? Tell us what's broken.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-bold transition-all shadow-lg"
            style={{ background: 'oklch(0.82 0.15 75)', color: 'oklch(0.15 0.02 75)', fontFamily: 'var(--font-body)', boxShadow: '0 10px 30px oklch(0.82 0.15 75 / 0.2)' }}
          >
            Tell Us What's Broken
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>
    </main>
  )
}
