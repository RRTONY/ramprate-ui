"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Path = {
  name: string;
  what: string;
  measure: string;
  baseline: number;
  improvement: number;
  attribution: number;
  evidence: string;
  reading: string;
  url: string;
};
const paths: Path[] = [
  {
    name: "Enterprise buying",
    what: "Find money and performance trapped in long-term contracts.",
    measure: "Verified annual savings and service improvement",
    baseline: 12000000,
    improvement: 18,
    attribution: 65,
    evidence: "Signed contracts and an independently reviewable baseline.",
    reading: "Patience in the AI Infrastructure Gold Rush",
    url: "https://ramprate.com/blog/ai-infrastructure-gold-rush",
  },
  {
    name: "High-stakes resolution",
    what: "Put facts, counsel, incentives and decisions back in order.",
    measure: "Documented milestones, recoveries and avoided operational costs",
    baseline: 5000000,
    improvement: 20,
    attribution: 40,
    evidence:
      "Approved scope, independently supported recovery and process milestones. Legal outcomes are not promised.",
    reading: "Our public proof framework",
    url: "https://ramprate.com/proof",
  },
  {
    name: "Compute and neighbors",
    what: "Build infrastructure where communities have a real place at the table.",
    measure:
      "Contracted local benefits, infrastructure economics and governance",
    baseline: 8000000,
    improvement: 15,
    attribution: 35,
    evidence:
      "Executed benefit agreements, community consent and independently measured results.",
    reading: "Patience in the AI Infrastructure Gold Rush",
    url: "https://ramprate.com/blog/ai-infrastructure-gold-rush",
  },
  {
    name: "Biochemistry and quality",
    what: "Replace label-driven promises with better inputs, evidence and follow-through.",
    measure:
      "Verified sourcing quality and responsibly measured commercial benefit",
    baseline: 2500000,
    improvement: 16,
    attribution: 40,
    evidence:
      "Quality records, agreed baselines and qualified clinical oversight. No treatment claims.",
    reading: "Our work and evidence standards",
    url: "https://ramprate.com/proof",
  },
  {
    name: "Creators and cultural assets",
    what: "Keep authorship and economic participation with the people who make the work.",
    measure: "Approved licensing revenue, royalties and retained control",
    baseline: 1000000,
    improvement: 25,
    attribution: 40,
    evidence:
      "Signed licenses, royalty statements and owner-approved outcomes.",
    reading: "Our public proof framework",
    url: "https://ramprate.com/proof",
  },
  {
    name: "Founders and ownership",
    what: "Help a promising business become one that can actually grow and endure.",
    measure:
      "Repeatable growth, stronger operations and fairer economic rights",
    baseline: 4500000,
    improvement: 20,
    attribution: 45,
    evidence:
      "Revenue retention, executed agreements, governance and operating milestones.",
    reading: "Our public proof framework",
    url: "https://ramprate.com/proof",
  },
];
const cash = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export default function ValueExperience() {
  const [choice, setChoice] = useState(0);
  const [baseline, setBaseline] = useState(12000000);
  const [improvement, setImprovement] = useState(18);
  const [attribution, setAttribution] = useState(65);
  const [period, setPeriod] = useState(12);
  const [openEquity, setOpenEquity] = useState(false);
  const [equity, setEquity] = useState(2000000);
  const [valuation, setValuation] = useState(20000000);
  const [ready, setReady] = useState(false);
  const chosen = paths[choice];
  const result = useMemo(() => {
    const potential = (baseline * improvement) / 100;
    const attributable = (potential * attribution) / 100;
    const annualCash = 50000 * 12;
    const fee = 50000 * period;
    return {
      potential,
      attributable,
      annualCash,
      fee,
      remaining: attributable - annualCash,
      ratio: annualCash ? attributable / annualCash : 0,
    };
  }, [baseline, improvement, attribution, period]);
  const pick = (index: number) => {
    setChoice(index);
    setBaseline(paths[index].baseline);
    setImprovement(paths[index].improvement);
    setAttribution(paths[index].attribution);
    setReady(false);
  };
  return (
    <div className="min-h-screen bg-[oklch(0.979_0.008_88)] text-[oklch(0.26_0.015_75)]">
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-6 sm:px-8">
        <nav className="flex items-center justify-between border-b border-stone-300 pb-5 text-xs font-semibold uppercase tracking-widest">
          <Link href="/" className="text-stone-800 no-underline">
            RampRate
          </Link>
          <span className="text-stone-600">A private conversation</span>
        </nav>
        <header className="relative grid gap-6 border-b border-stone-300 py-14 sm:py-20 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-900">
              From me to we
            </p>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-[1.03] tracking-tight sm:text-7xl">
              We back what
              <br />
              we believe in.
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed">
              Twenty-five years of trust. Relationships that open difficult
              doors. Judgment that helps people walk through them. And a
              willingness to put our own reputation, work and, when agreed,
              capital behind the outcome.
            </p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-stone-700">
              You should not pay for who we know. You should see what we can
              change, what we can prove, and how we both participate when it
              works.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#explore"
                className="rounded-full bg-stone-900 px-6 py-4 text-sm font-semibold text-white no-underline"
              >
                See what we could create
              </a>
              <Link
                href="/talk-to-us"
                className="rounded-full border border-stone-500 px-6 py-4 text-sm font-semibold text-stone-900 no-underline"
              >
                Start a conversation
              </Link>
            </div>
          </div>
          <aside className="flex items-end lg:justify-end">
            <div className="w-full max-w-xs rounded-t-[45%] rounded-b-2xl border border-amber-800 bg-[oklch(0.93_0.035_85)] p-8 pt-20">
              <span className="font-serif text-6xl">25</span>
              <span className="ml-2 text-sm uppercase tracking-wider">
                years
              </span>
              <p className="mt-5 border-t border-amber-800 pt-5 text-sm leading-relaxed">
                Trust is earned slowly. Outcomes have to earn their own proof.
              </p>
            </div>
          </aside>
        </header>
        <section className="grid gap-5 py-12 md:grid-cols-3">
          {[
            [
              "01",
              "Build value",
              "We bring judgment, relationships and real execution to something worth making better.",
            ],
            [
              "02",
              "Show the difference",
              "We agree on a baseline, report what changed and separate our contribution from luck.",
            ],
            [
              "03",
              "Share the upside",
              "Cash supports delivery. Equity aligns interests. A thriving core business can allocate eligible surplus to special projects.",
            ],
          ].map(([number, title, body]) => (
            <article key={number} className="border-t-2 border-amber-800 pt-5">
              <p className="text-xs font-bold tracking-widest text-amber-900">
                {number}
              </p>
              <h2 className="mt-3 font-serif text-3xl">{title}</h2>
              <p className="mt-3 leading-relaxed text-stone-700">{body}</p>
            </article>
          ))}
        </section>
        <section
          id="explore"
          className="scroll-mt-6 rounded-[1.75rem] bg-white p-5 shadow-sm sm:p-10"
        >
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-900">
                The shared value sketch
              </p>
              <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
                Could we make the pie bigger?
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-700">
                Choose the kind of work. Change three assumptions. See the math.
                No invented client outcomes.
              </p>
            </div>
            <span className="rounded-full border border-stone-300 px-4 py-2 text-xs text-stone-700">
              Illustrative, not an offer
            </span>
          </div>
          <div className="mt-7 flex flex-wrap gap-2">
            {paths.map((p, index) => (
              <button
                type="button"
                key={p.name}
                aria-pressed={index === choice}
                onClick={() => pick(index)}
                className={`min-h-12 rounded-full border px-4 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800 ${index === choice ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 bg-white text-stone-800 hover:bg-stone-100"}`}
              >
                {p.name}
              </button>
            ))}
          </div>
          <div className="mt-8 grid gap-7 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h3 className="font-serif text-2xl">{chosen.what}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-700">
                <strong>What counts:</strong> {chosen.measure}.
              </p>
              <div className="mt-7 space-y-5">
                <label className="block text-sm font-semibold">
                  Annual opportunity ($)
                  <input
                    type="number"
                    min="0"
                    step="100000"
                    value={baseline}
                    onChange={(e) =>
                      setBaseline(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="mt-2 w-full rounded-xl border border-stone-300 bg-stone-50 p-4 text-lg tabular-nums"
                  />
                </label>
                <label className="block text-sm font-semibold">
                  Potential improvement (%)
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={improvement}
                    onChange={(e) => setImprovement(Number(e.target.value))}
                    className="mt-3 block w-full accent-amber-800"
                  />
                  <span className="text-sm text-stone-700">{improvement}%</span>
                </label>
                <label className="block text-sm font-semibold">
                  Our contribution to that improvement (%)
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={attribution}
                    onChange={(e) => setAttribution(Number(e.target.value))}
                    className="mt-3 block w-full accent-amber-800"
                  />
                  <span className="text-sm text-stone-700">{attribution}%</span>
                </label>
              </div>
              <p className="mt-5 text-xs leading-relaxed text-stone-600">
                Both parties must agree on attribution. This is a starting
                hypothesis, not a certified result.
              </p>
            </div>
            <div className="rounded-2xl bg-[oklch(0.945_0.018_89)] p-5 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-widest text-stone-700">
                The case to examine together
              </p>
              <p className="mt-5 text-sm text-stone-700">
                Potential annual improvement
              </p>
              <p className="font-serif text-3xl tabular-nums sm:text-4xl">
                {cash(result.potential)}
              </p>
              <div className="my-5 border-t border-stone-300" />
              <p className="text-sm text-stone-700">
                Value attributable to our work
              </p>
              <p className="mt-1 font-serif text-4xl tabular-nums sm:text-5xl">
                {cash(result.attributable)}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white p-4">
                  <p className="text-xs text-stone-700">
                    Annual cash participation
                  </p>
                  <p className="mt-2 font-serif text-2xl tabular-nums">
                    {cash(result.annualCash)}
                  </p>
                </div>
                <div className="rounded-xl bg-white p-4">
                  <p className="text-xs text-stone-700">
                    Modeled annual value after cash
                  </p>
                  <p className="mt-2 font-serif text-2xl tabular-nums">
                    {cash(result.remaining)}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-stone-700">
                {result.remaining >= 0
                  ? "The working hypothesis merits a serious conversation."
                  : "The assumptions do not yet support this engagement economically."}{" "}
                This excludes uncertainty, implementation cost, taxes, timing
                and equity. They must be reviewed separately.
              </p>
              <details className="mt-5 border-t border-stone-300 pt-5">
                <summary className="cursor-pointer text-sm font-semibold underline decoration-amber-800 underline-offset-4">
                  See how the figures are calculated
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-stone-700">
                  Annual improvement = opportunity × improvement rate. Our
                  attributable value = annual improvement × agreed contribution
                  share. The cash comparison uses the standard working baseline
                  of $50,000 per month for twelve months, rather than assuming a
                  guaranteed saving. Equity is discussed separately.
                </p>
              </details>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-stone-200 pt-7 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-serif text-2xl">
                Is the possibility worth exploring?
              </h3>
              <p className="mt-1 text-sm text-stone-700">
                Bring the real numbers. We will bring our judgment, show the
                assumptions and decide together.
              </p>
            </div>
            <Link
              href="/talk-to-us"
              className="shrink-0 rounded-full bg-amber-800 px-6 py-4 text-sm font-bold text-white no-underline"
            >
              Discuss my opportunity
            </Link>
          </div>
        </section>
        <section className="grid gap-8 border-b border-stone-300 py-14 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-900">
              What we put at risk
            </p>
            <h2 className="mt-3 font-serif text-4xl">
              We mean the word partner.
            </h2>
            <p className="mt-4 text-lg leading-relaxed">
              We contribute judgment, teams, commercial leverage and hard-earned
              trust. Where the economics and governance fit, we may invest
              alongside the work. None of that matters unless the outcome holds
              up to scrutiny.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-900">
              Proof without exposure
            </p>
            <h2 className="mt-3 font-serif text-4xl">
              Evidence has a privacy setting.
            </h2>
            <p className="mt-4 leading-relaxed text-stone-700">
              Some results can be named. Some must be anonymized. Some are shown
              only with permission. We distinguish delivered outcomes from plans
              in progress, and we never substitute a relationship for a result.
            </p>
            <Link
              href="/proof"
              className="mt-4 inline-block text-sm font-semibold text-amber-900 underline underline-offset-4"
            >
              Explore our published proof
            </Link>
          </div>
        </section>
        <details className="mt-10 rounded-2xl border border-stone-300 bg-white p-5 sm:p-7">
          <summary className="cursor-pointer font-serif text-2xl">
            For those who want to understand the ownership and allocation model
          </summary>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-stone-700">
            <p>
              We invest in a core business or asset. We help build durable
              economic value. After operating obligations, reserves and
              stakeholder commitments, the enterprise may allocate an agreed
              share of eligible surplus to special projects and interests.
            </p>
            <p>
              It is not charity by default, nor a promise of distributions. The
              businesses and stakeholders agree on governance, allocation rules
              and reporting in writing.
            </p>
            <button
              type="button"
              onClick={() => setOpenEquity(!openEquity)}
              className="rounded-full border border-stone-400 px-5 py-3 text-sm font-semibold"
            >
              {openEquity
                ? "Hide equity illustration"
                : "Explore equity as part of the exchange"}
            </button>
            {openEquity && (
              <div className="grid gap-4 rounded-xl bg-stone-50 p-5 sm:grid-cols-2">
                <label className="block text-sm font-semibold">
                  Illustrative equity reference value ($)
                  <input
                    type="number"
                    min="0"
                    value={equity}
                    onChange={(e) =>
                      setEquity(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="mt-2 w-full rounded-xl border border-stone-300 p-3 text-base"
                  />
                </label>
                <label className="block text-sm font-semibold">
                  Assumed company valuation ($)
                  <input
                    type="number"
                    min="0"
                    value={valuation}
                    onChange={(e) =>
                      setValuation(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="mt-2 w-full rounded-xl border border-stone-300 p-3 text-base"
                  />
                </label>
                <p className="sm:col-span-2">
                  Illustrative undiluted stake:{" "}
                  <strong>
                    {valuation > 0
                      ? ((equity / valuation) * 100).toFixed(2) + "%"
                      : "valuation required"}
                  </strong>
                  . Not liquid cash, not independent fair value, and not a
                  promise of returns.
                </p>
              </div>
            )}
          </div>
        </details>
        <section className="mt-14 rounded-2xl bg-[oklch(0.922_0.03_88)] p-7 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-900">
            The next step
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-4xl sm:text-5xl">
            Tell us what you want to change.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed">
            Not your pitch deck. The outcome. What is stuck, who it affects, and
            what success would mean. We will tell you whether our capabilities
            and commitment are a fit.
          </p>
          <div className="mt-7">
            <Link
              href="/talk-to-us"
              className="inline-block rounded-full bg-stone-900 px-7 py-4 text-sm font-semibold text-white no-underline"
            >
              Start the conversation
            </Link>
          </div>
        </section>
        <footer className="mt-10 flex flex-wrap justify-between gap-4 border-t border-stone-300 pt-6 text-xs text-stone-600">
          <span>RampRate · From me to we</span>
          <span>
            Unlisted working model. No client names or confidential facts
            disclosed.
          </span>
        </footer>
      </div>
    </div>
  );
}
