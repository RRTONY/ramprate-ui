import Image from "next/image";
import { isPortalUnlocked } from "@/lib/portal-auth";
import PortalGate from "@/components/portal/PortalGate";
import PartnerFaqSection from "@/components/biochain/PartnerFaqSection";
import {
  overviewCards,
  sellerPrograms,
  buyerPrograms,
  buyerRowIntro,
  faqSections,
  buySideFaqSections,
} from "./faq-data";

const navGroups = [
  {
    label: null,
    links: [
      { href: "#overview", label: "Overview" },
      { href: "#engagement", label: "Engagement" },
    ],
  },
  {
    label: "Sell-Side",
    links: [
      { href: "#section-1", label: "Sourcing" },
      { href: "#section-2", label: "Core Terms" },
      { href: "#section-3", label: "Startup Terms" },
      { href: "#section-4", label: "Leads" },
      { href: "#section-5", label: "Other" },
    ],
  },
  {
    label: "Buy-Side",
    links: [
      { href: "#buy-section-1", label: "Process" },
      { href: "#buy-section-2", label: "Contract" },
      { href: "#buy-section-3", label: "Fees" },
      { href: "#buy-section-4", label: "Legal" },
    ],
  },
];

export default async function BioChainPartnerFaqPage() {
  const unlocked = await isPortalUnlocked("biochain-partner-faq");

  if (!unlocked) {
    return (
      <PortalGate
        portalId="biochain-partner-faq"
        title="Supplier Partner FAQ"
        subtitle="Enter the password to view this confidential RampRate BioChain reference."
        variant="biochain"
      />
    );
  }

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-black/10">
        <div className="max-w-[1180px] mx-auto px-7 h-16 flex items-center gap-5">
          <Image
            src="/ramprate-logo.png"
            alt="RampRate"
            width={110}
            height={26}
            className="w-[110px] h-auto"
          />
          <div className="ml-auto flex items-center gap-4 overflow-x-auto no-scrollbar">
            {navGroups.map((group, gi) => (
              <div key={gi} className="flex items-center gap-4">
                {group.label && (
                  <span className="text-[10px] font-mono uppercase tracking-wide text-[oklch(0.5_0.1_70)] pl-3 border-l border-black/15 whitespace-nowrap">
                    {group.label}
                  </span>
                )}
                {group.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="text-[11px] font-mono uppercase tracking-wide text-ink-mid hover:text-ink whitespace-nowrap"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </nav>

      <header className="bg-warm-bg border-b border-black/10">
        <div className="max-w-[1180px] mx-auto px-7 pt-16 pb-16">
          <div className="text-xs font-mono uppercase tracking-[0.08em] text-[oklch(0.5_0.1_70)] mb-3">
            RampRate BioChain Network
          </div>
          <h1 className="text-[clamp(2.4rem,6vw,4.4rem)] leading-[0.98] tracking-[-0.03em] font-bold text-ink max-w-[760px] mb-6 font-display">
            Supplier / Manufacturing Partner Engagement FAQ
          </h1>
          <div className="flex gap-3 flex-wrap">
            <span className="rounded-full border border-black/15 bg-white px-3 py-2 text-[11px] font-mono text-ink-mid">
              CONFIDENTIAL
            </span>
            <span className="rounded-full border border-black/15 bg-white px-3 py-2 text-[11px] font-mono text-ink-mid">
              SUPPLIER PARTNER REFERENCE
            </span>
          </div>
        </div>
      </header>

      <section className="bg-white py-20" id="overview">
        <div className="max-w-[1180px] mx-auto px-7">
          <div className="grid sm:grid-cols-[180px_1fr] gap-8 mb-8">
            <div className="text-xs font-mono uppercase tracking-wide text-[oklch(0.5_0.1_70)]">
              01 / Overview
            </div>
            <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-bold text-ink font-display">
              Overview
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {overviewCards.map((c) => (
              <article
                key={c.title}
                className="rounded-2xl border border-black/10 bg-warm-light p-7"
              >
                <h3 className="text-lg font-bold text-ink mb-2 font-display">
                  {c.title}
                </h3>
                <p className="text-ink-mid text-[15px] leading-relaxed">
                  {c.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-warm-light py-20" id="engagement">
        <div className="max-w-[1180px] mx-auto px-7">
          <div className="grid sm:grid-cols-[180px_1fr] gap-8 mb-10">
            <div className="text-xs font-mono uppercase tracking-wide text-[oklch(0.5_0.1_70)]">
              02 / Engagement
            </div>
            <div>
              <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-bold text-ink mb-3 font-display">
                How RampRate Engages
              </h2>
              <p className="text-ink-mid text-lg">
                <strong className="text-ink">
                  Five ways to work with RampRate, depending on whether
                  you&rsquo;re selling, buying, or both.
                </strong>
              </p>
            </div>
          </div>

          <div className="text-[11px] font-mono uppercase tracking-wide text-[oklch(0.5_0.1_70)] mb-4">
            As a Seller
          </div>
          <div className="grid sm:grid-cols-3 gap-4 items-start">
            {sellerPrograms.map((p) => (
              <details
                key={p.num}
                className="rounded-2xl border border-black/10 bg-white overflow-hidden group"
              >
                <summary className="relative cursor-pointer list-none px-6 py-6 pr-10 [&::-webkit-details-marker]:hidden">
                  <div className="text-[11px] font-mono text-[oklch(0.5_0.1_70)] mb-3">
                    {p.num}
                  </div>
                  <h3 className="text-[21px] leading-tight font-bold text-ink font-display">
                    {p.title}
                  </h3>
                  <span className="absolute right-5 bottom-5 text-2xl text-gold group-open:hidden">
                    +
                  </span>
                  <span className="absolute right-5 bottom-5 text-2xl text-gold hidden group-open:inline">
                    &ndash;
                  </span>
                </summary>
                <div className="px-6 pb-6 text-[15px] leading-relaxed text-ink-mid">
                  {p.body}
                </div>
              </details>
            ))}
          </div>

          <div className="text-[11px] font-mono uppercase tracking-wide text-[oklch(0.5_0.1_70)] mb-4 mt-10">
            As a Buyer, Too
          </div>
          <div className="mb-6">{buyerRowIntro}</div>
          <div className="grid sm:grid-cols-2 gap-4 items-start">
            {buyerPrograms.map((p) => (
              <details
                key={p.num}
                className="rounded-2xl border border-black/10 bg-white overflow-hidden group"
              >
                <summary className="relative cursor-pointer list-none px-6 py-6 pr-10 [&::-webkit-details-marker]:hidden">
                  <div className="text-[11px] font-mono text-[oklch(0.5_0.1_70)] mb-3">
                    {p.num}
                  </div>
                  <h3 className="text-[21px] leading-tight font-bold text-ink font-display">
                    {p.title}
                  </h3>
                  <span className="absolute right-5 bottom-5 text-2xl text-gold group-open:hidden">
                    +
                  </span>
                  <span className="absolute right-5 bottom-5 text-2xl text-gold hidden group-open:inline">
                    &ndash;
                  </span>
                </summary>
                <div className="px-6 pb-6 text-[15px] leading-relaxed text-ink-mid">
                  {p.body}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-warm-bg py-14 border-y border-black/10">
        <div className="max-w-[1180px] mx-auto px-7 text-center">
          <div className="text-xs font-mono uppercase tracking-[0.08em] text-[oklch(0.5_0.1_70)] mb-2">
            Sell-Side FAQ
          </div>
          <p className="text-ink-mid text-sm max-w-xl mx-auto">
            The sections below cover referral and channel terms for what you
            sell into the BioChain network. Sourcing supply for your own
            production instead? Jump to the Buy-Side FAQ further down.
          </p>
        </div>
      </section>

      {faqSections.map((section, i) => (
        <section
          key={section.id}
          id={section.id}
          className={`py-20 ${i % 2 ? "bg-warm-light" : "bg-white"}`}
        >
          <div className="max-w-[1180px] mx-auto px-7">
            <div className="grid sm:grid-cols-[180px_1fr] gap-8 mb-6">
              <div
                className="text-xs font-mono uppercase tracking-wide text-[oklch(0.5_0.1_70)]"
              >
                {section.kicker}
              </div>
              <div>
                <h2
                  className="text-[clamp(1.6rem,3.6vw,2.6rem)] font-bold font-display text-ink"
                >
                  {section.title}
                </h2>
                {section.intro && <div className="mt-3">{section.intro}</div>}
              </div>
            </div>
            <div className="text-ink">
              <PartnerFaqSection items={section.items} />
            </div>
          </div>
        </section>
      ))}

      <section className="bg-warm-bg py-14 border-y border-black/10">
        <div className="max-w-[1180px] mx-auto px-7 text-center">
          <div className="text-xs font-mono uppercase tracking-[0.08em] text-[oklch(0.5_0.1_70)] mb-2">
            Buy-Side FAQ
          </div>
          <p className="text-ink-mid text-sm max-w-xl mx-auto">
            The sections below cover sourcing the products, raw materials, or
            capacity you need through RampRate &mdash; as a buyer, not a seller.
          </p>
        </div>
      </section>

      {buySideFaqSections.map((section, i) => (
        <section
          key={section.id}
          id={section.id}
          className={`py-20 ${i % 2 ? "bg-warm-light" : "bg-white"}`}
        >
          <div className="max-w-[1180px] mx-auto px-7">
            <div className="grid sm:grid-cols-[180px_1fr] gap-8 mb-6">
              <div
                className="text-xs font-mono uppercase tracking-wide text-[oklch(0.5_0.1_70)]"
              >
                {section.kicker}
              </div>
              <div>
                <h2
                  className="text-[clamp(1.6rem,3.6vw,2.6rem)] font-bold font-display text-ink"
                >
                  {section.title}
                </h2>
                {section.intro && <div className="mt-3">{section.intro}</div>}
              </div>
            </div>
            <div className="text-ink">
              <PartnerFaqSection items={section.items} />
            </div>
          </div>
        </section>
      ))}

      <footer className="bg-warm-bg py-12 border-t border-black/10">
        <div className="max-w-[1180px] mx-auto px-7 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-wide text-[oklch(0.5_0.1_70)] mb-1">
              Confidential
            </div>
            <p className="text-ink-mid text-sm">
              RampRate BioChain Network &middot; Supplier / Manufacturing
              Partner Engagement FAQ &middot; ramprate.com
            </p>
          </div>
          <Image
            src="/ramprate-logo.png"
            alt="RampRate"
            width={130}
            height={31}
            className="w-[130px] h-auto"
          />
        </div>
      </footer>
    </div>
  );
}
