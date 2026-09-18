import type { Metadata } from "next";
import { PAYMENTS_PROCESSORS } from "@/lib/payments-advisory-data";
import IndustryGrid from "@/components/payments/IndustryGrid";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Payments Market Intel - Industry Risk & Processor Benchmarks",
  description:
    "25 industry verticals classified by processing risk, average ticket, and fraud rate, plus benchmark rates across 25 payment processors and gateways.",
  alternates: { canonical: "/payments-advisory/intel" },
};

export default function PaymentsIntelPage() {
  return (
    <main className="rr-payments-surface">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          {
            name: "Payments Advisory",
            url: "https://ramprate.com/payments-advisory",
          },
          {
            name: "Intel",
            url: "https://ramprate.com/payments-advisory/intel",
          },
        ])}
      />
      <section className="bg-[var(--dark)] pt-32 pb-14">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <span className="mb-4 block text-xs font-body font-semibold uppercase tracking-[0.2em] text-[var(--gold-light)]">
            Market Intelligence
          </span>
          <h1 className="mb-4 text-3xl font-display font-bold text-white sm:text-4xl">
            Industry Classifications &amp; Processor Intelligence
          </h1>
          <p className="text-base font-body text-white/60">
            Click any industry card to see matched processor recommendations.
          </p>
        </div>
      </section>

      <section className="section-light py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <h2 className="mb-6 text-xl font-display font-bold text-[oklch(0.2_0.02_50)]">
            25 Industry Verticals
          </h2>
          <IndustryGrid />

          <h2 className="mt-16 mb-6 text-xl font-display font-bold text-[oklch(0.2_0.02_50)]">
            25 Payment Processors &amp; Gateways
          </h2>
          <div
            className="overflow-x-auto rounded-xl"
            style={{ border: "1px solid oklch(0.9 0.01 70)" }}
          >
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr style={{ background: "var(--dark)" }}>
                  {["Processor", "Best For", "Avg Rate", "Min Volume"].map(
                    (h) => (
                      <th
                        key={h}
                        className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wide"
                        style={{
                          color: "white",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {PAYMENTS_PROCESSORS.map((p, i) => (
                  <tr
                    key={p.name}
                    style={{
                      background:
                        i % 2 === 0 ? "white" : "oklch(0.97 0.005 70)",
                      borderBottom: "1px solid oklch(0.9 0.01 70)",
                    }}
                  >
                    <td className="px-4 py-3 font-display font-bold text-[oklch(0.52_0.12_70)]">
                      {p.name}
                    </td>
                    <td className="px-4 py-3 font-body text-[oklch(0.2_0.02_50)]">
                      {p.bestFor}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-[oklch(0.45_0.02_50)]">
                      {p.avgRate}
                    </td>
                    <td className="px-4 py-3 font-mono text-[oklch(0.45_0.02_50)]">
                      {p.minVolume}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
