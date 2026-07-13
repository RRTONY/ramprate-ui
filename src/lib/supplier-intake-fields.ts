export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "url"
  | "textarea"
  | "select"
  | "file"
  | "year-select"
  | "pricing-table";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
}

/**
 * Stage 1 - short, public, no uploads. Field set, order, and required
 * status match the unified two-stage form spec exactly.
 */
export const STAGE1_STEPS: FieldDef[][] = [
  [
    { key: "legal_entity_name", label: "Legal Entity Name", type: "text", required: true, placeholder: "Enter legal entity name" },
    { key: "state_country_of_incorporation", label: "State / Country of Incorporation", type: "text", required: true, placeholder: "Enter state or country of incorporation" },
    { key: "primary_contact_name", label: "Primary Contact Name", type: "text", required: true, placeholder: "Enter primary contact name" },
    { key: "email", label: "Email", type: "email", required: true, placeholder: "Enter email address" },
    { key: "phone", label: "Phone", type: "tel", required: false, placeholder: "Enter phone number" },
    { key: "website", label: "Website", type: "url", required: false, placeholder: "Enter website" },
  ],
  [
    { key: "current_peptide_products", label: "Current Peptide Products", type: "textarea", required: true, placeholder: "Enter current peptide products" },
    {
      key: "facility_type",
      label: "Facility Type",
      type: "select",
      required: true,
      options: ["Own Manufacturing", "Contract Manufacturer (CMO)", "Hybrid (Own + CMO)", "White Label / Private Label"],
    },
    {
      key: "number_of_employees",
      label: "Number of Employees",
      type: "select",
      required: true,
      options: ["1–10", "11–50", "51–200", "201+"],
    },
    { key: "monthly_production_capacity", label: "Monthly Production Capacity", type: "text", required: false, placeholder: "Enter monthly production capacity" },
    {
      key: "chain_of_custody_capability",
      label: "Chain-of-Custody Capability",
      type: "select",
      required: true,
      options: ["Currently live", "Can implement on request", "Not currently capable"],
      helpText: "Can you support lot-level tracking (QR code or blockchain-anchored) from synthesis through delivery?",
    },
    {
      key: "pricing_model",
      label: "Pricing Model",
      type: "select",
      required: true,
      options: ["Per Unit", "Tiered Volume Pricing", "Annual Contract", "Custom-Negotiable"],
    },
  ],
  [
    {
      key: "standard_lead_time",
      label: "Standard Lead Time",
      type: "select",
      required: true,
      options: ["Under 2 weeks", "2–4 weeks", "4–8 weeks", "8+ weeks"],
    },
    {
      key: "minimum_order_quantity",
      label: "Minimum Order Quantity (MOQ)",
      type: "select",
      required: true,
      options: ["No minimum", "Small (under $5K)", "Moderate ($5K–$25K)", "Large ($25K+)"],
    },
    {
      key: "independent_testing_willingness",
      label: "Independent Testing Willingness",
      type: "select",
      required: true,
      options: ["Yes, ongoing", "Yes, one-time per new listing", "No"],
      helpText: "Willing to have batches independently tested by a lab of the marketplace's choosing, separate from your own COA process?",
    },
    {
      key: "facility_classification",
      label: "Facility Classification",
      type: "select",
      required: true,
      options: ["FDA Registered", "cGMP Certified", "ISO 13485/9001", "503B", "503A", "Other"],
    },
    {
      key: "product_labeling_sale_restrictions",
      label: "Product Labeling & Sale Restrictions",
      type: "select",
      required: true,
      options: ["Research-Use-Only", "Compounded Pharmacy", "Both, depending on product"],
    },
    {
      key: "recall_capa_history",
      label: "Recall / CAPA History",
      type: "select",
      required: true,
      options: ["No recalls or CAPAs", "Minor CAPAs resolved", "Active CAPA in progress", "Recall history (disclose)"],
    },
  ],
];

export const STAGE1_FIELDS: FieldDef[] = STAGE1_STEPS.flat();

/** The 9 fields that carry scoring weight - keys must match scoring_rules.json / field_mapping.json exactly. */
export const SCORING_FIELD_CEILINGS: Record<string, number> = {
  chain_of_custody_capability: 10,
  pricing_model: 10,
  standard_lead_time: 7,
  minimum_order_quantity: 7,
  independent_testing_willingness: 5,
  facility_classification: 5,
  product_labeling_sale_restrictions: 5,
  recall_capa_history: 5,
  testing_protocols: 5, // Stage 2 mass-spec keyword bonus
};

export const SCORING_CEILING = Object.values(SCORING_FIELD_CEILINGS).reduce((a, b) => a + b, 0); // 59

/**
 * Stage 2 - long, link-gated deep-dive. Sent only after a Stage 1 lead is
 * qualified. Grouped to match the 6-tab pattern, minus fields promoted to
 * Stage 1, minus the linkedin field (redundant with website), with
 * ownership/principals and batch fields each merged into one field.
 */
export const STAGE2_STEPS: FieldDef[][] = [
  [
    { key: "dba_name", label: "DBA / Trade Name", type: "text", required: false, placeholder: "Enter DBA or trade name" },
    { key: "year_founded", label: "Year Founded", type: "year-select", required: true },
    { key: "headquarters_address", label: "Headquarters Address", type: "text", required: true, placeholder: "Enter headquarters address" },
    { key: "manufacturing_facility_address", label: "Manufacturing Facility Address", type: "text", required: false, placeholder: "Enter manufacturing facility address" },
    { key: "contact_title", label: "Title / Role", type: "text", required: true, placeholder: "Enter title or role" },
    {
      key: "ownership_principals",
      label: "Ownership & Principals / Founders",
      type: "textarea",
      required: true,
      placeholder: "Enter ownership and principals / founders",
    },
  ],
  [
    {
      key: "peptide_synthesis_method",
      label: "Peptide Synthesis Method",
      type: "select",
      required: true,
      options: ["Solid Phase (SPPS)", "Liquid Phase", "Hybrid", "Contract Synthesis (third-party)"],
    },
    { key: "purity_levels_achieved", label: "Purity Levels Achieved", type: "text", required: true, placeholder: "Enter purity levels achieved" },
    {
      key: "sterile_fill_capability",
      label: "Sterile Fill Capability",
      type: "select",
      required: true,
      options: ["Yes - In-house", "Yes - Contract", "In Development", "No"],
    },
    { key: "cold_chain_storage_capabilities", label: "Cold Chain / Storage Capabilities", type: "textarea", required: false, placeholder: "Enter cold chain / storage capabilities" },
  ],
  [
    {
      key: "quality_management_system",
      label: "Quality Management System",
      type: "select",
      required: true,
      options: ["ISO 9001:2015", "cGMP (FDA 21 CFR)", "Both ISO + cGMP", "Internal QMS only", "None"],
    },
    {
      key: "third_party_testing",
      label: "Third-Party Testing",
      type: "select",
      required: true,
      options: ["All batches", "Representative samples only", "On request only", "None currently"],
    },
    { key: "testing_lab_name", label: "Testing Lab Name", type: "text", required: true, placeholder: "Enter testing lab name" },
    { key: "coa_lot_batch_specific", label: "COA Lot/Batch-Specific?", type: "select", required: true, options: ["Yes", "No"] },
    { key: "coa_publicly_viewable", label: "COA Publicly Viewable Before Purchase?", type: "select", required: true, options: ["Yes", "No"] },
    { key: "coa_public_link", label: "COA Public Link", type: "url", required: true, placeholder: "Enter COA public link" },
    { key: "identity_confirmation_method", label: "Identity Confirmation Method", type: "text", required: true, placeholder: "Enter identity confirmation method" },
    {
      key: "testing_protocols",
      label: "Testing Protocols",
      type: "textarea",
      required: true,
      placeholder: "Enter testing protocols",
    },
    {
      key: "stability_testing_program",
      label: "Stability Testing Program",
      type: "select",
      required: true,
      options: ["ICH guidelines", "Accelerated only", "Real-time only", "None"],
    },
    {
      key: "batch_documentation",
      label: "Batch Documentation",
      type: "textarea",
      required: true,
      placeholder: "Enter batch documentation",
    },
  ],
  [
    {
      key: "payment_terms",
      label: "Payment Terms",
      type: "select",
      required: true,
      options: ["Net 30", "Net 60", "50% upfront / 50% on delivery", "100% upfront", "Other"],
    },
    { key: "existing_distribution_channels", label: "Existing Distribution Channels", type: "textarea", required: false, placeholder: "Enter existing distribution channels" },
    { key: "references", label: "References", type: "textarea", required: true, placeholder: "Enter references" },
    {
      key: "pricing_for_top_compounds",
      label: "Pricing for Top Compounds",
      type: "pricing-table",
      required: true,
      helpText: "List pricing for your top 3–5 volume compounds (compound, unit size, price per unit, MOQ tier).",
    },
    { key: "full_price_list_catalog", label: "Full Price List / Catalog", type: "file", required: false, helpText: "Upload your complete pricing sheet if you'd like the marketplace to consider your full catalog for future RFPs." },
  ],
  [
    { key: "fda_registration_number", label: "FDA Registration Number", type: "text", required: false, placeholder: "Enter FDA registration number" },
    {
      key: "dea_registration",
      label: "DEA Registration",
      type: "select",
      required: true,
      options: ["Yes - Schedule III", "Yes - Schedule IV", "Yes - Schedule V", "In Progress", "No"],
    },
    { key: "state_licenses", label: "State Licenses", type: "textarea", required: false, placeholder: "Enter state licenses" },
    {
      key: "buyer_eligibility",
      label: "Buyer Eligibility",
      type: "select",
      required: true,
      options: ["Institutional/researcher only", "Clinics only", "Clinics and individuals", "All accounts"],
    },
    { key: "shipping_jurisdictions", label: "Shipping Jurisdictions", type: "text", required: true, placeholder: "Enter shipping jurisdictions" },
    { key: "last_fda_inspection_date", label: "Last FDA Inspection Date", type: "text", required: false, placeholder: "Enter last FDA inspection date" },
    {
      key: "fda_inspection_outcome",
      label: "FDA Inspection Outcome",
      type: "select",
      required: false,
      options: ["No Action Indicated (NAI)", "Voluntary Action Indicated (VAI)", "Official Action Indicated (OAI)", "Never Inspected"],
    },
    { key: "manufacturing_certifications", label: "Manufacturing Certifications", type: "textarea", required: false, placeholder: "Enter manufacturing certifications" },
    { key: "warning_letters_regulatory_disclosure", label: "Warning Letters / Regulatory Disclosure", type: "textarea", required: false, placeholder: "Enter warning letters or regulatory disclosure" },
    { key: "insurance_coverage", label: "Insurance Coverage", type: "textarea", required: true, placeholder: "Enter insurance coverage" },
  ],
  [
    { key: "doc_coa", label: "Certificate of Analysis (COA)", type: "file", required: true, helpText: "Most recent batch COA for primary peptide product" },
    { key: "doc_cgmp_quality_certification", label: "cGMP / Quality Certification", type: "file", required: true, helpText: "Current cGMP, ISO, or equivalent certification" },
    { key: "doc_fda_registration", label: "FDA Registration Documentation", type: "file", required: false, helpText: "FDA establishment registration confirmation" },
    { key: "doc_certificate_of_insurance", label: "Certificate of Insurance", type: "file", required: true, helpText: "Current product liability insurance certificate" },
    { key: "doc_sample_sop", label: "Sample SOP Document", type: "file", required: false, helpText: "A representative Standard Operating Procedure" },
    { key: "doc_additional_documentation", label: "Additional Documentation", type: "file", required: false, helpText: "Product catalog, company deck, or supporting materials" },
  ],
];

export const STAGE2_FIELDS: FieldDef[] = STAGE2_STEPS.flat();

// Derived, not hardcoded - stays correct as fields change (fixes the stale
// footer-count bug: the old counts drifted from the real field list because
// they were manually typed constants).
export const STAGE1_TOTAL_FIELD_COUNT = STAGE1_FIELDS.length;
export const STAGE1_REQUIRED_FIELD_COUNT = STAGE1_FIELDS.filter((f) => f.required).length;
export const STAGE2_TOTAL_FIELD_COUNT = STAGE2_FIELDS.length;
export const STAGE2_REQUIRED_FIELD_COUNT = STAGE2_FIELDS.filter((f) => f.required).length;

// Backward-compatible aliases for the pre-two-stage single-form counts.
export const TOTAL_FIELD_COUNT = STAGE1_TOTAL_FIELD_COUNT + STAGE2_TOTAL_FIELD_COUNT;
export const REQUIRED_FIELD_COUNT = STAGE1_REQUIRED_FIELD_COUNT + STAGE2_REQUIRED_FIELD_COUNT;
