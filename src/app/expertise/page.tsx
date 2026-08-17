import Link from "next/link";
import type { Metadata } from "next";
import JsonLd, {
  serviceJsonLd,
  breadcrumbJsonLd,
} from "@/components/shared/JsonLd";
import { getPageSeo, withSeoOverrides } from "@/lib/sanity/seo";

const FALLBACK_METADATA: Metadata = {
  title: "Expertise",
  description:
    "Five practices. One mission: transparency, skin in the game, and principals who execute.",
  keywords: [
    "RampRate practices",
    "enterprise IT sourcing",
    "growth strategy advisory",
    "Web3 blockchain advisory",
    "impact consulting",
    "private advisory",
    "dispute resolution advisory",
  ],
  alternates: { canonical: "/expertise" },
  openGraph: {
    title: "Expertise",
    description:
      "Five practices. One mission: transparency, skin in the game, and principals who execute.",
    url: "https://ramprate.com/expertise",
    type: "website",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Expertise",
    description:
      "Five practices. One mission: transparency, skin in the game, and principals who execute.",
    images: ["/og.png"],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageSeo("/expertise");
  return withSeoOverrides(FALLBACK_METADATA, data?.seo);
}

const practices = [
  {
    name: "RampRate",
    tagline: "Enterprise IT Sourcing",
    desc: "150K+ data points. 350+ suppliers. 80 countries. We benchmark every contract against real transaction intelligence - not theory. $10B+ in enterprise decisions transacted.",
    color: "oklch(0.82 0.15 75)",
    href: "/sourcing",
    stats: ["$10B+ Transacted", "150K+ Data Points", "350+ Suppliers"],
  },
  {
    name: "Syzygy",
    tagline: "Growth Strategy for Founders",
    desc: "GTM acceleration, revenue architecture, and strategic introductions for growth-stage companies. We don't advise from the sidelines - we execute with you daily.",
    color: "oklch(0.65 0.2 150)",
    href: "/growth",
    stats: ["99% Intro-to-Contract", "4+ Year Engagements", "US Market Entry"],
  },
  {
    name: "Stratum",
    tagline: "Web3 & Blockchain Advisory",
    desc: "Token design, DAO governance, decentralized infrastructure. From protocol architecture to enterprise adoption - we bridge Web3 and the Fortune 500.",
    color: "oklch(0.6 0.2 280)",
    href: "/web3",
    stats: ["Token Design", "DAO Governance", "Enterprise Web3"],
  },
  {
    name: "ImpactSoul",
    tagline: "Impact & Regenerative Consulting",
    desc: "ESG strategy, B Corp certification, grant management, and asset tokenization for regenerative projects. Technology as a delivery mechanism for social and environmental impact.",
    color: "oklch(0.7 0.15 30)",
    href: "/impactsoul",
    stats: ["B Corp Certified", "$3M+ Grants", "Regenerative Focus"],
  },
  {
    name: "Private Advisory",
    tagline: "Because Some Challenges Require More Than an Advisor",
    desc: "Sourcing and coordinating the legal and financial specialists high-stakes disputes require - equity disputes, stalled claims, discovery windfalls, and asset protection. 25 years and $10B+ in enterprise decisions.",
    color: "oklch(0.52 0.12 70)",
    href: "/private-advisory",
    stats: ["25 Years", "$10B+ Advised", "B Corp Certified"],
  },
];

export default function ExpertisePage() {
  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: "RampRate Advisory Practices",
          description:
            "Enterprise IT sourcing, growth strategy, Web3 advisory, impact consulting, and private advisory - independent advisory with transparency, skin in the game, and principals who execute.",
          url: "https://ramprate.com/expertise",
          serviceType: "IT and business advisory",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Expertise", url: "https://ramprate.com/expertise" },
        ])}
      />
      {/* Hero */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden bg-[linear-gradient(135deg,oklch(0.14_0.01_250)_0%,oklch(0.18_0.02_260)_50%,oklch(0.14_0.01_250)_100%)]">
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          {/* Label */}
          <div className="mb-6">
            <span className="font-body inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.6_0.2_280)]" />
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
                Our Practices
              </span>
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white max-w-4xl">
            Five Brands.{" "}
            <span className="text-amber">One Mission.</span>
          </h1>

          <p className="font-body mt-6 text-base sm:text-lg leading-relaxed max-w-2xl text-white/50">
            Each practice serves a different market with the same values:
            transparency, skin in the game, and principals who execute.
          </p>
        </div>
      </section>

      {/* Practice Cards */}
      <section className="py-24 bg-[#0d1117]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-12">
          {practices.map((p) => (
            <div
              key={p.name}
              className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/2"
            >
              {/* Colored left border accent */}
              <div
                className="absolute top-0 left-0 w-1 h-full"
                style={{ backgroundColor: p.color }}
              />

              <div className="p-8 sm:p-10">
                {/* Tagline */}
                <p
                  className="font-mono text-xs uppercase mb-2 tracking-[0.2em]"
                  style={{ color: p.color }}
                >
                  {p.tagline}
                </p>

                {/* Name */}
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
                  {p.name}
                </h2>

                {/* Description */}
                <p className="font-body leading-relaxed max-w-2xl mb-6 text-white/60">
                  {p.desc}
                </p>

                {/* Stats pills */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {p.stats.map((s) => (
                    <span
                      key={s}
                      className="font-mono px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{
                        border: `1px solid color-mix(in oklch, ${p.color} 30%, transparent)`,
                        color: p.color,
                        backgroundColor: `color-mix(in oklch, ${p.color} 8%, transparent)`,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={p.href}
                  className="font-body inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold transition-all hover:brightness-110 text-[oklch(0.15_0.02_75)]"
                  style={{ backgroundColor: p.color }}
                >
                  Learn More
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
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#0a0f1a]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">
            Not Sure Which Practice Fits?
          </h2>
          <p className="font-body mb-10 max-w-xl mx-auto text-white/60">
            Tell us what&apos;s broken. We&apos;ll figure out which team - or
            combination - gets it done.
          </p>
          <Link
            href="/contact"
            className="font-body inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-bold transition-all hover:brightness-110 bg-amber text-[oklch(0.15_0.02_75)]"
            style={{
              boxShadow: "0 8px 32px color-mix(in oklch, oklch(0.82 0.15 75) 20%, transparent)",
            }}
          >
            Tell Us What&apos;s Broken
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
        </div>
      </section>
    </>
  );
}
