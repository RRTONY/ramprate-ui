'use client'

import { useState } from 'react'
import Link from 'next/link'

const circuitRoles = [
  { name: "Spark", sub: "Ideation", color: "oklch(0.7 0.18 30)" },
  { name: "Amplifier", sub: "Promotion", color: "oklch(0.82 0.15 75)" },
  { name: "Filter", sub: "Refinement", color: "oklch(0.6 0.2 180)" },
  { name: "Ground", sub: "Execution", color: "oklch(0.55 0.2 150)" },
  { name: "Conductor", sub: "Orchestration", color: "oklch(0.6 0.2 280)" },
]

const frictionPoints = [
  "Missing role on the team",
  "Wrong vertical market",
  "No execution after strategy",
  "Peripheral market > primary",
  "Broken handoffs between teams",
  "Stalled fundraise or BD pipeline",
]

const meWayOur = [
  {
    label: "ME", id: "find-me",
    title: "Find Your Me",
    color: "oklch(0.6 0.2 280)",
    points: ["What's your core frequency?", "What role do you play in the circuit?", "Are you the Spark running operations?", "Are you the Ground trying to ideate?", "Alignment starts with self-knowledge."],
  },
  {
    label: "WAY", id: "find-way",
    title: "Find Your Way",
    color: "oklch(0.82 0.15 75)",
    points: ["What's the right market? Right model?", "Stop chasing the big idea.", "Innovation management > big bets.", "Peripheral market may beat primary.", "The path reveals itself through data."],
  },
  {
    label: "OUR", id: "find-our",
    title: "Find Your Our",
    color: "oklch(0.55 0.2 160)",
    points: ["'Our' lives inside the word 'Your.'", "The team. The relationships. The circuit.", "Who's missing? Who's miscast?", "Who needs to be added?", "The imperfect team gets fixed here."],
  },
]

const steps = [
  { num: "01", label: "The Call" },
  { num: "02", label: "Flow Circuit" },
  { num: "03", label: "Build Team" },
  { num: "04", label: "10 Genie Wishes" },
  { num: "05", label: "Top 25 Targets" },
  { num: "06", label: "Sign & Execute" },
  { num: "07", label: "90-Day Proof" },
]

const summaryRows = [
  { label: "What You Bring", text: "The problem. The urgency. Your 10 genie wishes — everything you need besides capital." },
  { label: "What We Find", text: "Flow Circuit friction. Missing roles. Wrong market. Broken handoffs. The imperfect team. The real problem under the symptom." },
  { label: "What We Bring", text: "25 years of relationships. $24B in transaction intelligence. A vertical mastermind. The Top 25 target list. Innovation process — not big ideas." },
  { label: "Me → Way → Our", text: "Find your core frequency. Find the right path. Build the team around it. 'Our' lives inside 'Your.' Self-knowledge first." },
  { label: "The Economics", text: "$15K–$50K/month. Equity-forward. Mastermind at ~20%. Performance accountability. Clawbacks. Historical: 20X value." },
  { label: "The Guarantee", text: "90 days. Measurable results or you walk. No penalty. No lock-in. Never exercised in 25 years." },
]

export default function ProcessPage() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  void openAccordion
  void setOpenAccordion

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: 'var(--dark)' }}>
        <div className="glass-orb glass-orb-blue w-[400px] h-[400px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-amber w-[300px] h-[300px] bottom-0 -left-32" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" style={{ color: 'oklch(0.82 0.15 75)', fontFamily: 'var(--font-body)' }}>How We Work</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              From First Call to{' '}
              <span style={{ color: 'oklch(0.55 0.2 190)' }}>Closed Deals</span>{' '}
              in 90 Days.
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8" style={{ fontFamily: 'var(--font-body)' }}>
              First you find your Me. Then your Way. Then your Our. 25 years. 250+ enterprises. It&apos;s never not worked.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[{ value: "7", label: "Steps" }, { value: "90", label: "Days to proof" }, { value: "25", label: "Years refined" }].map((stat) => (
                <div key={stat.label} className="glass-card p-4">
                  <div className="text-2xl font-bold mb-1" style={{ color: 'oklch(0.82 0.15 75)', fontFamily: 'var(--font-display)' }}>{stat.value}</div>
                  <div className="text-xs text-white/50" style={{ fontFamily: 'var(--font-body)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="#find-me" className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-lg border-2 hover:bg-white/10 transition-all" style={{ borderColor: 'oklch(0.6 0.2 280)', background: 'oklch(0.6 0.2 280 / 0.1)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.6 0.2 280)" strokeWidth="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 10-16 0"/></svg>
                <span className="text-sm font-bold tracking-wider uppercase text-white" style={{ fontFamily: 'var(--font-body)' }}>
                  Find Your <span style={{ color: 'oklch(0.6 0.2 280)' }}>Me</span>
                </span>
              </a>
              <a href="#find-way" className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-lg border-2 hover:bg-white/10 transition-all" style={{ borderColor: 'oklch(0.82 0.15 75)', background: 'oklch(0.82 0.15 75 / 0.1)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.82 0.15 75)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                <span className="text-sm font-bold tracking-wider uppercase text-white" style={{ fontFamily: 'var(--font-body)' }}>
                  Find Your <span style={{ color: 'oklch(0.82 0.15 75)' }}>Way</span>
                </span>
              </a>
              <a href="#find-our" className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-lg border-2 hover:bg-white/10 transition-all" style={{ borderColor: 'oklch(0.55 0.2 160)', background: 'oklch(0.55 0.2 160 / 0.1)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.2 160)" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                <span className="text-sm font-bold tracking-wider uppercase text-white" style={{ fontFamily: 'var(--font-body)' }}>
                  Find Your <span style={{ color: 'oklch(0.55 0.2 160)' }}>Our</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Me / Way / Our */}
      <section id="me-way-our" className="relative section-dark py-20 sm:py-28 scroll-mt-20 overflow-hidden">
        <div className="glass-orb glass-orb-blue w-[350px] h-[350px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-amber w-[200px] h-[200px] bottom-20 -left-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4 block" style={{ fontFamily: 'var(--font-body)' }}>The Journey</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Before We Fix the Business,{' '}
              <span style={{ color: 'oklch(0.55 0.2 190)' }}>We Fix the Signal.</span>
            </h2>
            <p className="mt-5 text-base sm:text-lg text-white/50 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
              Sometimes you have to look inside yourself first.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {meWayOur.map((item) => (
              <div key={item.label} id={item.id} className="glass-card p-7 relative overflow-hidden scroll-mt-24">
                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: item.color }} />
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-4xl font-bold" style={{ color: item.color, fontFamily: 'var(--font-display)' }}>{item.label}</h3>
                </div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5" style={{ fontFamily: 'var(--font-body)' }}>{item.title}</h4>
                <ul className="space-y-3">
                  {item.points.map((p, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-white/60" style={{ fontFamily: 'var(--font-body)' }}>
                      <span className="text-white/20 mt-0.5">—</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 p-5 rounded-lg border-l-4" style={{ borderColor: 'oklch(0.82 0.15 75)', background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-sm sm:text-base text-white/70 italic" style={{ fontFamily: 'var(--font-body)' }}>
              Our role: find the friction, connect the dots, fix the team, build the process. Not the big idea — the right idea.
            </p>
          </div>
          <p className="mt-6 text-center text-xs text-white/30 tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>
            ME → WAY → OUR &nbsp;|&nbsp; The word YOUR contains OUR.
          </p>
        </div>
      </section>

      {/* Phase 1 — Diagnose */}
      <section id="flow-circuit" className="relative section-warm py-20 sm:py-28 scroll-mt-20 overflow-hidden">
        <div className="glass-orb glass-orb-rust w-[300px] h-[300px] -bottom-32 -right-32" />
        <div className="glass-orb glass-orb-amber w-[180px] h-[180px] top-10 -left-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-14">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)' }}>Phase 1 — Diagnose</span>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Find the real problem —{' '}
              <span style={{ color: 'oklch(0.55 0.15 30)' }}>not the symptom.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card-warm p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'oklch(0.55 0.2 190 / 0.1)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.2 190)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 6.68a2 2 0 012-2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.91 11.5a16 16 0 006.29 6.29l1.14-1.14a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                </div>
                <div>
                  <span className="text-xs font-bold tracking-wider" style={{ color: 'oklch(0.55 0.2 190)', fontFamily: 'var(--font-mono)' }}>01</span>
                  <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>The Call</h3>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'oklch(0.35 0.02 50)', fontFamily: 'var(--font-body)' }}>
                You tell us what&apos;s broken. We listen. We diagnose in 48 hours.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)' }}>
                Could be a missing role. A wrong market. A broken handoff. A stalled fundraise. Whatever the problem, there&apos;s always a solution.
              </p>
            </div>
            <div className="glass-card-warm p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'oklch(0.82 0.15 75 / 0.1)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.82 0.15 75)" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                </div>
                <div>
                  <span className="text-xs font-bold tracking-wider" style={{ color: 'oklch(0.82 0.15 75)', fontFamily: 'var(--font-mono)' }}>02</span>
                  <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>Flow Circuit Assessment</h3>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'oklch(0.35 0.02 50)', fontFamily: 'var(--font-body)' }}>
                Map your team&apos;s invisible architecture. Who&apos;s the Spark? Amplifier? Filter? Ground?
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)' }}>
                Identify where energy is blocked. Calculate friction cost. See the team you have vs. the team you need.
              </p>
            </div>
          </div>
          <div className="mt-10">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-5" style={{ color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)' }}>The Circuit Roles</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {circuitRoles.map((role) => (
                <div key={role.name} className="rounded-lg p-4 text-center" style={{ backgroundColor: `color-mix(in oklch, ${role.color} 12%, oklch(0.97 0.01 80))` }}>
                  <div className="text-sm font-bold" style={{ color: role.color, fontFamily: 'var(--font-display)' }}>{role.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)' }}>{role.sub}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)' }}>Common Friction Points We Find</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {frictionPoints.map((fp) => (
                <div key={fp} className="flex items-center gap-2.5 text-sm" style={{ color: 'oklch(0.35 0.02 50)', fontFamily: 'var(--font-body)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" className="shrink-0"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span>{fp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Phase 2 — Activate */}
      <section className="relative section-dark py-20 sm:py-28 overflow-hidden">
        <div className="glass-orb glass-orb-blue w-[280px] h-[280px] top-10 -right-32" />
        <div className="glass-orb glass-orb-rust w-[200px] h-[200px] -bottom-20 left-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-14">
            <span className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4 block" style={{ fontFamily: 'var(--font-body)' }}>Phase 2 — Activate</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Build the team. Name the wishes.{' '}
              <span style={{ color: 'oklch(0.55 0.2 190)' }}>Set the targets.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: "03", title: "Assemble the Team", p1: "One vertical-specific mastermind contracted at ~20% of our fee. Principals + specialist.", p2: "If the Flow Circuit found a missing role, we fill it. Missing Spark? We bring one. No Ground? We fix it." },
              { num: "04", title: "10 Genie Wishes", p1: "What do you need besides money? Every company needs capital — that's not the answer. The answer is making you attractive TO capital.", p2: "We ask for everything. Then we build the hit list." },
              { num: "05", title: "Top 25 Targets", p1: "We identify the 25 highest-probability BD targets from our network. Bull's-eye introductions only. No spray and pray.", p2: "25 years of trust opens doors that cold outreach never will." },
            ].map((item) => (
              <div key={item.num} className="glass-card p-7">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-bold tracking-wider" style={{ color: 'oklch(0.55 0.2 190)', fontFamily: 'var(--font-mono)' }}>{item.num}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>{item.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed mb-4" style={{ fontFamily: 'var(--font-body)' }}>{item.p1}</p>
                <p className="text-sm text-white/50 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>{item.p2}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phase 3 — Execute */}
      <section className="relative section-warm py-20 sm:py-28 overflow-hidden">
        <div className="glass-orb glass-orb-amber w-[300px] h-[300px] -top-32 -left-32" />
        <div className="glass-orb glass-orb-rust w-[180px] h-[180px] bottom-20 right-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-14">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)' }}>Phase 3 — Execute & Deliver</span>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Process over inspiration.{' '}
              <span style={{ color: 'oklch(0.55 0.15 30)' }}>Execution over strategy.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card-warm p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'oklch(0.55 0.2 190 / 0.1)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.2 190)" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                </div>
                <div>
                  <span className="text-xs font-bold tracking-wider" style={{ color: 'oklch(0.55 0.2 190)', fontFamily: 'var(--font-mono)' }}>06</span>
                  <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>Sign & Execute</h3>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'oklch(0.35 0.02 50)', fontFamily: 'var(--font-body)' }}>
                We go live. Introductions. Negotiations. Deals closed. Principals on every call. Weekly progress reports.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)' }}>
                Innovation management — not big bets. We test, iterate, close. Process over inspiration. Execution over strategy.
              </p>
            </div>
            <div className="glass-card-warm p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'oklch(0.55 0.2 160 / 0.1)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.2 160)" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/></svg>
                </div>
                <div>
                  <span className="text-xs font-bold tracking-wider" style={{ color: 'oklch(0.55 0.2 160)', fontFamily: 'var(--font-mono)' }}>07</span>
                  <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>90-Day Checkpoint</h3>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'oklch(0.35 0.02 50)', fontFamily: 'var(--font-body)' }}>
                If we haven&apos;t delivered measurable results in 90 days, you can walk. No penalty. No hard feelings. No lock-in.
              </p>
              <p className="text-sm leading-relaxed font-medium" style={{ color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)' }}>
                In 25 years, no one has ever exercised this option.
              </p>
            </div>
          </div>
          <div className="mt-10 flex items-center gap-4 p-5 rounded-xl border" style={{ background: 'oklch(0.82 0.15 75 / 0.1)', borderColor: 'oklch(0.82 0.15 75 / 0.2)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="oklch(0.82 0.15 75)" strokeWidth="2" className="shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <p className="text-sm sm:text-base font-semibold" style={{ color: 'oklch(0.25 0.03 50)', fontFamily: 'var(--font-body)' }}>
              <span className="uppercase tracking-wider text-xs mr-2" style={{ color: 'oklch(0.82 0.15 75)', fontFamily: 'var(--font-mono)' }}>The Guarantee:</span>
              90 days. If we don&apos;t deliver, you walk. It&apos;s never happened in 25 years.
            </p>
          </div>
          <div className="mt-6">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)' }}>The Economics</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ color: 'oklch(0.35 0.02 50)', fontFamily: 'var(--font-body)' }}>
              <span>$15K–$50K/month</span>
              <span style={{ color: 'oklch(0.7 0.02 50)' }}>·</span>
              <span>Equity-forward available</span>
              <span style={{ color: 'oklch(0.7 0.02 50)' }}>·</span>
              <span>Vertical mastermind ~20% of fee</span>
              <span style={{ color: 'oklch(0.7 0.02 50)' }}>·</span>
              <span>Clawbacks</span>
              <span style={{ color: 'oklch(0.7 0.02 50)' }}>·</span>
              <span>Historical: 20X multiplier</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Complete Map */}
      <section className="relative section-dark py-20 sm:py-28 overflow-hidden">
        <div className="glass-orb glass-orb-amber w-[350px] h-[350px] -bottom-40 -right-40" />
        <div className="glass-orb glass-orb-blue w-[200px] h-[200px] top-20 -left-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>The Complete Map</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-1 mb-14">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'oklch(0.55 0.2 190)', fontFamily: 'var(--font-mono)' }}>
                    {step.num}
                  </div>
                  <span className="mt-2 text-[10px] sm:text-xs text-white/50 text-center uppercase tracking-wider max-w-[80px]" style={{ fontFamily: 'var(--font-body)' }}>{step.label}</span>
                </div>
                {i < steps.length - 1 && <div className="hidden sm:block w-8 md:w-12 h-px mt-[-16px]" style={{ background: 'oklch(0.55 0.2 190 / 0.4)' }} />}
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {summaryRows.map((row) => (
              <div key={row.label} className="glass-card flex flex-col sm:flex-row gap-4 sm:gap-8 p-5">
                <div className="sm:w-44 shrink-0">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'oklch(0.55 0.2 190)', fontFamily: 'var(--font-body)' }}>{row.label}</span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>{row.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, oklch(0.45 0.22 260), oklch(0.35 0.18 280))' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Tell Us What&apos;s Broken.
          </h2>
          <p className="mt-6 text-base sm:text-lg text-white/70 max-w-xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
            Principal responds within 24 hours. No associates. No filters. No intake maze.
          </p>
          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm sm:text-base font-semibold bg-white hover:bg-white/90 transition-all shadow-lg"
              style={{ color: 'oklch(0.25 0.15 260)', fontFamily: 'var(--font-body)' }}
            >
              Tell Us What&apos;s Broken
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
