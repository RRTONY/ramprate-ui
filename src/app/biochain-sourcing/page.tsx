"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  LuTestTubes,
  LuCircleDot,
  LuDna,
  LuAtom,
  LuTrendingUp,
  LuLeaf,
  LuSyringe,
  LuSettings2,
} from "react-icons/lu";
import { faqs } from "./faq-data";

const gold = "oklch(0.52 0.12 70)";
const goldBg = "oklch(0.52 0.12 70 / 0.1)";

const productIcons: Record<string, React.ReactNode> = {
  peptides: <LuTestTubes size={22} />,
  exosomes: <LuCircleDot size={22} />,
  "stem-cells": <LuDna size={22} />,
  nad: <LuAtom size={22} />,
  "growth-factors": <LuTrendingUp size={22} />,
  botanicals: <LuLeaf size={22} />,
  "delivery-systems": <LuSyringe size={22} />,
  "custom-formulation": <LuSettings2 size={22} />,
};

const products = [
  {
    slug: "peptides",
    title: "Peptides",
    desc: "BPC-157, TB-500, TB-4, CJC-1295, GHK-Cu, Epithalon, MOTS-c, and custom-synthesis compounds. cGMP certified. COA, HPLC, and mass spec on every lot.",
    meta: "Research · Compounding · Custom Synthesis",
    street: "$35–$75/vial",
    rr: "$12–$22/vial",
    save: "Save 38–65%",
    links: [
      {
        label: "Peptide Sciences - Research Benchmark",
        href: "https://www.peptidesciences.com",
      },
      {
        label: "Core Peptides - US Supplier Comp",
        href: "https://corepeptides.com",
      },
    ],
  },
  {
    slug: "exosomes",
    title: "Exosomes",
    desc: "MSC-derived, platelet-rich, and plant-based exosome carriers. IV-grade and topical. NTA particle sizing and endotoxin testing on every lot.",
    meta: "MSC-Derived · IV-Grade · NTA Verified",
    street: "$800–$3,500/vial",
    rr: "$420–$1,200/vial",
    save: "Save 30–55%",
    links: [
      {
        label: "Kimera Labs - Documented US Supplier",
        href: "https://kimeralabs.com",
      },
      {
        label: "Direct Biologics - Clinical Trial Validated",
        href: "https://directbiologics.com",
      },
    ],
  },
  {
    slug: "stem-cells",
    title: "Stem Cell Products",
    desc: "Umbilical cord MSCs, Wharton's jelly, amniotic membrane, adipose-derived concentrates. AATB-accredited tissue banks only, full donor traceability.",
    meta: "MSC · Wharton's Jelly · AATB Accredited",
    street: "$2,000–$8,000/unit",
    rr: "$1,100–$3,800/unit",
    save: "Save 25–50%",
    links: [
      {
        label: "BioLife Solutions - AATB Gold Standard",
        href: "https://www.biolifesolutions.com",
      },
      {
        label: "Vitro Biopharma - MSC Expansion",
        href: "https://www.vitrobiopharma.com",
      },
    ],
  },
  {
    slug: "nad",
    title: "NAD+ & Longevity Compounds",
    desc: "NMN, NR, NAD+ precursors, Spermidine, MOTS-c, Tesamorelin. Pharmaceutical-grade sourcing from cGMP manufacturers - verified against the same API grade retail brands resell.",
    meta: "NAD+ · NMN · Longevity Stack",
    street: "$4,000–$9,000/kg",
    rr: "$1,800–$3,200/kg",
    save: "Save 40–60%",
    links: [
      {
        label: "Renue By Science - Retail Benchmark",
        href: "https://renuebyscience.com",
      },
      {
        label: "Alive By Nature - Market Rate Comp",
        href: "https://alivebynature.com",
      },
    ],
  },
  {
    slug: "growth-factors",
    title: "Growth Factors & Cytokines",
    desc: "IGF-1, EGF, FGF, PDGF, TGF-β, and proprietary blends. Full cytokine profile validation, endotoxin testing, and cold-chain logistics included.",
    meta: "IGF-1 · EGF · Clinical + Research Grade",
    street: "$80–$220/unit",
    rr: "$35–$85/unit",
    save: "Save 40–60%",
    links: [],
  },
  {
    slug: "botanicals",
    title: "Botanical & Adaptogenic APIs",
    desc: "Lion's Mane, Ashwagandha KSM-66, Bacopa, Rhodiola, and other pharmaceutical-grade adaptogen actives, third-party tested.",
    meta: "Adaptogens · Nootropics · Research Compounds",
    street: "$180–$400/kg",
    rr: "$90–$160/kg",
    save: "Save 45–60%",
    links: [],
  },
  {
    slug: "delivery-systems",
    title: "Biologic Devices & Delivery Systems",
    desc: "Microneedle patches, liposomal encapsulation systems, IV bag systems, and reconstitution kits - medical-device-grade consumables sourced alongside your biologics.",
    meta: "Delivery Systems · Medical-Device-Grade",
    street: "$180–$380/kit",
    rr: "$80–$140/kit",
    save: "Save 45–63%",
    links: [],
  },
  {
    slug: "custom-formulation",
    title: "Custom Formulation & White-Label",
    desc: "Concept-to-finished-product: custom synthesis, proprietary blends, private-label manufacturing. Every vendor negotiation includes MOQ, exclusivity, and quality-guarantee clauses.",
    meta: "Custom Synthesis · White Label · OEM",
    street: "Varies by spec",
    rr: "Performance-fee negotiated",
    save: "Save 45–70%",
    links: [
      {
        label: "Blue Sky Peptide - Market Rate Comp",
        href: "https://blueskypeptide.com",
      },
      {
        label: "Amino Asylum - Variable Documentation Comp",
        href: "https://aminoasylum.shop",
      },
    ],
  },
];

const process = [
  {
    num: "01",
    title: "Vendor Qualification Matrix",
    desc: "12-variable scoring: GMP status, COA completeness, HPLC purity standards, endotoxin testing, NTA particle sizing, cold-chain infrastructure, and real buyer feedback. No supplier enters the network on reputation alone.",
  },
  {
    num: "02",
    title: "BioChain SPY Index",
    desc: "Live market pricing across our vetted manufacturer network - per milligram, per vial, per million particles. What comparable buyers actually paid, updated from closed transactions.",
  },
  {
    num: "03",
    title: "Provenance & Chain-of-Custody",
    desc: "Every order ships with verified documentation: donor tissue consent records, lot traceability, third-party lab reports, and customs compliance paperwork.",
  },
  {
    num: "04",
    title: "Negotiation & Contract Architecture",
    desc: "Volume pricing, exclusivity windows, quality-guarantee clauses, and reorder SLAs negotiated on your behalf - structured to protect you as you scale.",
  },
];

const blogPosts = [
  {
    tag: "Regenerative Medicine",
    title: "Peptides, Ibogaine, and the Healing Economy",
    excerpt:
      "Essays on plant medicine, ibogaine therapy, and why the healing economy demands a different kind of supply chain intelligence.",
    href: "https://tonygreenberg.com/blog",
    img: "/biochain/blog-regenerative-medicine.jpg",
  },
  {
    tag: "Human OS 2.0",
    title: "Biohacking, Biomarkers, and the Longevity Protocol",
    excerpt:
      "The personal operating system for health and longevity that informs every BioChain sourcing decision.",
    href: "https://tonygreenberg.com/humanos",
    img: "/biochain/blog-humanos.jpg",
  },
  {
    tag: "Plant Medicine",
    title: "Psychedelic Readiness Index",
    excerpt:
      "A framework for assessing readiness for plant medicine - and why sourcing the compounds matters as much as the protocol.",
    href: "https://tonygreenberg.com/psychedelic-readiness-index",
    img: "/biochain/blog-psychedelic-readiness.jpg",
  },
  {
    tag: "Conscious Capital",
    title: "A Living Declaration: Regenerative vs. Extractive",
    excerpt:
      "Why regenerative vs. extractive is the defining business choice of the next decade - and how BioChain takes a side.",
    href: "https://tonygreenberg.com/living-declaration",
    img: "/biochain/blog-living-declaration.jpg",
  },
];

const testimonials = [
  {
    quote:
      "RampRate's sourcing methodology gave us confidence we had never had with our peptide suppliers. They found us a cGMP manufacturer with better documentation - and we stopped guessing about what was in the vial.",
    attr: "Director of Operations · Longevity Clinic",
  },
  {
    quote:
      "We had no idea our exosome supplier's particle counts were off. RampRate's vendor audit caught it before we used the product clinically.",
    attr: "Founder · Regenerative Medicine Practice",
  },
  {
    quote:
      "The same rigor they brought to our data center negotiation, they brought to our biologics supply chain. Different industry. Same intelligence engine.",
    attr: "VP Operations · BioTech Brand",
  },
];

function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.07 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(20px)",
        transition: "opacity .55s ease, transform .55s ease",
      }}
    >
      {children}
    </div>
  );
}

export default function BioChainSourcingPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <main>
      {/* Hero */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{ background: "var(--dark)" }}
      >
        <div className="glass-orb glass-orb-amber w-[400px] h-[400px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-rust w-[280px] h-[280px] bottom-0 -left-32" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
              style={{ color: gold, fontFamily: "var(--font-body)" }}
            >
              BioChain Sourcing - Regenerative &amp; Healing Industries
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              We Source What <span style={{ color: gold }}>Heals</span> - With
              the Same Rigor We Apply to Billion-Dollar IT Deals
            </h1>
            <p
              className="text-white/70 text-lg leading-relaxed mb-10"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Peptides. Exosomes. Stem cells. NAD+. RampRate&apos;s 24-year
              procurement intelligence engine now serves the healing economy -
              verified provenance, benchmarked quality, and disclosed pricing on
              every transaction.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold text-white transition-all shadow-lg"
                style={{ background: gold, fontFamily: "var(--font-body)" }}
              >
                Request a Sourcing Audit
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
              <a
                href="#products"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-all"
                style={{ fontFamily: "var(--font-body)" }}
              >
                See What We Source
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[
                { value: "$10B+", label: "Transactions Architected" },
                { value: "300+", label: "Vetted Bio Vendors" },
                { value: "COA", label: "Verified Every Order" },
                { value: "24 yrs", label: "Sourcing Intelligence" },
                { value: "300%+", label: "ROI Guarantee" },
              ].map((stat, i) => (
                <Reveal key={stat.label} className={i === 4 ? "col-span-2 sm:col-span-1" : ""}>
                  <div className="glass-card p-4">
                    <div
                      className="text-xl font-bold mb-1"
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
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Source intro */}
      <section
        className="relative section-warm overflow-hidden py-20 sm:py-28"
        id="products"
      >
        <div className="glass-orb glass-orb-amber w-[300px] h-[300px] -bottom-32 -right-32" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ color: gold, fontFamily: "var(--font-body)" }}
          >
            What We Source
          </span>
          <h2
            className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Every Category - Benchmarked, Verified, and Ready to Source
          </h2>
          <p
            className="mt-6 text-base leading-relaxed max-w-3xl"
            style={{
              color: "oklch(0.4 0.02 50)",
              fontFamily: "var(--font-body)",
            }}
          >
            Street prices reflect what clinics and brands currently pay through
            retail channels. RampRate benchmarked pricing reflects what
            comparable buyers paid in closed transactions over the last 90 days
            - documented, auditable, and negotiated on your behalf.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="relative section-light overflow-hidden py-20 sm:py-28">
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <Reveal key={p.slug}>
              <div
                className="rounded-xl p-7 border border-black/5 flex flex-col h-full"
                style={{ background: "oklch(0.97 0.01 80)" }}
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center mb-5"
                  style={{ background: goldBg, color: gold }}
                >
                  {productIcons[p.slug]}
                </div>
                <h3
                  className="text-lg font-bold mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {p.title}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-3 flex-1"
                  style={{
                    color: "oklch(0.45 0.02 50)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {p.desc}
                </p>
                <div
                  className="text-xs uppercase tracking-wider mb-4"
                  style={{ color: gold, fontFamily: "var(--font-mono)" }}
                >
                  {p.meta}
                </div>
                <div
                  className="rounded-lg border p-4 mb-4"
                  style={{
                    borderColor: "oklch(0.9 0.01 80)",
                    background: "#fff",
                  }}
                >
                  <div className="flex justify-between items-baseline gap-2 mb-1">
                    <span
                      className="text-xs uppercase tracking-wider"
                      style={{
                        color: "oklch(0.55 0.02 50)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      Street
                    </span>
                    <span
                      className="text-sm font-semibold line-through"
                      style={{
                        color: "oklch(0.5 0.02 50)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {p.street}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline gap-2">
                    <span
                      className="text-xs uppercase tracking-wider"
                      style={{
                        color: "oklch(0.55 0.02 50)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      RampRate
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: gold, fontFamily: "var(--font-body)" }}
                    >
                      {p.rr}
                    </span>
                  </div>
                  <div
                    className="mt-2 inline-block text-xs font-semibold px-2 py-0.5 rounded"
                    style={{
                      background: "oklch(0.6 0.14 150 / 0.12)",
                      color: "oklch(0.45 0.14 150)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {p.save}
                  </div>
                </div>
                {p.links.length > 0 && (
                  <div className="flex flex-col gap-1.5 mb-4">
                    {p.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs"
                        style={{
                          color: "oklch(0.5 0.18 250)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        → {l.label}
                      </a>
                    ))}
                  </div>
                )}
                <Link
                  href="/contact"
                  className="text-center text-sm font-bold px-4 py-3.5 rounded-md transition-colors"
                  style={{
                    background: goldBg,
                    color: gold,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Source {p.title} with RampRate →
                </Link>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Price-to-Value Table */}
      <section
        className="relative section-warm overflow-hidden py-20 sm:py-28"
        id="value-table"
      >
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ color: gold, fontFamily: "var(--font-body)" }}
          >
            Price-to-Value Comparison
          </span>
          <h2
            className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            What the Market Charges vs. What You Should Pay
          </h2>
          <p
            className="mt-6 text-base leading-relaxed max-w-3xl mb-10"
            style={{
              color: "oklch(0.4 0.02 50)",
              fontFamily: "var(--font-body)",
            }}
          >
            Based on BioChain SPY Index closed transaction data from the last 90
            days. Quality-adjusted only - if the cheaper option has inferior
            documentation, it is not the benchmark.
          </p>
          <Reveal>
            <div
              className="overflow-x-auto rounded-xl border"
              style={{ borderColor: "oklch(0.88 0.01 80)", background: "#fff" }}
            >
            <table
              className="w-full text-sm"
              style={{ borderCollapse: "collapse", minWidth: 640 }}
            >
              <thead>
                <tr
                  className="border-b-2"
                  style={{ borderColor: "oklch(0.9 0.01 80)" }}
                >
                  {[
                    "Product",
                    "Street Price",
                    "RampRate Benchmark",
                    "Typical Saving",
                    "What Else You Get",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wide"
                      style={{
                        color: "oklch(0.5 0.02 50)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    product: "BPC-157 · 5mg vial",
                    street: "$35–$75/vial",
                    rr: "$12–$22/vial",
                    save: "38–65%",
                    extra:
                      "HPLC purity report, lot traceability, cold-chain SLA",
                  },
                  {
                    product: "TB-500 · 5mg vial",
                    street: "$40–$80/vial",
                    rr: "$14–$26/vial",
                    save: "45–68%",
                    extra:
                      "Mass spec, sequence confirmation, research-use docs",
                  },
                  {
                    product: "Semaglutide analog · 10mg research",
                    street: "$280–$650/unit",
                    rr: "$95–$195/unit",
                    save: "45–70%",
                    extra:
                      "Synthesis pathway confirmation, import compliance docs",
                  },
                  {
                    product: "MSC Exosomes · 1B particles",
                    street: "$800–$3,500/vial",
                    rr: "$420–$1,200/vial",
                    save: "30–55%",
                    extra:
                      "NTA particle sizing, endotoxin test, donor consent docs",
                  },
                  {
                    product: "Umbilical Cord MSCs · 5M cells",
                    street: "$2,000–$8,000/unit",
                    rr: "$1,100–$3,800/unit",
                    save: "25–50%",
                    extra:
                      "Viability guarantee, cryopreservation SLA, full donor chain",
                  },
                  {
                    product: "NMN pharmaceutical grade · 1kg",
                    street: "$4,000–$9,000/kg",
                    rr: "$1,800–$3,200/kg",
                    save: "40–60%",
                    extra: "HPLC purity ≥99%, heavy metals testing",
                  },
                  {
                    product: "NAD+ IV Drip Kit · clinic-grade",
                    street: "$180–$380/kit",
                    rr: "$80–$140/kit",
                    save: "45–63%",
                    extra:
                      "Medical-device-grade consumables, unified supply chain",
                  },
                  {
                    product: "Full BioChain Advisory · ongoing",
                    street: "Standard retainer",
                    rr: "Performance fee on savings only",
                    save: "300%+ ROI",
                    extra:
                      "SPY Index access, vendor negotiation, contract architecture",
                  },
                ].map((row, i, arr) => (
                  <tr
                    key={row.product}
                    className={i < arr.length - 1 ? "border-b" : ""}
                    style={{ borderColor: "oklch(0.93 0.01 80)" }}
                  >
                    <td
                      className="px-5 py-4 font-bold align-top"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {row.product}
                    </td>
                    <td
                      className="px-5 py-4 align-top"
                      style={{
                        color: "oklch(0.45 0.02 50)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {row.street}
                    </td>
                    <td
                      className="px-5 py-4 align-top font-semibold"
                      style={{ color: gold, fontFamily: "var(--font-body)" }}
                    >
                      {row.rr}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded"
                        style={{
                          background: "oklch(0.6 0.14 150 / 0.12)",
                          color: "oklch(0.45 0.14 150)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {row.save}
                      </span>
                    </td>
                    <td
                      className="px-5 py-4 align-top"
                      style={{
                        color: "oklch(0.45 0.02 50)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {row.extra}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </Reveal>
          <p
            className="mt-4 text-xs"
            style={{
              color: "oklch(0.55 0.02 50)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Indicative pricing based on BioChain SPY Index closed transaction
            data. Actual pricing varies by volume, specification, and geography.
            Contact RampRate for a formal audit against your current invoices.
          </p>
        </div>
      </section>

      {/* Process */}
      <section
        className="relative section-dark overflow-hidden py-20 sm:py-28"
        id="how-it-works"
      >
        <div className="glass-orb glass-orb-amber w-[350px] h-[350px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-rust w-[200px] h-[200px] bottom-20 -left-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ color: gold, fontFamily: "var(--font-body)" }}
          >
            BioChain Process
          </span>
          <h2
            className="mt-4 text-3xl sm:text-4xl font-bold text-white max-w-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Supply Chain Intelligence Built for Biology
          </h2>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step) => (
              <Reveal key={step.num}>
                <div
                  className="rounded-xl p-6 border border-white/10 h-full"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <span
                    className="text-xs font-semibold tracking-wider"
                    style={{ color: gold, fontFamily: "var(--font-mono)" }}
                  >
                    {step.num}
                  </span>
                  <h3
                    className="mt-3 text-lg font-bold text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="mt-3 text-sm leading-relaxed text-white/60"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Rail */}
      <section
        className="relative section-warm overflow-hidden py-20 sm:py-28"
        id="blog"
      >
        <div className="glass-orb glass-orb-amber w-[300px] h-[300px] -bottom-32 -right-32" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ color: gold, fontFamily: "var(--font-body)" }}
          >
            From tonygreenberg.com
          </span>
          <h2
            className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The Thinking Behind the Supply Chain
          </h2>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogPosts.map((post) => (
              <Reveal key={post.href}>
                <a
                  href={post.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full rounded-xl overflow-hidden border border-black/5 bg-white hover:shadow-md transition-shadow"
                >
                  <div className="relative w-full h-40 bg-black/5">
                    <Image
                      src={post.img}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                  <span
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: gold, fontFamily: "var(--font-mono)" }}
                  >
                    {post.tag}
                  </span>
                  <h3
                    className="mt-3 text-base font-bold leading-snug"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {post.title}
                  </h3>
                  <p
                    className="mt-3 text-sm leading-relaxed"
                    style={{
                      color: "oklch(0.45 0.02 50)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {post.excerpt}
                  </p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
          <div className="text-center mt-12">
            <a
              href="https://tonygreenberg.com/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold border-2 transition-all"
              style={{ borderColor: "oklch(0.8 0.02 80)", fontFamily: "var(--font-body)" }}
            >
              Read All Essays at tonygreenberg.com →
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="relative section-light overflow-hidden py-20 sm:py-28"
        id="faq"
      >
        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8">
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ color: gold, fontFamily: "var(--font-body)" }}
          >
            What We Hear Every Week
          </span>
          <h2
            className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The Questions Clinic Directors Ask First
          </h2>
          <div className="mt-10">
            {faqs.map((f) => (
              <div
                key={f.num}
                className="border-b"
                style={{ borderColor: "oklch(0.9 0.01 80)" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === f.num ? null : f.num)}
                  className="w-full flex items-start gap-4 py-6 text-left"
                >
                  <span
                    className="text-xs font-semibold pt-0.5"
                    style={{ color: gold, fontFamily: "var(--font-mono)" }}
                  >
                    {f.num}
                  </span>
                  <span
                    className="flex-1 text-base font-bold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {f.question}
                  </span>
                  <span
                    className="text-xl font-bold shrink-0 transition-transform"
                    style={{
                      color: gold,
                      transform: openFaq === f.num ? "rotate(45deg)" : "none",
                    }}
                  >
                    +
                  </span>
                </button>
                {openFaq === f.num && (
                  <p
                    className="pb-6 pl-8 text-sm leading-relaxed"
                    style={{
                      color: "oklch(0.45 0.02 50)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {f.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ImpactSoul cross-link */}
      <section
        className="relative section-warm overflow-hidden py-20 sm:py-28"
        id="impactsoul"
      >
        <div className="glass-orb glass-orb-rust w-[300px] h-[300px] -bottom-32 -right-32" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ color: gold, fontFamily: "var(--font-body)" }}
          >
            ImpactSoul Connection
          </span>
          <h2
            className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Regenerative Capital Meets Regenerative Medicine
          </h2>
          <p
            className="mt-6 text-base leading-relaxed max-w-2xl mb-8"
            style={{
              color: "oklch(0.4 0.02 50)",
              fontFamily: "var(--font-body)",
            }}
          >
            BioChain Sourcing is the supply chain infrastructure for what
            ImpactSoul builds on the capital side. Verified, ethically sourced
            supply chains are the trust layer that connects regenerative
            medicine providers to impact-aligned capital.
          </p>
          <Link
            href="/impactsoul"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold text-white transition-all shadow-lg"
            style={{ background: gold, fontFamily: "var(--font-body)" }}
          >
            Explore ImpactSoul
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
        </div>
      </section>

      {/* Testimonials */}
      <section
        className="relative section-light overflow-hidden py-20 sm:py-28 border-y"
        style={{ background: "oklch(0.96 0.015 80)", borderColor: "oklch(0.9 0.01 80)" }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: gold, fontFamily: "var(--font-body)" }}
            >
              Client Results
            </span>
            <h2
              className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              What Clinics and Practices Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Reveal key={t.attr}>
                <div
                  className="rounded-xl p-7 border h-full bg-white"
                  style={{ borderColor: "oklch(0.9 0.01 80)" }}
                >
                  <div
                    className="text-sm mb-3 tracking-wider"
                    style={{ color: gold }}
                    aria-hidden="true"
                  >
                    ★★★★★
                  </div>
                  <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div
                    className="text-xs uppercase tracking-wider"
                    style={{
                      color: "oklch(0.55 0.02 50)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {t.attr}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Guarantee */}
      <section className="py-16 sm:py-20" style={{ background: gold }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            300%+ ROI or You Don&apos;t Pay
          </h2>
          <p
            className="text-white/85 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            The sourcing audit is always free. If we don&apos;t deliver 300%+
            ROI on our BioChain sourcing engagements, you don&apos;t pay.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold bg-white hover:bg-white/90 transition-all shadow-lg"
            style={{ color: gold, fontFamily: "var(--font-body)" }}
          >
            Start a Sourcing Conversation
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
        </div>
      </section>
    </main>
  );
}
