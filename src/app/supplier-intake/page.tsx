import type { Metadata } from "next";
import SupplierIntakeStage1Form from "@/components/supplier/SupplierIntakeStage1Form";
import { STAGE1_TOTAL_FIELD_COUNT } from "@/lib/supplier-intake-fields";

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
  ],
};

export default function SupplierIntakePage() {
  return (
    <main>
      {/* Hero */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{ background: "var(--dark)" }}
      >
        <div className="glass-orb glass-orb-amber w-[400px] h-[400px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-rust w-[240px] h-[240px] bottom-0 -left-28" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
            style={{
              color: "var(--gold-light)",
              fontFamily: "var(--font-body)",
            }}
          >
            Peptide Supply Partner Application
          </span>
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Supplier Intake Form
          </h1>
          <p
            className="text-white/70 text-lg leading-relaxed mb-10 max-w-2xl"
            style={{ fontFamily: "var(--font-body)" }}
          >
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
