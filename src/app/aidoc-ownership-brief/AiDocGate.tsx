'use client'

import { useState, useRef } from 'react'

/* ── THEME ── */
const Y  = 'oklch(0.82 0.15 75)'
const YL = 'oklch(0.92 0.10 75)'
const YD = 'oklch(0.65 0.16 75)'
const BG = '#0a0a0a'
const S1 = '#141414'
const S2 = '#1c1c1c'
const S3 = '#262626'
const BD = '#2a2a2a'
const TW = '#ffffff'
const TG = '#a3a3a3'
const TM = '#d4d4d4'

const ACCESS_CODE = 'Ap3'

/* ─────────────────────────────────────
   DATA
───────────────────────────────────── */
const ownershipTiers = [
  {
    tier: 'Executive Producer', token: 'EP-NFT', allocation: '30%', minInvest: '$250,000',
    rights: ['Full creative approval rights', 'Profit share from all revenue streams', 'Named credit — opening titles', 'Exclusive screening invites', 'Governance voting (2x weight)'],
    color: Y,
  },
  {
    tier: 'Associate Producer', token: 'AP-NFT', allocation: '25%', minInvest: '$100,000',
    rights: ['Advisory board seat', 'Profit share from streaming + theatrical', 'Named credit — main titles', 'Festival premiere access', 'Governance voting (1x weight)'],
    color: '#f97316',
  },
  {
    tier: 'Impact Investor', token: 'II-TOKEN', allocation: '25%', minInvest: '$25,000',
    rights: ['Streaming revenue share', 'Merchandise royalties', 'End-title credit', 'Digital screening access', 'Governance voting (0.5x weight)'],
    color: '#84cc16',
  },
  {
    tier: 'Community Backer', token: 'CB-TOKEN', allocation: '20%', minInvest: '$1,000',
    rights: ['Fractional streaming revenue', 'Digital download rights', 'Community credit roll', 'NFT collectible access', 'Governance voting (0.1x weight)'],
    color: '#38bdf8',
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
  { icon: '🔒', title: 'Lock-Up Period', desc: 'EP-NFT and AP-NFT tokens have a 12-month lock-up from issuance. II-TOKEN and CB-TOKEN are transferable on secondary markets after 6 months.' },
  { icon: '🌐', title: 'Secondary Market', desc: 'Tokens tradeable on approved NFT marketplaces post-lock-up. RampRate earns 2.5% secondary royalty; 1% flows back to the community pool.' },
]

/* ─────────────────────────────────────
   GATE SCREEN
───────────────────────────────────── */
function GateScreen({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function attempt() {
    if (code === ACCESS_CODE) {
      onUnlock()
    } else {
      setError(true)
      setShake(true)
      setCode('')
      setTimeout(() => setShake(false), 500)
      inputRef.current?.focus()
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#EAE7DF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{
        background: '#F5F2EC',
        borderRadius: 6,
        maxWidth: 448,
        width: '100%',
        margin: '0 24px',
        padding: '56px 48px 52px',
        borderTop: '4px solid #5B21B6',
        boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
        textAlign: 'center' as const,
        transform: shake ? 'translateX(-6px)' : 'translateX(0)',
        transition: 'transform 0.1s',
      }}>
        <div style={{
          fontSize: 10.5, fontWeight: 600, letterSpacing: 2.5,
          color: '#9CA3AF', textTransform: 'uppercase' as const, marginBottom: 22,
        }}>
          RESTRICTED ACCESS · THE AI DOC
        </div>
        <h1 style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 44, fontWeight: 700, color: '#18181B',
          marginBottom: 16, lineHeight: 1.1, letterSpacing: -0.5,
        }}>
          Ownership Brief
        </h1>
        <p style={{
          fontSize: 14, color: '#6B7280', lineHeight: 1.65,
          maxWidth: 300, margin: '0 auto 38px',
        }}>
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
          style={{
            width: '100%', padding: '16px 20px',
            background: '#E8E4DB',
            border: error ? '1.5px solid #EF4444' : '1.5px solid transparent',
            borderRadius: 4, fontSize: 13, color: '#374151',
            letterSpacing: 3, marginBottom: error ? 8 : 14,
            outline: 'none', fontFamily: "'Courier New', monospace",
            boxSizing: 'border-box' as const, textAlign: 'center' as const,
          }}
        />
        {error && (
          <p style={{ fontSize: 11, color: '#EF4444', marginBottom: 10, letterSpacing: 0.3 }}>
            Incorrect code. Please try again.
          </p>
        )}
        <button
          onClick={attempt}
          style={{
            width: '100%', padding: '16px',
            background: '#5B21B6', color: '#fff',
            border: 'none', borderRadius: 4,
            fontSize: 11.5, fontWeight: 700,
            letterSpacing: 3.5, textTransform: 'uppercase' as const,
            cursor: 'pointer', transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#4C1D95')}
          onMouseLeave={e => (e.currentTarget.style.background = '#5B21B6')}
        >
          ENTER
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────
   FULL CONTENT
───────────────────────────────────── */
function AiDocContent() {
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: TW, background: BG }}>

      {/* ── HERO ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 60%, #1a1200 100%)',
        padding: '110px 40px 90px',
        textAlign: 'center' as const,
        position: 'relative',
        overflow: 'hidden',
        borderBottom: `1px solid ${BD}`,
      }}>
        <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'oklch(0.82 0.15 75 / 0.07)', top: -300, right: -200, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'oklch(0.82 0.15 75 / 0.04)', bottom: -200, left: -100, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 820, margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: 'oklch(0.82 0.15 75 / 0.12)',
            border: `1px solid oklch(0.82 0.15 75 / 0.35)`,
            color: YL, padding: '6px 22px', borderRadius: 20,
            fontSize: 11, fontWeight: 700, letterSpacing: 2,
            textTransform: 'uppercase' as const, marginBottom: 32,
          }}>
            Confidential · Token Offering Document
          </div>
          <h1 style={{ fontSize: 56, fontWeight: 800, color: TW, lineHeight: 1.08, marginBottom: 20, letterSpacing: -1.5 }}>
            AI Doc Film<br /><span style={{ color: Y }}>Tokenization Proposal</span>
          </h1>
          <p style={{ fontSize: 19, color: TG, lineHeight: 1.75, marginBottom: 60, fontWeight: 300, maxWidth: 640, margin: '0 auto 60px' }}>
            Ownership Brief — A decentralized co-ownership model for the definitive documentary on artificial intelligence: rights, revenue, governance, and impact.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' as const }}>
            {[{ num: '$3M', lbl: 'Total Budget' }, { num: '4', lbl: 'Token Tiers' }, { num: '36mo', lbl: 'Revenue Window' }, { num: '100%', lbl: 'On-Chain Distribution' }].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' as const, padding: '0 44px' }}>
                  <div style={{ fontSize: 40, fontWeight: 800, color: Y, letterSpacing: -1 }}>{s.num}</div>
                  <div style={{ fontSize: 10, color: TG, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 1.5, marginTop: 4 }}>{s.lbl}</div>
                </div>
                {i < 3 && <div style={{ width: 1, height: 48, background: BD }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1020, margin: '0 auto', padding: '0 40px' }}>

        {/* ── 01 EXECUTIVE SUMMARY ── */}
        <section style={{ padding: '80px 0 0' }}>
          <SectionLabel num="01" title="Executive Summary" />
          <h2 style={ST}>The First <Acc>Tokenized</Acc> AI Documentary</h2>
          <p style={SD}>
            This ownership brief outlines the complete tokenization structure for an unprecedented feature-length documentary exploring the rise of artificial intelligence — its creators, consequences, and the humans caught in its wake.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 36 }}>
            {[
              { color: Y, num: '$3M', lbl: 'Production Budget', desc: 'Fully tokenized — no traditional studio gatekeepers' },
              { color: '#84cc16', num: '40+', lbl: 'AI Experts Featured', desc: 'Researchers, ethicists, founders, and policymakers' },
              { color: '#f97316', num: '6', lbl: 'Revenue Streams', desc: 'Theatrical · Streaming · Licensing · NFT · Education · Merch' },
            ].map((c, i) => (
              <div key={i} style={{ background: S1, border: `1px solid ${BD}`, borderTop: `3px solid ${c.color}`, borderRadius: 14, padding: '28px 24px', textAlign: 'center' as const }}>
                <div style={{ fontSize: 44, fontWeight: 800, color: c.color, marginBottom: 6, letterSpacing: -1 }}>{c.num}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: c.color, textTransform: 'uppercase' as const, letterSpacing: 1.2, marginBottom: 10 }}>{c.lbl}</div>
                <div style={{ fontSize: 11, color: TG, lineHeight: 1.6 }}>{c.desc}</div>
              </div>
            ))}
          </div>
          <Note type="yellow" icon="💡" title="Why Tokenize a Film?">
            Traditional film financing concentrates profit and creative control with studios. Tokenization democratizes this — allowing anyone from a $1,000 community backer to a $250,000 executive producer to hold a verifiable, on-chain ownership stake, receive automatic revenue distributions, and vote on the film&apos;s future via transparent governance.
          </Note>
        </section>

        {/* ── 02 OWNERSHIP TIERS ── */}
        <section style={{ padding: '72px 0 0' }}>
          <SectionLabel num="02" title="Ownership Tiers & Token Structure" />
          <h2 style={ST}>Four <Acc>Token Tiers</Acc></h2>
          <p style={SD}>Each tier carries distinct ownership rights, revenue entitlements, and governance weight. All tokens are ERC-1155 NFTs on Polygon.</p>

          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 18, marginBottom: 32 }}>
            {ownershipTiers.map((t) => (
              <div key={t.tier} style={{
                border: `1px solid ${BD}`, borderLeft: `4px solid ${t.color}`,
                borderRadius: 14, padding: '26px 30px', background: S1,
                display: 'grid', gridTemplateColumns: '210px 130px 1fr', gap: 0, alignItems: 'stretch',
              }}>
                {/* col 1 */}
                <div style={{ paddingRight: 28 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: TW, marginBottom: 6 }}>{t.tier}</div>
                  <div style={{ display: 'inline-block', background: t.color, color: '#000', padding: '3px 12px', borderRadius: 6, fontSize: 10, fontWeight: 800, letterSpacing: 1, marginBottom: 16 }}>{t.token}</div>
                  <div style={{ fontSize: 10, color: TG, marginBottom: 3, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Min. Investment</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: t.color }}>{t.minInvest}</div>
                </div>
                {/* col 2 */}
                <div style={{ textAlign: 'center' as const, borderLeft: `1px solid ${BD}`, borderRight: `1px solid ${BD}`, padding: '0 28px', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center' }}>
                  <div style={{ fontSize: 10, color: TG, marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Token Allocation</div>
                  <div style={{ fontSize: 44, fontWeight: 800, color: t.color, letterSpacing: -1 }}>{t.allocation}</div>
                  <div style={{ fontSize: 10, color: TG }}>of total supply</div>
                </div>
                {/* col 3 */}
                <div style={{ paddingLeft: 28 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: TG, marginBottom: 12, textTransform: 'uppercase' as const, letterSpacing: 1 }}>Rights Included</div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                    {t.rights.map((r) => (
                      <li key={r} style={{ fontSize: 11, color: TM, display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.5 }}>
                        <span style={{ color: t.color, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>→</span>{r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 03 TOKEN DISTRIBUTION & BUDGET ── */}
        <section style={{ padding: '72px 0 0' }}>
          <SectionLabel num="03" title="Token Distribution & Budget Breakdown" />
          <h2 style={ST}>How the <Acc>$3M</Acc> is Structured</h2>
          <p style={SD}>Total token supply: 10,000,000 tokens. Priced in USD at issuance, redeemable for governance and revenue participation rights.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
            <div style={{ background: S1, border: `1px solid ${BD}`, borderRadius: 14, padding: 28 }}>
              <h3 style={H3}>Token Allocation</h3>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 18, marginTop: 20 }}>
                {tokenDistribution.map((t) => (
                  <div key={t.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: TM }}>{t.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: t.color }}>{t.pct}%</span>
                    </div>
                    <div style={{ height: 10, background: S3, borderRadius: 5, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${t.pct}%`, background: t.color, borderRadius: 5 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: S1, border: `1px solid ${BD}`, borderRadius: 14, padding: 28 }}>
              <h3 style={H3}>Budget Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12, marginTop: 20 }}>
                {budgetBreakdown.map((b) => (
                  <div key={b.category} style={{ borderBottom: `1px solid ${BD}`, paddingBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 10, color: TM, flex: 1, paddingRight: 12 }}>{b.category}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: TW, whiteSpace: 'nowrap' as const }}>{b.amount}</span>
                    </div>
                    <div style={{ height: 4, background: S3, borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${b.pct}%`, background: `linear-gradient(90deg, oklch(0.82 0.15 75), oklch(0.65 0.16 75))`, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: TW }}>Total</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: Y }}>$3,000,000</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 04 REVENUE STREAMS ── */}
        <section style={{ padding: '72px 0 0' }}>
          <SectionLabel num="04" title="Revenue Distribution Model" />
          <h2 style={ST}>Six <Acc>Revenue Streams</Acc></h2>
          <p style={SD}>All revenue flows through a smart contract that automatically splits and distributes earnings to token holders within 48 hours — no intermediaries, no delays.</p>
          <div style={{ background: S1, border: `1px solid ${BD}`, borderRadius: 14, padding: '28px 32px', marginBottom: 28 }}>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 18 }}>
              {revenueStreams.map((r) => (
                <div key={r.stream} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ width: 240, fontSize: 11, color: TM, fontWeight: 500, flexShrink: 0 }}>{r.stream}</div>
                  <div style={{ flex: 1, height: 34, background: S3, borderRadius: 8, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${r.pct}%`, background: r.color, borderRadius: 8, display: 'flex', alignItems: 'center', paddingLeft: 14 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#000' }}>{r.pct}%</span>
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

        {/* ── 05 RIGHTS & IP ── */}
        <section style={{ padding: '72px 0 0' }}>
          <SectionLabel num="05" title="Rights, IP & Governance Framework" />
          <h2 style={ST}>Ownership <Acc>Rights</Acc> Explained</h2>
          <p style={SD}>Clear delineation of creative control, copyright, revenue participation, and governance power for every tier.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, marginBottom: 32 }}>
            {rights.map((r) => (
              <div key={r.title} style={{ border: `1px solid ${BD}`, borderRadius: 12, padding: '24px 22px', background: S1 }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{r.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: TW, marginBottom: 8 }}>{r.title}</div>
                <div style={{ fontSize: 11, color: TG, lineHeight: 1.65 }}>{r.desc}</div>
              </div>
            ))}
          </div>
          <Note type="yellow" icon="⚖️" title="Legal Structure">
            Tokens are issued by RampRate AI Films LLC under SEC Regulation D (Accredited Investors — EP &amp; AP tiers) and Regulation CF (Community tiers). Each token represents a revenue participation right — not equity. Legal opinion letters from Cooley LLP available upon request.
          </Note>
        </section>

        {/* ── 06 TIMELINE ── */}
        <section style={{ padding: '72px 0 0' }}>
          <SectionLabel num="06" title="Production Timeline & Milestones" />
          <h2 style={ST}>36-Month <Acc>Roadmap</Acc></h2>
          <p style={SD}>From token sale through theatrical release to long-tail streaming revenue — five phases with token-holder checkpoints at every stage.</p>
          <div style={{ display: 'flex', flexDirection: 'column' as const }}>
            {milestones.map((m, i) => (
              <div key={m.phase} style={{ display: 'flex', gap: 24, paddingBottom: i < milestones.length - 1 ? 32 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', minWidth: 52 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 14, fontWeight: 800, flexShrink: 0,
                    background: m.status === 'active' ? Y : S2,
                    color: m.status === 'active' ? '#000' : TG,
                    border: m.status === 'active' ? 'none' : `1px solid ${BD}`,
                  }}>
                    {m.phase}
                  </div>
                  {i < milestones.length - 1 && <div style={{ flex: 1, width: 1, background: BD, marginTop: 6 }} />}
                </div>
                <div style={{ flex: 1, paddingTop: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, flexWrap: 'wrap' as const }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: TW }}>{m.title}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '3px 10px', borderRadius: 10,
                      textTransform: 'uppercase' as const, letterSpacing: 0.5,
                      background: m.status === 'active' ? 'oklch(0.82 0.15 75 / 0.15)' : S2,
                      color: m.status === 'active' ? Y : TG,
                      border: m.status === 'active' ? `1px solid oklch(0.82 0.15 75 / 0.30)` : `1px solid ${BD}`,
                    }}>
                      {m.status === 'active' ? 'Active — Raising Now' : 'Upcoming'}
                    </span>
                    <span style={{ fontSize: 10, color: TG, marginLeft: 'auto' }}>{m.duration}</span>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column' as const, gap: 7 }}>
                    {m.tasks.map((task) => (
                      <li key={task} style={{ fontSize: 11, color: TM, display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.55 }}>
                        <span style={{ color: Y, fontWeight: 700, flexShrink: 0 }}>→</span>{task}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 07 WHY RAMPRATE ── */}
        <section style={{ padding: '72px 0 0' }}>
          <SectionLabel num="07" title="Why RampRate" />
          <h2 style={ST}>Track Record &amp; <Acc>Credibility</Acc></h2>
          <p style={SD}>RampRate brings 20+ years of enterprise technology advisory and a proven track record in Web3, DAO governance, and decentralized finance to this production.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 32 }}>
            {[
              { num: '$10B+', lbl: 'Client IT spend advised', color: Y },
              { num: '€4M+', lbl: 'DAO grants facilitated (DevxDAO + XPRIZE)', color: '#84cc16' },
              { num: 'B Corp', lbl: 'Certified — highest transparency standards', color: '#f97316' },
              { num: '500+', lbl: 'Fortune 500 engagements completed', color: '#38bdf8' },
            ].map((s, i) => (
              <div key={i} style={{ border: `1px solid ${BD}`, borderLeft: `4px solid ${s.color}`, borderRadius: 12, padding: '24px 26px', background: S1, display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: s.color, minWidth: 100, letterSpacing: -0.5 }}>{s.num}</div>
                <div style={{ fontSize: 12, color: TM, fontWeight: 500 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{
          background: 'linear-gradient(135deg, #111100 0%, #1a1400 100%)',
          border: `1px solid oklch(0.82 0.15 75 / 0.25)`,
          borderRadius: 20, padding: '64px 48px',
          textAlign: 'center' as const, margin: '72px 0 0',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'oklch(0.82 0.15 75 / 0.06)', top: -200, right: -150, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'oklch(0.82 0.15 75 / 0.04)', bottom: -100, left: -50, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: Y, textTransform: 'uppercase' as const, letterSpacing: 2, marginBottom: 20 }}>Limited Allocation Available</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: TW, marginBottom: 14, lineHeight: 1.2 }}>
              Ready to Co-Own the Definitive<br /><span style={{ color: Y }}>AI Documentary?</span>
            </div>
            <p style={{ fontSize: 15, color: TG, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
              Token allocations are limited. EP and AP NFTs are available to accredited investors only. Community tiers open to all.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' as const }}>
              <a href="/contact" style={{ display: 'inline-block', background: Y, color: '#000', padding: '15px 40px', borderRadius: 10, fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
                Request Investor Deck
              </a>
              <a href="/contact" style={{ display: 'inline-block', background: 'transparent', border: `1px solid oklch(0.82 0.15 75 / 0.35)`, color: YL, padding: '15px 40px', borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
                Schedule a Call
              </a>
            </div>
          </div>
        </section>

        {/* ── DISCLAIMER ── */}
        <div style={{ padding: '40px 0 120px', textAlign: 'center' as const }}>
          <p style={{ fontSize: 10, color: '#525252', lineHeight: 1.8, maxWidth: 640, margin: '0 auto' }}>
            This document does not constitute an offer to sell or solicitation of an offer to buy securities. All investments carry risk. Tokens represent revenue participation rights only — not equity ownership. See full legal disclosures before investing. RampRate AI Films LLC · 2026
          </p>
        </div>

      </div>
    </div>
  )
}

/* ─────────────────────────────────────
   ROOT EXPORT
───────────────────────────────────── */
export default function AiDocGate() {
  const [unlocked, setUnlocked] = useState(false)
  return unlocked
    ? <AiDocContent />
    : <GateScreen onUnlock={() => setUnlocked(true)} />
}

/* ─────────────────────────────────────
   SHARED UI ATOMS
───────────────────────────────────── */
function SectionLabel({ num, title }: { num: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
      <div style={{ background: Y, color: '#000', fontSize: 9, fontWeight: 800, padding: '4px 12px', borderRadius: 6, letterSpacing: 1 }}>{num}</div>
      <span style={{ fontSize: 11, fontWeight: 700, color: Y, textTransform: 'uppercase' as const, letterSpacing: 2 }}>{title}</span>
    </div>
  )
}

function Acc({ children }: { children: React.ReactNode }) {
  return <span style={{ color: Y }}>{children}</span>
}

const ST: React.CSSProperties = { fontSize: 34, fontWeight: 800, color: TW, lineHeight: 1.15, marginBottom: 14, letterSpacing: -0.5 }
const SD: React.CSSProperties = { fontSize: 14, color: TG, lineHeight: 1.75, marginBottom: 32, maxWidth: 680 }
const H3: React.CSSProperties = { fontSize: 14, fontWeight: 700, color: TW }

function Note({ type, icon, title, children }: { type: 'yellow' | 'green' | 'red'; icon: string; title: string; children: React.ReactNode }) {
  const map = {
    yellow: { bg: 'oklch(0.82 0.15 75 / 0.07)', border: Y, tc: YL },
    green:  { bg: 'rgba(132,204,22,0.07)', border: '#84cc16', tc: '#a3e635' },
    red:    { bg: 'rgba(239,68,68,0.07)', border: '#ef4444', tc: '#f87171' },
  }
  const s = map[type]
  return (
    <div style={{ background: s.bg, borderLeft: `4px solid ${s.border}`, borderRadius: 10, padding: '18px 22px', marginBottom: 24, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: s.tc, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 11, color: TM, lineHeight: 1.7 }}>{children}</div>
      </div>
    </div>
  )
}
