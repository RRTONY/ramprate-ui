import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCT_CATEGORIES } from "@/lib/biochain-catalogue";

export const metadata: Metadata = {
  title: "Full Product Catalog - BioChain Sourcing",
  description:
    "Browse RampRate BioChain Sourcing's full peptide, exosome, stem cell, and longevity product catalog before starting a client intake or supplier application.",
  alternates: { canonical: "/biochain/catalogue" },
  openGraph: {
    title: "Full Product Catalog - BioChain Sourcing | RampRate",
    description:
      "Browse RampRate BioChain Sourcing's full peptide, exosome, stem cell, and longevity product catalog.",
    url: "https://ramprate.com/biochain/catalogue",
  },
};

const gold = "oklch(0.52 0.12 70)";

export default function BioChainCataloguePage() {
  const totalItems = PRODUCT_CATEGORIES.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <main>
      <section className="relative pt-32 pb-16 overflow-hidden" style={{ background: "var(--dark)" }}>
        <div className="glass-orb glass-orb-amber w-[400px] h-[400px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-rust w-[240px] h-[240px] bottom-0 -left-28" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
            style={{ color: "var(--gold-light)", fontFamily: "var(--font-body)" }}
          >
            RampRate BioChain Sourcing
          </span>
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Full Product Catalog
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-6 max-w-2xl" style={{ fontFamily: "var(--font-body)" }}>
            {totalItems}+ peptides and biologics across {PRODUCT_CATEGORIES.length} categories. Browse everything
            we source before you start a client intake or supplier application - no login required.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/biochain/buyer-intake"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold text-white transition-all shadow-lg"
              style={{ background: gold, fontFamily: "var(--font-body)" }}
            >
              Start Client Intake
            </Link>
            <Link
              href="/biochain/supplier-intake"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-all"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Apply as a Supplier
            </Link>
          </div>
        </div>
      </section>

      <section className="section-light py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-col gap-8">
          {PRODUCT_CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="rounded-xl border p-6 sm:p-7"
              style={{ borderColor: "oklch(0.9 0.01 80)", background: "oklch(0.98 0.01 75)" }}
            >
              <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
                {cat.name}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {cat.items.map((item) => (
                  <div
                    key={item}
                    className="text-sm px-3.5 py-2.5 rounded-lg border bg-white"
                    style={{ borderColor: "oklch(0.9 0.01 80)", color: "oklch(0.25 0.02 50)", fontFamily: "var(--font-body)" }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
