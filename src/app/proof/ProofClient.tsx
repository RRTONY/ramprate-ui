"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/content/image";

export interface SanityLogo {
  _id: string;
  name: string;
  url: string | null;
  logoUrl: string | null;
}

export interface SanityTestimonial {
  _id: string;
  personName: string;
  role: string;
  company: string;
  quote: string;
  tag: string;
  tier: "principal" | "firm";
  linkedin: string | null;
  twitter: string | null;
  companyLogoUrl: string | null;
  photoUrl: string | null;
}

export interface SanityBoardAdvisor {
  _id: string;
  name: string;
  role: string;
  bio: string;
  whyAdvise: string | null;
  linkedin: string | null;
  twitter: string | null;
  photo: { asset: { _ref: string } } | null;
}

export interface SanityCaseStudy {
  _id: string;
  title: string;
  result: string;
  desc: string;
  metrics: string[];
}

export interface SanityConfidentialTestimonial {
  _id: string;
  quote: string;
  attribution: string;
  division: string;
}

interface ProofClientProps {
  clientLogos: SanityLogo[];
  testimonials: SanityTestimonial[];
  boardAdvisors: SanityBoardAdvisor[];
  caseStudies: SanityCaseStudy[];
  confidentialTestimonials: SanityConfidentialTestimonial[];
}

const CATEGORIES = [
  "All",
  "Enterprise",
  "Media",
  "Blockchain",
  "Gaming",
  "Finance",
] as const;

const divisionColors: Record<string, string> = {
  RampRate: "oklch(0.82 0.15 75)",
  Syzygy: "oklch(0.7 0.2 280)",
  Stratum: "oklch(0.65 0.2 150)",
  ImpactSoul: "oklch(0.7 0.15 30)",
};

const HARDCODED_CASE_STUDIES: SanityCaseStudy[] = [
  {
    _id: "cs-1",
    title: "The Digital Asset Protocol That Needed a Backbone",
    result: "Enterprise-grade infrastructure across 6 jurisdictions in 90 days",
    desc: "A next-generation digital asset protocol had the tokenomics figured out. What they didn't have was the institutional plumbing - banking rails, compliance architecture, custodial relationships, multi-jurisdiction licensing. We built the operational backbone that turned a whitepaper into a regulated, functioning financial instrument.",
    metrics: [
      "6 jurisdictions",
      "90-day deployment",
      "Banking rails established",
      "Regulatory compliance achieved",
    ],
  },
  {
    _id: "cs-2",
    title: "The Fund That Couldn't See Its Own Portfolio",
    result:
      "34% reduction in operational drag; full portfolio visibility in weeks",
    desc: "A multi-strategy fund with $2B+ AUM was hemorrhaging value through fragmented supplier relationships, redundant infrastructure, and zero cross-portfolio visibility. We mapped the entire operational topology, consolidated 14 supplier contracts into 5 strategic partnerships, and gave them a dashboard they'd been trying to build for three years.",
    metrics: [
      "$2B+ AUM",
      "34% cost reduction",
      "14 suppliers → 5",
      "Real-time visibility",
    ],
  },
  {
    _id: "cs-3",
    title: "The DeFi Protocol That Outgrew Its Founders",
    result:
      "Enterprise partnerships secured; institutional adoption accelerated by 2 years",
    desc: "Brilliant protocol. Passionate community. Zero enterprise credibility. We didn't rebrand them - we repositioned them. Opened doors to institutional partners who don't take meetings with Discord-native teams. Converted developer traction into boardroom traction.",
    metrics: [
      "8 enterprise partnerships",
      "Institutional pipeline built",
      "2-year acceleration",
      "Series B positioning",
    ],
  },
  {
    _id: "cs-4",
    title: "The Compliance Maze Nobody Wanted to Enter",
    result: "Licensed across 4 regulatory frameworks in 8 months",
    desc: "They wanted to operate in the US, EU, Singapore, and UAE. Four regulatory frameworks. Four sets of lawyers. Four timelines that didn't align. We orchestrated the entire compliance architecture - not as lawyers, but as the people who know which doors to knock on and in what order.",
    metrics: [
      "4 jurisdictions",
      "8-month timeline",
      "Zero regulatory setbacks",
      "Operational from day one",
    ],
  },
  {
    _id: "cs-5",
    title: "The $800M Decision That Took 72 Hours",
    result: "$800M supplier decision compressed from 6 months to 72 hours",
    desc: "The board wanted a decision by Friday. The procurement team had been circling for six months. We walked in with 150,000+ data points, evaluated the three finalists against real-world contracts, and delivered a recommendation with 5-10% forecast accuracy. The board signed Monday.",
    metrics: [
      "$800M decision",
      "72-hour turnaround",
      "150K+ benchmarks",
      "5-10% forecast accuracy",
    ],
  },
  {
    _id: "cs-6",
    title: "The Tokenized Fund That Needed Trust",
    result: "First institutional LP commitments secured within 60 days",
    desc: "A tokenized fund with strong returns but zero institutional credibility. The problem wasn't performance - it was provenance. We transacted introductions to allocators who'd never touched digital assets, structured the narrative around risk-adjusted returns they understood, and secured first institutional LP commitments in 60 days.",
    metrics: [
      "First institutional LPs",
      "60-day timeline",
      "Risk narrative restructured",
      "Allocator pipeline built",
    ],
  },
  {
    _id: "cs-7",
    title: "The Infrastructure Nobody Could Audit",
    result: "75% infrastructure cost reduction over 16-year relationship",
    desc: "Across four CTO tenures, we became the institutional memory no org chart could replace. Every new executive inherited a supplier landscape nobody fully understood. We were the map. Exposed hundreds of millions in hidden redundancies and created methodology now adopted at the executive level.",
    metrics: [
      "16-year relationship",
      "75% cost reduction",
      "4 CTO tenures",
      "Methodology adopted org-wide",
    ],
  },
  {
    _id: "cs-8",
    title: "The Web3 Bridge to Enterprise",
    result: "US market penetration and enterprise pipeline in months",
    desc: "4+ years of daily advisory. We didn't just introduce them to enterprises - we taught them how to speak enterprise. Converted a developer-first protocol into a platform that Fortune 500 procurement teams could evaluate, approve, and deploy. Accelerated growth by years.",
    metrics: [
      "4+ years daily advisory",
      "US market entry",
      "Fortune 500 pipeline",
      "Acquisition-ready positioning",
    ],
  },
  {
    _id: "cs-9",
    title: "The Custodial Architecture That Passed Every Audit",
    result: "SOC 2 Type II compliant from zero to audit-ready in 5 months",
    desc: "They needed institutional-grade custody. Not the marketing version - the version that survives a Big Four audit. We designed the architecture, selected the technology stack, negotiated the insurance, and built the operational playbook. Passed SOC 2 Type II on the first attempt.",
    metrics: [
      "SOC 2 Type II first-pass",
      "5-month build",
      "Insurance secured",
      "Institutional-grade ops",
    ],
  },
  {
    _id: "cs-10",
    title: "The Deal That Became the Benchmark",
    result: '"Best IT deal during executive tenure" - their words, not ours',
    desc: "We structured a win-win that became the benchmark for every IT deal that followed. When the executive moved to another company, they called us again. When that company was acquired, the acquirer called us too. That's not consulting. That's gravity.",
    metrics: [
      "Benchmark-setting terms",
      "Multi-company relationship",
      "Win-win structure",
      "20+ year trust",
    ],
  },
];

export default function ProofClient({
  clientLogos,
  testimonials,
  boardAdvisors,
  caseStudies,
  confidentialTestimonials,
}: ProofClientProps) {
  const allCaseStudies = useMemo(() => {
    const sanityIds = new Set(caseStudies.map((cs) => cs._id));
    const merged = [...caseStudies];
    for (const hc of HARDCODED_CASE_STUDIES) {
      if (!sanityIds.has(hc._id)) merged.push(hc);
    }
    return merged;
  }, [caseStudies]);

  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filteredTestimonials = useMemo(() => {
    if (activeFilter === "All") return testimonials;
    return testimonials.filter((t) => t.tag === activeFilter);
  }, [activeFilter, testimonials]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: testimonials.length };
    testimonials.forEach((t) => {
      map[t.tag] = (map[t.tag] || 0) + 1;
    });
    return map;
  }, [testimonials]);

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-[var(--dark)] pt-32 pb-20 overflow-hidden">
        <div className="glass-orb glass-orb-rust w-[400px] h-[400px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-amber w-[300px] h-[300px] bottom-0 -left-32" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <span className="mb-4 block text-xs font-body font-semibold uppercase tracking-[0.2em] text-[oklch(0.82_0.15_75)]">
              Proof
            </span>
            <h1 className="mb-6 text-4xl font-display font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              24 Years of <span className="text-gold">Trajectory-Changing</span>{" "}
              Results
            </h1>
            <p className="mb-10 text-lg font-body leading-relaxed text-white/70">
              Don&#39;t take our word for it. Here&#39;s what our clients say
              about working with RampRate - and why they keep coming back.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { value: "$10B+", label: "Decisions Transacted" },
                { value: "24%", label: "Avg IT Budget Savings" },
                { value: "50+", label: "Countries" },
                { value: "24yrs", label: "Track Record" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-4">
                  <div className="mb-1 text-2xl font-display font-bold text-[oklch(0.82_0.15_75)]">
                    {stat.value}
                  </div>
                  <div className="text-xs font-body text-white/50">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      {allCaseStudies.length > 0 && (
        <section className="relative section-warm py-20 sm:py-28 overflow-hidden">
          <div className="glass-orb glass-orb-rust w-[300px] h-[300px] -top-32 -right-32" />
          <div className="glass-orb glass-orb-amber w-[200px] h-[200px] bottom-10 -left-20" />
          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
            <div className="mb-14">
              <span className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-[#9b7417]">
                Case Studies
              </span>
              <h2 className="mt-4 text-3xl font-display font-bold tracking-tight sm:text-4xl">
                Enterprise-Grade <span className="text-gold">Results</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCaseStudies.map((cs) => (
                <div
                  key={cs._id}
                  className="glass-card-warm p-7 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[rgba(214,173,66,0.14)]">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#b88716"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-display font-bold leading-tight">
                      {cs.title}
                    </h3>
                  </div>
                  <div className="mb-4 rounded-md bg-[rgba(214,173,66,0.1)] px-3 py-2">
                    <span className="text-sm font-mono font-bold text-[#765910]">
                      {cs.result}
                    </span>
                  </div>
                  <p className="mb-4 text-sm font-body leading-relaxed text-[oklch(0.4_0.02_50)]">
                    {cs.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(cs.metrics || []).map((m) => (
                      <span
                        key={m}
                        className="rounded-full bg-[oklch(0.94_0.03_80)] px-2 py-1 text-xs font-body font-medium text-[oklch(0.45_0.02_50)]"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Client Logos - from Sanity (121 logos) */}
      <section className="section-light py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <h3 className="mb-10 text-center text-xs font-body font-semibold uppercase tracking-[0.2em] text-[oklch(0.5_0.02_50)]">
            Trusted by Industry Leaders
          </h3>
          {clientLogos.length > 0 ? (
            (() => {
              const withImage = clientLogos.filter((l) => l.logoUrl);
              const featuredLogos = withImage.slice(0, 24);
              const remainingWithImage = withImage.slice(24);
              const noImage = clientLogos.filter((l) => !l.logoUrl);
              const textNames = [
                ...remainingWithImage.map((l) => l.name),
                ...noImage.map((l) => l.name),
              ];
              return (
                <>
                  <div className="flex flex-wrap justify-center items-center gap-4">
                    {featuredLogos.map((logo) => (
                      <div
                        key={logo._id}
                        className="flex min-h-14 min-w-[100px] items-center justify-center rounded-[10px] bg-[oklch(0.94_0.02_75)] px-5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-200 hover:scale-105"
                      >
                        {logo.url ? (
                          <a
                            href={logo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center"
                          >
                            <Image
                              src={logo.logoUrl!}
                              alt={logo.name}
                              width={100}
                              height={28}
                              className="h-7 w-auto max-w-[100px] object-contain"
                              unoptimized
                            />
                          </a>
                        ) : (
                          <Image
                            src={logo.logoUrl!}
                            alt={logo.name}
                            width={100}
                            height={28}
                            className="h-7 w-auto max-w-[100px] object-contain"
                            unoptimized
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  {textNames.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-8">
                      {textNames.map((name) => (
                        <span
                          key={name}
                          className="text-xs font-body font-medium text-[oklch(0.55_0.02_50)]"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              );
            })()
          ) : (
            <p className="text-center text-sm font-body text-[oklch(0.5_0.02_50)]">
              250+ enterprise clients across 50+ countries.
            </p>
          )}
        </div>
      </section>

      {/* Board of Advisors */}
      {boardAdvisors.length > 0 && (
        <section className="relative section-dark py-16 sm:py-20 overflow-hidden">
          <div className="glass-orb glass-orb-rust w-[200px] h-[200px] top-0 -left-20" />
          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
            <h2 className="mb-8 text-2xl font-display font-bold text-white sm:text-3xl">
              Board of <span className="text-gold">Advisors</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {boardAdvisors.map((m) => (
                <div key={m._id} className="text-center">
                  <div className="mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full bg-white/10">
                    {m.photo ? (
                      <Image
                        src={urlFor(m.photo)
                          .width(160)
                          .height(160)
                          .fit("crop")
                          .url()}
                        alt={m.name}
                        width={160}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/30 text-lg font-bold">
                        {m.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    )}
                  </div>
                  {m.linkedin ? (
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-body font-semibold text-white transition-colors hover:text-gold"
                    >
                      {m.name}
                    </a>
                  ) : (
                    <span className="text-sm font-body font-semibold text-white">
                      {m.name}
                    </span>
                  )}
                  <div className="mt-0.5 text-xs font-body text-white/50">
                    {m.role}
                  </div>
                  {m.linkedin && (
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-white/60"
                      >
                        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* B Corp Badge */}
      <section className="section-light py-12">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <div className="inline-flex items-center gap-4 rounded-xl border border-black/5 bg-[oklch(0.97_0.01_80)] px-8 py-5">
            <div className="text-3xl font-display font-bold text-gold">B</div>
            <div className="text-left">
              <div className="text-sm font-body font-bold">
                Certified B Corporation
              </div>
              <div className="text-xs font-body text-[oklch(0.5_0.02_50)]">
                Meeting the highest standards of social and environmental
                performance
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials with category filter */}
      <section className="relative section-light py-20 sm:py-28 overflow-hidden">
        <div className="glass-orb glass-orb-amber w-[300px] h-[300px] -bottom-32 -left-32" />
        <div className="glass-orb glass-orb-rust w-[180px] h-[180px] top-20 -right-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="mb-2 text-3xl font-display font-bold tracking-tight sm:text-4xl">
                What Our <span className="text-gold">Clients</span> Say
              </h2>
              <p className="text-sm font-body text-[oklch(0.5_0.02_50)]">
                {activeFilter === "All"
                  ? `${testimonials.length} voices. Two decades. One consistent thread: Tony and his team deliver.`
                  : `${filteredTestimonials.length} ${activeFilter} testimonials.`}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="oklch(0.5 0.02 50)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`rounded-full px-3 py-2 text-xs font-mono font-semibold tracking-wide transition-colors ${
                    activeFilter === cat
                      ? "bg-gold text-[#071221]"
                      : "bg-[#fbfaf7] text-[#344254] hover:bg-[#eee2bd]"
                  }`}
                >
                  {cat}{" "}
                  <span className="ml-0.5 opacity-60">
                    ({counts[cat] || 0})
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredTestimonials.map((t, i) => (
              <div
                key={i}
                className={`break-inside-avoid rounded-xl border p-7 transition-shadow hover:shadow-md ${
                  t.tier === "principal"
                    ? "border-[rgba(214,173,66,0.28)] bg-[oklch(0.97_0.02_30)]"
                    : "border-black/5 bg-[oklch(0.97_0.01_80)]"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="rgba(214, 173, 66, 0.38)"
                    stroke="none"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[oklch(0.94_0.03_80)] px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wide text-[oklch(0.45_0.02_50)]">
                      {t.tag}
                    </span>
                    {t.tier === "principal" && (
                      <span className="rounded-full bg-[rgba(214,173,66,0.14)] px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wide text-[#765910]">
                        Principal
                      </span>
                    )}
                  </div>
                </div>
                <p className="mb-5 text-sm font-body italic leading-relaxed text-[oklch(0.35_0.02_50)]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-t border-black/5 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-body font-semibold">
                        {t.personName}
                      </div>
                      <div className="text-xs font-body text-[oklch(0.5_0.02_50)]">
                        {t.role}
                        {t.company ? `, ${t.company}` : ""}
                      </div>
                    </div>
                    {(t.linkedin || t.twitter) && (
                      <div className="flex gap-1.5">
                        {t.linkedin && (
                          <a
                            href={t.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-[oklch(0.55_0.15_30_/_0.1)] transition-colors hover:bg-[oklch(0.55_0.15_30)]/20"
                          >
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="oklch(0.55 0.15 30)"
                            >
                              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                              <circle cx="4" cy="4" r="2" />
                            </svg>
                          </a>
                        )}
                        {t.twitter && (
                          <a
                            href={t.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-[oklch(0.55_0.15_30_/_0.1)] transition-colors hover:bg-[oklch(0.55_0.15_30)]/20"
                          >
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="oklch(0.55 0.15 30)"
                            >
                              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Confidential Engagements */}
      {confidentialTestimonials.length > 0 && (
        <section className="relative section-dark py-20 sm:py-28 overflow-hidden">
          <div className="glass-orb glass-orb-blue w-[350px] h-[350px] -bottom-40 -right-40" />
          <div className="glass-orb glass-orb-amber w-[200px] h-[200px] top-20 -left-20" />
          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 mb-4">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="oklch(0.82 0.15 75)"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <span className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-[oklch(0.82_0.15_75)]">
                  Confidential Engagements
                </span>
              </div>
              <h2 className="mb-4 text-3xl font-display font-bold text-white sm:text-4xl">
                What Our{" "}
                <span className="text-[oklch(0.82_0.15_75)]">
                  Confidential Clients
                </span>{" "}
                Say
              </h2>
              <p className="mx-auto max-w-2xl text-sm font-body italic leading-relaxed text-white/50">
                Many of our most impactful engagements are protected by NDA.
                We&#39;ve shared these with permission, with identifying details
                removed. References are available to qualified prospects upon
                request.
              </p>
            </div>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {confidentialTestimonials.map((t, i) => (
                <div
                  key={i}
                  className="glass-card break-inside-avoid p-7 hover:bg-white/[0.08] transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="oklch(0.82 0.15 75 / 0.3)"
                      stroke="none"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wide"
                      style={{
                        background: `color-mix(in oklch, ${divisionColors[t.division] ?? "oklch(0.82 0.15 75)"}, transparent 85%)`,
                        color:
                          divisionColors[t.division] ?? "oklch(0.82 0.15 75)",
                      }}
                    >
                      {t.division}
                    </span>
                  </div>
                  <p className="mb-5 text-sm font-body italic leading-relaxed text-white/70">
                    &quot;{t.quote}&quot;
                  </p>
                  <div className="border-t border-white/[0.06] pt-4">
                    <div className="flex items-center gap-2">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                        className="shrink-0"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          ry="2"
                        />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                      <span className="text-xs font-body italic text-white/40">
                        {t.attribution}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-md bg-[oklch(0.82_0.15_75)] px-7 py-3.5 text-sm font-body font-semibold text-[oklch(0.15_0.02_75)] shadow-[0_10px_30px_oklch(0.82_0.15_75_/_0.2)] transition-all"
              >
                Request References
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <p className="mt-4 text-xs font-body text-white/30">
                References available to qualified prospects under NDA
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="rr-public-surface py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="mb-4 text-3xl font-display font-bold text-white sm:text-4xl">
            Ready to Write Your Own Success Story?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base font-body leading-relaxed text-white/80 sm:text-lg">
            The audit is free. The ROI guarantee is real. Let&#39;s talk.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-white px-7 py-3.5 text-sm font-body font-semibold text-[#071221] shadow-lg transition-all hover:bg-white/90"
            >
              Start a Conversation
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/process#flow-circuit"
              className="inline-flex items-center gap-2 rounded-md border-2 border-white/30 px-7 py-3.5 text-sm font-body font-semibold text-white transition-all hover:bg-white/10"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Flow Circuit Assessment
            </Link>
            <Link
              href="/process#find-me"
              className="inline-flex items-center gap-2 rounded-md border-2 border-white/30 px-7 py-3.5 text-sm font-body font-semibold text-white transition-all hover:bg-white/10"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Find Your Me
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
