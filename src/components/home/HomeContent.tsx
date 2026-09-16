import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  ArrowRight,
  ArrowDown,
  Boxes,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Target,
  Users,
  Shield,
  Database,
  DollarSign,
} from "lucide-react";
import { impactSolService, services } from "@/lib/service-catalog";

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
      "From Viacom & CBS split in 2005 to reuniting in 2020, RampRate was there. From March Madness in 2006 to the Super Bowl in 2019, groundbreaking events ran through us. When failure isn't an option, we're on call.",
    accentClass: "bg-gold",
  },
  {
    label: "eBay",
    stats: "$50M in savings while strengthening relationships",
    detail:
      "Global data center optimization. Designed data center impact dashboard (DSE). Millions in ongoing value. Supplier relationships stronger than before.",
    accentClass: "bg-[#7260c7]",
  },
  {
    label: "NOIA",
    stats: "US market penetration in months",
    detail:
      "4+ year daily advisory. Accelerated growth by years. Enterprise partnerships converted to next-stage momentum. Recruited 80% of advisory board and 80% of strategic investors.",
    accentClass: "bg-emerald-500",
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
    desc: "$10B+ transaction intelligence. Million+ data points. 350+ suppliers. 80 countries. Forecasts within 5-10% of outcome.",
    Icon: Database,
    link: { label: "Our Process", href: "/process" },
  },
  {
    num: "02",
    title: "Strategic Blueprint",
    desc: "Pressure-test positioning, supplier structures, GTM, revenue pathways against real market data. Not theory.",
    Icon: Target,
    link: { label: "Our story & approach", href: "/about#journey" },
  },
  {
    num: "03",
    title: "Relationship Activation",
    desc: "25 years of enterprise trust. When we call, doors open. Not pitch. History. 99% of intros convert to contracts.",
    Icon: Users,
    link: { label: "See Results", href: "/proof" },
  },
];

/* ── PLAIN-LANGUAGE SERVICE DECISIONS ── */
const serviceCards = services.map((service, index) => ({
  ...service,
  Icon: [Users, BriefcaseBusiness, Boxes, ChartNoAxesCombined][index],
  accentClass: [
    "text-gold",
    "text-[#f0cd6f]",
    "text-[#8fb8e3]",
    "text-emerald-300",
  ][index],
}));

export default function HomeContent() {
  return (
    <div className="home-blue min-h-screen">
      {/* ═══ HERO ═══ */}
      <section className="home-blue-hero relative min-h-screen flex flex-col overflow-hidden">
        {/* The office photo remains contextual beneath the live site's midnight-navy and restrained-gold atmosphere. */}
        <div className="absolute inset-0">
          <Image
            src="/hero.webp"
            alt="Technology advisory team collaborating in a modern office"
            fill
            priority
            sizes="100vw"
            className="home-blue-hero-image object-cover object-right"
          />
          {/* Left-side scrim protects the reading column over the contextual image. */}
          <div className="home-blue-scrim absolute inset-0" />
          {/* A navy vignette grounds the hero in the wider content system. */}
          <div className="home-blue-vignette absolute inset-0" />
          {/* The restrained gold wash adds depth without sacrificing title contrast. */}
          <div className="home-blue-light-wash absolute inset-0 mix-blend-soft-light" />
        </div>
        <div className="home-blue-hero-grid absolute inset-0 z-[1]" />

        {/* Ambient navy, gold, and violet fields keep the hero alive without distracting from the copy. */}
        <div className="home-blue-orb-large glass-orb glass-orb-amber w-[500px] h-[500px] -top-40 -right-40 z-[1]" />
        <div className="home-blue-orb-medium glass-orb glass-orb-rust w-[300px] h-[300px] bottom-20 left-10 z-[1]" />
        <div className="home-blue-orb-small glass-orb glass-orb-pink w-[200px] h-[200px] z-[1]" />

        <div className="relative z-10 flex-1 flex items-center">
          <div className="home-blue-hero-copy max-w-7xl mx-auto px-5 sm:px-8 w-full pt-28 pb-16">
            <div className="max-w-2xl">
              <div className="home-blue-eyebrow mb-8">
                <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  <span className="font-body text-[11px] sm:text-xs font-medium tracking-[0.2em] uppercase text-white/60">
                    <a
                      href="https://www.bcorporation.net/en-us/find-a-b-corp/company/ramp-rate-a-team-inc/"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      B Lab Certified
                    </a>{" "}
                    · Since 2000
                  </span>
                </span>
              </div>

              <h1 className="home-blue-title max-w-3xl font-display text-[clamp(3.1rem,7vw,5.7rem)] font-bold leading-[0.94] tracking-[-0.035em] text-white">
                Make complex technology decisions{" "}
                <span className="text-gold">pay off.</span>
              </h1>

              <p className="home-blue-summary font-mono mt-7 max-w-2xl text-[0.68rem] font-semibold uppercase leading-relaxed tracking-[0.18em] text-white/72 sm:text-xs">
                Enterprise technology · partnerships · infrastructure · growth
              </p>

              <p className="home-blue-summary mt-6 max-w-xl font-body text-lg leading-relaxed text-white/82 sm:text-xl">
                RampRate helps leaders source the right expertise, structure
                high-stakes deals, and turn strategy into accountable progress.
              </p>

              <div className="home-blue-actions mt-10 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="font-body inline-flex min-h-12 items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-bold text-[#071221] shadow-[0_8px_30px_rgba(214,173,66,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-gold-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold active:scale-[0.97]"
                >
                  Book a Call <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  href="/proof"
                  className="font-body inline-flex min-h-12 items-center gap-2 rounded-full border border-white/26 px-6 py-3.5 text-sm font-bold text-white transition duration-200 hover:border-gold/70 hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold active:scale-[0.97]"
                >
                  View Case Studies
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="home-blue-scroll relative z-10 pb-8 flex justify-center">
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
      <section className="home-proof-section section-sunset py-16 sm:py-20">
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
                className="home-proof-card rounded-xl p-8 transition-all duration-300 bg-white/3 border border-white/6"
              >
                <div
                  className={`home-proof-marker mb-6 h-10 w-1 rounded-full ${eng.accentClass}`}
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

      {/* ═══ SERVICES ═══ */}
      <section id="services" className="home-practices-section py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="rr-kicker mb-4 block">Services</span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[0.98] tracking-[-0.025em] text-white">
              Start with the decision{" "}
              <span className="text-gold">in front of you.</span>
            </h2>
            <p className="font-body mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/66 sm:text-lg">
              Clear services for moments when technology, relationships, and
              growth have to work together.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {serviceCards.map((service, i) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="home-practice-card group relative block overflow-hidden rounded-2xl p-7 transition duration-200 ease-out hover:-translate-y-1 sm:p-8"
              >
                <span className="font-mono absolute top-7 right-7 text-[11px] tracking-[0.2em] text-white/35">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div
                  className={`mb-8 flex h-11 w-11 items-center justify-center border-b-2 border-current ${service.accentClass}`}
                >
                  <service.Icon
                    aria-hidden="true"
                    size={25}
                    strokeWidth={1.65}
                  />
                </div>
                <p
                  className={`font-mono mb-3 text-[0.66rem] font-semibold uppercase tracking-[0.16em] ${service.accentClass}`}
                >
                  Service 0{i + 1}
                </p>
                <h3 className="font-display mb-3 text-2xl font-bold leading-tight text-white">
                  {service.title}
                </h3>
                <p className="font-body mb-7 text-sm leading-relaxed text-white/66">
                  {service.summary}
                </p>
                <span
                  className={`font-body inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5 ${service.accentClass}`}
                >
                  Explore service
                  <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
          <Link
            href={impactSolService.href}
            className="group mt-12 grid gap-5 rounded-2xl border border-gold/30 bg-[linear-gradient(130deg,#0f1725,#122742)] p-6 transition duration-200 hover:border-gold/70 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-8"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/10 text-gold">
              <Target size={20} aria-hidden="true" />
            </div>
            <div>
              <p className="rr-kicker">A separate RampRate brand</p>
              <h3 className="mt-2 font-display text-3xl font-bold text-white">
                ImpactSol
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
                {impactSolService.summary}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-gold">
              Visit ImpactSol <ArrowRight size={15} aria-hidden="true" />
            </span>
          </Link>
        </div>
      </section>

      {/* ═══ WHY WE'RE DIFFERENT ═══ */}
      <section className="home-difference-section section-warm py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-rust">
              Why We&apos;re Different
            </span>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-ink">
              Data-Driven. Objective. Impact-Oriented.
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="home-difference-table w-full text-left border-collapse min-w-[560px]">
              <thead>
                <tr>
                  <th className="font-body pb-4 text-xs uppercase tracking-[0.15em] font-semibold border-b border-black/10 text-ink-mid">
                    Traditional Consulting
                  </th>
                  <th className="font-body pb-4 text-xs uppercase tracking-[0.15em] font-semibold border-b border-black/10 text-ink-mid">
                    Traditional Middleman
                  </th>
                  <th className="font-body pb-4 text-xs uppercase tracking-[0.15em] font-bold border-b-2 text-[#8a5f0e] border-b-gold">
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
            The people accountable for the work stay close to the decision.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/about#journey"
              className="font-body inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold transition-all hover:brightness-110 bg-gold text-dark"
            >
              See How We Work
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
              href="/contact"
              className="font-body inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold transition-all border border-[rgba(10,15,26,0.3)] text-dark"
            >
              Book a Call
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
      <section className="home-timeline-section section-sunset py-16 sm:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              25 Years. <span className="text-gold">One Standard.</span>
            </h2>
          </div>

          <Timeline timeline={timeline} />
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <div className="home-testimonials-section">
        <TestimonialsCarousel />
      </div>

      {/* ═══ HOW WE OPERATE ═══ */}
      <section className="home-operate-section section-warm py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-14">
            <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-rust">
              Our Approach
            </span>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-ink">
              Research. Blueprint. <span className="text-rust">Activate.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {operateSteps.map((step) => (
              <div
                key={step.num}
                className="home-operate-card rounded-xl p-8 bg-white/60 border border-black/6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-rust/10">
                    <step.Icon size={22} className="text-rust" />
                  </div>
                  <span className="font-mono text-3xl font-bold text-rust/90">
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
                  className="font-body inline-flex items-center gap-1.5 text-xs font-semibold transition-all hover:gap-2.5 hover:opacity-70 text-rust"
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
      <section className="home-compensation-section section-light py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-rust">
                Compensation
              </span>
              <h2 className="font-display mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-ink">
                We Align Compensation{" "}
                <span className="text-rust">With Value Created.</span>
              </h2>
              <p className="font-body mt-5 leading-relaxed text-ink-mid text-base">
                No retainers held hostage. No billable hours divorced from
                results. We eat what we hunt - and we have a 25-year track
                record to prove it.
              </p>
            </div>

            <div className="home-compensation-panel rounded-xl p-8 bg-white/60 border border-black/6">
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
                      Start with the decision in front of you. We&apos;ll help
                      you define the right next move.
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

      <section className="home-final-cta font-body py-16 sm:py-20 text-center text-white bg-rust">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Start with a clearer next move.
          </h2>
          <p className="text-base sm:text-lg leading-relaxed mb-4 max-w-2xl mx-auto text-white/80">
            Tell us what decision you need to make. A principal will respond
            within 24 hours.
          </p>
          <p className="text-sm leading-relaxed mb-10 max-w-xl mx-auto text-white/80">
            If RampRate can create leverage, we&apos;ll show you how. If not,
            we&apos;ll tell you quickly.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-bold transition-opacity hover:opacity-90 bg-white text-rust shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
          >
            Book a Call <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
