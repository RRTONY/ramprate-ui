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
  { name: "Manufacturer", sub: "Where it's made" },
  { name: "Distributor", sub: "Getting to volume" },
  { name: "Tester", sub: "Purity verification" },
  { name: "Logistics", sub: "Cold chain & delivery" },
  { name: "Compliance", sub: "Regulatory oversight" },
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
    label: "Compound",
    id: "find-compound",
    title: "Find Your Compound",
    bar: "bg-[oklch(0.52_0.12_70)]",
    points: [
      "What are you actually sourcing, and at what purity?",
      "Which suppliers can't produce it at the volume you need?",
      "Are you paying premium for unverified claims?",
      "Is your COA actually batch-specific?",
      "Verification starts with a real audit.",
    ],
  },
  {
    label: "Standard",
    id: "find-standard",
    title: "Find Your Standard",
    bar: "bg-[oklch(0.72_0.14_75)]",
    points: [
      "What's the right testing standard? Right lab?",
      "Stop trusting the supplier's own paperwork.",
      "Independent verification beats self-reported purity.",
      "The secondary supplier may outperform your primary.",
      "The real standard reveals itself through testing.",
    ],
  },
  {
    label: "Supply",
    id: "find-supply",
    title: "Find Your Supply",
    bar: "bg-rust",
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

const diagnoseSteps = [
  {
    num: "01",
    title: "The Call",
    lead: "You tell us what you're sourcing. We listen, and we give you our diagnosis within 48 hours.",
    body: "It could be an unverified supplier, a missing COA, or a broken chain of custody.",
  },
  {
    num: "02",
    title: "Supply Chain Assessment",
    lead: "We map who is involved in your supply today: the manufacturer, the distributor, the tester and the logistics partner.",
    body: "Then we show where the risk sits, what it could cost you, and how your current supply chain compares with the one you need.",
  },
];

const activateSteps = [
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
    p1: "We identify the 25 highest-fit, verified suppliers from our network. Introductions only to suppliers that fit, never a mass email.",
    p2: "25 years of procurement relationships opens doors that cold outreach never will.",
  },
];

const executeSteps = [
  {
    num: "06",
    title: "Onboard & Verify",
    lead: "Supplier calls, sample testing and signed contracts. A principal is on every call, and you get a progress report every week.",
    body: "We test and verify before anything closes, rather than taking the supplier's word for it.",
  },
  {
    num: "07",
    title: "90-Day Checkpoint",
    lead: "If we haven't delivered a verified, reliable supply chain in 90 days, you can walk. No penalty. No hard feelings. No lock-in.",
    body: "In 25 years, no one has ever exercised this option.",
  },
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

const eyebrow =
  "font-body text-xs font-semibold tracking-[0.2em] uppercase text-[oklch(0.52_0.12_70)]";
const h2 =
  "font-display mt-4 text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-ink";

function StepBlock({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-black/15 pt-5">
      <span className="font-mono text-xs font-semibold text-[oklch(0.52_0.12_70)]">
        Step {num}
      </span>
      <h3 className="font-display mt-1 text-xl font-bold text-ink">{title}</h3>
      <div className="font-body mt-3 space-y-3 text-sm leading-relaxed text-ink-mid">
        {children}
      </div>
    </div>
  );
}

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
      <section className="section-light pt-44 pb-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <span className={`${eyebrow} block mb-4`}>How Sourcing Works</span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-ink mb-6 leading-tight">
              From First Call to{" "}
              <span className="text-[oklch(0.52_0.12_70)]">Verified Supplier</span>{" "}
              in 90 Days.
            </h1>
            <p className="font-body text-lg leading-relaxed text-ink-mid mb-10">
              First we confirm the compound you need. Then the testing standard
              it has to meet. Then the suppliers who can deliver it. The same
              process RampRate has refined over 25 years.
            </p>
            <dl className="grid grid-cols-3 gap-6 mb-10 max-w-lg">
              {[
                { value: "7", label: "Steps" },
                { value: "90", label: "Days to verified supply" },
                { value: "25", label: "Years refined" },
              ].map((stat) => (
                <div key={stat.label} className="border-l-2 border-black/10 pl-4">
                  <dt className="font-display text-3xl font-bold text-ink">
                    {stat.value}
                  </dt>
                  <dd className="font-body mt-1 text-xs text-ink-mid">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
            <nav aria-label="Jump to" className="flex flex-wrap gap-3">
              {compoundStandardSupply.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="font-body inline-flex items-center px-5 py-3 rounded-md border-2 border-black/15 text-sm font-semibold text-ink hover:bg-black/5 transition-colors"
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* Compound / Standard / Supply */}
      <section
        id="compound-standard-supply"
        className="section-warm py-20 sm:py-24 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mb-12">
            <span className={eyebrow}>The Journey</span>
            <h2 className={h2}>
              Before We Fix Your Supply Chain, We Fix Your Verification.
            </h2>
            <p className="font-body mt-4 text-base text-ink-mid">
              You can&apos;t trust what you can&apos;t verify.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {compoundStandardSupply.map((item) => (
              <div
                key={item.label}
                id={item.id}
                className="relative overflow-hidden rounded-xl border border-black/10 bg-white p-7 scroll-mt-32"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 ${item.bar}`} />
                <h3 className="font-display text-2xl font-bold text-ink">
                  {item.title}
                </h3>
                <ul className="font-body mt-5 space-y-3 text-sm text-ink-mid">
                  {item.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5">
                      <span aria-hidden="true" className="text-black/25">
                        -
                      </span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="font-body mt-10 border-l-4 border-[oklch(0.52_0.12_70)] pl-5 text-base text-ink">
            Our role: find the risk, verify the chain, fix the sourcing, build
            the process. Not the cheapest supplier, the right supplier.
          </p>
        </div>
      </section>

      {/* Phase 1 - Diagnose */}
      <section id="supply-audit" className="section-light py-20 sm:py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-12">
            <span className={eyebrow}>Phase 1 - Diagnose</span>
            <h2 className={h2}>Find the real risk, not the invoice.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            {diagnoseSteps.map((s) => (
              <StepBlock key={s.num} num={s.num} title={s.title}>
                <p className="text-ink">{s.lead}</p>
                <p>{s.body}</p>
              </StepBlock>
            ))}
          </div>
          <div className="mt-14 grid lg:grid-cols-2 gap-10">
            <div>
              <h3 className="font-display text-lg font-bold text-ink mb-4">
                The Supply Chain Roles
              </h3>
              <ul className="font-body divide-y divide-black/10 border-y border-black/10">
                {supplyChainRoles.map((role) => (
                  <li
                    key={role.name}
                    className="flex justify-between gap-4 py-3 text-sm"
                  >
                    <span className="font-semibold text-ink">{role.name}</span>
                    <span className="text-ink-mid">{role.sub}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-ink mb-4">
                Common Problems We Find
              </h3>
              <ul className="font-body space-y-3 text-sm text-ink">
                {frictionPoints.map((fp) => (
                  <li key={fp} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rust"
                    />
                    <span>{fp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Phase 2 - Activate */}
      <section className="section-warm py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-12">
            <span className={eyebrow}>Phase 2 - Activate</span>
            <h2 className={h2}>
              Build the shortlist. Name the requirements. Set the standards.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {activateSteps.map((item) => (
              <StepBlock key={item.num} num={item.num} title={item.title}>
                <p>{item.p1}</p>
                <p>{item.p2}</p>
              </StepBlock>
            ))}
          </div>
        </div>
      </section>

      {/* Phase 3 - Execute */}
      <section className="section-light py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-12">
            <span className={eyebrow}>Phase 3 - Execute &amp; Deliver</span>
            <h2 className={h2}>
              Process over promises. Verification over paperwork.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            {executeSteps.map((s) => (
              <StepBlock key={s.num} num={s.num} title={s.title}>
                <p className="text-ink">{s.lead}</p>
                <p>{s.body}</p>
              </StepBlock>
            ))}
          </div>
          <div className="mt-12 rounded-xl border border-black/10 bg-warm-light p-6">
            <p className="font-body text-base text-ink">
              <strong className="font-semibold">The Guarantee: </strong>
              90 days. If we don&apos;t deliver verified supply, you walk.
              It&apos;s never happened in 25 years.
            </p>
            <p className="font-body mt-4 text-sm text-ink-mid">
              <strong className="font-semibold text-ink">The Economics: </strong>
              $15K–$50K/month · Success-fee available · Biologics specialist
              ~20% of fee · Clawbacks · Historical: 20X value
            </p>
          </div>
        </div>
      </section>

      {/* The Complete Map */}
      <section className="section-warm py-20 sm:py-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <h2 className={`${h2} mt-0 mb-10`}>The Complete Map</h2>
          <ol className="font-body flex flex-wrap gap-x-6 gap-y-3 mb-12 text-sm text-ink">
            {steps.map((step) => (
              <li key={step.num} className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-[oklch(0.52_0.12_70)]">
                  {step.num}
                </span>
                {step.label}
              </li>
            ))}
          </ol>
          <dl className="divide-y divide-black/10 border-y border-black/10">
            {summaryRows.map((row) => (
              <div
                key={row.label}
                className="flex flex-col sm:flex-row gap-2 sm:gap-8 py-5"
              >
                <dt className="font-body sm:w-56 shrink-0 text-sm font-semibold text-ink">
                  {row.label}
                </dt>
                <dd className="font-body text-sm leading-relaxed text-ink-mid">
                  {row.text}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24 bg-[oklch(0.52_0.12_70)]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            Tell Us What&apos;s Broken.
          </h2>
          <p className="font-body mt-6 text-base sm:text-lg text-white/90 max-w-xl mx-auto">
            A principal replies within 24 hours. No associates, no screening
            calls, no long intake process.
          </p>
          <div className="mt-10">
            <Link
              href="/contact"
              className="font-body inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm sm:text-base font-semibold bg-white text-[oklch(0.4_0.1_60)] hover:bg-white/90 transition-colors"
            >
              Tell Us What&apos;s Broken
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
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
