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
    name: "Art & cultural ownership",
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
    name: "Complex dispute resolution",
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
    name: "Compute & community benefit",
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
    name: "Personalized wellness & sourcing",
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
    name: "Biochemistry optimization",
    symbol: "09",
    thesis:
      "A dose on the label is not the same as a useful response in the body.",
    unit: "Annual value of verified health-service and product improvements",
    base: 2000000,
    improvement: 18,
    persistence: 62,
    attribution: 35,
    probability: 48,
    mission: 90,
    implementation: 50,
    beneficiaries:
      "Individuals, clinicians, laboratories, researchers and responsible manufacturers",
    evidence:
      "Consent, baseline laboratory evidence, quality verification, clinician-reviewed hypotheses, agreed follow-up and documented uncertainty",
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
    name: "Founder growth",
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
    name: "Community-owned assets",
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

const readingTrails = [
  {
    belief:
      "No algorithm can turn a broken relationship into a fair ending by itself.",
    invitation:
      "Make the obligations, failures, repairs and measurable results visible without exposing private lives.",
    articles: [
      {
        title: "The Arithmetic of Relationships",
        href: "https://tonygreenberg.com/blog/the-arithmetic-of-relationships",
        why: "What makes a relationship valuable to both sides?",
      },
      {
        title: "The Alliance That Doesn't Require a Press Release",
        href: "https://tonygreenberg.com/blog/conscious-capital-partnership-ecosystem",
        why: "Why quiet, sustained collaboration matters.",
      },
    ],
  },
  {
    belief: "Control and value are different things.",
    invitation:
      "Build transparent contribution records and ownership terms that survive the first disagreement.",
    articles: [
      {
        title: "When Valuations Don't Mean Valuable",
        href: "https://tonygreenberg.com/blog/when-valuations-dont-mean-valuable",
        why: "Price is not proof of value.",
      },
      {
        title: "The Tug of War",
        href: "https://tonygreenberg.com/blog/the-tug-of-war-ethical-vs-economic-decisions",
        why: "Where money and principles pull against each other.",
      },
    ],
  },
  {
    belief: "Neighbors do not cease to matter after the groundbreaking.",
    invitation:
      "Set up auditable community benefit agreements and locally meaningful decision rights.",
    articles: [
      {
        title: "The Cloud Gets Rich. What Do Its Neighbors Get?",
        href: "https://ramprate.com/blog/the-cloud-gets-rich",
        why: "A practical case for community voice and enforceable benefits.",
      },
      {
        title: "Energy as Impact",
        href: "https://tonygreenberg.com/articles",
        why: "Explore the long view of energy and shared prosperity.",
      },
    ],
  },
  {
    belief: "A good supplement label is only the beginning of the question.",
    invitation:
      "Connect trusted inputs to measurable changes, not unverified promises.",
    articles: [
      {
        title: "Your Blood Lies Without Your DNA",
        href: "https://tonygreenberg.com/blog/your-blood-lies-without-your-dna",
        why: "Why biomarkers and genetic context need to be interpreted together.",
      },
      {
        title: "What Quest Could Fix in 18 Months",
        href: "https://tonygreenberg.com/blog/what-quest-could-fix",
        why: "Why the experience surrounding a test is part of its value.",
      },
    ],
  },
  {
    belief: "The body does not read a price tag or a marketing claim.",
    invitation:
      "Test quality and the path from evidence to intervention to follow-up, with clinical review when appropriate.",
    articles: [
      {
        title: "Your Blood Lies Without Your DNA",
        href: "https://tonygreenberg.com/blog/your-blood-lies-without-your-dna",
        why: "Absorption, metabolism, biomarkers and the limits of genetic interpretation.",
      },
      {
        title: "The Peptide Clarity Index",
        href: "https://tonygreenberg.com/find-your-peptide",
        why: "An educational question set, not a diagnosis or prescription.",
      },
    ],
  },
  {
    belief:
      "The person who makes the work should not disappear from its future.",
    invitation:
      "Explore artist-approved licensing, royalty transparency and continuing creative control.",
    articles: [
      {
        title: "You Are the Moat",
        href: "https://tonygreenberg.com/blog/you-are-the-moat",
        why: "Originality and identity in an age of abundant output.",
      },
      {
        title: "The Art of Being Seen",
        href: "https://tonygreenberg.com/blog/is-that-a-lot-clarisse-abelarde",
        why: "A personal essay about an artist and a work that asked to be seen.",
      },
    ],
  },
  {
    belief: "Technology becomes valuable when its benefits last.",
    invitation:
      "Make the commercial improvements measurable after deployment and after we leave.",
    articles: [
      {
        title: "Patience in the AI Infrastructure Gold Rush",
        href: "https://ramprate.com/blog/ai-infrastructure-gold-rush",
        why: "A long view of the infrastructure bargain.",
      },
      {
        title: "The CIO's Guide to Smarter Vendor Negotiation",
        href: "https://tonygreenberg.com/blog/the-cios-guide-to-smarter-vendor-negotiation",
        why: "The terms that make value persist.",
      },
    ],
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
  const [illustrativeSurplus, setIllustrativeSurplus] = useState(2000000);
  const [specialShare, setSpecialShare] = useState(10);
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
            RampRate
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
            The Glasshouse · Value creation & allocation
          </p>
          <h1 className="relative max-w-4xl font-serif text-6xl leading-[0.97] tracking-tight sm:text-8xl">
            From Me
            <br />
            <span className="text-[oklch(0.520 0.073 49.5)]">to We.</span>
          </h1>
          <p className="relative mt-8 max-w-2xl text-xl leading-relaxed sm:text-2xl">
            Software can be built overnight. Trust takes longer. We have spent
            25 years earning it, and we know it can be lost much faster. We do
            not know what the next 25 years will bring. That is precisely why we
            want to build them with you.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#value-model"
              className="rounded-full bg-[oklch(0.289 0.017 75.0)] px-6 py-4 text-sm font-semibold text-white no-underline"
            >
              See the value model
            </a>
            <a
              href="#principles"
              className="rounded-full border border-[oklch(0.575 0.043 83.7)] px-6 py-4 text-sm font-semibold no-underline"
            >
              How allocation works
            </a>
          </div>
        </header>
        <section className="mb-12 grid gap-7 border-t border-stone-300 pt-10 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-stone-600">
              A note from the founder
            </p>
            <h2 className="mt-4 max-w-2xl font-serif text-3xl leading-tight sm:text-5xl">
              I have been wrong before. I will be wrong again.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed">
              What matters is whether we can tell each other the truth early
              enough to change course. I can bring a lifetime of relationships
              and a team that knows how to get difficult things done. I cannot
              promise you the future. I can promise we will examine our
              assumptions, put our work in writing, and let the evidence have a
              vote.
            </p>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed">
              We are asking you to take a chance on us. We are taking one on
              you, too. That is what makes this a partnership rather than a
              transaction.
            </p>
          </div>
          <blockquote className="self-center border-l-4 border-amber-700 pl-6 font-serif text-2xl leading-snug sm:text-3xl">
            If the future turns out differently than we imagined, we should be
            able to look each other in the eye and explain what happened.
          </blockquote>
        </section>
        <section
          id="value-model"
          className="scroll-mt-8 rounded-[2rem] border border-stone-300 bg-white p-5 shadow-sm sm:p-10"
        >
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
                01 / A transparent model
              </p>
              <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-tight sm:text-6xl">
                Make value. Prove it. Share it.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-700">
                The price is not the story. The story is what changes because we
                worked together, how long that change lasts, and how its
                benefits are allocated.
              </p>
            </div>
            <p className="max-w-md border-l-4 border-amber-700 pl-5 text-lg leading-relaxed">
              We are a business. So are the ventures we build and invest in. A
              healthy core asset comes first. When it creates distributable
              surplus, the allocation to special projects is deliberate,
              recorded and visible.
            </p>
          </div>
          <div className="mt-9 grid gap-3 md:grid-cols-4">
            {[
              [
                "1",
                "Invest in the core",
                "Put capital, relationships, judgment and real operating work into the asset.",
              ],
              [
                "2",
                "Make it work",
                "Build contracts, capabilities, ownership and services that can survive without us.",
              ],
              [
                "3",
                "Prove the gain",
                "Use an agreed baseline and evidence. Separate our contribution from market luck.",
              ],
              [
                "4",
                "Allocate fairly",
                "Honor obligations, reward contributors, reinvest and fund agreed special interests from eligible surplus.",
              ],
            ].map(([n, title, body], i) => (
              <article
                key={n}
                className="relative rounded-2xl bg-stone-100 p-5"
              >
                <span className="font-serif text-4xl text-amber-800">{n}</span>
                <h3 className="mt-4 font-serif text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-700">
                  {body}
                </p>
                {i < 3 && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-2 top-6 z-10 hidden rounded-full bg-white px-2 font-bold text-amber-800 md:block"
                  >
                    →
                  </span>
                )}
              </article>
            ))}
          </div>
          <div className="mt-9 grid gap-5 lg:grid-cols-2">
            <article className="rounded-2xl border border-stone-300 p-5 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
                02 / A client value example
              </p>
              <h3 className="mt-3 font-serif text-3xl">
                What would make $50,000 a month rational?
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-700">
                An illustrative year of enterprise buying. We do not take credit
                for the entire opportunity. We adjust for our attributable work,
                confidence and durability.
              </p>
              <dl className="mt-5 space-y-3">
                {[
                  ["Annual spending baseline", "$12,000,000"],
                  ["Possible contract improvement (18%)", "$2,160,000"],
                  ["Attributable to our work (65%)", "$1,404,000"],
                  ["Confidence adjusted (78%)", "$1,095,120"],
                  ["Expected durable annual value (90%)", "$985,608"],
                  ["12 months of cash participation", "$600,000"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 border-b border-stone-200 pb-3 text-sm"
                  >
                    <dt className="max-w-56 text-stone-700">{label}</dt>
                    <dd className="shrink-0 font-bold tabular-nums">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 rounded-xl bg-amber-50 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
                  Projected benefit above cash participation
                </p>
                <p className="mt-1 font-serif text-4xl tabular-nums">
                  $385,608
                </p>
                <p className="mt-2 text-xs leading-relaxed text-stone-700">
                  Illustrative, risk-adjusted one-year comparison. Not realized
                  savings or a guaranteed return. Equity participation is
                  evaluated separately.
                </p>
              </div>
            </article>
            <article className="rounded-2xl border border-stone-300 p-5 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
                03 / An investment and allocation example
              </p>
              <h3 className="mt-3 font-serif text-3xl">
                The pie grows before it gets divided.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-700">
                Not a donation model. A business invests in its core asset,
                earns real surplus, and only then chooses an agreed allocation
                for special interests.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <label className="block text-sm font-semibold text-stone-800">
                  Available surplus ($)
                  <input
                    aria-label="Available surplus in dollars"
                    className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-3 text-base"
                    type="number"
                    min="0"
                    step="100000"
                    value={illustrativeSurplus}
                    onChange={(e) =>
                      setIllustrativeSurplus(
                        Math.max(0, Number(e.target.value) || 0),
                      )
                    }
                  />
                </label>
                <label className="block text-sm font-semibold text-stone-800">
                  Special allocation (%)
                  <input
                    aria-label="Special allocation percentage"
                    className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-3 text-base"
                    type="number"
                    min="0"
                    max="100"
                    value={specialShare}
                    onChange={(e) =>
                      setSpecialShare(
                        Math.min(100, Math.max(0, Number(e.target.value) || 0)),
                      )
                    }
                  />
                </label>
              </div>
              <div
                aria-label="Illustrative allocation proportions"
                className="mt-6 flex h-5 overflow-hidden rounded-full bg-stone-200"
              >
                <div
                  className="bg-amber-700"
                  style={{ width: `${100 - specialShare}%` }}
                />
                <div
                  className="bg-stone-400"
                  style={{ width: `${specialShare}%` }}
                />
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-stone-100 p-4">
                  <dt className="text-xs leading-relaxed text-stone-700">
                    Retained for business, investors and agreed stakeholders
                  </dt>
                  <dd className="mt-2 font-serif text-2xl tabular-nums sm:text-3xl">
                    {money((illustrativeSurplus * (100 - specialShare)) / 100)}
                  </dd>
                </div>
                <div className="rounded-xl bg-amber-50 p-4">
                  <dt className="text-xs leading-relaxed text-stone-700">
                    Allocated to approved special projects
                  </dt>
                  <dd className="mt-2 font-serif text-2xl tabular-nums sm:text-3xl">
                    {money((illustrativeSurplus * specialShare) / 100)}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-stone-700">
                Available surplus means cash remaining after operating costs,
                reserves, contractual obligations and applicable approvals.
                Unrealized paper appreciation is not distributable cash.
                Percentages are illustrative, not a declared allocation policy.
              </p>
            </article>
          </div>
        </section>
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
            The point
          </p>
          <h2 className="mt-3 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">
            A relationship is the beginning. The outcome is the proof.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed">
            We count what becomes operational: revenues that remain, savings
            that survive renewals, ownership that protects creators, safeguards
            that communities can enforce, and capabilities a team can use
            without us. We show our assumptions so you can disagree with the
            arithmetic, not guess at the magic.
          </p>
        </section>
        <section className="mb-14 border-t border-stone-300 pt-12">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-600">
            Current areas of work
          </p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">
            Where these ideas meet real life.
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed">
            These are the problems we are working on, or exploring with
            partners. Some are commercial. Some are intensely personal. None is
            a claim that an outcome is already won.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              [
                "01",
                "When lives and partnerships come apart",
                "Complex divorces, business disputes and broken trust. We help people recover clarity, protect what matters and build a path forward. Not every victory happens in court.",
              ],
              [
                "02",
                "When power stops being fair",
                "Founders, shareholders and business partners can lose the value they helped create. We work on accountability, fairer structures and durable commercial resolution.",
              ],
              [
                "03",
                "When a data center meets its neighbors",
                "The compute economy needs power, land and trust. We are exploring reciprocal economics with communities and Tribal Nations, including meaningful authority and benefits that endure.",
              ],
              [
                "04",
                "When wellness gets personal",
                "We are examining verified sourcing, personalized wellness, and outcomes that can be checked rather than merely advertised.",
              ],
              [
                "05",
                "When biochemistry becomes personal",
                "A vitamin bottle is not a result. We want to understand what a person can absorb, convert and use, where evidence is strong, and where it is not. From quality testing and biological context to thoughtful follow-up, the experiment matters more than the label.",
              ],
              [
                "06",
                "When art becomes a future",
                "An artist's work brings the question down to one human scale: can creators retain authorship, earn fairly and leave a cultural legacy?",
              ],
              [
                "07",
                "When technology outruns responsibility",
                "From enterprise sourcing to second-life servers and founder growth, the work is to build something viable without handing hidden costs to everyone else.",
              ],
            ].map(([number, title, body], index) => (
              <article
                key={number}
                className="rounded-2xl border border-stone-200 bg-white p-6"
              >
                <p className="text-xs font-bold tracking-widest text-amber-800">
                  {number} / IN MOTION
                </p>
                <h3 className="mt-3 font-serif text-2xl leading-tight">
                  {title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-stone-700">
                  {body}
                </p>
                <div className="mt-6 border-t border-stone-200 pt-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    What we have written about this
                  </p>
                  <div className="mt-3 space-y-3">
                    {readingTrails[index].articles.map((article) => (
                      <a
                        key={article.href}
                        href={article.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-xl border border-stone-200 p-4 no-underline hover:border-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                      >
                        <span className="block text-sm font-semibold text-stone-900 underline decoration-amber-800 underline-offset-4">
                          {article.title}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-stone-600">
                          {article.why}
                        </span>
                      </a>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-stone-700">
                    <strong>What we believe:</strong>{" "}
                    {readingTrails[index].belief}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-stone-700">
                    <strong>Where we could go together:</strong>{" "}
                    {readingTrails[index].invitation}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-stone-600">
            We share themes and methods, not private case details.
            Participation, financing, ownership and outcomes depend on each
            project, the people involved, and signed agreements.
          </p>
        </section>
        <details
          id="calculator"
          className="group scroll-mt-8 rounded-[2rem] border border-stone-300 bg-stone-50 p-4 sm:p-8"
        >
          <summary className="cursor-pointer rounded-xl bg-white p-5 text-lg font-semibold outline-offset-4 focus-visible:outline-2 focus-visible:outline-amber-700">
            Explore the full project scoring model{" "}
            <span className="ml-2 text-sm text-stone-600">
              (optional, 9 scenarios)
            </span>
          </summary>
          <section className="scroll-mt-8 rounded-[2rem] border border-[oklch(0.833 0.038 86.2)] bg-[oklch(0.949 0.021 91.6)] p-4 sm:p-8">
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[oklch(0.520 0.073 49.5)]">
                The detailed value instrument
              </p>
              <h2 className="mt-2 font-serif text-4xl sm:text-5xl">
                Explore a specific project
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
                    [
                      "Assumed company valuation ($)",
                      "valuation",
                      0,
                      1000000000,
                    ],
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
                    Proposed project-fit score
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
                    Projected, not yet proven
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
                      [
                        "Durability-adjusted annual value",
                        money(result.durable),
                      ],
                      ["Total cash participation", money(result.fees)],
                      [
                        "Illustrative equity participation",
                        money(current.equity),
                      ],
                      [
                        "Cash plus notional equity reference",
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
              attributable × probability; durable value = expected ×
              persistence. The fit score is a proposed decision aid, not an
              actuarial, financial, clinical or third-party valuation. Dollar
              estimates may overlap and must not be double-counted.
            </p>
          </section>
        </details>
        <section className="grid gap-7 py-16 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[oklch(0.520 0.073 49.5)]">
              The commercial agreement
            </p>
            <h2 className="mt-3 font-serif text-4xl">
              Participation follows the value.
            </h2>
            <p className="mt-5 text-lg leading-relaxed">
              For full strategic engagements: $50,000 per month plus a proposed
              $2 million in equity value. The calculator lets you test whether
              the future we aim to help create plausibly warrants that
              commitment. It does not imply every engagement uses these terms.
            </p>
          </div>
          <div className="rounded-2xl border border-[oklch(0.822 0.037 87.8)] bg-white p-7">
            <p className="font-serif text-3xl">What makes the exchange fair?</p>
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
            A score is where the conversation starts.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed">
            We may get the first estimate wrong. That is why, at signing, we
            record the baseline and the hypothesis. At 30, 90, and 180 days, we
            publish what was delivered, which assumptions changed, what
            independent evidence exists, and how much of the value actually
            endured. A private report can carry confidential proof without
            exposing clients or communities.
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
          <span>RampRate · From Me to We</span>
          <span>
            Unlisted concept for partner discussion · Not a binding offer
          </span>
        </footer>
      </div>
    </div>
  );
}
