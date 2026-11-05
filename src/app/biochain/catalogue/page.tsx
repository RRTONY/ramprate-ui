import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PRODUCT_CATEGORIES } from "@/lib/biochain-catalogue";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Full Product Catalog - BioChain Sourcing",
  description:
    "Browse RampRate BioChain Sourcing's full peptide, exosome, stem cell, and longevity product catalog before starting a client intake or supplier application.",
  alternates: { canonical: "/biochain/catalogue" },
  // Gated behind the buyer intake flow (see catalogue-access/route.ts) -
  // never meant to be a standalone indexed landing page. Keep noindex even
  // if the gate mechanism ever changes.
  robots: { index: false, follow: false },
  openGraph: {
    title: "Full Product Catalog - BioChain Sourcing | RampRate",
    description:
      "Browse RampRate BioChain Sourcing's full peptide, exosome, stem cell, and longevity product catalog.",
    url: "https://ramprate.com/biochain/catalogue",
  },
};

const gold = "oklch(0.52 0.12 70)";

export default async function BioChainCataloguePage() {
  // Only reachable via /biochain/catalogue-access, which sets this cookie -
  // there is no public link directly into this page. Using cookies() here
  // (a single leaf page, not a shared layout/metadata helper) opts only
  // this route into dynamic rendering, not the rest of the site.
  const cookieStore = await cookies();
  if (!cookieStore.has("biochain_catalogue_gate")) {
    redirect("/biochain/buyer-intake");
  }

  const totalItems = PRODUCT_CATEGORIES.reduce(
    (sum, c) => sum + c.items.length,
    0,
  );

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "BioChain", url: "https://ramprate.com/biochain" },
          { name: "Catalogue", url: "https://ramprate.com/biochain/catalogue" },
        ])}
      />
      <section className="section-light pt-40 pb-16 border-b border-black/10">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase mb-4 block text-[oklch(0.52_0.12_70)]">
            RampRate BioChain Sourcing
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink mb-6 leading-tight">
            Full Product Catalog
          </h1>
          <p className="font-body text-ink-mid text-lg leading-relaxed mb-6 max-w-2xl">
            {totalItems}+ peptides and biologics across{" "}
            {PRODUCT_CATEGORIES.length} categories.
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
              className="font-body inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold border-2 border-black/15 text-ink hover:bg-black/5 transition-colors"
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
              style={{
                borderColor: "oklch(0.9 0.01 80)",
                background: "oklch(0.98 0.01 75)",
              }}
            >
              <h2
                className="text-lg font-bold mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {cat.name}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {cat.items.map((item) => (
                  <div
                    key={item}
                    className="text-sm px-3.5 py-2.5 rounded-lg border bg-white"
                    style={{
                      borderColor: "oklch(0.9 0.01 80)",
                      color: "oklch(0.25 0.02 50)",
                      fontFamily: "var(--font-body)",
                    }}
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
