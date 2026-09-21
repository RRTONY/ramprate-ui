import * as Yup from "yup";

// Keep in sync by hand with BUDGET_CATEGORIES in
// scripts/active-pharm-intake-apps-script.gs - fixed order/count so the
// destination Sheet's columns stay stable across submissions.
export const BUDGET_CATEGORIES = [
  "Compounding pharmacy / fulfillment (503A/503B) fees",
  "APIs, peptides & other active raw materials",
  "Excipients & other formulation ingredients",
  "Third-party testing & quality control (QC/QA labs)",
  "Packaging & labeling",
  "Cold chain, freight & 3PL / fulfillment logistics",
  "Genomic / DNA / pharmacogenomic testing",
  "Clinical research (CRO), blend validation & regulatory consulting",
  "Device & device-component manufacturing",
  "Internal supply chain / quality staff (only if targeted for outsource)",
  "Other (please specify)",
];

// Matches the spreadsheet's own "Lookup Tables" tab ("Supplier Category
// (Tab 1b, column C)") exactly, including the three-way "Other" split - the
// original Claude prototype this page was built from used a single generic
// "Other" instead, which didn't match the spreadsheet that's actually
// authoritative here (confirmed by reading the Lookup Tables tab directly).
export const SUPPLIER_CATEGORY_OPTIONS = [
  "Compounding Pharmacy - 503A",
  "Compounding Pharmacy - 503B",
  "APIs & Peptide Manufacturing",
  "Excipients & Formulation Ingredients",
  "Third-Party Testing & QC Labs",
  "Packaging & Labeling",
  "Cold Chain / 3PL & Fulfillment",
  "Genomic / DNA / PGx Testing",
  "Clinical Research (CRO) & Regulatory Consulting",
  "Device & Device-Component Manufacturing",
  "Distribution / Wholesale",
  "Other - APIs / Raw Materials",
  "Other - Testing / Packaging / Logistics",
  "Other - Clinical / Regulatory / Genomic Services",
];

// The "other" row is the 7th ranking option on Tab 1a's real priorities
// question - missing from the original Claude prototype (which only had the
// first six), added back to match the spreadsheet. It renders with an
// editable label (see priorities.otherLabel below) instead of a fixed one.
export const PRIORITY_ITEMS = [
  { key: "cost", label: "Cost reduction", def: 6 },
  { key: "capacity", label: "Adding licensed capacity in underserved states", def: 8 },
  { key: "diversify", label: "Diversifying / de-risking API and raw-material sourcing", def: 7 },
  { key: "quality", label: "Supplier quality & regulatory compliance", def: 8 },
  { key: "speed", label: "Speed to onboard new suppliers or product lines", def: 6 },
  { key: "flexibility", label: "Improved contract flexibility / reduced risk", def: 5 },
  { key: "other", label: "Other (please specify)", def: 5 },
] as const;

export const GROWTH_BASIS_OPTIONS = ["Firm requirement", "Projection"];
export const YES_NO_UNDER_OPTIONS = ["Yes", "No", "Under discussion"];
export const YES_NO_OPTIONS = ["Yes", "No"];
export const RENEWAL_OPTIONS = ["Yes", "No", "Under review", "Unknown"];

export interface SupplierEntry {
  name: string;
  category: string;
  spend: string;
  geography: string;
  states: string;
  startDate: string;
  endDate: string;
  renewal: string;
  owner: string;
  certifications: string;
  pendingChanges: string;
  notes: string;
}

export const EMPTY_SUPPLIER: SupplierEntry = {
  name: "",
  category: "",
  spend: "",
  geography: "",
  states: "",
  startDate: "",
  endDate: "",
  renewal: "",
  owner: "",
  certifications: "",
  pendingChanges: "",
  notes: "",
};

export interface GrowthRowEntry {
  geography: string;
  category: string;
  product: string;
  currentVolume: string;
  desiredVolume: string;
  basis: string;
  targetDate: string;
  canFlex: string;
  notes: string;
}

export const EMPTY_GROWTH_ROW: GrowthRowEntry = {
  geography: "",
  category: "",
  product: "",
  currentVolume: "",
  desiredVolume: "",
  basis: "",
  targetDate: "",
  canFlex: "",
  notes: "",
};

export interface ActivePharmFormValues {
  respondent: { name: string; email: string; phone: string };
  budget: {
    centralTotal: string;
    decentralTotal: string;
    categories: { amount: string; notes: string }[];
  };
  priorities: {
    initiatives: string;
    savingsUse: string;
    ranks: Record<string, number>;
    otherLabel: string;
  };
  suppliers: SupplierEntry[];
  growth: {
    isDriver: string;
    driverDescription: string;
    rows: GrowthRowEntry[];
    hasSeparateBudget: string;
    budgetAmount: string;
    budgetPeriod: string;
  };
  confirmAccurate: boolean;
}

export const INITIAL_VALUES: ActivePharmFormValues = {
  respondent: { name: "", email: "", phone: "" },
  budget: {
    centralTotal: "",
    decentralTotal: "",
    categories: BUDGET_CATEGORIES.map(() => ({ amount: "", notes: "" })),
  },
  priorities: {
    initiatives: "",
    savingsUse: "",
    ranks: Object.fromEntries(PRIORITY_ITEMS.map((p) => [p.key, p.def])),
    otherLabel: "",
  },
  suppliers: [{ ...EMPTY_SUPPLIER }],
  growth: {
    isDriver: "",
    driverDescription: "",
    rows: [],
    hasSeparateBudget: "",
    budgetAmount: "",
    budgetPeriod: "",
  },
  confirmAccurate: false,
};

export const STEP_NAMES = [
  "Respondent & budget",
  "Priorities",
  "Supplier inventory",
  "Growth & capacity expansion",
  "Review & submit",
];

export const STEP_SUBS = [
  "Who you are, and the size of the pie",
  "What matters most right now",
  "Pharmacies, API sources, labs & more",
  "Only if it applies to this engagement",
  "Check it over, send it in",
];

export const validationSchema = Yup.object().shape({
  respondent: Yup.object().shape({
    name: Yup.string().required("Name & title is required"),
    email: Yup.string().email("Enter a valid email").required("Email is required"),
    phone: Yup.string(),
  }),
  growth: Yup.object().shape({
    isDriver: Yup.string(),
    driverDescription: Yup.string(),
    hasSeparateBudget: Yup.string(),
    budgetAmount: Yup.string(),
    budgetPeriod: Yup.string(),
  }),
  confirmAccurate: Yup.boolean().oneOf(
    [true],
    "Please confirm the information above is accurate before submitting.",
  ),
});

// Keys checked before allowing "Continue" from each step (index-matched to
// STEP_NAMES). Empty array = no required-field gate on that step.
export const STEP_GATE_KEYS = [
  ["respondent.name", "respondent.email"],
  [],
  [],
  [],
  ["confirmAccurate"],
];
