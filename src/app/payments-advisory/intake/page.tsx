import type { Metadata } from "next";
import PaymentsIntakeForm from "@/components/payments/PaymentsIntakeForm";

export const metadata: Metadata = {
  title: "Payments Advisory Client Intake | RampRate",
  description:
    "7-section intake for merchants processing $1M+ annually. RampRate authors your payment processing RFP, shops it to 25+ vetted processors, and negotiates on your behalf.",
};

export default function PaymentsIntakePage() {
  return (
    <main>
      <section className="relative pt-32 pb-16 overflow-hidden" style={{ background: "var(--dark)" }}>
        <div className="glass-orb glass-orb-amber w-[400px] h-[400px] -top-40 -right-40" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
            style={{ color: "var(--gold-light)", fontFamily: "var(--font-body)" }}
          >
            Client Intake
          </span>
          <h1
            className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Tell Us About Your Business
          </h1>
          <p className="text-white/70 text-base leading-relaxed max-w-2xl" style={{ fontFamily: "var(--font-body)" }}>
            7 sections, ~15 minutes. Once submitted, RampRate writes your RFP,
            shops it to matched processors, and manages the process start to
            finish. Every advisory note explains why we ask what we ask.
          </p>
        </div>
      </section>

      <section className="section-warm py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <PaymentsIntakeForm />
        </div>
      </section>
    </main>
  );
}
