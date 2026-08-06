import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "How Sourcing Works - BioChain Process",
  description:
    "BioChain's verified sourcing process: find your compound, find your standard, find your supply. From first call to verified supplier in 90 days.",
  keywords: [
    "biologics sourcing process",
    "peptide supplier verification",
    "supply chain audit",
    "verified supplier onboarding",
  ],
  alternates: { canonical: "/biochain/process" },
  openGraph: {
    title: "How Sourcing Works | BioChain",
    description:
      "From first call to verified supplier in 90 days - compound, standard, supply.",
    url: "https://ramprate.com/biochain/process",
  },
};

const supplyChainRoles = [
  { name: "Manufacturer", sub: "Where it's made", color: "oklch(0.52 0.12 70)" },
  { name: "Distributor", sub: "Getting to volume", color: "oklch(0.82 0.15 75)" },
  { name: "Tester", sub: "Purity verification", color: "oklch(0.65 0.14 50)" },
  { name: "Logistics", sub: "Cold chain & delivery", color: "oklch(0.55 0.15 30)" },
  { name: "Compliance", sub: "Regulatory oversight", color: "oklch(0.45 0.1 40)" },
];

const frictionPoints = [
  "Missing batch-specific COA",
  "Wrong compound purity for the use case",
  "No independent lab verification",
  "Secondary supplier outperforms primary",
  "Broken chain-of-custody documentation",
  "Stalled procurement or supplier onboarding",
];

const compoundStandardSupply = [
  {
    label: "COMPOUND",
    id: "find-compound",
    title: "Find Your Compound",
    color: "oklch(0.52 0.12 70)",
    points: [
      "What are you actually sourcing, and at what purity?",
      "Which suppliers can't produce it at the volume you need?",
      "Are you paying premium for unverified claims?",
      "Is your COA actually batch-specific?",
      "Verification starts with a real audit.",
    ],
  },
  {
    label: "STANDARD",
    id: "find-standard",
    title: "Find Your Standard",
    color: "oklch(0.82 0.15 75)",
    points: [
      "What's the right testing standard? Right lab?",
      "Stop trusting the supplier's own paperwork.",
      "Independent verification beats self-reported purity.",
      "The secondary supplier may outperform your primary.",
      "The real standard reveals itself through testing.",
    ],
  },
  {
    label: "SUPPLY",
    id: "find-supply",
    title: "Find Your Supply",
    color: "oklch(0.55 0.15 30)",
    points: [
      "Supply security lives inside the chain of custody.",
      "The suppliers. The labs. The logistics.",
      "Who's unverified? Who's overdue for re-testing?",
      "Who needs to be replaced?",
      "The broken link gets fixed here.",
    ],
  },
];

const steps = [
  { num: "01", label: "The Call" },
  { num: "02", label: "Supply Audit" },
  { num: "03", label: "Build Team" },
  { num: "04", label: "Must-Haves" },
  { num: "05", label: "Top 25 Suppliers" },
  { num: "06", label: "Onboard & Verify" },
  { num: "07", label: "90-Day Proof" },
];

const summaryRows = [
  {
    label: "What You Bring",
    text: "The compound. The urgency. Your 10 must-haves - everything you need besides a lower price.",
  },
  {
    label: "What We Find",
    text: "Supply chain friction. Missing COAs. Unverified claims. Broken chain-of-custody. The real risk under the paperwork.",
  },
  {
    label: "What We Bring",
    text: "25 years of procurement relationships. A verified supplier network. A biologics specialist team. The Top 25 supplier list. Verification process - not vendor claims.",
  },
  {
    label: "Compound → Standard → Supply",
    text: "Find your real compound needs. Find the right standard. Build supply around it. Verification first.",
  },
  {
    label: "The Economics",
    text: "$15K–$50K/month. Success-fee available. Specialist at ~20% of fee. Clawbacks. Historical 20X value.",
  },
  {
    label: "The Guarantee",
    text: "90 days. Verified supply or you walk. No penalty. No lock-in. Never exercised in 25 years.",
  },
];

export default function BioChainProcessPage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "BioChain", url: "https://ramprate.com/biochain" },
          { name: "Process", url: "https://ramprate.com/biochain/process" },
        ])}
      />
      {/* Hero */}
      <section
        className="relative pt-36 pb-20 overflow-hidden"
        style={{ background: "var(--dark)" }}
      >
        <div className="glass-orb glass-orb-amber w-[400px] h-[400px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-rust w-[300px] h-[300px] bottom-0 -left-32" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
              style={{
                color: "oklch(0.82 0.15 75)",
                fontFamily: "var(--font-body)",
              }}
            >
              How Sourcing Works
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              From First Call to{" "}
              <span style={{ color: "var(--gold-light)" }}>
                Verified Supplier
              </span>{" "}
              in 90 Days.
            </h1>
            <p
              className="text-white/70 text-lg leading-relaxed mb-8"
              style={{ fontFamily: "var(--font-body)" }}
            >
              First we find your compound. Then your standard. Then your
              supply chain. 25 years of procurement expertise. It&apos;s
              never not worked.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { value: "7", label: "Steps" },
                { value: "90", label: "Days to verified supply" },
                { value: "25", label: "Years refined" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-4">
                  <div
                    className="text-2xl font-bold mb-1"
                    style={{
                      color: "oklch(0.82 0.15 75)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-xs text-white/50"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="#find-compound"
                className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-lg border-2 hover:bg-white/10 transition-all"
                style={{
                  borderColor: "oklch(0.52 0.12 70)",
                  background: "oklch(0.52 0.12 70 / 0.1)",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="oklch(0.52 0.12 70)"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="6" r="3" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="18" r="3" />
                  <path d="M12 9v4M9.5 15.5L12 13l2.5 2.5" />
                </svg>
                <span
                  className="text-sm font-bold tracking-wider uppercase text-white"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Find Your{" "}
                  <span style={{ color: "oklch(0.52 0.12 70)" }}>
                    Compound
                  </span>
                </span>
              </a>
              <a
                href="#find-standard"
                className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-lg border-2 hover:bg-white/10 transition-all"
                style={{
                  borderColor: "oklch(0.82 0.15 75)",
                  background: "oklch(0.82 0.15 75 / 0.1)",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="oklch(0.82 0.15 75)"
                  strokeWidth="2"
                >
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
                <span
                  className="text-sm font-bold tracking-wider uppercase text-white"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Find Your{" "}
                  <span style={{ color: "oklch(0.82 0.15 75)" }}>
                    Standard
                  </span>
                </span>
              </a>
              <a
                href="#find-supply"
                className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-lg border-2 hover:bg-white/10 transition-all"
                style={{
                  borderColor: "oklch(0.55 0.15 30)",
                  background: "oklch(0.55 0.15 30 / 0.1)",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="oklch(0.55 0.15 30)"
                  strokeWidth="2"
                >
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
                <span
                  className="text-sm font-bold tracking-wider uppercase text-white"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Find Your{" "}
                  <span style={{ color: "oklch(0.55 0.15 30)" }}>Supply</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Compound / Standard / Supply */}
      <section
        id="compound-standard-supply"
        className="relative section-dark py-20 sm:py-28 scroll-mt-20 overflow-hidden"
      >
        <div className="glass-orb glass-orb-amber w-[350px] h-[350px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-rust w-[200px] h-[200px] bottom-20 -left-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <span
              className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4 block"
              style={{ fontFamily: "var(--font-body)" }}
            >
              The Journey
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Before We Fix Your Supply Chain,{" "}
              <span style={{ color: "var(--gold-light)" }}>
                We Fix Your Verification.
              </span>
            </h2>
            <p
              className="mt-5 text-base sm:text-lg text-white/50 max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-body)" }}
            >
              You can&apos;t trust what you can&apos;t verify.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {compoundStandardSupply.map((item) => (
              <div
                key={item.label}
                id={item.id}
                className="glass-card p-7 relative overflow-hidden scroll-mt-24"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: item.color }}
                />
                <h3
                  className="text-4xl font-bold mb-6"
                  style={{
                    color: item.color,
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {item.label}
                </h3>
                <h4
                  className="text-sm font-bold uppercase tracking-wider text-white mb-5"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {item.title}
                </h4>
                <ul className="space-y-3">
                  {item.points.map((p, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2.5 text-sm text-white/60"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      <span className="text-white/20 mt-0.5">-</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div
            className="mt-10 p-5 rounded-lg border-l-4"
            style={{
              borderColor: "oklch(0.82 0.15 75)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <p
              className="text-sm sm:text-base text-white/70 italic"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Our role: find the risk, verify the chain, fix the sourcing,
              build the process. Not the cheapest supplier - the right
              supplier.
            </p>
          </div>
          <p
            className="mt-6 text-center text-xs text-white/30 tracking-widest"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            COMPOUND → STANDARD → SUPPLY
          </p>
        </div>
      </section>

      {/* Phase 1 - Diagnose */}
      <section
        id="supply-audit"
        className="relative section-warm py-20 sm:py-28 scroll-mt-20 overflow-hidden"
      >
        <div className="glass-orb glass-orb-rust w-[300px] h-[300px] -bottom-32 -right-32" />
        <div className="glass-orb glass-orb-amber w-[180px] h-[180px] top-10 -left-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-14">
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{
                color: "oklch(0.55 0.15 30)",
                fontFamily: "var(--font-body)",
              }}
            >
              Phase 1 - Diagnose
            </span>
            <h2
              className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Find the real risk -{" "}
              <span style={{ color: "oklch(0.55 0.15 30)" }}>
                not the invoice.
              </span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card-warm p-7">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "oklch(0.52 0.12 70 / 0.1)" }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="oklch(0.52 0.12 70)"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 6.68a2 2 0 012-2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.91 11.5a16 16 0 006.29 6.29l1.14-1.14a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <div>
                  <span
                    className="text-xs font-bold tracking-wider"
                    style={{
                      color: "oklch(0.52 0.12 70)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    01
                  </span>
                  <h3
                    className="text-lg font-bold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    The Call
                  </h3>
                </div>
              </div>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{
                  color: "oklch(0.35 0.02 50)",
                  fontFamily: "var(--font-body)",
                }}
              >
                You tell us what you&apos;re sourcing. We listen. We diagnose
                in 48 hours.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "oklch(0.45 0.02 50)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Could be an unverified supplier. A missing COA. A broken
                chain of custody. Whatever the problem, there&apos;s always a
                solution.
              </p>
            </div>
            <div className="glass-card-warm p-7">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "oklch(0.82 0.15 75 / 0.1)" }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="oklch(0.82 0.15 75)"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>
                <div>
                  <span
                    className="text-xs font-bold tracking-wider"
                    style={{
                      color: "oklch(0.82 0.15 75)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    02
                  </span>
                  <h3
                    className="text-lg font-bold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Supply Chain Assessment
                  </h3>
                </div>
              </div>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{
                  color: "oklch(0.35 0.02 50)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Map your sourcing&apos;s invisible architecture. Who&apos;s
                the Manufacturer? The Distributor? The Tester? The Logistics
                partner?
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "oklch(0.45 0.02 50)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Identify where risk is hiding. Calculate the exposure. See
                the supply chain you have vs. the one you need.
              </p>
            </div>
          </div>
          <div className="mt-10">
            <h4
              className="text-xs font-bold tracking-[0.2em] uppercase mb-5"
              style={{
                color: "oklch(0.45 0.02 50)",
                fontFamily: "var(--font-body)",
              }}
            >
              The Supply Chain Roles
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {supplyChainRoles.map((role) => (
                <div
                  key={role.name}
                  className="rounded-lg p-4 text-center"
                  style={{
                    backgroundColor: `color-mix(in oklch, ${role.color} 12%, oklch(0.97 0.01 80))`,
                  }}
                >
                  <div
                    className="text-sm font-bold"
                    style={{
                      color: role.color,
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {role.name}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{
                      color: "oklch(0.45 0.02 50)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {role.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10">
            <h4
              className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
              style={{
                color: "oklch(0.45 0.02 50)",
                fontFamily: "var(--font-body)",
              }}
            >
              Common Friction Points We Find
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {frictionPoints.map((fp) => (
                <div
                  key={fp}
                  className="flex items-center gap-2.5 text-sm"
                  style={{
                    color: "oklch(0.35 0.02 50)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="oklch(0.55 0.15 30)"
                    strokeWidth="2"
                    className="shrink-0"
                  >
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>{fp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Phase 2 - Activate */}
      <section className="relative section-dark py-20 sm:py-28 overflow-hidden">
        <div className="glass-orb glass-orb-amber w-[280px] h-[280px] top-10 -right-32" />
        <div className="glass-orb glass-orb-rust w-[200px] h-[200px] -bottom-20 left-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-14">
            <span
              className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4 block"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Phase 2 - Activate
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Build the shortlist. Name the requirements.{" "}
              <span style={{ color: "var(--gold-light)" }}>
                Set the standards.
              </span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "03",
                title: "Assemble the Specialists",
                p1: "One vertical-specific sourcing team contracted at ~20% of our fee. Principals + biologics specialist.",
                p2: "If the audit found a gap, we fill it. Missing lab partner? We bring one. No verified manufacturer? We find one.",
              },
              {
                num: "04",
                title: "10 Must-Haves",
                p1: "What do you need besides a lower price? Every buyer wants savings - that's not the whole answer. The answer is purity and provenance you can prove.",
                p2: "We ask for everything you need. Then we build the supplier shortlist.",
              },
              {
                num: "05",
                title: "Top 25 Verified Suppliers",
                p1: "We identify the 25 highest-fit, verified suppliers from our network. Vetted introductions only. No spray and pray.",
                p2: "25 years of procurement relationships opens doors that cold outreach never will.",
              },
            ].map((item) => (
              <div key={item.num} className="glass-card p-7">
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="text-xs font-bold tracking-wider"
                    style={{
                      color: "oklch(0.82 0.15 75)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {item.num}
                  </span>
                </div>
                <h3
                  className="text-lg font-bold text-white mb-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm text-white/60 leading-relaxed mb-4"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {item.p1}
                </p>
                <p
                  className="text-sm text-white/50 leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {item.p2}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phase 3 - Execute */}
      <section className="relative section-warm py-20 sm:py-28 overflow-hidden">
        <div className="glass-orb glass-orb-amber w-[300px] h-[300px] -top-32 -left-32" />
        <div className="glass-orb glass-orb-rust w-[180px] h-[180px] bottom-20 right-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-14">
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{
                color: "oklch(0.55 0.15 30)",
                fontFamily: "var(--font-body)",
              }}
            >
              Phase 3 - Execute & Deliver
            </span>
            <h2
              className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Process over promises.{" "}
              <span style={{ color: "oklch(0.55 0.15 30)" }}>
                Verification over paperwork.
              </span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card-warm p-7">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "oklch(0.52 0.12 70 / 0.1)" }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="oklch(0.52 0.12 70)"
                    strokeWidth="2"
                  >
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                  </svg>
                </div>
                <div>
                  <span
                    className="text-xs font-bold tracking-wider"
                    style={{
                      color: "oklch(0.52 0.12 70)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    06
                  </span>
                  <h3
                    className="text-lg font-bold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Onboard & Verify
                  </h3>
                </div>
              </div>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{
                  color: "oklch(0.35 0.02 50)",
                  fontFamily: "var(--font-body)",
                }}
              >
                We go live. Supplier calls. Sample testing. Contracts signed.
                Principals on every call. Weekly progress reports.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "oklch(0.45 0.02 50)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Category management - not vendor claims. We test, verify,
                close. Process over promises. Verification over paperwork.
              </p>
            </div>
            <div className="glass-card-warm p-7">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "oklch(0.55 0.15 30 / 0.1)" }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="oklch(0.55 0.15 30)"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <span
                    className="text-xs font-bold tracking-wider"
                    style={{
                      color: "oklch(0.55 0.15 30)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    07
                  </span>
                  <h3
                    className="text-lg font-bold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    90-Day Checkpoint
                  </h3>
                </div>
              </div>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{
                  color: "oklch(0.35 0.02 50)",
                  fontFamily: "var(--font-body)",
                }}
              >
                If we haven&apos;t delivered a verified, reliable supply
                chain in 90 days, you can walk. No penalty. No hard feelings.
                No lock-in.
              </p>
              <p
                className="text-sm leading-relaxed font-medium"
                style={{
                  color: "oklch(0.45 0.02 50)",
                  fontFamily: "var(--font-body)",
                }}
              >
                In 25 years, no one has ever exercised this option.
              </p>
            </div>
          </div>
          <div
            className="mt-10 flex items-center gap-4 p-5 rounded-xl border"
            style={{
              background: "oklch(0.82 0.15 75 / 0.1)",
              borderColor: "oklch(0.82 0.15 75 / 0.2)",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="oklch(0.82 0.15 75)"
              strokeWidth="2"
              className="shrink-0"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <p
              className="text-sm sm:text-base font-semibold"
              style={{
                color: "oklch(0.25 0.03 50)",
                fontFamily: "var(--font-body)",
              }}
            >
              <span
                className="uppercase tracking-wider text-xs mr-2"
                style={{
                  color: "oklch(0.82 0.15 75)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                The Guarantee:
              </span>
              90 days. If we don&apos;t deliver verified supply, you walk.
              It&apos;s never happened in 25 years.
            </p>
          </div>
          <div className="mt-6">
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase mb-3"
              style={{
                color: "oklch(0.55 0.15 30)",
                fontFamily: "var(--font-body)",
              }}
            >
              The Economics
            </p>
            <div
              className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
              style={{
                color: "oklch(0.35 0.02 50)",
                fontFamily: "var(--font-body)",
              }}
            >
              <span>$15K–$50K/month</span>
              <span style={{ color: "oklch(0.7 0.02 50)" }}>·</span>
              <span>Success-fee available</span>
              <span style={{ color: "oklch(0.7 0.02 50)" }}>·</span>
              <span>Biologics specialist ~20% of fee</span>
              <span style={{ color: "oklch(0.7 0.02 50)" }}>·</span>
              <span>Clawbacks</span>
              <span style={{ color: "oklch(0.7 0.02 50)" }}>·</span>
              <span>Historical: 20X value</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Complete Map */}
      <section className="relative section-dark py-20 sm:py-28 overflow-hidden">
        <div className="glass-orb glass-orb-amber w-[350px] h-[350px] -bottom-40 -right-40" />
        <div className="glass-orb glass-orb-rust w-[200px] h-[200px] top-20 -left-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The Complete Map
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-1 mb-14">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{
                      background: "oklch(0.52 0.12 70)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {step.num}
                  </div>
                  <span
                    className="mt-2 text-[10px] sm:text-xs text-white/50 text-center uppercase tracking-wider max-w-[80px]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="hidden sm:block w-8 md:w-12 h-px mt-[-16px]"
                    style={{ background: "oklch(0.52 0.12 70 / 0.4)" }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {summaryRows.map((row) => (
              <div
                key={row.label}
                className="glass-card flex flex-col sm:flex-row gap-4 sm:gap-8 p-5"
              >
                <div className="sm:w-44 shrink-0">
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{
                      color: "oklch(0.82 0.15 75)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {row.label}
                  </span>
                </div>
                <p
                  className="text-sm text-white/60 leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {row.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom right, oklch(0.52 0.12 70), oklch(0.35 0.1 40))",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Tell Us What&apos;s Broken.
          </h2>
          <p
            className="mt-6 text-base sm:text-lg text-white/70 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Principal responds within 24 hours. No associates. No filters. No
            intake maze.
          </p>
          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm sm:text-base font-semibold bg-white hover:bg-white/90 transition-all shadow-lg"
              style={{
                color: "oklch(0.35 0.1 40)",
                fontFamily: "var(--font-body)",
              }}
            >
              Tell Us What&apos;s Broken
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
