import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowDown,
  Target,
  Users,
  Shield,
  Database,
  DollarSign,
} from "lucide-react";
import type { CSSProperties } from "react";
import ClientWall from "./ClientWall";
import TestimonialsCarousel from "./TestimonialsCarousel";
import NewsletterSection from "./NewsletterSection";
import PracticeIcon from "./PracticeIcon";

/* ── SELECTED ENGAGEMENTS ── */
const engagements = [
  {
    label: "ViacomCBS / Hearst",
    stats: "75% infrastructure cost reduction",
    detail:
      "16+ year relationship across multiple CTO tenures. Created methodology adopted at exec level. Millions in reinvestable budget freed across Broadcast, Satellite, Telecom, Cloud, and CDN.",
    accent: "oklch(0.82 0.15 75)",
  },
  {
    label: "eBay",
    stats: "27% savings while strengthening relationships",
    detail:
      "Risk-free model: 2× fee guarantee or full refund. Global data center optimization. Millions in ongoing value. Supplier relationships stronger than before.",
    accent: "oklch(0.6 0.2 280)",
  },
  {
    label: "Syntropy",
    stats: "US market penetration in months",
    detail:
      "4+ year daily advisory. Accelerated growth by years. Enterprise partnerships converted to next-stage momentum. Under-promised, over-delivered.",
    accent: "oklch(0.65 0.2 150)",
  },
];

/* ── WHY DIFFERENT ── */
const diffRows = [
  {
    trad: "Sells analysis",
    broker: "Sells intros",
    ramp: "Benchmarks real contracts against 150K+ data points",
  },
  {
    trad: "Bills time",
    broker: "Takes commissions",
    ramp: "Compensation aligned to value created",
  },
  {
    trad: "Client executes",
    broker: "Disappears after handshake",
    ramp: "Executes with principals end-to-end",
  },
  {
    trad: "Junior layers",
    broker: "Rolodex, no depth",
    ramp: "Same senior team, 25 years, no staffing pyramid",
  },
  {
    trad: "Forecasts ±30-40%",
    broker: "No forecasts",
    ramp: "Forecasts within 5-10%",
  },
];

/* ── TIMELINE ── */
const timeline = [
  {
    year: "2000",
    event: "Founded. Private, self-funded, profitable from birth.",
  },
  { year: "2003", event: "First Fortune 100 engagement." },
  { year: "2004", event: "SPY Index - 150K+ data points." },
  { year: "2008", event: "$2B+ IT expenditure under management." },
  { year: "2010", event: "Global expansion, 50+ countries." },
  { year: "2015", event: "Blockchain/Web3 advisory launched." },
  {
    year: "2016",
    event:
      "First tokenized asset advisory. Digital securities before the market had a name.",
  },
  {
    year: "2017",
    event:
      "Peak crypto advisory demand. Guided 12+ token launches through regulatory minefields.",
  },
  { year: "2018", event: "B Corp Certified. Syzygy Impact division launched." },
  {
    year: "2019",
    event:
      "Enterprise DeFi advisory. Bridging TradFi infrastructure to on-chain rails.",
  },
  {
    year: "2020",
    event: "Managed $500M+ in digital asset infrastructure decisions.",
  },
  {
    year: "2021",
    event:
      "Deep advisory across stablecoin, custody, and tokenized fund infrastructure.",
  },
  { year: "2022", event: "$3M+ grant funding managed for XPRIZE." },
  {
    year: "2023",
    event: "ImpactSoul incubated. Consciousness-aligned capital framework.",
  },
  { year: "2024", event: "$10B+ decisions transacted. 25-year track record." },
  {
    year: "2025",
    event:
      "AI-augmented advisory. Same relationships, faster pattern recognition.",
  },
];

/* ── HOW WE OPERATE ── */
const operateSteps = [
  {
    num: "01",
    title: "Deep Research",
    desc: "$10B+ transaction intelligence. Million+ data points. 350+ suppliers. 80 countries. Forecasts within 5-10% of outcome.",
    Icon: Database,
    link: { label: "Our Process →", href: "/our-process" },
  },
  {
    num: "02",
    title: "Strategic Blueprint",
    desc: "Pressure-test positioning, supplier structures, GTM, revenue pathways against real market data. Not theory.",
    Icon: Target,
    link: { label: "See How We Think →", href: "/thinking" },
  },
  {
    num: "03",
    title: "Relationship Activation",
    desc: "25 years of enterprise trust. When we call, doors open. Not pitch. History. 99% of intros convert to contracts.",
    Icon: Users,
    link: { label: "See Results →", href: "/proof" },
  },
];

/* ── BRANDS ── */
const brands = [
  {
    name: "Sourcing",
    tag: "Enterprise IT",
    description:
      "IT infrastructure and enterprise sourcing advisory - cutting cost and risk out of technology procurement.",
    href: "/sourcing",
    iconKind: "sourcing" as const,
    accentColor: "oklch(0.82 0.15 75)",
  },
  {
    name: "Syzygy",
    tag: "Founders",
    description:
      "Advisory built for founders navigating growth, fundraising, and the decisions that define a company's trajectory.",
    href: "/growth",
    iconKind: "syzygy" as const,
    accentColor: "oklch(0.65 0.2 150)",
  },
  {
    name: "Stratum",
    tag: "Web3",
    description:
      "Web3 and blockchain-adjacent strategy for organizations building on decentralized infrastructure.",
    href: "/web3",
    iconKind: "stratum" as const,
    accentColor: "oklch(0.6 0.2 280)",
  },
  {
    name: "BioChain",
    tag: "Bio-Sourcing",
    description:
      "Peptide and biologics supply chain sourcing - vetted suppliers, verified COAs, chain-of-custody tracking.",
    href: "/biochain",
    iconKind: "biochain" as const,
    accentColor: "oklch(0.62 0.12 190)",
  },
  {
    name: "ImpactSoul",
    tag: "NGOs",
    description:
      "Impact-focused advisory for NGOs and mission-driven organizations building sustainable operating models.",
    href: "/impactsoul",
    iconKind: "impact" as const,
    accentColor: "oklch(0.7 0.18 30)",
  },
  {
    name: "Private Advisory",
    tag: "Executive",
    description:
      "Confidential, executive-level advisory for leaders who need a trusted outside perspective in the room.",
    href: "/private-advisory",
    iconKind: "advisory" as const,
    accentColor: "oklch(0.52 0.12 70)",
  },
];

export default function HomeContent() {
  return (
    <div className="min-h-screen">
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#0a0f1a]">
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
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, #0a0f1a 40%, rgba(10,15,26,0.85) 65%, transparent 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,15,26,0.9) 0%, transparent 40%, rgba(10,15,26,0.4) 100%)",
            }}
          />
        </div>

        {/* Glassmorphic orbs */}
        <div
          className="glass-orb glass-orb-amber w-[500px] h-[500px] -top-40 -right-40 z-[1]"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="glass-orb glass-orb-rust w-[300px] h-[300px] bottom-20 left-10 z-[1]"
          style={{ animationDuration: "12s" }}
        />
        <div
          className="glass-orb glass-orb-blue w-[200px] h-[200px] z-[1]"
          style={{ top: "33%", right: "25%", animationDuration: "10s" }}
        />

        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full pt-28 pb-16">
            <div className="max-w-2xl">
              <div className="mb-8">
                <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  <span className="font-body text-[11px] sm:text-xs font-medium tracking-[0.2em] uppercase text-white/60">
                    B Corp Certified · Since 2000
                  </span>
                </span>
              </div>

              <h1 className="font-display font-bold text-white leading-[1.05] tracking-tight text-[clamp(2.75rem,7vw,4.5rem)]">
                Where Relationships
                <br />
                Become <span className="text-gold">Revenue.</span>
              </h1>

              <p className="font-mono mt-6 text-sm sm:text-base font-semibold tracking-[0.15em] uppercase text-white/50">
                25 Years · $10B+ in Enterprise Decisions · 250+ Global Brands ·
                Skin in the Game
              </p>

              <p className="font-body mt-6 text-lg sm:text-xl leading-relaxed max-w-xl text-white/65">
                Fix the signal. Close the deal. We don&apos;t advise from the
                sidelines - we execute.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="font-body inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-bold transition-all hover:opacity-90 bg-gold text-dark shadow-[0_8px_30px_rgba(212,168,67,0.2)]"
                >
                  Tell Us What&apos;s Broken <ArrowRight size={16} />
                </Link>
                <Link
                  href="/proof"
                  className="font-body inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-semibold border border-white/20 text-white/80 hover:bg-white/5 transition-all"
                >
                  See Case Results
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pb-8 flex justify-center">
          <div className="flex flex-col items-center gap-2 text-white/50">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase block">
              Scroll
            </span>
            <ArrowDown size={16} className="animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══ CLIENT WALL ═══ */}
      <ClientWall />

      {/* ═══ SELECTED ENGAGEMENTS ═══ */}
      <section className="section-dark py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-14">
            <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-gold">
              Selected Engagements
            </span>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl font-bold text-white">
              Results, Not Promises.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {engagements.map((eng) => (
              <div
                key={eng.label}
                className="rounded-xl p-8 transition-all duration-300 bg-white/3 border border-white/6"
              >
                <div
                  className="w-1 h-10 rounded-full mb-6"
                  style={{ backgroundColor: eng.accent }}
                />
                <p className="font-body text-xs uppercase tracking-[0.15em] mb-3 text-white/50">
                  {eng.label}
                </p>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-4">
                  {eng.stats}
                </h3>
                <p className="font-body text-sm leading-relaxed text-white/50">
                  {eng.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BRANDS / PRACTICES ═══ */}
      <section id="brands" className="section-dark py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <span className="font-body text-xs tracking-[0.3em] uppercase block mb-4 text-white/50">
              01 - Our Practices
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              Six practices. One coalition.
              <br />
              Pick the one that fits you.
            </h2>
            <p className="font-body mt-5 text-base sm:text-lg max-w-2xl mx-auto text-white/50">
              Each practice is purpose-built for a distinct audience - but they
              share the same team of superstars behind the scenes.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-5">
            {brands.map((brand, i) => (
              <Link
                key={brand.name}
                href={brand.href}
                className="group relative block basis-full sm:basis-[calc(50%-10px)] lg:basis-[calc(33.333%-14px)] max-w-105 rounded-xl border p-7 transition-all duration-400 ease-out bg-[rgba(255,255,255,0.035)] border-[rgba(255,255,255,0.08)] hover:-translate-y-2 hover:bg-[color-mix(in_oklch,var(--accent)_7%,rgba(255,255,255,0.035))] hover:border-[color-mix(in_oklch,var(--accent)_45%,transparent)] hover:shadow-[0_25px_55px_-20px_var(--accent)]"
                style={{ "--accent": brand.accentColor } as CSSProperties}
              >
                <span className="font-mono absolute top-7 right-7 text-[11px] tracking-[0.2em] text-white/50">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative w-12 h-12 mb-5">
                  <div
                    className="absolute -inset-2 rounded-full blur-lg opacity-0 transition-opacity duration-500 group-hover:opacity-40"
                    style={{ background: brand.accentColor }}
                  />
                  <div
                    className="relative w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-400 group-hover:scale-110 group-hover:rounded-xl"
                    style={{
                      background: `color-mix(in oklch, ${brand.accentColor} 15%, transparent)`,
                    }}
                  >
                    <PracticeIcon kind={brand.iconKind} color={brand.accentColor} />
                  </div>
                </div>
                <p
                  className="font-body text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: brand.accentColor }}
                >
                  {brand.tag}
                </p>
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  {brand.name}
                </h3>
                <p className="font-body text-sm leading-relaxed mb-6 text-white/60">
                  {brand.description}
                </p>
                <span
                  className="font-body inline-flex items-center gap-1.5 text-sm font-medium transition-all group-hover:gap-2.5"
                  style={{ color: brand.accentColor }}
                >
                  Explore {brand.name}
                  <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY WE'RE DIFFERENT ═══ */}
      <section className="section-warm py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-rust">
              Why We&apos;re Different
            </span>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-ink">
              An Objective Transaction Agency.
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[560px]">
              <thead>
                <tr>
                  <th className="font-body pb-4 text-xs uppercase tracking-[0.15em] font-semibold border-b border-black/10 text-ink-mid">
                    Traditional Consulting
                  </th>
                  <th className="font-body pb-4 text-xs uppercase tracking-[0.15em] font-semibold border-b border-black/10 text-ink-mid">
                    Traditional Middleman
                  </th>
                  <th className="font-body pb-4 text-xs uppercase tracking-[0.15em] font-bold border-b-2 text-gold border-b-gold">
                    RampRate
                  </th>
                </tr>
              </thead>
              <tbody>
                {diffRows.map((row, i) => (
                  <tr key={i} className="border-b border-black/5">
                    <td className="font-body py-4 pr-6 text-sm text-ink-mid">
                      {row.trad}
                    </td>
                    <td className="font-body py-4 pr-6 text-sm text-ink-mid">
                      {row.broker}
                    </td>
                    <td className="font-body py-4 text-sm font-semibold text-ink">
                      {row.ramp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="font-display mt-10 text-base sm:text-lg font-bold text-center leading-relaxed text-ink">
            You work with principals. No junior layering. No staffing pyramid.
            <br className="hidden sm:block" />
            The people on the testimonials are the people who serve you.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/process"
              className="font-body inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold transition-all hover:brightness-110 bg-gold text-dark"
            >
              Take the Flow Circuit Assessment
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/process"
              className="font-body inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold transition-all border border-[rgba(10,15,26,0.3)] text-dark"
            >
              Find Your Me / Way / Our
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TIMELINE ═══ */}
      <section className="section-dark py-16 sm:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              25 Years.{" "}
              <span className="text-gold">One Standard.</span>
            </h2>
          </div>

          {/* Desktop: horizontal */}
          <div className="hidden md:flex gap-0 overflow-x-auto pb-4 [scrollbar-width:thin]">
            {timeline.map((item) => (
              <div key={item.year} className="flex-shrink-0 w-[200px] relative">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full relative z-10 mb-3 bg-gold" />
                  <div className="absolute top-1.5 left-1/2 w-full h-px bg-white/10" />
                  <span className="font-mono text-lg font-bold mb-2 text-gold">
                    {item.year}
                  </span>
                  <p className="font-body text-xs text-center leading-relaxed px-3 text-white/50">
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
                  <div className="w-3 h-3 rounded-full shrink-0 relative z-10 bg-gold" />
                  {i < timeline.length - 1 && (
                    <div className="w-px flex-1 mt-1 bg-white/10" />
                  )}
                </div>
                <div className="pb-8">
                  <span className="font-mono text-sm font-bold text-gold">
                    {item.year}
                  </span>
                  <p className="font-body text-sm mt-1 leading-relaxed text-white/50">
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
      <section className="section-warm py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-14">
            <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-rust">
              Our Approach
            </span>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-ink">
              Research. Blueprint.{" "}
              <span className="text-rust">Activate.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {operateSteps.map((step) => (
              <div
                key={step.num}
                className="rounded-xl p-8 bg-white/60 border border-black/6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-rust/10">
                    <step.Icon size={22} className="text-rust" />
                  </div>
                  <span className="font-mono text-3xl font-bold text-rust/20">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold mb-3 text-ink">
                  {step.title}
                </h3>
                <p className="font-body text-sm leading-relaxed mb-4 text-ink-mid">
                  {step.desc}
                </p>
                <Link
                  href={step.link.href}
                  className="font-body text-xs font-semibold transition-colors hover:opacity-70 text-rust"
                >
                  {step.link.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPENSATION ═══ */}
      <section className="section-light py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-rust">
                Compensation
              </span>
              <h2 className="font-display mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-ink">
                We Align Compensation{" "}
                <span className="text-rust">
                  With Value Created.
                </span>
              </h2>
              <p className="font-body mt-5 leading-relaxed text-ink-mid text-base">
                No retainers held hostage. No billable hours divorced from
                results. We eat what we hunt - and we have a 25-year track
                record to prove it.
              </p>
            </div>

            <div className="rounded-xl p-8 bg-white/60 border border-black/6">
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <DollarSign size={20} className="shrink-0 mt-0.5 text-rust" />
                  <div>
                    <div className="font-display text-base font-bold mb-1 text-ink">
                      $15K–$50K/month
                    </div>
                    <p className="font-body text-sm text-ink-mid">
                      Depending on scope. Equity-forward available.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Shield size={20} className="shrink-0 mt-0.5 text-rust" />
                  <div>
                    <div className="font-display text-base font-bold mb-1 text-ink">
                      Performance Accountability
                    </div>
                    <p className="font-body text-sm text-ink-mid">
                      Clawbacks where appropriate. Historical multiplier: 20X.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Target size={20} className="shrink-0 mt-0.5 text-rust" />
                  <div>
                    <div className="font-display text-base font-bold mb-1 text-ink">
                      Every Engagement Is Custom
                    </div>
                    <p className="font-body text-sm text-ink-mid">
                      The only way to know the number is to tell us what&apos;s
                      broken.
                    </p>
                  </div>
                </div>
              </div>
              <p className="font-body mt-8 pt-6 text-sm font-semibold italic text-ink border-t border-black/5">
                We have never invoiced and disappeared. In 25 years.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      {/* ── Newsletter Capture ── */}
      <NewsletterSection />

      <section className="font-body py-16 sm:py-20 text-center text-white bg-rust">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Tell Us What&apos;s Broken.
          </h2>
          <p className="text-base sm:text-lg leading-relaxed mb-4 max-w-2xl mx-auto text-white/70">
            Principal responds within 24 hours. No associates. No filters. No
            intake maze.
          </p>
          <p className="text-sm leading-relaxed mb-10 max-w-xl mx-auto text-white/50">
            If we can create leverage, we&apos;ll show you how. If we
            can&apos;t, we&apos;ll tell you fast.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-bold transition-opacity hover:opacity-90 bg-white text-rust shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
          >
            Tell Us What&apos;s Broken <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
