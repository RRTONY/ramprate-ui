import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stratum — Web3 & Enterprise Blockchain Advisory | RampRate',
  description: 'Deep links to blockchain ecosystem: top ICO advisors, large mining pools, enterprise distributed app platforms. Non-dilutive funding and zero-cost transformative tech.',
}

const services = [
  { title: "Enterprise Blockchain Bridge", desc: "Connecting Fortune 500 to Web3. Deep links to blockchain ecosystem: top ICO advisors, large mining pools, enterprise distributed app platforms." },
  { title: "Non-Dilutive Funding", desc: "Non-dilutive funding through tokenized models. We've facilitated grants in excess of €4 million through partnerships like DevxDAO and XPRIZE." },
  { title: "DAO Governance Design", desc: "DAO governance design for multi-stakeholder consortia. From token economics to voting mechanisms to community management." },
  { title: "Regulatory Navigation", desc: "Custom consulting for blockchain orientation and roadmapping. Navigate the evolving regulatory landscape for digital assets, tokens, and decentralized organizations." },
  { title: "Tokenization Strategy", desc: "Design token models that align incentives across all stakeholders. From utility tokens to governance tokens to asset-backed tokens." },
  { title: "Zero-Cost Transformative Tech", desc: "Leverage blockchain and Web3 technology to transform operations at minimal cost — turning technology into a strategic advantage rather than a line-item expense." },
]

const blockchainServices = [
  { title: "Low-Cost Power for Mining", desc: "Megawatts of low-cost power for proof of work and mining pools." },
  { title: "Turnkey Mining Solutions", desc: "Turnkey mining solutions for investors looking to enter the space." },
  { title: "Enterprise Hosting for Trusted Nodes", desc: "Enterprise partners for hosting trusted nodes on major networks." },
  { title: "Blockchain Orientation & Roadmapping", desc: "Custom consulting for blockchain orientation and strategic roadmapping." },
  { title: "Enterprise Blockchain Bridge", desc: "Connecting Fortune 500 to Web3 — bridging the gap between enterprise and decentralized technology." },
  { title: "Non-Dilutive Funding", desc: "Non-dilutive funding through tokenized models and DAO grant programs." },
  { title: "DAO Governance Design", desc: "DAO governance design for multi-stakeholder consortia and community-driven organizations." },
]

const publishedInsights = [
  { title: "From Supply Chain to the Blockchain", url: "https://ramprate.com/from-supply-chain-to-the-blockchain/" },
  { title: "Enterprise Blockchain: Can Big Business Co-opt an Existential Threat?", url: "https://ramprate.com/enterprise-blockchain-can-big-business-co-opt-an-existential-threat/" },
  { title: "Historical Perspective on Blockchain", url: "https://ramprate.com/historical-perspective-on-blockchain/" },
  { title: "What Solutions Are Best Built with Blockchain — Or NOT", url: "https://ramprate.com/what-solutions-are-best-built-with-blockchain-or-not/" },
  { title: "The Ball and Blockchain: Obstacles to a World-Changing Trajectory", url: "https://ramprate.com/the-ball-and-blockchain-obstacles-to-a-world-changing-trajectory/" },
]

const relatedPosts = [
  { title: "Republic's Mirror Tokens — SpaceX and Beyond", date: "July 22, 2025", url: "https://ramprate.com/republics-mirror-tokens-spacex-and-beyond/", tag: "Tokens" },
  { title: "UNI Token Price Surge: A Reflection of the Market's Hunger for Effective Governance?", date: "March 5, 2024", url: "https://ramprate.com/uni-token-price-surge-a-reflection-of-the-markets-hunger-for-effective-governance/", tag: "Governance" },
  { title: "The Need for Burning Man to Convert into a DAO", date: "August 17, 2023", url: "https://ramprate.com/convert-burning-man-dao-menagerie/", tag: "DAO" },
  { title: "RampRate Works with DevxDAO and XPRIZE to Announce a Grant in Excess of €4 Million", date: "January 23, 2023", url: "https://ramprate.com/ramprate-works-with-devxdao-and-xprize/", tag: "Grants" },
  { title: "World Economic Forum: DAVOS 2022", date: "May 19, 2022", url: "https://ramprate.com/davos-2022-world-economic-forum-here-we-come/", tag: "WEF" },
]

const serviceIcons = [
  <svg key="blocks" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="8" height="8"/><rect x="14" y="2" width="8" height="8"/><rect x="2" y="14" width="8" height="8"/><rect x="14" y="14" width="8" height="8"/></svg>,
  <svg key="coins" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1110.34 18"/><path d="M7 6h1v4"/><path d="M16.71 13.88l.7.71-2.82 2.82"/></svg>,
  <svg key="globe" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  <svg key="shield" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  <svg key="file" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  <svg key="zap" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
]

export default function Web3Page() {
  return (
    <main>
      {/* Deep Dive Banner */}
      <div className="py-3 mt-20" style={{ background: 'linear-gradient(to right, oklch(0.6 0.2 280), oklch(0.5 0.18 260))' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-center gap-3">
          <span className="text-sm text-white/90 font-medium" style={{ fontFamily: 'var(--font-body)' }}>Explore the full Stratum experience</span>
          <a
            href="https://ramprate.com/web3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white hover:bg-white/30 transition-all"
            style={{ background: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-body)' }}
          >
            Deep Dive
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
      </div>

      {/* Hero */}
      <section className="relative pt-16 pb-20 overflow-hidden" style={{ background: 'var(--dark)' }}>
        <div className="glass-orb glass-orb-blue w-[400px] h-[400px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-amber w-[300px] h-[300px] bottom-0 -left-32" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" style={{ color: 'oklch(0.82 0.15 75)', fontFamily: 'var(--font-body)' }}>Stratum — Since 2015</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Connect Blockchain to Enterprise for{' '}
              <span style={{ color: 'oklch(0.55 0.15 30)' }}>Transformative Technology</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-10" style={{ fontFamily: 'var(--font-body)' }}>
              Deep links to blockchain ecosystem: top ICO advisors, large mining pools, enterprise distributed app platforms. Non-dilutive funding and zero-cost transformative tech.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: "Since", label: "2015" },
                { value: "For", label: "Enterprise & NGO Bridge" },
                { value: "Comp", label: "% of value created" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-4">
                  <div className="text-xl font-bold mb-1" style={{ color: 'oklch(0.82 0.15 75)', fontFamily: 'var(--font-display)' }}>{stat.value}</div>
                  <div className="text-xs text-white/50" style={{ fontFamily: 'var(--font-body)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What is Stratum */}
      <section className="relative section-warm overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-rust w-[300px] h-[300px] -bottom-32 -right-32" />
        <div className="glass-orb glass-orb-amber w-[180px] h-[180px] top-10 -left-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)' }}>The Bridge</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Non-Dilutive Capital & Zero-Cost Transformative Tech
          </h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed" style={{ color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)' }}>
            <p>
              Stratum bridges the gap between blockchain innovation and enterprise adoption. We connect Web3 projects with Fortune 500 companies, NGOs, and government entities — creating real-world utility for decentralized technology.
            </p>
            <p>
              Our track record includes facilitating grants in excess of €4 million through DevxDAO and XPRIZE, advising on DAO governance structures, and representing Web3 projects at the World Economic Forum in Davos.
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
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              What We <span style={{ color: 'oklch(0.55 0.15 30)' }}>Build</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={s.title} className="rounded-xl p-7 border border-black/5 hover:shadow-md transition-shadow" style={{ background: 'oklch(0.97 0.01 80)' }}>
                <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-5" style={{ background: 'oklch(0.55 0.15 30 / 0.1)' }}>
                  {serviceIcons[i]}
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 Blockchain Advisory Services */}
      <section className="relative section-warm overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-rust w-[300px] h-[300px] -bottom-32 -right-32" />
        <div className="glass-orb glass-orb-amber w-[180px] h-[180px] top-10 -left-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)' }}>Blockchain Advisory</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight mb-10" style={{ fontFamily: 'var(--font-display)' }}>
            Full-Spectrum <span style={{ color: 'oklch(0.55 0.15 30)' }}>Services</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {blockchainServices.map((s) => (
              <div key={s.title} className="bg-white rounded-lg p-5 border border-black/5 flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: 'oklch(0.55 0.15 30)' }} />
                <div>
                  <h3 className="text-sm font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>{s.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Published Insights */}
      <section className="relative section-dark overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-blue w-[350px] h-[350px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-amber w-[200px] h-[200px] bottom-20 -left-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <div className="flex items-center gap-3 mb-8">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
            <h2 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              Published <span style={{ color: 'oklch(0.55 0.15 30)' }}>Insights</span>
            </h2>
          </div>
          <p className="text-white/50 text-sm mb-8 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
            Our blockchain article series — deep dives into enterprise blockchain adoption, supply chain transformation, and the obstacles to a world-changing trajectory.
          </p>
          <div className="space-y-3">
            {publishedInsights.map((insight) => (
              <a
                key={insight.title}
                href={insight.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 rounded-lg px-6 py-4 border border-white/10 hover:bg-white/10 transition-colors group"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <span className="text-sm text-white/80 font-medium group-hover:text-white transition-colors" style={{ fontFamily: 'var(--font-body)' }}>{insight.title}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" className="shrink-0"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="relative section-light overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-amber w-[280px] h-[280px] -bottom-32 -left-32" />
        <div className="glass-orb glass-orb-rust w-[160px] h-[160px] top-20 -right-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)' }}>Our Commitment</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Right Person in the Room from All Sides
          </h2>
          <p className="mt-6 text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)' }}>
            Compensation tied to percentage of value created. We convene the right people and create real bridges between Web3 innovation and enterprise adoption.
          </p>
          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            {[
              { label: "Compensation", value: "% of value created" },
              { label: "Commitment", value: "Right person in the room from all sides" },
              { label: "Key Value", value: "Non-dilutive capital & zero-cost transformative tech" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl p-6 border border-black/5" style={{ background: 'oklch(0.97 0.01 80)' }}>
                <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'oklch(0.5 0.02 50)', fontFamily: 'var(--font-body)' }}>{item.label}</div>
                <div className="text-sm leading-relaxed font-medium" style={{ color: 'oklch(0.3 0.02 50)', fontFamily: 'var(--font-body)' }}>{item.value}</div>
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
            Web3 <span style={{ color: 'oklch(0.55 0.15 30)' }}>Insights</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((post) => (
              <a
                key={post.title}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl p-6 border border-black/5 hover:shadow-md transition-shadow group"
              >
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: 'oklch(0.55 0.15 30 / 0.1)', color: 'oklch(0.55 0.15 30)' }}>{post.tag}</span>
                <h3 className="mt-3 text-base font-bold tracking-tight line-clamp-2" style={{ fontFamily: 'var(--font-display)' }}>{post.title}</h3>
                <div className="mt-2 text-xs" style={{ color: 'oklch(0.5 0.02 50)', fontFamily: 'var(--font-body)' }}>{post.date}</div>
                <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)' }}>
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold bg-white hover:bg-white/90 transition-all shadow-lg" style={{ color: 'oklch(0.35 0.1 30)', fontFamily: 'var(--font-body)' }}>
              Start a Conversation
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <a
              href="https://ramprate.com/web3"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-all"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Explore Stratum Deep Dive
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
