import type { Metadata } from 'next'
import VendorIntakeForm from '@/components/vendor/VendorIntakeForm'

export const metadata: Metadata = {
  title: 'Vendor Intake — Peptide Supply Partner Application | RampRate',
  description: "RampRate's 6-section, 48-field due diligence form for peptide supply partners. Covers company info, manufacturing capabilities, quality assurance, commercial terms, regulatory compliance, and document upload.",
}

export default function VendorIntakePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: 'var(--dark)' }}>
        <div className="glass-orb glass-orb-amber w-[400px] h-[400px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-rust w-[240px] h-[240px] bottom-0 -left-28" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" style={{ color: 'var(--gold-light)', fontFamily: 'var(--font-body)' }}>
            Peptide Supply Partner Application
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Vendor Intake Form
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-2xl" style={{ fontFamily: 'var(--font-body)' }}>
            RampRate&apos;s 6-section due diligence form for peptide supply partners. Complete all sections to be scored against the Supplier Fit Index. No fee. No obligation.
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              { value: '6', label: 'Sections' },
              { value: '48', label: 'Total fields' },
              { value: '32', label: 'Required fields' },
            ].map((s) => (
              <div key={s.label} className="glass-card px-5 py-4">
                <div className="text-xl font-bold mb-1" style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>{s.value}</div>
                <div className="text-xs text-white/50" style={{ fontFamily: 'var(--font-body)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabbed form */}
      <section className="section-warm py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <VendorIntakeForm />
        </div>
      </section>
    </main>
  )
}
