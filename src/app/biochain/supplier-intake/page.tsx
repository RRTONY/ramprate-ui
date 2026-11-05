import type { Metadata } from "next";
import SupplierIntakeStage1Form from "@/components/supplier/SupplierIntakeStage1Form";
import { STAGE1_TOTAL_FIELD_COUNT } from "@/lib/supplier-intake-fields";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Supplier Intake - Peptide Supply Partner Application",
  description: `RampRate's quick, ${STAGE1_TOTAL_FIELD_COUNT}-field first-touch application for peptide supply partners - no uploads, about 2-3 minutes. Suppliers we want to pursue get a longer due-diligence follow-up.`,
  keywords: [
    "supplier",
    "vendor",
    "supplier intake",
    "vendor intake",
    "supplier registration",
    "vendor registration",
    "become a supplier",
    "manufacturing partner",
    "peptides",
    "supply chain",
    "supplier application",
    "vendor application",
    "supplier fit index",
    "third-party tested peptides",
    "Certificate of Analysis (COA) verified",
    "batch-specific COA",
    "chain-of-custody tracking",
    "cGMP certified peptide manufacturer",
    "independent lab testing",
    "peptide synthesis",
    "peptide supply partner",
    "peptide distributor vetting",
  ],
  alternates: { canonical: "/biochain/supplier-intake" },
  openGraph: {
    title: "Supplier Intake - Peptide Supply Partner Application | RampRate",
    description: `RampRate's quick, ${STAGE1_TOTAL_FIELD_COUNT}-field first-touch application for peptide supply partners.`,
    url: "https://ramprate.com/biochain/supplier-intake",
  },
};

export default function SupplierIntakePage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "BioChain", url: "https://ramprate.com/biochain" },
          { name: "Supplier Intake", url: "https://ramprate.com/biochain/supplier-intake" },
        ])}
      />
      {/* Hero */}
      <section className="section-light pt-40 pb-20 border-b border-black/10">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase mb-4 block text-[oklch(0.52_0.12_70)]">
            Peptide Supply Partner Application
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink mb-6 leading-tight">
            Supplier Intake Form
          </h1>
          <p className="font-body text-ink-mid text-lg leading-relaxed mb-10 max-w-2xl">
            A quick, {STAGE1_TOTAL_FIELD_COUNT}-field first look - no uploads, about 2-3
            minutes. If there&apos;s a fit, we&apos;ll follow up with a longer
            application to confirm the details. No fee. No obligation.
          </p>
        </div>
      </section>

      {/* Tabbed form */}
      <section className="section-warm py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <SupplierIntakeStage1Form />
        </div>
      </section>
    </main>
  );
}
