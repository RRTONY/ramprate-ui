import type { Metadata } from "next";
import { PAYMENTS_PROCESSORS } from "@/lib/payments-advisory-data";
import IndustryGrid from "@/components/payments/IndustryGrid";

export const metadata: Metadata = {
  title: "Payments Market Intel - Industry Risk & Processor Benchmarks",
  description:
    "25 industry verticals classified by processing risk, average ticket, and fraud rate, plus benchmark rates across 25 payment processors and gateways.",
};

export default function PaymentsIntelPage() {
  return (
    <main>
      <section className="pt-32 pb-14" style={{ background: "var(--dark)" }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
            style={{ color: "var(--gold-light)", fontFamily: "var(--font-body)" }}
          >
            Market Intelligence
          </span>
          <h1
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Industry Classifications &amp; Processor Intelligence
          </h1>
          <p className="text-white/60 text-base" style={{ fontFamily: "var(--font-body)" }}>
            Click any industry card to see matched processor recommendations.
          </p>
        </div>
      </section>

      <section className="section-light py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <h2
            className="text-xl font-bold mb-6"
            style={{ fontFamily: "var(--font-display)", color: "oklch(0.2 0.02 50)" }}
          >
            25 Industry Verticals
          </h2>
          <IndustryGrid />

          <h2
            className="text-xl font-bold mb-6 mt-16"
            style={{ fontFamily: "var(--font-display)", color: "oklch(0.2 0.02 50)" }}
          >
            25 Payment Processors &amp; Gateways
          </h2>
          <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid oklch(0.9 0.01 70)" }}>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr style={{ background: "var(--dark)" }}>
                  {["Processor", "Best For", "Avg Rate", "Min Volume"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[11px] uppercase tracking-wide whitespace-nowrap"
                      style={{ color: "white", fontFamily: "var(--font-mono)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PAYMENTS_PROCESSORS.map((p, i) => (
                  <tr
                    key={p.name}
                    style={{
                      background: i % 2 === 0 ? "white" : "oklch(0.97 0.005 70)",
                      borderBottom: "1px solid oklch(0.9 0.01 70)",
                    }}
                  >
                    <td
                      className="px-4 py-3 font-bold"
                      style={{ fontFamily: "var(--font-display)", color: "oklch(0.52 0.12 70)" }}
                    >
                      {p.name}
                    </td>
                    <td className="px-4 py-3" style={{ fontFamily: "var(--font-body)", color: "oklch(0.2 0.02 50)" }}>
                      {p.bestFor}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ fontFamily: "var(--font-mono)", color: "oklch(0.45 0.02 50)" }}>
                      {p.avgRate}
                    </td>
                    <td className="px-4 py-3" style={{ fontFamily: "var(--font-mono)", color: "oklch(0.45 0.02 50)" }}>
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
