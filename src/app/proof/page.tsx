import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPageSeo, withSeoOverrides } from "@/lib/sanity/seo";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

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
  {
    value: "115.6",
    growth: "+37.1%",
    label: "Verified B Impact Score growth since 2022",
  },
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

const WORK_NOTES = [
  {
    title: "Advisory boards & partners",
    desc: "Clarify which expertise and decision rights are missing, prepare a credible proposition for prospective advisors, and align the people who must carry it into the market. An introduction is a starting point; the terms, roles and follow-through make it useful.",
  },
  {
    title: "Disputes & governance",
    desc: (
      <>
        In{" "}
        <Link
          href="/torque"
          className="text-[oklch(0.43_0.14_298)] hover:text-[oklch(0.53_0.14_298)] underline underline-offset-2"
        >
          TORQUE
        </Link>{" "}
        work, map the parties and their incentives, assemble counsel and
        specialists, organize evidence, and design a route to negotiation or
        recovery. We do not present a pending resolution as a completed win.
      </>
    ),
  },
  {
    title: "Go-to-market plans",
    desc: (
      <>
        Test the proposition against customer and partner needs, prioritize
        verticals and geographies, build a practical rollout plan, and stay
        involved when the first conversation becomes a negotiation.{" "}
        <Link
          href="/biochain"
          className="text-[oklch(0.43_0.14_298)] hover:text-[oklch(0.53_0.14_298)] underline underline-offset-2"
        >
          BioChain
        </Link>{" "}
        applies that discipline to qualified health supply and cross-border
        commercial pathways.
      </>
    ),
  },
];

const CONFIDENTIAL_WORK_NOTE = {
  title: "Distributed infrastructure · confidential",
  desc: "A further advisory relationship supported a distributed data-center venture through board-level positioning, partner alignment and a route to market. The business was subsequently sold. Its identity, transaction terms and our precise contribution to the sale remain confidential; this is not a claim that RampRate brokered or caused the sale.",
};

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

const LOGOS = [
  { name: "Microsoft", file: "microsoft.png" },
  { name: "Goldman Sachs", file: "goldman-sachs.svg" },
  { name: "Nike", file: "nike.svg" },
  { name: "Sony", file: "sony.svg" },
  { name: "Intel", file: "intel.svg" },
  { name: "PayPal", file: "paypal.svg" },
  { name: "Verizon", file: "verizon.svg" },
  { name: "AT&T", file: "at-t.png" },
  { name: "Citigroup", file: "citigroup.png" },
  { name: "eBay", file: "ebay.png" },
  { name: "Accenture", file: "accenture.png" },
  { name: "Bain & Company", file: "bain.png" },
  { name: "McKinsey & Company", file: "mckinsey.png" },
  { name: "Bridgewater", file: "bridgewater.png" },
  { name: "Broadcom", file: "broadcom.png" },
  { name: "Blizzard Entertainment", file: "blizzard.png" },
  { name: "Audible", file: "audible.png" },
  { name: "Expedia", file: "expedia.png" },
  { name: "JPMorgan Chase", file: "jpmorgan.png" },
  { name: "Fidelity", file: "fidelity.png" },
  { name: "FOX", file: "fox.svg" },
  { name: "NBC", file: "nbc.svg" },
  { name: "Yahoo", file: "yahoo.png" },
  { name: "Vodafone", file: "vodafone.svg" },
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
    kind: "Product strategy",
    quote:
      "Their access, granular approach and understanding of our corporate strategy differentiate their offering.",
    name: "Gary Share",
    role: "Windows Marketing and Product, Microsoft",
    link: null as { href: string; label: string } | null,
  },
  {
    kind: "Long-term partnership",
    quote:
      "They saved us millions, created agility and new budget out of thin air with each engagement.",
    name: "Phil Wiser",
    role: "EVP & CTO, ViacomCBS",
    link: { href: "/", label: "Public testimonial" },
  },
  {
    kind: "Commercial leverage",
    quote: "They hit 27% savings and the relationships are stronger than ever.",
    name: "Paul Santana",
    role: "Manager of Data Center Operations, eBay",
    link: { href: "/sourcing", label: "Public testimonial" },
  },
];

const PROOF_NOTES = [
  {
    title: "Founder growth",
    desc: (
      <>
        Four-plus years of advisory for NOIA, including enterprise partnerships
        and board and investor recruitment.{" "}
        <Link
          href="/"
          className="text-[oklch(0.43_0.14_298)] hover:text-[oklch(0.53_0.14_298)] underline underline-offset-2"
        >
          See public record
        </Link>
        .
      </>
    ),
  },
  {
    title: "Open-source funding",
    desc: (
      <>
        RampRate publicly reports managing more than $3 million in grant funding
        for XPRIZE.{" "}
        <Link
          href="/"
          className="text-[oklch(0.43_0.14_298)] hover:text-[oklch(0.53_0.14_298)] underline underline-offset-2"
        >
          See public record
        </Link>
        .
      </>
    ),
  },
  {
    title: "Impact accountability",
    desc: (
      <a
        href="https://www.bcorporation.net/en-us/find-a-b-corp/company/ramp-rate-a-team-inc/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[oklch(0.43_0.14_298)] hover:text-[oklch(0.53_0.14_298)] underline underline-offset-2"
      >
        B Lab lists RampRate&apos;s 115.6 B Impact Score, up from 84.3 in 2022.
      </a>
    ),
  },
];

const SCORE_PROOF = [
  {
    value: "Top 9%",
    label: "approximate score rank in B Lab's last public company dataset",
  },
  {
    value: "Top 3.6%",
    label: "approximate recertification improvement rate",
  },
  { value: "2.27×", label: "the 50.9 ordinary-business median" },
];

const eyebrowClass =
  "text-xs font-semibold tracking-[0.2em] uppercase text-[oklch(0.43_0.14_298)] font-body";

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
          className="text-[oklch(0.43_0.14_298)] hover:text-[oklch(0.53_0.14_298)] underline underline-offset-2"
        >
          {link.label}
        </a>
      ) : (
        <Link
          href={link.href}
          className="text-[oklch(0.43_0.14_298)] hover:text-[oklch(0.53_0.14_298)] underline underline-offset-2"
        >
          {link.label}
        </Link>
      )}
      {after}
    </>
  );
}

export default function ProofPage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Proof", url: "https://ramprate.com/proof" },
        ])}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-[oklch(0.28_0.04_178)]">
        <div className="absolute inset-0">
          <Image
            src="/proof/hero.webp"
            alt="A glowing bridge spans a misty canyon between waterfalls and snow-capped mountains at dusk, reached by a winding lit path."
            fill
            priority
            sizes="100vw"
            className="object-cover object-right opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.28_0.04_178)] via-[oklch(0.28_0.04_178)]/90 to-[oklch(0.28_0.04_178)]/50" />
        </div>
        <div className="relative z-10 max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[oklch(0.88_0.08_162)] font-body mb-4 block">
              Proof of Judgment Under Pressure
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight font-display">
              We solve the problems that do not fit in a box.
            </h1>
            <p className="text-[oklch(0.94_0.03_162)] text-lg sm:text-xl leading-relaxed mb-4 font-display italic">
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
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold bg-[oklch(0.88_0.08_162)] text-[oklch(0.28_0.04_178)] hover:bg-[oklch(0.94_0.05_162)] transition-all font-body"
              >
                See Recent Use Cases
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold border-2 border-[oklch(0.88_0.08_162)]/50 text-white hover:bg-white/10 transition-all font-body"
              >
                Tell Us What Is Broken
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Signal stats bar */}
      <section
        aria-label="RampRate at a glance"
        className="bg-[oklch(0.98_0.01_81)] border-b border-[oklch(0.88_0.01_117)]"
      >
        <div className="max-w-[1180px] mx-auto grid grid-cols-2 sm:grid-cols-4">
          {STATS.map((stat, i) => {
            const rightAtMobile = i % 2 === 0; // not the last column of a 2-col row
            const rightAtDesktop = i !== STATS.length - 1; // not the last of 4
            return (
              <div
                key={stat.label}
                className={`text-center px-3 py-6 border-b sm:border-b-0 border-[oklch(0.88_0.01_117)] ${
                  rightAtMobile ? "border-r" : ""
                } ${rightAtDesktop ? "sm:border-r" : ""}`}
              >
                <div className="text-xl sm:text-2xl font-bold text-[oklch(0.28_0.04_178)] font-display">
                  {stat.value}
                  {stat.growth && (
                    <span className="ml-1.5 text-[oklch(0.43_0.14_298)] text-xs font-bold font-mono align-middle">
                      {stat.growth}
                    </span>
                  )}
                </div>
                <div className="mt-2 text-xs text-[oklch(0.42_0.02_168)] font-body">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Use Cases */}
      <section
        id="recent"
        className="relative overflow-hidden py-20 sm:py-28 bg-[oklch(0.96_0.01_80)]"
      >
        <div className="relative z-10 max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="max-w-3xl mb-6">
            <span className={eyebrowClass}>Recent Use Cases</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight font-display text-[oklch(0.24_0.02_172)]">
              The last year was not a return to sourcing. It was a return to
              solving consequential problems.
            </h2>
          </div>
          <p className="pb-6 mb-10 border-y border-[oklch(0.88_0.01_117)] py-4 text-sm text-[oklch(0.42_0.02_168)] font-body">
            <strong className="text-[oklch(0.24_0.02_172)]">
              Confidential engagements.
            </strong>{" "}
            Names and full case records will be published as permissions clear.
            &ldquo;Results to date&rdquo; means completed work and verified
            operating milestones, never speculative outcomes.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {CASES.map((c, i) => (
              <article
                key={c.num}
                className={
                  i % 3 !== 0
                    ? "lg:border-l lg:border-[oklch(0.88_0.01_117)] lg:pl-8"
                    : ""
                }
              >
                <div className="relative aspect-[3/2] mb-5 rounded-lg overflow-hidden bg-[oklch(0.28_0.04_178)]">
                  <Image
                    src={c.image}
                    alt={c.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex gap-4">
                  <span className="text-xs font-bold text-[oklch(0.43_0.14_298)] pt-1 shrink-0 font-mono">
                    {c.num}
                  </span>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold leading-snug font-display text-[oklch(0.24_0.02_172)]">
                      <CaseLink link={c.link}>{c.title}</CaseLink>
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[oklch(0.42_0.02_168)] font-body">
                      {c.desc}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {c.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 bg-[oklch(0.94_0.02_303)] text-[oklch(0.43_0.14_298)] text-[11px] font-bold uppercase tracking-wide font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-[13px] font-semibold text-[oklch(0.24_0.02_172)] font-body">
                      <span
                        className="text-[oklch(0.69_0.15_160)] mr-2"
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

          {/* Work behind the headline */}
          <div className="mt-20 pt-10 border-t-2 border-[oklch(0.28_0.04_178)]">
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-[oklch(0.24_0.02_172)]">
              The work behind the headline
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[oklch(0.42_0.02_168)] font-body">
              The outcomes come from decisions made before an introduction, and
              work carried through after it. Recent engagements draw on the same
              disciplines documented in our advisory practice.
            </p>
            <div className="mt-6">
              {WORK_NOTES.map((note) => (
                <div
                  key={note.title}
                  className="grid sm:grid-cols-[27%_1fr] gap-2 sm:gap-8 py-5 border-t border-[oklch(0.88_0.01_117)]"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wide text-[oklch(0.43_0.14_298)] font-mono">
                    {note.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-[oklch(0.24_0.02_172)] font-body">
                    {note.desc}
                  </p>
                </div>
              ))}
              <div className="grid sm:grid-cols-[27%_1fr] gap-2 sm:gap-8 py-5 mt-1 px-4 -mx-4 bg-[oklch(0.43_0.14_298)]/5 border-t border-[oklch(0.43_0.14_298)]">
                <h4 className="text-xs font-bold uppercase tracking-wide text-[oklch(0.43_0.14_298)] font-mono">
                  {CONFIDENTIAL_WORK_NOTE.title}
                </h4>
                <p className="text-sm leading-relaxed text-[oklch(0.24_0.02_172)] font-body">
                  {CONFIDENTIAL_WORK_NOTE.desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Method */}
      <section className="relative overflow-hidden py-20 sm:py-28 bg-[oklch(0.28_0.04_178)]">
        <div className="relative z-10 max-w-[1180px] mx-auto px-5 sm:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[oklch(0.88_0.08_162)] font-body">
            One Method, Several Practices
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-white font-display">
            Research. Blueprint. Activate.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 font-body">
            We do not sell a generic consulting product. We build the
            configuration the problem requires, then stay close enough to make
            the result real.
          </p>
          <div className="mt-12 grid sm:grid-cols-3 gap-4">
            {METHOD_STEPS.map((step) => (
              <div
                key={step.n}
                className="rounded-xl overflow-hidden bg-[oklch(0.33_0.05_177)]"
              >
                <div className="relative h-44">
                  <Image
                    src={step.image}
                    alt={step.alt}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="text-xs font-bold tracking-[0.12em] text-[oklch(0.88_0.08_162)] font-mono">
                    {step.n}
                  </div>
                  <h3 className="mt-3 text-xl font-bold text-white font-display">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80 font-body">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 25-Year Foundation */}
      <section className="relative overflow-hidden py-20 sm:py-28 bg-[oklch(0.96_0.01_80)]">
        <div className="relative z-10 max-w-[1180px] mx-auto px-5 sm:px-8">
          <span className={eyebrowClass}>The 25-Year Foundation</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight font-display text-[oklch(0.24_0.02_172)]">
            New categories. Old discipline.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[oklch(0.42_0.02_168)] font-body">
            The recent work is credible because it sits on decades of measurable
            results inside complex enterprises.
          </p>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-6 border-t border-[oklch(0.88_0.01_117)]">
            {LEGACY_RESULTS.map((r, i) => (
              <div
                key={r.value}
                className={`pt-6 pb-2 border-[oklch(0.88_0.01_117)] ${
                  i % 2 !== 0 ? "sm:border-l sm:pl-6" : ""
                } ${i !== 0 ? "lg:border-l lg:pl-6" : ""}`}
              >
                <div className="text-xl font-bold text-[oklch(0.24_0.02_172)] font-display">
                  {r.value}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[oklch(0.42_0.02_168)] font-body">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Trust Wall */}
      <section
        id="clients"
        className="relative py-20 sm:py-28 bg-[oklch(0.98_0.01_81)]"
      >
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
          <span className={eyebrowClass}>The Relationship Constellation</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight font-display text-[oklch(0.24_0.02_172)]">
            Trusted by leaders who could not afford theater.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[oklch(0.42_0.02_168)] font-body">
            A selection of organizations represented in RampRate&apos;s public
            client record. Logos remain the property of their respective owners.
          </p>
          <div className="mt-12 grid grid-cols-3 sm:grid-cols-6 border-t border-l border-[oklch(0.85_0.01_100)]">
            {LOGOS.map((logo) => (
              <div
                key={logo.name}
                className="flex items-center justify-center bg-white border-r border-b border-[oklch(0.85_0.01_100)] p-4 min-h-[70px] sm:min-h-[82px]"
              >
                <Image
                  src={`/proof/logos/${logo.file}`}
                  alt={logo.name}
                  width={132}
                  height={50}
                  className="object-contain w-full h-auto max-w-[132px] max-h-[50px]"
                  unoptimized={logo.file.endsWith(".svg")}
                />
              </div>
            ))}
          </div>
          <details className="mt-6 border-t border-b border-[oklch(0.85_0.01_100)]">
            <summary className="cursor-pointer min-h-11 flex items-center text-xs font-bold uppercase tracking-wide text-[oklch(0.28_0.04_178)] font-mono">
              See {NAME_CLOUD.length} more public client names
            </summary>
            <div className="flex flex-wrap gap-2 pb-4">
              {NAME_CLOUD.map((name) => (
                <span
                  key={name}
                  className="px-2.5 py-1.5 bg-white text-[oklch(0.24_0.02_172)] text-[11px] font-bold tracking-wide font-mono"
                >
                  {name}
                </span>
              ))}
            </div>
          </details>
          <p className="mt-8 text-center text-xs text-[oklch(0.42_0.02_168)] font-body">
            The full historical client record contains more than 100
            organizations. A logo indicates a past or present working
            relationship, not necessarily a current endorsement. Confidential
            recent engagements are intentionally unnamed.
          </p>
        </div>
      </section>

      {/* Voices */}
      <section
        id="voices"
        className="relative py-20 sm:py-28 bg-[oklch(0.96_0.01_80)]"
      >
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
          <span className={eyebrowClass}>The People and the Record</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight font-display text-[oklch(0.24_0.02_172)]">
            More than a sourcing story.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[oklch(0.42_0.02_168)] font-body">
            The published voices speak to product judgment, staying power and
            measurable economics. The newer practices have public work to show,
            but confidential partners do not become quoted endorsers without
            permission.
          </p>
          <div className="mt-12 grid sm:grid-cols-3 gap-8">
            {VOICES.map((v) => (
              <blockquote
                key={v.name}
                className="pt-6 border-t border-[oklch(0.88_0.01_117)]"
              >
                <span className="block text-[oklch(0.43_0.14_298)] text-xs font-bold mb-2.5">
                  {v.kind}
                </span>
                <p className="text-lg leading-relaxed font-display text-[oklch(0.24_0.02_172)]">
                  &ldquo;{v.quote}&rdquo;
                </p>
                <footer className="mt-4 text-sm text-[oklch(0.42_0.02_168)] font-body">
                  <strong className="block text-[oklch(0.24_0.02_172)]">
                    {v.name}
                  </strong>
                  {v.role}
                  {v.link && (
                    <>
                      {" · "}
                      <Link
                        href={v.link.href}
                        className="text-[oklch(0.43_0.14_298)] hover:text-[oklch(0.53_0.14_298)] underline underline-offset-2"
                      >
                        {v.link.label}
                      </Link>
                    </>
                  )}
                </footer>
              </blockquote>
            ))}
          </div>
          <div className="mt-14 grid sm:grid-cols-3 gap-8 sm:gap-6">
            {PROOF_NOTES.map((note) => (
              <div key={note.title}>
                <div className="text-base font-bold font-display text-[oklch(0.24_0.02_172)]">
                  {note.title}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[oklch(0.42_0.02_168)] font-body">
                  {note.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-xs leading-relaxed text-[oklch(0.42_0.02_168)] font-body">
            The three statements above are public work and independent
            certification, not client testimonials. We will add attributed
            voices from newer practices when those partners approve publication.
          </p>
        </div>
      </section>

      {/* B Corp / Impact */}
      <section className="relative overflow-hidden py-16 sm:py-20 bg-[oklch(0.94_0.02_305)]">
        <div className="relative z-10 max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="grid sm:grid-cols-[190px_1fr] gap-8 items-start">
            <a
              href="https://www.bcorporation.net/en-us/find-a-b-corp/company/ramp-rate-a-team-inc/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-row sm:flex-col items-center gap-4 sm:gap-2 text-[oklch(0.28_0.04_178)]"
            >
              <Image
                src="/bcorp-logo.svg"
                alt="Certified B Corporation"
                width={88}
                height={129}
                className="h-16 sm:h-[110px] w-auto shrink-0"
                unoptimized
              />
              <span className="text-xs font-bold uppercase tracking-wide text-center font-mono">
                View our verified
                <br />B Lab profile
              </span>
            </a>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-display text-[oklch(0.24_0.02_172)]">
                A rare score. A rarer climb.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[oklch(0.42_0.02_168)] font-body">
                <a
                  href="https://www.bcorporation.net/en-us/find-a-b-corp/company/ramp-rate-a-team-inc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[oklch(0.43_0.14_298)] hover:text-[oklch(0.53_0.14_298)] underline underline-offset-2"
                >
                  B Lab verifies
                </a>{" "}
                RampRate&apos;s Overall B Impact Score at{" "}
                <strong className="text-[oklch(0.24_0.02_172)]">115.6</strong>,
                up from{" "}
                <strong className="text-[oklch(0.24_0.02_172)]">84.3</strong> in
                2022. The 31.3-point gain is a{" "}
                <strong className="text-[oklch(0.24_0.02_172)]">
                  37.1% increase
                </strong>
                .
              </p>
              <div className="mt-6 grid grid-cols-3 gap-px bg-[oklch(0.43_0.14_298)]/20 border border-[oklch(0.43_0.14_298)]/20">
                {SCORE_PROOF.map((s) => (
                  <div key={s.value} className="p-3 sm:p-4 bg-white/70">
                    <strong className="block text-[oklch(0.28_0.04_178)] font-display text-lg sm:text-xl">
                      {s.value}
                    </strong>
                    <span className="mt-1 block text-[11px] leading-tight text-[oklch(0.42_0.02_168)] font-body">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm leading-relaxed text-[oklch(0.42_0.02_168)] font-body">
                That is commercial discipline aligned with{" "}
                <a
                  href="https://impactsoul.is/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[oklch(0.43_0.14_298)] hover:text-[oklch(0.53_0.14_298)] underline underline-offset-2 font-semibold"
                >
                  ImpactSoul
                </a>
                : the regenerative test for where our intelligence,
                relationships and future profits go next.
              </p>
              <p className="mt-4 text-[11px] leading-relaxed text-[oklch(0.42_0.02_168)] font-body">
                Rarity is a RampRate calculation from B Lab&apos;s archival
                public company-level data: 7,039 current-certified companies for
                score rank and 2,967 companies with consecutive assessments for
                improvement rate. It is a historical benchmark, not a current
                percentile issued by B Lab.{" "}
                <a
                  href="https://www.bcorporation.net/news/blog/research-fellowship-call-for-proposals-2024/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[oklch(0.43_0.14_298)] hover:text-[oklch(0.53_0.14_298)] underline underline-offset-2"
                >
                  B Lab describes the dataset
                </a>
                .{" "}
                <a
                  href="https://www.kaggle.com/datasets/thedevastator/b-corporation-impact-data"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[oklch(0.43_0.14_298)] hover:text-[oklch(0.53_0.14_298)] underline underline-offset-2"
                >
                  View the archived data mirror
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 text-center bg-[oklch(0.28_0.04_178)]">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display">
            Bring us the knot. In the first hour, we find the thread.
          </h2>
          <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto font-body">
            Bring us the crisis, the stalled goal or the opportunity you cannot
            yet frame. In our first conversation, we illuminate what is actually
            holding it in place, identify where leverage lives and decide
            whether we are the right people to move it.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold bg-[oklch(0.88_0.08_162)] text-[oklch(0.28_0.04_178)] hover:bg-[oklch(0.94_0.05_162)] transition-all shadow-lg font-body"
            >
              Start With the First Hour
            </Link>
            <Link
              href="/process"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold border-2 border-[oklch(0.88_0.08_162)]/50 text-white hover:bg-white/10 transition-all font-body"
            >
              See How We Work
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
