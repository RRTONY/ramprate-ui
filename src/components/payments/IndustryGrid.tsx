"use client";

import { useState } from "react";
import { PAYMENTS_INDUSTRIES, type PaymentsIndustry } from "@/lib/payments-advisory-data";

const gold = "oklch(0.52 0.12 70)";

const RISK_STYLES: Record<PaymentsIndustry["risk"], { bg: string; color: string }> = {
  Low: { bg: "oklch(0.9 0.08 150 / 0.5)", color: "oklch(0.4 0.1 150)" },
  "Low-Medium": { bg: "oklch(0.9 0.08 150 / 0.5)", color: "oklch(0.4 0.1 150)" },
  Medium: { bg: "oklch(0.92 0.08 85 / 0.6)", color: "oklch(0.45 0.12 70)" },
  "Medium-High": { bg: "oklch(0.92 0.08 85 / 0.6)", color: "oklch(0.45 0.12 70)" },
  High: { bg: "oklch(0.9 0.09 25 / 0.5)", color: "oklch(0.5 0.15 25)" },
  "Very High": { bg: "oklch(0.9 0.08 300 / 0.5)", color: "oklch(0.45 0.13 300)" },
};

export default function IndustryGrid() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
      {PAYMENTS_INDUSTRIES.map((ind) => {
        const risk = RISK_STYLES[ind.risk];
        const isSelected = selected === ind.id;
        return (
          <button
            key={ind.id}
            type="button"
            onClick={() => setSelected(isSelected ? null : ind.id)}
            className="text-left rounded-xl p-5 transition-all"
            style={{
              background: "white",
              border: `1px solid ${isSelected ? gold : "oklch(0.9 0.01 70)"}`,
              boxShadow: isSelected ? `0 0 0 2px ${gold}33` : "none",
            }}
          >
            <div className="flex justify-between items-start gap-2 mb-3">
              <h4
                className="text-sm font-bold flex-1"
                style={{ fontFamily: "var(--font-display)", color: "oklch(0.2 0.02 50)" }}
              >
                {ind.label}
              </h4>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded whitespace-nowrap shrink-0"
                style={{ background: risk.bg, color: risk.color, fontFamily: "var(--font-mono)" }}
              >
                {ind.risk}
              </span>
            </div>
            <div className="flex gap-6">
              <div>
                <div
                  className="text-[10px] uppercase tracking-wide mb-0.5"
                  style={{ color: "oklch(0.55 0.02 50)", fontFamily: "var(--font-mono)" }}
                >
                  Avg Ticket
                </div>
                <div className="text-base font-bold" style={{ fontFamily: "var(--font-display)", color: gold }}>
                  {ind.avgTicket}
                </div>
              </div>
              <div>
                <div
                  className="text-[10px] uppercase tracking-wide mb-0.5"
                  style={{ color: "oklch(0.55 0.02 50)", fontFamily: "var(--font-mono)" }}
                >
                  Fraud Rate
                </div>
                <div className="text-base font-bold" style={{ fontFamily: "var(--font-display)", color: "oklch(0.55 0.15 25)" }}>
                  {ind.fraudRate}
                </div>
              </div>
            </div>
            {isSelected && (
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid oklch(0.9 0.01 70)" }}>
                <div
                  className="text-[10px] uppercase tracking-wide mb-2"
                  style={{ color: "oklch(0.55 0.02 50)", fontFamily: "var(--font-mono)" }}
                >
                  Top Processors
                </div>
                <div className="flex gap-2 flex-wrap">
                  {ind.topProcessors.map((p) => (
                    <span
                      key={p}
                      className="text-xs font-semibold px-2.5 py-1 rounded"
                      style={{ background: "oklch(0.52 0.12 70 / 0.1)", color: gold, fontFamily: "var(--font-body)" }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
