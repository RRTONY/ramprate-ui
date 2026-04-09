'use client'

import Link from 'next/link'
import {useState} from 'react'
const pressingQuestions = [
  {
    num: '01',
    question: 'Am I overpaying for GPU compute — or just paying for hype?',
    context:
      'AI cluster pricing is a black box. Spot vs. reserved vs. committed — every provider structures it differently. Without benchmark data, you\'re negotiating blind.',
  },
  {
    num: '02',
    question: 'Build, colo, or lease? What\'s the real math on my next data center?',
    context:
      'The build-vs-buy calculus has shifted. Power costs, land, permitting, and construction timelines have all changed. The right answer depends on your 5-year workload trajectory.',
  },
  {
    num: '03',
    question: 'Are my SLAs actually protecting me — or just protecting the vendor?',
    context:
      'Most enterprise SLAs are written by the provider\'s legal team. Credit structures, force majeure clauses, and uptime definitions are designed to minimize their exposure, not maximize yours.',
  },
  {
    num: '04',
    question: 'How do I evaluate edge locations without visiting 40 sites?',
    context:
      'Edge is about latency, not logos. The right site depends on your user geography, interconnection needs, and local power economics — not the provider\'s marketing deck.',
  },
  {
    num: '05',
    question: 'Is my MSA locking me into terms I\'ll regret in 18 months?',
    context:
      'Master Service Agreements are where the real leverage lives. Auto-renewal traps, price escalation clauses, and exit penalties can cost millions if you don\'t catch them upfront.',
  },
  {
    num: '06',
    question: 'What should I actually be paying per kW in this market?',
    context:
      'Power pricing varies 3–5× across metros. Knowing the real rate — not the rack rate — requires transaction data from deals closed this quarter, not last year\'s analyst report.',
  },
  {
    num: '07',
    question: 'How do I consolidate 12 vendor relationships without breaking production?',
    context:
      'Vendor sprawl is the silent budget killer. Consolidation saves 20–35%, but the migration risk is real. You need a sequenced plan, not a spreadsheet.',
  },
  {
    num: '08',
    question: 'Can I renegotiate mid-contract — or am I stuck until renewal?',
    context:
      'You\'re almost never stuck. Mid-contract renegotiation is an art — and providers will move if you know where their margin lives. Most enterprises leave this money on the table.',
  },
  {
    num: '09',
    question: 'What\'s the real cost of AI infrastructure beyond the GPU?',
    context:
      'Networking, cooling, power delivery, storage, and interconnection can double the sticker price. The total cost of ownership for AI workloads is fundamentally different from traditional compute.',
  },
  {
    num: '10',
    question: 'Who else just closed this exact deal — and what did they learn?',
    context:
      'The most valuable intelligence isn\'t in a database. It\'s in the head of the CTO who signed the same contract 60 days ago. We connect you with them.',
  },
]

const capabilities = [
  {
    title: 'Deal Structure Grading',
    desc: 'We grade every deal structure — colo, cloud, managed, hybrid, edge — against 315 variables. Pricing, terms, SLAs, exit clauses, escalation triggers. You see exactly where you have leverage and where you\'re exposed.',
    tag: 'Every deal. Every structure. Graded.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l3 3H9l3-3z"/><path d="M3 9l3-3h12l3 3"/><path d="M3 9h18v3H3z"/><path d="M3 12v9h18v-9"/></svg>
    ),
  },
  {
    title: 'Benchmark Pricing Intelligence',
    desc: 'The SPY Index holds 24 years of transaction data — 150K+ quotes across 350+ vendors in 80 countries. We don\'t estimate. We show you what the last 50 buyers actually paid for the same configuration in the same metro.',
    tag: '150K+ quotes · 350+ vendors · 80 countries',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
    ),
  },
  {
    title: 'SLA & MSA Auditing',
    desc: 'We tear apart your SLAs and MSAs clause by clause. Uptime definitions, credit structures, force majeure, auto-renewal traps, price escalation — we find the landmines before they detonate.',
    tag: 'Clause-by-clause. No surprises.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/><line x1="9" y1="11" x2="11" y2="11"/></svg>
    ),
  },
  {
    title: 'Data Center Location Intelligence',
    desc: 'Find and evaluate data centers globally — edge, core, AI-ready. We map power costs, latency profiles, interconnection density, permitting timelines, and sustainability metrics across 300+ metros.',
    tag: '300 metros · 50+ countries · Real-time',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
    ),
  },
  {
    title: 'Growth Strategy & Roadmapping',
    desc: 'Where should your infrastructure be in 3 years? We build technology roadmaps that account for AI workload growth, edge expansion, cloud repatriation, and sustainability mandates — so you\'re never locked in.',
    tag: 'Architecture that scales with you',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
    ),
  },
  {
    title: 'AI Infrastructure Advisory',
    desc: 'GPU clusters, liquid cooling, high-density power, AI networking — this market moves weekly. We track every provider, every configuration, every pricing model so you don\'t have to.',
    tag: 'The AI infrastructure market. Decoded.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 010 2h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1H2a1 1 0 010-2h1a7 7 0 017-7h1V5.73A2 2 0 0110 4a2 2 0 012-2z"/></svg>
    ),
  },
]

const spyPillars = [
  {title: 'Historical Transaction Data', desc: '24 years of actual deal data across every major IT service category.'},
  {title: 'Analyst Research', desc: 'Integrated intelligence from Gartner, IDC, Telegeography, 451 Research.'},
  {title: 'Supplier Capabilities', desc: '1,000+ pre-loaded vendors with detailed capability profiles.'},
  {title: 'Customer Experience', desc: 'Ongoing interviews with enterprise buyers for real-world performance data.'},
  {title: 'Cultural Compatibility', desc: 'CSR alignment, energy efficiency matching, and values-based vendor scoring.'},
]

const testimonials = [
  {quote: 'RampRate was a risk-free proposition money-wise. If they didn\'t save or create us at least twice their initial fee we\'d get a full refund. They hit 27% savings and the relationships are stronger than ever.', name: 'Paul Santana', title: 'Manager of Data Center Operations', company: 'eBay'},
  {quote: 'We can count on RampRate to be precise, timely and create millions in value. They are no-nonsense data driven and responsive to a T.', name: 'Dean Nelson', title: 'VP Global Foundation Services', company: 'eBay'},
  {quote: 'For over 16 years, RampRate helped my companies understand the differences between suppliers. They saved us millions, created agility and new budget out of thin air with each engagement.', name: 'Phil Wiser', title: 'EVP & CTO', company: 'ViacomCBS'},
  {quote: 'RampRate simply got us better pricing and better SLA protections than we got for ourselves!', name: 'Ryan Hughes', title: 'Network Operations', company: 'National Hockey League'},
  {quote: 'They brought in two other providers, had all providers re-quote, and lowered overall prices between 17-36%. They helped us achieve breakthrough innovative best-of-breed SLA coverage.', name: 'Charles Butler', title: 'Director of Network Operations', company: 'AOL'},
  {quote: 'Since engaging them they have helped me significantly reduce my cost structure through several major outsourcing deals worth deep 8 figures. They made me look like a hero to my executive management.', name: 'Peter Borner', title: 'Former Head of IT', company: 'Sony Music'},
]

const services = [
  {label: 'Data Center & Colo', desc: 'Site selection, procurement, benchmarking across 80+ countries'},
  {label: 'AI & GPU Compute', desc: 'Cluster pricing, reserved vs. spot, liquid cooling, high-density power'},
  {label: 'Cloud & Hybrid', desc: 'AWS/Azure/GCP optimization, repatriation analysis, hybrid architecture'},
  {label: 'Edge Infrastructure', desc: 'Edge location intelligence, latency mapping, micro-DC procurement'},
  {label: 'CDN & Content Delivery', desc: 'Multi-CDN architecture, published market research, pricing intelligence'},
  {label: 'Telecom & Connectivity', desc: 'Billing audits, carrier negotiations, Master Contractor model'},
  {label: 'Managed Services', desc: 'Cloud utility pricing, SLA benchmarking, outsource decisions'},
  {label: 'IT Strategy & Planning', desc: '5-year roadmaps, cloud vs. colo evaluation, technology planning'},
]

export default function SourcingPage() {
  const [expandedQ, setExpandedQ] = useState<string | null>(null)

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section
        className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden"
        style={{background: 'linear-gradient(135deg, oklch(0.12 0.01 250) 0%, oklch(0.16 0.02 260) 50%, oklch(0.12 0.01 250) 100%)'}}
      >
        {/* Glass orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none" style={{background: 'oklch(0.55 0.22 260)', filter: 'blur(80px)'}} />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-15 pointer-events-none" style={{background: 'oklch(0.82 0.15 75)', filter: 'blur(80px)'}} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-4">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-[0.2em]"
              style={{border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)'}}
            >
              RampRate — Transaction Architects
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white max-w-4xl"
            style={{fontFamily: 'var(--font-display)'}}
          >
            AI Studies the Process.{' '}
            <span style={{color: 'oklch(0.82 0.15 75)'}}>We Get the Deal Done.</span>
          </h1>

          <p
            className="mt-6 text-base sm:text-lg leading-relaxed max-w-2xl"
            style={{color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)'}}
          >
            Edge, compute, and AI data center intelligence — powered by 24 years of transaction data and validated by people who closed the same deal in the last 90 days. Find the leverage. Get the deal you deserve.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
            {[
              {value: '$24B+', label: 'Decisions Brokered'},
              {value: '23.8%', label: 'Avg Savings'},
              {value: '90', label: 'Day Validation Window'},
              {value: '300%+', label: 'ROI Guarantee'},
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl sm:text-3xl font-bold" style={{color: 'oklch(0.82 0.15 75)', fontFamily: 'var(--font-mono)'}}>{s.value}</div>
                <div className="mt-1 text-[10px] uppercase tracking-wider" style={{color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)'}}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold transition-all hover:opacity-90"
              style={{background: 'oklch(0.82 0.15 75)', color: 'oklch(0.15 0.02 75)', fontFamily: 'var(--font-body)'}}
            >
              Get a Free Audit
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <a
              href="#questions"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold transition-all border"
              style={{borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)'}}
            >
              See the 10 Questions
            </a>
          </div>
        </div>
      </section>

      {/* ═══ 10 PRESSING QUESTIONS ═══ */}
      <section id="questions" className="relative section-dark overflow-hidden py-20 sm:py-28">
        <div className="absolute -top-40 -right-40 w-[350px] h-[350px] rounded-full opacity-20 pointer-events-none" style={{background: 'oklch(0.55 0.22 260)', filter: 'blur(80px)'}} />
        <div className="absolute bottom-20 -left-20 w-[200px] h-[200px] rounded-full opacity-15 pointer-events-none" style={{background: 'oklch(0.82 0.15 75)', filter: 'blur(80px)'}} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-14">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{color: 'oklch(0.82 0.15 75)', fontFamily: 'var(--font-body)'}}>
              The Questions That Keep CTOs Up at Night
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight" style={{fontFamily: 'var(--font-display)'}}>
              10 Questions Every Organization{' '}
              <span style={{color: 'oklch(0.82 0.15 75)'}}>Is Asking Right Now</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed max-w-3xl" style={{color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)'}}>
              These aren&apos;t hypothetical. They&apos;re the questions we hear every week from Fortune 500 CTOs, infrastructure VPs, and procurement leads. Each one is validated by people who&apos;ve gone through that exact transaction in the last 90 days.
            </p>
          </div>

          <div className="grid gap-3">
            {pressingQuestions.map((q) => (
              <button
                key={q.num}
                onClick={() => setExpandedQ(expandedQ === q.num ? null : q.num)}
                className="w-full text-left rounded-xl border transition-all duration-300"
                style={{
                  background: expandedQ === q.num ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                  borderColor: expandedQ === q.num ? 'rgba(211,171,76,0.3)' : 'rgba(255,255,255,0.08)',
                }}
              >
                <div className="flex items-start gap-4 p-5 sm:p-6">
                  <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{background: 'rgba(211,171,76,0.1)'}}>
                    <span className="text-sm font-bold" style={{color: 'oklch(0.82 0.15 75)', fontFamily: 'var(--font-mono)'}}>{q.num}</span>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h3 className="text-base sm:text-lg font-bold text-white" style={{fontFamily: 'var(--font-display)'}}>
                      {q.question}
                    </h3>
                    {expandedQ === q.num && (
                      <p className="mt-3 text-sm leading-relaxed max-w-3xl" style={{color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)'}}>
                        {q.context}
                      </p>
                    )}
                  </div>
                  <div
                    className="shrink-0 w-8 h-8 sm:w-6 sm:h-6 rounded-full border border-white/20 flex items-center justify-center transition-transform duration-300"
                    style={{transform: expandedQ === q.num ? 'rotate(45deg)' : 'none'}}
                  >
                    <span className="text-white/40 text-sm leading-none">+</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-10 p-6 rounded-xl border" style={{background: 'rgba(211,171,76,0.08)', borderColor: 'rgba(211,171,76,0.2)'}}>
            <div className="flex items-start gap-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.82 0.15 75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              <div>
                <p className="text-sm leading-relaxed" style={{color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)'}}>
                  <strong className="text-white">Recognize your question?</strong> Every answer we give is backed by someone who closed that exact deal in the last 90 days. Not a model. Not a forecast. A person who sat across the table and signed.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 mt-3 text-sm font-semibold hover:underline"
                  style={{color: 'oklch(0.82 0.15 75)', fontFamily: 'var(--font-body)'}}
                >
                  Talk to a Transaction Architect
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="relative section-warm overflow-hidden py-20 sm:py-28">
        <div className="absolute -bottom-32 -right-32 w-[300px] h-[300px] rounded-full opacity-20 pointer-events-none" style={{background: 'oklch(0.55 0.15 30)', filter: 'blur(80px)'}} />
        <div className="absolute top-10 -left-20 w-[180px] h-[180px] rounded-full opacity-15 pointer-events-none" style={{background: 'oklch(0.82 0.15 75)', filter: 'blur(80px)'}} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}>
              How It Works
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight" style={{fontFamily: 'var(--font-display)'}}>
              Machines Do the Homework.{' '}
              <span style={{color: 'oklch(0.55 0.15 30)'}}>Humans Close the Deal.</span>
            </h2>
            <p className="mt-4 text-base max-w-2xl mx-auto leading-relaxed" style={{color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)'}}>
              AI is brilliant at pattern recognition, benchmarking, and anomaly detection. But deals are closed by people who understand leverage, relationships, and timing. We bring both.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {step: '01', title: 'AI Studies the Process', desc: 'Our intelligence engine analyzes your current contracts, benchmarks them against live market data, and identifies every gap, overpayment, and missed clause. The machine does the homework.'},
              {step: '02', title: 'Humans Validate the Strategy', desc: 'We connect you with enterprise buyers who closed the same deal in the last 90 days. Real people. Real outcomes. No theoretical frameworks — just battle-tested intelligence.'},
              {step: '03', title: 'Transaction Architects Close the Deal', desc: 'Our team finds the leverage, structures the negotiation, and gets you the deal you deserve. We\'ve brokered $24B+ in IT decisions. We know where every provider\'s margin lives.'},
            ].map((step, i) => (
              <div key={step.step} className="relative">
                <div className="bg-white rounded-xl p-8 border border-black/5 h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-3xl font-bold" style={{color: 'oklch(0.55 0.15 30)', opacity: 0.2, fontFamily: 'var(--font-mono)'}}>{step.step}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{fontFamily: 'var(--font-display)'}}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)'}}>{step.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 z-10 items-center justify-center w-8 text-center" style={{color: 'oklch(0.55 0.15 30)', opacity: 0.3}}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRODUCT CAPABILITIES ═══ */}
      <section className="relative section-light overflow-hidden py-20 sm:py-28">
        <div className="absolute -bottom-32 -left-32 w-[280px] h-[280px] rounded-full opacity-15 pointer-events-none" style={{background: 'oklch(0.82 0.15 75)', filter: 'blur(80px)'}} />
        <div className="absolute top-20 -right-20 w-[160px] h-[160px] rounded-full opacity-15 pointer-events-none" style={{background: 'oklch(0.55 0.15 30)', filter: 'blur(80px)'}} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-14">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}>
              What We Do
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight" style={{fontFamily: 'var(--font-display)'}}>
              Transaction Architecture for{' '}
              <span style={{color: 'oklch(0.55 0.15 30)'}}>Every Deal Type</span>
            </h2>
            <p className="mt-4 text-base max-w-3xl leading-relaxed" style={{color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)'}}>
              We grade, benchmark, audit, locate, and strategize across every kind of infrastructure deal — from a single edge cabinet to a 100MW AI campus.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap) => (
              <div
                key={cap.title}
                className="bg-white rounded-xl p-7 border border-black/5 hover:shadow-lg transition-all duration-300 group"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-5 transition-colors"
                  style={{background: 'rgba(100,60,30,0.08)', color: 'oklch(0.55 0.15 30)'}}
                >
                  {cap.icon}
                </div>
                <h3 className="text-lg font-bold mb-3" style={{fontFamily: 'var(--font-display)'}}>{cap.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)'}}>{cap.desc}</p>
                <div
                  className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{background: 'rgba(100,60,30,0.08)', color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-mono)'}}
                >
                  {cap.tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SPY INDEX ═══ */}
      <section className="relative section-dark overflow-hidden py-20 sm:py-28">
        <div className="absolute -top-40 -right-40 w-[350px] h-[350px] rounded-full opacity-20 pointer-events-none" style={{background: 'oklch(0.55 0.22 260)', filter: 'blur(80px)'}} />
        <div className="absolute bottom-20 -left-20 w-[200px] h-[200px] rounded-full opacity-15 pointer-events-none" style={{background: 'oklch(0.82 0.15 75)', filter: 'blur(80px)'}} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{color: 'oklch(0.82 0.15 75)', fontFamily: 'var(--font-body)'}}>
                The Intelligence Engine
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-white leading-tight" style={{fontFamily: 'var(--font-display)'}}>
                The SPY Index
              </h2>
              <p className="mt-4 text-base leading-relaxed" style={{color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)'}}>
                The first platform for IT sourcing decisions and planning. 24 years of proprietary transaction data. Forecasts within 5–10% of final outcome. 99%+ of our deals make it to contract.
              </p>
              <p className="mt-4 text-base leading-relaxed" style={{color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)'}}>
                This isn&apos;t an analyst report. It&apos;s a living database of what buyers actually paid — updated with every deal we close. When we tell you the market rate, we&apos;re not guessing.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  {value: '150K+', label: 'Quotes Analyzed'},
                  {value: '350+', label: 'Vendors Tracked'},
                  {value: '80', label: 'Countries'},
                  {value: '300', label: 'Metro Regions'},
                  {value: '20', label: 'IT Service Types'},
                  {value: '315', label: 'Variables Measured'},
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl font-bold" style={{color: 'oklch(0.82 0.15 75)', fontFamily: 'var(--font-mono)'}}>{s.value}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-wider" style={{color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)'}}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white mb-4" style={{fontFamily: 'var(--font-display)'}}>5 Data Pillars</h3>
              {spyPillars.map((p) => (
                <div
                  key={p.title}
                  className="rounded-lg p-4 border"
                  style={{background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.08)'}}
                >
                  <div className="text-sm font-bold text-white mb-1" style={{fontFamily: 'var(--font-display)'}}>{p.title}</div>
                  <p className="text-xs leading-relaxed" style={{color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)'}}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHAT WE SOURCE ═══ */}
      <section className="relative section-warm overflow-hidden py-20 sm:py-28">
        <div className="absolute -bottom-32 -right-32 w-[300px] h-[300px] rounded-full opacity-20 pointer-events-none" style={{background: 'oklch(0.55 0.15 30)', filter: 'blur(80px)'}} />
        <div className="absolute top-10 -left-20 w-[180px] h-[180px] rounded-full opacity-15 pointer-events-none" style={{background: 'oklch(0.82 0.15 75)', filter: 'blur(80px)'}} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}>
              Service Categories
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight" style={{fontFamily: 'var(--font-display)'}}>
              What We <span style={{color: 'oklch(0.55 0.15 30)'}}>Source</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((svc) => (
              <div
                key={svc.label}
                className="bg-white rounded-lg p-5 border border-black/5 hover:shadow-md transition-all"
              >
                <h3 className="text-sm font-bold mb-1.5" style={{fontFamily: 'var(--font-display)'}}>{svc.label}</h3>
                <p className="text-xs leading-relaxed" style={{color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)'}}>{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="relative section-light overflow-hidden py-20 sm:py-28">
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12" style={{fontFamily: 'var(--font-display)'}}>
            What Our Clients Say
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-black/5">
                <p className="text-sm leading-relaxed mb-5 italic" style={{color: 'oklch(0.35 0.02 50)', fontFamily: 'var(--font-body)'}}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-t border-black/5 pt-4">
                  <div className="text-sm font-semibold" style={{fontFamily: 'var(--font-body)'}}>{t.name}</div>
                  <div className="text-xs" style={{color: 'oklch(0.5 0.02 50)', fontFamily: 'var(--font-body)'}}>
                    {t.title}, {t.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/proof"
              className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
              style={{color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}
            >
              See all case studies
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ GUARANTEE CTA ═══ */}
      <section className="py-16 sm:py-20" style={{background: 'oklch(0.55 0.15 30)'}}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{fontFamily: 'var(--font-display)'}}>
            300%+ ROI or Don&apos;t Pay
          </h2>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto" style={{fontFamily: 'var(--font-body)'}}>
            The audit is always free. If we don&apos;t deliver 300%+ ROI on our sourcing engagements, you don&apos;t pay. We put skin in the game because we believe in what we do.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold bg-white transition-all hover:bg-white/90 shadow-lg"
              style={{color: 'oklch(0.35 0.1 30)', fontFamily: 'var(--font-body)'}}
            >
              Start a Conversation
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link
              href="/process"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-all"
              style={{fontFamily: 'var(--font-body)'}}
            >
              Flow Circuit
            </Link>
            <Link
              href="/process"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-all"
              style={{fontFamily: 'var(--font-body)'}}
            >
              Find Your Me
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
