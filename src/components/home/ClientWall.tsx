"use client";

import { useState } from "react";

/* ── CLIENT LOGO WALL - Two-Tier ── */
const tier1Clients = [
  { name: "Microsoft", context: "50+ strategy & product studies" },
  {
    name: "eBay",
    context: "$50M in savings & social impact dashboard for data centers",
  },
  { name: "Sony", context: "M&A for strategic pivot" },
  {
    name: "Paramount",
    context: "14 years of de-risking record-breaking streaming events",
  },
  { name: "Intel", context: "Digital strategy & alliances research" },
  { name: "Nike", context: "49% savings on high complexity retail front-end" },
  {
    name: "Hearst",
    context: "Millions in savings reinvested in innovation fund we planned",
  },
  { name: "Riot Games", context: "Supported rapid global expansion" },
];
const tier2Clients = [
  { name: "Disney", context: "Best IT services deal during executive tenure" },
  { name: "AOL", context: "17-36% price reductions; breakthrough SLAs" },
  { name: "NHL", context: "Breakthrough PPV streaming solution" },
  { name: "Miramax", context: "40%+ savings; diligence compressed" },
  {
    name: "Warner Bros.",
    context: "Win-win structures across two engagements",
  },
  { name: "Verizon", context: "Enterprise telecom partnerships" },
  { name: "AT&T", context: "Telecom infrastructure navigation" },
  { name: "Merrill Lynch", context: "Fortune 500 IT cost optimization" },
  { name: "Accenture", context: "20-40% savings; cut processes in half" },
  { name: "Thomson Reuters", context: "Saved millions; marketplace mapping" },
  { name: "Beats Music", context: "Fully installed in 30 hours" },
  { name: "XPRIZE", context: "$3M+ grant funding managed" },
  { name: "NOIA", context: "4+ year daily engagement; growth accelerated" },
  { name: "NBC", context: "Content delivery optimization" },
  { name: "Fox", context: "Broadcast infrastructure advisory" },
  { name: "Ticketmaster", context: "eCommerce infrastructure" },
  { name: "McGraw Hill", context: "Publishing infrastructure optimization" },
  { name: "Vodafone", context: "Global telecom advisory" },
  { name: "Primedia", context: "Needs assessment in record time" },
];

function ClientCard({ name, context }: { name: string; context: string }) {
  return (
    <div className="rr-client-ledger-card text-center px-3 py-4 sm:px-4 sm:py-5">
      <h3 className="font-body text-[0.68rem] sm:text-xs font-bold tracking-[0.13em] uppercase text-white/80">
        {name}
      </h3>
      <p className="font-body text-[0.65rem] sm:text-[0.69rem] mt-2 leading-snug text-white/52">
        {context}
      </p>
    </div>
  );
}

export default function ClientWall() {
  const [showAllClients, setShowAllClients] = useState(false);

  return (
    <section className="home-client-wall section-sunset relative overflow-hidden py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="rr-client-wall-intro grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-14">
          <div>
            <p className="rr-proof-kicker">
              A decision record, not a logo wall
            </p>
            <h2 className="rr-client-wall-title font-display mt-5 text-white leading-[0.94]">
              25 Years Inside the World&apos;s Most{" "}
              <span className="text-gold">Complex Enterprises.</span>
            </h2>
          </div>
          <div className="rr-client-wall-proof">
            <p className="font-body text-base leading-relaxed text-white/72 sm:text-lg">
              100+ engagements. $10B+ in decisions transacted. Names you know.
            </p>
            <p className="font-body mt-3 text-sm leading-relaxed text-white/48">
              The work is measured in agreements improved, infrastructure
              stabilized, and decisions that held up under pressure.
            </p>
          </div>
        </div>

        <div
          className="rr-client-wall-metrics"
          aria-label="RampRate experience metrics"
        >
          <div>
            <strong>25</strong>
            <span>Years principal-led</span>
          </div>
          <div>
            <strong>100+</strong>
            <span>Complex engagements</span>
          </div>
          <div>
            <strong>$10B+</strong>
            <span>Decisions transacted</span>
          </div>
          <div>
            <strong>80</strong>
            <span>Countries advised</span>
          </div>
        </div>

        <div className="rr-client-wall-ledger-heading">
          <span>Selected engagements</span>
          <span>What held up</span>
        </div>

        <div className="rr-client-wall-ledger grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
          {tier1Clients.map((client) => (
            <ClientCard key={client.name} {...client} />
          ))}
        </div>

        {showAllClients ? (
          <div className="rr-client-wall-ledger mt-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
            {tier2Clients.map((client) => (
              <ClientCard key={client.name} {...client} />
            ))}
          </div>
        ) : null}

        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={() => setShowAllClients((showAll) => !showAll)}
            aria-expanded={showAllClients}
            className="rr-client-wall-toggle"
          >
            {showAllClients ? "Show fewer engagements" : "View all engagements"}
          </button>
        </div>
      </div>
    </section>
  );
}
