import type { Metadata } from "next";
import ClientIntakeForm from "@/components/biochain/ClientIntakeForm";
import { TOTAL_FIELD_COUNT } from "@/lib/client-intake-fields";

export const metadata: Metadata = {
  title: "Client Intake Application - BioChain Sourcing | RampRate",
  description: `RampRate BioChain Sourcing's 8-section, ${TOTAL_FIELD_COUNT}-field client intake. Covers your organization, current sourcing, full product catalog, logistics & pricing, spend, compliance profile, customers, and goals - so we can scope your sourcing audit.`,
};

export default function ClientIntakePage() {
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
            style={{ color: "var(--gold-light)", fontFamily: "var(--font-body)" }}
          >
            RampRate BioChain Sourcing
          </span>
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Client Intake Application
          </h1>
          <p
            className="text-white/70 text-lg leading-relaxed mb-10 max-w-2xl"
            style={{ fontFamily: "var(--font-body)" }}
          >
            An 8-section intake covering your organization, current sourcing,
            full product catalog, and goals - so we can scope your sourcing
            audit and calibrate the right supply strategy from day one. No
            fee. No obligation. Confidential.
          </p>
        </div>
      </section>

      {/* Multi-step form */}
      <section className="section-warm py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <ClientIntakeForm />
        </div>
      </section>
    </main>
  );
}
