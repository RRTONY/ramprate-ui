"use client";

import { useRef, useState } from "react";
import type { ComponentType } from "react";
import { useFormik, type FormikProps } from "formik";
import * as Yup from "yup";
import {
  Check,
  ArrowLeft,
  ArrowRight,
  X,
  Building2,
  ClipboardList,
  FlaskConical,
  Truck,
  DollarSign,
  ShieldCheck,
  Users,
  Target,
  ChevronDown,
  Info,
  Package,
  BarChart3,
} from "lucide-react";
import { PRODUCT_CATEGORIES, catField } from "@/lib/biochain-catalogue";
import PhoneInput from "@/components/shared/PhoneInput";

const inp = `w-full px-4 py-3 rounded-xl border border-black/8 bg-white/80 text-sm text-[oklch(0.2_0.02_50)] placeholder:text-black/30 outline-none transition-all duration-200 focus:border-[var(--gold)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(212,168,67,0.12)]`;
const ta = `${inp} resize-y min-h-[100px]`;
const sel = `${inp} appearance-none cursor-pointer`;
const lbl = `block text-[11px] font-semibold tracking-[0.16em] uppercase mb-2`;
const fw = `flex flex-col`;
const req = <span style={{ color: "var(--gold)" }}> *</span>;
const labelColor = "oklch(0.52 0.12 70)";

type FormValues = Record<string, string | string[] | File | undefined>;

/* ── Option data ── */

const ORG_TYPE_OPTIONS = [
  "Longevity / Anti-Aging Clinic",
  "Functional Medicine Practice",
  "Integrative Medicine Center",
  "Regenerative Medicine Clinic",
  "Sports Medicine / Performance",
  "Medical Spa (Med Spa)",
  "IV Therapy Center",
  "Concierge / Direct Primary Care",
  "Hospital / Health System",
  "Compounding Pharmacy",
  "Research Institution",
  "Distributors / Wholesaler",
  "Other",
];

const LOCATIONS_OPTIONS = ["1", "2–3", "4–10", "11–25", "26–50", "50+"];
const PATIENTS_PER_MONTH_OPTIONS = [
  "Under 50",
  "50 – 200",
  "200 – 500",
  "500 – 1,000",
  "1,000 – 5,000",
  "5,000+",
];

const SUPPLIER_DISCOVERY_OPTIONS = [
  "Personal referral / peer network",
  "Conference or trade show",
  "Online search",
  "Sales outreach (cold)",
  "Group purchasing organization (GPO)",
  "Compounding pharmacy relationship",
  "Manufacturer direct",
  "Multiple channels",
];

const SATISFACTION_OPTIONS = [
  "5 — Very satisfied, mostly looking to optimize",
  "4 — Generally satisfied, some gaps",
  "3 — Mixed — some suppliers work, others don't",
  "2 — Frustrated — real problems need solving",
  "1 — Significant issues — actively looking to switch",
];

const PAIN_POINTS_OPTIONS = [
  "Paying above market rates",
  "Inconsistent product quality",
  "Supply disruptions or stockouts",
  "Regulatory uncertainty",
  "Too many suppliers to manage",
  "Lack of COA / documentation",
  "Compliance concerns",
  "No time to find better suppliers",
  "No market pricing intelligence",
  "Other",
];

const DELIVERY_FORMAT_OPTIONS = [
  "Lyophilized dry powder — single-use vials (reconstitute with BAC water)",
  "Pre-reconstituted injectable solution — ready to inject",
  "Multi-dose vial — reconstituted, preserved",
  "Bulk lyophilized powder — loose (research / repackaging)",
  "Bulk API — raw powder, kilogram quantities",
  "Oral capsule / tablet — compounded or encapsulated",
  "Oral liquid / suspension",
  "Sublingual drop, troche, or lozenge",
  "Nasal spray / intranasal",
  "Topical cream or gel",
  "Transdermal patch",
  "Subcutaneous pellet implant",
  "IV bag / drip-ready solution",
  "Auto-injector pen device (e.g. GLP-1 pens)",
  "Prefilled syringe",
  "Nebulizer / inhaled solution",
  "Ophthalmic / eye drop solution",
  "Other format",
];

const MONTHLY_VOLUME_OPTIONS = [
  "Under 50 units / vials",
  "50 – 200 units / vials",
  "200 – 500 units / vials",
  "500 – 1,000 units / vials",
  "1,000 – 5,000 units / vials",
  "5,000 – 20,000 units / vials",
  "Over 20,000 units / vials",
  "Measured in kg / bulk API — not unit vials",
  "Not sure — need help calculating",
];

const PRIORITY_CATEGORY_OPTIONS = [
  "GLP-1 / Metabolic Peptides",
  "Tissue Repair (BPC-157, TB-500)",
  "Growth Hormone Peptides",
  "Cognitive / Neuro Peptides",
  "Longevity / NAD+ / Cellular",
  "Exosomes / Stem Cell Biologics",
  "Sexual Health Peptides",
  "Aesthetic / Skin Peptides",
  "Performance / Muscle Peptides",
  "Custom Formulation",
  "Not sure yet — need guidance",
];

const PRICING_ORIGIN_OPTIONS = [
  "US-sourced only",
  "Chinese API acceptable",
  "Chinese API preferred (cost)",
  "EU / Swiss / German preferred",
  "Indian cGMP acceptable",
  "Japanese pharmaceutical grade",
  "Best verified value — origin flexible",
  "No preference — advise us",
];

const DELIVERY_REGION_OPTIONS = [
  "Southern California",
  "Northern California",
  "Pacific Northwest",
  "Southwest (AZ, NV, NM)",
  "Texas",
  "Southeast (FL, GA, NC)",
  "Midwest",
  "Northeast / Mid-Atlantic",
  "Mountain / Rocky Mountain",
  "National — multiple states",
  "Canada",
  "Latin America",
  "Europe",
  "Asia / Pacific",
  "Middle East",
  "Global — worldwide distribution",
];

const COLD_CHAIN_OPTIONS = [
  "Yes — all products require 2–8°C cold chain",
  "Yes — some products require cold chain",
  "No — lyophilized / dry products only",
  "Mixed — varies by product",
  "Not sure — advise us",
];

const DELIVERY_URGENCY_OPTIONS = [
  "Standard — 5–10 business days acceptable",
  "Priority — 2–3 business days preferred",
  "Urgent — next-day sometimes needed",
  "Flexible — depends on product",
];

const TRADE_REF_TYPE_OPTIONS = [
  "Clinic partners / peers",
  "Existing distributor",
  "Group purchasing org (GPO)",
  "Pharma industry contact",
  "Physician network",
  "Compounding pharmacy",
  "Research institution",
  "No trade references yet",
];

const MONTHLY_SPEND_OPTIONS = [
  "Under $5,000",
  "$5,000 – $15,000",
  "$15,000 – $50,000",
  "$50,000 – $150,000",
  "$150,000 – $500,000",
  "$500,000 – $1M",
  "Over $1M",
  "Not sure — need help auditing",
];

const CONTRACT_STATUS_OPTIONS = [
  "No — purchase order by purchase order",
  "Informal — verbal or email-based agreements",
  "Yes — 1 or more formal contracts, under 12 months",
  "Yes — 1 or more formal contracts, 12 months or longer",
  "Not sure",
];

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming", "District of Columbia",
];

const LICENSE_TYPE_OPTIONS = [
  "MD / DO — Physician",
  "NP — Nurse Practitioner",
  "PA — Physician Assistant",
  "RN — Registered Nurse (supervised)",
  "Pharmacy — Compounding",
  "Clinic — Multi-Provider",
  "Research Institution",
  "Distributor License",
  "Other licensed provider",
];

const DEA_OPTIONS = [
  "Yes — active DEA registration",
  "No — not required for our scope",
  "In process",
  "Not sure",
];

const OVERSIGHT_OPTIONS = [
  "Physician on staff / in-house",
  "Medical director on contract",
  "Collaborating physician agreement",
  "I am the physician",
  "Not applicable",
];

const FDA_WARNING_OPTIONS = [
  "No",
  "Yes — resolved",
  "Yes — pending",
  "Prefer to discuss directly",
];

const CUSTOMER_BASE_OPTIONS = [
  "Longevity / anti-aging patients",
  "Athletes & performance clients",
  "Weight loss / GLP-1 patients",
  "Chronic pain / injury recovery",
  "Aesthetic / skin clients",
  "Executive health / concierge",
  "Biohackers & self-optimizers",
  "Functional medicine patients",
  "Other clinics (B2B resale)",
  "Research / academic",
  "Distributors / wholesalers",
  "Telehealth patients (nationwide)",
];

const DEMOGRAPHICS_OPTIONS = [
  "High-net-worth / luxury clientele",
  "General professional / upper-middle class",
  "Athletes — amateur and semi-pro",
  "Athletes — elite / professional",
  "Broad demographic — insurance and cash pay mix",
  "Cash-pay only — premium pricing",
  "Research participants",
  "B2B — we sell to other providers, not patients",
  "Mixed",
];

const ENGAGEMENT_OPTIONS = [
  "In-clinic only — all treatments on-site",
  "Take-home protocols — we dispense, they self-administer",
  "Hybrid — clinic treatment + home maintenance",
  "Telehealth — remote consults, ship to patient",
  "Membership / subscription model",
  "Concierge — we come to them",
  "B2B resale — we supply other clinics",
  "Direct-to-consumer online",
];

const PROTOCOLS_OPTIONS = [
  "Repair stack (BPC + TB-500)",
  "GH optimization (Ipam + CJC)",
  "GLP-1 / weight program",
  "Longevity protocol (Epitalon / SS-31)",
  "Cognitive / brain protocol",
  "NAD+ IV therapy",
  "Exosome infusion program",
  "Aesthetic / skin program",
  "Immune support protocol",
  "Sexual health protocol",
  "Custom stacked protocols",
  "Other",
];

const PERSONAL_USE_OPTIONS = [
  "Yes — I personally use them and have direct patient experience",
  "Yes — I use them alongside my patients in the same protocols",
  "Occasionally — limited personal use",
  "No — these are for my patients / clients only",
  "Not yet — interested in starting",
];

const PRIMARY_GOAL_OPTIONS = [
  "Reduce cost of current supply — same products, better pricing",
  "Improve product quality and consistency",
  "Find new suppliers for products I can't currently source",
  "Consolidate suppliers — too many relationships to manage",
  "Add new product categories to my protocol menu",
  "Ensure regulatory compliance before scaling",
  "Build a verified, auditable supply chain",
  "Understand BioChain OS for blockchain-verified sourcing",
  "All of the above — comprehensive sourcing overhaul",
];

const SECONDARY_GOAL_OPTIONS = [
  "White-label / custom formulation",
  "International sourcing options",
  "ImpactSoul / impact-aligned supply chain",
  "Group purchasing for multi-location discount",
  "Supplier introduction without advisory engagement",
  "None — one goal for now",
];

const TIMELINE_OPTIONS = [
  "Immediately — ready to move this week",
  "Within 30 days",
  "1–3 months",
  "3–6 months",
  "Exploring — no hard timeline yet",
];

const REFERRAL_OPTIONS = [
  "Tony Greenberg — direct referral",
  "RampRate.com website",
  "LinkedIn",
  "Industry conference or event",
  "Peer / colleague referral",
  "David Kasteler / RRG",
  "Podcast or media",
  "Other",
];

/* ── Validation ── */

const requiredStr = () => Yup.string().required("Required");

// Lenient on purpose: accepts bare domains ("example.com") as well as full
// URLs, unlike Yup's built-in .url() which requires a protocol.
const WEBSITE_RE = /^(https?:\/\/)?([\da-z-]+\.)+[a-z]{2,}([/?#].*)?$/i;

const PHONE_ALLOWED_CHARS_RE = /^\+?[\d\s().-]+$/;
function isValidPhone(value: string): boolean {
  if (!PHONE_ALLOWED_CHARS_RE.test(value)) return false;
  const digitCount = value.replace(/\D/g, "").length;
  return digitCount >= 7 && digitCount <= 15;
}

const CURRENCY_RE = /^\$?\d[\d,]*(\.\d{1,2})?$/;
function isValidCurrency(value: string): boolean {
  return CURRENCY_RE.test(value.trim());
}

const PRODUCT_FIELD_NAMES = PRODUCT_CATEGORIES.map((c) => catField(c.name));

const currencyTest = (name: string) =>
  Yup.string().test(name, "Enter a number (e.g. 8,000)", (v) => !v || isValidCurrency(v));

const validationSchema = Yup.object()
  .shape({
    org_name: requiredStr(),
    org_type: requiredStr(),
    website: Yup.string().test("valid-website", "Enter a valid website", (v) => !v || WEBSITE_RE.test(v)),
    contact_name: requiredStr(),
    contact_email: Yup.string().email("Invalid email").required("Required"),
    contact_phone: Yup.string().test("valid-phone", "Enter a valid phone number", (v) => !v || isValidPhone(v)),
    // Yup silently skips .min() on an untouched (undefined) field unless
    // .required() is also chained - without it, a client who never touches
    // this array at all sails past Continue with nothing selected.
    current_suppliers: Yup.array()
      .of(Yup.string())
      .min(1, "Add at least one supplier")
      .required("Add at least one supplier"),
    pain_points_other_text: Yup.string().test(
      "required-if-other",
      "Please specify",
      function (value) {
        const painPoints = this.parent.pain_points as string[] | undefined;
        if (painPoints?.includes("Other")) return !!value && value.trim().length > 0;
        return true;
      },
    ),
    monthly_volume: requiredStr(),
    delivery_regions: Yup.array()
      .of(Yup.string())
      .min(1, "Select at least one region")
      .required("Select at least one region"),
    monthly_spend: requiredStr(),
    spend_peptides: currencyTest("valid-currency-peptides"),
    spend_exosomes: currencyTest("valid-currency-exosomes"),
    spend_stemcell: currencyTest("valid-currency-stemcell"),
    spend_nad: currencyTest("valid-currency-nad"),
    state: requiredStr(),
    license_type: requiredStr(),
    personal_use: requiredStr(),
    primary_goal: requiredStr(),
    timeline: requiredStr(),
  })
  .test("at-least-one-product", "Select at least one product from the catalog below", function (values) {
    const record = values as Record<string, unknown>;
    const anySelected = PRODUCT_FIELD_NAMES.some(
      (name) => Array.isArray(record[name]) && (record[name] as string[]).length > 0,
    );
    if (anySelected) return true;
    return this.createError({ path: "products_any", message: "Select at least one product from the catalog below" });
  });

const STEP_META = [
  { section: "YOUR ORGANIZATION", title: "Tell us about your organization", minutes: 2, Icon: Building2 },
  { section: "CURRENT SOURCING", title: "How are you sourcing today?", minutes: 3, Icon: ClipboardList },
  { section: "PRODUCTS & VOLUME", title: "Full product catalog", minutes: 4, Icon: FlaskConical },
  { section: "LOGISTICS & PRICING", title: "Logistics, pricing & trade references", minutes: 3, Icon: Truck },
  { section: "SPEND & CONTRACTS", title: "Spend and volume", minutes: 2, Icon: DollarSign },
  { section: "COMPLIANCE PROFILE", title: "Compliance profile", minutes: 2, Icon: ShieldCheck },
  { section: "CUSTOMERS & USE", title: "Your customers and how you use these products", minutes: 2, Icon: Users },
  { section: "GOALS & TIMING", title: "Goals and timing", minutes: 2, Icon: Target },
];

const TOTAL_MINUTES = STEP_META.reduce((sum, s) => sum + s.minutes, 0);

const STEP_FIELDS: string[][] = [
  ["org_name", "org_type", "website", "contact_name", "contact_title", "contact_email", "contact_phone", "num_locations", "patients_per_month"],
  ["current_suppliers", "supplier_discovery", "sourcing_satisfaction", "pain_points", "pain_points_other_text"],
  [...PRODUCT_FIELD_NAMES, "products_any", "delivery_formats", "monthly_volume", "priority_category"],
  ["pricing_origin", "pricing_notes", "delivery_regions", "cold_chain", "delivery_urgency", "trade_reference_types", "trade_references_text"],
  ["monthly_spend", "spend_peptides", "spend_exosomes", "spend_stemcell", "spend_nad", "contract_status"],
  ["state", "license_type", "dea_registration", "physician_oversight", "fda_warning"],
  ["customer_base", "patient_demographics", "engagement_model", "protocols_offered", "personal_use"],
  ["primary_goal", "secondary_goal", "timeline", "referral_source", "additional_notes"],
];

/* ── Shared field primitives ── */

function Tooltip({ text }: { text: string }) {
  return (
    <span className="relative inline-flex group ml-1.5 align-middle normal-case tracking-normal">
      <Info size={13} style={{ color: "oklch(0.6 0.05 60)" }} />
      <span
        className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-60 px-3 py-2 rounded-lg text-[11px] font-normal leading-relaxed opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-20"
        style={{ background: "oklch(0.2 0.02 50)", color: "white", fontFamily: "var(--font-body)" }}
      >
        {text}
      </span>
    </span>
  );
}

function FieldError({ formik, name }: { formik: FormikProps<FormValues>; name: string }) {
  const message = formik.touched[name] && formik.errors[name];
  if (!message) return null;
  return (
    <p className="mt-1 text-[11px] font-medium" style={{ color: "oklch(0.55 0.2 25)" }}>
      {String(message)}
    </p>
  );
}

function TextField({
  formik,
  name,
  label,
  type = "text",
  placeholder,
  required,
  full,
}: {
  formik: FormikProps<FormValues>;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  full?: boolean;
}) {
  if (type === "tel") {
    return (
      <div className={`${fw} ${full ? "sm:col-span-2" : ""}`}>
        <label className={lbl} style={{ color: labelColor }}>
          {label}
          {required && req}
        </label>
        <PhoneInput
          name={name}
          value={(formik.values[name] as string) ?? ""}
          onChange={(next) => formik.setFieldValue(name, next)}
          onBlur={() => formik.setFieldTouched(name, true)}
          placeholder={placeholder}
        />
        <FieldError formik={formik} name={name} />
      </div>
    );
  }
  return (
    <div className={`${fw} ${full ? "sm:col-span-2" : ""}`}>
      <label className={lbl} style={{ color: labelColor }}>
        {label}
        {required && req}
      </label>
      <input
        type={type}
        name={name}
        value={(formik.values[name] as string) ?? ""}
        onChange={formik.handleChange}
        placeholder={placeholder}
        className={inp}
      />
      <FieldError formik={formik} name={name} />
    </div>
  );
}

function CurrencyField({
  formik,
  name,
  label,
  placeholder,
}: {
  formik: FormikProps<FormValues>;
  name: string;
  label: string;
  placeholder?: string;
}) {
  return (
    <div className={fw}>
      <label className={lbl} style={{ color: labelColor }}>
        {label}
      </label>
      <div className="relative">
        <span
          className="absolute left-4 top-1/2 -translate-y-1/2 text-sm select-none"
          style={{ color: "oklch(0.5 0.02 50)" }}
        >
          $
        </span>
        <input
          type="text"
          inputMode="decimal"
          name={name}
          value={(formik.values[name] as string) ?? ""}
          onChange={formik.handleChange}
          placeholder={placeholder}
          className={`${inp} pl-8`}
        />
      </div>
      <FieldError formik={formik} name={name} />
    </div>
  );
}

function SelectField({
  formik,
  name,
  label,
  options,
  placeholder = "Select —",
  required,
  full,
}: {
  formik: FormikProps<FormValues>;
  name: string;
  label: string;
  options: string[];
  placeholder?: string;
  required?: boolean;
  full?: boolean;
}) {
  return (
    <div className={`${fw} ${full ? "sm:col-span-2" : ""}`}>
      <label className={lbl} style={{ color: labelColor }}>
        {label}
        {required && req}
      </label>
      <select
        name={name}
        value={(formik.values[name] as string) ?? ""}
        onChange={formik.handleChange}
        className={sel}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <FieldError formik={formik} name={name} />
    </div>
  );
}

function TextAreaField({
  formik,
  name,
  label,
  placeholder,
  required,
}: {
  formik: FormikProps<FormValues>;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className={`${fw} sm:col-span-2`}>
      <label className={lbl} style={{ color: labelColor }}>
        {label}
        {required && req}
      </label>
      <textarea
        name={name}
        value={(formik.values[name] as string) ?? ""}
        onChange={formik.handleChange}
        placeholder={placeholder}
        className={ta}
      />
      <FieldError formik={formik} name={name} />
    </div>
  );
}

const GRID_COLS: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
};

function CheckboxGroup({
  formik,
  name,
  label,
  tooltip,
  options,
  columns = 3,
  required,
  exclusiveOptions,
}: {
  formik: FormikProps<FormValues>;
  name: string;
  label?: string;
  tooltip?: string;
  options: string[];
  columns?: number;
  required?: boolean;
  exclusiveOptions?: string[];
}) {
  const selected = (formik.values[name] as string[]) ?? [];
  function toggle(opt: string) {
    let next: string[];
    if (selected.includes(opt)) {
      next = selected.filter((o) => o !== opt);
    } else if (exclusiveOptions?.includes(opt) || exclusiveOptions?.some((ex) => selected.includes(ex))) {
      next = [opt];
    } else {
      next = [...selected, opt];
    }
    formik.setFieldValue(name, next);
  }
  return (
    <div className="sm:col-span-2">
      {label && (
        <label className={lbl} style={{ color: labelColor }}>
          {label}
          {required && req}
          {tooltip && <Tooltip text={tooltip} />}
        </label>
      )}
      <div className={`grid grid-cols-1 ${GRID_COLS[columns] ?? GRID_COLS[3]} gap-2.5`}>
        {options.map((opt) => {
          const checked = selected.includes(opt);
          return (
            <label
              key={opt}
              className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg border cursor-pointer transition-all text-sm"
              style={{
                borderColor: checked ? "var(--gold)" : "oklch(0.88 0.02 70)",
                background: checked ? "oklch(0.97 0.03 75)" : "white",
                color: "oklch(0.25 0.02 50)",
                fontFamily: "var(--font-body)",
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(opt)}
                className="mt-0.5 shrink-0"
                style={{ accentColor: "var(--gold)" }}
              />
              <span>{opt}</span>
            </label>
          );
        })}
      </div>
      <FieldError formik={formik} name={name} />
    </div>
  );
}

function TagInput({
  formik,
  name,
  label,
  placeholder,
  required,
}: {
  formik: FormikProps<FormValues>;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}) {
  const [draft, setDraft] = useState("");
  const tags = (formik.values[name] as string[]) ?? [];

  function addTag() {
    const t = draft.trim();
    if (t && !tags.includes(t)) formik.setFieldValue(name, [...tags, t]);
    setDraft("");
  }
  function removeTag(t: string) {
    formik.setFieldValue(
      name,
      tags.filter((x) => x !== t),
    );
  }

  return (
    <div className={`${fw} sm:col-span-2`}>
      <label className={lbl} style={{ color: labelColor }}>
        {label}
        {required && req}
      </label>
      <div className={`${inp} flex flex-wrap items-center gap-2 py-2`}>
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-medium"
            style={{
              background: "oklch(0.72 0.15 75 / 0.15)",
              color: "oklch(0.45 0.12 70)",
            }}
          >
            {t}
            <button
              type="button"
              onClick={() => removeTag(t)}
              aria-label={`Remove ${t}`}
              className="hover:opacity-70"
            >
              <X size={11} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          onBlur={addTag}
          placeholder={tags.length ? "" : placeholder}
          className="flex-1 min-w-[160px] bg-transparent outline-none text-sm"
        />
      </div>
      <FieldError formik={formik} name={name} />
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="sm:col-span-2 flex items-center gap-4 mt-1">
      <div className="flex-1 h-px" style={{ background: "oklch(0.85 0.02 70)" }} />
      <span
        className="text-[10px] font-semibold tracking-[0.2em] uppercase shrink-0 text-center"
        style={{ color: "oklch(0.5 0.05 60)", fontFamily: "var(--font-body)" }}
      >
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: "oklch(0.85 0.02 70)" }} />
    </div>
  );
}

function SectionIntro({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="sm:col-span-2 -mt-2 text-sm leading-relaxed"
      style={{ color: "oklch(0.45 0.02 50)", fontFamily: "var(--font-body)" }}
    >
      {children}
    </p>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="sm:col-span-2 rounded-lg px-5 py-4 text-sm leading-relaxed border-l-4"
      style={{
        background: "oklch(0.97 0.02 75)",
        borderColor: "var(--gold)",
        color: "oklch(0.4 0.03 55)",
        fontFamily: "var(--font-body)",
      }}
    >
      {children}
    </div>
  );
}

interface StepProps {
  formik: FormikProps<FormValues>;
}

/* ── Steps ── */

function Step1({ formik }: StepProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <TextField formik={formik} name="org_name" label="Organization Name" required placeholder="Clinic or practice name" />
      <SelectField formik={formik} name="org_type" label="Organization Type" required options={ORG_TYPE_OPTIONS} />
      <TextField formik={formik} name="website" label="Website" placeholder="https://" full />
      <Divider label="Primary Contact" />
      <TextField formik={formik} name="contact_name" label="Full Name" required placeholder="Your name" />
      <TextField formik={formik} name="contact_title" label="Title / Role" placeholder="Medical Director, CEO, etc." />
      <TextField formik={formik} name="contact_email" label="Email" type="email" required placeholder="you@clinic.com" />
      <TextField formik={formik} name="contact_phone" label="Phone" type="tel" placeholder="(___) ___-____" />
      <Divider label="Scale" />
      <SelectField formik={formik} name="num_locations" label="Number of Locations" options={LOCATIONS_OPTIONS} />
      <SelectField formik={formik} name="patients_per_month" label="Approximate Patients Served Per Month" options={PATIENTS_PER_MONTH_OPTIONS} />
    </div>
  );
}

function Step2({ formik }: StepProps) {
  const painPoints = (formik.values.pain_points as string[]) ?? [];
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <TagInput formik={formik} name="current_suppliers" label="Current Primary Suppliers" required placeholder="Search or type a supplier name, press Enter to add..." />
      <CheckboxGroup
        formik={formik}
        name="supplier_discovery"
        label="How Did You Find Your Current Suppliers? Select All That Apply."
        tooltip="GPO = Group Purchasing Organization, an entity that pools buying volume across multiple clinics to negotiate better pricing."
        options={SUPPLIER_DISCOVERY_OPTIONS}
      />
      <SelectField formik={formik} name="sourcing_satisfaction" label="Overall Satisfaction With Current Sourcing" options={SATISFACTION_OPTIONS} full />
      <CheckboxGroup
        formik={formik}
        name="pain_points"
        label="What Are Your Biggest Sourcing Pain Points?"
        tooltip="COA = Certificate of Analysis, the lab report verifying a product's identity, purity, and safety."
        options={PAIN_POINTS_OPTIONS}
      />
      {painPoints.includes("Other") && (
        <TextField formik={formik} name="pain_points_other_text" label="Please Specify" required placeholder="Describe the pain point" full />
      )}
    </div>
  );
}

function CatalogCard({
  title,
  step,
  Icon,
  children,
}: {
  title: string;
  step: string;
  Icon: ComponentType<{ size?: number; style?: React.CSSProperties }>;
  children: React.ReactNode;
}) {
  return (
    <div
      className="sm:col-span-2 rounded-xl border p-5"
      style={{ borderColor: "oklch(0.88 0.02 70)", background: "oklch(0.98 0.01 75)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "oklch(0.72 0.15 75 / 0.18)" }}
        >
          <Icon size={17} style={{ color: labelColor }} />
        </div>
        <p className={lbl} style={{ color: labelColor, marginBottom: 0 }}>
          <span style={{ opacity: 0.55, fontWeight: 400 }}>{step} — </span>
          {title}
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-5 mt-4">{children}</div>
    </div>
  );
}

function CategoryAccordion({ formik, category }: { formik: FormikProps<FormValues>; category: { name: string; items: string[] } }) {
  const [open, setOpen] = useState(false);
  const fieldName = catField(category.name);
  const selected = (formik.values[fieldName] as string[]) ?? [];

  return (
    <div className="sm:col-span-2 rounded-lg border overflow-hidden" style={{ borderColor: "oklch(0.88 0.02 70)", background: "white" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left"
      >
        <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)", color: "oklch(0.25 0.02 50)" }}>
          {category.name}
        </span>
        <span className="flex items-center gap-3 shrink-0">
          {selected.length > 0 && (
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "oklch(0.72 0.15 75 / 0.15)", color: "oklch(0.45 0.12 70)" }}
            >
              {selected.length} selected
            </span>
          )}
          <ChevronDown
            size={16}
            style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform 0.2s" }}
          />
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4">
          <CheckboxGroup formik={formik} name={fieldName} options={category.items} />
        </div>
      )}
    </div>
  );
}

function Step3({ formik }: StepProps) {
  const productsError = formik.touched.products_any && formik.errors.products_any;
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {productsError && (
        <p className="sm:col-span-2 text-[11px] font-medium" style={{ color: "oklch(0.55 0.2 25)" }}>
          {String(productsError)}
        </p>
      )}

      <CatalogCard title="Full Product Catalog — Select At Least One" step="Part 1 of 3" Icon={FlaskConical}>
        <div className="sm:col-span-2 flex flex-col gap-2.5">
          {PRODUCT_CATEGORIES.map((cat) => (
            <CategoryAccordion key={cat.name} formik={formik} category={cat} />
          ))}
        </div>
      </CatalogCard>

      <CatalogCard title="Delivery Format & Form Factor" step="Part 2 of 3" Icon={Package}>
        <SectionIntro>
          Select every format you currently purchase or need. Supply chain, cold-chain, compliance posture, and pricing all differ materially by form. This is one of the highest-leverage questions in the intake.
        </SectionIntro>
        <CheckboxGroup formik={formik} name="delivery_formats" options={DELIVERY_FORMAT_OPTIONS} />
      </CatalogCard>

      <CatalogCard title="Volume" step="Part 3 of 3" Icon={BarChart3}>
        <SelectField formik={formik} name="monthly_volume" label="Estimated Total Monthly Quantity Across All Peptides / Biologics" required options={MONTHLY_VOLUME_OPTIONS} full />
        <SelectField formik={formik} name="priority_category" label="Highest-Priority Product Category Right Now" options={PRIORITY_CATEGORY_OPTIONS} full />
      </CatalogCard>
    </div>
  );
}

function Step4({ formik }: StepProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <Divider label="Pricing Origin Preference" />
      <SectionIntro>
        Chinese API manufacturers often offer 40–70% lower pricing on peptides with comparable purity when properly vetted. US-manufactured carries premium pricing and simpler regulatory positioning. Select all you are open to.
      </SectionIntro>
      <CheckboxGroup
        formik={formik}
        name="pricing_origin"
        label="Select All You're Open To"
        tooltip="API = Active Pharmaceutical Ingredient, the raw compound itself. cGMP = current Good Manufacturing Practice, an FDA-recognized quality standard for the facility that makes it."
        options={PRICING_ORIGIN_OPTIONS}
        exclusiveOptions={["US-sourced only", "No preference — advise us"]}
      />
      <TextAreaField formik={formik} name="pricing_notes" label="Any Specific Pricing Notes or Hard Requirements?" placeholder="e.g. Must have COA from US-accredited lab regardless of origin. Or: open to Chinese API for research peptides, US-only for injectables." />

      <Divider label="Key Delivery Regions" />
      <SectionIntro>
        Select all regions where you currently operate or plan to distribute. This shapes cold-chain logistics and customs strategy.
      </SectionIntro>
      <CheckboxGroup formik={formik} name="delivery_regions" label="Select All That Apply" required options={DELIVERY_REGION_OPTIONS} />
      <SelectField formik={formik} name="cold_chain" label="Cold-Chain / Temperature-Controlled Shipping Required?" options={COLD_CHAIN_OPTIONS} />
      <SelectField formik={formik} name="delivery_urgency" label="Typical Delivery Urgency" options={DELIVERY_URGENCY_OPTIONS} />

      <Divider label="Trade References" />
      <SectionIntro>
        We verify purchasing history for volume accounts. Strong trade references unlock better pricing tiers from our supplier network.
      </SectionIntro>
      <CheckboxGroup
        formik={formik}
        name="trade_reference_types"
        label="Types of Trade References You Can Provide"
        options={TRADE_REF_TYPE_OPTIONS}
        exclusiveOptions={["No trade references yet"]}
      />
      <TextAreaField formik={formik} name="trade_references_text" label="Name Up to 3 Trade References (Company Name and Contact — Kept Confidential)" placeholder="e.g. Kimera Labs — Sarah Chen, VP Sales | DirectBiologics — procurement dept | Local compounding pharmacy — Dr. Martinez" />
      <Callout>
        Trade references are never contacted without your explicit permission. They are used internally to expedite supplier approval and negotiate volume pricing tiers on your behalf.
      </Callout>
    </div>
  );
}

function Step5({ formik }: StepProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <SelectField formik={formik} name="monthly_spend" label="Estimated Total Monthly Biologics Spend (All Categories)" required options={MONTHLY_SPEND_OPTIONS} full />

      <Divider label="Breakdown by Category (Optional but Valuable, USD)" />
      <SectionIntro>Even rough estimates help us prioritize where to find savings first. Figures are in US dollars.</SectionIntro>
      <CurrencyField formik={formik} name="spend_peptides" label="Peptides — Monthly Est." placeholder="8,000" />
      <CurrencyField formik={formik} name="spend_exosomes" label="Exosomes / Biologics — Monthly Est." placeholder="25,000" />
      <CurrencyField formik={formik} name="spend_stemcell" label="Stem Cell Products — Monthly Est." placeholder="12,000" />
      <CurrencyField formik={formik} name="spend_nad" label="NAD+ / Longevity — Monthly Est." placeholder="3,000" />

      <Divider label="Contract Status" />
      <SelectField formik={formik} name="contract_status" label="Do You Have Long-Term Supply Contracts in Place With Current Suppliers?" options={CONTRACT_STATUS_OPTIONS} full />
    </div>
  );
}

function Step6({ formik }: StepProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <SelectField formik={formik} name="state" label="Primary State of Operation" required options={US_STATES} />
      <SelectField formik={formik} name="license_type" label="Medical / Clinical License Type" required options={LICENSE_TYPE_OPTIONS} />
      <SelectField formik={formik} name="dea_registration" label="DEA Registration?" options={DEA_OPTIONS} />
      <SelectField formik={formik} name="physician_oversight" label="Physician Oversight Model" options={OVERSIGHT_OPTIONS} />
      <SelectField formik={formik} name="fda_warning" label="Have You Received Any FDA Warning Letters or Enforcement Actions in the Last 5 Years?" options={FDA_WARNING_OPTIONS} full />
      <Callout>
        California, Florida, and several other states have specific 2024–2026 regulations affecting which peptides and biologics can be dispensed. Our compliance pre-mapping covers your state before any sourcing recommendation is made.
      </Callout>
    </div>
  );
}

function Step7({ formik }: StepProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <Divider label="Your Customer Base" />
      <CheckboxGroup formik={formik} name="customer_base" label="Who Are Your Primary Customers / Patients? Select All That Apply." options={CUSTOMER_BASE_OPTIONS} />
      <SelectField formik={formik} name="patient_demographics" label="How Would You Describe Your Patient / Client Demographics?" options={DEMOGRAPHICS_OPTIONS} full />
      <SelectField formik={formik} name="engagement_model" label="How Do Patients or Clients Primarily Engage With You?" options={ENGAGEMENT_OPTIONS} full />

      <Divider label="Protocols Offered" />
      <CheckboxGroup formik={formik} name="protocols_offered" label="Which Treatment Protocols Do You Currently Offer or Plan to Add?" options={PROTOCOLS_OPTIONS} />

      <Divider label="Personal Use" />
      <SelectField formik={formik} name="personal_use" label="Do You Personally Use Any of These Peptides or Biologics?" required options={PERSONAL_USE_OPTIONS} full />
      <Callout>
        Providers who personally use these protocols consistently achieve better patient outcomes and stronger client retention. This information helps us match you with the right product tiers and dosing documentation.
      </Callout>
    </div>
  );
}

function Step8({ formik }: StepProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <SelectField formik={formik} name="primary_goal" label="What Is Your Primary Goal for This Engagement?" required options={PRIMARY_GOAL_OPTIONS} full />
      <SelectField formik={formik} name="secondary_goal" label="Secondary Goal (Optional)" options={SECONDARY_GOAL_OPTIONS} full />
      <SelectField formik={formik} name="timeline" label="Timeline to Begin" required options={TIMELINE_OPTIONS} full />
      <SelectField formik={formik} name="referral_source" label="How Did You Find Us?" options={REFERRAL_OPTIONS} full />
      <TextAreaField formik={formik} name="additional_notes" label="Anything Else You Want Us to Know?" placeholder="Unique clinical protocols, specific supplier relationships you want to keep, goals not captured above, or anything that helps us prepare for our first call..." />
    </div>
  );
}

const STEPS: ComponentType<StepProps>[] = [Step1, Step2, Step3, Step4, Step5, Step6, Step7, Step8];

function ReviewSummary({
  formik,
  onEdit,
}: {
  formik: FormikProps<FormValues>;
  onEdit: (step: number) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {STEP_META.map((meta, i) => {
        const StepComp = STEPS[i];
        return (
          <div key={meta.title} className="rounded-xl border p-5 sm:p-6" style={{ borderColor: "oklch(0.88 0.02 70)" }}>
            <div className="flex items-center justify-between mb-5">
              <span
                className="text-xs font-semibold tracking-[0.16em] uppercase"
                style={{ color: labelColor, fontFamily: "var(--font-body)" }}
              >
                {i + 1}. {meta.title}
              </span>
              <button
                type="button"
                onClick={() => onEdit(i)}
                className="text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors hover:bg-[oklch(0.97_0.02_75)]"
                style={{ borderColor: "var(--gold)", color: "var(--gold)", fontFamily: "var(--font-body)" }}
              >
                Edit
              </button>
            </div>
            <fieldset disabled className="opacity-90">
              <StepComp formik={formik} />
            </fieldset>
          </div>
        );
      })}
    </div>
  );
}

/* ── Progress bar ── */

function ProgressBar({ active }: { active: number }) {
  const meta = STEP_META[active];
  const minutesRemaining = STEP_META.slice(active).reduce((sum, s) => sum + s.minutes, 0);
  const pct = ((active + 1) / STEP_META.length) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3 gap-4">
        <p
          className="text-xs font-semibold tracking-[0.14em] uppercase"
          style={{ color: "oklch(0.5 0.06 60)", fontFamily: "var(--font-body)" }}
        >
          Step {active + 1} of {STEP_META.length} — {meta.section}
        </p>
        <p
          className="text-xs font-semibold shrink-0"
          style={{ color: "oklch(0.52 0.15 50)", fontFamily: "var(--font-body)" }}
        >
          Est. {minutesRemaining} min remaining
        </p>
      </div>
      <div className="h-1 rounded-full overflow-hidden mb-3" style={{ background: "oklch(0.88 0.02 70)" }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: "var(--gold)" }}
        />
      </div>
      <div className="flex justify-between">
        {STEP_META.map((s, i) => (
          <div
            key={s.section}
            className="w-2 h-2 rounded-full"
            style={{ background: i <= active ? "var(--gold)" : "oklch(0.85 0.02 70)" }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Main component ── */

function flattenValues(values: FormValues): Record<string, string> {
  const formData: Record<string, string> = {};
  for (const [name, value] of Object.entries(values)) {
    if (value instanceof File) continue;
    if (Array.isArray(value)) {
      if (value.length) formData[name] = value.join(", ");
    } else if (value !== undefined) {
      formData[name] = value;
    }
  }
  return formData;
}

export default function ClientIntakeForm() {
  const [active, setActive] = useState(0);
  const [reviewing, setReviewing] = useState(false);
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
        const res = await fetch("/api/client-intake", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formData: flattenValues(values),
            files: [],
            sourceUrl: window.location.href,
          }),
        });
        const result = await res.json().catch(() => ({ ok: res.ok }));
        if (!res.ok || result.ok === false) throw new Error(result.error || "Submission failed");
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        setError(err instanceof Error && err.message ? err.message : "Something went wrong submitting your application. Please try again or email us directly.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  async function goToStep(target: number) {
    if (target > active) {
      const errors = await formik.validateForm();
      const stepErrorFields = STEP_FIELDS[active].filter((name) => errors[name]);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function proceedToReview() {
    const errors = await formik.validateForm();
    const stepErrorFields = STEP_FIELDS[active].filter((name) => errors[name]);
    if (stepErrorFields.length) {
      const touched = { ...formik.touched };
      stepErrorFields.forEach((name) => {
        touched[name] = true;
      });
      formik.setTouched(touched);
      return;
    }
    setReviewing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-5">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
          style={{ background: "linear-gradient(135deg, var(--gold), oklch(0.62 0.18 75))" }}
        >
          <Check size={32} stroke="white" strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
          Application Received
        </h2>
        <p
          className="text-base leading-relaxed mb-8"
          style={{ color: "oklch(0.45 0.02 50)", fontFamily: "var(--font-body)" }}
        >
          Thank you for completing the BioChain Sourcing client intake. We will review your
          organization and product needs and reach out to schedule your sourcing audit.
        </p>
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
          style={{ background: "oklch(0.72 0.15 75 / 0.12)", color: "oklch(0.45 0.12 70)" }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--gold)" }} />
          Submitted to RampRate BioChain Sourcing
        </div>
      </div>
    );
  }

  const meta = STEP_META[active];
  const Step = STEPS[active];
  const isLastFormStep = active === STEP_META.length - 1;

  return (
    <form name="client-intake" onSubmit={formik.handleSubmit} style={{ fontFamily: "var(--font-body)" }}>
      <input ref={honeypotRef} type="text" name="bot_field" tabIndex={-1} autoComplete="off" className="hidden" />

      {reviewing ? (
        <>
          <h2
            className="text-2xl sm:text-3xl font-bold mb-3"
            style={{ fontFamily: "var(--font-display)", color: "oklch(0.2 0.02 50)" }}
          >
            Review Your Application
          </h2>
          <p
            className="text-sm leading-relaxed mb-6"
            style={{ color: "oklch(0.45 0.02 50)", fontFamily: "var(--font-body)" }}
          >
            Check everything below before submitting. Click Edit on any section to make changes.
          </p>
          <ReviewSummary
            formik={formik}
            onEdit={(step) => {
              setReviewing(false);
              setActive(step);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </>
      ) : (
        <>
          <ProgressBar active={active} />
          <h2
            className="text-2xl sm:text-3xl font-bold mb-3"
            style={{ fontFamily: "var(--font-display)", color: "oklch(0.2 0.02 50)" }}
          >
            {meta.title}
          </h2>
          <Step formik={formik} />
        </>
      )}

      {error && (
        <p className="mt-6 text-sm font-medium" style={{ color: "oklch(0.55 0.2 25)" }}>
          {error}
        </p>
      )}

      <div className="flex justify-between items-center mt-8">
        <button
          type="button"
          onClick={() => (reviewing ? setReviewing(false) : goToStep(Math.max(0, active - 1)))}
          disabled={!reviewing && active === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all disabled:opacity-25 disabled:cursor-not-allowed hover:bg-[oklch(0.97_0.02_75)]"
          style={{ borderColor: "oklch(0.85 0.04 70)", color: "oklch(0.45 0.08 60)", fontFamily: "var(--font-body)" }}
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <span className="text-xs" style={{ color: "oklch(0.6 0.02 50)", fontFamily: "var(--font-body)" }}>
          {reviewing ? "Review" : `${active + 1} / ${STEP_META.length}`}
        </span>

        {reviewing ? (
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "oklch(0.4 0.1 60)", fontFamily: "var(--font-body)" }}
          >
            {submitting ? "Submitting…" : "Submit Application"}
          </button>
        ) : isLastFormStep ? (
          <button
            type="button"
            onClick={proceedToReview}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.01]"
            style={{ background: "var(--gold)", fontFamily: "var(--font-body)" }}
          >
            Review Application
            <ArrowRight size={14} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => goToStep(Math.min(STEP_META.length - 1, active + 1))}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.01]"
            style={{ background: "var(--gold)", fontFamily: "var(--font-body)" }}
          >
            Continue
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </form>
  );
}

export { TOTAL_MINUTES };
