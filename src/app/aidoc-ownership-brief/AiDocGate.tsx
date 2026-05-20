'use client'

import { useState, useRef } from 'react'

/* ── custom color tokens (oklch — not in Tailwind palette) ── */
const Y  = 'oklch(0.82 0.15 75)'
const YL = 'oklch(0.92 0.10 75)'
const ACCESS_CODE = 'Ap3'

/* ── data ─────────────────────────────────────────────────── */
const ownershipTiers = [
  {
    tier: 'Executive Producer', token: 'EP-NFT', allocation: '30%', minInvest: '$250,000',
    rights: ['Full creative approval rights', 'Profit share from all revenue streams', 'Named credit — opening titles', 'Exclusive screening invites', 'Governance voting (2x weight)'],
    color: Y, colorHex: '#ca8a04',
  },
  {
    tier: 'Associate Producer', token: 'AP-NFT', allocation: '25%', minInvest: '$100,000',
    rights: ['Advisory board seat', 'Profit share from streaming + theatrical', 'Named credit — main titles', 'Festival premiere access', 'Governance voting (1x weight)'],
    color: '#f97316', colorHex: '#f97316',
  },
  {
    tier: 'Impact Investor', token: 'II-TOKEN', allocation: '25%', minInvest: '$25,000',
    rights: ['Streaming revenue share', 'Merchandise royalties', 'End-title credit', 'Digital screening access', 'Governance voting (0.5x weight)'],
    color: '#84cc16', colorHex: '#84cc16',
  },
  {
    tier: 'Community Backer', token: 'CB-TOKEN', allocation: '20%', minInvest: '$1,000',
    rights: ['Fractional streaming revenue', 'Digital download rights', 'Community credit roll', 'NFT collectible access', 'Governance voting (0.1x weight)'],
    color: '#38bdf8', colorHex: '#38bdf8',
  },
]

const revenueStreams = [
  { stream: 'Theatrical Distribution', pct: 35, color: Y },
  { stream: 'Streaming (Netflix, Apple, Amazon)', pct: 28, color: '#f97316' },
  { stream: 'International Sales & Licensing', pct: 18, color: '#84cc16' },
  { stream: 'NFT & Digital Collectibles', pct: 10, color: '#38bdf8' },
  { stream: 'Educational Licensing', pct: 6, color: '#a78bfa' },
  { stream: 'Merchandise & Brand Partnerships', pct: 3, color: '#f472b6' },
]

const tokenDistribution = [
  { label: 'Executive Producers', pct: 30, color: Y },
  { label: 'Associate Producers', pct: 25, color: '#f97316' },
  { label: 'Impact Investors', pct: 25, color: '#84cc16' },
  { label: 'Community Backers', pct: 20, color: '#38bdf8' },
]

const milestones = [
  {
    phase: '01', title: 'Pre-Production & Token Launch', duration: 'Months 1–3', status: 'active',
    tasks: ['Smart contract deployment on Ethereum/Polygon', 'Token sale: EP-NFT and AP-NFT private round', 'Director and core crew agreements signed', 'Story development & interview subject commitments', 'Legal: SEC Reg D / Reg CF filing completed'],
  },
  {
    phase: '02', title: 'Principal Photography', duration: 'Months 4–8', status: 'pending',
    tasks: ['AI lab access & embedded filming (6 facilities)', 'Expert interviews: 40+ AI researchers & ethicists', 'Community token sale opens (II-TOKEN + CB-TOKEN)', 'Monthly token-holder progress updates', 'Rough cut preview — EP & AP holders only'],
  },
  {
    phase: '03', title: 'Post-Production', duration: 'Months 9–13', status: 'pending',
    tasks: ['Editing, color grading, original score composition', 'Festival cut delivered (Sundance / SXSW submission)', 'Token-holder governance vote: distribution strategy', 'International sales screening — Cannes market', 'NFT collectible drop: exclusive behind-the-scenes'],
  },
  {
    phase: '04', title: 'Festival & Theatrical Release', duration: 'Months 14–18', status: 'pending',
    tasks: ['World premiere — major documentary festival', 'Theatrical distribution deal finalized', 'First revenue distribution to token holders', 'Educational licensing rollout (universities)', 'Community backer digital download delivery'],
  },
  {
    phase: '05', title: 'Streaming & Long-Tail Revenue', duration: 'Months 19–36', status: 'pending',
    tasks: ['Streaming platform debut (primary platform TBD)', 'Quarterly revenue distributions via smart contract', 'International dub & subtitle versions released', 'Sequel / series development — token-holder vote', 'Final full revenue report to all token holders'],
  },
]

const budgetBreakdown = [
  { category: 'Production (crew, equipment, travel)', amount: '$1,200,000', pct: 40 },
  { category: 'Director & Key Talent Fees', amount: '$450,000', pct: 15 },
  { category: 'Post-Production (edit, color, audio)', amount: '$600,000', pct: 20 },
  { category: 'Festival & Distribution Strategy', amount: '$300,000', pct: 10 },
  { category: 'Legal, Compliance & Smart Contracts', amount: '$150,000', pct: 5 },
  { category: 'Marketing & PR Campaign', amount: '$225,000', pct: 7.5 },
  { category: 'Contingency Reserve', amount: '$75,000', pct: 2.5 },
]

const rights = [
  { icon: '🎬', title: 'Creative Control', desc: 'Director retains final cut rights. EP-NFT holders have approval rights over major creative decisions via on-chain governance vote.' },
  { icon: '💰', title: 'Revenue Rights', desc: 'All token tiers receive proportional revenue share. Smart contracts execute distributions automatically within 48hrs of receipt.' },
  { icon: '©️', title: 'IP Ownership', desc: 'Master copyright held by the production LLC. Token holders receive revenue participation rights — not copyright ownership.' },
  { icon: '🗳️', title: 'Governance Rights', desc: 'Token-weighted voting on: distribution platform choice, sequel development, licensing deals above $500K, and major budget reallocations.' },
  { icon: '🔒', title: 'Lock-Up Period', desc: 'EP-NFT and AP-NFT tokens have a 12-month lock-up. II-TOKEN and CB-TOKEN are transferable on secondary markets after 6 months.' },
  { icon: '🌐', title: 'Secondary Market', desc: 'Tokens tradeable on approved NFT marketplaces post-lock-up. RampRate earns 2.5% secondary royalty; 1% flows back to the community pool.' },
]

/* ── gate screen ──────────────────────────────────────────── */
function GateScreen({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode]   = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function attempt() {
    if (code === ACCESS_CODE) {
      onUnlock()
    } else {
      setError(true); setShake(true); setCode('')
      setTimeout(() => setShake(false), 500)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: '#000000', fontFamily: "'Inter', sans-serif" }}>
      <div
        className="w-full max-w-md rounded-md text-center px-8 py-14 sm:px-12"
        style={{
          background: '#F5F2EC',
          borderTop: '4px solid #5B21B6',
          boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
          transform: shake ? 'translateX(-6px)' : 'none',
          transition: 'transform 0.1s',
        }}
      >
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-5">
          Restricted Access · The AI Doc
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight tracking-tight text-zinc-900"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          Ownership Brief
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-9 max-w-xs mx-auto">
          This document is for specific recipients only. Enter your access code to continue.
        </p>
        <input
          ref={inputRef}
          type="password"
          value={code}
          autoFocus
          onChange={e => { setCode(e.target.value); setError(false) }}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          placeholder="Enter access code"
          className="w-full rounded px-5 py-4 text-sm text-center tracking-widest outline-none font-mono mb-3"
          style={{
            background: '#E8E4DB',
            border: error ? '1.5px solid #EF4444' : '1.5px solid transparent',
            color: '#374151',
          }}
        />
        {error && <p className="text-xs text-red-500 mb-3 tracking-wide">Incorrect code. Please try again.</p>}
        <button
          onClick={attempt}
          className="w-full py-4 text-white font-bold text-xs tracking-widest uppercase rounded cursor-pointer transition-colors"
          style={{ background: '#5B21B6' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#4C1D95')}
          onMouseLeave={e => (e.currentTarget.style.background = '#5B21B6')}
        >
          Enter
        </button>
      </div>
    </div>
  )
}

/* ── full content ─────────────────────────────────────────── */
function AiDocContent() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#fff' }}>

      {/* HERO */}
      <section
        className="relative overflow-hidden text-center px-4 pt-20 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24"
        style={{ background: 'linear-gradient(135deg,#0a0a0a 0%,#111 60%,#1a1200 100%)', borderBottom: '1px solid #2a2a2a' }}
      >
        <div className="absolute rounded-full pointer-events-none"
          style={{ width: 600, height: 600, background: 'oklch(0.82 0.15 75/0.07)', top: -280, right: -160 }} />
        <div className="absolute rounded-full pointer-events-none"
          style={{ width: 400, height: 400, background: 'oklch(0.82 0.15 75/0.04)', bottom: -160, left: -80 }} />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* badge */}
          <span className="inline-block text-xs font-bold tracking-widest uppercase rounded-full px-5 py-1.5 mb-7"
            style={{ background: 'oklch(0.82 0.15 75/0.12)', border: '1px solid oklch(0.82 0.15 75/0.35)', color: YL }}>
            Confidential · Token Offering Document
          </span>

          {/* headline */}
          <h1 className="font-extrabold leading-tight mb-5 text-4xl sm:text-5xl lg:text-6xl" style={{ letterSpacing: -1.5 }}>
            AI Doc Film<br />
            <span style={{ color: Y }}>Tokenization Proposal</span>
          </h1>

          <p className="font-light leading-relaxed mb-12 text-sm sm:text-base lg:text-lg max-w-xl mx-auto" style={{ color: '#a3a3a3' }}>
            Ownership Brief — A decentralized co-ownership model for the definitive documentary on artificial intelligence: rights, revenue, governance, and impact.
          </p>

          {/* stats */}
          <div className="flex flex-wrap justify-center">
            {[
              { num: '$3M', lbl: 'Total Budget' },
              { num: '4', lbl: 'Token Tiers' },
              { num: '36mo', lbl: 'Revenue Window' },
              { num: '100%', lbl: 'On-Chain Distribution' },
            ].map((s, i) => (
              <div key={i} className="flex items-center">
                <div className="text-center px-5 sm:px-10 py-3">
                  <div className="text-3xl sm:text-4xl font-extrabold" style={{ color: Y, letterSpacing: -1 }}>{s.num}</div>
                  <div className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: '#64748b' }}>{s.lbl}</div>
                </div>
                {i < 3 && <div className="w-px h-10 shrink-0" style={{ background: '#2a2a2a' }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* 01 EXECUTIVE SUMMARY */}
        <section className="pt-16 sm:pt-20">
          <SectionLabel num="01" title="Executive Summary" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-3" style={{ color: '#fff', letterSpacing: -0.5 }}>
            The First <span style={{ color: Y }}>Tokenized</span> AI Documentary
          </h2>
          <p className="text-sm sm:text-base leading-relaxed mb-8 max-w-2xl" style={{ color: '#a3a3a3' }}>
            This ownership brief outlines the complete tokenization structure for an unprecedented feature-length documentary exploring the rise of artificial intelligence — its creators, consequences, and the humans caught in its wake.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { color: Y, num: '$3M', lbl: 'Production Budget', desc: 'Fully tokenized — no traditional studio gatekeepers' },
              { color: '#84cc16', num: '40+', lbl: 'AI Experts Featured', desc: 'Researchers, ethicists, founders, and policymakers' },
              { color: '#f97316', num: '6', lbl: 'Revenue Streams', desc: 'Theatrical · Streaming · Licensing · NFT · Education · Merch' },
            ].map((c, i) => (
              <div key={i} className="rounded-xl p-6 text-center"
                style={{ background: '#141414', border: `1px solid #2a2a2a`, borderTop: `3px solid ${c.color}` }}>
                <div className="text-4xl font-extrabold mb-1" style={{ color: c.color, letterSpacing: -1 }}>{c.num}</div>
                <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: c.color }}>{c.lbl}</div>
                <div className="text-xs leading-relaxed" style={{ color: '#a3a3a3' }}>{c.desc}</div>
              </div>
            ))}
          </div>

          <Note type="yellow" icon="💡" title="Why Tokenize a Film?">
            Traditional film financing concentrates profit and creative control with studios. Tokenization democratizes this — allowing anyone from a $1,000 community backer to a $250,000 executive producer to hold a verifiable on-chain ownership stake, receive automatic revenue distributions, and vote on the film&apos;s future via transparent governance.
          </Note>
        </section>

        {/* 02 OWNERSHIP TIERS */}
        <section className="pt-16 sm:pt-20">
          <SectionLabel num="02" title="Ownership Tiers & Token Structure" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-3" style={{ color: '#fff', letterSpacing: -0.5 }}>
            Four <span style={{ color: Y }}>Token Tiers</span>
          </h2>
          <p className="text-sm sm:text-base leading-relaxed mb-8 max-w-2xl" style={{ color: '#a3a3a3' }}>
            Each tier carries distinct ownership rights, revenue entitlements, and governance weight. All tokens are ERC-1155 NFTs on Polygon.
          </p>

          <div className="flex flex-col gap-4 mb-8">
            {ownershipTiers.map((t) => (
              <div key={t.tier} className="rounded-xl p-5 sm:p-6"
                style={{ background: '#141414', border: `1px solid #2a2a2a`, borderLeft: `4px solid ${t.color}` }}>
                {/* top row: name + token badge + allocation */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-base sm:text-lg font-extrabold" style={{ color: '#fff' }}>{t.tier}</span>
                  <span className="text-xs font-extrabold px-3 py-1 rounded" style={{ background: t.color, color: '#000', letterSpacing: 1 }}>{t.token}</span>
                  <span className="ml-auto text-2xl sm:text-3xl font-extrabold" style={{ color: t.color }}>{t.allocation}</span>
                </div>
                {/* min invest */}
                <div className="mb-4">
                  <div className="text-xs uppercase tracking-wider mb-1" style={{ color: '#a3a3a3' }}>Min. Investment</div>
                  <div className="text-xl font-extrabold" style={{ color: t.color }}>{t.minInvest}</div>
                </div>
                {/* divider */}
                <div className="mb-4" style={{ borderTop: '1px solid #2a2a2a' }} />
                {/* rights */}
                <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#a3a3a3' }}>Rights Included</div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                  {t.rights.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed" style={{ color: '#d4d4d4' }}>
                      <span className="font-bold shrink-0 mt-0.5" style={{ color: t.color }}>→</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 03 TOKEN DISTRIBUTION & BUDGET */}
        <section className="pt-16 sm:pt-20">
          <SectionLabel num="03" title="Token Distribution & Budget Breakdown" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-3" style={{ color: '#fff', letterSpacing: -0.5 }}>
            How the <span style={{ color: Y }}>$3M</span> is Structured
          </h2>
          <p className="text-sm sm:text-base leading-relaxed mb-8 max-w-2xl" style={{ color: '#a3a3a3' }}>
            Total token supply: 10,000,000 tokens. Priced in USD at issuance, redeemable for governance and revenue participation rights.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {/* allocation */}
            <div className="rounded-xl p-6" style={{ background: '#141414', border: '1px solid #2a2a2a' }}>
              <h3 className="text-sm font-bold mb-5" style={{ color: '#fff' }}>Token Allocation</h3>
              <div className="flex flex-col gap-5">
                {tokenDistribution.map((t) => (
                  <div key={t.label}>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-semibold" style={{ color: '#d4d4d4' }}>{t.label}</span>
                      <span className="text-xs font-extrabold" style={{ color: t.color }}>{t.pct}%</span>
                    </div>
                    <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#262626' }}>
                      <div className="h-full rounded-full" style={{ width: `${t.pct}%`, background: t.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* budget */}
            <div className="rounded-xl p-6" style={{ background: '#141414', border: '1px solid #2a2a2a' }}>
              <h3 className="text-sm font-bold mb-5" style={{ color: '#fff' }}>Budget Breakdown</h3>
              <div className="flex flex-col gap-3">
                {budgetBreakdown.map((b) => (
                  <div key={b.category} className="pb-3" style={{ borderBottom: '1px solid #2a2a2a' }}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs flex-1 pr-3" style={{ color: '#d4d4d4' }}>{b.category}</span>
                      <span className="text-xs font-bold shrink-0" style={{ color: '#fff' }}>{b.amount}</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: '#262626' }}>
                      <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: 'linear-gradient(90deg, oklch(0.82 0.15 75), oklch(0.65 0.16 75))' }} />
                    </div>
                  </div>
                ))}
                <div className="flex justify-between pt-1">
                  <span className="text-sm font-extrabold" style={{ color: '#fff' }}>Total</span>
                  <span className="text-sm font-extrabold" style={{ color: Y }}>$3,000,000</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 04 REVENUE STREAMS */}
        <section className="pt-16 sm:pt-20">
          <SectionLabel num="04" title="Revenue Distribution Model" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-3" style={{ color: '#fff', letterSpacing: -0.5 }}>
            Six <span style={{ color: Y }}>Revenue Streams</span>
          </h2>
          <p className="text-sm sm:text-base leading-relaxed mb-8 max-w-2xl" style={{ color: '#a3a3a3' }}>
            All revenue flows through a smart contract that automatically splits and distributes earnings to token holders within 48 hours — no intermediaries, no delays.
          </p>

          <div className="rounded-xl p-5 sm:p-7 mb-7" style={{ background: '#141414', border: '1px solid #2a2a2a' }}>
            <div className="flex flex-col gap-4">
              {revenueStreams.map((r) => (
                <div key={r.stream} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="text-xs font-medium sm:w-56 shrink-0" style={{ color: '#d4d4d4' }}>{r.stream}</div>
                  <div className="flex-1 h-8 rounded-lg overflow-hidden" style={{ background: '#262626' }}>
                    <div className="h-full rounded-lg flex items-center pl-3" style={{ width: `${r.pct}%`, background: r.color }}>
                      <span className="text-xs font-extrabold text-black">{r.pct}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Note type="green" icon="💸" title="Automatic On-Chain Distribution">
            Revenue received by the production LLC is converted to USDC and transmitted to the distribution smart contract. Proportional splits execute within 48 hours — no manual processing, no banks. Token holders claim from any Ethereum-compatible wallet.
          </Note>
        </section>

        {/* 05 RIGHTS & IP */}
        <section className="pt-16 sm:pt-20">
          <SectionLabel num="05" title="Rights, IP & Governance Framework" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-3" style={{ color: '#fff', letterSpacing: -0.5 }}>
            Ownership <span style={{ color: Y }}>Rights</span> Explained
          </h2>
          <p className="text-sm sm:text-base leading-relaxed mb-8 max-w-2xl" style={{ color: '#a3a3a3' }}>
            Clear delineation of creative control, copyright, revenue participation, and governance power for every tier.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {rights.map((r) => (
              <div key={r.title} className="rounded-xl p-5 sm:p-6" style={{ background: '#141414', border: '1px solid #2a2a2a' }}>
                <div className="text-3xl mb-3">{r.icon}</div>
                <div className="text-sm font-bold mb-2" style={{ color: '#fff' }}>{r.title}</div>
                <div className="text-xs leading-relaxed" style={{ color: '#a3a3a3' }}>{r.desc}</div>
              </div>
            ))}
          </div>

          <Note type="yellow" icon="⚖️" title="Legal Structure">
            Tokens are issued by RampRate AI Films LLC under SEC Regulation D (Accredited Investors — EP &amp; AP tiers) and Regulation CF (Community tiers). Each token represents a revenue participation right — not equity. Legal opinion letters from Cooley LLP available upon request.
          </Note>
        </section>

        {/* 06 TIMELINE */}
        <section className="pt-16 sm:pt-20">
          <SectionLabel num="06" title="Production Timeline & Milestones" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-3" style={{ color: '#fff', letterSpacing: -0.5 }}>
            36-Month <span style={{ color: Y }}>Roadmap</span>
          </h2>
          <p className="text-sm sm:text-base leading-relaxed mb-8 max-w-2xl" style={{ color: '#a3a3a3' }}>
            From token sale through theatrical release to long-tail streaming revenue — five phases with token-holder checkpoints at every stage.
          </p>

          <div className="flex flex-col">
            {milestones.map((m, i) => (
              <div key={m.phase} className={`flex gap-4 sm:gap-6 ${i < milestones.length - 1 ? 'pb-8' : ''}`}>
                {/* dot + line */}
                <div className="flex flex-col items-center shrink-0" style={{ minWidth: 44 }}>
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0"
                    style={{
                      background: m.status === 'active' ? Y : '#1c1c1c',
                      color: m.status === 'active' ? '#000' : '#a3a3a3',
                      border: m.status === 'active' ? 'none' : '1px solid #2a2a2a',
                    }}>
                    {m.phase}
                  </div>
                  {i < milestones.length - 1 && (
                    <div className="flex-1 w-px mt-2" style={{ background: '#2a2a2a' }} />
                  )}
                </div>
                {/* content */}
                <div className="flex-1 pt-2.5">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-sm sm:text-base font-bold" style={{ color: '#fff' }}>{m.title}</span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                      style={{
                        background: m.status === 'active' ? 'oklch(0.82 0.15 75/0.15)' : '#1c1c1c',
                        color: m.status === 'active' ? Y : '#a3a3a3',
                        border: m.status === 'active' ? '1px solid oklch(0.82 0.15 75/0.30)' : '1px solid #2a2a2a',
                      }}>
                      {m.status === 'active' ? 'Active — Raising Now' : 'Upcoming'}
                    </span>
                    <span className="text-xs ml-auto" style={{ color: '#a3a3a3' }}>{m.duration}</span>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {m.tasks.map((task) => (
                      <li key={task} className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed" style={{ color: '#d4d4d4' }}>
                        <span className="font-bold shrink-0" style={{ color: Y }}>→</span>{task}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 07 WHY RAMPRATE */}
        <section className="pt-16 sm:pt-20">
          <SectionLabel num="07" title="Why RampRate" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-3" style={{ color: '#fff', letterSpacing: -0.5 }}>
            Track Record &amp; <span style={{ color: Y }}>Credibility</span>
          </h2>
          <p className="text-sm sm:text-base leading-relaxed mb-8 max-w-2xl" style={{ color: '#a3a3a3' }}>
            RampRate brings 20+ years of enterprise technology advisory and a proven track record in Web3, DAO governance, and decentralized finance.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              { num: '$10B+', lbl: 'Client IT spend advised', color: Y },
              { num: '€4M+', lbl: 'DAO grants facilitated (DevxDAO + XPRIZE)', color: '#84cc16' },
              { num: 'B Corp', lbl: 'Certified — highest transparency standards', color: '#f97316' },
              { num: '500+', lbl: 'Fortune 500 engagements completed', color: '#38bdf8' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl p-5 sm:p-6"
                style={{ background: '#141414', border: `1px solid #2a2a2a`, borderLeft: `4px solid ${s.color}` }}>
                <div className="text-2xl sm:text-3xl font-extrabold shrink-0" style={{ color: s.color }}>{s.num}</div>
                <div className="text-xs sm:text-sm font-medium" style={{ color: '#d4d4d4' }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden rounded-2xl px-6 py-14 sm:px-12 sm:py-16 text-center mt-16 sm:mt-20"
          style={{ background: 'linear-gradient(135deg,#111100 0%,#1a1400 100%)', border: '1px solid oklch(0.82 0.15 75/0.25)' }}>
          <div className="absolute rounded-full pointer-events-none"
            style={{ width: 480, height: 480, background: 'oklch(0.82 0.15 75/0.06)', top: -180, right: -120 }} />
          <div className="absolute rounded-full pointer-events-none"
            style={{ width: 280, height: 280, background: 'oklch(0.82 0.15 75/0.04)', bottom: -80, left: -40 }} />

          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: Y }}>
              Limited Allocation Available
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-4" style={{ color: '#fff' }}>
              Ready to Co-Own the Definitive<br />
              <span style={{ color: Y }}>AI Documentary?</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-10" style={{ color: '#a3a3a3' }}>
              Token allocations are limited. EP and AP NFTs are available to accredited investors only. Community tiers open to all.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/contact"
                className="inline-block px-8 py-4 rounded-xl font-extrabold text-sm text-black no-underline"
                style={{ background: Y }}>
                Request Investor Deck
              </a>
              <a href="/contact"
                className="inline-block px-8 py-4 rounded-xl font-semibold text-sm no-underline"
                style={{ border: '1px solid oklch(0.82 0.15 75/0.35)', color: YL }}>
                Schedule a Call
              </a>
            </div>
          </div>
        </section>

        {/* DISCLAIMER */}
        <div className="py-10 pb-24 text-center">
          <p className="text-xs leading-loose max-w-xl mx-auto" style={{ color: '#525252' }}>
            This document does not constitute an offer to sell or solicitation of an offer to buy securities. All investments carry risk. Tokens represent revenue participation rights only — not equity ownership. See full legal disclosures before investing. RampRate AI Films LLC · 2026
          </p>
        </div>

      </div>
    </div>
  )
}

/* ── root export ──────────────────────────────────────────── */
export default function AiDocGate() {
  const [unlocked, setUnlocked] = useState(false)
  return unlocked
    ? <AiDocContent />
    : <GateScreen onUnlock={() => setUnlocked(true)} />
}

/* ── shared atoms ─────────────────────────────────────────── */
function SectionLabel({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-xs font-extrabold px-3 py-1 rounded tracking-widest" style={{ background: Y, color: '#000' }}>{num}</span>
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: Y }}>{title}</span>
    </div>
  )
}

function Note({ type, icon, title, children }: { type: 'yellow' | 'green' | 'red'; icon: string; title: string; children: React.ReactNode }) {
  const map = {
    yellow: { bg: 'oklch(0.82 0.15 75/0.07)', border: Y,         tc: YL },
    green:  { bg: 'rgba(132,204,22,0.07)',      border: '#84cc16', tc: '#a3e635' },
    red:    { bg: 'rgba(239,68,68,0.07)',        border: '#ef4444', tc: '#f87171' },
  }
  const s = map[type]
  return (
    <div className="flex gap-4 items-start rounded-xl p-4 sm:p-5 mb-6"
      style={{ background: s.bg, borderLeft: `4px solid ${s.border}` }}>
      <span className="text-2xl shrink-0">{icon}</span>
      <div>
        <div className="text-sm font-bold mb-1" style={{ color: s.tc }}>{title}</div>
        <div className="text-xs sm:text-sm leading-relaxed" style={{ color: '#d4d4d4' }}>{children}</div>
      </div>
    </div>
  )
}
