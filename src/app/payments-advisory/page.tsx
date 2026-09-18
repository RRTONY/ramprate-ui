import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, {
  serviceJsonLd,
  breadcrumbJsonLd,
} from "@/components/shared/JsonLd";

const gold = "oklch(0.52 0.12 70)";

export const metadata: Metadata = {
  title: "Payments Advisory - RFP Authorship & Processor Negotiation",
  description:
    "RampRate writes your payment processing RFP, shops it to 25+ vetted processors, and negotiates the contract on your behalf. For merchants processing $1M+ annually.",
  keywords: [
    "payments advisory",
    "payment processing RFP",
    "merchant processor negotiation",
    "credit card processing fees",
    "interchange",
    "payment gateway",
    "processor RFP",
    "merchant services",
  ],
  alternates: { canonical: "/payments-advisory" },
};

const PROCESS_STEPS = [
  {
    n: "01",
    title: "You Fill Out the Intake",
    desc: "One 7-section questionnaire, ~15 minutes. Tell us your business, volume, pain points, and priorities. NDA available before you share anything sensitive.",
  },
  {
    n: "02",
    title: "We Write Your RFP",
    desc: "Our advisory team authors a board-ready RFP tailored to your industry, risk profile, technical requirements, and commercial terms - under our letterhead, on your behalf.",
  },
  {
    n: "03",
    title: "We Shop It to Processors",
    desc: "We take your RFP to 8-12 matched processors from our network of 25+. They compete for your business. You never talk to a sales rep until we've filtered the field.",
  },
  {
    n: "04",
    title: "We Negotiate. You Decide.",
    desc: "We score every response, red-line the contracts, negotiate rates and terms, and present a ranked recommendation. You make the call. We stay through onboarding and annual renewals.",
  },
];

export default function PaymentsAdvisoryPage() {
  return (
    <main className="rr-payments-surface">
      <JsonLd
        data={serviceJsonLd({
          name: "RampRate Payments Advisory",
          description:
            "RampRate writes your payment processing RFP, shops it to 25+ vetted processors, and negotiates the contract on your behalf.",
          url: "https://ramprate.com/payments-advisory",
          serviceType: "Payment processing RFP authorship and negotiation",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          {
            name: "Payments Advisory",
            url: "https://ramprate.com/payments-advisory",
          },
        ])}
      />
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--dark)] pt-32 pb-20">
        <div className="glass-orb glass-orb-amber w-[400px] h-[400px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-rust w-[240px] h-[240px] bottom-0 -left-28" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <span className="mb-4 block text-xs font-body font-semibold uppercase tracking-[0.2em] text-[var(--gold-light)]">
            RampRate A-Team · B Corp Certified · $10B+ Transacted
          </span>
          <h1 className="mb-6 text-4xl font-display font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            We Write the RFP.{" "}
            <span className="text-[oklch(0.52_0.12_70)]">We Shop It.</span> You
            Choose.
          </h1>
          <p className="mb-4 max-w-2xl text-lg font-body leading-relaxed text-white/70">
            Tell us about your business. RampRate authors your payment
            processing RFP, takes it to our network of 25+ vetted processors,
            scores every response, and negotiates the contract - all on your
            behalf, at no cost to you.
          </p>
          <p className="mb-10 max-w-2xl text-sm font-body text-[var(--gold-light)]">
            We represent merchants processing $50M-$2B+ annually. Our model is
            long-term supplier relationships, not one-time placements.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/payments-advisory/intake"
              className="inline-flex items-center gap-2 rounded-md bg-[oklch(0.52_0.12_70)] px-7 py-3.5 text-sm font-body font-semibold text-white shadow-lg transition-all"
            >
              Start Your Intake
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
              href="/payments-advisory/intel"
              className="inline-flex items-center gap-2 rounded-md border-2 border-white/30 px-7 py-3.5 text-sm font-body font-semibold text-white transition-all hover:bg-white/10"
            >
              View Market Intel
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section
        className="py-6 px-5 sm:px-8 flex justify-center gap-10 flex-wrap items-center"
        style={{ background: "oklch(0.94 0.03 80)" }}
      >
        {[
          ["$10B+", "Transactions Brokered"],
          ["25+", "Processor Relationships"],
          ["$50M+", "Target Client Volume"],
          ["5 Days", "Standard RFP Turnaround"],
        ].map(([n, l]) => (
          <div key={l} className="text-center">
            <div className="text-2xl font-display font-bold text-[oklch(0.2_0.02_50)]">
              {n}
            </div>
            <div className="text-[11px] font-body tracking-wide text-[oklch(0.45_0.02_50)]">
              {l}
            </div>
          </div>
        ))}
        <div
          className="text-center border-l pl-8"
          style={{ borderColor: "oklch(0.7 0.05 70 / 0.4)" }}
        >
          <div className="text-base font-display font-bold text-[oklch(0.2_0.02_50)]">
            Rush Available
          </div>
          <div className="text-[11px] font-body leading-snug text-[oklch(0.45_0.1_60)]">
            Expedite on request, subject to availability
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-light py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <span className="mb-3 block text-xs font-body font-semibold uppercase tracking-[0.2em] text-[oklch(0.52_0.12_70)]">
              The Process
            </span>
            <h2 className="text-3xl font-display font-bold text-[oklch(0.2_0.02_50)] sm:text-4xl">
              From Intake to Long-Term Partnership
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-xl p-7 border-t-4"
                style={{
                  borderColor: gold,
                  background: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="mb-3 text-4xl font-display font-bold"
                  style={{
                    color: gold,
                    opacity: 0.25,
                  }}
                >
                  {s.n}
                </div>
                <h3 className="mb-2 text-lg font-display font-bold text-[oklch(0.2_0.02_50)]">
                  {s.title}
                </h3>
                <p className="text-sm font-body leading-relaxed text-[oklch(0.45_0.02_50)]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* ImpactSol integration */}
          <div
            className="rounded-2xl p-9 mt-14 flex flex-wrap items-center gap-10"
            style={{ background: "var(--dark)" }}
          >
            <div className="flex-1 min-w-[280px]">
              <span className="mb-3 block text-xs font-body font-semibold uppercase tracking-[0.2em] text-[var(--gold-light)]">
                ImpactSol Integration
              </span>
              <h3 className="mb-4 text-2xl font-display font-bold text-white">
                Conscious Capital Meets Payment Infrastructure
              </h3>
              <p className="text-sm font-body leading-relaxed text-white/60">
                RampRate&apos;s payments advisory integrates with
                ImpactSol&apos;s Impact Dollar / STBL rail - enabling clients to
                optionally route a percentage of processing savings into
                impact-verified investment vehicles. Payment optimization as a
                regenerative capital strategy.
              </p>
            </div>
            <div className="flex flex-col gap-4 min-w-[220px]">
              {[
                ["90%", "Impact distribution model"],
                ["8-dim", "ImpactSol scoring"],
                ["STBL", "Stablecoin rail option"],
              ].map(([v, l]) => (
                <div key={l} className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 text-xs font-display font-bold"
                    style={{
                      background: "oklch(0.6 0.15 170 / 0.15)",
                      color: "oklch(0.7 0.13 170)",
                    }}
                  >
                    {v}
                  </div>
                  <span className="text-sm font-body text-white/70">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Qualify banner */}
          <div
            className="rounded-xl p-8 mt-10 flex justify-between items-center flex-wrap gap-6"
            style={{
              background: "oklch(0.94 0.03 80)",
              border: "2px solid oklch(0.88 0.03 75)",
            }}
          >
            <div>
              <h3 className="mb-2 text-xl font-display font-bold text-[oklch(0.2_0.02_50)]">
                Who We Work With
              </h3>
              <p className="max-w-2xl text-sm font-body leading-relaxed text-[oklch(0.45_0.02_50)]">
                Merchants with <strong>$1M minimum</strong> annual revenue -
                target is <strong>$50M and above</strong>. 25 industry verticals
                including regulated, high-risk, and complex global businesses.
                We are at capacity. Intakes are reviewed in the order received
                and matched to an advisor before we proceed.
              </p>
            </div>
            <Link
              href="/payments-advisory/intake"
              className="inline-flex shrink-0 items-center gap-2 rounded-md bg-[oklch(0.52_0.12_70)] px-7 py-3.5 text-sm font-body font-semibold text-white shadow-lg transition-all"
            >
              Start Intake
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
