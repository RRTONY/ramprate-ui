"use client";

import { useRef, useState } from "react";
import type { ComponentType, Dispatch, SetStateAction } from "react";
import { useFormik, type FormikProps } from "formik";
import * as Yup from "yup";
import {
  Check,
  ArrowLeft,
  ArrowRight,
  Upload,
  Info,
  Plus,
  X,
  Building2,
  FlaskConical,
  ShieldCheck,
  Briefcase,
  Scale,
  FolderOpen,
} from "lucide-react";
import { REQUIRED_FIELD_COUNT } from "@/lib/vendor-intake-fields";

const inp = `w-full px-4 py-3 rounded-xl border border-black/8 bg-white/80 text-sm text-[oklch(0.2_0.02_50)] placeholder:text-black/30 outline-none transition-all duration-200 focus:border-[var(--gold)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(212,168,67,0.12)]`;
const ta = `${inp} resize-y min-h-[110px]`;
const sel = `${inp} appearance-none cursor-pointer`;
const lbl = `block text-[11px] font-semibold tracking-[0.16em] uppercase mb-2`;
const fw = `flex flex-col`;
const req = <span className="text-[var(--gold)] ml-0.5">*</span>;

const TABS = [
  { id: 0, label: "Company Info", Icon: Building2 },
  { id: 1, label: "Manufacturing", Icon: FlaskConical },
  { id: 2, label: "Quality", Icon: ShieldCheck },
  { id: 3, label: "Commercial", Icon: Briefcase },
  { id: 4, label: "Regulatory", Icon: Scale },
  { id: 5, label: "Documents", Icon: FolderOpen },
];

const DOCS = [
  {
    name: "doc_coa",
    label: "Certificate of Analysis (COA)",
    hint: "Most recent batch COA for primary peptide product",
    required: true,
  },
  {
    name: "doc_cgmp",
    label: "cGMP / Quality Certification",
    hint: "Current cGMP, ISO, or equivalent certification",
    required: true,
  },
  {
    name: "doc_fda",
    label: "FDA Registration Documentation",
    hint: "FDA establishment registration confirmation",
    required: false,
  },
  {
    name: "doc_insurance",
    label: "Certificate of Insurance",
    hint: "Current product liability insurance certificate",
    required: true,
  },
  {
    name: "doc_sop",
    label: "Sample SOP Document",
    hint: "A representative Standard Operating Procedure",
    required: false,
  },
  {
    name: "doc_additional",
    label: "Additional Documentation",
    hint: "Product catalog, company deck, or supporting materials",
    required: false,
  },
];

const requiredStr = () => Yup.string().required("Required");

const validationSchema = Yup.object().shape({
  // Section 1 - Company Info
  legal_entity_name: requiredStr(),
  state_of_incorporation: requiredStr(),
  year_founded: requiredStr(),
  hq_address: requiredStr(),
  num_employees: requiredStr(),
  contact_name: requiredStr(),
  contact_title: requiredStr(),
  contact_email: Yup.string().email("Invalid email").required("Required"),
  principals: requiredStr(),

  // Section 2 - Manufacturing
  facility_type: requiredStr(),
  facility_classification: requiredStr(),
  synthesis_method: requiredStr(),
  monthly_capacity: requiredStr(),
  peptide_products: requiredStr(),
  purity_levels: requiredStr(),
  sterile_fill: requiredStr(),
  chain_of_custody: requiredStr(),

  // Section 3 - Quality
  qms: requiredStr(),
  third_party_testing: requiredStr(),
  testing_protocols: requiredStr(),
  stability_testing: requiredStr(),
  recall_history: requiredStr(),
  coa_publicly_viewable: requiredStr(),

  // Section 4 - Commercial
  moq: requiredStr(),
  lead_time: requiredStr(),
  pricing_model: requiredStr(),
  payment_terms: requiredStr(),
  references: requiredStr(),
  pricing_compound_1: requiredStr(),
  pricing_unit_size_1: requiredStr(),
  pricing_price_1: requiredStr(),
  pricing_moq_tier_1: requiredStr(),

  // Section 5 - Regulatory
  dea_registration: requiredStr(),
  product_labeling: requiredStr(),
  buyer_eligibility: requiredStr(),
  insurance: requiredStr(),
  shipping_jurisdictions: requiredStr(),

  // Section 6 - Documents
  doc_coa: Yup.mixed().required("Required"),
  doc_cgmp: Yup.mixed().required("Required"),
  doc_insurance: Yup.mixed().required("Required"),
});

const STEP_FIELDS: string[][] = [
  [
    "legal_entity_name",
    "dba_name",
    "state_of_incorporation",
    "year_founded",
    "website",
    "linkedin",
    "hq_address",
    "facility_address",
    "num_employees",
    "contact_name",
    "contact_title",
    "contact_email",
    "contact_phone",
    "principals",
  ],
  [
    "facility_type",
    "facility_classification",
    "synthesis_method",
    "monthly_capacity",
    "peptide_products",
    "purity_levels",
    "sterile_fill",
    "cold_chain",
    "chain_of_custody",
    "batch_traceability_practices",
  ],
  [
    "qms",
    "third_party_testing",
    "testing_lab_name",
    "independent_testing_willingness",
    "coa_lot_specific",
    "coa_publicly_viewable",
    "coa_public_url",
    "testing_protocols",
    "identity_confirmation_method",
    "stability_testing",
    "recall_history",
    "batch_docs",
  ],
  [
    "moq",
    "lead_time",
    "pricing_model",
    "payment_terms",
    "distribution_channels",
    "references",
    "pricing_compound_1",
    "pricing_unit_size_1",
    "pricing_price_1",
    "pricing_moq_tier_1",
    "doc_price_list",
  ],
  [
    "fda_registration",
    "dea_registration",
    "state_licenses",
    "manufacturing_certifications",
    "shipping_jurisdictions",
    "product_labeling",
    "buyer_eligibility",
    "last_fda_inspection",
    "fda_outcome",
    "warning_letters",
    "insurance",
  ],
  [
    "doc_coa",
    "doc_cgmp",
    "doc_fda",
    "doc_insurance",
    "doc_sop",
    "doc_additional",
  ],
];

type FormValues = Record<string, string | File | undefined>;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface StepProps {
  formik: FormikProps<FormValues>;
  pricingRows: number;
  setPricingRows: Dispatch<SetStateAction<number>>;
  error: string | null;
  submitting: boolean;
}

function FieldError({
  formik,
  name,
}: {
  formik: FormikProps<FormValues>;
  name: string;
}) {
  const message = formik.touched[name] && formik.errors[name];
  if (!message) return null;
  return (
    <p
      className="mt-1 text-[11px] font-medium"
      style={{ color: "oklch(0.55 0.2 25)" }}
    >
      {String(message)}
    </p>
  );
}

function Card({
  icon: Icon,
  title,
  stepNumber,
  children,
}: {
  icon: ComponentType<{ size?: number; style?: React.CSSProperties }>;
  title: string;
  stepNumber: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border border-black/5 overflow-hidden shadow-sm"
      style={{ background: "white" }}
    >
      <div
        className="px-7 py-5 border-b border-black/5 flex items-center gap-3"
        style={{ background: "oklch(0.98 0.015 75)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "oklch(0.72 0.15 75 / 0.15)" }}
        >
          <Icon size={16} style={{ color: "var(--gold)" }} />
        </div>
        <div>
          <p
            className="text-[10px] font-semibold tracking-[0.18em] uppercase"
            style={{
              color: "oklch(0.55 0.08 70)",
              fontFamily: "var(--font-body)",
            }}
          >
            Step {stepNumber} of {TABS.length}
          </p>
          <h3
            className="text-base font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color: "oklch(0.2 0.02 50)",
            }}
          >
            {title}
          </h3>
        </div>
      </div>
      <div className="p-7">{children}</div>
    </div>
  );
}

function StepCompanyInfo({ formik }: StepProps) {
  const v = formik.values;
  return (
    <Card icon={Building2} title="Company Information" stepNumber={1}>
      <div className="grid sm:grid-cols-2 gap-5">
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Legal Entity Name {req}
          </label>
          <input
            type="text"
            name="legal_entity_name"
            value={(v.legal_entity_name as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="Registered business name"
            className={inp}
          />
          <FieldError formik={formik} name="legal_entity_name" />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            DBA / Trade Name
          </label>
          <input
            type="text"
            name="dba_name"
            value={(v.dba_name as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="Operating name, if different"
            className={inp}
          />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            State / Country of Incorporation {req}
          </label>
          <input
            type="text"
            name="state_of_incorporation"
            value={(v.state_of_incorporation as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="e.g. Delaware, USA"
            className={inp}
          />
          <FieldError formik={formik} name="state_of_incorporation" />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Year Founded {req}
          </label>
          <input
            type="number"
            name="year_founded"
            value={(v.year_founded as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="YYYY"
            min="1900"
            max="2026"
            className={inp}
          />
          <FieldError formik={formik} name="year_founded" />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Website
          </label>
          <input
            type="url"
            name="website"
            value={(v.website as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="https://"
            className={inp}
          />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Company LinkedIn
          </label>
          <input
            type="url"
            name="linkedin"
            value={(v.linkedin as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="https://linkedin.com/company/..."
            className={inp}
          />
        </div>
        <div className={`${fw} sm:col-span-2`}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Headquarters Address {req}
          </label>
          <input
            type="text"
            name="hq_address"
            value={(v.hq_address as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="Full street address, city, state, zip"
            className={inp}
          />
          <FieldError formik={formik} name="hq_address" />
        </div>
        <div className={`${fw} sm:col-span-2`}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Manufacturing Facility Address
          </label>
          <input
            type="text"
            name="facility_address"
            value={(v.facility_address as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="If different from HQ"
            className={inp}
          />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Number of Employees {req}
          </label>
          <select
            name="num_employees"
            value={(v.num_employees as string) ?? ""}
            onChange={formik.handleChange}
            className={sel}
          >
            <option value="">Select range</option>
            {["1–10", "11–50", "51–200", "201–500", "500+"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <FieldError formik={formik} name="num_employees" />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Primary Contact Name {req}
          </label>
          <input
            type="text"
            name="contact_name"
            value={(v.contact_name as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="Full name"
            className={inp}
          />
          <FieldError formik={formik} name="contact_name" />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Title / Role {req}
          </label>
          <input
            type="text"
            name="contact_title"
            value={(v.contact_title as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="e.g. VP of Sales"
            className={inp}
          />
          <FieldError formik={formik} name="contact_title" />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Email {req}
          </label>
          <input
            type="email"
            name="contact_email"
            value={(v.contact_email as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="name@company.com"
            className={inp}
          />
          <FieldError formik={formik} name="contact_email" />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Phone
          </label>
          <input
            type="tel"
            name="contact_phone"
            value={(v.contact_phone as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="+1 (555) 000-0000"
            className={inp}
          />
        </div>
        <div className={`${fw} sm:col-span-2`}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Principals / Founders {req}
          </label>
          <textarea
            name="principals"
            value={(v.principals as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="Name - Title - Ownership % (all individuals with >10% ownership)"
            className={ta}
          />
          <FieldError formik={formik} name="principals" />
        </div>
      </div>
    </Card>
  );
}

function StepManufacturing({ formik }: StepProps) {
  const v = formik.values;
  return (
    <Card
      icon={FlaskConical}
      title="Manufacturing & Capabilities"
      stepNumber={2}
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Facility Type {req}
          </label>
          <select
            name="facility_type"
            value={(v.facility_type as string) ?? ""}
            onChange={formik.handleChange}
            className={sel}
          >
            <option value="">Select type</option>
            {[
              "Own Manufacturing",
              "Contract Manufacturer (CMO)",
              "Hybrid (Own + CMO)",
              "White Label / Private Label",
            ].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <FieldError formik={formik} name="facility_type" />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Facility Classification {req}
          </label>
          <select
            name="facility_classification"
            value={(v.facility_classification as string) ?? ""}
            onChange={formik.handleChange}
            className={sel}
          >
            <option value="">Select classification</option>
            {[
              "cGMP (FDA 21 CFR)",
              "ISO 9001:2015",
              "Both cGMP + ISO",
              "Non-GMP Research Grade",
              "Other",
            ].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <FieldError formik={formik} name="facility_classification" />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Peptide Synthesis Method {req}
          </label>
          <select
            name="synthesis_method"
            value={(v.synthesis_method as string) ?? ""}
            onChange={formik.handleChange}
            className={sel}
          >
            <option value="">Select method</option>
            {[
              "Solid Phase (SPPS)",
              "Liquid Phase",
              "Hybrid",
              "Contract Synthesis (third-party)",
            ].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <FieldError formik={formik} name="synthesis_method" />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Monthly Production Capacity {req}
          </label>
          <input
            type="text"
            name="monthly_capacity"
            value={(v.monthly_capacity as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="e.g. 50,000 vials / month"
            className={inp}
          />
          <FieldError formik={formik} name="monthly_capacity" />
        </div>
        <div className={`${fw} sm:col-span-2`}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Current Peptide Products {req}
          </label>
          <textarea
            name="peptide_products"
            value={(v.peptide_products as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="List all compounds currently manufactured (BPC-157, TB-500, Semaglutide, Tirzepatide, etc.)"
            className={ta}
          />
          <FieldError formik={formik} name="peptide_products" />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Purity Levels Achieved {req}
          </label>
          <input
            type="text"
            name="purity_levels"
            value={(v.purity_levels as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="e.g. ≥98% HPLC purity"
            className={inp}
          />
          <FieldError formik={formik} name="purity_levels" />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Sterile Fill Capability {req}
          </label>
          <select
            name="sterile_fill"
            value={(v.sterile_fill as string) ?? ""}
            onChange={formik.handleChange}
            className={sel}
          >
            <option value="">Select option</option>
            {["Yes - In-house", "Yes - Contract", "In Development", "No"].map(
              (o) => (
                <option key={o}>{o}</option>
              ),
            )}
          </select>
          <FieldError formik={formik} name="sterile_fill" />
        </div>
        <div className={`${fw} sm:col-span-2`}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Cold Chain / Storage Capabilities
          </label>
          <textarea
            name="cold_chain"
            value={(v.cold_chain as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="Temperature-controlled storage, cold chain logistics, shipping capabilities"
            className={ta}
          />
        </div>
        <div className={`${fw} sm:col-span-2`}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Chain-of-Custody Capability {req}
          </label>
          <p
            className="text-xs mb-2 leading-relaxed"
            style={{ color: "oklch(0.55 0.02 50)" }}
          >
            Can you support lot-level tracking (QR code or blockchain-anchored)
            from synthesis through delivery?
          </p>
          <select
            name="chain_of_custody"
            value={(v.chain_of_custody as string) ?? ""}
            onChange={formik.handleChange}
            className={sel}
          >
            <option value="">Select option</option>
            {[
              "Currently live",
              "Can implement on request",
              "Not currently capable",
            ].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <FieldError formik={formik} name="chain_of_custody" />
        </div>
        <div className={`${fw} sm:col-span-2`}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Batch Traceability Practices
          </label>
          <textarea
            name="batch_traceability_practices"
            value={(v.batch_traceability_practices as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="Existing traceability practices beyond QR/blockchain willingness above (e.g. internal lot logging, ERP tracking)"
            className={ta}
          />
        </div>
      </div>
    </Card>
  );
}

function StepQuality({ formik }: StepProps) {
  const v = formik.values;
  return (
    <Card icon={ShieldCheck} title="Quality Assurance" stepNumber={3}>
      <div className="grid sm:grid-cols-2 gap-5">
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Quality Management System {req}
          </label>
          <select
            name="qms"
            value={(v.qms as string) ?? ""}
            onChange={formik.handleChange}
            className={sel}
          >
            <option value="">Select QMS</option>
            {[
              "ISO 9001:2015",
              "cGMP (FDA 21 CFR)",
              "Both ISO + cGMP",
              "Internal QMS only",
              "None",
            ].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <FieldError formik={formik} name="qms" />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Third-Party Testing {req}
          </label>
          <select
            name="third_party_testing"
            value={(v.third_party_testing as string) ?? ""}
            onChange={formik.handleChange}
            className={sel}
          >
            <option value="">Select frequency</option>
            {[
              "All batches",
              "Representative samples only",
              "On request only",
              "None currently",
            ].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <FieldError formik={formik} name="third_party_testing" />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Third-Party Testing Lab Name
          </label>
          <input
            type="text"
            name="testing_lab_name"
            value={(v.testing_lab_name as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="e.g. Janoshik Analytical, MZ Biolabs"
            className={inp}
          />
        </div>
        <div className={`${fw} sm:col-span-2`}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Independent Testing Willingness
          </label>
          <p
            className="text-xs mb-2 leading-relaxed"
            style={{ color: "oklch(0.55 0.02 50)" }}
          >
            Willing to have batches independently tested by a lab of the
            marketplace&apos;s choosing (e.g., Janoshik Analytical, MZ Biolabs),
            separate from your own COA process?
          </p>
          <select
            name="independent_testing_willingness"
            value={(v.independent_testing_willingness as string) ?? ""}
            onChange={formik.handleChange}
            className={sel}
          >
            <option value="">Select option</option>
            {["Yes, ongoing", "Yes, one-time per new listing", "No"].map(
              (o) => (
                <option key={o}>{o}</option>
              ),
            )}
          </select>
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            COA Batch/Lot-Specific?
          </label>
          <select
            name="coa_lot_specific"
            value={(v.coa_lot_specific as string) ?? ""}
            onChange={formik.handleChange}
            className={sel}
          >
            <option value="">Select option</option>
            {["Yes", "No"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            COA Publicly Viewable Before Purchase? {req}
          </label>
          <select
            name="coa_publicly_viewable"
            value={(v.coa_publicly_viewable as string) ?? ""}
            onChange={formik.handleChange}
            className={sel}
          >
            <option value="">Select option</option>
            {["Yes", "No"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <FieldError formik={formik} name="coa_publicly_viewable" />
        </div>
        <div className={`${fw} sm:col-span-2`}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            COA Public Link (if applicable)
          </label>
          <input
            type="url"
            name="coa_public_url"
            value={(v.coa_public_url as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="https://"
            className={inp}
          />
        </div>
        <div className={`${fw} sm:col-span-2`}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Testing Protocols {req}
          </label>
          <textarea
            name="testing_protocols"
            value={(v.testing_protocols as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="HPLC, Mass Spec, Endotoxin, Sterility, Microbial, Identity, Potency"
            className={ta}
          />
          <FieldError formik={formik} name="testing_protocols" />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Identity Confirmation Method
          </label>
          <input
            type="text"
            name="identity_confirmation_method"
            value={(v.identity_confirmation_method as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="e.g. Mass spectrometry"
            className={inp}
          />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Stability Testing Program {req}
          </label>
          <select
            name="stability_testing"
            value={(v.stability_testing as string) ?? ""}
            onChange={formik.handleChange}
            className={sel}
          >
            <option value="">Select option</option>
            {[
              "ICH guidelines",
              "Accelerated only",
              "Real-time only",
              "None",
            ].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <FieldError formik={formik} name="stability_testing" />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Recall / CAPA History {req}
          </label>
          <select
            name="recall_history"
            value={(v.recall_history as string) ?? ""}
            onChange={formik.handleChange}
            className={sel}
          >
            <option value="">Select option</option>
            {[
              "None in past 5 years",
              "Minor - no product recall",
              "Major recall",
              "Active CAPA",
            ].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <FieldError formik={formik} name="recall_history" />
        </div>
        <div className={`${fw} sm:col-span-2`}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Batch Documentation
          </label>
          <textarea
            name="batch_docs"
            value={(v.batch_docs as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="Batch record system, COA generation process, document retention policy"
            className={ta}
          />
        </div>
      </div>
    </Card>
  );
}

function StepCommercial({ formik, pricingRows, setPricingRows }: StepProps) {
  const v = formik.values;
  return (
    <Card icon={Briefcase} title="Commercial Terms" stepNumber={4}>
      <div className="grid sm:grid-cols-2 gap-5">
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Minimum Order Quantity (MOQ) {req}
          </label>
          <input
            type="text"
            name="moq"
            value={(v.moq as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="e.g. 1,000 vials"
            className={inp}
          />
          <FieldError formik={formik} name="moq" />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Standard Lead Time {req}
          </label>
          <input
            type="text"
            name="lead_time"
            value={(v.lead_time as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="e.g. 4–6 weeks from PO"
            className={inp}
          />
          <FieldError formik={formik} name="lead_time" />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Pricing Model {req}
          </label>
          <select
            name="pricing_model"
            value={(v.pricing_model as string) ?? ""}
            onChange={formik.handleChange}
            className={sel}
          >
            <option value="">Select model</option>
            {[
              "Fixed price list",
              "Volume-based tiers",
              "Custom quote",
              "Spot market",
            ].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <FieldError formik={formik} name="pricing_model" />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Payment Terms {req}
          </label>
          <select
            name="payment_terms"
            value={(v.payment_terms as string) ?? ""}
            onChange={formik.handleChange}
            className={sel}
          >
            <option value="">Select terms</option>
            {[
              "Net 30",
              "Net 60",
              "50% upfront / 50% on delivery",
              "100% upfront",
              "Other",
            ].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <FieldError formik={formik} name="payment_terms" />
        </div>
        <div className={`${fw} sm:col-span-2`}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Existing Distribution Channels
          </label>
          <textarea
            name="distribution_channels"
            value={(v.distribution_channels as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="Current distribution partnerships, clinic networks, retail channels"
            className={ta}
          />
        </div>
        <div className={`${fw} sm:col-span-2`}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            References {req}
          </label>
          <textarea
            name="references"
            value={(v.references as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="2–3 current client references (company name, contact, relationship duration)"
            className={ta}
          />
          <FieldError formik={formik} name="references" />
        </div>
        <div className="sm:col-span-2">
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Pricing for Top Compounds {req}
          </label>
          <p
            className="text-xs mb-3 leading-relaxed"
            style={{ color: "oklch(0.55 0.02 50)" }}
          >
            List pricing for your top 3–5 volume compounds (compound, unit size,
            price per unit, MOQ tier).
          </p>
          <div className="flex flex-col gap-3">
            {Array.from({ length: pricingRows }).map((_, i) => {
              const n = i + 1;
              return (
                <div
                  key={i}
                  className="grid grid-cols-2 sm:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 items-start"
                >
                  <input
                    type="text"
                    name={`pricing_compound_${n}`}
                    value={(v[`pricing_compound_${n}`] as string) ?? ""}
                    onChange={formik.handleChange}
                    placeholder="Compound"
                    className={inp}
                  />
                  <input
                    type="text"
                    name={`pricing_unit_size_${n}`}
                    value={(v[`pricing_unit_size_${n}`] as string) ?? ""}
                    onChange={formik.handleChange}
                    placeholder="Unit size"
                    className={inp}
                  />
                  <input
                    type="text"
                    name={`pricing_price_${n}`}
                    value={(v[`pricing_price_${n}`] as string) ?? ""}
                    onChange={formik.handleChange}
                    placeholder="Price / unit"
                    className={inp}
                  />
                  <input
                    type="text"
                    name={`pricing_moq_tier_${n}`}
                    value={(v[`pricing_moq_tier_${n}`] as string) ?? ""}
                    onChange={formik.handleChange}
                    placeholder="MOQ tier"
                    className={inp}
                  />
                  {i === pricingRows - 1 && pricingRows > 1 && (
                    <button
                      type="button"
                      onClick={() => setPricingRows((p) => Math.max(1, p - 1))}
                      className="flex items-center justify-center w-11 h-11 rounded-xl border transition-colors hover:bg-[oklch(0.97_0.02_75)]"
                      style={{
                        borderColor: "oklch(0.85 0.04 70)",
                        color: "oklch(0.45 0.08 60)",
                      }}
                      aria-label="Remove row"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {pricingRows === 1 && (
            <FieldError formik={formik} name="pricing_compound_1" />
          )}
          {pricingRows < 5 && (
            <button
              type="button"
              onClick={() => setPricingRows((p) => Math.min(5, p + 1))}
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold"
              style={{ color: "var(--gold)" }}
            >
              <Plus size={14} /> Add another compound
            </button>
          )}
        </div>
        <div className={`${fw} sm:col-span-2`}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Full Price List / Catalog
          </label>
          <p
            className="text-xs mb-2 leading-relaxed"
            style={{ color: "oklch(0.55 0.02 50)" }}
          >
            Upload your complete pricing sheet if you&apos;d like the
            marketplace to consider your full catalog for future RFPs.
          </p>
          <input
            type="file"
            name="doc_price_list"
            accept=".pdf,.xls,.xlsx,.csv"
            onChange={(e) =>
              formik.setFieldValue("doc_price_list", e.target.files?.[0])
            }
            className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:cursor-pointer"
          />
          {v.doc_price_list instanceof File && (
            <p
              className="mt-1 text-[10px] font-medium"
              style={{ color: "oklch(0.52 0.12 70)" }}
            >
              {v.doc_price_list.name}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

function StepRegulatory({ formik }: StepProps) {
  const v = formik.values;
  return (
    <Card icon={Scale} title="Regulatory & Compliance" stepNumber={5}>
      <div className="grid sm:grid-cols-2 gap-5">
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            FDA Registration Number
          </label>
          <input
            type="text"
            name="fda_registration"
            value={(v.fda_registration as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="FEI number"
            className={inp}
          />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            DEA Registration {req}
          </label>
          <select
            name="dea_registration"
            value={(v.dea_registration as string) ?? ""}
            onChange={formik.handleChange}
            className={sel}
          >
            <option value="">Select option</option>
            {[
              "Yes - Schedule III",
              "Yes - Schedule IV",
              "Yes - Schedule V",
              "In Progress",
              "No",
            ].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <FieldError formik={formik} name="dea_registration" />
        </div>
        <div className={`${fw} sm:col-span-2`}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            State Licenses
          </label>
          <textarea
            name="state_licenses"
            value={(v.state_licenses as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="State - License Type - Number (all active licenses)"
            className={ta}
          />
        </div>
        <div className={`${fw} sm:col-span-2`}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Manufacturing Certifications
          </label>
          <textarea
            name="manufacturing_certifications"
            value={(v.manufacturing_certifications as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="ISO, GMP, or other manufacturing certifications held (body, cert number, expiry)"
            className={ta}
          />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Shipping Jurisdictions {req}
          </label>
          <input
            type="text"
            name="shipping_jurisdictions"
            value={(v.shipping_jurisdictions as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="Countries/states you ship to and from"
            className={inp}
          />
          <FieldError formik={formik} name="shipping_jurisdictions" />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Product Labeling & Sale Restrictions {req}
          </label>
          <select
            name="product_labeling"
            value={(v.product_labeling as string) ?? ""}
            onChange={formik.handleChange}
            className={sel}
          >
            <option value="">Select option</option>
            {[
              "Research-use-only (RUO)",
              "Compounded pharmacy (503A/503B)",
              "Both, depending on product",
            ].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <FieldError formik={formik} name="product_labeling" />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Buyer Eligibility {req}
          </label>
          <select
            name="buyer_eligibility"
            value={(v.buyer_eligibility as string) ?? ""}
            onChange={formik.handleChange}
            className={sel}
          >
            <option value="">Select option</option>
            {[
              "Institutional/researcher only",
              "Clinics only",
              "Clinics and individuals",
              "All accounts",
            ].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <FieldError formik={formik} name="buyer_eligibility" />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Last FDA Inspection Date
          </label>
          <input
            type="text"
            name="last_fda_inspection"
            value={(v.last_fda_inspection as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="MM/YYYY or N/A"
            className={inp}
          />
        </div>
        <div className={fw}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            FDA Inspection Outcome
          </label>
          <select
            name="fda_outcome"
            value={(v.fda_outcome as string) ?? ""}
            onChange={formik.handleChange}
            className={sel}
          >
            <option value="">Select outcome</option>
            {[
              "No Action Indicated (NAI)",
              "Voluntary Action Indicated (VAI)",
              "Official Action Indicated (OAI)",
              "Never Inspected",
            ].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className={`${fw} sm:col-span-2`}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Warning Letters or Consent Decrees
          </label>
          <textarea
            name="warning_letters"
            value={(v.warning_letters as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="FDA warning letters or enforcement actions in past 5 years. Enter 'None' if not applicable."
            className={ta}
          />
        </div>
        <div className={`${fw} sm:col-span-2`}>
          <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
            Insurance Coverage {req}
          </label>
          <textarea
            name="insurance"
            value={(v.insurance as string) ?? ""}
            onChange={formik.handleChange}
            placeholder="Product liability, general liability, professional liability coverage amounts"
            className={ta}
          />
          <FieldError formik={formik} name="insurance" />
        </div>
      </div>
    </Card>
  );
}

function StepDocuments({ formik, error, submitting }: StepProps) {
  const v = formik.values;
  return (
    <Card icon={FolderOpen} title="Document Upload" stepNumber={6}>
      <div className="grid sm:grid-cols-2 gap-5 mb-6">
        {DOCS.map((f) => (
          <label
            key={f.name}
            className="flex flex-col gap-3 rounded-xl border-2 border-dashed p-5 cursor-pointer transition-all duration-200 hover:border-[var(--gold)] hover:bg-[oklch(0.98_0.02_80)]"
            style={{
              borderColor: "oklch(0.85 0.02 80)",
              background: "oklch(0.99 0.005 80)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-0.5"
                  style={{
                    color: "oklch(0.52 0.12 70)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {f.label}{" "}
                  {f.required && (
                    <span style={{ color: "var(--gold)" }}>*</span>
                  )}
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "oklch(0.55 0.02 50)" }}
                >
                  {f.hint}
                </p>
              </div>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "oklch(0.72 0.15 75 / 0.12)" }}
              >
                <Upload size={16} style={{ color: "var(--gold)" }} />
              </div>
            </div>
            <input
              type="file"
              name={f.name}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => {
                formik.setFieldValue(f.name, e.target.files?.[0]);
                formik.setFieldTouched(f.name, true);
              }}
              className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:cursor-pointer"
              style={{ fontFamily: "var(--font-body)" }}
            />
            {v[f.name] instanceof File && (
              <p
                className="text-[10px] font-medium"
                style={{ color: "oklch(0.52 0.12 70)" }}
              >
                {(v[f.name] as File).name}
              </p>
            )}
            <FieldError formik={formik} name={f.name} />
            <p className="text-[10px]" style={{ color: "oklch(0.65 0.02 50)" }}>
              PDF, DOC, JPG, PNG · max 10 MB
            </p>
          </label>
        ))}
      </div>

      {/* Disclaimer */}
      <div
        className="rounded-xl p-5 mb-6 flex gap-4"
        style={{
          background: "oklch(0.97 0.02 75)",
          border: "1px solid oklch(0.88 0.06 75)",
        }}
      >
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: "oklch(0.72 0.15 75 / 0.2)" }}
        >
          <Info size={11} style={{ color: "var(--gold)" }} />
        </div>
        <p
          className="text-xs leading-relaxed"
          style={{ color: "oklch(0.42 0.05 60)" }}
        >
          By submitting you confirm all information is accurate. RampRate uses
          this solely for supplier evaluation and deal matching. Submission does
          not guarantee RFP participation. All information is treated as
          confidential.
        </p>
      </div>

      {error && (
        <p
          className="mb-4 text-xs font-medium"
          style={{ color: "oklch(0.55 0.2 25)" }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        style={{
          background:
            "linear-gradient(135deg, var(--gold), oklch(0.58 0.18 68))",
          fontFamily: "var(--font-body)",
        }}
      >
        {submitting ? "Submitting…" : "Submit Application"}
        {!submitting && <ArrowRight size={16} />}
      </button>
      <p
        className="mt-3 text-[11px]"
        style={{ color: "oklch(0.6 0.02 50)", fontFamily: "var(--font-body)" }}
      >
        <span style={{ color: "var(--gold)" }}>*</span> {REQUIRED_FIELD_COUNT}{" "}
        required fields across all sections
      </p>
    </Card>
  );
}

const STEPS: Record<number, ComponentType<StepProps>> = {
  0: StepCompanyInfo,
  1: StepManufacturing,
  2: StepQuality,
  3: StepCommercial,
  4: StepRegulatory,
  5: StepDocuments,
};

function StepBar({
  active,
  onStepClick,
}: {
  active: number;
  onStepClick: (target: number) => void;
}) {
  return (
    <div className="flex items-center mb-10">
      {TABS.map((tab, i) => {
        const done = i < active;
        const isActive = i === active;
        return (
          <div key={tab.id} className="flex items-center flex-1 last:flex-none">
            <button
              type="button"
              onClick={() => onStepClick(tab.id)}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold transition-all duration-300 border-2"
                style={{
                  background: done ? "var(--gold)" : "white",
                  borderColor:
                    done || isActive ? "var(--gold)" : "oklch(0.85 0.01 80)",
                  color: done
                    ? "white"
                    : isActive
                      ? "var(--gold)"
                      : "oklch(0.65 0.01 80)",
                  boxShadow: isActive
                    ? "0 0 0 4px rgba(212,168,67,0.15)"
                    : "none",
                }}
              >
                {done ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  <span className="text-xs">{i + 1}</span>
                )}
              </div>
              <span
                className="hidden sm:block text-[10px] font-semibold tracking-wider uppercase whitespace-nowrap"
                style={{
                  color: isActive
                    ? "var(--gold)"
                    : done
                      ? "oklch(0.52 0.12 70)"
                      : "oklch(0.45 0.02 50)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {tab.label}
              </span>
            </button>
            {i < TABS.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-2 rounded-full transition-all duration-500"
                style={{
                  background:
                    i < active ? "var(--gold)" : "oklch(0.88 0.01 80)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function VendorIntakeForm() {
  const [active, setActive] = useState(0);
  const [pricingRows, setPricingRows] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement | null>(null);

  const formik = useFormik<FormValues>({
    initialValues: {},
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      if (honeypotRef.current?.value) return;

      setError(null);
      setSubmitting(true);

      try {
        const formData: Record<string, string> = {};
        const fileEntries: {
          fieldName: string;
          filename: string;
          mimeType: string;
          base64: string;
        }[] = [];

        for (const [name, value] of Object.entries(values)) {
          if (value instanceof File) {
            fileEntries.push({
              fieldName: name,
              filename: value.name,
              mimeType: value.type || "application/octet-stream",
              base64: await fileToBase64(value),
            });
          } else if (value !== undefined) {
            formData[name] = value;
          }
        }

        const res = await fetch("/api/vendor-intake", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formData,
            files: fileEntries,
            sourceUrl: window.location.href,
          }),
        });

        if (!res.ok) throw new Error("Submission failed");
        setSubmitted(true);
      } catch {
        setError(
          "Something went wrong submitting your application. Please try again or email us directly.",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  async function goToStep(target: number) {
    if (target > active) {
      const errors = await formik.validateForm();
      const stepErrorFields = STEP_FIELDS[active].filter(
        (name) => errors[name],
      );
      if (stepErrorFields.length) {
        const touched = { ...formik.touched };
        stepErrorFields.forEach((name) => {
          touched[name] = true;
        });
        formik.setTouched(touched);
        return;
      }
    }
    setActive(target);
  }

  /* ── Success ── */
  if (submitted)
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-5">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
          style={{
            background:
              "linear-gradient(135deg, var(--gold), oklch(0.62 0.18 75))",
          }}
        >
          <Check size={32} stroke="white" strokeWidth={2.5} />
        </div>
        <h2
          className="text-3xl font-bold mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Application Received
        </h2>
        <p
          className="text-base leading-relaxed mb-8"
          style={{
            color: "oklch(0.45 0.02 50)",
            fontFamily: "var(--font-body)",
          }}
        >
          Thank you for submitting your vendor profile. We will review your
          application against active buyer mandates and contact you if there is
          a fit. No response means no current match - not a rejection.
        </p>
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
          style={{
            background: "oklch(0.72 0.15 75 / 0.12)",
            color: "oklch(0.45 0.12 70)",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--gold)" }}
          />
          Submitted to RampRate Supplier Fit Index
        </div>
      </div>
    );

  const Step = STEPS[active];

  return (
    <form
      name="vendor-intake"
      onSubmit={formik.handleSubmit}
      style={{ fontFamily: "var(--font-body)" }}
    >
      <input
        ref={honeypotRef}
        type="text"
        name="bot_field"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
      />

      <StepBar active={active} onStepClick={goToStep} />

      <Step
        formik={formik}
        pricingRows={pricingRows}
        setPricingRows={setPricingRows}
        error={error}
        submitting={submitting}
      />

      {/* Prev / Next */}
      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={() => setActive((p) => Math.max(0, p - 1))}
          disabled={active === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all disabled:opacity-25 disabled:cursor-not-allowed hover:bg-[oklch(0.97_0.02_75)]"
          style={{
            borderColor: "oklch(0.85 0.04 70)",
            color: "oklch(0.45 0.08 60)",
            fontFamily: "var(--font-body)",
          }}
        >
          <ArrowLeft size={14} />
          Previous
        </button>

        <span
          className="text-xs"
          style={{
            color: "oklch(0.6 0.02 50)",
            fontFamily: "var(--font-body)",
          }}
        >
          {active + 1} / {TABS.length}
        </span>

        {active < TABS.length - 1 && (
          <button
            type="button"
            onClick={() => goToStep(Math.min(TABS.length - 1, active + 1))}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.01]"
            style={{
              background: "var(--gold)",
              fontFamily: "var(--font-body)",
            }}
          >
            Next
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </form>
  );
}
