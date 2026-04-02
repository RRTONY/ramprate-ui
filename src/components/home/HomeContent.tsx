'use client'

import {useState, useEffect} from 'react'
import Link from 'next/link'
import {
  ArrowRight, ArrowDown, Target, Zap, Users,
  Shield, Database, DollarSign, TrendingUp, Grid3X3, Heart,
  ChevronRight, ChevronLeft,
} from 'lucide-react'

/* ── CLIENT LOGO WALL — Two-Tier ── */
const tier1Clients = [
  {name: 'Microsoft', context: '50+ strategy & product studies'},
  {name: 'eBay', context: '27% infrastructure savings'},
  {name: 'Sony', context: 'Deep 8-figure outsourcing deals'},
  {name: 'ViacomCBS', context: 'Budget optimization across all IT categories'},
  {name: 'Intel', context: 'Digital strategy & alliances research'},
  {name: 'Nike', context: 'Multi-year procurement, 7-figure reductions'},
  {name: 'Hearst', context: '16+ years, saved millions globally'},
  {name: 'Blizzard', context: 'Complex negotiations, rapid scaling'},
]
const tier2Clients = [
  {name: 'Disney', context: 'Best IT services deal during executive tenure'},
  {name: 'AOL', context: '17-36% price reductions; breakthrough SLAs'},
  {name: 'NHL', context: 'Breakthrough PPV streaming solution'},
  {name: 'Miramax', context: '40%+ savings; diligence compressed'},
  {name: 'Warner Bros.', context: 'Win-win structures across two engagements'},
  {name: 'Verizon', context: 'Enterprise telecom partnerships'},
  {name: 'AT&T', context: 'Telecom infrastructure navigation'},
  {name: 'Merrill Lynch', context: 'Fortune 500 IT cost optimization'},
  {name: 'Accenture', context: '20-40% savings; cut processes in half'},
  {name: 'Thomson Reuters', context: 'Saved millions; marketplace mapping'},
  {name: 'Beats Music', context: 'Fully installed in 30 hours'},
  {name: 'XPRIZE', context: '$3M+ grant funding managed'},
  {name: 'Syntropy', context: '4+ year daily engagement; growth accelerated'},
  {name: 'Riot Games', context: 'Rapid scaling for multiplayer platforms'},
  {name: 'NBC', context: 'Content delivery optimization'},
  {name: 'Fox', context: 'Broadcast infrastructure advisory'},
  {name: 'Ticketmaster', context: 'eCommerce infrastructure'},
  {name: 'McGraw Hill', context: 'Publishing infrastructure optimization'},
  {name: 'Vodafone', context: 'Global telecom advisory'},
  {name: 'Primedia', context: 'Needs assessment in record time'},
]

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
  {year: '2018', event: 'Syzygy Impact division.'},
  {year: '2020', event: 'B Corp Certified.'},
  {year: '2022', event: '$3M+ grant funding managed for XPRIZE.'},
  {year: '2024', event: '$24B+ decisions brokered. ImpactSoul launched.'},
]

/* ── TESTIMONIALS ── */
const testimonials = [
  {
    quote: "I engaged RampRate to work as sourcing advisors to Sony Music. Since engaging them they have helped me significantly reduce my cost structure through several major outsourcing deals worth deep 8 figures. They made me look like a hero to my executive management. They are a secret weapon.",
    name: 'Peter Borner',
    title: 'Former Head of IT, Sony',
  },
  {
    quote: "For over 16 years, RampRate helped my companies understand the differences between suppliers. They saved us millions, created agility and new budget out of thin air with each engagement.",
    name: 'Phil Wiser',
    title: 'EVP & CTO, ViacomCBS',
  },
  {
    quote: "RampRate was a risk-free proposition money-wise. They hit 27% savings and the relationships are stronger than ever.",
    name: 'Paul Santana',
    title: 'Manager of Data Center Operations, eBay',
  },
  {
    quote: "RampRate has been my most reliable global resource and is ready to perform for us at a moment's notice. Their inside knowledge and ability to handle high-level complex negotiations helped us move fast! They made scaling easier.",
    name: 'Paul Sams',
    title: 'COO, Blizzard Entertainment',
  },
  {
    quote: "Intel engaged RampRate as we launched our Digital Home content strategy & alliances group. RampRate defines professionalism and they run a world-class team devoted to the same ideals.",
    name: 'Ron Vaisbort',
    title: 'Executive at Intel, Blackberry, Ivalua',
  },
  {
    quote: "The deal that RampRate got for the Walt Disney Internet Group was one of the best deals in IT services I saw during my tenure at Disney. I would use RampRate again.",
    name: 'Robert Gonsalves',
    title: 'Former Director, Warner Bros. Online / Disney',
  },
  {
    quote: "Each time they have saved significant time in negotiating and closing contracts, which provided at least 20 if not 40% savings and certainly cut processes in half.",
    name: 'Michael Montalto',
    title: 'Accenture',
  },
  {
    quote: "Under-promised and over-delivered for more than 4 years. They paid for themselves by accelerating our growth by years.",
    name: 'Kipras Kazlauskas',
    title: 'Co-Founder, Syntropy',
  },
]

/* ── HOW WE OPERATE ── */
const operateSteps = [
  {
    num: '01',
    title: 'Deep Research',
    desc: '$24B+ transaction intelligence. Million+ data points. 350+ vendors. 80 countries. Forecasts within 5-10% of outcome.',
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
    keyValue: '$24B+ brokered · 23.8% avg savings · 90-day validated',
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

function ClientCard({name, context}: {name: string; context: string}) {
  return (
    <div className="text-center px-2 py-4">
      <h3
        className="text-xs sm:text-sm font-bold tracking-[0.15em] uppercase"
        style={{fontFamily: 'var(--font-display)', color: 'rgba(255,255,255,0.6)'}}
      >
        {name}
      </h3>
      <p
        className="text-[11px] sm:text-xs mt-1 leading-snug"
        style={{fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)'}}
      >
        {context}
      </p>
    </div>
  )
}

function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) return
    setStatus('submitting')
    const data = new FormData()
    data.append('form-name', 'newsletter')
    data.append('email', email)
    fetch('/', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
    })
      .then(() => { setStatus('done'); setEmail('') })
      .catch(() => setStatus('error'))
  }

  return (
    <section className="section-light py-20 sm:py-24">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
        <div
          className="inline-block text-xs font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-5"
          style={{background: 'rgba(100,60,30,0.08)', color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}
        >
          Intelligence Brief
        </div>
        <h2
          className="text-3xl sm:text-4xl font-bold mb-4"
          style={{fontFamily: 'var(--font-display)', color: 'oklch(0.18 0.03 50)'}}
        >
          Join 13,000+ IT Leaders
        </h2>
        <p
          className="text-base leading-relaxed mb-8 max-w-lg mx-auto"
          style={{fontFamily: 'var(--font-body)', color: 'oklch(0.45 0.02 50)'}}
        >
          Get RampRate&apos;s take on enterprise tech, sourcing, and market shifts — straight from principals. No fluff.
        </p>

        {status === 'done' ? (
          <p className="text-base font-semibold" style={{color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}>
            You&apos;re in. Welcome to the list.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-4 py-3 rounded-md border text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor: 'oklch(0.82 0.05 80)',
                fontFamily: 'var(--font-body)',
              }}
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="px-6 py-3 rounded-md text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
              style={{background: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}
            >
              {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="mt-3 text-xs" style={{color: 'oklch(0.5 0.2 20)', fontFamily: 'var(--font-body)'}}>
            Something went wrong. Try again or email us directly.
          </p>
        )}

        <p className="mt-4 text-xs" style={{color: 'oklch(0.6 0.01 50)', fontFamily: 'var(--font-body)'}}>
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}

export default function HomeContent() {
  const [active, setActive] = useState(0)
  const [showAllClients, setShowAllClients] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setActive((p) => (p + 1) % testimonials.length), 6000)
    return () => clearInterval(timer)
  }, [])

  const next = () => setActive((p) => (p + 1) % testimonials.length)
  const prev = () => setActive((p) => (p - 1 + testimonials.length) % testimonials.length)

  return (
    <div className="min-h-screen">
      {/* ═══ HERO ═══ */}
      <section
        className="relative min-h-screen flex flex-col overflow-hidden"
        style={{background: '#0a0f1a'}}
      >
        {/* Hero background image */}
        <div className="absolute inset-0">
          <img
            src="/hero.webp"
            alt=""
            className="w-full h-full object-cover object-right"
            loading="eager"
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
                25 Years · $24B+ in Enterprise Decisions · 250+ Global Brands · Skin in the Game
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
      <section className="section-dark py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight"
              style={{fontFamily: 'var(--font-display)'}}
            >
              25 Years Inside the World&apos;s Most
              <br className="hidden sm:block" />
              <span style={{color: 'var(--gold)'}}> Complex Enterprises</span>
            </h2>
            <p
              className="mt-3 text-sm"
              style={{fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.4)'}}
            >
              100+ engagements. $24B+ in decisions brokered. Names you know.
            </p>
          </div>

          {/* Tier 1 */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px rounded-lg overflow-hidden"
            style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)'}}
          >
            {tier1Clients.map((c) => (
              <div key={c.name} style={{background: 'oklch(0.18 0.01 250)'}}>
                <ClientCard name={c.name} context={c.context} />
              </div>
            ))}
          </div>

          {/* Tier 2 */}
          {showAllClients && (
            <div
              className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-px rounded-lg overflow-hidden mt-3"
              style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)'}}
            >
              {tier2Clients.map((c) => (
                <div key={c.name} style={{background: 'oklch(0.18 0.01 250)'}}>
                  <ClientCard name={c.name} context={c.context} />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowAllClients(!showAllClients)}
              className="text-xs font-semibold tracking-[0.15em] uppercase transition-colors hover:text-white/70 text-white/40"
              style={{fontFamily: 'var(--font-body)'}}
            >
              {showAllClients ? '— Show Less' : '+ View All Clients'}
            </button>
          </div>
        </div>
      </section>

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
              Not Consultants. Not Brokers.
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
                    Broker / Agent
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
      <section className="section-dark py-28 sm:py-36 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{fontFamily: 'var(--font-body)', color: 'var(--gold)'}}
            >
              What Executives Say
            </span>
            <h2
              className="mt-4 text-3xl sm:text-4xl font-bold text-white"
              style={{fontFamily: 'var(--font-display)'}}
            >
              In Their Words.
            </h2>
          </div>

          {/* Desktop: 3 at a time */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-3 gap-6">
              {[0, 1, 2].map((offset) => {
                const idx = (active + offset) % testimonials.length
                const t = testimonials[idx]
                return (
                  <div
                    key={`${idx}-${active}`}
                    className="rounded-xl p-8 flex flex-col"
                    style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)'}}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mb-4 shrink-0" style={{color: 'rgba(212,168,67,0.4)'}}>
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" fill="currentColor"/>
                      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" fill="currentColor"/>
                    </svg>
                    <p
                      className="text-sm leading-relaxed italic flex-1"
                      style={{fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.7)'}}
                    >
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="mt-6 pt-4" style={{borderTop: '1px solid rgba(255,255,255,0.06)'}}>
                      <p className="text-sm font-bold text-white" style={{fontFamily: 'var(--font-display)'}}>
                        {t.name}
                      </p>
                      <p className="text-xs mt-0.5" style={{fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.4)'}}>
                        {t.title}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:border-white/30 hover:text-white text-white/40"
                style={{border: '1px solid rgba(255,255,255,0.1)'}}
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: i === active ? '24px' : '8px',
                      background: i === active ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
                    }}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:border-white/30 hover:text-white text-white/40"
                style={{border: '1px solid rgba(255,255,255,0.1)'}}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Mobile: single card */}
          <div className="lg:hidden">
            <div
              key={active}
              className="rounded-xl p-7"
              style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)'}}
            >
              <p
                className="text-sm leading-relaxed italic"
                style={{fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.7)'}}
              >
                &ldquo;{testimonials[active].quote}&rdquo;
              </p>
              <div className="mt-5 pt-4" style={{borderTop: '1px solid rgba(255,255,255,0.06)'}}>
                <p className="text-sm font-bold text-white" style={{fontFamily: 'var(--font-display)'}}>
                  {testimonials[active].name}
                </p>
                <p className="text-xs mt-0.5" style={{fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.4)'}}>
                  {testimonials[active].title}
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all"
                style={{border: '1px solid rgba(255,255,255,0.1)'}}
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: i === active ? '20px' : '8px',
                      background: i === active ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
                    }}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all"
                style={{border: '1px solid rgba(255,255,255,0.1)'}}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

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
