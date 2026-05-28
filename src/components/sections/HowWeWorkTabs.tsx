"use client";

import { useState } from "react";
import Link from "next/link";

// ── Shared style tokens ───────────────────────────────────────────────────────
const sectionLabel = "text-[11px] font-semibold uppercase tracking-[0.2em]";
const h2Class = "text-3xl sm:text-4xl font-bold leading-tight text-white";
const bodyText = "text-sm sm:text-base leading-relaxed";
const monoLabel = "text-[10px] font-semibold uppercase tracking-widest";

// ── Data ──────────────────────────────────────────────────────────────────────
const steps = [
  {
    num: "01",
    title: "Exclusive Mandate",
    body: "We usually only engage when the buyer or seller grants us an exclusive. That means we arrive at every conversation already under contract — vetted, authorized, and fully accountable. We don't shop deals. We don't float rumors. We represent one side, one opportunity, all the way through close.",
  },
  {
    num: "02",
    title: "One-Party Fee. Full Transparency.",
    body: "In 90% of engagements we are paid by one party only — buyer or seller, never both. On larger transactions requiring mediation or deeper professional services, both parties occasionally share a disclosed consulting or transaction fee. Either way, every party in the deal — including any brokers or channel partners — knows exactly who is paying us, how much, and how it flows into the margin. No hidden layers. No surprises. Ever. This has been the model for 25 years.",
  },
  {
    num: "03",
    title: "Deep Discovery",
    body: "Before any supplier sees a brief, we build a complete picture of what the buyer actually needs — not just what they asked for. Requirements, priorities, budget reality, success metrics, and deal-breakers. This is where most advisory fails. We don't.",
  },
  {
    num: "04",
    title: "Apples-to-Apples RFP",
    body: "We structure the RFP so every supplier responds to the same question. No ambiguity. No room for incumbents to game the framing. Every proposal is evaluated against the same criteria, at the same moment, with the same scorecard. Fairness is structural — not aspirational.",
  },
  {
    num: "05",
    title: "Value Creation Framework",
    body: "Price is never the only variable. We evaluate total value — delivery quality, partnership potential, upside, risk, and long-term fit. A supplier who delivers at a great price with real alignment beats a cheaper one who creates friction. We make sure the buyer knows the difference.",
  },
  {
    num: "06",
    title: "Protected Introduction",
    body: "Non-circumvention runs both ways. Once we make an introduction, the deal stays in structure. The buyer can't go around the supplier. The supplier can't go around us. Everyone's contribution is protected — including yours. This bilateral protection is exactly why the non-circ exists.",
  },
  {
    num: "07",
    title: "Through-Close Support",
    body: "We don't disappear after introductions. We manage the process, close gaps in communication, and ensure both sides reach a deal they're proud of. Our fee is tied to success. That alignment is the whole model.",
  },
];

const feeItems = [
  {
    pct: "90%",
    title: "Single-Party Engagement",
    body: "We are retained and paid exclusively by one party — either the buyer or the seller. The other party pays nothing. This is the standard RampRate model for the vast majority of engagements. Our exclusive mandate with the paying party is disclosed to all parties in the deal.",
    primary: true,
  },
  {
    pct: "10%",
    title: "Mediated Transaction Fee",
    body: "On larger or more complex transactions requiring deeper professional services — such as multi-party mediation or extended advisory — both parties may each contribute a disclosed consulting or transaction fee. Agreed upfront, documented, and fully transparent before any work begins.",
    primary: false,
  },
];

const clients = [
  { sector: "Insurance", names: "AON" },
  { sector: "Financial Services", names: "Merrill Lynch, Goldman Sachs" },
  { sector: "Technology", names: "Microsoft (75+ projects), eBay, Intel" },
  {
    sector: "Media & Entertainment",
    names: "Hearst, Riot Games, Disney, NBC, Fox, CBS",
  },
  {
    sector: "Sports & Athletic Brands",
    names: "Nike",
  },
  {
    sector: "Consumer Electronics",
    names: "Sony",
  },
  {
    sector: "Health & Wellness",
    names:
      "Wavemaker Three-Sixty Health, Beckley Psytech, Radicle Science, MycoMedica",
  },
  {
    sector: "Healthcare Tech",
    names: "Anonymous healthcare wallet (patient data sovereignty)",
  },
];

const links = [
  {
    label: "Who We Are",
    href: "/about",
    desc: "Team, values, 25-year track record",
    external: false,
  },
  {
    label: "How We Work",
    href: "/expertise",
    desc: "Compensation model, delivery practices",
    external: false,
  },
  {
    label: "B Corp Certification",
    href: "/ramprate-is-b-certified-corp-the-accolade-is-a-clear-sign-our-business-is-on-the-right-track",
    desc: "Verified transparency — top 4,000 globally",
    external: false,
  },
  {
    label: "Client Proof",
    href: "/proof",
    desc: "Real results, named clients, no spin",
    external: false,
  },
  {
    label: "Client List",
    href: "/it-sourcing/clients",
    desc: "250+ enterprise engagements",
    external: false,
  },
  {
    label: "Buyers & Sellers Series",
    href: "https://tonygreenberg.com/the-buyers-sellers-honesty-dance-2/",
    desc: "Tony's philosophy on fair deal structure",
    external: true,
  },
  {
    label: "Origin Story",
    href: "https://tonygreenberg.com/making-fit-like-good-shoe-10-years-later-ramprate-long/",
    desc: "Why RampRate was founded and how it works",
    external: true,
  },
  {
    label: "tonygreenberg.com",
    href: "https://tonygreenberg.com",
    desc: "Tony's writing, speaking, perspective",
    external: true,
  },
];

const tabs = [
  { id: "process", label: "Process" },
  { id: "model", label: "Fee Model" },
  { id: "clients", label: "Clients" },
  { id: "links", label: "Links" },
];

// ── Shared icons ──────────────────────────────────────────────────────────────
const ArrowRight = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const ExternalIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────
export default function HowWeWorkTabs() {
  const [activeTab, setActiveTab] = useState("process");
  const [openStep, setOpenStep] = useState<number | null>(null);

  return (
    <div>
      {/* ── Sticky Tab Nav ── */}
      <div
        className="sticky top-16 sm:top-20 z-40 border-b"
        style={{
          background: "var(--dark)",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="shrink-0 px-5 sm:px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors border-b-2"
              style={{
                fontFamily: "var(--font-mono)",
                color:
                  activeTab === tab.id
                    ? "oklch(0.82 0.15 75)"
                    : "rgba(255,255,255,0.35)",
                borderBottomColor:
                  activeTab === tab.id ? "oklch(0.82 0.15 75)" : "transparent",
                background: "transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Process Tab ── */}
      {activeTab === "process" && (
        <section
          className="py-16 sm:py-20 px-5 sm:px-8"
          style={{ background: "var(--dark)" }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto">
              {steps.map((step, i) => {
                const isOpen = openStep === i;
                return (
                  <div
                    key={i}
                    className="border-b rounded-lg mb-1 transition-colors"
                    style={{
                      borderColor: "rgba(255,255,255,0.07)",
                      background: isOpen
                        ? "rgba(212,168,67,0.06)"
                        : "rgba(255,255,255,0.02)",
                    }}
                  >
                    <button
                      onClick={() => setOpenStep(isOpen ? null : i)}
                      className="w-full text-left py-5 sm:py-6 px-4 flex items-center gap-5 group"
                    >
                      <span
                        className={`${monoLabel} shrink-0`}
                        style={{
                          color: "oklch(0.82 0.15 75)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {step.num}
                      </span>
                      <div className="flex-1 flex items-center justify-between gap-4">
                        <h3
                          className="text-base sm:text-lg font-semibold text-white group-hover:text-[oklch(0.82_0.15_75)] transition-colors"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {step.title}
                        </h3>
                        {/* Prominent expand indicator */}
                        <span
                          className="shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-200"
                          style={{
                            borderColor: isOpen
                              ? "oklch(0.82 0.15 75)"
                              : "rgba(255,255,255,0.25)",
                            background: isOpen
                              ? "rgba(212,168,67,0.15)"
                              : "rgba(255,255,255,0.05)",
                            color: isOpen
                              ? "oklch(0.82 0.15 75)"
                              : "rgba(255,255,255,0.6)",
                            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                          </svg>
                        </span>
                      </div>
                    </button>

                    {isOpen && (
                      <p
                        className={`${bodyText} pb-6 px-4 pl-14`}
                        style={{
                          color: "rgba(255,255,255,0.5)",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {step.body}
                      </p>
                    )}
                  </div>
                );
              })}

              {/* Pull quote */}
              <div
                className="mt-10 p-6 sm:p-8 rounded-lg border-l-4"
                style={{
                  background: "rgba(212,168,67,0.06)",
                  borderLeftColor: "oklch(0.82 0.15 75)",
                }}
              >
                <p
                  className="text-lg sm:text-xl font-bold text-white leading-snug mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  &ldquo;We don&apos;t charge upfront. We eat what we
                  hunt.&rdquo;
                </p>
                <p
                  className={bodyText}
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Our fee is tied to your deal closing. In 25 years we have
                  never invoiced and disappeared. That alignment is the whole
                  model.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Fee Model Tab ── */}
      {activeTab === "model" && (
        <section
          className="py-16 sm:py-20 px-5 sm:px-8"
          style={{ background: "var(--dark)" }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto">
              <p
                className={`${sectionLabel} mb-3`}
                style={{
                  color: "oklch(0.82 0.15 75)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                Fee Structure
              </p>
              <h2
                className={`${h2Class} mb-3`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                Full Transparency. By Design.
              </h2>
              <p
                className={`${bodyText} mb-10`}
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Prepared for attorney review. Every party in every deal knows
                exactly who pays us, how much, and how it flows.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                {feeItems.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-6 sm:p-7 flex flex-col gap-4 border"
                    style={{
                      background: item.primary
                        ? "rgba(212,168,67,0.06)"
                        : "rgba(255,255,255,0.03)",
                      borderColor: item.primary
                        ? "rgba(212,168,67,0.25)"
                        : "rgba(255,255,255,0.07)",
                    }}
                  >
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-5xl sm:text-6xl font-bold leading-none"
                        style={{
                          color: "oklch(0.82 0.15 75)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {item.pct}
                      </span>
                      <span
                        className={monoLabel}
                        style={{
                          color: "rgba(255,255,255,0.3)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        of engagements
                      </span>
                    </div>
                    <h3
                      className="text-base sm:text-lg font-semibold text-white"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: "rgba(255,255,255,0.45)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>

              {/* Constant note */}
              <div
                className="rounded-lg p-5 sm:p-6 border mb-5"
                style={{
                  background: "rgba(212,168,67,0.05)",
                  borderColor: "rgba(212,168,67,0.2)",
                }}
              >
                <p
                  className="text-sm font-semibold text-white mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  The Constant in Both Models
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Regardless of structure, every party in every deal — including
                  brokers and channel partners — knows exactly who is paying
                  RampRate, how much, and how it flows into the margin. Verified
                  by our B Corp certification for 25 years.
                </p>
              </div>

              {/* B Corp badge */}
              <div
                className="flex items-center gap-4 p-5 rounded-lg border"
                style={{ borderColor: "rgba(255,255,255,0.07)" }}
              >
                <div
                  className="w-11 h-11 rounded-full border-2 flex items-center justify-center shrink-0"
                  style={{ borderColor: "oklch(0.82 0.15 75)" }}
                >
                  <span
                    className="text-base font-bold"
                    style={{
                      color: "oklch(0.82 0.15 75)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    B
                  </span>
                </div>
                <div>
                  <p
                    className={`${monoLabel} text-white mb-0.5`}
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Certified B Corporation
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    Top 4,000 globally out of 100,000+ applicants. Verified
                    social and environmental standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Clients Tab ── */}
      {activeTab === "clients" && (
        <section
          className="py-16 sm:py-20 px-5 sm:px-8"
          style={{ background: "var(--dark)" }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto">
              <p
                className={`${sectionLabel} mb-3`}
                style={{
                  color: "oklch(0.82 0.15 75)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                Client Sectors
              </p>
              <h2
                className={`${h2Class} mb-3`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                250+ Enterprise Clients
              </h2>
              <p
                className={`${bodyText} mb-10`}
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "var(--font-body)",
                }}
              >
                $10B+ in enterprise decisions structured across 50+ countries
                over 25 years.
              </p>

              <div className="flex flex-col gap-3">
                {clients.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-5 border border-l-4"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      borderColor: "rgba(255,255,255,0.07)",
                      borderLeftColor: "oklch(0.82 0.15 75)",
                    }}
                  >
                    <p
                      className={`${monoLabel} mb-1.5`}
                      style={{
                        color: "oklch(0.82 0.15 75)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {c.sector}
                    </p>
                    <p
                      className="text-sm font-medium text-white leading-relaxed"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {c.names}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className="mt-5 rounded-lg p-5 text-sm leading-relaxed border"
                style={{
                  background: "rgba(212,168,67,0.05)",
                  borderColor: "rgba(212,168,67,0.15)",
                  color: "rgba(255,255,255,0.45)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Health and wellness is not new territory for RampRate. Our
                dedicated Health and Wellness practice covers health tech,
                psychedelics, natural wellness, and healthcare infrastructure —
                with an LP position in{" "}
                <a
                  href="https://wavemakerhealthandwellness.com"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold hover:opacity-80 transition-opacity"
                  style={{ color: "oklch(0.82 0.15 75)" }}
                >
                  Wavemaker Three-Sixty Health
                </a>
                .
              </div>

              <Link
                href="/proof"
                className="mt-5 flex items-center justify-center gap-2 py-4 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  background: "oklch(0.82 0.15 75)",
                  color: "oklch(0.18 0.03 50)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Full Client List + Case Studies
                <ArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Links Tab ── */}
      {activeTab === "links" && (
        <section
          className="py-16 sm:py-20 px-5 sm:px-8"
          style={{ background: "var(--dark)" }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto">
              <p
                className={`${sectionLabel} mb-3`}
                style={{
                  color: "oklch(0.82 0.15 75)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                Reference Links
              </p>
              <h2
                className={`${h2Class} mb-3`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                Source Material
              </h2>
              <p
                className={`${bodyText} mb-10`}
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "var(--font-body)",
                }}
              >
                All source material for attorney review. Each link is a live
                public URL.
              </p>

              <div className="flex flex-col gap-3">
                {links.map((link, i) => {
                  const inner = (
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p
                          className="text-sm font-semibold text-white mb-1 group-hover:text-[oklch(0.82_0.15_75)] transition-colors"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {link.label}
                        </p>
                        <p
                          className="text-xs leading-relaxed"
                          style={{
                            color: "rgba(255,255,255,0.35)",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          {link.desc}
                        </p>
                      </div>
                      <span
                        className="shrink-0 mt-0.5"
                        style={{ color: "rgba(255,255,255,0.2)" }}
                      >
                        {link.external ? <ExternalIcon /> : <ArrowRight />}
                      </span>
                    </div>
                  );

                  const cardClass =
                    "rounded-lg p-5 border block group transition-colors hover:border-[rgba(212,168,67,0.3)]";
                  const cardStyle = {
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.07)",
                  };

                  return link.external ? (
                    <a
                      key={i}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className={cardClass}
                      style={cardStyle}
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link
                      key={i}
                      href={link.href}
                      className={cardClass}
                      style={cardStyle}
                    >
                      {inner}
                    </Link>
                  );
                })}
              </div>

              <div
                className="mt-5 rounded-lg p-5 border text-xs leading-relaxed"
                style={{
                  borderColor: "rgba(255,255,255,0.07)",
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: "var(--font-body)",
                }}
              >
                This document was prepared by RampRate for the purpose of
                explaining our engagement model, fee structure, and client track
                record. For legal questions contact:{" "}
                <a
                  href="mailto:josh@ramprate.com"
                  className="font-semibold hover:opacity-80 transition-opacity"
                  style={{ color: "oklch(0.82 0.15 75)" }}
                >
                  josh@ramprate.com
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
