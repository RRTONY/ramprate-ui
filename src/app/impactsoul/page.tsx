import Link from "next/link";
import type { Metadata } from "next";
import { getPageSeo, withSeoOverrides } from "@/lib/content/seo";
import JsonLd, {
  serviceJsonLd,
  breadcrumbJsonLd,
} from "@/components/shared/JsonLd";

const FALLBACK_METADATA: Metadata = {
  title: "ImpactSol - Tokenize Assets to Rally Impact Movements",
  description:
    "Turn cultural treasures and purpose into powerful economic engines. For NGOs & Stewards of Art & Artifacts.",
  keywords: [
    "impact consulting",
    "ESG advisory",
    "B Corp certification",
    "asset tokenization",
    "NGO advisory",
    "regenerative consulting",
  ],
  alternates: { canonical: "/impactsoul" },
  openGraph: {
    title: "ImpactSol - Tokenize Assets to Rally Impact Movements",
    description:
      "Turn cultural treasures and purpose into powerful economic engines. For NGOs & Stewards of Art & Artifacts.",
    url: "https://ramprate.com/impactsoul",
    type: "website",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ImpactSol - Tokenize Assets to Rally Impact Movements",
    description:
      "Turn cultural treasures and purpose into powerful economic engines. For NGOs & Stewards of Art & Artifacts.",
    images: ["/og.png"],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageSeo("/impactsoul");
  return withSeoOverrides(FALLBACK_METADATA, data?.seo);
}

const services = [
  {
    title: "Tokenize Assets",
    desc: "Turn cultural treasures, art, artifacts, and purpose-driven assets into powerful economic engines through tokenization - creating new revenue streams and global accessibility.",
  },
  {
    title: "Rally Impact Movements",
    desc: "Build communities around your cause. We design engagement models that turn passive supporters into active participants and economic stakeholders.",
  },
  {
    title: "3× Revenue, Up to 10× Value",
    desc: "Our models are designed to multiply - not just sustain. We create economic structures where impact drives revenue and revenue amplifies impact.",
  },
  {
    title: "Global Brand Building",
    desc: "Transform your organization from a local operation into a globally recognized brand. At worst you get a fan club - at peak, a global movement.",
  },
  {
    title: "Art & Cultural Stewardship",
    desc: "Specialized advisory for NGOs and stewards of art and artifacts. We help you preserve, protect, and monetize cultural heritage through modern technology.",
  },
  {
    title: "Community-Driven Economics",
    desc: "Design token economies and community structures where every participant has skin in the game - aligning incentives from donors to operators to beneficiaries.",
  },
];

const dnaSteps = [
  {
    num: "01",
    title: "Discover",
    desc: "Engage team, clients, partners, investors, community. Map impact priorities. Identify conflicts between stated values and actual practices.",
    color: "oklch(0.55 0.15 30)",
  },
  {
    num: "02",
    title: "Diagnose",
    desc: "Find disconnects between vision and actions. Deep focus on supply chain and external perception. Are we aligned? Do we vote our values with our budget?",
    color: "oklch(0.50 0.12 40)",
  },
  {
    num: "03",
    title: "Realign",
    desc: "Build better teams. Buy from shared-values partners. Uplift unheard voices. Create structures where impact and revenue reinforce each other.",
    color: "oklch(0.45 0.10 50)",
  },
];

const dnaOutcomes = [
  "Better talent attracted",
  "Investor goals aligned",
  "Brand equity improved",
  "Morale & retention increased",
  "Closer partnerships",
  "Feel good about work every day",
];

const relatedPosts = [
  {
    title: "Energy as Impact",
    date: "August 15, 2023",
    url: "https://ramprate.com/energy-as-impact/",
    tag: "Energy",
  },
  {
    title: "Edge Data Center Provider Redivider Expands Advisory Board",
    date: "July 5, 2023",
    url: "https://ramprate.com/edge-data-center-provider-redivider-expands-advisory/",
    tag: "Advisory",
  },
];

const serviceIcons = [
  <svg
    key="gem"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="oklch(0.55 0.15 30)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="6 3 18 3 22 9 12 22 2 9" />
    <line x1="2" y1="9" x2="22" y2="9" />
    <line x1="12" y1="3" x2="12" y2="22" />
    <line x1="6" y1="3" x2="2" y2="9" />
    <line x1="18" y1="3" x2="22" y2="9" />
  </svg>,
  <svg
    key="heart"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="oklch(0.55 0.15 30)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>,
  <svg
    key="trend"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="oklch(0.55 0.15 30)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>,
  <svg
    key="globe"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="oklch(0.55 0.15 30)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>,
  <svg
    key="palette"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="oklch(0.55 0.15 30)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="13.5" cy="6.5" r=".5" />
    <circle cx="17.5" cy="10.5" r=".5" />
    <circle cx="8.5" cy="7.5" r=".5" />
    <circle cx="6.5" cy="12.5" r=".5" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>,
  <svg
    key="users"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="oklch(0.55 0.15 30)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>,
];

const dnaIcons = [
  <svg
    key="search"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>,
  <svg
    key="steth"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3" />
    <path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-6v-4" />
    <circle cx="20" cy="10" r="2" />
  </svg>,
  <svg
    key="refresh"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>,
];

export default function ImpactSoulPage() {
  return (
    <main className="rr-impactsol">
      <JsonLd
        data={serviceJsonLd({
          name: "ImpactSol",
          description:
            "Tokenize cultural treasures and purpose-driven assets to rally impact movements, for NGOs and stewards of art and artifacts.",
          url: "https://ramprate.com/impactsoul",
          serviceType: "Impact and regenerative consulting",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "ImpactSol", url: "https://ramprate.com/impactsoul" },
        ])}
      />
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--dark)] pt-32 pb-20">
        <div className="glass-orb glass-orb-rust w-[400px] h-[400px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-amber w-[300px] h-[300px] bottom-0 -left-32" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <span className="mb-4 block text-xs font-body font-semibold uppercase tracking-[0.2em] text-[oklch(0.82_0.15_75)]">
              ImpactSol - Since 2024
            </span>
            <h1 className="mb-6 text-4xl font-display font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Tokenize Assets to Rally{" "}
              <span style={{ color: "var(--impactsol-accent)" }}>
                Impact Movements
              </span>
            </h1>
            <p className="mb-10 text-lg font-body leading-relaxed text-white/70">
              Turn cultural treasures and purpose into powerful economic
              engines. For NGOs & Stewards of Art & Artifacts.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: "Since", label: "2024" },
                { value: "For", label: "NGOs & Stewards of Art & Artifacts" },
                { value: "Comp", label: "7.5% of asset equity to launch" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-4">
                  <div className="mb-1 text-xl font-display font-bold text-[oklch(0.82_0.15_75)]">
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

      {/* What is ImpactSoul */}
      <section className="relative section-warm overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-rust w-[300px] h-[300px] -bottom-32 -right-32" />
        <div className="glass-orb glass-orb-amber w-[180px] h-[180px] top-10 -left-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <span className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-[oklch(0.55_0.15_30)]">
            The Mission
          </span>
          <h2 className="mt-4 text-3xl font-display font-bold tracking-tight sm:text-4xl">
            Millions for Impact. 3× Revenue. Up to 10× Value.
          </h2>
          <div className="mt-8 space-y-5 text-base font-body leading-relaxed text-[oklch(0.4_0.02_50)]">
            <p>
              ImpactSoul exists at the intersection of purpose and economics. We
              help NGOs, cultural institutions, and impact-driven organizations
              transform their assets - art, artifacts, cultural heritage,
              environmental stewardship - into sustainable economic engines.
            </p>
            <p>
              Through tokenization, community building, and modern fundraising
              models, we create structures where doing good isn&apos;t just
              morally right - it&apos;s economically powerful. Impact and
              revenue aren&apos;t trade-offs - they&apos;re multipliers.
            </p>
          </div>
        </div>
      </section>

      {/* Impact DNA™ */}
      <section className="relative section-light overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-amber w-[280px] h-[280px] -bottom-32 -left-32" />
        <div className="glass-orb glass-orb-rust w-[160px] h-[160px] top-20 -right-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-[oklch(0.55_0.15_30)]">
              Syzygy Methodology
            </span>
            <h2 className="mt-4 text-3xl font-display font-bold tracking-tight sm:text-4xl">
              Impact DNA™
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base font-body leading-relaxed text-[oklch(0.45_0.02_50)]">
              A three-step process to align your organization&apos;s values with
              its actions - and turn that alignment into economic advantage.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {dnaSteps.map((step, i) => (
              <div
                key={step.num}
                className="bg-white rounded-xl p-7 border border-black/5 relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 text-5xl font-mono font-black text-black/[0.04]">
                  {step.num}
                </div>
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center mb-5"
                  style={{
                    background: `${step.color.replace("oklch(", "oklch(").replace(")", " / 0.1)")}`,
                  }}
                >
                  <span style={{ color: step.color }}>{dnaIcons[i]}</span>
                </div>
                <h3 className="mb-3 text-xl font-display font-bold">
                  {step.title}
                </h3>
                <p className="text-sm font-body leading-relaxed text-[oklch(0.45_0.02_50)]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-black/5 bg-[oklch(0.97_0.01_80)] p-8">
            <h3 className="mb-5 text-lg font-display font-bold">Outcomes</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {dnaOutcomes.map((outcome) => (
                <div key={outcome} className="flex items-center gap-3">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="oklch(0.55 0.15 30)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0"
                  >
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className="text-sm font-body text-[oklch(0.4_0.02_50)]">
                    {outcome}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* B Corp */}
      <section className="relative section-warm overflow-hidden py-16 sm:py-20">
        <div className="glass-orb glass-orb-rust w-[300px] h-[300px] -bottom-32 -right-32" />
        <div className="glass-orb glass-orb-amber w-[180px] h-[180px] top-10 -left-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-black/5 flex flex-col sm:flex-row items-center gap-8">
            <div
              className="w-20 h-20 shrink-0 rounded-full border-4 flex items-center justify-center"
              style={{ borderColor: "oklch(0.55 0.15 30)" }}
            >
              <span className="text-3xl font-display font-bold text-[oklch(0.55_0.15_30)]">
                B
              </span>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-display font-bold">
                Certified B Corporation
              </h3>
              <p className="text-sm font-body leading-relaxed text-[oklch(0.45_0.02_50)]">
                RampRate is a Certified B Corp - meeting the highest standards
                of verified social and environmental performance, public
                transparency, and legal accountability. We don&apos;t just
                advise on impact - we live it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative section-light overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-amber w-[280px] h-[280px] -bottom-32 -left-32" />
        <div className="glass-orb glass-orb-rust w-[160px] h-[160px] top-20 -right-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-display font-bold tracking-tight sm:text-4xl">
              How We Create{" "}
              <span style={{ color: "oklch(0.55 0.15 30)" }}>Impact</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div
                key={s.title}
                className="rounded-xl border border-black/5 bg-[oklch(0.97_0.01_80)] p-7 transition-shadow hover:shadow-md"
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center mb-5"
                  style={{ background: "oklch(0.55 0.15 30 / 0.1)" }}
                >
                  {serviceIcons[i]}
                </div>
                <h3 className="mb-3 text-lg font-display font-bold">
                  {s.title}
                </h3>
                <p className="text-sm font-body leading-relaxed text-[oklch(0.45_0.02_50)]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="relative section-dark overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-blue w-[350px] h-[350px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-amber w-[200px] h-[200px] bottom-20 -left-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center">
          <span className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-[oklch(0.55_0.15_30)]">
            Our Commitment
          </span>
          <h2 className="mt-4 text-3xl font-display font-bold text-white sm:text-4xl">
            A Fan Club at Worst. A Global Brand at Peak.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-body leading-relaxed text-white/60">
            7.5% of asset equity to launch a movement. We don&apos;t charge
            upfront - we invest alongside you and earn when you succeed.
          </p>
          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            {[
              {
                label: "Compensation",
                value: "7.5% of asset equity to launch a movement",
              },
              {
                label: "Commitment",
                value: "A fan club at worst; a global brand at peak",
              },
              {
                label: "Key Value",
                value: "Millions for impact · 3× revenue · up to 10× value",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-6 border border-white/10"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <div className="mb-2 text-xs font-body uppercase tracking-wider text-white/40">
                  {item.label}
                </div>
                <div className="text-sm font-body leading-relaxed text-white/80">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Blog Posts */}
      <section className="relative section-warm overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-rust w-[300px] h-[300px] -bottom-32 -right-32" />
        <div className="glass-orb glass-orb-amber w-[180px] h-[180px] top-10 -left-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <h2 className="mb-10 text-3xl font-display font-bold sm:text-4xl">
            Impact{" "}
            <span style={{ color: "oklch(0.55 0.15 30)" }}>Insights</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedPosts.map((post) => (
              <a
                key={post.title}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl p-7 border border-black/5 hover:shadow-md transition-shadow group"
              >
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: "oklch(0.55 0.15 30 / 0.1)",
                    color: "oklch(0.55 0.15 30)",
                  }}
                >
                  {post.tag}
                </span>
                <h3 className="mt-3 text-lg font-display font-bold tracking-tight transition-colors">
                  {post.title}
                </h3>
                <div className="mt-2 text-xs font-body text-[oklch(0.5_0.02_50)]">
                  {post.date}
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-body font-semibold text-[oklch(0.55_0.15_30)]">
                  Read on ramprate.com
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rr-public-cta py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="mb-4 text-3xl font-display font-bold text-white sm:text-4xl">
            Trust Us With What You Hate to Do
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base font-body leading-relaxed text-white/80 sm:text-lg">
            And focus on the change you want to create in the world.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-white px-7 py-3.5 text-sm font-body font-semibold transition-all shadow-lg hover:bg-white/90"
              style={{
                color: "var(--rr-navy)",
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
              Flow Circuit
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
