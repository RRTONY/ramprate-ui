import type { Metadata } from "next";
import SupplierIntakeStage2Form from "@/components/supplier/SupplierIntakeStage2Form";

export const metadata: Metadata = {
  title: "Supplier Deep-Dive Application",
  robots: { index: false, follow: false, nocache: true },
};

export default async function SupplierIntakeStage2Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: "var(--dark)" }}>
        <div className="glass-orb glass-orb-amber w-[400px] h-[400px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-rust w-[240px] h-[240px] bottom-0 -left-28" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
            style={{ color: "var(--gold-light)", fontFamily: "var(--font-body)" }}
          >
            Peptide Supply Partner Application - Deep Dive
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            Supplier Due Diligence Form
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-2xl" style={{ fontFamily: "var(--font-body)" }}>
            Thanks for the first look - we&apos;d like the full picture. This form covers
            manufacturing, quality, commercial terms, regulatory compliance, and document
            upload. Your progress saves automatically as you go, so it&apos;s safe to come
            back to this same link later.
          </p>
        </div>
      </section>

      {/* Tabbed form */}
      <section className="section-warm py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <SupplierIntakeStage2Form token={token} />
        </div>
      </section>
    </main>
  );
}
