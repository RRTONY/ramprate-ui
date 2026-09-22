import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
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
import PracticeIcon from "./PracticeIcon";

// Below-the-fold, interactive-only sections - split into their own JS chunks
// so the hero above the fold doesn't have to wait on their code to hydrate.
const ClientWall = dynamic(() => import("./ClientWall"));
const TestimonialsCarousel = dynamic(() => import("./TestimonialsCarousel"));
const NewsletterSection = dynamic(() => import("./NewsletterSection"));
const Timeline = dynamic(() => import("./Timeline"));

/* ── SELECTED ENGAGEMENTS ── */
const engagements = [
  {
    label: "Paramount",
    stats: "16 years of eliminating risk",
    detail:
      "From the Viacom/CBS split in 2005 to reuniting in 2020, we were there. From March Madness in 2006 to the Super Bowl in 2019, groundbreaking events ran through us. When failure isn't an option, we're on call.",
    accent: "oklch(0.6 0.14 40)",
  },
  {
    label: "eBay",
    stats: "$50M in savings while strengthening relationships",
    detail:
      "Global data center optimization. We designed the impact dashboard behind it. Millions in ongoing value - and supplier relationships stronger than before.",
    accent: "oklch(0.55 0.16 250)",
  },
  {
    label: "NOIA",
    stats: "US market penetration in months",
    detail:
      "Four-plus years of daily advisory. Growth accelerated by years. We recruited 80% of the advisory board and 80% of the strategic investors.",
    accent: "oklch(0.55 0.13 160)",
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
  {
    trad: "Pays lip service to impact",
    broker: "Sacrifices impact for profit",
    ramp: "Finds profit through purpose",
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
  { year: "2018", event: "B Lab Certified. Syzygy Impact division launched." },
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
    desc: "$10B+ transaction intelligence. Million+ data points. 350+ suppliers across 80 countries. We forecast within 5-10% of outcome.",
    Icon: Database,
    link: { label: "Our Process", href: "/process" },
  },
  {
    num: "02",
    title: "Strategic Blueprint",
    desc: "We pressure-test positioning, supplier structures, and revenue pathways against real market data - not theory.",
    Icon: Target,
    link: { label: "See How We Think", href: "/thinking" },
  },
  {
    num: "03",
    title: "Relationship Activation",
    desc: "25 years of enterprise trust. When we call, doors open. Not a pitch - a history. 99% of intros convert to contracts.",
    Icon: Users,
    link: { label: "See Results", href: "/proof" },
  },
];

/* ── BRANDS ── */
const brands = [
  {
    name: "Syzygy",
    tag: "Founders",
    description:
      "Advisory built for founders navigating growth, fundraising, and the decisions that define a company's trajectory.",
    href: "/growth",
    iconKind: "syzygy" as const,
    accentColor: "oklch(0.55 0.13 160)",
  },
  {
    name: "Stratum",
    tag: "Web3",
    description:
      "Web3 and blockchain-adjacent strategy for organizations building on decentralized infrastructure and rails.",
    href: "/web3",
    iconKind: "stratum" as const,
    accentColor: "oklch(0.55 0.16 265)",
  },
  {
    name: "Sourcing",
    tag: "Enterprise IT",
    description:
      "IT infrastructure and enterprise sourcing advisory - cutting cost and risk out of technology procurement decisions.",
    href: "/sourcing",
    iconKind: "sourcing" as const,
    accentColor: "var(--gold)",
  },
  {
    name: "BioChain",
    tag: "Bio-Sourcing",
    description:
      "Peptide and biologics supply chain sourcing - vetted suppliers, verified COAs, and chain-of-custody tracking on every shipment.",
    href: "/biochain",
    iconKind: "biochain" as const,
    accentColor: "oklch(0.55 0.1 195)",
  },
  {
    name: "ImpactSoul",
    tag: "NGOs",
    description:
      "Impact-focused advisory for NGOs and mission-driven organizations building sustainable, fundable operating models.",
    href: "/impactsoul",
    iconKind: "impact" as const,
    accentColor: "var(--rust)",
  },
  {
    name: "Torque",
    tag: "Executive",
    description:
      "Helping founders and execs resolve disputes and push back on bad-faith tactics without calling in outside lawyers.",
    href: "/torque",
    iconKind: "advisory" as const,
    accentColor: "oklch(0.5 0.1 60)",
  },
];

export default function HomeContent() {
  return (
    <div className="min-h-screen bg-warm-light">
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden bg-warm-light">
        <div className="absolute inset-0">
          <Image
            src="/hero-sunlit.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-warm-light/92 via-warm-light/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-warm-light/35 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full pt-32 pb-20">
            <div className="max-w-2xl">
              <div className="mb-8">
                <a
                  href="https://www.bcorporation.net/en-us/find-a-b-corp/company/ramp-rate-a-team-inc/"
                  target="_blank"
                  rel="noreferrer"
                  className="glass-card-warm inline-flex items-center gap-3 pl-3 pr-4 py-2 rounded-full hover:opacity-80 transition-opacity"
                >
                  <Image
                    src="/bcorp-logo.svg"
                    alt=""
                    width={16}
                    height={23}
                    className="h-5 w-auto shrink-0"
                    unoptimized
                  />
                  <span className="font-body text-[10px] font-bold leading-[1.3] tracking-[0.1em] uppercase text-ink-mid">
                    Certified
                    <br />B Corporation
                  </span>
                  <span className="w-px self-stretch bg-ink/15" />
                  <span className="font-body text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase text-ink-mid">
                    Since 2000
                  </span>
                </a>
              </div>

              <h1 className="font-display font-bold text-ink leading-[1.05] tracking-tight text-[clamp(2.25rem,9vw,5.25rem)]">
                Where Relationships <br className="hidden sm:block" />
                Become{" "}
                <span className="text-[oklch(0.48_0.13_30)]">Revenue.</span>
              </h1>

              <p className="font-mono mt-8 text-xs sm:text-sm font-semibold leading-relaxed tracking-[0.08em] uppercase max-w-lg text-ink-mid">
                Founder advisory, product strategy, mission-critical sourcing -
                $10B+ managed since 2000.
              </p>

              <p className="font-body mt-4 text-lg sm:text-xl leading-relaxed max-w-xl text-ink-mid">
                We don&apos;t advise from the sidelines - we execute.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="font-body inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-bold transition-all hover:opacity-90 bg-[oklch(0.48_0.13_30)] text-white shadow-[0_8px_30px_rgba(132,46,38,0.25)]"
                >
                  Tell Us What&apos;s Broken <ArrowRight size={16} />
                </Link>
                <Link
                  href="/proof"
                  className="font-body inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-semibold border-2 border-ink/20 text-ink hover:bg-ink/5 transition-all"
                >
                  See Case Results
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pb-10 flex justify-center">
          <div className="flex flex-col items-center gap-2 text-ink-mid/70">
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
      <section className="section-warm py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="mb-16 max-w-2xl">
            <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-rust">
              Selected Engagements
            </span>
            <h2 className="font-display mt-4 text-4xl sm:text-5xl font-bold text-ink">
              Results, not promises.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-x-10 gap-y-14">
            {engagements.map((eng) => (
              <div key={eng.label}>
                <div
                  className="w-10 h-1 rounded-full mb-6"
                  style={{ backgroundColor: eng.accent }}
                />
                <p className="font-body text-xs uppercase tracking-[0.15em] mb-3 text-ink-mid">
                  {eng.label}
                </p>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-ink mb-4 leading-snug">
                  {eng.stats}
                </h3>
                <p className="font-body text-base leading-relaxed text-ink-mid">
                  {eng.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BRANDS / PRACTICES ═══ */}
      <section id="brands" className="section-light py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <span className="font-body text-xs tracking-[0.3em] uppercase block mb-4 text-ink-mid">
              Our Practices
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight">
              Six practices.
              <br />
              One coalition.
            </h2>
            <p className="font-body mt-6 text-base sm:text-lg text-ink-mid">
              One discipline - trust turned into revenue - applied across six
              audiences. Each practice is purpose-built, but every one draws on
              the same senior team.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand, i) => (
              <Link
                key={brand.name}
                href={brand.href}
                className="group relative block rounded-xl border p-8 transition-all duration-300 bg-white border-black/5 hover:border-[color-mix(in_oklch,var(--accent)_45%,transparent)] hover:-translate-y-1"
                style={{ "--accent": brand.accentColor } as CSSProperties}
              >
                <span className="font-mono absolute top-8 right-8 text-[11px] tracking-[0.2em] text-ink-mid/60">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                  style={{
                    background: `color-mix(in oklch, ${brand.accentColor} 12%, transparent)`,
                  }}
                >
                  <PracticeIcon
                    kind={brand.iconKind}
                    color={brand.accentColor}
                  />
                </div>

                <p
                  className="font-body text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: brand.accentColor }}
                >
                  {brand.tag}
                </p>
                <h3 className="font-display text-xl font-bold text-ink mb-3">
                  {brand.name}
                </h3>
                <p className="font-body text-sm leading-relaxed mb-6 text-ink-mid">
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
      <section className="section-warm py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-rust">
              Why We&apos;re Different
            </span>
            <h2 className="font-display mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-ink">
              Data-driven. Objective. Impact-oriented.
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
                  <th className="font-body pb-4 text-xs uppercase tracking-[0.15em] font-bold border-b-2 text-rust border-b-rust">
                    RampRate
                  </th>
                </tr>
              </thead>
              <tbody>
                {diffRows.map((row, i) => (
                  <tr key={i} className="border-b border-black/8">
                    <td className="font-body py-5 pr-6 text-sm text-ink-mid">
                      {row.trad}
                    </td>
                    <td className="font-body py-5 pr-6 text-sm text-ink-mid">
                      {row.broker}
                    </td>
                    <td className="font-body py-5 text-sm font-semibold text-ink">
                      {row.ramp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="font-display mt-12 text-lg sm:text-xl font-bold text-center leading-relaxed text-ink">
            You work with principals. No junior layering. No staffing pyramid.
            <br className="hidden sm:block" />
            The people on the testimonials are the people who serve you.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/process"
              className="font-body inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold transition-all hover:brightness-110 bg-rust text-white"
            >
              Take the Flow Circuit Assessment
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/process"
              className="font-body inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold transition-all border border-black/15 text-ink hover:bg-black/3"
            >
              Find Your Me / Way / Our
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TIMELINE ═══ */}
      <section className="section-light py-24 sm:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-ink">
              25 years. <span className="text-rust">One standard.</span>
            </h2>
          </div>

          <Timeline timeline={timeline} />
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <TestimonialsCarousel />

      {/* ═══ HOW WE OPERATE ═══ */}
      <section className="section-light py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-16 max-w-2xl">
            <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-rust">
              Our Approach
            </span>
            <h2 className="font-display mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-ink">
              Research. Blueprint. Activate.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-14">
            {operateSteps.map((step) => (
              <div key={step.num}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gold/10">
                    <step.Icon size={22} className="text-rust" />
                  </div>
                  <span className="font-mono text-3xl font-bold text-ink-mid/40">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold mb-3 text-ink">
                  {step.title}
                </h3>
                <p className="font-body text-base leading-relaxed mb-5 text-ink-mid">
                  {step.desc}
                </p>
                <Link
                  href={step.link.href}
                  className="font-body inline-flex items-center gap-1.5 text-sm font-semibold transition-all hover:gap-2.5 text-rust"
                >
                  {step.link.label}
                  <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPENSATION ═══ */}
      <section className="section-warm py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-rust">
                Compensation
              </span>
              <h2 className="font-display mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-ink">
                We align compensation with value created.
              </h2>
              <p className="font-body mt-6 leading-relaxed text-ink-mid text-base sm:text-lg">
                No retainers held hostage. No billable hours divorced from
                results. We eat what we hunt - and we have a 25-year track
                record to prove it.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <DollarSign size={20} className="shrink-0 mt-0.5 text-rust" />
                <div>
                  <div className="font-display text-lg font-bold mb-1 text-ink">
                    $15K-$50K/month
                  </div>
                  <p className="font-body text-sm text-ink-mid">
                    Depending on scope. Equity-forward available.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Shield size={20} className="shrink-0 mt-0.5 text-rust" />
                <div>
                  <div className="font-display text-lg font-bold mb-1 text-ink">
                    Performance accountability
                  </div>
                  <p className="font-body text-sm text-ink-mid">
                    Clawbacks where appropriate. Historical multiplier: 20x.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Target size={20} className="shrink-0 mt-0.5 text-rust" />
                <div>
                  <div className="font-display text-lg font-bold mb-1 text-ink">
                    Every engagement is custom
                  </div>
                  <p className="font-body text-sm text-ink-mid">
                    The only way to know the number is to tell us what&apos;s
                    broken.
                  </p>
                </div>
              </div>
              <p className="font-body pt-6 text-sm font-semibold italic text-ink border-t border-black/10">
                We have never invoiced and disappeared. In 25 years.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      {/* ── Newsletter Capture ── */}
      <NewsletterSection />

      <section
        className="font-body py-24 sm:py-32 text-center text-white"
        style={{
          background:
            "linear-gradient(135deg, var(--rust) 0%, oklch(0.5 0.13 45) 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Tell us what&apos;s broken.
          </h2>
          <p className="text-lg sm:text-xl leading-relaxed mb-4 max-w-2xl mx-auto text-white/80">
            A principal responds within 24 hours. No associates. No filters. No
            intake maze.
          </p>
          <p className="text-base leading-relaxed mb-12 max-w-xl mx-auto text-white/80">
            If we can create leverage, we&apos;ll show you how. If we
            can&apos;t, we&apos;ll tell you fast.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-bold transition-opacity hover:opacity-90 bg-white text-rust shadow-lg"
          >
            Tell Us What&apos;s Broken <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
