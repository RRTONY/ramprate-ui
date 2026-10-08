"use client";

import { useState } from "react";
import Image from "next/image";

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
const additionalLogoClients = [
  { name: "Goldman Sachs", context: "" },
  { name: "PayPal", context: "" },
  { name: "Verizon", context: "" },
  { name: "AT&T", context: "" },
  { name: "Accenture", context: "" },
  { name: "Bain & Company", context: "" },
  { name: "McKinsey & Company", context: "" },
  { name: "Bridgewater", context: "" },
  { name: "Broadcom", context: "" },
  { name: "Blizzard Entertainment", context: "" },
  { name: "Audible", context: "" },
  { name: "Expedia", context: "" },
];

const clientLogos: Record<string, string> = {
  Microsoft: "/proof/logos/microsoft.png",
  eBay: "/proof/logos/ebay.png",
  Sony: "/home/logos/sony.svg",
  Paramount: "/home/logos/paramount.svg",
  Intel: "/home/logos/intel.svg",
  Nike: "/home/logos/nike.svg",
  Hearst: "/home/logos/hearst.svg",
  "Riot Games": "/home/logos/riot-games.png",
  "Goldman Sachs": "/home/logos/goldman-sachs.svg",
  PayPal: "/proof/logos/paypal.svg",
  Verizon: "/proof/logos/verizon.svg",
  "AT&T": "/proof/logos/at-t.png",
  Accenture: "/proof/logos/accenture.png",
  "Bain & Company": "/proof/logos/bain.png",
  "McKinsey & Company": "/home/logos/mckinsey.svg",
  Bridgewater: "/proof/logos/bridgewater.png",
  Broadcom: "/proof/logos/broadcom.png",
  "Blizzard Entertainment": "/home/logos/blizzard.svg",
  Audible: "/proof/logos/audible.png",
  Expedia: "/proof/logos/expedia.png",
};

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
    <div className="text-center px-2 py-3 bg-white">
      {clientLogos[name] ? (
        <div className="h-10 flex items-center justify-center">
          <Image
            src={clientLogos[name]}
            alt={name}
            width={160}
            height={70}
            sizes="(max-width: 640px) 140px, 160px"
            className="max-h-12 w-auto max-w-full object-contain scale-[0.42]"
          />
        </div>
      ) : (
        <h3 className="font-display text-xs sm:text-sm font-bold tracking-[0.15em] uppercase text-ink text-balance">
          {name}
        </h3>
      )}
      {false && context && (
        <p className="font-body text-xs mt-2 leading-snug text-ink-mid text-pretty">
          {context}
        </p>
      )}
    </div>
  );
}

export default function ClientWall() {
  const [showAllClients, setShowAllClients] = useState(false);

  return (
    <section className="section-light py-10 sm:py-12">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-ink leading-tight text-balance">
            Selected client engagements
          </h2>
          <p className="font-body mt-3 text-sm text-ink-mid text-pretty">
            Technology sourcing, product strategy, and growth advisory since
            2000.
          </p>
        </div>

        {/* Tier 1 */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[...tier1Clients, ...additionalLogoClients.slice(0, 2)].map((c) => (
            <ClientCard key={c.name} name={c.name} context={c.context} />
          ))}
        </div>

        {/* Tier 2 */}
        {showAllClients && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 divide-x divide-y divide-black/8 border border-black/8 rounded-lg overflow-hidden mt-3">
            {[...additionalLogoClients.slice(2), ...tier2Clients]
              .filter(
                (c) =>
                  !clientLogos[c.name] ||
                  additionalLogoClients.some((a) => a.name === c.name),
              )
              .map((c) => (
                <ClientCard key={c.name} name={c.name} context={c.context} />
              ))}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAllClients(!showAllClients)}
            className="font-body text-xs font-semibold tracking-[0.15em] uppercase transition-colors hover:text-ink text-ink-mid"
          >
            {showAllClients ? "- Show Less" : "+ More client engagements"}
          </button>
        </div>
      </div>
    </section>
  );
}
