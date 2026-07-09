import Link from "next/link";
import type { Metadata } from "next";

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
    color: "oklch(0.82 0.15 75)",
  },
  {
    title: "Boutique Business Planning",
    desc: "General purpose boutique business planning and consultancy.",
    items: [],
    color: "oklch(0.6 0.2 280)",
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
    color: "oklch(0.65 0.2 150)",
  },
  {
    title: "IT Supply Chain Optimization",
    desc: "IT supply chain optimization with regard to CSR/ESG.",
    items: [
      "Supply chain emissions (Scope III)",
      "Negotiating contracts & right-sizing",
      "Re-architect supply chains for carbon optimization",
    ],
    color: "oklch(0.55 0.15 30)",
  },
];

const howWeDoIt = [
  {
    title: "Deep Industry Expertise",
    desc: "Sector-leading knowledge across IT infrastructure, Web3, ESG, and impact investing - built over 25 years of active engagement.",
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
    <main>
      {/* ─── Hero ─── */}
      <section
        className="relative pt-32 pb-24 overflow-hidden"
        style={{ background: "oklch(0.09 0.02 250)" }}
      >
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
          style={{ background: "oklch(0.55 0.15 30)", filter: "blur(100px)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full opacity-10 pointer-events-none"
          style={{ background: "oklch(0.82 0.15 75)", filter: "blur(80px)" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <span
            className="text-xs font-semibold tracking-[0.22em] uppercase mb-4 block"
            style={{
              color: "oklch(0.82 0.15 75)",
              fontFamily: "var(--font-body)",
            }}
          >
            Our Values
          </span>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight max-w-3xl"
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.02em",
            }}
          >
            Powering
            <br />
            <span style={{ color: "oklch(0.82 0.15 75)" }}>
              Purpose-driven
            </span>{" "}
            Innovation
          </h1>
          <p
            className="text-base sm:text-lg leading-relaxed max-w-2xl"
            style={{
              color: "rgba(255,255,255,0.55)",
              fontFamily: "var(--font-body)",
            }}
          >
            There is a new model for doing business shaped and organized by a
            company's purpose, values and societal impact. Organizations
            understand that behavior, aligned with collective intention, is the
            path to success.
          </p>
        </div>
      </section>

      {/* ─── Founder's Story ─── */}
      <section
        className="relative py-20 sm:py-28 overflow-hidden"
        style={{ background: "#f7f4f0" }}
      >
        <div
          className="absolute -bottom-20 -right-20 w-[280px] h-[280px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "oklch(0.55 0.15 30)", filter: "blur(80px)" }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20 items-start">
            {/* Left - label + heading */}
            <div className="lg:sticky lg:top-32">
              <span
                className="text-xs font-semibold tracking-[0.22em] uppercase mb-4 block"
                style={{
                  color: "oklch(0.55 0.15 30)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Founder's Story
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold leading-tight"
                style={{
                  color: "oklch(0.12 0.02 50)",
                  fontFamily: "var(--font-display)",
                }}
              >
                Elevating the Way
                <br />
                <span style={{ color: "oklch(0.55 0.15 30)" }}>
                  Business Does
                  <br />
                  Business
                </span>
              </h2>
              <div
                className="mt-6 w-12 h-1 rounded-full"
                style={{ background: "oklch(0.82 0.15 75)" }}
              />
              <p
                className="mt-5 text-sm font-medium"
                style={{
                  color: "oklch(0.55 0.15 30)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                - Tony & Alex, Co-founders
              </p>
            </div>

            {/* Right - body */}
            <div
              className="space-y-5 text-base leading-relaxed"
              style={{
                color: "oklch(0.35 0.02 50)",
                fontFamily: "var(--font-body)",
              }}
            >
              <p>
                Hi, we're Tony and Alex - we founded RampRate in 2000 on the
                premise of elevating the way business does business. We could
                take the same connections that allowed us to cut 24% of each IT
                budget we touched and use them to kick down the barriers for
                tech innovators. We could take the same business planning rigor
                that we used to guide Sony, McKinsey, Microsoft or Intel on
                entering new markets and use it to help impact-driven startups
                reach their potential.
              </p>
              <p>
                So that's what we're doing today - we find the next unicorns and
                gatekeepers to impact that will not just earn millions yet
                better millions of lives. We grok their vision while putting
                them through bootcamp to be ready for life-changing
                opportunities. And then we kick down the barriers to their
                success by connecting them with our ecosystem and leveraging the
                trust we've built in the Fortune 1000 over 20-plus years to
                create opportunities few others can access.
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
      <section className="py-20 sm:py-24" style={{ background: "#0d1117" }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <span
            className="text-xs font-semibold tracking-[0.22em] uppercase mb-4 block"
            style={{
              color: "oklch(0.82 0.15 75)",
              fontFamily: "var(--font-body)",
            }}
          >
            Our Vision
          </span>
          <blockquote
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug"
            style={{ fontFamily: "var(--font-display)" }}
          >
            "We build an Ecosystem of impact-preneurs and trailblazers powered
            by opportunities, resources, innovation and{" "}
            <span style={{ color: "oklch(0.82 0.15 75)" }}>human spirit.</span>"
          </blockquote>
        </div>
      </section>

      {/* ─── Core Values & Principles ─── */}
      <section
        className="relative py-20 sm:py-28 overflow-hidden"
        style={{ background: "#f7f4f0" }}
      >
        <div
          className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none"
          style={{ background: "oklch(0.82 0.15 75)", filter: "blur(80px)" }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
          {/* Section header */}
          <div className="mb-12">
            <span
              className="text-xs font-semibold tracking-[0.22em] uppercase mb-3 block"
              style={{
                color: "oklch(0.55 0.15 30)",
                fontFamily: "var(--font-body)",
              }}
            >
              Principles of Engagement
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4 leading-tight"
              style={{
                color: "oklch(0.1 0.02 50)",
                fontFamily: "var(--font-display)",
              }}
            >
              Core Values &amp;{" "}
              <span style={{ color: "oklch(0.55 0.15 30)" }}>Principles</span>
            </h2>
            <p
              className="text-sm sm:text-base max-w-2xl leading-relaxed"
              style={{
                color: "oklch(0.45 0.02 50)",
                fontFamily: "var(--font-body)",
              }}
            >
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
                    i % 2 === 0 ? "oklch(0.82 0.15 75)" : "oklch(0.55 0.15 30)",
                  borderTop: "1px solid rgba(0,0,0,0.05)",
                  borderRight: "1px solid rgba(0,0,0,0.05)",
                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <span
                  className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{
                    background:
                      i % 2 === 0
                        ? "oklch(0.82 0.15 75 / 0.12)"
                        : "oklch(0.55 0.15 30 / 0.1)",
                    color:
                      i % 2 === 0
                        ? "oklch(0.55 0.12 75)"
                        : "oklch(0.55 0.15 30)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: "oklch(0.3 0.02 50)",
                    fontFamily: "var(--font-body)",
                  }}
                >
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
          style={{ background: "oklch(0.55 0.22 260)", filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-75 h-75 rounded-full opacity-10 pointer-events-none"
          style={{ background: "oklch(0.82 0.15 75)", filter: "blur(80px)" }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
          <div className="mb-12">
            <span
              className="text-xs font-semibold tracking-[0.22em] uppercase mb-3 block"
              style={{
                color: "oklch(0.82 0.15 75)",
                fontFamily: "var(--font-body)",
              }}
            >
              Our Practice
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              What We <span style={{ color: "oklch(0.82 0.15 75)" }}>Do</span>
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
                      className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                      style={{
                        background: `${item.color}22`,
                        color: item.color,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className="text-lg font-bold text-white leading-snug pt-1.5"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {item.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
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
                          key={li}
                          className="flex items-start gap-2.5 text-xs leading-relaxed"
                          style={{
                            color: "rgba(255,255,255,0.6)",
                            fontFamily: "var(--font-body)",
                          }}
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
          style={{ background: "oklch(0.55 0.15 30)", filter: "blur(80px)" }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
          {/* Section header */}
          <div className="mb-12">
            <span
              className="text-xs font-semibold tracking-[0.22em] uppercase mb-3 block"
              style={{
                color: "oklch(0.55 0.15 30)",
                fontFamily: "var(--font-body)",
              }}
            >
              Methodology
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold leading-tight"
              style={{
                color: "oklch(0.1 0.02 50)",
                fontFamily: "var(--font-display)",
              }}
            >
              How We <span style={{ color: "oklch(0.55 0.15 30)" }}>Do It</span>
            </h2>
            <div
              className="mt-4 w-12 h-1 rounded-full"
              style={{ background: "oklch(0.55 0.15 30)" }}
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
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                    style={{
                      background: "oklch(0.55 0.15 30)",
                      color: "white",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3
                    className="font-bold text-sm sm:text-base leading-snug"
                    style={{
                      color: "oklch(0.15 0.02 50)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {item.title}
                  </h3>
                </div>

                {/* Card body */}
                <div className="flex flex-col flex-1 px-6 py-5 gap-4">
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: "oklch(0.45 0.02 50)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {item.desc}
                  </p>

                  {item.items.length > 0 && (
                    <ul
                      className="space-y-2 mt-auto pt-3"
                      style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
                    >
                      {item.items.map((tag) => (
                        <li
                          key={tag}
                          className="flex items-start gap-2 text-xs leading-relaxed"
                          style={{
                            color: "oklch(0.4 0.02 50)",
                            fontFamily: "var(--font-body)",
                          }}
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
                            style={{ color: "oklch(0.55 0.15 30)" }}
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
              <span
                className="text-xs font-semibold tracking-[0.22em] uppercase mb-3 block"
                style={{
                  color: "oklch(0.82 0.15 75)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Motivation
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-white mb-8 leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
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
                      <p
                        className="text-sm font-medium text-white/85 leading-snug"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
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
              <span
                className="text-xs font-semibold tracking-[0.22em] uppercase mb-3 block"
                style={{
                  color: "oklch(0.55 0.15 30)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Audience
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-white mb-8 leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
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
                      style={{ color: "oklch(0.55 0.15 30)" }}
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
                      <p
                        className="text-sm font-medium text-white/85 leading-snug"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
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
      <section
        className="py-20 sm:py-24"
        style={{ background: "oklch(0.55 0.15 30)" }}
      >
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Let's Build Something Different
          </h2>
          <p
            className="text-white/75 text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Ready to align capital with purpose? Tell us what you're trying to
            change.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-bold bg-white shadow-lg transition-all hover:bg-white/90"
            style={{
              color: "oklch(0.35 0.1 30)",
              fontFamily: "var(--font-body)",
            }}
          >
            Start a Conversation
            <ArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
}
