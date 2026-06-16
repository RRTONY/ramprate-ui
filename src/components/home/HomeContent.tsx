import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight, ArrowDown, Target, Zap, Users,
  Shield, Database, DollarSign, TrendingUp, Grid3X3, Heart,
} from 'lucide-react'
import ClientWall from './ClientWall'
import TestimonialsCarousel from './TestimonialsCarousel'
import NewsletterSection from './NewsletterSection'

/* ── SELECTED ENGAGEMENTS ── */
const engagements = [
  {
    label: 'ViacomCBS / Hearst',
    stats: '75% infrastructure cost reduction',
    detail: '16+ year relationship across multiple CTO tenures. Created methodology adopted at exec level. Millions in reinvestable budget freed across Broadcast, Satellite, Telecom, Cloud, and CDN.',
    accent: 'oklch(0.82 0.15 75)',
  },
  {
    label: 'eBay',
    stats: '27% savings while strengthening relationships',
    detail: 'Risk-free model: 2× fee guarantee or full refund. Global data center optimization. Millions in ongoing value. Vendor relationships stronger than before.',
    accent: 'oklch(0.6 0.2 280)',
  },
  {
    label: 'Syntropy',
    stats: 'US market penetration in months',
    detail: '4+ year daily advisory. Accelerated growth by years. Enterprise partnerships converted to next-stage momentum. Under-promised, over-delivered.',
    accent: 'oklch(0.65 0.2 150)',
  },
]

/* ── WHY DIFFERENT ── */
const diffRows = [
  {trad: 'Sells analysis', broker: 'Sells intros', ramp: 'Benchmarks real contracts against 150K+ data points'},
  {trad: 'Bills time', broker: 'Takes commissions', ramp: 'Compensation aligned to value created'},
  {trad: 'Client executes', broker: 'Disappears after handshake', ramp: 'Executes with principals end-to-end'},
  {trad: 'Junior layers', broker: 'Rolodex, no depth', ramp: 'Same senior team, 25 years, no staffing pyramid'},
  {trad: 'Forecasts ±30-40%', broker: 'No forecasts', ramp: 'Forecasts within 5-10%'},
]

/* ── TIMELINE ── */
const timeline = [
  {year: '2000', event: 'Founded. Private, self-funded, profitable from birth.'},
  {year: '2003', event: 'First Fortune 100 engagement.'},
  {year: '2004', event: 'SPY Index — 150K+ data points.'},
  {year: '2008', event: '$2B+ IT expenditure under management.'},
  {year: '2010', event: 'Global expansion, 50+ countries.'},
  {year: '2015', event: 'Blockchain/Web3 advisory launched.'},
  {year: '2016', event: 'First tokenized asset advisory. Digital securities before the market had a name.'},
  {year: '2017', event: 'Peak crypto advisory demand. Guided 12+ token launches through regulatory minefields.'},
  {year: '2018', event: 'B Corp Certified. Syzygy Impact division launched.'},
  {year: '2019', event: 'Enterprise DeFi advisory. Bridging TradFi infrastructure to on-chain rails.'},
  {year: '2020', event: 'Managed $500M+ in digital asset infrastructure decisions.'},
  {year: '2021', event: 'Deep advisory across stablecoin, custody, and tokenized fund infrastructure.'},
  {year: '2022', event: '$3M+ grant funding managed for XPRIZE.'},
  {year: '2023', event: 'ImpactSoul incubated. Consciousness-aligned capital framework.'},
  {year: '2024', event: '$10B+ decisions transacted. 25-year track record.'},
  {year: '2025', event: 'AI-augmented advisory. Same relationships, faster pattern recognition.'},
]

/* ── HOW WE OPERATE ── */
const operateSteps = [
  {
    num: '01',
    title: 'Deep Research',
    desc: '$10B+ transaction intelligence. Million+ data points. 350+ vendors. 80 countries. Forecasts within 5-10% of outcome.',
    Icon: Database,
    link: {label: 'Our Process →', href: '/our-process'},
  },
  {
    num: '02',
    title: 'Strategic Blueprint',
    desc: "Pressure-test positioning, vendor structures, GTM, revenue pathways against real market data. Not theory.",
    Icon: Target,
    link: {label: 'See How We Think →', href: '/thinking'},
  },
  {
    num: '03',
    title: 'Relationship Activation',
    desc: '25 years of enterprise trust. When we call, doors open. Not pitch. History. 99% of intros convert to contracts.',
    Icon: Users,
    link: {label: 'See Results →', href: '/proof'},
  },
]

/* ── BRANDS ── */
const brands = [
  {
    name: 'RampRate',
    since: 'Since 2000',
    audience: 'For Enterprise CTOs',
    description: 'Edge, compute & AI data center intelligence. AI studies the process — our Transaction Architects get the deal done.',
    keyValue: '$10B+ transacted · 23.8% avg savings · 90-day validated',
    compensation: '% of impact achieved',
    commitment: '300%+ ROI or don\'t pay',
    href: '/expertise',
    Icon: TrendingUp,
    accentColor: 'oklch(0.82 0.15 75)',
  },
  {
    name: 'ImpactSoul',
    since: 'Since 2024',
    audience: 'NGOs & Stewards of Art',
    description: 'Born from 25 years of enterprise advisory. Tokenize assets to rally impact movements. Turn cultural treasures and purpose into powerful economic engines.',
    keyValue: 'Millions for impact · 3× revenue · up to 10× value',
    compensation: '7.5% of asset equity to launch a movement',
    commitment: 'A fan club at worst; a global brand at peak',
    href: '/impactsoul',
    Icon: Heart,
    accentColor: 'oklch(0.7 0.18 30)',
  },
  {
    name: 'Syzygy Growth',
    since: 'Since 2018',
    audience: 'For Founders & Impactpreneurs',
    description: 'Anchor clients, advisors, capital, impact, strategy, and dispute resolution — all aligned to your vision.',
    keyValue: 'Kick down barriers · Find allies · Focus on build',
    compensation: 'Break-even cash; upside in equity / tokens',
    commitment: 'Custom-designed milestones for you',
    href: '/about',
    Icon: Zap,
    accentColor: 'oklch(0.65 0.2 150)',
  },
  {
    name: 'IT Sourcing',
    since: 'Since 2000',
    audience: 'Enterprise IT Procurement',
    description: 'Connect enterprise IT needs to the right vendors. 150K+ data points. Transparent pricing. Zero-commission model.',
    keyValue: 'Non-dilutive capital & zero-cost transformative tech',
    compensation: '% of value created',
    commitment: 'Right person in the room from all sides',
    href: '/sourcing',
    Icon: Grid3X3,
    accentColor: 'oklch(0.6 0.2 280)',
  },
]

export default function HomeContent() {
  return (
    <div className="min-h-screen">
      {/* ═══ HERO ═══ */}
      <section
        className="relative min-h-screen flex flex-col overflow-hidden"
        style={{background: '#0a0f1a'}}
      >
        {/* Hero background image */}
        <div className="absolute inset-0">
          <Image
            src="/hero.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-right"
          />
          <div className="absolute inset-0" style={{background: 'linear-gradient(to right, #0a0f1a 40%, rgba(10,15,26,0.85) 65%, transparent 100%)'}} />
          <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(10,15,26,0.9) 0%, transparent 40%, rgba(10,15,26,0.4) 100%)'}} />
        </div>

        {/* Glassmorphic orbs */}
        <div className="glass-orb glass-orb-amber w-[500px] h-[500px] -top-40 -right-40 z-[1]" style={{animationDuration: '8s'}} />
        <div className="glass-orb glass-orb-rust w-[300px] h-[300px] bottom-20 left-10 z-[1]" style={{animationDuration: '12s'}} />
        <div className="glass-orb glass-orb-blue w-[200px] h-[200px] z-[1]" style={{top: '33%', right: '25%', animationDuration: '10s'}} />

        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full pt-28 pb-16">
            <div className="max-w-2xl">
              <div className="mb-8">
                <span
                  className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5"
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{background: 'var(--gold)'}} />
                  <span
                    className="text-[11px] sm:text-xs font-medium tracking-[0.2em] uppercase text-white/60"
                    style={{fontFamily: 'var(--font-body)'}}
                  >
                    B Corp Certified · Since 2000
                  </span>
                </span>
              </div>

              <h1
                className="font-bold text-white leading-[1.05] tracking-tight"
                style={{fontFamily: 'var(--font-display)', fontSize: 'clamp(2.75rem, 7vw, 4.5rem)'}}
              >
                Where Relationships
                <br />
                Become{' '}
                <span style={{color: 'var(--gold)'}}>Revenue.</span>
              </h1>

              <p
                className="mt-6 text-sm sm:text-base font-semibold tracking-[0.15em] uppercase"
                style={{fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)'}}
              >
                25 Years · $10B+ in Enterprise Decisions · 250+ Global Brands · Skin in the Game
              </p>

              <p
                className="mt-6 text-lg sm:text-xl leading-relaxed max-w-xl"
                style={{fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.65)'}}
              >
                Fix the signal. Close the deal. We don&apos;t advise from the sidelines — we execute.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-bold transition-all hover:opacity-90"
                  style={{
                    background: 'var(--gold)',
                    color: 'var(--dark)',
                    fontFamily: 'var(--font-body)',
                    boxShadow: '0 8px 30px rgba(212,168,67,0.2)',
                  }}
                >
                  Tell Us What&apos;s Broken <ArrowRight size={16} />
                </Link>
                <Link
                  href="/proof"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-semibold border border-white/20 text-white/80 hover:bg-white/5 transition-all"
                  style={{fontFamily: 'var(--font-body)'}}
                >
                  See Case Results
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pb-8 flex justify-center">
          <div className="flex flex-col items-center gap-2 text-white/30">
            <span className="text-[10px] tracking-[0.3em] uppercase block" style={{fontFamily: 'var(--font-mono)'}}>
              Scroll
            </span>
            <ArrowDown size={16} className="animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══ CLIENT WALL ═══ */}
      <ClientWall />

      {/* ═══ SELECTED ENGAGEMENTS ═══ */}
      <section className="section-dark py-28 sm:py-36">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-14">
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{fontFamily: 'var(--font-body)', color: 'var(--gold)'}}
            >
              Selected Engagements
            </span>
            <h2
              className="mt-4 text-3xl sm:text-4xl font-bold text-white"
              style={{fontFamily: 'var(--font-display)'}}
            >
              Results, Not Promises.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {engagements.map((eng) => (
              <div
                key={eng.label}
                className="rounded-xl p-8 transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div
                  className="w-1 h-10 rounded-full mb-6"
                  style={{backgroundColor: eng.accent}}
                />
                <p
                  className="text-xs uppercase tracking-[0.15em] mb-3"
                  style={{fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.4)'}}
                >
                  {eng.label}
                </p>
                <h3
                  className="text-xl sm:text-2xl font-bold text-white mb-4"
                  style={{fontFamily: 'var(--font-display)'}}
                >
                  {eng.stats}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)'}}
                >
                  {eng.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BRANDS / PRACTICES ═══ */}
      <section id="brands" className="section-dark py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <span
              className="text-xs tracking-[0.3em] uppercase block mb-4"
              style={{fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.4)'}}
            >
              01 — Our Practices
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
              style={{fontFamily: 'var(--font-display)'}}
            >
              Four practices. One coalition.
              <br />
              Pick the one that fits you.
            </h2>
            <p
              className="mt-5 text-base sm:text-lg max-w-2xl mx-auto"
              style={{fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)'}}
            >
              Each practice is purpose-built for a distinct audience — but they share the same team of superstars behind the scenes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="group rounded-xl p-6 transition-all duration-300 hover:translate-y-[-2px]"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-5"
                  style={{background: `color-mix(in oklch, ${brand.accentColor} 15%, transparent)`}}
                >
                  <brand.Icon size={22} style={{color: brand.accentColor}} />
                </div>
                <h3
                  className="text-xl font-bold text-white mb-1"
                  style={{fontFamily: 'var(--font-display)'}}
                >
                  {brand.name}
                </h3>
                <p className="text-xs mb-1" style={{fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)'}}>
                  {brand.since}
                </p>
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-4"
                  style={{color: brand.accentColor, fontFamily: 'var(--font-body)'}}
                >
                  {brand.audience}
                </p>
                <p className="text-sm leading-relaxed mb-5" style={{fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.6)'}}>
                  {brand.description}
                </p>
                <div className="mb-3">
                  <span className="text-[10px] uppercase tracking-widest" style={{fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)'}}>
                    Key Value
                  </span>
                  <p className="text-sm mt-0.5" style={{fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.7)'}}>
                    {brand.keyValue}
                  </p>
                </div>
                <div className="mb-6">
                  <span className="text-[10px] uppercase tracking-widest" style={{fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)'}}>
                    Our Commitment
                  </span>
                  <p className="text-sm mt-0.5" style={{fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.7)'}}>
                    {brand.commitment}
                  </p>
                </div>
                <Link
                  href={brand.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium transition-all group-hover:gap-2.5"
                  style={{color: brand.accentColor, fontFamily: 'var(--font-body)'}}
                >
                  Explore {brand.name}
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY WE'RE DIFFERENT ═══ */}
      <section className="section-warm py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{fontFamily: 'var(--font-body)', color: 'var(--rust)'}}
            >
              Why We&apos;re Different
            </span>
            <h2
              className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight"
              style={{fontFamily: 'var(--font-display)', color: 'var(--text-dark)'}}
            >
              An Objective Transaction Agency.
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[560px]">
              <thead>
                <tr>
                  <th
                    className="pb-4 text-xs uppercase tracking-[0.15em] font-semibold border-b border-black/10"
                    style={{fontFamily: 'var(--font-body)', color: 'var(--text-mid)'}}
                  >
                    Traditional Consulting
                  </th>
                  <th
                    className="pb-4 text-xs uppercase tracking-[0.15em] font-semibold border-b border-black/10"
                    style={{fontFamily: 'var(--font-body)', color: 'var(--text-mid)'}}
                  >
                    Traditional Middleman
                  </th>
                  <th
                    className="pb-4 text-xs uppercase tracking-[0.15em] font-bold border-b-2"
                    style={{fontFamily: 'var(--font-body)', color: 'var(--gold)', borderColor: 'var(--gold)'}}
                  >
                    RampRate
                  </th>
                </tr>
              </thead>
              <tbody>
                {diffRows.map((row, i) => (
                  <tr key={i} className="border-b border-black/5">
                    <td className="py-4 pr-6 text-sm" style={{fontFamily: 'var(--font-body)', color: 'var(--text-mid)'}}>
                      {row.trad}
                    </td>
                    <td className="py-4 pr-6 text-sm" style={{fontFamily: 'var(--font-body)', color: 'var(--text-mid)'}}>
                      {row.broker}
                    </td>
                    <td className="py-4 text-sm font-semibold" style={{fontFamily: 'var(--font-body)', color: 'var(--text-dark)'}}>
                      {row.ramp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p
            className="mt-10 text-base sm:text-lg font-bold text-center leading-relaxed"
            style={{fontFamily: 'var(--font-display)', color: 'var(--text-dark)'}}
          >
            You work with principals. No junior layering. No staffing pyramid.
            <br className="hidden sm:block" />
            The people on the testimonials are the people who serve you.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/process"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold transition-all hover:brightness-110"
              style={{background: 'var(--gold)', color: 'var(--dark)', fontFamily: 'var(--font-body)'}}
            >
              Take the Flow Circuit Assessment
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link
              href="/process"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold transition-all border"
              style={{borderColor: 'rgba(10,15,26,0.3)', color: 'var(--dark)', fontFamily: 'var(--font-body)'}}
            >
              Find Your Me / Way / Our
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TIMELINE ═══ */}
      <section className="section-dark py-24 sm:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
              style={{fontFamily: 'var(--font-display)'}}
            >
              25 Years.{' '}
              <span style={{color: 'var(--gold)'}}>One Standard.</span>
            </h2>
          </div>

          {/* Desktop: horizontal */}
          <div className="hidden md:flex gap-0 overflow-x-auto pb-4" style={{scrollbarWidth: 'thin'}}>
            {timeline.map((item) => (
              <div key={item.year} className="flex-shrink-0 w-[200px] relative">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full relative z-10 mb-3" style={{background: 'var(--gold)'}} />
                  <div className="absolute top-1.5 left-1/2 w-full h-px" style={{background: 'rgba(255,255,255,0.1)'}} />
                  <span
                    className="text-lg font-bold mb-2"
                    style={{fontFamily: 'var(--font-mono)', color: 'var(--gold)'}}
                  >
                    {item.year}
                  </span>
                  <p
                    className="text-xs text-center leading-relaxed px-3"
                    style={{fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)'}}
                  >
                    {item.event}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: vertical */}
          <div className="md:hidden space-y-0">
            {timeline.map((item, i) => (
              <div key={item.year} className="flex gap-5 relative">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full shrink-0 relative z-10" style={{background: 'var(--gold)'}} />
                  {i < timeline.length - 1 && (
                    <div className="w-px flex-1 mt-1" style={{background: 'rgba(255,255,255,0.1)'}} />
                  )}
                </div>
                <div className="pb-8">
                  <span className="text-sm font-bold" style={{fontFamily: 'var(--font-mono)', color: 'var(--gold)'}}>
                    {item.year}
                  </span>
                  <p className="text-sm mt-1 leading-relaxed" style={{fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)'}}>
                    {item.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <TestimonialsCarousel />

      {/* ═══ HOW WE OPERATE ═══ */}
      <section className="section-warm py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-14">
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{fontFamily: 'var(--font-body)', color: 'var(--rust)'}}
            >
              Our Approach
            </span>
            <h2
              className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight"
              style={{fontFamily: 'var(--font-display)', color: 'var(--text-dark)'}}
            >
              Research. Blueprint.{' '}
              <span style={{color: 'var(--rust)'}}>Activate.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {operateSteps.map((step) => (
              <div
                key={step.num}
                className="rounded-xl p-8"
                style={{background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.06)'}}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{background: 'rgba(139,69,19,0.1)'}}
                  >
                    <step.Icon size={22} style={{color: 'var(--rust)'}} />
                  </div>
                  <span
                    className="text-3xl font-bold"
                    style={{fontFamily: 'var(--font-mono)', color: 'rgba(139,69,19,0.2)'}}
                  >
                    {step.num}
                  </span>
                </div>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{fontFamily: 'var(--font-display)', color: 'var(--text-dark)'}}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{fontFamily: 'var(--font-body)', color: 'var(--text-mid)'}}
                >
                  {step.desc}
                </p>
                <Link
                  href={step.link.href}
                  className="text-xs font-semibold transition-colors hover:opacity-70"
                  style={{color: 'var(--rust)', fontFamily: 'var(--font-body)'}}
                >
                  {step.link.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPENSATION ═══ */}
      <section className="section-light py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase"
                style={{fontFamily: 'var(--font-body)', color: 'var(--rust)'}}
              >
                Compensation
              </span>
              <h2
                className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight"
                style={{fontFamily: 'var(--font-display)', color: 'var(--text-dark)'}}
              >
                We Align Compensation{' '}
                <span style={{color: 'var(--rust)'}}>With Value Created.</span>
              </h2>
              <p
                className="mt-5 leading-relaxed"
                style={{fontFamily: 'var(--font-body)', color: 'var(--text-mid)', fontSize: '1rem'}}
              >
                No retainers held hostage. No billable hours divorced from results. We eat what we hunt — and we have a 25-year track record to prove it.
              </p>
            </div>

            <div
              className="rounded-xl p-8"
              style={{background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.06)'}}
            >
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <DollarSign size={20} className="shrink-0 mt-0.5" style={{color: 'var(--rust)'}} />
                  <div>
                    <div className="text-base font-bold mb-1" style={{fontFamily: 'var(--font-display)', color: 'var(--text-dark)'}}>
                      $15K–$50K/month
                    </div>
                    <p className="text-sm" style={{fontFamily: 'var(--font-body)', color: 'var(--text-mid)'}}>
                      Depending on scope. Equity-forward available.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Shield size={20} className="shrink-0 mt-0.5" style={{color: 'var(--rust)'}} />
                  <div>
                    <div className="text-base font-bold mb-1" style={{fontFamily: 'var(--font-display)', color: 'var(--text-dark)'}}>
                      Performance Accountability
                    </div>
                    <p className="text-sm" style={{fontFamily: 'var(--font-body)', color: 'var(--text-mid)'}}>
                      Clawbacks where appropriate. Historical multiplier: 20X.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Target size={20} className="shrink-0 mt-0.5" style={{color: 'var(--rust)'}} />
                  <div>
                    <div className="text-base font-bold mb-1" style={{fontFamily: 'var(--font-display)', color: 'var(--text-dark)'}}>
                      Every Engagement Is Custom
                    </div>
                    <p className="text-sm" style={{fontFamily: 'var(--font-body)', color: 'var(--text-mid)'}}>
                      The only way to know the number is to tell us what&apos;s broken.
                    </p>
                  </div>
                </div>
              </div>
              <p
                className="mt-8 pt-6 text-sm font-semibold italic"
                style={{fontFamily: 'var(--font-body)', color: 'var(--text-dark)', borderTop: '1px solid rgba(0,0,0,0.05)'}}
              >
                We have never invoiced and disappeared. In 25 years.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      {/* ── Newsletter Capture ── */}
      <NewsletterSection />

      <section className="py-24 sm:py-32" style={{background: 'var(--rust)', color: '#fff', textAlign: 'center'}}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
            style={{fontFamily: 'var(--font-display)'}}
          >
            Tell Us What&apos;s Broken.
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed mb-4 max-w-2xl mx-auto"
            style={{fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.7)'}}
          >
            Principal responds within 24 hours. No associates. No filters. No intake maze.
          </p>
          <p
            className="text-sm leading-relaxed mb-10 max-w-xl mx-auto"
            style={{fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)'}}
          >
            If we can create leverage, we&apos;ll show you how. If we can&apos;t, we&apos;ll tell you fast.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-bold transition-opacity hover:opacity-90"
            style={{
              background: '#fff',
              color: 'var(--rust)',
              fontFamily: 'var(--font-body)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            Tell Us What&apos;s Broken <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
