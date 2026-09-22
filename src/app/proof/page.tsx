import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "@/lib/sanity/client";
import { clientLogosQuery } from "@/lib/sanity/queries";
import { getPageSeo, withSeoOverrides } from "@/lib/sanity/seo";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

interface SanityLogo {
  _id: string;
  name: string;
  url: string | null;
  logoUrl: string | null;
}

const TITLE = "Proof of Judgment Under Pressure | RampRate";
const DESCRIPTION =
  "RampRate proof: recent confidential use cases, measurable outcomes, client testimony and 25 years of solving high-stakes problems.";

const FALLBACK_METADATA: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "RampRate case studies",
    "client results",
    "critical issue management",
    "enterprise advisory results",
    "B Corp certified advisory",
  ],
  alternates: { canonical: "/proof" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://ramprate.com/proof",
    type: "website",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageSeo("/proof");
  return withSeoOverrides(FALLBACK_METADATA, data?.seo);
}

const STATS = [
  { value: "Since 2000", label: "Trusted through multiple market cycles" },
  { value: "$10B+", label: "Decisions transacted" },
  { value: "50+", label: "Countries reached" },
  { value: "115.6", label: "B Impact Score" },
];

const CASES = [
  {
    num: "01",
    image: "/proof/case-meridian.webp",
    alt: "Wild mountain streams pass through a hand-built lock into one calm channel.",
    title: "Meridian: stabilizing a digital-asset enterprise under pressure",
    link: null as { href: string; label: string; external?: boolean } | null,
    desc: "A fast-moving critical situation crossed governance, token economics, compliance, institutional relationships and stakeholder trust. RampRate assembled the decision structure, exposed the failure modes and mapped the people capable of changing the outcome.",
    tags: ["Confidential", "TORQUE", "Governance"],
    status:
      "Results to date: 20-person decision-maker map, governance findings, relationship activation and an active resolution workstream. Full case study will publish when permissions allow.",
  },
  {
    num: "02",
    image: "/proof/case-xprize.webp",
    alt: "Water is carefully distributed across seeds, prototypes and living projects on a worktable.",
    title: "XPRIZE and DEVxDAO: designing capital for breakthrough work",
    link: { href: "https://www.xprize.org/", label: "XPRIZE", external: true },
    desc: "Innovation funding can drown in fragmented review, opaque governance and grants that reward applications instead of outcomes. RampRate helped connect mission, community and funding architecture so capital could reach builders and measurable work.",
    tags: [
      "Public relationship",
      "Grant architecture",
      "Decentralized governance",
    ],
    status:
      "Public record: more than $3 million in grant funding managed, with the broader program described across RampRate and ImpactSoul's public history.",
  },
  {
    num: "03",
    image: "/proof/case-infrastructure.webp",
    alt: "Engineers integrate a mature bridge span into a larger working rail network.",
    title: "Confidential infrastructure company: building enterprise gravity",
    link: null,
    desc: "RampRate served as a long-term strategic advisor, investor and relationship activator, helping an ambitious infrastructure platform mature toward the institutional market. The company was later acquired. Confidentiality obligations prevent us from naming the business or disclosing the engagement details.",
    tags: ["Confidential", "Acquired", "Enterprise activation"],
    status:
      "What we can say: sustained strategic work helped strengthen the company's path to enterprise relevance and a successful acquisition outcome.",
  },
  {
    num: "04",
    image: "/proof/case-biochain.webp",
    alt: "A botanical source moves through a visible chain of inspection into a protected shipment.",
    title: "BioChain: building trust into regenerative-health supply chains",
    link: { href: "/biochain", label: "BioChain" },
    desc: "Peptides, APIs and clinical products move through fragmented markets where price is visible but provenance often is not. RampRate adapted its intelligence engine to qualification, documentation, chain of custody, cross-border supply and commercial fit.",
    tags: [
      "Live public practice",
      "Supplier intelligence",
      "Regenerative health",
    ],
    status:
      "Results to date: qualification framework, international supplier relationships, product pathways and a live reseller pilot. Additional client cases will publish as approvals clear.",
  },
  {
    num: "05",
    image: "/proof/case-torque.webp",
    alt: "Frayed ropes enter a rope-making machine and emerge as one load-bearing line.",
    title: "TORQUE: turning a legal crisis into recovery architecture",
    link: { href: "/torque", label: "TORQUE" },
    desc: "A high-value dispute required more than litigation. It required the right counsel, financial analysis, claims strategy, evidence discipline and aligned incentives. RampRate turned a fragmented problem into an accountable recovery program with senior coordination across every specialty.",
    tags: ["Confidential", "Critical issue management", "Recovery"],
    status:
      "Results to date: engagement signed, specialist architecture established and recovery economics aligned to outcome. Public case study will follow client and counsel approval.",
  },
  {
    num: "06",
    image: "/proof/case-impactsoul.webp",
    alt: "A circular watershed nourishes wetlands, orchards, workshops and homes before returning to the river.",
    title: "ImpactSoul: making regenerative value economically legible",
    link: {
      href: "https://impactsoul.is/",
      label: "ImpactSoul",
      external: true,
    },
    desc: "Impact work is often treated as a cost center or a donation request. ImpactSoul brings asset design, community economics, verifiable outcomes and RampRate's relationship engine together so purpose can attract capital without surrendering its soul.",
    tags: [
      "Live public platform",
      "Regenerative capital",
      "Asset-backed impact",
    ],
    status:
      "Results to date: public platform launched, partner ecosystem assembled and confidential asset and movement structures in development. Individual cases will publish as permissions clear.",
  },
];

const METHOD_STEPS = [
  {
    n: "01 / RESEARCH",
    title: "Find the real problem",
    desc: "Interview the people who know, interrogate the data, expose hidden incentives and separate the symptom from the leverage point.",
    image: "/proof/case-meridian.webp",
    alt: "Wild streams guided through a working lock into one navigable channel.",
  },
  {
    n: "02 / BLUEPRINT",
    title: "Design the path",
    desc: "Structure the economics, decision rights, partners, risk gates and sequence required to move without pretending uncertainty has disappeared.",
    image: "/proof/case-xprize.webp",
    alt: "Resources distributed deliberately across promising seeds and working prototypes.",
  },
  {
    n: "03 / ACTIVATE",
    title: "Move trusted people",
    desc: "Deploy relationships, specialists and senior judgment. The deliverable is not the deck. It is the changed trajectory.",
    image: "/proof/case-torque.webp",
    alt: "Many frayed lines becoming one load-bearing rope.",
  },
];

const LEGACY_RESULTS = [
  {
    value: "$13M saved",
    desc: "Seven data centers, cloud and managed services benchmarked. Costs reduced 26% and SLAs improved 74%.",
  },
  {
    value: "358 vendors analyzed",
    desc: "Full SPY Index review. Costs reduced 34%, service levels improved 21% and chargeback architecture reworked.",
  },
  {
    value: "50+ Microsoft studies",
    desc: "Digital media, product, market and alliance research built for decisions, not shelfware.",
  },
  {
    value: "27% savings at eBay",
    desc: "Contract economics improved while strategic supplier relationships became stronger.",
  },
  {
    value: "16-year continuity",
    desc: "Institutional intelligence maintained across leadership changes and mission-critical media infrastructure decisions.",
  },
  {
    value: "40% saved under urgency",
    desc: "Emergency supplier decision compressed by months while confidentiality and executive confidence held.",
  },
];

const NAME_CLOUD = [
  "AOL",
  "Aon",
  "Arch",
  "Archon",
  "BlackLine",
  "Catalina",
  "CCP Games",
  "Commonwealth Bank",
  "Constant Contact",
  "Credit.com",
  "Cushman & Wakefield",
  "DRW",
  "EOS",
  "Hearst",
  "McGraw Hill",
  "Miramax",
  "MTV",
  "NHL",
  "NPR",
  "Riot Games",
  "San Francisco Chronicle",
  "Snapchat",
  "Sony Music",
  "StubHub",
  "Sun Microsystems",
  "Technicolor",
  "Ticketmaster",
  "Virgin",
  "Zurich",
];

const VOICES = [
  {
    quote:
      "They helped me significantly reduce my cost structure through several major outsourcing deals worth deep eight figures. They made me look like a hero to my executive management. They are a secret weapon.",
    name: "Peter Borner",
    role: "Former Head of IT, Sony Music",
  },
  {
    quote:
      "RampRate was a risk-free proposition money-wise. They hit 27% savings and the relationships are stronger than ever.",
    name: "Paul Santana",
    role: "Manager of Data Center Operations, eBay",
  },
  {
    quote:
      "Over 50 digital media, IT and product studies. Their access, granular approach and understanding of our corporate strategy differentiate their offering.",
    name: "Gary Share",
    role: "Windows Marketing and Product, Microsoft",
  },
];

const eyebrowClass =
  "text-xs font-semibold tracking-[0.2em] uppercase text-gold font-body";

function CaseLink({
  link,
  children,
}: {
  link: { href: string; label: string; external?: boolean } | null;
  children: string;
}) {
  if (!link) return <>{children}</>;
  const idx = children.indexOf(link.label);
  const before = children.slice(0, idx);
  const after = children.slice(idx + link.label.length);
  return (
    <>
      {before}
      {link.external ? (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold hover:text-gold-light underline underline-offset-2"
        >
          {link.label}
        </a>
      ) : (
        <Link
          href={link.href}
          className="text-gold hover:text-gold-light underline underline-offset-2"
        >
          {link.label}
        </Link>
      )}
      {after}
    </>
  );
}

export default async function ProofPage() {
  const clientLogos =
    (await sanityFetch<SanityLogo[]>({
      query: clientLogosQuery,
      tags: ["clientLogo"],
    })) ?? [];

  const withImage = clientLogos.filter((l) => l.logoUrl);
  const featuredLogos = withImage.slice(0, 24);
  const remainingWithImage = withImage.slice(24);
  const noImage = clientLogos.filter((l) => !l.logoUrl);
  const textNames = [
    ...remainingWithImage.map((l) => l.name),
    ...noImage.map((l) => l.name),
  ];

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Proof", url: "https://ramprate.com/proof" },
        ])}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-dark">
        <div className="absolute inset-0">
          <Image
            src="/proof/hero.webp"
            alt="Wild mountain streams pass through a hand-built lock into one calm channel."
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/90 to-dark/50" />
        </div>
        <div className="glass-orb glass-orb-amber w-[400px] h-[400px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-rust w-[260px] h-[260px] bottom-0 -left-32" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <span className={`${eyebrowClass} mb-4 block`}>
              Proof of Judgment Under Pressure
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight font-display">
              We solve the problems that do not fit in a box.
            </h1>
            <p className="text-white/85 text-lg sm:text-xl leading-relaxed mb-4 font-display italic">
              For 25 years, leaders have called RampRate when the decision was
              expensive, the facts were incomplete and the consequences were
              real.
            </p>
            <p className="text-white/70 text-base leading-relaxed mb-10 font-body">
              The work now spans critical situations, governance, recovery,
              regenerative health, digital assets and infrastructure. Different
              doors. The same instrument: research deeply, find the leverage,
              assemble the right people and carry the outcome through.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#recent"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold bg-gold text-dark hover:bg-gold-light transition-all font-body"
              >
                See Recent Use Cases
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-all font-body"
              >
                Tell Us What Is Broken
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Signal stats bar */}
      <section aria-label="RampRate at a glance" className="section-light">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4">
          {STATS.map((stat, i) => {
            const rightAtMobile = i % 2 === 0; // not the last column of a 2-col row
            const rightAtDesktop = i !== STATS.length - 1; // not the last of 4
            return (
              <div
                key={stat.label}
                className={`text-center px-3 py-6 border-b sm:border-b-0 border-black/10 ${
                  rightAtMobile ? "border-r" : ""
                } ${rightAtDesktop ? "sm:border-r" : ""}`}
              >
                <div className="text-xl sm:text-2xl font-bold text-ink font-display">
                  {stat.value}
                </div>
                <div className="mt-2 text-xs text-ink-mid font-body">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Six Recent Use Cases */}
      <section
        id="recent"
        className="relative section-warm overflow-hidden py-20 sm:py-28"
      >
        <div className="glass-orb glass-orb-amber w-[300px] h-[300px] -top-32 -right-32" />
        <div className="glass-orb glass-orb-rust w-[180px] h-[180px] bottom-10 -left-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl mb-6">
            <span className={eyebrowClass}>Six Recent Use Cases</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight font-display">
              The last year was not a return to sourcing. It was a return to
              solving consequential problems.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink-mid font-body">
              Much of this work remains protected by confidentiality, active
              negotiations or legal privilege. The client names and full case
              records will be published as permissions clear. The work below is
              described at the level we can responsibly disclose today.
            </p>
          </div>
          <p className="pb-6 mb-10 border-y border-black/10 py-4 text-sm text-ink-mid font-body">
            <strong className="text-ink">Confidential engagements.</strong>{" "}
            &ldquo;Results to date&rdquo; identifies completed work products and
            verified operating milestones, not speculative final outcomes.
          </p>
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-14">
            {CASES.map((c) => (
              <article key={c.num}>
                <div className="relative aspect-[3/2] mb-5 rounded-lg overflow-hidden bg-dark">
                  <Image
                    src={c.image}
                    alt={c.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex gap-4">
                  <span className="text-xs font-bold text-gold pt-1 shrink-0 font-mono">
                    {c.num}
                  </span>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold leading-snug font-display">
                      <CaseLink link={c.link}>{c.title}</CaseLink>
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-mid font-body">
                      {c.desc}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {c.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 bg-gold/10 text-[oklch(0.4_0.12_70)] text-[11px] font-bold uppercase tracking-wide font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-[13px] font-semibold text-ink font-body">
                      <span
                        className="text-[oklch(0.55_0.18_150)] mr-2"
                        aria-hidden="true"
                      >
                        ●
                      </span>
                      {c.status}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Method */}
      <section className="relative section-dark overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-amber w-[350px] h-[350px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-rust w-[200px] h-[200px] bottom-20 -left-20" />
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
          <span className={eyebrowClass}>One Method, Several Practices</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-white font-display">
            Research. Blueprint. Activate.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 font-body">
            We do not sell a generic consulting product. We build the
            configuration the problem requires, then stay close enough to make
            the result real.
          </p>
          <div className="mt-12 space-y-4">
            {METHOD_STEPS.map((step) => (
              <div
                key={step.n}
                className="relative grid sm:grid-cols-2 min-h-[220px] sm:min-h-[270px] rounded-xl overflow-hidden"
              >
                <div className="relative min-h-[176px] sm:min-h-full">
                  <Image
                    src={step.image}
                    alt={step.alt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="bg-dark-card flex flex-col justify-center p-8 sm:p-10">
                  <div className="text-xs font-bold tracking-[0.12em] text-amber font-mono">
                    {step.n}
                  </div>
                  <h3 className="mt-4 text-2xl sm:text-3xl font-bold text-white font-display">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/80 font-body">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 25-Year Foundation */}
      <section className="relative section-light overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-amber w-[280px] h-[280px] -bottom-32 -left-32" />
        <div className="glass-orb glass-orb-rust w-[160px] h-[160px] top-20 -right-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <span className={eyebrowClass}>The 25-Year Foundation</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight font-display">
            New categories. Old discipline.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-mid font-body">
            The recent work is credible because it sits on decades of measurable
            results inside complex enterprises.
          </p>
          <div className="mt-12 grid sm:grid-cols-3 gap-x-8 gap-y-8">
            {LEGACY_RESULTS.map((r) => (
              <div key={r.value} className="pt-6 border-t border-black/10">
                <div className="text-xl font-bold text-ink font-display">
                  {r.value}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-mid font-body">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Trust Wall */}
      <section id="clients" className="relative section-warm py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <span className={eyebrowClass}>The Relationship Constellation</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight font-display">
            Trusted by leaders who could not afford theater.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-mid font-body">
            A selection of organizations represented in RampRate&apos;s public
            client record. Logos remain the property of their respective owners.
          </p>
          {featuredLogos.length > 0 && (
            <div className="mt-12 flex flex-wrap justify-center items-center gap-4">
              {featuredLogos.map((logo) => {
                const img = (
                  <Image
                    src={logo.logoUrl!}
                    alt={logo.name}
                    width={100}
                    height={28}
                    className="object-contain brightness-0 invert opacity-80 transition-opacity group-hover:opacity-100"
                    style={{ height: "28px", maxWidth: "100px", width: "auto" }}
                    unoptimized
                  />
                );
                return (
                  <div
                    key={logo._id}
                    className="group flex items-center justify-center bg-dark-card rounded-[10px] px-5 py-3 min-w-[100px] min-h-[56px] transition-transform hover:scale-105"
                  >
                    {logo.url ? (
                      <a
                        href={logo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        {img}
                      </a>
                    ) : (
                      img
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {textNames.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {textNames.map((name) => (
                <span
                  key={name}
                  className="px-2.5 py-1.5 bg-white text-[oklch(0.3_0.02_50)] text-[11px] font-bold tracking-wide font-mono"
                >
                  {name}
                </span>
              ))}
            </div>
          )}
          {clientLogos.length === 0 && NAME_CLOUD.length > 0 && (
            <div className="mt-12 flex flex-wrap justify-center gap-2">
              {NAME_CLOUD.map((name) => (
                <span
                  key={name}
                  className="px-2.5 py-1.5 bg-white text-[oklch(0.3_0.02_50)] text-[11px] font-bold tracking-wide font-mono"
                >
                  {name}
                </span>
              ))}
            </div>
          )}
          <p className="mt-8 text-center text-xs text-ink-mid font-body">
            The full historical client record contains more than 100
            organizations. A logo indicates a past or present working
            relationship, not necessarily a current endorsement. Confidential
            recent engagements are intentionally unnamed.
          </p>
        </div>
      </section>

      {/* Voices */}
      <section id="voices" className="relative section-light py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <span className={eyebrowClass}>In Their Words</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight font-display">
            Trust is what remains after the engagement ends.
          </h2>
          <div className="mt-12 grid sm:grid-cols-3 gap-8">
            {VOICES.map((v) => (
              <blockquote
                key={v.name}
                className="pt-6 border-t border-black/10"
              >
                <p className="text-lg leading-relaxed font-display">
                  &ldquo;{v.quote}&rdquo;
                </p>
                <footer className="mt-4 text-sm text-ink-mid font-body">
                  <strong className="block text-ink">{v.name}</strong>
                  {v.role}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* B Corp / Impact */}
      <section className="relative section-warm overflow-hidden py-16 sm:py-20">
        <div className="glass-orb glass-orb-amber w-[300px] h-[300px] -bottom-32 -right-32" />
        <div className="glass-orb glass-orb-rust w-[180px] h-[180px] top-10 -left-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-black/5 flex flex-col sm:flex-row items-center gap-8">
            <a
              href="https://www.bcorporation.net/en-us/find-a-b-corp/company/ramp-rate-a-team-inc/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[130px] h-[130px] shrink-0 rounded-full bg-gold flex flex-col items-center justify-center text-center gap-1"
            >
              <span className="text-dark text-xs font-bold tracking-wide uppercase font-mono">
                Certified
              </span>
              <span className="text-dark text-sm font-bold tracking-wide uppercase font-mono">
                B Corporation
              </span>
              <span className="text-dark text-xs font-mono">115.6</span>
            </a>
            <div>
              <h3 className="text-xl font-bold mb-2 font-display">
                Commercial discipline, pointed somewhere worth going.
              </h3>
              <p className="text-sm leading-relaxed text-ink-mid font-body">
                RampRate is a Certified B Corporation. B Lab reports an overall
                B Impact Score of 115.6, compared with a qualifying score of 80.
                That proof matters because{" "}
                <a
                  href="https://impactsoul.is/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold-light underline underline-offset-2"
                >
                  ImpactSoul
                </a>{" "}
                is not a decorative promise attached to the work. It is the
                regenerative test applied to where our intelligence,
                relationships and future profits go next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-gold">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4 font-display">
            Tell us what is broken.
          </h2>
          <p className="text-dark/80 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto font-body">
            The first conversation is free. A principal responds. If we can
            create leverage, we will show you where. If we cannot, we will tell
            you quickly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold bg-dark hover:bg-dark-mid text-white transition-all shadow-lg font-body"
            >
              Start a Conversation
            </Link>
            <Link
              href="/process"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold border-2 border-dark/30 text-dark hover:bg-dark/10 transition-all font-body"
            >
              See How We Work
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
