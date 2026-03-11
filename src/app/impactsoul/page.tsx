import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ImpactSoul — Tokenize Assets to Rally Impact Movements | RampRate',
  description: 'Turn cultural treasures and purpose into powerful economic engines. For NGOs & Stewards of Art & Artifacts.',
}

const services = [
  { title: "Tokenize Assets", desc: "Turn cultural treasures, art, artifacts, and purpose-driven assets into powerful economic engines through tokenization — creating new revenue streams and global accessibility." },
  { title: "Rally Impact Movements", desc: "Build communities around your cause. We design engagement models that turn passive supporters into active participants and economic stakeholders." },
  { title: "3× Revenue, Up to 10× Value", desc: "Our models are designed to multiply — not just sustain. We create economic structures where impact drives revenue and revenue amplifies impact." },
  { title: "Global Brand Building", desc: "Transform your organization from a local operation into a globally recognized brand. At worst you get a fan club — at peak, a global movement." },
  { title: "Art & Cultural Stewardship", desc: "Specialized advisory for NGOs and stewards of art and artifacts. We help you preserve, protect, and monetize cultural heritage through modern technology." },
  { title: "Community-Driven Economics", desc: "Design token economies and community structures where every participant has skin in the game — aligning incentives from donors to operators to beneficiaries." },
]

const dnaSteps = [
  { num: "01", title: "Discover", desc: "Engage team, clients, partners, investors, community. Map impact priorities. Identify conflicts between stated values and actual practices.", color: "oklch(0.55 0.15 30)" },
  { num: "02", title: "Diagnose", desc: "Find disconnects between vision and actions. Deep focus on supply chain and external perception. Are we aligned? Do we vote our values with our budget?", color: "oklch(0.50 0.12 40)" },
  { num: "03", title: "Realign", desc: "Build better teams. Buy from shared-values partners. Uplift unheard voices. Create structures where impact and revenue reinforce each other.", color: "oklch(0.45 0.10 50)" },
]

const dnaOutcomes = [
  "Better talent attracted",
  "Investor goals aligned",
  "Brand equity improved",
  "Morale & retention increased",
  "Closer partnerships",
  "Feel good about work every day",
]

const relatedPosts = [
  { title: "Energy as Impact", date: "August 15, 2023", url: "https://ramprate.com/energy-as-impact/", tag: "Energy" },
  { title: "Edge Data Center Provider Redivider Expands Advisory Board", date: "July 5, 2023", url: "https://ramprate.com/edge-data-center-provider-redivider-expands-advisory/", tag: "Advisory" },
]

const serviceIcons = [
  <svg key="gem" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 18 3 22 9 12 22 2 9"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="12" y1="3" x2="12" y2="22"/><line x1="6" y1="3" x2="2" y2="9"/><line x1="18" y1="3" x2="22" y2="9"/></svg>,
  <svg key="heart" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  <svg key="trend" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  <svg key="globe" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  <svg key="palette" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
  <svg key="users" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
]

const dnaIcons = [
  <svg key="search" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  <svg key="steth" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3"/><path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-6v-4"/><circle cx="20" cy="10" r="2"/></svg>,
  <svg key="refresh" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
]

export default function ImpactSoulPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: 'var(--dark)' }}>
        <div className="glass-orb glass-orb-rust w-[400px] h-[400px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-amber w-[300px] h-[300px] bottom-0 -left-32" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[oklch(0.82_0.15_75)] mb-4 block" style={{ fontFamily: 'var(--font-body)' }}>ImpactSoul — Since 2024</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Tokenize Assets to Rally{' '}
              <span className="text-[oklch(0.55_0.15_30)]">Impact Movements</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-10" style={{ fontFamily: 'var(--font-body)' }}>
              Turn cultural treasures and purpose into powerful economic engines. For NGOs & Stewards of Art & Artifacts.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: "Since", label: "2024" },
                { value: "For", label: "NGOs & Stewards of Art & Artifacts" },
                { value: "Comp", label: "7.5% of asset equity to launch" },
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

      {/* What is ImpactSoul */}
      <section className="relative section-warm overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-rust w-[300px] h-[300px] -bottom-32 -right-32" />
        <div className="glass-orb glass-orb-amber w-[180px] h-[180px] top-10 -left-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[oklch(0.55_0.15_30)]" style={{ fontFamily: 'var(--font-body)' }}>The Mission</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Millions for Impact. 3× Revenue. Up to 10× Value.
          </h2>
          <div className="mt-8 space-y-5 text-base text-[oklch(0.4_0.02_50)] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
            <p>
              ImpactSoul exists at the intersection of purpose and economics. We help NGOs, cultural institutions, and impact-driven organizations transform their assets — art, artifacts, cultural heritage, environmental stewardship — into sustainable economic engines.
            </p>
            <p>
              Through tokenization, community building, and modern fundraising models, we create structures where doing good isn't just morally right — it's economically powerful. Impact and revenue aren't trade-offs — they're multipliers.
            </p>
          </div>
        </div>
      </section>

      {/* Impact DNA™ */}
      <section className="relative section-light overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-amber w-[280px] h-[280px] -bottom-32 -left-32" />
        <div className="glass-orb glass-orb-rust w-[160px] h-[160px] top-20 -right-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[oklch(0.55_0.15_30)]" style={{ fontFamily: 'var(--font-body)' }}>Syzygy Methodology</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Impact DNA™</h2>
            <p className="mt-4 text-base text-[oklch(0.45_0.02_50)] max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              A three-step process to align your organization's values with its actions — and turn that alignment into economic advantage.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {dnaSteps.map((step, i) => (
              <div key={step.num} className="bg-white rounded-xl p-7 border border-black/5 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-5xl font-black text-black/[0.04]" style={{ fontFamily: 'var(--font-mono)' }}>{step.num}</div>
                <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-5" style={{ background: `${step.color.replace('oklch(', 'oklch(').replace(')', ' / 0.1)')}` }}>
                  <span style={{ color: step.color }}>{dnaIcons[i]}</span>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>{step.title}</h3>
                <p className="text-sm text-[oklch(0.45_0.02_50)] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-8 border border-black/5" style={{ background: 'oklch(0.97 0.01 80)' }}>
            <h3 className="text-lg font-bold mb-5" style={{ fontFamily: 'var(--font-display)' }}>Outcomes</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {dnaOutcomes.map((outcome) => (
                <div key={outcome} className="flex items-center gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span className="text-sm text-[oklch(0.4_0.02_50)]" style={{ fontFamily: 'var(--font-body)' }}>{outcome}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* B Corp */}
      <section className="relative section-warm overflow-hidden py-16 sm:py-20">
        <div className="glass-orb glass-orb-rust w-[300px] h-[300px] -bottom-32 -right-32" />
        <div className="glass-orb glass-orb-amber w-[180px] h-[180px] top-10 -left-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-black/5 flex flex-col sm:flex-row items-center gap-8">
            <div className="w-20 h-20 shrink-0 rounded-full border-4 border-[oklch(0.55_0.15_30)] flex items-center justify-center">
              <span className="text-3xl font-bold text-[oklch(0.55_0.15_30)]" style={{ fontFamily: 'var(--font-display)' }}>B</span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>Certified B Corporation</h3>
              <p className="text-sm text-[oklch(0.45_0.02_50)] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                RampRate is a Certified B Corp — meeting the highest standards of verified social and environmental performance, public transparency, and legal accountability. We don't just advise on impact — we live it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative section-light overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-amber w-[280px] h-[280px] -bottom-32 -left-32" />
        <div className="glass-orb glass-orb-rust w-[160px] h-[160px] top-20 -right-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              How We Create <span className="text-[oklch(0.55_0.15_30)]">Impact</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={s.title} className="rounded-xl p-7 border border-black/5 hover:shadow-md transition-shadow" style={{ background: 'oklch(0.97 0.01 80)' }}>
                <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-5" style={{ background: 'oklch(0.55 0.15 30 / 0.1)' }}>
                  {serviceIcons[i]}
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>{s.title}</h3>
                <p className="text-sm text-[oklch(0.45_0.02_50)] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="relative section-dark overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-blue w-[350px] h-[350px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-amber w-[200px] h-[200px] bottom-20 -left-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[oklch(0.55_0.15_30)]" style={{ fontFamily: 'var(--font-body)' }}>Our Commitment</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            A Fan Club at Worst. A Global Brand at Peak.
          </h2>
          <p className="mt-6 text-lg text-white/60 leading-relaxed max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
            7.5% of asset equity to launch a movement. We don't charge upfront — we invest alongside you and earn when you succeed.
          </p>
          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            {[
              { label: "Compensation", value: "7.5% of asset equity to launch a movement" },
              { label: "Commitment", value: "A fan club at worst; a global brand at peak" },
              { label: "Key Value", value: "Millions for impact · 3× revenue · up to 10× value" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl p-6 border border-white/10" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="text-xs text-white/40 uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-body)' }}>{item.label}</div>
                <div className="text-sm text-white/80 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Blog Posts */}
      <section className="relative section-warm overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-rust w-[300px] h-[300px] -bottom-32 -right-32" />
        <div className="glass-orb glass-orb-amber w-[180px] h-[180px] top-10 -left-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-10" style={{ fontFamily: 'var(--font-display)' }}>
            Impact <span className="text-[oklch(0.55_0.15_30)]">Insights</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedPosts.map((post) => (
              <a key={post.title} href={post.url} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl p-7 border border-black/5 hover:shadow-md transition-shadow group">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: 'oklch(0.55 0.15 30 / 0.1)', color: 'oklch(0.55 0.15 30)' }}>{post.tag}</span>
                <h3 className="mt-3 text-lg font-bold tracking-tight group-hover:text-[oklch(0.55_0.15_30)] transition-colors" style={{ fontFamily: 'var(--font-display)' }}>{post.title}</h3>
                <div className="mt-2 text-xs text-[oklch(0.5_0.02_50)]" style={{ fontFamily: 'var(--font-body)' }}>{post.date}</div>
                <span className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-[oklch(0.55_0.15_30)]" style={{ fontFamily: 'var(--font-body)' }}>
                  Read on ramprate.com
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </a>
            ))}
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
