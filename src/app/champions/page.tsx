import Link from "next/link";
import type { Metadata } from "next";
import { getPageSeo, withSeoOverrides } from "@/lib/sanity/seo";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";
import ChampionApplyForm from "@/components/champions/ChampionApplyForm";

const DESCRIPTION =
  "Introduce one company. RampRate qualifies it, runs it, and pays you when it closes. 7.5% of first-year collections, capped at $200,000 per client.";

const FALLBACK_METADATA: Metadata = {
  title: "Champion Program",
  description: DESCRIPTION,
  keywords: [
    "referral partner program",
    "advisory referral commission",
    "enterprise sourcing referrals",
    "RampRate Champion Program",
  ],
  alternates: { canonical: "/champions" },
  openGraph: {
    title: "Champion Program",
    description:
      "Introduce one company. We qualify it, run it, and pay you when it closes.",
    url: "https://ramprate.com/champions",
    type: "website",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Champion Program",
    description:
      "Introduce one company. We qualify it, run it, and pay you when it closes.",
    images: ["/og.png"],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageSeo("/champions");
  return withSeoOverrides(FALLBACK_METADATA, data?.seo);
}

const HERO_STATS = [
  { value: "7.5%", label: "Of first-year collections" },
  { value: "48 hours", label: "To a yes or a no" },
  { value: "$10B+", label: "Decisions transacted" },
  { value: "50+", label: "Countries" },
];

const STEPS = [
  {
    title: "You introduce",
    body: "One email or one form. Name, company, and what you think the problem is. That is the whole ask. You do not need to pitch us or explain what we do.",
  },
  {
    title: "We qualify inside 48 hours",
    body: "You get a straight yes or no and the reason behind it. If it is not a fit we say so quickly rather than leaving it open. Your introduction is timestamped the moment it arrives, so your claim on it is protected from that point on.",
  },
  {
    title: "We run it",
    body: "Proposal, negotiation, delivery. You stay informed and you do not have to do anything. When a proposal goes out we tell you, and we tell you what happens next.",
  },
  {
    title: "You get paid when it closes",
    body: "No invoicing, no following up, no reminders from you.",
    payline: {
      headline:
        "7.5% of everything we collect in the first year, up to $200,000 per client.",
      note: "Paid on collection rather than on signature, and paid without you asking.",
    },
  },
];

type PracticeRow = {
  term: string;
  text?: string;
  items?: string[];
};

type Practice = {
  tag: string;
  title: string;
  blurb: string;
  href: string;
  linkLabel: string;
  rows: PracticeRow[];
  notFit?: string;
};

const PRACTICES: Practice[] = [
  {
    tag: "Syzygy",
    title: "Startups and founders",
    blurb:
      "Companies past the point where an advisory fee causes resentment rather than creating value.",
    href: "/growth",
    linkLabel: "About Syzygy",
    rows: [
      {
        term: "Size, any one of these",
        items: [
          "$2M or more raised in the last 18 months",
          "$1M annual revenue",
          "$500K cash in the bank",
          "Six or more full-time employees on real salaries, not sweat equity",
        ],
      },
      {
        term: "Stability, either of these",
        items: [
          "Cash flow positive across the last two to three quarters",
          "Nine to twelve months of runway at current burn",
        ],
      },
      {
        term: "Impact",
        text: "Either directly focused on social impact, or willing to invest in making it material. Donating a share of profits does not count. Hiring into opportunity zones, piping data center heat into community greenhouses, or routing traffic away from polluters does.",
      },
      {
        term: "What they need from us",
        text: "Pain in strategy, operations, marketing, or finding enterprise anchor clients.",
      },
    ],
    notFit: "Not a fit: anyone whose only pursuit right now is raising money.",
  },
  {
    tag: "RampRate",
    title: "Enterprise technology sourcing",
    blurb:
      "Organizations who suspect they are overpaying on infrastructure and cannot prove it.",
    href: "/sourcing",
    linkLabel: "About Sourcing",
    rows: [
      {
        term: "Annual spend in scope",
        items: [
          "$5M minimum, and $50M or more is where we do our best work",
          "We can flex to around $1M if the scope is simple, data center or CDN only",
          "Helpdesk needs $10M to $20M because of the added complexity",
        ],
      },
      {
        term: "Willingness to engage",
        text: "For new capacity, willing to pay a project fee that is refundable against vendor referral fees. For renegotiation, willing to share contracts, three months of bills, and read-only portal access so we can estimate savings before anyone commits.",
      },
    ],
  },
  {
    tag: "BioChain",
    title: "Biologics and peptide sourcing",
    blurb:
      "Clinics, compounding pharmacy networks, longevity practices and biotech.",
    href: "/biochain",
    linkLabel: "About BioChain",
    rows: [
      {
        term: "Annual biologics spend",
        text: "$50,000 minimum. The range where this compounds is $150,000 to $2M.",
      },
      {
        term: "Situation",
        text: "Currently buying through retail or distribution channels and suspect they are overpaying, or have had quality inconsistency and documentation gaps from existing suppliers.",
      },
      {
        term: "Decision speed",
        text: "A purchasing decision-maker who can move within 30 to 60 days.",
      },
    ],
  },
  {
    tag: "Stratum",
    title: "Web3 and blockchain",
    blurb:
      "Data-focused or enterprise-facing work rather than consumer speculation.",
    href: "/web3",
    linkLabel: "About Stratum",
    rows: [
      {
        term: "Focus",
        text: "Self-sovereign identity, impact validation, decentralized governance, or enterprise-facing infrastructure.",
      },
      {
        term: "Thresholds",
        text: "Where the company is enterprise-facing, the startup size and stability lines above apply unchanged.",
      },
    ],
  },
  {
    tag: "ImpactSoul",
    title: "NGOs and foundations",
    blurb:
      "Mission-driven organizations building sustainable operating models.",
    href: "/impactsoul",
    linkLabel: "About ImpactSoul",
    rows: [
      {
        term: "Brand strength",
        text: "Marketable enough to raise a technology grant of $1M or more. XPRIZE, the Nature Conservancy and the Burning Man Org are the reference points.",
      },
      {
        term: "Measurement",
        text: "Strong quantification of impact already in place, or a real intention to build it.",
      },
      {
        term: "Community",
        text: "An active community, or a wish to make better use of one they already have.",
      },
    ],
  },
  {
    tag: "ImpactSoul",
    title: "Assets for tokenization",
    blurb:
      "Real assets with real cash flows, held by owners open to shared ownership.",
    href: "/impactsoul",
    linkLabel: "About ImpactSoul",
    rows: [
      {
        term: "Valuation",
        text: "Objectively verifiable, between $5M and $50M.",
      },
      {
        term: "Cash flow",
        text: "At least ten percent of that valuation. A $50M asset should be producing around $5M net.",
      },
      {
        term: "Ownership",
        text: "Things they already own. Not things they intend to buy or launch with the proceeds.",
      },
      {
        term: "Posture",
        text: "Open to trading a small share of equity for a community large enough to change what the asset is worth.",
      },
    ],
  },
  {
    tag: "All practices",
    title: "Venture funds",
    blurb: "Funds that work with their portfolio rather than just funding it.",
    href: "/proof",
    linkLabel: "See our work",
    rows: [
      {
        term: "Stage and size",
        text: "Early stage, seed through Series A and sometimes B, writing checks between $1M and $50M.",
      },
      {
        term: "Involvement",
        text: "Operationally involved with their portfolio, and with some overlap into the verticals above.",
      },
    ],
  },
];

const EXCLUSIONS = [
  "Companies whose only current activity is raising money.",
  "Teams working entirely for equity, where our fee would create resentment rather than value.",
  "Alternative medicine businesses with no lab testing or trials, at least in the pipeline. If the pitch is that big pharma is bad and the alternative is ancient wisdom, it is not a fit for us.",
  "Anyone below the spend thresholds above. We would rather tell you now than three weeks in.",
];

const GETS = [
  {
    title: "An answer inside 48 hours",
    body: "Yes or no, with the reason behind it. A fast no is worth more to you than a slow maybe.",
  },
  {
    title: "A resource portal",
    body: "The pitch in one paragraph, decks and links you can forward, email templates, and the full qualification criteria so you can screen before you introduce.",
  },
  {
    title: "Proposal visibility",
    body: "When a proposal goes out we tell you, and we tell you what your upside looks like if you help us close it.",
  },
  {
    title: "A standing check-in",
    body: "A short regular call on what is moving and what stalled, so you know where your introductions stand without having to ask.",
  },
  {
    title: "Commission paid without chasing",
    body: "We pay proactively on collection. You do not invoice us and you do not follow up.",
  },
];

const TERMS = [
  {
    term: "Commission",
    text: "7.5% of everything we collect in the first year of the engagement.",
  },
  { term: "Cap", text: "$200,000 per client." },
  {
    term: "Paid",
    text: "On collection, proactively, without you invoicing or chasing.",
  },
  {
    term: "Exclusivity",
    text: "None. Applying does not commit you to introducing anyone, ever.",
  },
  {
    term: "Your claim",
    text: "Timestamped at the moment your introduction arrives.",
  },
];

export default function ChampionsPage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Champion Program", url: "https://ramprate.com/champions" },
        ])}
      />

      {/* ═══ HERO ═══ */}
      <section
        className="relative pt-32 pb-20 sm:pt-36 sm:pb-24 overflow-hidden"
        style={{
          background:
            "radial-gradient(120% 90% at 10% 0%, rgba(119,40,204,0.45) 0%, rgba(20,16,31,0) 60%), linear-gradient(160deg, var(--champion-night-2) 0%, var(--champion-night) 68%)",
        }}
      >
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
          <p
            className="text-sm font-semibold mb-5"
            style={{
              color: "var(--champion-light)",
              fontFamily: "var(--font-body)",
            }}
          >
            Champion Program
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight max-w-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            You know who needs us. We do the rest.
          </h1>
          <p
            className="mt-6 text-lg sm:text-xl leading-relaxed max-w-2xl"
            style={{
              color: "var(--champion-hero-text)",
              fontFamily: "var(--font-body)",
            }}
          >
            Introduce one company. We qualify it, run it, and pay you when it
            closes. No selling, no managing the relationship, no chasing us for
            updates.
          </p>

          <div className="mt-9 flex flex-wrap gap-3.5">
            <Link
              href="#apply"
              className="inline-block rounded-lg px-8 py-4 text-base font-semibold text-white transition-opacity hover:opacity-90"
              style={{
                background: "var(--champion)",
                fontFamily: "var(--font-body)",
              }}
            >
              Apply to become a Champion
            </Link>
            <Link
              href="#qualifies"
              className="inline-block rounded-lg px-7 py-4 text-base font-semibold text-white transition-colors"
              style={{
                border: "1px solid rgba(255,255,255,0.3)",
                fontFamily: "var(--font-body)",
              }}
            >
              See what qualifies
            </Link>
          </div>

          <div
            className="mt-14 pt-8 flex flex-wrap gap-8 sm:gap-12"
            style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}
          >
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="min-w-[130px]">
                <div
                  className="text-2xl sm:text-3xl font-bold text-white leading-tight"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {stat.value}
                </div>
                <div
                  className="mt-1 text-sm"
                  style={{
                    color: "var(--champion-hero-label)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 01 HOW IT WORKS ═══ */}
      <section
        className="py-16 sm:py-24"
        style={{ background: "var(--champion-paper)" }}
      >
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <p
            className="text-sm font-semibold mb-3.5"
            style={{
              color: "var(--champion)",
              fontFamily: "var(--font-body)",
            }}
          >
            01 · How it works
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{
              color: "var(--champion-ink)",
              fontFamily: "var(--font-display)",
            }}
          >
            Four steps. Your part is the first one.
          </h2>
          <p
            className="mt-4 mb-12 text-lg leading-relaxed"
            style={{
              color: "var(--champion-body)",
              fontFamily: "var(--font-body)",
            }}
          >
            Everything after the introduction is ours to carry. You stay
            informed, and you are never the one holding it together.
          </p>

          <ol className="champion-steps">
            {STEPS.map((step) => (
              <li key={step.title} className="champion-step">
                <h3
                  className="text-xl font-bold pt-1.5 mb-2"
                  style={{
                    color: "var(--champion-ink)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-base leading-relaxed max-w-[58ch]"
                  style={{
                    color: "var(--champion-body)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {step.body}
                </p>
                {step.payline && (
                  <div
                    className="mt-4 rounded-xl px-6 py-5 max-w-[58ch]"
                    style={{ background: "var(--champion-faint)" }}
                  >
                    <b
                      className="text-lg"
                      style={{
                        color: "var(--champion-ink)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {step.payline.headline}
                    </b>
                    <span
                      className="block mt-1.5 text-[15px]"
                      style={{
                        color: "var(--champion-muted)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {step.payline.note}
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══ 02 WHAT QUALIFIES ═══ */}
      <section
        id="qualifies"
        className="py-16 sm:py-24 scroll-mt-20"
        style={{
          background: "var(--champion-paper)",
          borderTop: "1px solid var(--champion-line)",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <p
            className="text-sm font-semibold mb-3.5"
            style={{
              color: "var(--champion)",
              fontFamily: "var(--font-body)",
            }}
          >
            02 · What qualifies
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{
              color: "var(--champion-ink)",
              fontFamily: "var(--font-display)",
            }}
          >
            Real thresholds, not guidance.
          </h2>
          <p
            className="mt-4 mb-12 text-lg leading-relaxed max-w-[60ch]"
            style={{
              color: "var(--champion-body)",
              fontFamily: "var(--font-body)",
            }}
          >
            Below these lines we will say no, and we would rather you knew that
            before you spend a relationship on it. Screen against this list and
            your first introduction is far more likely to become your first
            payment.
          </p>

          <div style={{ borderTop: "2px solid var(--champion-ink)" }}>
            {PRACTICES.map((practice, index) => (
              <div
                key={`${practice.tag}-${practice.title}`}
                className="grid md:grid-cols-[270px_1fr] gap-5 md:gap-11 py-9"
                style={{
                  borderTop:
                    index === 0 ? undefined : "1px solid var(--champion-line)",
                  borderBottom:
                    index === PRACTICES.length - 1
                      ? "1px solid var(--champion-line)"
                      : undefined,
                }}
              >
                <div>
                  <span
                    className="inline-block text-[13px] font-semibold rounded px-2.5 py-0.5 mb-2.5"
                    style={{
                      color: "var(--champion)",
                      background: "var(--champion-faint)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {practice.tag}
                  </span>
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{
                      color: "var(--champion-ink)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {practice.title}
                  </h3>
                  <p
                    className="text-[15px] leading-relaxed mb-2.5"
                    style={{
                      color: "var(--champion-muted)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {practice.blurb}
                  </p>
                  <Link
                    href={practice.href}
                    className="text-[15px] font-semibold hover:underline"
                    style={{
                      color: "var(--champion)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {practice.linkLabel}
                  </Link>
                </div>

                <dl className="m-0">
                  {practice.rows.map((row, rowIndex) => (
                    <div key={row.term}>
                      <dt
                        className="text-[13px] font-bold"
                        style={{
                          color: "var(--champion-ink)",
                          paddingTop: rowIndex === 0 ? 0 : "16px",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {row.term}
                      </dt>
                      <dd
                        className="mt-1.5 ml-0 text-base leading-relaxed"
                        style={{
                          color: "var(--champion-body)",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {row.items ? (
                          <ul className="list-disc pl-5 space-y-1.5">
                            {row.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          row.text
                        )}
                      </dd>
                    </div>
                  ))}
                  {practice.notFit && (
                    <dd
                      className="mt-5 ml-0 pl-3.5 text-[15px] leading-relaxed"
                      style={{
                        color: "var(--champion-muted)",
                        borderLeft: "3px solid var(--champion-line-strong)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {practice.notFit}
                    </dd>
                  )}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 03 WHAT DOES NOT QUALIFY ═══ */}
      <section
        className="py-16 sm:py-24"
        style={{ background: "var(--champion-tint)" }}
      >
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <p
            className="text-sm font-semibold mb-3.5"
            style={{
              color: "var(--champion)",
              fontFamily: "var(--font-body)",
            }}
          >
            03 · What does not qualify
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{
              color: "var(--champion-ink)",
              fontFamily: "var(--font-display)",
            }}
          >
            We will say no to these.
          </h2>
          <p
            className="mt-4 mb-10 text-lg leading-relaxed"
            style={{
              color: "var(--champion-body)",
              fontFamily: "var(--font-body)",
            }}
          >
            Please do not spend your relationship capital on them. A referral we
            decline costs you more than it costs us.
          </p>
          <ul className="list-none m-0 p-0">
            {EXCLUSIONS.map((item) => (
              <li
                key={item}
                className="relative py-5 pl-7 text-base leading-relaxed max-w-[64ch]"
                style={{
                  borderTop: "1px solid var(--champion-line)",
                  color: "var(--champion-body)",
                  fontFamily: "var(--font-body)",
                }}
              >
                <span
                  className="absolute left-0 top-8 w-3.5 h-0.5"
                  style={{ background: "var(--champion)" }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══ 04 WHAT YOU GET ═══ */}
      <section
        className="py-16 sm:py-24"
        style={{ background: "var(--champion-paper)" }}
      >
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <p
            className="text-sm font-semibold mb-3.5"
            style={{
              color: "var(--champion)",
              fontFamily: "var(--font-body)",
            }}
          >
            04 · What you get
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{
              color: "var(--champion-ink)",
              fontFamily: "var(--font-display)",
            }}
          >
            The introduction is the easy part.
          </h2>
          <p
            className="mt-4 mb-10 text-lg leading-relaxed"
            style={{
              color: "var(--champion-body)",
              fontFamily: "var(--font-body)",
            }}
          >
            Everything below exists so that you are never guessing about what
            happened to it.
          </p>
          <ul className="list-none m-0 p-0">
            {GETS.map((item, index) => (
              <li
                key={item.title}
                className="py-6 max-w-[66ch]"
                style={{
                  borderTop:
                    index === 0 ? "1px solid var(--champion-line)" : undefined,
                  borderBottom: "1px solid var(--champion-line)",
                }}
              >
                <strong
                  className="block text-lg mb-1"
                  style={{
                    color: "var(--champion-ink)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {item.title}
                </strong>
                <span
                  className="text-base leading-relaxed"
                  style={{
                    color: "var(--champion-body)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {item.body}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══ 05 APPLY ═══ */}
      <section
        id="apply"
        className="py-16 sm:py-24 scroll-mt-20"
        style={{ background: "var(--champion-tint)" }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <p
              className="text-sm font-semibold mb-3.5"
              style={{
                color: "var(--champion)",
                fontFamily: "var(--font-body)",
              }}
            >
              05 · Apply
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{
                color: "var(--champion-ink)",
                fontFamily: "var(--font-display)",
              }}
            >
              One signature, and you are in.
            </h2>
            <p
              className="mt-4 mb-8 text-lg leading-relaxed"
              style={{
                color: "var(--champion-body)",
                fontFamily: "var(--font-body)",
              }}
            >
              The agreement and the confidentiality terms arrive as a single
              document, already signed on our side. You get a countersigned copy
              back the moment you sign.
            </p>
            <dl
              className="pt-6"
              style={{ borderTop: "1px solid var(--champion-line-strong)" }}
            >
              {TERMS.map((item, index) => (
                <div key={item.term}>
                  <dt
                    className="text-[13px] font-bold"
                    style={{
                      color: "var(--champion-ink)",
                      paddingTop: index === 0 ? 0 : "16px",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {item.term}
                  </dt>
                  <dd
                    className="mt-1 ml-0 text-base"
                    style={{
                      color: "var(--champion-body)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {item.text}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <ChampionApplyForm />
        </div>
      </section>

      {/* ═══ CLOSER ═══ */}
      <section
        className="py-16 sm:py-24"
        style={{
          background:
            "linear-gradient(160deg, var(--champion-night-2) 0%, var(--champion-night) 70%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white max-w-[22ch]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Not sure if your contact qualifies?
          </h2>
          <p
            className="mt-5 mb-8 text-lg leading-relaxed max-w-[54ch]"
            style={{
              color: "var(--champion-hero-text)",
              fontFamily: "var(--font-body)",
            }}
          >
            Send it anyway. A no inside 48 hours costs you nothing. Guessing
            costs you the introduction.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <Link
              href="#apply"
              className="inline-block rounded-lg px-8 py-4 text-base font-semibold text-white transition-opacity hover:opacity-90"
              style={{
                background: "var(--champion)",
                fontFamily: "var(--font-body)",
              }}
            >
              Apply to become a Champion
            </Link>
            <Link
              href="/contact"
              className="inline-block rounded-lg px-7 py-4 text-base font-semibold text-white transition-colors"
              style={{
                border: "1px solid rgba(255,255,255,0.3)",
                fontFamily: "var(--font-body)",
              }}
            >
              Talk to us first
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
