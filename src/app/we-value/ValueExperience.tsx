"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Case = {
  name: string;
  symbol: string;
  thesis: string;
  unit: string;
  base: number;
  improvement: number;
  persistence: number;
  attribution: number;
  probability: number;
  mission: number;
  implementation: number;
  beneficiaries: string;
  evidence: string;
};

const cases: Case[] = [
  {
    name: "Tribal futures",
    symbol: "01",
    thesis: "A community must be a co-author, not a footnote.",
    unit: "Annual community benefit potential",
    base: 1500000,
    improvement: 50,
    persistence: 80,
    attribution: 35,
    probability: 55,
    mission: 95,
    implementation: 65,
    beneficiaries: "Tribal Nations, local residents, project investors",
    evidence:
      "Sovereign consent, negotiated benefits, independent governance, annual community reporting",
  },
  {
    name: "Art & Clarisse",
    symbol: "02",
    thesis:
      "A painting can become a livelihood, a licensed story, and a lasting cultural asset.",
    unit: "Annual licensed and direct art revenue potential",
    base: 750000,
    improvement: 55,
    persistence: 75,
    attribution: 50,
    probability: 65,
    mission: 85,
    implementation: 70,
    beneficiaries: "Artist, collectors, collaborators, cultural community",
    evidence:
      "Sales, artist-approved licensing, royalty statements, retained ownership and provenance",
  },
  {
    name: "Torque",
    symbol: "03",
    thesis:
      "The intervention is valuable when the system keeps working after the crisis.",
    unit: "Value of protected assets and avoided operational loss",
    base: 4000000,
    improvement: 35,
    persistence: 70,
    attribution: 45,
    probability: 60,
    mission: 70,
    implementation: 70,
    beneficiaries: "Client, employees, counsel, counterparties",
    evidence:
      "Client-approved milestones, verified recovery, time saved, documented controls; not legal outcomes",
  },
  {
    name: "Conscious Compute / Cato",
    symbol: "04",
    thesis:
      "Better compute should leave something good behind in the places that host it.",
    unit: "Annual infrastructure and community value potential",
    base: 7000000,
    improvement: 28,
    persistence: 85,
    attribution: 30,
    probability: 50,
    mission: 92,
    implementation: 58,
    beneficiaries:
      "Equipment buyers, capital partners, surrounding communities",
    evidence:
      "Signed orders, equipment qualification, power metrics, community agreements and funding closings",
  },
  {
    name: "BioChain / ZERO",
    symbol: "05",
    thesis:
      "The label is a claim. Verifiable quality and useful outcomes are the test.",
    unit: "Annual quality-adjusted sourcing and channel value",
    base: 3000000,
    improvement: 22,
    persistence: 75,
    attribution: 40,
    probability: 58,
    mission: 78,
    implementation: 64,
    beneficiaries: "Buyers, manufacturers, participants, healthcare partners",
    evidence:
      "Certificates, independent tests, audited procurement results, appropriately reviewed outcomes",
  },
  {
    name: "Enterprise sourcing",
    symbol: "06",
    thesis: "A lower invoice only matters if the better relationship lasts.",
    unit: "Annual addressable technology spend",
    base: 12000000,
    improvement: 18,
    persistence: 90,
    attribution: 65,
    probability: 78,
    mission: 62,
    implementation: 88,
    beneficiaries: "Enterprise buyers, operators, vendors",
    evidence:
      "Agreed baseline, executed contracts, verified savings and service continuity",
  },
  {
    name: "Syzygy founders",
    symbol: "07",
    thesis: "An introduction expires. A repeatable growth engine compounds.",
    unit: "Annual incremental company value potential",
    base: 5000000,
    improvement: 30,
    persistence: 75,
    attribution: 40,
    probability: 55,
    mission: 82,
    implementation: 67,
    beneficiaries: "Founder, employees, customers, long-term shareholders",
    evidence:
      "Revenue quality, operating cadence, conversion and retained customer value",
  },
  {
    name: "ImpactSoul assets",
    symbol: "08",
    thesis: "Ownership should travel with contribution, not just capital.",
    unit: "Annual asset and participant value potential",
    base: 2500000,
    improvement: 35,
    persistence: 80,
    attribution: 45,
    probability: 50,
    mission: 94,
    implementation: 55,
    beneficiaries: "Asset stewards, creators, supporters, impact partners",
    evidence:
      "Verified distribution rights, asset cash flow, participant consent and measurable impact",
  },
];

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
const percent = (value: number) => `${Math.round(value)}%`;
const weights = [
  { name: "Durable implementation", weight: 25 },
  { name: "Financial value", weight: 20 },
  { name: "Mission & humanity", weight: 20 },
  { name: "Evidence & confidence", weight: 15 },
  { name: "Shared participation", weight: 10 },
  { name: "Execution readiness", weight: 10 },
];

export default function ValueExperience() {
  const [chosen, setChosen] = useState(0);
  const [inputs, setInputs] = useState(() =>
    cases.map((c) => ({
      ...c,
      months: 12,
      equity: 2000000,
      valuation: 20000000,
      cash: 50000,
    })),
  );
  const [copied, setCopied] = useState(false);
  const current = inputs[chosen];
  const update = (key: keyof typeof current, value: number) =>
    setInputs((previous) =>
      previous.map((row, i) =>
        i === chosen
          ? { ...row, [key]: Number.isFinite(value) ? Math.max(0, value) : 0 }
          : row,
      ),
    );
  const result = useMemo(() => {
    const gross = (current.base * current.improvement) / 100;
    const attributable = (gross * current.attribution) / 100;
    const expected = (attributable * current.probability) / 100;
    const durable = (expected * current.persistence) / 100;
    const fees = current.cash * current.months;
    const consideration = fees + current.equity;
    const margin = durable - fees;
    const ratio = fees ? durable / fees : 0;
    const stake = current.valuation
      ? (current.equity / current.valuation) * 100
      : 0;
    const values = [
      current.persistence,
      Math.min(100, current.improvement * 3),
      current.mission,
      current.probability,
      current.attribution,
      current.implementation,
    ];
    const score = weights.reduce(
      (sum, w, i) => sum + (values[i] * w.weight) / 100,
      0,
    );
    const level =
      score >= 75
        ? "Strong fit to examine"
        : score >= 55
          ? "Promising, with questions"
          : "Not yet underwritten";
    return {
      gross,
      attributable,
      expected,
      durable,
      fees,
      consideration,
      margin,
      ratio,
      stake,
      score,
      level,
      values,
    };
  }, [current]);
  const copy = async () => {
    const summary = `FROM ME TO WE | ${current.name}\nIndicative public fit score: ${result.score.toFixed(0)}/100\nAnnual addressable basis: ${money(current.base)}\nGross modeled improvement: ${money(result.gross)}\nExpected attributable annual value: ${money(result.expected)}\nDurability-adjusted annual value: ${money(result.durable)}\nCash: ${money(current.cash)}/month for ${current.months} months (${money(result.fees)})\nIndicative equity value: ${money(current.equity)} at ${money(current.valuation)} assumed valuation (${result.stake.toFixed(1)}% implied, before dilution)\nNot an offer or independent valuation. All assumptions require validation.`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="min-h-screen bg-[oklch(0.982 0.009 93.6)] text-[oklch(0.261 0.015 113.2)]">
      <div className="mx-auto max-w-6xl px-5 pb-24 pt-8 sm:px-8">
        <nav className="flex items-center justify-between gap-3 border-b border-[oklch(0.865 0.030 96.4)] pb-5 text-xs font-bold uppercase tracking-[0.16em]">
          <Link
            href="/"
            className="text-[oklch(0.423 0.039 74.0)] no-underline"
          >
            RampRate / ImpactSoul
          </Link>
          <span className="rounded-full border border-[oklch(0.788 0.062 90.4)] px-3 py-2 text-[10px] tracking-wider">
            Shared privately · Working model
          </span>
        </nav>
        <header className="relative overflow-hidden py-14 sm:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 top-8 h-52 w-52 rounded-full border-[22px] border-[oklch(0.873 0.052 92.6)] opacity-60 sm:h-80 sm:w-80"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-8 top-20 h-36 w-36 rounded-full border border-[oklch(0.663 0.070 74.3)] opacity-70 sm:h-56 sm:w-56"
          />
          <p className="mb-5 max-w-lg text-xs font-bold uppercase tracking-[0.25em] text-[oklch(0.517 0.061 74.8)]">
            The Glasshouse · How we price possibility
          </p>
          <h1 className="relative max-w-4xl font-serif text-6xl leading-[0.97] tracking-tight sm:text-8xl">
            From Me
            <br />
            <span className="text-[oklch(0.520 0.073 49.5)]">to We.</span>
          </h1>
          <p className="relative mt-8 max-w-2xl text-xl leading-relaxed sm:text-2xl">
            Software can be built overnight. Trust cannot. Our relationships
            took 25 years to earn. We do not charge for knowing people. We take
            responsibility for what those relationships help make possible, and
            we show the results.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#calculator"
              className="rounded-full bg-[oklch(0.289 0.017 75.0)] px-6 py-4 text-sm font-semibold text-white no-underline"
            >
              Calculate what sticks
            </a>
            <a
              href="#principles"
              className="rounded-full border border-[oklch(0.575 0.043 83.7)] px-6 py-4 text-sm font-semibold no-underline"
            >
              How this house works
            </a>
          </div>
        </header>
        <section
          id="principles"
          className="grid gap-4 border-y border-[oklch(0.865 0.030 96.4)] py-9 md:grid-cols-3"
        >
          {[
            [
              "01 / The roots",
              "Pay the bills.",
              "Our people, time, delivery and continuity have a real cost. Pretending otherwise is not generosity.",
            ],
            [
              "02 / The canopy",
              "Pay something forward.",
              "We evaluate mission, community, stewardship and future impact alongside economics.",
            ],
            [
              "03 / The harvest",
              "Share what grows.",
              "Cash pays for work. Equity can align us with durable upside, if its terms are fair and enforceable.",
            ],
          ].map((item) => (
            <article
              key={item[0]}
              className="rounded-2xl bg-white/80 p-6 shadow-sm"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-[oklch(0.552 0.072 63.9)]">
                {item[0]}
              </span>
              <h2 className="mt-4 font-serif text-3xl">{item[1]}</h2>
              <p className="mt-3 text-base leading-relaxed text-[oklch(0.450 0.011 113.4)]">
                {item[2]}
              </p>
            </article>
          ))}
        </section>
        <section className="py-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[oklch(0.520 0.073 49.5)]">
            The valuation of belonging
          </p>
          <h2 className="mt-3 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">
            A door is not a destination. An introduction is not an outcome.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed">
            We count what becomes operational: revenues that remain, savings
            that survive renewals, ownership that protects creators, safeguards
            that communities can enforce, and capabilities a team can use
            without us. We show our assumptions so you can disagree with the
            arithmetic, not guess at the magic.
          </p>
        </section>
        <section
          id="calculator"
          className="scroll-mt-8 rounded-[2rem] border border-[oklch(0.833 0.038 86.2)] bg-[oklch(0.949 0.021 91.6)] p-4 sm:p-8"
        >
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[oklch(0.520 0.073 49.5)]">
              The public value instrument
            </p>
            <h2 className="mt-2 font-serif text-4xl sm:text-5xl">
              Put your future on the table.
            </h2>
            <p className="mt-4 max-w-3xl leading-relaxed">
              Choose a lens, change every assumption, and see the calculation.
              These are illustrative scenarios, not confidential project
              forecasts or signed client results.
            </p>
          </div>
          <div className="mb-7 grid grid-cols-2 gap-2 md:grid-cols-4">
            {cases.map((c, i) => (
              <button
                type="button"
                key={c.name}
                onClick={() => setChosen(i)}
                aria-pressed={chosen === i}
                className={`min-h-20 rounded-xl border p-3 text-left text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[oklch(0.513 0.059 64.9)] ${chosen === i ? "border-[oklch(0.361 0.030 72.9)] bg-[oklch(0.361 0.030 72.9)] text-white" : "border-[oklch(0.819 0.037 87.8)] bg-white text-[oklch(0.359 0.019 80.5)] hover:bg-[oklch(0.911 0.027 87.9)]"}`}
              >
                <span className="mb-1 block text-xs opacity-70">
                  {c.symbol}
                </span>
                {c.name}
              </button>
            ))}
          </div>
          <div className="grid gap-5 lg:grid-cols-[1fr_0.95fr]">
            <div className="rounded-2xl bg-white p-5 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-widest text-[oklch(0.536 0.063 64.9)]">
                Scenario / {current.name}
              </p>
              <h3 className="my-3 font-serif text-3xl leading-tight">
                {current.thesis}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-[oklch(0.493 0.024 91.7)]">
                Beneficiaries: {current.beneficiaries}. Evidence:{" "}
                {current.evidence}.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Annual baseline ($)", "base", 1000, 100000000],
                  ["Modeled improvement (%)", "improvement", 0, 100],
                  ["Our attributable share (%)", "attribution", 0, 100],
                  ["Probability of realization (%)", "probability", 0, 100],
                  ["Durability of benefit (%)", "persistence", 0, 100],
                  ["Mission alignment (%)", "mission", 0, 100],
                  ["Implementation readiness (%)", "implementation", 0, 100],
                  ["Monthly cash fee ($)", "cash", 0, 500000],
                  ["Engagement months", "months", 1, 60],
                  ["Indicative equity value ($)", "equity", 0, 100000000],
                  ["Assumed company valuation ($)", "valuation", 0, 1000000000],
                ].map(([label, key, min, max]) => (
                  <label
                    key={String(key)}
                    className="block text-sm font-semibold text-[oklch(0.380 0.017 88.8)]"
                  >
                    {label}
                    <input
                      className="mt-2 w-full rounded-lg border border-[oklch(0.769 0.032 86.5)] bg-[oklch(0.997 0.004 91.4)] px-3 py-3 text-base focus-visible:outline-2 focus-visible:outline-[oklch(0.520 0.073 49.5)]"
                      type="number"
                      min={Number(min)}
                      max={Number(max)}
                      step={
                        key === "months"
                          ? 1
                          : key === "base" ||
                              key === "cash" ||
                              key === "equity" ||
                              key === "valuation"
                            ? 1000
                            : 1
                      }
                      value={current[key as keyof typeof current] as number}
                      onChange={(event) =>
                        update(
                          key as keyof typeof current,
                          Number(event.target.value),
                        )
                      }
                    />
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <article className="rounded-2xl bg-[oklch(0.304 0.014 76.3)] p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-[oklch(0.881 0.049 84.5)]">
                  Shared fit score · transparent weights
                </p>
                <p className="mt-3 font-serif text-7xl">
                  {result.score.toFixed(0)}
                  <span className="text-2xl text-[oklch(0.825 0.049 81.4)]">
                    /100
                  </span>
                </p>
                <p className="mt-3 text-lg">{result.level}</p>
                <div className="mt-6 space-y-4">
                  {weights.map((w, i) => (
                    <div key={w.name}>
                      <div className="mb-1 flex justify-between gap-3 text-xs">
                        <span>
                          {w.name} ({w.weight}%)
                        </span>
                        <span>{percent(result.values[i])}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/20">
                        <div
                          className="h-full rounded-full bg-[oklch(0.805 0.091 74.7)]"
                          style={{
                            width: `${Math.max(0, Math.min(100, result.values[i]))}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </article>
              <article className="rounded-2xl bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[oklch(0.536 0.063 64.9)]">
                  What survives the introduction?
                </p>
                <dl className="mt-4 space-y-3 text-sm">
                  {[
                    ["Modeled gross annual improvement", money(result.gross)],
                    [
                      "Attributable annual improvement",
                      money(result.attributable),
                    ],
                    [
                      "Probability-adjusted annual value",
                      money(result.expected),
                    ],
                    ["Durability-adjusted annual value", money(result.durable)],
                    ["Cash engagement total", money(result.fees)],
                    [
                      "Illustrative equity reference value",
                      money(current.equity),
                    ],
                    [
                      "Combined nominal consideration",
                      money(result.consideration),
                    ],
                    [
                      "Implied equity percentage",
                      current.valuation
                        ? `${result.stake.toFixed(2)}%`
                        : "Valuation required",
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-baseline justify-between gap-3 border-b border-[oklch(0.932 0.017 84.6)] pb-2"
                    >
                      <dt className="text-[oklch(0.490 0.023 87.6)]">
                        {label}
                      </dt>
                      <dd className="text-right font-bold">{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-5 rounded-xl bg-[oklch(0.951 0.017 84.6)] p-4">
                  <p className="font-semibold">
                    {result.durable >= 50000
                      ? "Modeled value clears $50,000 per year, not necessarily per month."
                      : "The modeled annual durable value is below $50,000."}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">
                    Compare the durability-adjusted annual value with the
                    annualized cash fee of {money(current.cash * 12)}.{" "}
                    {result.durable >= current.cash * 12
                      ? "The modeled annual benefit meets that cash comparison."
                      : "The modeled benefit does not yet support that cash comparison."}{" "}
                    Equity must be justified separately, not counted as
                    guaranteed proceeds.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copy}
                  className="mt-5 w-full rounded-full bg-[oklch(0.361 0.030 72.9)] px-6 py-4 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {copied ? "Copied summary" : "Copy the visible scorecard"}
                </button>
              </article>
            </div>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-[oklch(0.486 0.013 89.8)]">
            Model note: gross improvement = baseline × improvement rate;
            attributable improvement = gross × attribution; expected value =
            attributable × probability; durable value = expected × persistence.
            The fit score is a proposed decision aid, not an actuarial,
            financial, clinical or third-party valuation. Dollar estimates may
            overlap and must not be double-counted.
          </p>
        </section>
        <section className="grid gap-7 py-16 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[oklch(0.520 0.073 49.5)]">
              The house rule
            </p>
            <h2 className="mt-3 font-serif text-4xl">
              Our starting ask is visible.
            </h2>
            <p className="mt-5 text-lg leading-relaxed">
              For full strategic engagements: $50,000 per month plus a proposed
              $2 million in equity value. The calculator lets you test whether
              the future we aim to help create plausibly warrants that
              commitment. It does not imply every engagement uses these terms.
            </p>
          </div>
          <div className="rounded-2xl border border-[oklch(0.822 0.037 87.8)] bg-white p-7">
            <p className="font-serif text-3xl">The wrong house?</p>
            <p className="mt-4 leading-relaxed">
              If you do not believe the work can create meaningful, measurable
              value beyond the fee, the right answer may be no. If the mission
              is extraordinary but the cash is not there, we can examine phased
              work, sponsorship or an explicit investment decision. No disguised
              discount. No secret side deal.
            </p>
            <p className="mt-4 text-sm font-bold">
              Affordability and value are different questions.
            </p>
          </div>
        </section>
        <section className="rounded-[2rem] bg-[oklch(0.905 0.031 88.4)] p-7 sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[oklch(0.477 0.060 66.4)]">
            What we put in writing
          </p>
          <h2 className="mt-3 font-serif text-4xl">No oracle. A ledger.</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              [
                "What we will do",
                "Named deliverables, responsible owners, deadlines and reporting cadence.",
              ],
              [
                "How value is verified",
                "Agreed baselines, attribution rules, independent evidence where feasible and review windows.",
              ],
              [
                "What happens if we miss",
                "Specific cure rights, performance remedies or refunds when agreed in the signed scope.",
              ],
            ].map(([title, body]) => (
              <div key={title}>
                <h3 className="font-serif text-2xl">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-relaxed">
            We do not guarantee financing closes, clinical outcomes, court
            results, token liquidity, equity appreciation or the actions of
            third parties. Any guarantee, equity grant, referral arrangement or
            regulated activity needs specific review and a signed agreement.
          </p>
        </section>
        <section
          id="reporting"
          className="mt-10 rounded-[2rem] border border-stone-300 bg-white p-6 sm:p-10"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
            The living value ledger
          </p>
          <h2 className="mt-3 font-serif text-4xl">
            The score is a promise to measure, not a trophy.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed">
            At signing, we record the baseline and the hypothesis. At 30, 90,
            and 180 days, we publish what was delivered, which assumptions
            changed, what independent evidence exists, and how much of the value
            actually endured. A private report can carry confidential proof
            without exposing clients or communities.
          </p>
          <div className="mt-7 grid gap-4 md:grid-cols-4">
            {[
              [
                "Day 0 / Plant",
                "Baseline, beneficiaries, agreed scope, evidence owner and attribution rules.",
              ],
              [
                "Day 30 / Root",
                "What shipped, who adopted it, delays, early risks and validated costs.",
              ],
              [
                "Day 90 / Grow",
                "Measured commercial outcomes, quality controls, stakeholder benefit and course corrections.",
              ],
              [
                "Day 180 / Harvest",
                "What persists without us, independently supported value, disputes and next commitments.",
              ],
            ].map(([time, description]) => (
              <div key={time} className="rounded-2xl bg-stone-100 p-5">
                <h3 className="font-serif text-xl">{time}</h3>
                <p className="mt-3 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
          <div className="mt-7 border-t border-stone-200 pt-6">
            <h3 className="font-serif text-2xl">
              What Josh and Alex should refine before sharing
            </h3>
            <p className="mt-3 text-sm leading-relaxed">
              Agree on the definitions of attributable benefit, the treatment of
              equity grants and dilution, the separation of mission score from
              financial value, conflicts and referral disclosures, and what a
              signed guarantee can responsibly cover. Keep the public scoring
              formula fixed and versioned. Document every exception to the
              standard engagement threshold.
            </p>
          </div>
        </section>
        <footer className="mt-14 flex flex-col justify-between gap-4 border-t border-[oklch(0.865 0.030 96.4)] pt-8 text-sm text-[oklch(0.480 0.022 86.2)] sm:flex-row">
          <span>RampRate · ImpactSoul · From Me to We</span>
          <span>
            Unlisted concept for partner discussion · Not a binding offer
          </span>
        </footer>
      </div>
    </div>
  );
}
