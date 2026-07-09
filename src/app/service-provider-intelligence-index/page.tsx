import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CtaSection from "@/components/sections/CtaSection";

export const metadata: Metadata = {
  title: "Service Provider Intelligence Index (SPY Index) | RampRate",
  description:
    "The first platform for IT sourcing decisions & planning. Supplier-neutral analysis across 350+ suppliers, 80 countries, 315 variables. 99%+ deal success rate. 23.8% average savings.",
  keywords: [
    "SPY Index",
    "service provider intelligence index",
    "supplier analysis",
    "IT sourcing decisions",
    "supplier neutral benchmarking",
    "sourcing intelligence platform",
  ],
};

const heroStats = [
  {
    value: "99%+",
    label: "Deal Success Rate",
    desc: "More than 99% of the deals we facilitate make it to contract.",
  },
  {
    value: "23.8%",
    label: "Average Cost Savings",
    desc: "Savings across new procurement, mid-contract negotiations, and renewals.",
  },
  {
    value: "Weeks",
    label: "Cut from Timelines",
    desc: "Weeks or months removed from management and legal approval processes.",
  },
];

const dataPillars = [
  {
    num: "01",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
        <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
      </svg>
    ),
    title: "RampRate's Historical Data",
    points: [
      "150,000+ quotes from hundreds of transactions",
      "Ongoing client inputs on actual performance",
    ],
  },
  {
    num: "02",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    title: "Analyst Research View",
    points: [
      "Industry trends & best-practice supplier ratings",
      "Gartner, IDC, Telegeography, 451 Research inputs",
    ],
  },
  {
    num: "03",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: "Supplier Capabilities",
    points: [
      "Services data, list prices & actual quotes",
      "Pre-loaded database of 1,000+ suppliers",
    ],
  },
  {
    num: "04",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Customer Experience",
    points: [
      "Primary research on customer satisfaction",
      "Ongoing end-user interview program",
    ],
  },
  {
    num: "05",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Cultural Compatibility",
    points: [
      "Cultural fit matching of clients and suppliers",
      "Alignment on CSR & energy efficiency criteria",
    ],
  },
];

const scaleStats = [
  { value: "350+", label: "Suppliers Tracked" },
  { value: "80", label: "Countries Covered" },
  { value: "300", label: "Metro Regions" },
  { value: "20", label: "IT Service Types" },
  { value: "315", label: "Analysis Variables" },
  { value: "150K+", label: "Historical Quotes" },
];

const outputItems = [
  "Real, actionable market price for a given set of services",
  "Supplier capability rating matched to your exact requirements",
  "Near real-time intelligence on 350+ suppliers worldwide",
  "Coverage across 80 countries and 300 metro regions",
  "20 different IT service types analysed simultaneously",
  "5-year forward-looking market projections included",
];

export default function SpiiPage() {
  return (
    <div
      style={{
        background: "var(--dark)",
        color: "#fff",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-28 pb-20 px-5 sm:px-8">
        <div className="glass-orb glass-orb-amber absolute w-125 h-125 -top-24 -right-32 opacity-20" />
        <div className="glass-orb glass-orb-blue absolute w-100 h-100 bottom-0 -left-24 opacity-15" />

        <div className="relative max-w-6xl mx-auto">
          <div className="mb-4">
            <span
              className="text-xs font-semibold uppercase tracking-[0.25em] px-3 py-1.5 rounded-full border"
              style={{
                color: "var(--gold)",
                borderColor: "rgba(212,168,67,0.3)",
                background: "rgba(212,168,67,0.08)",
                fontFamily: "var(--font-mono)",
              }}
            >
              Data Intelligence Platform
            </span>
          </div>

          <h1
            className="font-bold text-white mb-3"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              lineHeight: 1.1,
            }}
          >
            Service Provider
            <br />
            <span style={{ color: "var(--gold)" }}>Intelligence Index</span>
          </h1>

          <p
            className="text-xs font-semibold uppercase tracking-[0.3em] mb-6"
            style={{
              color: "rgba(255,255,255,0.35)",
              fontFamily: "var(--font-mono)",
            }}
          >
            The First Platform for IT Sourcing Decisions &amp; Planning
          </p>

          <p
            className="max-w-2xl mb-14 text-base sm:text-lg leading-relaxed"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            The SPY Index™ easily and quickly matches buyer needs with IT
            service providers in a supplier-neutral analysis - taking the
            guesswork out of supplier selection and contract negotiations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {heroStats.map((stat) => (
              <div key={stat.value} className="glass-card p-6">
                <div
                  className="text-4xl font-bold mb-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--gold)",
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-white mb-2">
                  {stat.label}
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {stat.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
              style={{
                background: "var(--gold)",
                color: "#000",
                fontFamily: "var(--font-body)",
              }}
            >
              Start a Conversation
              <svg
                width="16"
                height="16"
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
              href="/sourcing"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold border transition-colors hover:bg-white/5"
              style={{
                borderColor: "rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              See Our Sourcing Services
            </Link>
          </div>
        </div>
      </section>

      {/* ── PLATFORM IMAGE 1 - SUPPLIER MATCHING ── */}
      <section
        className="py-20 px-5 sm:px-8"
        style={{ background: "oklch(0.14 0.01 250)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.25em] mb-3"
                style={{ color: "var(--gold)", fontFamily: "var(--font-mono)" }}
              >
                Supplier-Neutral Matching Engine
              </p>
              <h2
                className="font-bold text-white mb-5 leading-tight"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                }}
              >
                Risk Disappears &amp; Performance Increases
              </h2>
              <p
                className="mb-5 text-base leading-relaxed"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                The SPY Index™ easily and quickly matches buyer needs with IT
                service providers in a supplier-neutral analysis. Configurable
                buying criteria matching ensures results are tailored to your
                exact operational and commercial requirements.
              </p>
              <p
                className="text-base leading-relaxed"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                More than{" "}
                <strong className="text-white">99% of the deals</strong> we
                facilitate for you make it to contract - because we come to the
                table with hard data, not guesswork.
              </p>

              <div className="mt-8 flex flex-col gap-3">
                {[
                  "Takes the guesswork out of supplier selection",
                  "Matches supplier capabilities to your exact requirements",
                  "Delivers real, actionable market pricing",
                  "Supplier ratings based on how well services match requirements",
                ].map((pt) => (
                  <div
                    key={pt}
                    className="flex items-start gap-3 text-sm"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    <span
                      className="mt-0.5 shrink-0"
                      style={{ color: "var(--gold)" }}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    {pt}
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl overflow-hidden border"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <Image
                src="/images/spii/spii-platform-1.png"
                alt="SPY Index Platform - Supplier-Neutral Matching Engine"
                width={1024}
                height={763}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── PLATFORM IMAGE 2 - 315 VARIABLES ── */}
      <section
        className="py-20 px-5 sm:px-8"
        style={{ background: "var(--dark)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div
              className="rounded-2xl overflow-hidden border order-last lg:order-first"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <Image
                src="/images/spii/spii-platform-2.png"
                alt="SPY Index Platform - 315 Variables Analysis"
                width={1024}
                height={740}
                className="w-full h-auto"
              />
            </div>

            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.25em] mb-3"
                style={{ color: "var(--gold)", fontFamily: "var(--font-mono)" }}
              >
                Deep Analysis Engine
              </p>
              <h2
                className="font-bold text-white mb-5 leading-tight"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                }}
              >
                Timelines Are Drastically Cut. Costs Are Slashed.
              </h2>
              <p
                className="mb-4 text-base leading-relaxed"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                The SPY Index™ analyses the right mix of Cloud and legacy
                infrastructure with{" "}
                <strong className="text-white">315 variables</strong> and
                hundreds of sources - comparing{" "}
                <strong className="text-white">thousands of data points</strong>{" "}
                encompassing price, service levels, financial stability,
                cultural compatibility, and environmental considerations.
              </p>
              <p
                className="mb-8 text-base leading-relaxed"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Built on more than{" "}
                <strong className="text-white">
                  15 years of industry experience
                </strong>{" "}
                that has unlocked billions in savings and revenue opportunities
                for clients and service providers worldwide.
              </p>

              <div className="glass-card p-6">
                <p
                  className="text-xs font-semibold uppercase tracking-[0.25em] mb-4"
                  style={{
                    color: "var(--gold)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Output Includes
                </p>
                <ul className="space-y-3">
                  {outputItems.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      <span
                        className="mt-0.5 shrink-0"
                        style={{ color: "var(--gold)" }}
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FIVE DATA PILLARS ── */}
      <section className="py-20 px-5 sm:px-8 section-warm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p
              className="text-xs font-semibold uppercase tracking-[0.25em] mb-3"
              style={{ color: "var(--rust)", fontFamily: "var(--font-mono)" }}
            >
              Five Data Sources
            </p>
            <h2
              className="font-bold"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                color: "var(--text-dark)",
              }}
            >
              What Powers the SPY Index
            </h2>
            <p
              className="mt-4 text-base max-w-2xl mx-auto leading-relaxed"
              style={{ color: "var(--text-mid)" }}
            >
              Five independent data sources - cross-referenced against your
              configurable buying criteria to deliver intelligence you can act
              on immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataPillars.map((pillar, i) => (
              <div
                key={pillar.title}
                className={`glass-card-warm p-7 ${i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(100,60,30,0.1)",
                      color: "var(--rust)",
                    }}
                  >
                    {pillar.icon}
                  </div>
                  <span
                    className="text-xs font-bold"
                    style={{
                      color: "var(--rust)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {pillar.num}
                  </span>
                </div>
                <h3
                  className="font-bold mb-3"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--text-dark)",
                    fontSize: "1.05rem",
                  }}
                >
                  {pillar.title}
                </h3>
                <ul className="space-y-2">
                  {pillar.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: "var(--text-mid)" }}
                    >
                      <span
                        className="mt-1 shrink-0"
                        style={{ color: "var(--rust)" }}
                      >
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM SCALE ── */}
      <section
        className="py-20 px-5 sm:px-8"
        style={{ background: "var(--dark)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p
              className="text-xs font-semibold uppercase tracking-[0.25em] mb-3"
              style={{ color: "var(--gold)", fontFamily: "var(--font-mono)" }}
            >
              Platform Scale
            </p>
            <h2
              className="font-bold text-white"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              }}
            >
              The Numbers Behind the Index
            </h2>
            <p
              className="mt-4 text-base max-w-xl mx-auto leading-relaxed"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Near real-time intelligence built from two decades of actual
              transactions - not analyst estimates or survey responses.
            </p>
          </div>

          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-px rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            {scaleStats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center py-10 px-6 text-center"
                style={{ background: "var(--dark)" }}
              >
                <span
                  className="font-bold mb-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    color: "var(--gold)",
                  }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-xs uppercase tracking-widest leading-snug text-center"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY IT MATTERS ── */}
      <section
        className="py-20 px-5 sm:px-8"
        style={{ background: "oklch(0.14 0.01 250)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.25em] mb-3"
                style={{ color: "var(--gold)", fontFamily: "var(--font-mono)" }}
              >
                The Intelligence
              </p>
              <h2
                className="font-bold text-white mb-5 leading-tight"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                }}
              >
                Intelligence That Drives <em>Better Deals</em>
              </h2>
              <p
                className="mb-5 text-base leading-relaxed"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                This massive database cross-references your highly configurable
                buying criteria against a comprehensive database of IT supplier
                and market information - for now and for the next 5 years.
              </p>
              <p
                className="mb-5 text-base leading-relaxed"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                It isn&apos;t an analyst report. It&apos;s a living database of
                what buyers actually paid - updated with every deal we close.
                When we tell you the market rate, we&apos;re not guessing.
              </p>
              <p
                className="text-base leading-relaxed"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Procurement, mid-contract negotiations, and renewal savings
                average{" "}
                <strong className="text-white">23.8% over baseline data</strong>{" "}
                - with weeks or even months cut from your management and legal
                approval processes.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: "New Procurement",
                  desc: "First-time sourcing for a service category? We benchmark against 150K+ actual quotes to set the right target price before you ever talk to a supplier.",
                },
                {
                  title: "Mid-Contract Negotiations",
                  desc: "You're almost never stuck. Mid-contract renegotiation is an art - and providers move when you know where their margin lives.",
                },
                {
                  title: "Renewal Planning",
                  desc: "Renewals are your highest-leverage moment. The SPY Index shows you what the market looks like today - not when you signed 3 years ago.",
                },
                {
                  title: "Supplier Consolidation",
                  desc: "Supplier sprawl is the silent budget killer. We identify consolidation opportunities that save 20–35% without breaking production.",
                },
              ].map((item) => (
                <div key={item.title} className="glass-card p-5">
                  <h3
                    className="text-sm font-bold text-white mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CtaSection
        heading="Ready to Leverage the SPY Index?"
        body="Let us match your requirements against our full supplier database and deliver a real, actionable market price - in days, not months."
        buttonText="Start a Conversation"
        buttonLink="/contact"
      />
    </div>
  );
}
