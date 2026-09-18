import Image from "next/image";
import { isPortalUnlocked } from "@/lib/portal-auth";
import PortalGate from "@/components/portal/PortalGate";
import PartnerFaqSection from "@/components/biochain/PartnerFaqSection";
import { overviewCards, programs, faqSections } from "./faq-data";

const navLinks = [
  { href: "#overview", label: "Overview" },
  { href: "#engagement", label: "Three Ways" },
  { href: "#section-1", label: "Sourcing" },
  { href: "#section-2", label: "Core Terms" },
  { href: "#section-3", label: "Elevate" },
  { href: "#section-4", label: "Send Leads" },
  { href: "#section-5", label: "Agreement" },
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
      <nav className="sticky top-0 z-30 bg-dark/95 backdrop-blur border-b border-white/10">
        <div className="max-w-[1180px] mx-auto px-7 h-16 flex items-center gap-5">
          <Image
            src="/ramprate-logo.png"
            alt="RampRate"
            width={110}
            height={26}
            className="w-[110px] h-auto invert"
          />
          <div className="ml-auto flex gap-4 overflow-x-auto no-scrollbar">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[11px] font-mono uppercase tracking-wide text-white/60 hover:text-gold-light whitespace-nowrap"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <header className="relative min-h-[560px] overflow-hidden bg-dark">
        <div className="absolute inset-0">
          <Image
            src="/biochain/partner-faq-hero.webp"
            alt=""
            fill
            priority
            className="object-cover object-[70%_center]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0a0f1a_0%,rgba(10,15,26,.97)_32%,rgba(10,15,26,.55)_58%,rgba(10,15,26,.1)_100%)]" />
        </div>
        <div className="relative z-[1] max-w-[1180px] mx-auto px-7 pt-16 pb-16">
          <Image
            src="/ramprate-logo.png"
            alt="RampRate"
            width={150}
            height={36}
            className="w-[150px] h-auto invert mb-8"
          />
          <div className="text-xs font-mono uppercase tracking-[0.08em] text-gold-light mb-3">
            RampRate BioChain Network
          </div>
          <h1 className="text-[clamp(2.4rem,6vw,4.4rem)] leading-[0.98] tracking-[-0.03em] font-bold text-white max-w-[700px] mb-6 font-display">
            Supplier / Manufacturing Partner Engagement FAQ
          </h1>
          <div className="flex gap-3 flex-wrap">
            <span className="rounded-full border border-white/25 bg-white/5 px-3 py-2 text-[11px] font-mono text-white/80">
              CONFIDENTIAL
            </span>
            <span className="rounded-full border border-white/25 bg-white/5 px-3 py-2 text-[11px] font-mono text-white/80">
              SUPPLIER PARTNER REFERENCE
            </span>
          </div>
        </div>
      </header>

      <section className="bg-warm-light py-20" id="overview">
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
                className="rounded-2xl border border-black/10 bg-white p-7"
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

      <section className="bg-dark py-20" id="engagement">
        <div className="max-w-[1180px] mx-auto px-7">
          <div className="grid sm:grid-cols-[180px_1fr] gap-8 mb-8">
            <div className="text-xs font-mono uppercase tracking-wide text-gold">
              02 / Engagement
            </div>
            <div>
              <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-bold text-white mb-3 font-display">
                Three Ways RampRate Engages
              </h2>
              <p className="text-white/70 text-lg">
                <strong className="text-white">
                  What are the three levels of engagement, and why does it
                  matter for compensation?
                </strong>
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 items-start">
            {programs.map((p) => (
              <details
                key={p.num}
                className="rounded-2xl border border-white/10 bg-dark-mid overflow-hidden group"
              >
                <summary className="relative cursor-pointer list-none px-6 py-6 pr-10 [&::-webkit-details-marker]:hidden">
                  <div className="text-[11px] font-mono text-gold-light mb-3">
                    {p.num}
                  </div>
                  <h3 className="text-[21px] leading-tight font-bold text-white font-display">
                    {p.title}
                  </h3>
                  <span className="absolute right-5 bottom-5 text-2xl text-gold group-open:hidden">
                    +
                  </span>
                  <span className="absolute right-5 bottom-5 text-2xl text-gold hidden group-open:inline">
                    &ndash;
                  </span>
                </summary>
                <div className="px-6 pb-6 text-[15px] leading-relaxed text-white/70">
                  {p.body}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {faqSections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className={`py-20 ${section.dark ? "bg-dark" : "bg-warm-light"}`}
        >
          <div className="max-w-[1180px] mx-auto px-7">
            <div className="grid sm:grid-cols-[180px_1fr] gap-8 mb-6">
              <div
                className={`text-xs font-mono uppercase tracking-wide ${
                  section.dark ? "text-gold" : "text-[oklch(0.5_0.1_70)]"
                }`}
              >
                {section.kicker}
              </div>
              <h2
                className={`text-[clamp(1.6rem,3.6vw,2.6rem)] font-bold font-display ${
                  section.dark ? "text-white" : "text-ink"
                }`}
              >
                {section.title}
              </h2>
            </div>
            <div className={section.dark ? "text-white" : "text-ink"}>
              <PartnerFaqSection items={section.items} dark={section.dark} />
            </div>
          </div>
        </section>
      ))}

      <section className="bg-dark py-14 border-t border-white/10">
        <div className="max-w-[1180px] mx-auto px-7 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-wide text-gold mb-1">
              Confidential
            </div>
            <p className="text-white/60 text-sm">
              RampRate Confidential &middot; ramprate.com
            </p>
          </div>
          <Image
            src="/ramprate-logo.png"
            alt="RampRate"
            width={130}
            height={31}
            className="w-[130px] h-auto invert"
          />
        </div>
      </section>

      <footer className="bg-[#050a10] py-11 border-t border-white/10">
        <div className="max-w-[1180px] mx-auto px-7 flex flex-wrap items-end justify-between gap-5">
          <Image
            src="/ramprate-logo.png"
            alt="RampRate"
            width={130}
            height={31}
            className="w-[130px] h-auto invert"
          />
          <div className="text-[11px] font-mono text-white/40 text-right">
            RampRate BioChain Network
            <br />
            Supplier / Manufacturing Partner Engagement FAQ
          </div>
        </div>
      </footer>
    </div>
  );
}
