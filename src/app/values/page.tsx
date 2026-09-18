import Link from "next/link";
import type { Metadata } from "next";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Values - Powering Purpose-driven Innovation",
  description:
    "We build an ecosystem of impact-preneurs and trailblazers powered by opportunities, resources, innovation and human spirit.",
  keywords: [
    "values",
    "mission",
    "purpose driven innovation",
    "impact-preneurs",
    "trailblazers",
    "ecosystem",
    "culture",
    "B Corp",
  ],
  alternates: { canonical: "/values" },
  openGraph: {
    title: "Values - Powering Purpose-driven Innovation",
    description:
      "We build an ecosystem of impact-preneurs and trailblazers powered by opportunities, resources, innovation and human spirit.",
    url: "https://ramprate.com/values",
    type: "website",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Values - Powering Purpose-driven Innovation",
    description:
      "We build an ecosystem of impact-preneurs and trailblazers powered by opportunities, resources, innovation and human spirit.",
    images: ["/og.png"],
  },
};

const principles = [
  "We serve others - we provide the tools they need, and together we build their future and dreams.",
  "We choose who we work with - we forge a bond through shared values with those who are innovative, inspiring, impact-focused change agents.",
  "We deal in rationality and pragmatism - hope is not a strategy; anecdotes are not data; inputs are not impacts.",
  "We dream big - rationality and audacity are not mutually exclusive. We partner with inspirational leaders and unravel the world's greatest challenges together.",
  "We support execution - we not only recommend the course of action, but back our recommendations with the work required to implement them successfully.",
  "We earn trust - we follow through on our commitments, and require our partners and anyone we vouch for to do likewise.",
  "We overdeliver on our promises - we are resourceful and our effort is only bound by what benefits our client.",
  "We support diversity, equity, and inclusion - for powerful change to happen, people with a variety of lived experiences come together to form creative and productive teams.",
  "We are engines of transparency - we raise the bar on each ecosystem we touch by shining the light on greenwashing, corruption, and self-dealing.",
  "We believe in the transformational power of technology and innovation - new impact-focused approaches in tech, health, and crypto should be embraced even if their adoption results in creative destruction.",
  "Not all that is new is better - we believe in rigorous evaluation and audit of every new technology, tokenomics of new coins, and real health effects of every new therapy.",
  "We embrace personalization - there are no good and bad products & suppliers, only good and bad fits to the situation.",
  "Decentralized grassroots action - we are not paternalistic; we partner with the communities we serve to help them use the best decentralized tools to organize & lead.",
  "Boldness - we believe in ourselves, the communities we create, and in making a difference together.",
];

const whatWeDo = [
  {
    title: "Growth Strategy & Implementation",
    desc: "Accelerate growth strategy and implementation for earlier stage companies.",
    items: ["Finding them", "Vetting them", "Optimizing"],
    color: "var(--gold)",
  },
  {
    title: "Boutique Business Planning",
    desc: "General purpose boutique business planning and consultancy.",
    items: [],
    color: "var(--gold)",
  },
  {
    title: "Social Impact Consulting",
    desc: "Develop and incubate novel tech products in the impact space.",
    items: [
      "Green routing, carbon counting & reporting",
      "Environmental impact assessment",
      "ESG and human rights",
      "Strategic sustainability",
      "Non-financial reporting & outcome measurement",
    ],
    color: "var(--gold)",
  },
  {
    title: "IT Supply Chain Optimization",
    desc: "IT supply chain optimization with regard to CSR/ESG.",
    items: [
      "Supply chain emissions (Scope III)",
      "Negotiating contracts & right-sizing",
      "Re-architect supply chains for carbon optimization",
    ],
    color: "var(--gold)",
  },
];

const howWeDoIt = [
  {
    title: "Deep Industry Expertise",
    desc: "Sector-leading knowledge across technology, Web3, ESG, and impact investing - built over 25 years of active engagement.",
    items: [],
  },
  {
    title: "Profound, Broad Network",
    desc: "A curated web of sector-leading experts activated on demand for each engagement.",
    items: [
      "Emerging industries",
      "Tech",
      "Business administration",
      "Impact & measurement for CSR/ESG",
      "Project Management",
      "Primary research & business planning",
    ],
  },
  {
    title: "Work Descriptions & Strategic Planning",
    desc: "Detailed scope-of-work documentation and multi-horizon strategic plans for every engagement - no vague deliverables.",
    items: [],
  },
  {
    title: "Impact Narrative & Reporting",
    desc: "We create and measure impact narratives that resonate with investors, boards, and stakeholders.",
    items: ["Investment ROI measurement", "Operational ROI measurement"],
  },
  {
    title: "Transact Deals",
    desc: "We execute agreements end-to-end - not just advise. Our principals close deals with skin in the game.",
    items: [],
  },
  {
    title: "Manage Stakeholders",
    desc: "Ongoing relationship stewardship with all parties to ensure alignment, accountability, and delivery.",
    items: [],
  },
];

const ArrowRight = () => (
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
);

export default function ValuesPage() {
  return (
    <main className="rr-values">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Values", url: "https://ramprate.com/values" },
        ])}
      />
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-[oklch(0.09_0.02_250)] pt-32 pb-24">
        <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-[var(--gold)] opacity-15 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-[oklch(0.82_0.15_75)] opacity-10 blur-[80px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <span className="mb-4 block text-xs font-body font-semibold uppercase tracking-[0.22em] text-[oklch(0.82_0.15_75)]">
            Our Values
          </span>
          <h1 className="mb-6 max-w-3xl text-4xl font-display font-bold leading-tight tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
            Powering
            <br />
            <span className="text-[oklch(0.82_0.15_75)]">
              Purpose-driven
            </span>{" "}
            Innovation
          </h1>
          <p className="max-w-2xl text-base font-body leading-relaxed text-white/55 sm:text-lg">
            There is a new model for doing business shaped and organized by a
            company&#39;s purpose, values and societal impact. Organizations
            understand that behavior, aligned with collective intention, is the
            path to success.
          </p>
        </div>
      </section>

      {/* ─── Founder's Story ─── */}
      <section className="relative overflow-hidden bg-[#f7f4f0] py-20 sm:py-28">
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-[280px] w-[280px] rounded-full bg-[var(--gold)] opacity-20 blur-[80px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20 items-start">
            {/* Left - label + heading */}
            <div className="lg:sticky lg:top-32">
              <span className="mb-4 block text-xs font-body font-semibold uppercase tracking-[0.22em] text-[var(--rr-gold-deep)]">
                Founder&#39;s Story
              </span>
              <h2 className="text-3xl font-display font-bold leading-tight text-[oklch(0.12_0.02_50)] sm:text-4xl">
                Elevating the Way
                <br />
                <span className="text-[var(--rr-gold-deep)]">
                  Business Does
                  <br />
                  Business
                </span>
              </h2>
              <div className="mt-6 h-1 w-12 rounded-full bg-[oklch(0.82_0.15_75)]" />
              <p className="mt-5 text-sm font-mono font-medium text-[var(--rr-gold-deep)]">
                - Tony & Alex, Co-founders
              </p>
            </div>

            {/* Right - body */}
            <div className="space-y-5 text-base font-body leading-relaxed text-[oklch(0.35_0.02_50)]">
              <p>
                Hi, we&#39;re Tony and Alex - we founded RampRate in 2000 on the
                premise of elevating the way business does business. We could
                take the same connections that allowed us to cut 24% of each IT
                budget we touched and use them to kick down the barriers for
                tech innovators. We could take the same business planning rigor
                that we used to guide Sony, McKinsey, Microsoft or Intel on
                entering new markets and use it to help impact-driven startups
                reach their potential.
              </p>
              <p>
                So that&#39;s what we&#39;re doing today - we find the next
                unicorns and gatekeepers to impact that will not just earn
                millions yet better millions of lives. We grok their vision
                while putting them through bootcamp to be ready for
                life-changing opportunities. And then we kick down the barriers
                to their success by connecting them with our ecosystem and
                leveraging the trust we&#39;ve built in the Fortune 1000 over
                20-plus years to create opportunities few others can access.
              </p>
              <p>
                The purpose driven economy is here. And its leaders, in one way
                or another, will be powered by RampRate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Our Vision ─── */}
      <section className="bg-[#0d1117] py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <span className="mb-4 block text-xs font-body font-semibold uppercase tracking-[0.22em] text-[oklch(0.82_0.15_75)]">
            Our Vision
          </span>
          <blockquote className="text-2xl font-display font-bold leading-snug text-white sm:text-3xl lg:text-4xl">
            &quot;We build an Ecosystem of impact-preneurs and trailblazers
            powered by opportunities, resources, innovation and{" "}
            <span className="text-[oklch(0.82_0.15_75)]">human spirit.</span>
            &quot;
          </blockquote>
        </div>
      </section>

      {/* ─── Core Values & Principles ─── */}
      <section className="relative overflow-hidden bg-[#f7f4f0] py-20 sm:py-28">
        <div className="pointer-events-none absolute top-0 left-0 h-[300px] w-[300px] rounded-full bg-[oklch(0.82_0.15_75)] opacity-10 blur-[80px]" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
          {/* Section header */}
          <div className="mb-12">
            <span className="mb-3 block text-xs font-body font-semibold uppercase tracking-[0.22em] text-[var(--rr-gold-deep)]">
              Principles of Engagement
            </span>
            <h2 className="mb-4 text-3xl font-display font-bold leading-tight text-[oklch(0.1_0.02_50)] sm:text-4xl">
              Core Values &amp;{" "}
              <span className="text-[var(--rr-gold-deep)]">Principles</span>
            </h2>
            <p className="max-w-2xl text-sm font-body leading-relaxed text-[oklch(0.45_0.02_50)] sm:text-base">
              In order to meaningfully live our company values with our clients
              and in terms of our services and products, we must be agile,
              efficient, and entrepreneurial.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {principles.map((p, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border-l-4 shadow-sm flex gap-4 items-start"
                style={{
                  borderLeftColor:
                    i % 2 === 0 ? "var(--gold)" : "var(--rr-gold-deep)",
                  borderTop: "1px solid rgba(0,0,0,0.05)",
                  borderRight: "1px solid rgba(0,0,0,0.05)",
                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <span
                  className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold"
                  style={{
                    background:
                      i % 2 === 0
                        ? "oklch(0.82 0.15 75 / 0.12)"
                        : "color-mix(in srgb, var(--rr-gold-deep) 10%, transparent)",
                    color:
                      i % 2 === 0
                        ? "oklch(0.55 0.12 75)"
                        : "var(--rr-gold-deep)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm font-body leading-relaxed text-[oklch(0.3_0.02_50)]">
                  {p}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── What We Do ─── */}
      <section
        className="relative py-20 sm:py-28 overflow-hidden"
        style={{ background: "#0a0f1a" }}
      >
        <div
          className="absolute -top-40 -right-40 w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
          style={{ background: "var(--rr-navy-mid)", filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-75 h-75 rounded-full opacity-10 pointer-events-none"
          style={{ background: "oklch(0.82 0.15 75)", filter: "blur(80px)" }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
          <div className="mb-12">
            <span className="mb-3 block text-xs font-body font-semibold uppercase tracking-[0.22em] text-[oklch(0.82_0.15_75)]">
              Our Practice
            </span>
            <h2 className="text-3xl font-display font-bold leading-tight text-white sm:text-4xl">
              What We <span className="text-[oklch(0.82_0.15_75)]">Do</span>
            </h2>
          </div>

          {/* 1 col → 2 col → 2×2 grid */}
          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            {whatWeDo.map((item, idx) => (
              <div
                key={item.title}
                className="relative rounded-2xl overflow-hidden flex flex-col"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* Colored top accent bar */}
                <div
                  className="h-1 w-full shrink-0"
                  style={{ background: item.color }}
                />

                <div className="flex flex-col flex-1 p-6 sm:p-8 gap-5">
                  {/* Number + title row */}
                  <div className="flex items-start gap-4">
                    <span
                      className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-mono font-bold"
                      style={{
                        background: `${item.color}22`,
                        color: item.color,
                      }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3 className="pt-1.5 text-lg font-display font-bold leading-snug text-white">
                      {item.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm font-body leading-relaxed text-white/50">
                    {item.desc}
                  </p>

                  {/* Checklist */}
                  {item.items.length > 0 && (
                    <ul
                      className="mt-auto space-y-2 pt-2"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      {item.items.map((li) => (
                        <li
                          className="flex items-start gap-2.5 text-xs font-body leading-relaxed text-white/60"
                          key={li}
                        >
                          <svg
                            className="shrink-0 mt-0.5"
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ color: item.color }}
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {li}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How We Do It ─── */}
      <section
        className="relative py-20 sm:py-28 overflow-hidden"
        style={{ background: "#f7f4f0" }}
      >
        <div
          className="absolute bottom-0 right-0 w-75 h-75 rounded-full opacity-15 pointer-events-none"
          style={{ background: "var(--gold)", filter: "blur(80px)" }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
          {/* Section header */}
          <div className="mb-12">
            <span className="mb-3 block text-xs font-body font-semibold uppercase tracking-[0.22em] text-[var(--rr-gold-deep)]">
              Methodology
            </span>
            <h2 className="text-3xl font-display font-bold leading-tight text-[oklch(0.1_0.02_50)] sm:text-4xl">
              How We <span className="text-[var(--rr-gold-deep)]">Do It</span>
            </h2>
            <div
              className="mt-4 w-12 h-1 rounded-full"
              style={{ background: "var(--gold)" }}
            />
          </div>

          {/* 1 col → 2 col → 3 col grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {howWeDoIt.map((item, i) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl flex flex-col overflow-hidden"
                style={{
                  border: "1px solid rgba(0,0,0,0.07)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
              >
                {/* Card header strip */}
                <div
                  className="flex items-center gap-3 px-6 pt-6 pb-4"
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-mono font-bold shrink-0"
                    style={{
                      background: "var(--rr-gold-deep)",
                      color: "white",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-sm font-display font-bold leading-snug text-[oklch(0.15_0.02_50)] sm:text-base">
                    {item.title}
                  </h3>
                </div>

                {/* Card body */}
                <div className="flex flex-col flex-1 px-6 py-5 gap-4">
                  <p className="text-sm font-body leading-relaxed text-[oklch(0.45_0.02_50)]">
                    {item.desc}
                  </p>

                  {item.items.length > 0 && (
                    <ul
                      className="space-y-2 mt-auto pt-3"
                      style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
                    >
                      {item.items.map((tag) => (
                        <li
                          className="flex items-start gap-2 text-xs font-body leading-relaxed text-[oklch(0.4_0.02_50)]"
                          key={tag}
                        >
                          <svg
                            className="shrink-0 mt-0.5"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ color: "var(--rr-gold-deep)" }}
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why & For Whom ─── */}
      <section
        className="relative py-20 sm:py-28 overflow-hidden"
        style={{ background: "#0d1117" }}
      >
        <div
          className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full opacity-15 pointer-events-none"
          style={{ background: "oklch(0.82 0.15 75)", filter: "blur(100px)" }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Why */}
            <div>
              <span className="mb-3 block text-xs font-body font-semibold uppercase tracking-[0.22em] text-[oklch(0.82_0.15_75)]">
                Motivation
              </span>
              <h2 className="mb-8 text-3xl font-display font-bold leading-tight text-white sm:text-4xl">
                Why
              </h2>
              <ul className="space-y-4">
                {[
                  {
                    t: "Moral obligation to operate with a conscience",
                    sub: "",
                  },
                  {
                    t: "Awareness of changing landscape for business sustainability",
                    sub: "",
                  },
                  { t: "Because it is our DNA", sub: "" },
                  {
                    t: "Tech creates an enabling environment for high-impact projects",
                    sub: "High SROI",
                  },
                  {
                    t: "World-changing ideas need business builders",
                    sub: "People who have world-changing ideas don't necessarily know how to build a business around them.",
                  },
                  {
                    t: "Lack of awareness of negative impacts of tech",
                    sub: "Building the burning platform and building the bridge to get off it.",
                  },
                ].map((item) => (
                  <li key={item.t} className="flex gap-3">
                    <span
                      className="shrink-0 mt-1"
                      style={{ color: "oklch(0.82 0.15 75)" }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm font-body font-medium leading-snug text-white/85">
                        {item.t}
                      </p>
                      {item.sub && (
                        <p
                          className="text-xs mt-1 leading-relaxed"
                          style={{
                            color: "rgba(255,255,255,0.4)",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          {item.sub}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Whom */}
            <div>
              <span className="mb-3 block text-xs font-body font-semibold uppercase tracking-[0.22em] text-[var(--rr-gold-deep)]">
                Audience
              </span>
              <h2 className="mb-8 text-3xl font-display font-bold leading-tight text-white sm:text-4xl">
                For Whom
              </h2>
              <ul className="space-y-4">
                {[
                  {
                    t: "Dreamers",
                    sub: "The humans with the vision to better the world who want help to execute.",
                  },
                  {
                    t: "Universality of tech",
                    sub: "We want to change the world for everyone.",
                  },
                  {
                    t: "Industries that need it most",
                    sub: "Low-hanging fruit. The dirtiest industries.",
                  },
                  {
                    t: "Corporate managers",
                    sub: "Budget savings. Adapting to ESG revolution and shifting financial demographics.",
                  },
                  {
                    t: "People who want to live their values at work",
                    sub: "",
                  },
                ].map((item) => (
                  <li key={item.t} className="flex gap-3">
                    <span
                      className="shrink-0 mt-1"
                      style={{ color: "var(--rr-gold-deep)" }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm font-body font-medium leading-snug text-white/85">
                        {item.t}
                      </p>
                      {item.sub && (
                        <p
                          className="text-xs mt-1 leading-relaxed"
                          style={{
                            color: "rgba(255,255,255,0.4)",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          {item.sub}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="rr-public-cta py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="mb-5 text-3xl font-display font-bold text-white sm:text-4xl">
            Let&#39;s Build Something Different
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-base font-body leading-relaxed text-white/75 sm:text-lg">
            Ready to align capital with purpose? Tell us what you&#39;re trying
            to change.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-md bg-white px-8 py-4 text-sm font-body font-bold text-[var(--rr-navy)] shadow-lg transition-all hover:bg-white/90"
          >
            Start a Conversation
            <ArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
}
