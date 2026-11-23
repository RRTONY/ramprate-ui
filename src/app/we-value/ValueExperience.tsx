"use client";
import Link from "next/link";
import { useMemo, useState } from "react";

type Work = {
  title: string;
  problem: string;
  leverage: string;
  build: string;
  lasting: string;
  proof: string;
  basis: number;
  gain: number;
  credit: number;
  duration: string;
  reading: string;
  href: string;
};
const work: Work[] = [
  {
    title: "Resolve a high-stakes problem",
    problem:
      "A dispute or broken partnership has made decisions costly and uncertain.",
    leverage: "Judgment and trusted specialists working in concert.",
    build:
      "A fact base, negotiation map, ownership of the next decisions and a recovery plan.",
    lasting: "A documented operating and decision structure.",
    proof:
      "Milestones, verified recovery or avoided cost. Legal outcomes are never promised.",
    basis: 5000000,
    gain: 14,
    credit: 40,
    duration: "90-day decision design",
    reading: "How we document outcomes",
    href: "/proof",
  },
  {
    title: "Rebalance ownership",
    problem:
      "The people contributing value do not have a clear and fair stake in it.",
    leverage:
      "Commercial experience, governance judgment and stakeholder credibility.",
    build:
      "A contribution ledger, ownership options and agreed decision rights.",
    lasting: "Governance and reporting that still work after we leave.",
    proof:
      "Executed agreements and independently supportable economic changes.",
    basis: 4500000,
    gain: 18,
    credit: 45,
    duration: "60-day alignment design",
    reading: "How we document outcomes",
    href: "/proof",
  },
  {
    title: "Share infrastructure upside",
    problem:
      "Infrastructure creates wealth while nearby communities bear unpriced costs.",
    leverage: "Access to capital, operators and community-centered expertise.",
    build:
      "Benefit-sharing options, governance commitments and a transparent value ledger.",
    lasting:
      "Contractual participation and the right to review what really happened.",
    proof: "Community consent, executed terms and measured community benefits.",
    basis: 8000000,
    gain: 15,
    credit: 35,
    duration: "120-day participation design",
    reading: "Infrastructure and the long view",
    href: "/blog/ai-infrastructure-gold-rush",
  },
  {
    title: "Make biochemistry accountable",
    problem:
      "Health-product claims are outrunning quality evidence and meaningful follow-up.",
    leverage: "Sourcing intelligence and scientific quality relationships.",
    build:
      "Verified sourcing, defined questions, clear evidence gates and a responsible evaluation plan.",
    lasting: "A repeatable way to distinguish evidence from marketing.",
    proof:
      "Independent quality records and appropriately reviewed outcomes. No clinical promises.",
    basis: 2500000,
    gain: 16,
    credit: 40,
    duration: "90-day verification design",
    reading: "Our public evidence standards",
    href: "/proof",
  },
  {
    title: "Keep creators in the upside",
    problem:
      "Creative work may grow in value without protecting the person who made it.",
    leverage:
      "Commercial design, cultural relationships and ownership thinking.",
    build: "Rights inventory, licensing choices and royalty reporting.",
    lasting: "Creator-approved control and a record of participation.",
    proof: "Signed licenses, statements and verified ownership.",
    basis: 1000000,
    gain: 25,
    credit: 40,
    duration: "60-day ownership design",
    reading: "Our public evidence standards",
    href: "/proof",
  },
  {
    title: "Fix enterprise economics",
    problem:
      "Enterprise contracts have stopped delivering the value they should.",
    leverage:
      "Twenty-five years of contract intelligence and supplier relationships.",
    build:
      "Benchmarking, a negotiation strategy, execution and service measurement.",
    lasting: "Better terms and a repeatable commercial discipline.",
    proof: "Signed contracts, audited savings and service continuity.",
    basis: 12000000,
    gain: 18,
    credit: 65,
    duration: "90-day commercial reset",
    reading: "Our public evidence standards",
    href: "/proof",
  },
];
const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
export default function ValueExperience() {
  const [selected, setSelected] = useState(5);
  const [basis, setBasis] = useState(12000000);
  const [gain, setGain] = useState(18);
  const [credit, setCredit] = useState(65);
  const [confidence, setConfidence] = useState(70);
  const [monthly, setMonthly] = useState(50000);
  const [months, setMonths] = useState(12);
  const [copied, setCopied] = useState(false);
  const item = work[selected];
  const choose = (i: number) => {
    setSelected(i);
    setBasis(work[i].basis);
    setGain(work[i].gain);
    setCredit(work[i].credit);
    setConfidence(70);
    setCopied(false);
  };
  const calc = useMemo(() => {
    const gross = (basis * gain) / 100,
      attributed = (gross * credit) / 100,
      adjusted = (attributed * confidence) / 100,
      termBenefit = (adjusted * months) / 12,
      termCash = monthly * months;
    return {
      gross,
      attributed,
      adjusted,
      termBenefit,
      termCash,
      net: termBenefit - termCash,
    };
  }, [basis, gain, credit, confidence, monthly, months]);
  const brief = `OUTCOME: ${item.title}\nSITUATION: ${item.problem}\nHOW WE HELP: ${item.leverage} / ${item.build}\nWHAT LASTS: ${item.lasting}\nEVIDENCE: ${item.proof}\nILLUSTRATIVE ESTIMATE: ${money(basis)} × ${gain}% improvement × ${credit}% contribution × ${confidence}% confidence = ${money(calc.adjusted)} annual benefit.\nSAME PERIOD: ${money(calc.termBenefit)} benefit vs. ${money(calc.termCash)} cash participation over ${months} months.\nNOT AN OFFER OR VERIFIED RESULT. All assumptions and terms require agreement.`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="min-h-screen bg-white text-stone-900">
      <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <nav className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-stone-300">
          <Link
            href="/"
            className="text-sm font-bold uppercase tracking-widest no-underline"
          >
            RampRate
          </Link>
          <span className="text-xs text-stone-600">
            An unlisted working conversation
          </span>
        </nav>
        <header className="grid gap-8 border-b border-stone-300 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">
              A different way to engage
            </p>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-tight tracking-tight sm:text-7xl">
              What becomes possible{" "}
              <span className="text-amber-800">with us?</span>
            </h1>
            <p className="mt-5 max-w-2xl text-xl leading-relaxed">
              You can hire expertise anywhere. You cannot buy 25 years of earned
              trust. We put ours to work, build what the outcome needs, and let
              the evidence show what our contribution was worth.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-700">
              We are willing to put our judgment, reputation and, where
              appropriate, our own capital alongside the work. Not just make an
              introduction.
            </p>
            <a
              href="#engage"
              className="mt-6 inline-flex min-h-12 items-center rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white no-underline"
            >
              Build a value case{" "}
              <span className="ml-3" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
          <div className="rounded-3xl border border-stone-200 bg-stone-50 p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-600">
              The difference is how
            </p>
            {(
              [
                ["Open the right door", "Relationships are the beginning."],
                [
                  "Change the system",
                  "A team makes the difficult work operational.",
                ],
                ["Prove the outcome", "Evidence matters more than access."],
                [
                  "Share what grows",
                  "Participation follows contribution and agreement.",
                ],
              ] as const
            ).map(([heading, body], i) => (
              <div
                key={heading}
                className="mt-5 grid grid-cols-[2rem_1fr] gap-3 border-t border-stone-200 pt-4"
              >
                <span className="font-serif text-2xl text-amber-800">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold">{heading}</p>
                  <p className="mt-1 text-sm text-stone-700">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </header>
        <main id="engage" className="scroll-mt-6 pt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
                One conversation, three decisions
              </p>
              <h2 className="mt-3 font-serif text-4xl sm:text-5xl">
                Work backward from success.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-stone-700">
              Explore privately. This page does not save your answers.
            </p>
          </div>
          <section className="mt-8 rounded-3xl border border-stone-300 p-4 sm:p-7">
            <h3 className="text-sm font-bold uppercase tracking-wide">
              01 / What do you need to change?
            </h3>
            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {work.map((x, i) => (
                <button
                  type="button"
                  key={x.title}
                  aria-pressed={i === selected}
                  onClick={() => choose(i)}
                  className={`min-h-24 rounded-xl border p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800 ${selected === i ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 bg-white text-stone-900 hover:bg-stone-50"}`}
                >
                  <span className="block text-xs opacity-70">0{i + 1}</span>
                  <span className="mt-2 block text-base font-semibold">
                    {x.title}
                  </span>
                </button>
              ))}
            </div>
          </section>
          <section className="mt-4 rounded-3xl border border-stone-300 p-4 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-bold uppercase tracking-wide">
                02 / What would we actually do?
              </h3>
              <span className="text-xs text-stone-600">
                {item.duration} · illustrative
              </span>
            </div>
            <p className="mt-6 max-w-3xl font-serif text-2xl sm:text-3xl">
              {item.problem}
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {(
                [
                  ["We bring", item.leverage],
                  ["We build", item.build],
                  ["You keep", item.lasting],
                ] as const
              ).map(([title, body], i) => (
                <article
                  key={title}
                  className="relative rounded-2xl bg-stone-50 p-5"
                >
                  <span className="text-xs font-bold text-amber-800">
                    0{i + 1}
                  </span>
                  <h4 className="mt-3 font-serif text-2xl">{title}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-stone-700">
                    {body}
                  </p>
                  {i < 2 && (
                    <span
                      aria-hidden="true"
                      className="absolute -right-2 top-1/2 z-10 hidden bg-white px-1 font-bold text-amber-800 md:block"
                    >
                      →
                    </span>
                  )}
                </article>
              ))}
            </div>
            <div className="mt-6 border-t border-stone-200 pt-5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-stone-600">
                What would count as proof?
              </h4>
              <p className="mt-2 text-base leading-relaxed">{item.proof}</p>
              <Link
                href={item.href}
                className="mt-3 inline-block text-sm font-semibold text-amber-900 underline underline-offset-4"
              >
                {item.reading}
              </Link>
            </div>
          </section>
          <section className="mt-4 rounded-3xl border border-stone-300 p-4 sm:p-7">
            <h3 className="text-sm font-bold uppercase tracking-wide">
              03 / Does the value justify the partnership?
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-700">
              Set an opportunity, the improvement it might support, our
              attributable part and the confidence you have in delivery. The
              assumptions are yours to challenge.
            </p>
            <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-5">
                <label className="block text-sm font-semibold">
                  Annual value at stake ($)
                  <input
                    aria-label="Annual value at stake in dollars"
                    type="number"
                    min="0"
                    step="100000"
                    value={basis}
                    onChange={(e) =>
                      setBasis(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="mt-2 block w-full rounded-xl border border-stone-300 p-4 text-base"
                  />
                </label>
                {(
                  [
                    ["Potential improvement", gain, setGain, 60],
                    ["Our attributable contribution", credit, setCredit, 100],
                    ["Confidence in delivery", confidence, setConfidence, 100],
                  ] as const
                ).map(([title, value, setter, max]) => (
                  <label key={title} className="block text-sm font-semibold">
                    {title}{" "}
                    <strong className="ml-2 text-amber-800">{value}%</strong>
                    <input
                      type="range"
                      min="0"
                      max={max}
                      value={value}
                      onChange={(e) => setter(Number(e.target.value))}
                      className="mt-3 block w-full accent-amber-800"
                    />
                  </label>
                ))}
                <details className="rounded-xl bg-stone-50 p-4">
                  <summary className="cursor-pointer text-sm font-semibold">
                    Inspect participation assumptions
                  </summary>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label className="text-sm font-semibold">
                      Monthly cash ($)
                      <input
                        type="number"
                        min="0"
                        step="5000"
                        value={monthly}
                        onChange={(e) =>
                          setMonthly(Math.max(0, Number(e.target.value) || 0))
                        }
                        className="mt-2 block w-full rounded-lg border border-stone-300 p-3"
                      />
                    </label>
                    <label className="text-sm font-semibold">
                      Months
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={months}
                        onChange={(e) =>
                          setMonths(
                            Math.max(
                              1,
                              Math.min(60, Number(e.target.value) || 1),
                            ),
                          )
                        }
                        className="mt-2 block w-full rounded-lg border border-stone-300 p-3"
                      />
                    </label>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-stone-600">
                    Full-scope internal reference assumptions, not a rate card.
                    Equity and investment remain separate negotiations.
                  </p>
                </details>
              </div>
              <div className="rounded-2xl bg-stone-900 p-5 text-white sm:p-7">
                <p className="text-xs font-bold uppercase tracking-widest text-stone-300">
                  Working value case
                </p>
                <p className="mt-5 text-sm text-stone-300">
                  Potential annual change
                </p>
                <p className="mt-1 font-serif text-3xl tabular-nums">
                  {money(calc.gross)}
                </p>
                <p className="mt-4 text-sm text-stone-300">
                  Value attributable to our contribution
                </p>
                <p className="mt-1 font-serif text-3xl tabular-nums">
                  {money(calc.attributed)}
                </p>
                <div className="mt-5 border-t border-stone-600 pt-5">
                  <p className="text-sm text-stone-300">
                    Confidence-adjusted annual value
                  </p>
                  <p
                    aria-live="polite"
                    className="mt-1 font-serif text-4xl tabular-nums"
                  >
                    {money(calc.adjusted)}
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-stone-800 p-4">
                    <p className="text-xs text-stone-300">
                      Benefit over {months} months
                    </p>
                    <p className="mt-2 text-xl font-semibold tabular-nums">
                      {money(calc.termBenefit)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-stone-800 p-4">
                    <p className="text-xs text-stone-300">
                      Cash over {months} months
                    </p>
                    <p className="mt-2 text-xl font-semibold tabular-nums">
                      {money(calc.termCash)}
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm font-semibold">
                  {calc.net >= 0
                    ? "Worth discussing with real evidence."
                    : "The modeled benefit does not yet support these terms."}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-stone-300">
                  Illustrative, not achieved savings or a guarantee. Excludes
                  delivery costs, tax, timing, dilution and noncash benefits.
                </p>
              </div>
            </div>
          </section>
          <section className="mt-4 grid gap-5 rounded-3xl bg-stone-100 p-5 sm:p-8 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
                From me to we
              </p>
              <h3 className="mt-3 font-serif text-3xl sm:text-4xl">
                Bring us the outcome, not the pitch deck.
              </h3>
              <p className="mt-4 max-w-xl leading-relaxed text-stone-700">
                We will look at the work, the proof and the sharing of value
                together. We will tell you when we do not fit.
              </p>
            </div>
            <div className="flex flex-col justify-end gap-3">
              <button
                type="button"
                onClick={copy}
                className="min-h-12 rounded-full border border-stone-400 px-5 py-3 text-sm font-semibold"
              >
                {copied ? "Working brief copied" : "Copy my working brief"}
              </button>
              <Link
                href="/talk-to-us"
                className="flex min-h-12 items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white no-underline"
              >
                Start a conversation ↗
              </Link>
              <p className="text-center text-xs text-stone-600">
                Paste the brief into your message.
              </p>
            </div>
          </section>
        </main>
        <section className="mt-12 grid gap-6 border-t border-stone-300 pt-9 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl">
              What happens after we agree?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-stone-700">
              We establish the baseline and evidence owners, then report at 30,
              90 and 180 days. Some proof is public; some anonymized; some
              restricted by client agreements.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-3xl">
              What happens when value grows?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-stone-700">
              We can invest in the underlying asset, help it grow, and allocate
              eligible surplus to agreed interests after obligations and
              reserves. Notional equity is not cash.
            </p>
          </div>
        </section>
        <footer className="mt-12 flex flex-wrap justify-between gap-3 border-t border-stone-300 pt-5 text-xs text-stone-600">
          <span>RampRate · Private engagement model</span>
          <span>Anonymous illustrations · Not a binding offer</span>
        </footer>
      </div>
    </div>
  );
}
