import Link from "next/link";
import type { Metadata } from "next";
import { getPageSeo, withSeoOverrides } from "@/lib/sanity/seo";

const FALLBACK_METADATA: Metadata = {
  title:
    "Private Advisory - Because Some Challenges Require More Than an Advisor",
  description:
    "RampRate Private Advisory sources, vets, and coordinates the legal and financial specialists high-stakes disputes require - equity disputes, stalled claims, discovery windfalls, asset protection, and portfolio remediation. 25 years, $10B+ in enterprise decisions, B Corp certified.",
  keywords: [
    "dispute resolution advisory",
    "specialist sourcing and coordination",
    "equity dispute advisory",
    "creditor claim advisory",
    "asset protection advisory",
    "litigation support coordination",
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageSeo("/private-advisory");
  return withSeoOverrides(FALLBACK_METADATA, data?.seo);
}

const engageIcons = {
  source: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
  coordinate: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M9 6h6a3 3 0 0 1 3 3v6" />
    </svg>
  ),
  handle: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h5l2 3h6l2-3h5" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  ),
};

const situations = [
  {
    tag: "SITUATION A",
    title: "The Squeezed-Out Operator",
    hook: "Timing is everything — and it's rarely yours.",
    desc:
      "A business partner or co-founder gets pushed out of equity they earned, timed to land right before the value becomes obvious — a raise, a sale, a big contract. We source and negotiate the right litigation counsel, manage that relationship and communication cadence, and keep your side of the file organized, while staying out of the privileged strategy conversations that belong to your attorney.",
    structure: "Success fee — no recovery, no fee.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="17" y1="8" x2="22" y2="13" />
        <line x1="22" y1="8" x2="17" y2="13" />
      </svg>
    ),
  },
  {
    tag: "SITUATION B",
    title: "The Slow-Walked Creditor",
    hook: "A clear claim, moving at someone else's pace.",
    desc:
      "You're owed money on a claim that isn't legally complicated, but it's stalled, and you have no way to know if that pace is normal. We audit what your counsel has and hasn't done, apply pressure on timeline, and handle the parts of the file that don't require a law license, so you're not the one chasing.",
    structure: "Success-fee-adjacent — value is urgency and project management.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 22h14" />
        <path d="M5 2h14" />
        <path d="M17 22v-4.17a2 2 0 0 0-.59-1.41L12 12l-4.41 4.42a2 2 0 0 0-.59 1.41V22" />
        <path d="M7 2v4.17a2 2 0 0 0 .59 1.41L12 12l4.41-4.42A2 2 0 0 0 17 6.17V2" />
      </svg>
    ),
  },
  {
    tag: "SITUATION C",
    title: "The Discovery Windfall",
    hook: "New information changes everything.",
    desc:
      "A near-final resolution gets reopened by something your own counsel didn't have, and doesn't have the infrastructure to pursue. We assemble and sequence the specialists a matter like this actually requires — additional counsel, forensic investigators — under one strategy, with strict rules about who knows what.",
    structure: "Retainer + tiered success fee — multi-track, upfront spend required.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
        <path d="M11 8v3l2 2" />
      </svg>
    ),
  },
  {
    tag: "SITUATION D",
    title: "The Protected Principal",
    hook: "Protection in place before there's anything to fight.",
    desc:
      "Nothing has gone wrong yet, and that's the point. An ongoing mandate to keep your existing position, name, and equity from being quietly eroded by counterparties who assume you won't notice. We vet new relationships before they're entered into and keep every agreement bearing your name accurate to the role you actually hold.",
    structure: "Standing retainer — the relationship to have before a dispute starts.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    tag: "SITUATION E",
    title: "The Mixed-Ledger Principal",
    hook: "Sorting out a portfolio that cuts both ways.",
    desc:
      "A large, disorganized set of holdings — some of it owed to you, some of it owed by you. We conduct a full, honest inventory, including the possibility that a position resolves against you, and run remediation under a locked baseline with an independent party confirming what's actually delivered.",
    structure: "Upfront commitment + escrow, with a neutral certifier.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="3" x2="12" y2="21" />
        <path d="M5 7h5l-2.5 7a2.5 2.5 0 0 1-5 0z" />
        <path d="M14 7h5l-2.5 7a2.5 2.5 0 0 1-5 0z" />
        <path d="M7 7h10" />
        <path d="M12 3 9 7h6z" />
      </svg>
    ),
  },
];

const engagementModels = [
  {
    title: "Success Fee",
    desc:
      "For documented claims against a solvent, identifiable counterparty. No fee if there's no recovery.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="5" x2="5" y2="19" />
        <circle cx="6.5" cy="6.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Retainer + Success Fee",
    desc:
      "When investigative or forensic spend is needed before recovery, or the matter runs across multiple fronts.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    title: "Upfront + Escrow + Certifier",
    desc:
      "For complex portfolio or reputational remediation, with an independent party certifying delivery against a locked baseline.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
];

const differenceRows = [
  {
    without:
      "Finding and vetting the right specialist — attorney, investigator, forensic accountant — on your own, with no way to check their track record.",
    with:
      "The right specialist identified, referenced, and terms negotiated before your first meeting.",
  },
  {
    without: "Your specialist spends billable hours learning your situation from scratch.",
    with: "A complete, organized case file is ready before their clock starts.",
  },
  {
    without: "Strategy starts weeks in; momentum is lost before the first real move.",
    with: "Execution begins on day one.",
  },
  {
    without: "An open-ended retainer: “we'll see where this goes.”",
    with:
      "A written scope of work: defined deliverables, timeline, and fee structure agreed upfront.",
  },
];

const boundaries = [
  "Anything requiring a law license — drafting pleadings, appearing in court, or giving a legal opinion you'd rely on. We find and manage the lawyer; we don't become one.",
  "Holding client funds or acting as fiduciary custodian of assets in dispute.",
  "Broker-dealer-adjacent structuring or anything resembling securities intermediation.",
  "Criminal defense, standalone family law, personal injury, or immigration as a lead service — we can augment the counsel handling these, but we're not the primary point of contact.",
  "Purely verbal, undocumented claims against a counterparty with no identifiable assets.",
];

const team = [
  { name: "Anthony Greenberg", role: "CEO" },
  { name: "Alex Veytsel", role: "CSO" },
  { name: "Josh Bykowski", role: "General Counsel" },
];

export default function PrivateAdvisoryPage() {
  return (
    <main>
      {/* Hero */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{ background: "var(--dark)" }}
      >
        <div className="glass-orb glass-orb-amber w-[420px] h-[420px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-rust w-[260px] h-[260px] bottom-0 -left-32" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
              style={{
                color: "var(--gold-light)",
                fontFamily: "var(--font-body)",
              }}
            >
              Private Advisory - RampRate
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Because Some Challenges Require{" "}
              <span style={{ color: "var(--gold)" }}>
                More Than an Advisor.
              </span>
            </h1>
            <p
              className="text-white/70 text-lg leading-relaxed mb-10"
              style={{ fontFamily: "var(--font-body)" }}
            >
              We partner with leaders to navigate the moments that matter most -
              bringing the expertise, relationships, and strategic range to move
              from uncertainty to decisive action.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: "25 Years", label: "of enterprise decisions" },
                { value: "$10B+", label: "in decisions advised" },
                { value: "B Corp", label: "Certified · Highest standards" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-4">
                  <div
                    className="text-xl font-bold mb-1"
                    style={{
                      color: "var(--gold)",
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
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="relative section-warm overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-amber w-[300px] h-[300px] -bottom-32 -right-32" />
        <div className="glass-orb glass-orb-rust w-[180px] h-[180px] top-10 -left-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase"
            style={{
              color: "oklch(0.52 0.12 70)",
              fontFamily: "var(--font-body)",
            }}
          >
            Who We Are
          </span>
          <h2
            className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            A Different Kind of Advisor.
          </h2>
          <p
            className="mt-8 text-base leading-relaxed"
            style={{
              color: "oklch(0.4 0.02 50)",
              fontFamily: "var(--font-body)",
            }}
          >
            A B Corp certified advisory firm built on 25 years of experience and
            more than $10 billion in enterprise decisions. We partner with
            leaders to navigate the moments that matter most - bringing the
            expertise, relationships, and strategic range to move from
            uncertainty to decisive action.
          </p>
        </div>
      </section>

      {/* How We Engage */}
      <section className="relative section-light overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-amber w-[280px] h-[280px] -bottom-32 -left-32" />
        <div className="glass-orb glass-orb-rust w-[160px] h-[160px] top-20 -right-20" />
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase"
            style={{
              color: "oklch(0.52 0.12 70)",
              fontFamily: "var(--font-body)",
            }}
          >
            How We Engage
          </span>
          <h2
            className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight italic max-w-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            We are not your lawyer, your accountant, your publicist, or your
            investigator. But we work with all of them.
          </h2>
          <div className="mt-10 grid lg:grid-cols-2 gap-10 items-start">
            <p
              className="text-base leading-relaxed"
              style={{
                color: "oklch(0.45 0.02 50)",
                fontFamily: "var(--font-body)",
              }}
            >
              Finding the right specialists - quickly, at better terms than
              you&apos;d negotiate alone - is a core part of what we do. Most
              people in a high-stakes dispute find themselves managing a roster
              of specialists who are each excellent in their lane but not
              talking to each other, or realize too late that they need
              specialists they don&apos;t have a way to find. We close both
              gaps: we source and negotiate counsel and investigators,
              coordinate them against a single strategy, and handle everything
              on the file that doesn&apos;t require a law license - so your
              attention stays where it belongs.
            </p>
            <div
              className="rounded-xl p-7 border border-black/5"
              style={{ background: "oklch(0.97 0.01 80)" }}
            >
              <p
                className="text-lg font-semibold italic mb-6"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "oklch(0.2 0.02 50)",
                }}
              >
                You should not have to be the one holding this together.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: engageIcons.source, label: "Source & negotiate specialists" },
                  { icon: engageIcons.coordinate, label: "Coordinate them against one strategy" },
                  { icon: engageIcons.handle, label: "Handle what doesn't require a law license" },
                ].map((item) => (
                  <li key={item.label} className="flex items-center gap-3">
                    <span
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: "oklch(0.72 0.15 75 / 0.12)" }}
                    >
                      {item.icon}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: "oklch(0.25 0.02 50)",
                      }}
                    >
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Client Situations We Take On */}
      <section className="relative section-warm overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-amber w-[300px] h-[300px] -top-32 -right-32" />
        <div className="glass-orb glass-orb-rust w-[180px] h-[180px] bottom-10 -left-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{
                color: "oklch(0.52 0.12 70)",
                fontFamily: "var(--font-body)",
              }}
            >
              Client Situations We Take On
            </span>
            <h2
              className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Five Recurring Situations.{" "}
              <span style={{ color: "oklch(0.52 0.12 70)" }}>
                See Where You Fit.
              </span>
            </h2>
          </div>
          <div className="space-y-6">
            {situations.map((s) => (
              <div
                key={s.title}
                className="rounded-xl p-7 sm:p-8 border border-black/5 bg-white"
              >
                <div className="flex items-start gap-5">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "oklch(0.72 0.15 75 / 0.12)" }}
                  >
                    {s.icon}
                  </div>
                  <div>
                    <span
                      className="text-[11px] font-bold tracking-[0.15em] uppercase"
                      style={{
                        color: "oklch(0.52 0.12 70)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {s.tag}
                    </span>
                    <h3
                      className="text-xl font-bold mt-1 mb-3"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {s.title}
                    </h3>
                    <p
                      className="text-base italic mb-3"
                      style={{
                        color: "oklch(0.35 0.02 50)",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {s.hook}
                    </p>
                    <p
                      className="text-sm leading-relaxed mb-4"
                      style={{
                        color: "oklch(0.45 0.02 50)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {s.desc}
                    </p>
                    <div
                      className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
                      style={{
                        background: "oklch(0.72 0.15 75 / 0.1)",
                        color: "oklch(0.4 0.12 70)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      Typical Structure: {s.structure}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Ways We Engage */}
      <section className="relative section-dark overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-amber w-[350px] h-[350px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-rust w-[200px] h-[200px] bottom-20 -left-20" />
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
          >
            Three Ways We Engage
          </span>
          <h2
            className="mt-4 text-3xl sm:text-4xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            We&apos;ll Tell You Upfront Which One Fits.
          </h2>
          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            {engagementModels.map((m) => (
              <div
                key={m.title}
                className="rounded-xl p-6 border border-white/10"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center mb-5"
                  style={{ background: "rgba(212,168,67,0.12)" }}
                >
                  {m.icon}
                </div>
                <h3
                  className="text-base font-bold text-white mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {m.title}
                </h3>
                <p
                  className="text-sm text-white/60 leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
          <p
            className="mt-10 text-sm italic text-white/50 text-center"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Terms are agreed in writing before any money moves. No ambiguity,
            no moving goalposts.
          </p>
        </div>
      </section>

      {/* The Difference It Makes */}
      <section className="relative section-light overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-amber w-[280px] h-[280px] -bottom-32 -left-32" />
        <div className="glass-orb glass-orb-rust w-[160px] h-[160px] top-20 -right-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{
                color: "oklch(0.52 0.12 70)",
                fontFamily: "var(--font-body)",
              }}
            >
              The Difference It Makes
            </span>
            <h2
              className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Without RampRate, and With.
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[560px]">
              <thead>
                <tr>
                  <th
                    className="pb-4 text-xs uppercase tracking-[0.15em] font-semibold border-b border-black/10"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "oklch(0.45 0.02 50)",
                    }}
                  >
                    Without RampRate
                  </th>
                  <th
                    className="pb-4 pl-6 text-xs uppercase tracking-[0.15em] font-bold border-b-2"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "oklch(0.52 0.12 70)",
                      borderColor: "oklch(0.52 0.12 70)",
                    }}
                  >
                    With RampRate
                  </th>
                </tr>
              </thead>
              <tbody>
                {differenceRows.map((row, i) => (
                  <tr key={i} className="border-b border-black/5">
                    <td
                      className="py-5 pr-6 text-sm align-top"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: "oklch(0.45 0.02 50)",
                      }}
                    >
                      {row.without}
                    </td>
                    <td
                      className="py-5 pl-6 text-sm font-semibold align-top"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: "oklch(0.2 0.02 50)",
                      }}
                    >
                      {row.with}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* B Corp */}
      <section className="relative section-warm overflow-hidden py-16 sm:py-20">
        <div className="glass-orb glass-orb-amber w-[300px] h-[300px] -bottom-32 -right-32" />
        <div className="glass-orb glass-orb-rust w-[180px] h-[180px] top-10 -left-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-black/5 flex flex-col sm:flex-row items-center gap-8">
            <div
              className="w-20 h-20 shrink-0 rounded-full border-4 flex items-center justify-center"
              style={{ borderColor: "var(--gold)" }}
            >
              <span
                className="text-3xl font-bold"
                style={{
                  color: "var(--gold)",
                  fontFamily: "var(--font-display)",
                }}
              >
                B
              </span>
            </div>
            <div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Certified B Corporation
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "oklch(0.45 0.02 50)",
                  fontFamily: "var(--font-body)",
                }}
              >
                RampRate is a Certified B Corp - meeting the highest standards
                of verified social and environmental performance, public
                transparency, and legal accountability. We don&apos;t just
                advise on impact - we live it. Every engagement reflects our
                commitment to doing business the right way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Where We Draw the Line */}
      <section className="relative section-light overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-amber w-[280px] h-[280px] -bottom-32 -left-32" />
        <div className="glass-orb glass-orb-rust w-[160px] h-[160px] top-20 -right-20" />
        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8">
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase"
            style={{
              color: "oklch(0.52 0.12 70)",
              fontFamily: "var(--font-body)",
            }}
          >
            Where We Draw the Line
          </span>
          <h2
            className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Knowing What We Don&apos;t Do.
          </h2>
          <p
            className="mt-4 text-base leading-relaxed"
            style={{
              color: "oklch(0.45 0.02 50)",
              fontFamily: "var(--font-body)",
            }}
          >
            Knowing what we don&apos;t do is part of what makes the rest of it
            work.
          </p>
          <ul className="mt-10 space-y-5">
            {boundaries.map((b, i) => (
              <li key={i} className="flex items-start gap-4">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "oklch(0.72 0.15 75 / 0.12)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="oklch(0.52 0.12 70)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  </svg>
                </span>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: "oklch(0.4 0.02 50)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {b}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Next Steps + Team */}
      <section className="relative section-dark overflow-hidden py-20 sm:py-28">
        <div className="glass-orb glass-orb-amber w-[350px] h-[350px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-rust w-[200px] h-[200px] bottom-20 -left-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
          >
            Next Steps
          </span>
          <h2
            className="mt-4 text-3xl sm:text-4xl font-bold text-white max-w-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            If This Resonates, the Next Step Is Simple.
          </h2>
          <p
            className="mt-6 text-base text-white/60 leading-relaxed max-w-2xl"
            style={{ fontFamily: "var(--font-body)" }}
          >
            We connect to confirm mutual fit, and from there we draft a
            proposal outlining the scope of engagement and commercial terms.
            Everything moves at your pace.
          </p>
          <div className="mt-10 flex flex-wrap gap-8 sm:gap-14">
            {["Connect", "Confirm Fit", "Draft Proposal"].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{
                    background: "var(--gold)",
                    color: "var(--dark)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {i + 1}
                </span>
                <span
                  className="text-sm font-medium text-white/80"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-14 pt-10 border-t border-white/10 flex flex-wrap gap-x-14 gap-y-6">
            {team.map((t) => (
              <div key={t.name}>
                <div
                  className="text-sm font-bold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {t.name}
                </div>
                <div
                  className="text-xs mt-1"
                  style={{
                    color: "var(--gold-light)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {t.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 sm:py-20"
        style={{ background: "oklch(0.52 0.12 70)" }}
      >
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to Move From Uncertainty to Decisive Action?
          </h2>
          <p
            className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Confidential by default. No fee moves without agreed terms in
            writing.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold bg-white hover:bg-white/90 transition-all shadow-lg"
              style={{
                color: "oklch(0.35 0.1 70)",
                fontFamily: "var(--font-body)",
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
              href="/process"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-all"
              style={{ fontFamily: "var(--font-body)" }}
            >
              How We Work
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
        </div>
      </section>
    </main>
  );
}
