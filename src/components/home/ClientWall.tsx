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
    <div className="text-center px-3 py-6">
      <h3 className="font-display text-xs sm:text-sm font-bold tracking-[0.15em] uppercase text-ink">
        {name}
      </h3>
      <p className="font-body text-[11px] sm:text-xs mt-1.5 leading-snug text-ink-mid">
        {context}
      </p>
    </div>
  );
}

export default function ClientWall() {
  const [showAllClients, setShowAllClients] = useState(false);

  return (
    <section className="section-light py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-ink leading-tight">
            25 Years Inside the World&apos;s Most
            <br className="hidden sm:block" />
            <span className="text-rust"> Complex Enterprises</span>
          </h2>
          <p className="font-body mt-3 text-sm text-ink-mid">
            100+ engagements. $10B+ in decisions transacted. Names you know.
          </p>
        </div>

        {/* Tier 1 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 divide-x divide-y divide-black/8 border border-black/8 rounded-lg overflow-hidden">
          {tier1Clients.map((c) => (
            <ClientCard key={c.name} name={c.name} context={c.context} />
          ))}
        </div>

        {/* Tier 2 */}
        {showAllClients && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 divide-x divide-y divide-black/8 border border-black/8 rounded-lg overflow-hidden mt-3">
            {tier2Clients.map((c) => (
              <ClientCard key={c.name} name={c.name} context={c.context} />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAllClients(!showAllClients)}
            className="font-body text-xs font-semibold tracking-[0.15em] uppercase transition-colors hover:text-ink text-ink-mid"
          >
            {showAllClients ? "- Show Less" : "+ View All Clients"}
          </button>
        </div>
      </div>
    </section>
  );
}
