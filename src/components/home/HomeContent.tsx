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
import { advisoryPractices } from "@/lib/advisory-practices";
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
    label: "eBay",
    stats: "27% savings and a stronger supplier relationship",
    detail:
      "Paul Santana, eBay’s manager of data center operations, reported both outcomes after RampRate helped with the company’s infrastructure contracts.",
    action: "Read the buyer’s account",
    href: "/proof#voices",
    accent: "oklch(0.55 0.16 250)",
  },
  {
    label: "NOIA",
    stats: "Four years helping an infrastructure founder enter the US market",
    detail:
      "RampRate worked with NOIA on enterprise partnerships and recruited advisors and strategic investors as the company entered the US.",
    action: "Explore founder advisory",
    href: "/growth",
    accent: "oklch(0.55 0.13 160)",
  },
  {
    label: "XPRIZE",
    stats: "More than $3 million in grant funding managed",
    detail:
      "RampRate helped organize how grant applications were reviewed and funding reached builders. The figure reflects funds managed for XPRIZE.",
    action: "Read about the grant work",
    href: "/proof#recent",
    accent: "var(--rust)",
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
  { year: "2018", event: "Syzygy Impact division launched." },
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
  {
    year: "2022",
    event:
      "Managed $3M+ in grant funding for XPRIZE. B Lab certified in December.",
  },
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
  {
    year: "2026",
    event: "Continuing the next chapter of AI-enabled advisory.",
  },
];

/* ── HOW WE OPERATE ── */
const operateSteps = [
  {
    num: "01",
    title: "Deep Research",
    desc: "$10B+ transaction intelligence. Million+ data points. 350+ suppliers across 80 countries. We forecast within 5-10% of outcome.",
    Icon: Database,
    link: {
      label: "Explore the SPY Index",
      href: "/service-provider-intelligence-index",
    },
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
    desc: "We find the buyer, partner or specialist who can move the decision forward. Our principals prepare the introduction and stay involved through negotiation.",
    Icon: Users,
    link: { label: "See Results", href: "/proof" },
  },
];

export default function HomeContent() {
  return (
    <div className="min-h-screen bg-warm-light">
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[700px] sm:min-h-[760px] flex flex-col overflow-hidden bg-warm-bg">
        <div className="absolute inset-0">
          <Image
            src="/home/homepage-sunset.jpg"
            alt="A diverse group approaches a warmly lit glass building under a colorful sunset, with stronger golden illumination near the entrance."
            fill
            priority
            sizes="100vw"
            className="object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-warm-bg via-warm-bg/95 to-warm-bg/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-warm-bg/50 via-transparent to-warm-bg/10" />
        </div>

        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full pt-32 pb-20">
            <div className="max-w-2xl">
              <div className="mb-8">
                <span className="inline-flex items-center gap-2.5 py-1 border-b border-ink/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  <span className="font-body text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-ink">
                    <a
                      href="https://www.bcorporation.net/en-us/find-a-b-corp/company/ramp-rate-a-team-inc/"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-rust transition-colors"
                    >
                      B Lab certified
                    </a>{" "}
                    · Founded in 2000
                  </span>
                </span>
              </div>

              <h1 className="font-display font-medium text-ink leading-[1.12] tracking-[-0.025em] text-balance text-[clamp(3rem,7vw,5.1rem)]">
                What’s the decision you can’t afford to{" "}
                <span className="text-rust">get wrong?</span>
              </h1>

              <p className="font-body mt-8 text-lg sm:text-xl leading-[1.75] max-w-xl text-ink text-pretty">
                RampRate helps you negotiate a better contract, land an
                enterprise customer, or get a stalled deal moving. Our
                principals bring the market evidence, get the right people to
                the table, and stay through the negotiation.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="font-body inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-bold transition-all hover:bg-ink bg-rust text-white"
                >
                  Talk through a decision <ArrowRight size={16} />
                </Link>
                <Link
                  href="/proof"
                  className="font-body inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-semibold border border-ink/35 text-ink hover:bg-white/75 transition-all"
                >
                  See client results
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pb-10 flex justify-center">
          <div className="flex flex-col items-center gap-2 text-ink-mid">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase block">
              Scroll
            </span>
            <ArrowDown size={16} />
          </div>
        </div>
      </section>

      {/* ═══ SELECTED ENGAGEMENTS ═══ */}
      <section className="section-warm py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="mb-16 max-w-2xl">
            <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-rust">
              Selected Engagements
            </span>
            <h2 className="font-display mt-4 text-4xl sm:text-5xl font-medium text-ink">
              What changed for our clients
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
                <Link
                  href={eng.href}
                  className="font-body mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-rust underline underline-offset-4"
                >
                  {eng.action}
                  <ArrowRight size={14} />
                </Link>
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
            <h2 className="font-display text-4xl sm:text-5xl font-medium text-ink leading-tight">
              Where do you need a hand?
            </h2>
            <p className="font-body mt-6 text-base sm:text-lg text-ink-mid">
              Start with the decision in front of you. The same principals
              connect the research, the specialists and the people who can act.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advisoryPractices.map((brand) => (
              <Link
                key={brand.name}
                href={brand.href}
                className="group relative block rounded-xl border p-8 transition-all duration-300 bg-white border-black/5 hover:border-[color-mix(in_oklch,var(--accent)_45%,transparent)] hover:-translate-y-1"
                style={{ "--accent": brand.accentColor } as CSSProperties}
              >
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
                  {brand.name}
                </p>
                <h3 className="font-display text-xl font-bold text-ink mb-3">
                  {brand.decision}
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

      <ClientWall />

      {/* ═══ WHY WE'RE DIFFERENT ═══ */}
      <section className="section-warm py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-rust">
              Why We&apos;re Different
            </span>
            <h2 className="font-display mt-4 text-4xl sm:text-5xl font-medium tracking-tight text-ink">
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
            A RampRate principal leads the engagement and brings in the
            specialists your decision requires.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sourcing"
              className="font-body inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold transition-all hover:brightness-110 bg-rust text-white"
            >
              Benchmark a technology contract
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/process"
              className="font-body inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold transition-all border border-black/15 text-ink hover:bg-black/3"
            >
              Explore the founder growth process
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TIMELINE ═══ */}
      <section className="section-light py-24 sm:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl sm:text-5xl font-medium text-ink">
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
            <h2 className="font-display mt-4 text-4xl sm:text-5xl font-medium tracking-tight text-ink">
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
              <h2 className="font-display mt-4 text-4xl sm:text-5xl font-medium tracking-tight text-ink">
                How does RampRate charge?
              </h2>
              <p className="font-body mt-6 leading-relaxed text-ink-mid text-base sm:text-lg">
                Fees depend on the work. Before you engage us, we explain who
                pays, what triggers a fee, and how we measure the outcome.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <DollarSign size={20} className="shrink-0 mt-0.5 text-rust" />
                <div>
                  <div className="font-display text-lg font-bold mb-1 text-ink">
                    Enterprise sourcing
                  </div>
                  <p className="font-body text-sm text-ink-mid">
                    The sourcing audit is free. Under our sourcing guarantee,
                    you pay no fee if we do not deliver at least 300% ROI.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Shield size={20} className="shrink-0 mt-0.5 text-rust" />
                <div>
                  <div className="font-display text-lg font-bold mb-1 text-ink">
                    Founder growth
                  </div>
                  <p className="font-body text-sm text-ink-mid">
                    Depending on scope, founder advisory can include a project
                    fee or retainer, equity, or commission on revenue we help
                    generate.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Target size={20} className="shrink-0 mt-0.5 text-rust" />
                <div>
                  <div className="font-display text-lg font-bold mb-1 text-ink">
                    Dispute and recovery work
                  </div>
                  <p className="font-body text-sm text-ink-mid">
                    Torque offers success fees for qualifying claims. Matters
                    requiring investigation or specialist work can require a
                    retainer or upfront funding.
                  </p>
                </div>
              </div>
              <p className="font-body pt-6 text-sm font-semibold italic text-ink border-t border-black/10">
                <Link
                  href="/howwework"
                  className="underline underline-offset-4"
                >
                  See how transaction fees work
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      {/* ── Newsletter Capture ── */}
      <NewsletterSection />

      <section className="font-body py-24 sm:py-32 text-center bg-warm-bg border-t border-black/10">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-ink mb-6">
            What decision is on your desk?
          </h2>
          <p className="text-lg sm:text-xl leading-relaxed mb-4 max-w-2xl mx-auto text-ink-mid">
            Tell us what is at stake and when you need to act. A principal
            replies within one business day.
          </p>
          <p className="text-base leading-relaxed mb-12 max-w-xl mx-auto text-ink-mid">
            If we can create leverage, we&apos;ll show you how. If we
            can&apos;t, we&apos;ll tell you fast.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-bold transition-colors bg-rust hover:bg-ink text-white"
          >
            Talk through a decision <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
