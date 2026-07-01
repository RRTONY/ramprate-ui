'use client'

import { useState } from 'react'
import {
  Check, ArrowLeft, ArrowRight, Upload, Info, Plus, X,
  Building2, FlaskConical, ShieldCheck, Briefcase, Scale, FolderOpen,
} from 'lucide-react'

const inp = `w-full px-4 py-3 rounded-xl border border-black/8 bg-white/80 text-sm text-[oklch(0.2_0.02_50)] placeholder:text-black/30 outline-none transition-all duration-200 focus:border-[var(--gold)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(212,168,67,0.12)]`
const ta  = `${inp} resize-y min-h-[110px]`
const sel = `${inp} appearance-none cursor-pointer`
const lbl = `block text-[11px] font-semibold tracking-[0.16em] uppercase mb-2`
const fw  = `flex flex-col`
const req = <span className="text-[var(--gold)] ml-0.5">*</span>

const TABS = [
  { id: 0, label: 'Company Info',   Icon: Building2     },
  { id: 1, label: 'Manufacturing',  Icon: FlaskConical  },
  { id: 2, label: 'Quality',        Icon: ShieldCheck   },
  { id: 3, label: 'Commercial',     Icon: Briefcase     },
  { id: 4, label: 'Regulatory',     Icon: Scale         },
  { id: 5, label: 'Documents',      Icon: FolderOpen    },
]

const DOCS = [
  { name: 'doc_coa',        label: 'Certificate of Analysis (COA)',  hint: 'Most recent batch COA for primary peptide product',    required: true  },
  { name: 'doc_cgmp',       label: 'cGMP / Quality Certification',   hint: 'Current cGMP, ISO, or equivalent certification',       required: true  },
  { name: 'doc_fda',        label: 'FDA Registration Documentation', hint: 'FDA establishment registration confirmation',           required: false },
  { name: 'doc_insurance',  label: 'Certificate of Insurance',       hint: 'Current product liability insurance certificate',      required: true  },
  { name: 'doc_sop',        label: 'Sample SOP Document',            hint: 'A representative Standard Operating Procedure',        required: false },
  { name: 'doc_additional', label: 'Additional Documentation',       hint: 'Product catalog, company deck, or supporting materials', required: false },
]

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function VendorIntakeForm() {
  const [active, setActive]     = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pricingRows, setPricingRows] = useState(1)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const fields: Record<string, string> = {}
    const fileEntries: { fieldName: string; file: File }[] = []

    formData.forEach((value, key) => {
      if (value instanceof File) {
        if (value.size > 0) fileEntries.push({ fieldName: key, file: value })
      } else {
        fields[key] = value
      }
    })

    try {
      const files = await Promise.all(
        fileEntries.map(async ({ fieldName, file }) => ({
          fieldName,
          filename: file.name,
          mimeType: file.type || 'application/octet-stream',
          base64: await fileToBase64(file),
        }))
      )

      const res = await fetch('/api/vendor-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData: fields, files, sourceUrl: window.location.href }),
      })

      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong submitting your application. Please try again or email us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  /* ── Success ── */
  if (submitted) return (
    <div className="max-w-xl mx-auto text-center py-20 px-5">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
           style={{ background: 'linear-gradient(135deg, var(--gold), oklch(0.62 0.18 75))' }}>
        <Check size={32} stroke="white" strokeWidth={2.5} />
      </div>
      <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Application Received</h2>
      <p className="text-base leading-relaxed mb-8" style={{ color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)' }}>
        Thank you for submitting your vendor profile. We will review your application against active buyer mandates and contact you if there is a fit. No response means no current match — not a rejection.
      </p>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold" style={{ background: 'oklch(0.72 0.15 75 / 0.12)', color: 'oklch(0.45 0.12 70)' }}>
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold)' }} />
        Submitted to RampRate Supplier Fit Index
      </div>
    </div>
  )

  /* ── Step indicator ── */
  const StepBar = () => (
    <div className="flex items-center mb-10">
      {TABS.map((tab, i) => {
        const done     = i < active
        const isActive = i === active
        return (
          <div key={tab.id} className="flex items-center flex-1 last:flex-none">
            <button
              type="button"
              onClick={() => setActive(tab.id)}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold transition-all duration-300 border-2"
                style={{
                  background:  done ? 'var(--gold)' : 'white',
                  borderColor: done || isActive ? 'var(--gold)' : 'oklch(0.85 0.01 80)',
                  color:       done ? 'white' : isActive ? 'var(--gold)' : 'oklch(0.65 0.01 80)',
                  boxShadow:   isActive ? '0 0 0 4px rgba(212,168,67,0.15)' : 'none',
                }}
              >
                {done
                  ? <Check size={14} strokeWidth={3} />
                  : <span className="text-xs">{i + 1}</span>
                }
              </div>
              <span
                className="hidden sm:block text-[10px] font-semibold tracking-wider uppercase whitespace-nowrap"
                style={{ color: isActive ? 'var(--gold)' : done ? 'oklch(0.52 0.12 70)' : 'oklch(0.65 0.01 80)', fontFamily: 'var(--font-body)' }}
              >
                {tab.label}
              </span>
            </button>
            {i < TABS.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 rounded-full transition-all duration-500"
                   style={{ background: i < active ? 'var(--gold)' : 'oklch(0.88 0.01 80)' }} />
            )}
          </div>
        )
      })}
    </div>
  )

  /* ── Section card wrapper ── */
  const Card = ({ title, children }: { title: string; children: React.ReactNode }) => {
    const { Icon } = TABS[active]
    return (
    <div className="rounded-2xl border border-black/5 overflow-hidden shadow-sm" style={{ background: 'white' }}>
      <div className="px-7 py-5 border-b border-black/5 flex items-center gap-3"
           style={{ background: 'oklch(0.98 0.015 75)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
             style={{ background: 'oklch(0.72 0.15 75 / 0.15)' }}>
          <Icon size={16} style={{ color: 'var(--gold)' }} />
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase" style={{ color: 'oklch(0.55 0.08 70)', fontFamily: 'var(--font-body)' }}>
            Step {active + 1} of {TABS.length}
          </p>
          <h3 className="text-base font-bold" style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.2 0.02 50)' }}>{title}</h3>
        </div>
      </div>
      <div className="p-7">
        {children}
      </div>
    </div>
  )}

  return (
    <form name="vendor-intake" onSubmit={handleSubmit} style={{ fontFamily: 'var(--font-body)' }}>
      <input type="text" name="bot_field" tabIndex={-1} autoComplete="off" className="hidden" />

      <StepBar />

      {/* ── Section 1 ── */}
      {active === 0 && (
        <Card title="Company Information">
          <div className="grid sm:grid-cols-2 gap-5">
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Legal Entity Name {req}</label>
              <input required type="text" name="legal_entity_name" placeholder="Registered business name" className={inp} />
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>DBA / Trade Name</label>
              <input type="text" name="dba_name" placeholder="Operating name, if different" className={inp} />
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>State / Country of Incorporation {req}</label>
              <input required type="text" name="state_of_incorporation" placeholder="e.g. Delaware, USA" className={inp} />
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Year Founded {req}</label>
              <input required type="number" name="year_founded" placeholder="YYYY" min="1900" max="2026" className={inp} />
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Website</label>
              <input type="url" name="website" placeholder="https://" className={inp} />
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Company LinkedIn</label>
              <input type="url" name="linkedin" placeholder="https://linkedin.com/company/..." className={inp} />
            </div>
            <div className={`${fw} sm:col-span-2`}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Headquarters Address {req}</label>
              <input required type="text" name="hq_address" placeholder="Full street address, city, state, zip" className={inp} />
            </div>
            <div className={`${fw} sm:col-span-2`}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Manufacturing Facility Address</label>
              <input type="text" name="facility_address" placeholder="If different from HQ" className={inp} />
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Number of Employees {req}</label>
              <select required name="num_employees" className={sel}>
                <option value="">Select range</option>
                {['1–10','11–50','51–200','201–500','500+'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Primary Contact Name {req}</label>
              <input required type="text" name="contact_name" placeholder="Full name" className={inp} />
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Title / Role {req}</label>
              <input required type="text" name="contact_title" placeholder="e.g. VP of Sales" className={inp} />
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Email {req}</label>
              <input required type="email" name="contact_email" placeholder="name@company.com" className={inp} />
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Phone</label>
              <input type="tel" name="contact_phone" placeholder="+1 (555) 000-0000" className={inp} />
            </div>
            <div className={`${fw} sm:col-span-2`}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Principals / Founders {req}</label>
              <textarea required name="principals" placeholder="Name — Title — Ownership % (all individuals with >10% ownership)" className={ta} />
            </div>
          </div>
        </Card>
      )}

      {/* ── Section 2 ── */}
      {active === 1 && (
        <Card title="Manufacturing & Capabilities">
          <div className="grid sm:grid-cols-2 gap-5">
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Facility Type {req}</label>
              <select required name="facility_type" className={sel}>
                <option value="">Select type</option>
                {['Own Manufacturing','Contract Manufacturer (CMO)','Hybrid (Own + CMO)','White Label / Private Label'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Facility Classification {req}</label>
              <select required name="facility_classification" className={sel}>
                <option value="">Select classification</option>
                {['cGMP (FDA 21 CFR)','ISO 9001:2015','Both cGMP + ISO','Non-GMP Research Grade','Other'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Peptide Synthesis Method {req}</label>
              <select required name="synthesis_method" className={sel}>
                <option value="">Select method</option>
                {['Solid Phase (SPPS)','Liquid Phase','Hybrid','Contract Synthesis (third-party)'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Monthly Production Capacity {req}</label>
              <input required type="text" name="monthly_capacity" placeholder="e.g. 50,000 vials / month" className={inp} />
            </div>
            <div className={`${fw} sm:col-span-2`}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Current Peptide Products {req}</label>
              <textarea required name="peptide_products" placeholder="List all compounds currently manufactured (BPC-157, TB-500, Semaglutide, Tirzepatide, etc.)" className={ta} />
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Purity Levels Achieved {req}</label>
              <input required type="text" name="purity_levels" placeholder="e.g. ≥98% HPLC purity" className={inp} />
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Sterile Fill Capability {req}</label>
              <select required name="sterile_fill" className={sel}>
                <option value="">Select option</option>
                {['Yes — In-house','Yes — Contract','In Development','No'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div className={`${fw} sm:col-span-2`}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Cold Chain / Storage Capabilities</label>
              <textarea name="cold_chain" placeholder="Temperature-controlled storage, cold chain logistics, shipping capabilities" className={ta} />
            </div>
            <div className={`${fw} sm:col-span-2`}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Chain-of-Custody Capability {req}</label>
              <p className="text-xs mb-2 leading-relaxed" style={{ color: 'oklch(0.55 0.02 50)' }}>
                Can you support lot-level tracking (QR code or blockchain-anchored) from synthesis through delivery?
              </p>
              <select required name="chain_of_custody" className={sel}>
                <option value="">Select option</option>
                {['Currently live','Can implement on request','Not currently capable'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* ── Section 3 ── */}
      {active === 2 && (
        <Card title="Quality Assurance">
          <div className="grid sm:grid-cols-2 gap-5">
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Quality Management System {req}</label>
              <select required name="qms" className={sel}>
                <option value="">Select QMS</option>
                {['ISO 9001:2015','cGMP (FDA 21 CFR)','Both ISO + cGMP','Internal QMS only','None'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Third-Party Testing {req}</label>
              <select required name="third_party_testing" className={sel}>
                <option value="">Select frequency</option>
                {['All batches','Representative samples only','On request only','None currently'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div className={`${fw} sm:col-span-2`}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Independent Testing Willingness</label>
              <p className="text-xs mb-2 leading-relaxed" style={{ color: 'oklch(0.55 0.02 50)' }}>
                Willing to have batches independently tested by a lab of the marketplace&apos;s choosing (e.g., Janoshik Analytical, MZ Biolabs), separate from your own COA process?
              </p>
              <select name="independent_testing_willingness" className={sel}>
                <option value="">Select option</option>
                {['Yes, ongoing','Yes, one-time per new listing','No'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div className={`${fw} sm:col-span-2`}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Testing Protocols {req}</label>
              <textarea required name="testing_protocols" placeholder="HPLC, Mass Spec, Endotoxin, Sterility, Microbial, Identity, Potency" className={ta} />
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Stability Testing Program {req}</label>
              <select required name="stability_testing" className={sel}>
                <option value="">Select option</option>
                {['ICH guidelines','Accelerated only','Real-time only','None'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Recall / CAPA History {req}</label>
              <select required name="recall_history" className={sel}>
                <option value="">Select option</option>
                {['None in past 5 years','Minor — no product recall','Major recall','Active CAPA'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div className={`${fw} sm:col-span-2`}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Batch Documentation</label>
              <textarea name="batch_docs" placeholder="Batch record system, COA generation process, document retention policy" className={ta} />
            </div>
          </div>
        </Card>
      )}

      {/* ── Section 4 ── */}
      {active === 3 && (
        <Card title="Commercial Terms">
          <div className="grid sm:grid-cols-2 gap-5">
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Minimum Order Quantity (MOQ) {req}</label>
              <input required type="text" name="moq" placeholder="e.g. 1,000 vials" className={inp} />
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Standard Lead Time {req}</label>
              <input required type="text" name="lead_time" placeholder="e.g. 4–6 weeks from PO" className={inp} />
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Pricing Model {req}</label>
              <select required name="pricing_model" className={sel}>
                <option value="">Select model</option>
                {['Fixed price list','Volume-based tiers','Custom quote','Spot market'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Payment Terms {req}</label>
              <select required name="payment_terms" className={sel}>
                <option value="">Select terms</option>
                {['Net 30','Net 60','50% upfront / 50% on delivery','100% upfront','Other'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div className={`${fw} sm:col-span-2`}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Existing Distribution Channels</label>
              <textarea name="distribution_channels" placeholder="Current distribution partnerships, clinic networks, retail channels" className={ta} />
            </div>
            <div className={`${fw} sm:col-span-2`}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>References {req}</label>
              <textarea required name="references" placeholder="2–3 current client references (company name, contact, relationship duration)" className={ta} />
            </div>
            <div className="sm:col-span-2">
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Pricing for Top Compounds {req}</label>
              <p className="text-xs mb-3 leading-relaxed" style={{ color: 'oklch(0.55 0.02 50)' }}>
                List pricing for your top 3–5 volume compounds (compound, unit size, price per unit, MOQ tier).
              </p>
              <div className="flex flex-col gap-3">
                {Array.from({ length: pricingRows }).map((_, i) => (
                  <div key={i} className="grid grid-cols-2 sm:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 items-start">
                    <input required={i === 0} type="text" name={`pricing_compound_${i + 1}`} placeholder="Compound" className={inp} />
                    <input required={i === 0} type="text" name={`pricing_unit_size_${i + 1}`} placeholder="Unit size" className={inp} />
                    <input required={i === 0} type="text" name={`pricing_price_${i + 1}`} placeholder="Price / unit" className={inp} />
                    <input required={i === 0} type="text" name={`pricing_moq_tier_${i + 1}`} placeholder="MOQ tier" className={inp} />
                    {i === pricingRows - 1 && pricingRows > 1 && (
                      <button
                        type="button"
                        onClick={() => setPricingRows(p => Math.max(1, p - 1))}
                        className="flex items-center justify-center w-11 h-11 rounded-xl border transition-colors hover:bg-[oklch(0.97_0.02_75)]"
                        style={{ borderColor: 'oklch(0.85 0.04 70)', color: 'oklch(0.45 0.08 60)' }}
                        aria-label="Remove row"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {pricingRows < 5 && (
                <button
                  type="button"
                  onClick={() => setPricingRows(p => Math.min(5, p + 1))}
                  className="mt-3 inline-flex items-center gap-2 text-xs font-semibold"
                  style={{ color: 'var(--gold)' }}
                >
                  <Plus size={14} /> Add another compound
                </button>
              )}
            </div>
            <div className={`${fw} sm:col-span-2`}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Full Price List / Catalog</label>
              <p className="text-xs mb-2 leading-relaxed" style={{ color: 'oklch(0.55 0.02 50)' }}>
                Upload your complete pricing sheet if you&apos;d like the marketplace to consider your full catalog for future RFPs.
              </p>
              <input type="file" name="doc_price_list" accept=".pdf,.xls,.xlsx,.csv" className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:cursor-pointer" />
            </div>
          </div>
        </Card>
      )}

      {/* ── Section 5 ── */}
      {active === 4 && (
        <Card title="Regulatory & Compliance">
          <div className="grid sm:grid-cols-2 gap-5">
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>FDA Registration Number</label>
              <input type="text" name="fda_registration" placeholder="FEI number" className={inp} />
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>DEA Registration {req}</label>
              <select required name="dea_registration" className={sel}>
                <option value="">Select option</option>
                {['Yes — Schedule III','Yes — Schedule IV','Yes — Schedule V','In Progress','No'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div className={`${fw} sm:col-span-2`}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>State Licenses</label>
              <textarea name="state_licenses" placeholder="State — License Type — Number (all active licenses)" className={ta} />
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Product Labeling & Sale Restrictions {req}</label>
              <select required name="product_labeling" className={sel}>
                <option value="">Select option</option>
                {['Research-use-only (RUO)','Compounded pharmacy (503A/503B)','Both, depending on product'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Buyer Eligibility {req}</label>
              <select required name="buyer_eligibility" className={sel}>
                <option value="">Select option</option>
                {['Institutional/researcher only','Clinics only','Clinics and individuals','All accounts'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Last FDA Inspection Date</label>
              <input type="text" name="last_fda_inspection" placeholder="MM/YYYY or N/A" className={inp} />
            </div>
            <div className={fw}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>FDA Inspection Outcome</label>
              <select name="fda_outcome" className={sel}>
                <option value="">Select outcome</option>
                {['No Action Indicated (NAI)','Voluntary Action Indicated (VAI)','Official Action Indicated (OAI)','Never Inspected'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div className={`${fw} sm:col-span-2`}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Warning Letters or Consent Decrees</label>
              <textarea name="warning_letters" placeholder="FDA warning letters or enforcement actions in past 5 years. Enter 'None' if not applicable." className={ta} />
            </div>
            <div className={`${fw} sm:col-span-2`}>
              <label className={lbl} style={{ color: 'oklch(0.52 0.12 70)' }}>Insurance Coverage {req}</label>
              <textarea required name="insurance" placeholder="Product liability, general liability, professional liability coverage amounts" className={ta} />
            </div>
          </div>
        </Card>
      )}

      {/* ── Section 6 ── */}
      {active === 5 && (
        <Card title="Document Upload">
          <div className="grid sm:grid-cols-2 gap-5 mb-6">
            {DOCS.map((f) => (
              <label
                key={f.name}
                className="flex flex-col gap-3 rounded-xl border-2 border-dashed p-5 cursor-pointer transition-all duration-200 hover:border-[var(--gold)] hover:bg-[oklch(0.98_0.02_80)]"
                style={{ borderColor: 'oklch(0.85 0.02 80)', background: 'oklch(0.99 0.005 80)' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-0.5" style={{ color: 'oklch(0.52 0.12 70)', fontFamily: 'var(--font-body)' }}>
                      {f.label} {f.required && <span style={{ color: 'var(--gold)' }}>*</span>}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.55 0.02 50)' }}>{f.hint}</p>
                  </div>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'oklch(0.72 0.15 75 / 0.12)' }}>
                    <Upload size={16} style={{ color: 'var(--gold)' }} />
                  </div>
                </div>
                <input
                  type="file"
                  name={f.name}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  required={f.required}
                  className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:cursor-pointer"
                  style={{ fontFamily: 'var(--font-body)' }}
                />
                <p className="text-[10px]" style={{ color: 'oklch(0.65 0.02 50)' }}>PDF, DOC, JPG, PNG · max 10 MB</p>
              </label>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="rounded-xl p-5 mb-6 flex gap-4" style={{ background: 'oklch(0.97 0.02 75)', border: '1px solid oklch(0.88 0.06 75)' }}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'oklch(0.72 0.15 75 / 0.2)' }}>
              <Info size={11} style={{ color: 'var(--gold)' }} />
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.42 0.05 60)' }}>
              By submitting you confirm all information is accurate. RampRate uses this solely for supplier evaluation and deal matching. Submission does not guarantee RFP participation. All information is treated as confidential.
            </p>
          </div>

          {error && (
            <p className="mb-4 text-xs font-medium" style={{ color: 'oklch(0.55 0.2 25)' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ background: 'linear-gradient(135deg, var(--gold), oklch(0.58 0.18 68))', fontFamily: 'var(--font-body)' }}
          >
            {submitting ? 'Submitting…' : 'Submit Application'}
            {!submitting && <ArrowRight size={16} />}
          </button>
          <p className="mt-3 text-[11px]" style={{ color: 'oklch(0.6 0.02 50)', fontFamily: 'var(--font-body)' }}>
            <span style={{ color: 'var(--gold)' }}>*</span> 32 required fields across all sections
          </p>
        </Card>
      )}

      {/* Prev / Next */}
      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={() => setActive(p => Math.max(0, p - 1))}
          disabled={active === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all disabled:opacity-25 disabled:cursor-not-allowed hover:bg-[oklch(0.97_0.02_75)]"
          style={{ borderColor: 'oklch(0.85 0.04 70)', color: 'oklch(0.45 0.08 60)', fontFamily: 'var(--font-body)' }}
        >
          <ArrowLeft size={14} />
          Previous
        </button>

        <span className="text-xs" style={{ color: 'oklch(0.6 0.02 50)', fontFamily: 'var(--font-body)' }}>
          {active + 1} / {TABS.length}
        </span>

        {active < TABS.length - 1 && (
          <button
            type="button"
            onClick={() => setActive(p => Math.min(TABS.length - 1, p + 1))}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.01]"
            style={{ background: 'var(--gold)', fontFamily: 'var(--font-body)' }}
          >
            Next
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </form>
  )
}
