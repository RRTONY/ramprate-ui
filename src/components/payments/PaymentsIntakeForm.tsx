"use client";

import { useState } from "react";
import { useFormik, type FormikProps } from "formik";
import * as Yup from "yup";
import { Check, ArrowLeft, ArrowRight, Download } from "lucide-react";
import { PAYMENTS_INDUSTRIES, PAYMENTS_SECTIONS } from "@/lib/payments-advisory-data";
import PhoneInput from "@/components/shared/PhoneInput";

const inp = `w-full px-4 py-3 rounded-xl border border-black/8 bg-white/80 text-sm text-[oklch(0.2_0.02_50)] placeholder:text-black/30 outline-none transition-all duration-200 focus:border-[var(--gold)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(212,168,67,0.12)]`;
const ta = `${inp} resize-y min-h-[100px]`;
const sel = `${inp} appearance-none cursor-pointer`;
const lbl = `block text-[11px] font-semibold tracking-[0.16em] uppercase mb-2`;
const fw = `flex flex-col`;
const req = <span style={{ color: "var(--gold)" }}> *</span>;
const labelColor = "oklch(0.52 0.12 70)";

type FormValues = Record<string, string | undefined>;

const HOW_HEARD_OPTIONS = ["Referral from colleague", "LinkedIn", "Google Search", "Industry event", "Existing client referral", "Press / Media", "Direct outreach from RampRate", "Other"];
const NDA_OPTIONS = ["Yes — please send your NDA", "Yes — we have our own NDA to share", "No — comfortable proceeding without", "Mutual NDA preferred"];
const LEGAL_STRUCTURE_OPTIONS = ["LLC", "C-Corp", "S-Corp", "Partnership", "Sole Proprietor", "Non-Profit", "Public Company"];
const CUSTOMER_TYPE_OPTIONS = ["B2C — consumers", "B2B — businesses", "B2B2C — both", "Government / Public sector", "Non-profit beneficiaries"];
const DECISION_ROLE_OPTIONS = ["Final decision maker", "Key influencer — board/exec approves", "Evaluating on behalf of finance team", "IT / Technical lead", "Procurement / Sourcing lead", "Consultant representing client"];
const PAIN_POINT_OPTIONS = ["High rates / opaque pricing", "Low approval rates", "Poor customer support", "Slow settlement", "Holds / reserves", "Chargeback losses", "No international capability", "Technical / integration issues", "Lack of reporting / analytics", "Multiple of the above", "N/A — first-time merchant account"];
const SWITCH_REASON_OPTIONS = ["Cost reduction", "Better approval rates", "Better support & relationship", "International expansion", "Redundancy / risk management", "Current processor exiting our category", "Board / investor directive", "Consolidating multiple processors", "Proactive benchmarking — not unhappy", "Forced — termination or hold"];
const TERMINATION_OPTIONS = ["No", "Yes — will explain in notes"];
const API_INTEGRATION_OPTIONS = ["Full API team — can build any integration", "External dev resources available", "Limited — prefer hosted payment pages / iframes", "No technical capacity — need turnkey solution"];
const MOBILE_PAYMENTS_OPTIONS = ["Yes — iOS and Android SDKs", "Yes — iOS only", "Yes — Android only", "Mobile web only (no native app)", "No"];
const RECURRING_BILLING_OPTIONS = ["Yes — core business", "Yes — secondary revenue stream", "No", "On the roadmap"];
const SUBSCRIPTION_MODEL_OPTIONS = ["SaaS — monthly/annual seats", "D2C subscription box", "Membership / community", "Usage-based / metered", "Hybrid (one-time + recurring)", "N/A"];
const ORCHESTRATION_NEED_OPTIONS = ["Yes — required", "Yes — actively evaluating", "No — single processor fine", "Not sure — educate me"];
const ORCHESTRATION_GOAL_OPTIONS = ["Maximize approval rates", "Cost optimization", "Processor redundancy / failover", "Geographic / currency routing", "Intelligent retry logic", "All of the above", "N/A"];
const REDUNDANCY_OPTIONS = ["Yes — minimum 2 active processors", "Yes — 3 or more", "No — acceptable risk", "Nice to have, not required"];
const TOKENIZATION_OPTIONS = ["Active — Visa/MC network tokens", "In progress", "Not yet — interested", "Don't know what this is"];
const PCI_COMPLIANT_OPTIONS = ["Yes — current attestation", "No — non-compliant", "In progress", "Not sure"];
const PCI_LEVEL_OPTIONS = ["SAQ A (redirected / iFrame)", "SAQ A-EP (script injection)", "SAQ B (dial-up terminals)", "SAQ C (payment app)", "SAQ D (full cardholder data)", "Level 1 — QSA audit required"];
const BREACH_OPTIONS = ["No", "Yes — disclosed to card brands", "Yes — occurred, investigation ongoing"];
const AML_OPTIONS = ["Yes — bank-grade", "Yes — basic / policy only", "No — not required for our model", "Unsure"];
const KYC_OPTIONS = ["Yes — automated (API)", "Yes — manual review", "Partial — select transactions", "No — B2B only / not applicable"];
const LOCAL_ACQUIRING_OPTIONS = ["Yes — EU / EEA", "Yes — UK", "Yes — APAC", "Yes — LATAM", "Yes — multiple regions", "No — US domestic only", "Not sure"];
const CB_TREND_OPTIONS = ["Stable — consistent for 12+ months", "Improving — trending down", "Worsening — trending up", "Seasonal — varies significantly", "N/A — new merchant"];
const THREE_DS_OPTIONS = ["Yes — on all transactions", "Yes — on high-risk only", "No", "Evaluating", "Required by our market (EU PSD2)"];
const RISK_TOLERANCE_OPTIONS = ["Conservative — minimize fraud above conversion impact", "Balanced — optimize approval rate vs. fraud loss", "Growth-first — maximize conversions, accept some fraud", "Depends on product / channel"];
const CB_DISPUTE_OPTIONS = ["Fully in-house — dedicated team", "In-house but under-resourced", "Outsourced — existing supplier", "No formal process — need help", "Using processor's built-in tools"];
const PRICING_MODEL_OPTIONS = ["Interchange Plus — transparent cost-plus (recommended at $50M+)", "Flat Rate — predictable, slightly higher", "Membership / Subscription (Stax-style) — fixed monthly + interchange", "Tiered — common but rarely favorable", "No preference — show me the analysis"];
const CONTRACT_LENGTH_OPTIONS = ["Month-to-month (maximum flexibility)", "1 year", "2 years", "3 years — willing for the right deal", "Open to negotiation"];
const ANNUAL_REVIEW_OPTIONS = ["Yes — annual review clause is non-negotiable", "Yes — preferred but flexible", "No — happy to lock in for contract term", "Depends on rate lock guarantee"];
const RESERVE_OPTIONS = ["Yes", "No — hard no", "Depends on % and duration", "Not sure what this is"];
const TIMELINE_OPTIONS = ["ASAP — 30 days or less", "60 days", "90 days", "6 months", "Exploring — no hard deadline"];
const REVIEW_CADENCE_OPTIONS = ["Monthly business reviews (MBR)", "Quarterly business reviews (QBR)", "Semi-annual", "Annual only", "Ad hoc — contact us when needed"];
const CO_MARKETING_OPTIONS = ["Yes — open to being a reference client", "Yes — case study only, no press", "No — prefer confidentiality", "Discuss post-launch"];

const requiredStr = () => Yup.string().required("Required");

const validationSchema = Yup.object().shape({
  annualRevenue: requiredStr(),
  companyName: requiredStr(),
  website: requiredStr(),
  ownerName: requiredStr(),
  ownerTitle: requiredStr(),
  ownerEmail: Yup.string().email("Invalid email").required("Required"),
  industry: requiredStr(),
  businessDescription: requiredStr(),
  currentMonthlyVolume: requiredStr(),
  avgTicketSize: requiredStr(),
  countries: requiredStr(),
});

const STEP_MINUTES = [2, 3, 2, 2, 2, 2, 2];
const STEP_FIELDS: string[][] = [
  ["annualRevenue", "companyName", "website", "ownerName", "ownerTitle", "ownerEmail", "ownerPhone", "howHeard", "referredBy", "ndaRequired"],
  ["ein", "yearFounded", "legalStructure", "industry", "primaryCustomerType", "geographicMarkets", "decisionRole", "painWithCurrent", "businessDescription", "growthPlans"],
  ["currentMonthlyVolume", "projectedMonthlyVolume", "avgTicketSize", "highestTicket", "cardMixCredit", "currentProcessor", "secondaryProcessor", "processingHistory", "switchReason", "hasTermination", "terminationReason"],
  ["currentGateway", "gatewayContracts", "ecommerceCart", "posSystem", "apiIntegration", "mobilePayments", "recurringBilling", "subscriptionModel", "needsOrchestration", "orchestrationGoal", "redundancy", "tokenization"],
  ["pciCompliant", "pciLevel", "lastAudit", "hasBreach", "amlProgram", "kycProgram", "countries", "currencies", "foreignCardPercent", "localAcquiring", "restrictedCategories", "regulatoryLicenses"],
  ["chargebackRate", "chargebackTrend", "fraudToolCurrent", "fraudBudget", "threeDSEnabled", "riskToleranceLevel", "chargebackDisputes", "cbMgmtSupplier"],
  ["pricingModel", "contractLength", "eTermFeeOK", "reserveAcceptable", "reservePercent", "switchTimeline", "reviewCadence", "coMarketingInterest", "partnershipPriorities", "additionalNotes"],
];

function FieldError({ formik, name }: { formik: FormikProps<FormValues>; name: string }) {
  const message = formik.touched[name] && formik.errors[name];
  if (!message) return null;
  return (
    <p className="mt-1 text-[11px] font-medium" style={{ color: "oklch(0.55 0.2 25)" }}>
      {String(message)}
    </p>
  );
}

function Advisory({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded px-3 py-2 mb-2 text-[11px] leading-relaxed border-l-2"
      style={{ background: "oklch(0.97 0.03 75)", borderColor: "var(--gold)", color: "oklch(0.4 0.03 55)" }}
    >
      <strong>RampRate Advisory:</strong> {children}
    </div>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] mb-1.5 leading-snug" style={{ color: "oklch(0.55 0.02 50)" }}>
      {children}
    </p>
  );
}

interface FieldExtras {
  hint?: React.ReactNode;
  advisory?: React.ReactNode;
  required?: boolean;
  full?: boolean;
}

function TextField({
  formik,
  name,
  label,
  type = "text",
  placeholder,
  hint,
  advisory,
  required,
  full,
}: FieldExtras & {
  formik: FormikProps<FormValues>;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className={`${fw} ${full ? "sm:col-span-2" : ""}`}>
      <label className={lbl} style={{ color: labelColor }}>
        {label}
        {required && req}
      </label>
      {hint && <Hint>{hint}</Hint>}
      {advisory && <Advisory>{advisory}</Advisory>}
      {type === "tel" ? (
        <PhoneInput
          name={name}
          value={(formik.values[name] as string) ?? ""}
          onChange={(next) => formik.setFieldValue(name, next)}
          onBlur={() => formik.setFieldTouched(name, true)}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={formik.values[name] ?? ""}
          onChange={formik.handleChange}
          placeholder={placeholder}
          className={inp}
        />
      )}
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
  hint,
  advisory,
  required,
  full,
}: FieldExtras & {
  formik: FormikProps<FormValues>;
  name: string;
  label: string;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div className={`${fw} ${full ? "sm:col-span-2" : ""}`}>
      <label className={lbl} style={{ color: labelColor }}>
        {label}
        {required && req}
      </label>
      {hint && <Hint>{hint}</Hint>}
      {advisory && <Advisory>{advisory}</Advisory>}
      <select name={name} value={formik.values[name] ?? ""} onChange={formik.handleChange} className={sel}>
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
  hint,
  advisory,
  required,
}: FieldExtras & {
  formik: FormikProps<FormValues>;
  name: string;
  label: string;
  placeholder?: string;
}) {
  return (
    <div className={`${fw} sm:col-span-2`}>
      <label className={lbl} style={{ color: labelColor }}>
        {label}
        {required && req}
      </label>
      {hint && <Hint>{hint}</Hint>}
      {advisory && <Advisory>{advisory}</Advisory>}
      <textarea
        name={name}
        value={formik.values[name] ?? ""}
        onChange={formik.handleChange}
        placeholder={placeholder}
        className={ta}
      />
      <FieldError formik={formik} name={name} />
    </div>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="sm:col-span-2 rounded-lg px-5 py-4 text-sm leading-relaxed border-l-4"
      style={{ background: "oklch(0.97 0.02 75)", borderColor: "var(--gold)", color: "oklch(0.4 0.03 55)" }}
    >
      {children}
    </div>
  );
}

interface StepProps {
  formik: FormikProps<FormValues>;
}

function Step0({ formik }: StepProps) {
  const revenue = Number(formik.values.annualRevenue || 0);
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <Callout>
        We are at capacity and prioritize engagements by processing volume,
        complexity, and long-term partnership fit. This is not a commodity
        brokerage — we build multi-year supplier relationships. You fill out
        this intake. RampRate authors your RFP, shops it, and negotiates for
        you. A team member reviews every submission before we engage.
      </Callout>
      <TextField
        formik={formik}
        name="annualRevenue"
        label="Annual Revenue (USD)"
        type="number"
        required
        placeholder="e.g. 75000000"
        hint="Minimum $1M to qualify. We actively seek $50M+ merchants."
        advisory="We ask revenue first — not to gatekeep, but because it determines which processors are viable for your volume. A $2M merchant and a $200M merchant have entirely different leverage and processor options."
      />
      <TextField formik={formik} name="companyName" label="Legal Company Name" required placeholder="Acme Commerce Inc." />
      <TextField formik={formik} name="website" label="Website" required placeholder="https://acme.com" />
      <TextField formik={formik} name="ownerName" label="Primary Contact Name" required placeholder="Jane Smith" />
      <TextField formik={formik} name="ownerTitle" label="Title" required placeholder="CFO / VP Finance / CEO / Controller" />
      <TextField formik={formik} name="ownerEmail" label="Contact Email" type="email" required placeholder="jane@acme.com" />
      <TextField formik={formik} name="ownerPhone" label="Contact Phone" type="tel" placeholder="(310) 555-0100" />
      <SelectField formik={formik} name="howHeard" label="How Did You Hear About RampRate?" options={HOW_HEARD_OPTIONS} />
      <TextField formik={formik} name="referredBy" label="Referred By (if applicable)" placeholder="Name and company of referrer" />
      <SelectField
        formik={formik}
        name="ndaRequired"
        label="NDA Required Before Proceeding?"
        options={NDA_OPTIONS}
        advisory="We routinely sign NDAs before reviewing processor history and rate sheets. Flag this now so we can expedite."
        full
      />
      {formik.values.annualRevenue && revenue < 1000000 && (
        <div
          className="sm:col-span-2 rounded-lg px-4 py-3 text-sm"
          style={{ background: "oklch(0.94 0.06 25)", border: "1px solid oklch(0.82 0.1 25)", color: "oklch(0.45 0.15 25)" }}
        >
          Your stated revenue is below our $1M minimum. We may still be able
          to refer you to appropriate resources — continue completing the
          form and a team member will follow up.
        </div>
      )}
    </div>
  );
}

function Step1({ formik }: StepProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <TextField formik={formik} name="ein" label="EIN / Tax ID" placeholder="XX-XXXXXXX" hint="Required for processor applications — safe to share at this stage." />
      <TextField formik={formik} name="yearFounded" label="Year Founded" type="number" placeholder="2018" />
      <SelectField formik={formik} name="legalStructure" label="Legal Structure" options={LEGAL_STRUCTURE_OPTIONS} />
      <SelectField formik={formik} name="industry" label="Primary Industry" required options={PAYMENTS_INDUSTRIES.map((i) => i.label)} />
      <SelectField formik={formik} name="primaryCustomerType" label="Primary Customer Type" options={CUSTOMER_TYPE_OPTIONS} />
      <TextField formik={formik} name="geographicMarkets" label="Geographic Markets" placeholder="e.g. US, Canada, UK, EU, APAC..." hint="Where your customers are — not just where you're incorporated." />
      <SelectField
        formik={formik}
        name="decisionRole"
        label="Your Role in This Decision"
        options={DECISION_ROLE_OPTIONS}
        advisory="Knowing your role helps us prepare the right materials — a technical brief for your CTO, a savings analysis for your CFO, or a risk brief for your board. We tailor to whoever needs to say yes."
      />
      <SelectField
        formik={formik}
        name="painWithCurrent"
        label="Pain Points with Current Processor"
        options={PAIN_POINT_OPTIONS}
        advisory="This is the single most important question on this form. It tells us what to optimize for in the RFP and what disqualifying conditions to screen processors on."
      />
      <TextAreaField
        formik={formik}
        name="businessDescription"
        label="Business Description"
        required
        placeholder="What do you sell, to whom, how, and in what business model? Include revenue streams, subscription vs. one-time, physical vs. digital goods."
      />
      <TextAreaField
        formik={formik}
        name="growthPlans"
        label="Strategic Growth Plans (12-36 months)"
        placeholder="New markets, product lines, acquisition targets, volume ramp expectations, IPO timeline, international expansion..."
        advisory="We build supplier relationships around where you're going, not just where you are. A processor that's right for $50M may not be right for $200M. Tell us your trajectory."
      />
    </div>
  );
}

function Step2({ formik }: StepProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <TextField formik={formik} name="currentMonthlyVolume" label="Current Monthly Processing Volume" type="number" required placeholder="e.g. 8000000" hint="Total card volume in USD per month across all processors." />
      <TextField formik={formik} name="projectedMonthlyVolume" label="Projected Monthly Volume (12mo)" type="number" placeholder="e.g. 12000000" />
      <TextField formik={formik} name="avgTicketSize" label="Average Transaction Ticket" type="number" required placeholder="e.g. 150" hint="Average single transaction in USD. Drives interchange category." />
      <TextField formik={formik} name="highestTicket" label="Highest Single Transaction" type="number" placeholder="e.g. 25000" hint="Processors need to underwrite your maximum exposure per transaction." />
      <TextField
        formik={formik}
        name="cardMixCredit"
        label="Estimated Credit Card Mix %"
        type="number"
        placeholder="e.g. 65"
        hint="% of volume on credit cards vs. debit. Credit costs more; we negotiate by card type."
        advisory="Most merchants don't track this and leave significant savings on the table. If you don't know, say so — we'll pull it from your processor statements."
      />
      <TextField formik={formik} name="currentProcessor" label="Current Primary Processor" placeholder="e.g. Stripe, Worldpay, Chase..." />
      <TextField formik={formik} name="secondaryProcessor" label="Secondary Processor (if any)" placeholder="e.g. PayPal, Adyen... or None" />
      <TextField formik={formik} name="processingHistory" label="Years with Current Primary Processor" type="number" placeholder="e.g. 3" />
      <SelectField
        formik={formik}
        name="switchReason"
        label="Primary Reason for Switching / Evaluating"
        options={SWITCH_REASON_OPTIONS}
        advisory="Your reason for switching determines our negotiation posture and which processors will compete hardest for your business."
      />
      <SelectField formik={formik} name="hasTermination" label="Ever Terminated by a Processor?" options={TERMINATION_OPTIONS} />
      <TextAreaField
        formik={formik}
        name="terminationReason"
        label="Termination / Adverse History Context"
        placeholder="If yes above: processor name, approximate date, reason given, and what changed since. Honesty here protects you — we pre-screen so you don't waste time on processors who will decline anyway."
      />
    </div>
  );
}

function Step3({ formik }: StepProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <TextField formik={formik} name="currentGateway" label="Current Payment Gateway" placeholder="e.g. Authorize.net, NMI, Spreedly, direct..." />
      <TextField formik={formik} name="gatewayContracts" label="Gateway Contract End Date" type="date" hint="Early termination fees are common — we factor this into your switching cost analysis." />
      <TextField formik={formik} name="ecommerceCart" label="E-Commerce Platform / Cart" placeholder="e.g. Shopify, WooCommerce, Magento, Custom..." />
      <TextField formik={formik} name="posSystem" label="POS System (if applicable)" placeholder="e.g. Square, Toast, Clover, NCR..." />
      <SelectField
        formik={formik}
        name="apiIntegration"
        label="In-House API / Dev Capability"
        options={API_INTEGRATION_OPTIONS}
        advisory="This determines whether we scope a direct API integration, a gateway abstraction layer, or a no-code hosted solution. No wrong answer."
      />
      <SelectField formik={formik} name="mobilePayments" label="Mobile Payments Required?" options={MOBILE_PAYMENTS_OPTIONS} />
      <SelectField formik={formik} name="recurringBilling" label="Recurring / Subscription Billing?" options={RECURRING_BILLING_OPTIONS} />
      <SelectField formik={formik} name="subscriptionModel" label="Subscription Model Type" options={SUBSCRIPTION_MODEL_OPTIONS} />
      <SelectField
        formik={formik}
        name="needsOrchestration"
        label="Multi-Processor Orchestration Needed?"
        options={ORCHESTRATION_NEED_OPTIONS}
        advisory="At $50M+ volume, orchestration typically recovers 1-3% in approval rates and reduces cost by routing lower-interchange transactions to cheaper acquirers. We factor this into the savings model."
      />
      <SelectField formik={formik} name="orchestrationGoal" label="Primary Orchestration Goal" options={ORCHESTRATION_GOAL_OPTIONS} />
      <SelectField formik={formik} name="redundancy" label="Processor Redundancy Required?" options={REDUNDANCY_OPTIONS} />
      <SelectField
        formik={formik}
        name="tokenization"
        label="Network Tokenization Status"
        options={TOKENIZATION_OPTIONS}
        advisory="Visa Token Service and Mastercard MDES network tokens lift approval rates 2-5% at no incremental cost. If you're not using them, that's an immediate win we'll include in the RFP."
      />
    </div>
  );
}

function Step4({ formik }: StepProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <SelectField
        formik={formik}
        name="pciCompliant"
        label="PCI DSS Compliant?"
        options={PCI_COMPLIANT_OPTIONS}
        advisory="Non-compliance adds 0.2-0.5% to your effective processing rate through non-compliance fees. We include remediation costs in your total cost of ownership model."
      />
      <SelectField formik={formik} name="pciLevel" label="PCI SAQ / Level" options={PCI_LEVEL_OPTIONS} />
      <TextField formik={formik} name="lastAudit" label="Last PCI Audit / Attestation Date" type="date" />
      <SelectField
        formik={formik}
        name="hasBreach"
        label="Prior Data Breach?"
        options={BREACH_OPTIONS}
        advisory="Prior breaches are discoverable by processors. Flagging proactively with context is far better than having it surface during underwriting. We help you frame this."
      />
      <SelectField formik={formik} name="amlProgram" label="Active AML / BSA Program?" options={AML_OPTIONS} />
      <SelectField formik={formik} name="kycProgram" label="KYC / Customer Verification?" options={KYC_OPTIONS} />
      <TextField formik={formik} name="countries" label="Countries You Accept Payments From" required placeholder="e.g. USA, Canada, UK, EU, Australia..." hint="List all — not just where you're incorporated." />
      <TextField formik={formik} name="currencies" label="Currencies You Accept" placeholder="e.g. USD, EUR, GBP, CAD..." />
      <TextField
        formik={formik}
        name="foreignCardPercent"
        label="% of Volume from Non-US Issued Cards"
        type="number"
        placeholder="e.g. 35"
        advisory="Foreign card interchange is typically 1-1.5% higher than domestic. If this is significant, local acquiring in key markets can cut that cost substantially."
      />
      <SelectField formik={formik} name="localAcquiring" label="Local Acquiring Needed?" options={LOCAL_ACQUIRING_OPTIONS} />
      <TextAreaField
        formik={formik}
        name="restrictedCategories"
        label="Restricted / Regulated Product Categories"
        placeholder="List any products or services that may be considered high-risk, regulated, or restricted by card networks (e.g. supplements, age-restricted goods, recurring with free trials, etc.)"
        advisory="Being complete here prevents us from recommending processors who will decline or terminate you. High-risk is fine — we have relationships specifically for regulated categories."
      />
      <TextAreaField
        formik={formik}
        name="regulatoryLicenses"
        label="Industry Licenses & Registrations"
        placeholder="e.g. MTL in 48 states, FDA establishment registration, gaming commission license, SEC registration, FINRA membership..."
      />
    </div>
  );
}

function Step5({ formik }: StepProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <TextField
        formik={formik}
        name="chargebackRate"
        label="Current Chargeback Rate %"
        type="number"
        placeholder="e.g. 0.8"
        hint="% of transactions disputed. Visa threshold is 0.9%; Mastercard is 1.0%. Above these triggers monitoring programs."
        advisory="Chargeback rate is your single biggest processor underwriting risk factor. If you're above 0.5%, we prepare a chargeback remediation narrative for the RFP. If you're above 1%, we prioritize processors with dispute management capabilities."
      />
      <SelectField formik={formik} name="chargebackTrend" label="Chargeback Rate Trend" options={CB_TREND_OPTIONS} />
      <TextField formik={formik} name="fraudToolCurrent" label="Current Fraud Tool / Supplier" placeholder="e.g. Kount, Signifyd, Riskified, Stripe Radar, in-house rules engine, none..." />
      <TextField formik={formik} name="fraudBudget" label="Monthly Fraud & Risk Budget (USD)" type="number" placeholder="e.g. 15000" />
      <SelectField formik={formik} name="threeDSEnabled" label="3D Secure 2.0 (3DS2) Active?" options={THREE_DS_OPTIONS} />
      <SelectField
        formik={formik}
        name="riskToleranceLevel"
        label="Risk Tolerance Philosophy"
        options={RISK_TOLERANCE_OPTIONS}
        advisory="There is no universally correct answer. Conservative works for regulated industries; growth-first works for digital goods with low chargeback risk. We structure fraud tool RFP requirements around your philosophy."
      />
      <SelectField formik={formik} name="chargebackDisputes" label="Chargeback Dispute Management" options={CB_DISPUTE_OPTIONS} />
      <TextField formik={formik} name="cbMgmtSupplier" label="Current CB Management Supplier (if any)" placeholder="e.g. Chargebacks911, DisputeHelp, Ethoca, Verifi, none..." />
    </div>
  );
}

function Step6({ formik }: StepProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <Callout>
        RampRate&apos;s model is built on long-term supplier relationships —
        not one-time placements. The questions below help us match you with
        processors whose service model, contract structure, and account
        management approach fit your operating style for the next 3-5 years,
        not just your rates today.
      </Callout>
      <SelectField
        formik={formik}
        name="pricingModel"
        label="Pricing Model Preference"
        options={PRICING_MODEL_OPTIONS}
        advisory="At $50M+ volume, Interchange Plus saves an average of 0.4-0.8% vs. flat rate. We model all options for you."
      />
      <SelectField
        formik={formik}
        name="contractLength"
        label="Contract Length Preference"
        options={CONTRACT_LENGTH_OPTIONS}
        advisory="Longer contracts get better rates. We negotiate for annual rate review rights and exit clauses that protect you even in multi-year terms."
      />
      <SelectField
        formik={formik}
        name="eTermFeeOK"
        label="Annual Rate Review Rights Required?"
        options={ANNUAL_REVIEW_OPTIONS}
        advisory="This is one of our standard contract protections. Processors who won't allow annual reviews in 3-year deals are usually hiding rate creep."
      />
      <SelectField
        formik={formik}
        name="reserveAcceptable"
        label="Rolling Reserve Acceptable?"
        options={RESERVE_OPTIONS}
        hint="Processors hold 5-10% of monthly volume for 90-180 days as a risk buffer. Common for new or high-risk accounts."
      />
      <TextField formik={formik} name="reservePercent" label="Maximum Reserve % (if acceptable)" type="number" placeholder="e.g. 5" />
      <SelectField formik={formik} name="switchTimeline" label="Target Activation Timeline" options={TIMELINE_OPTIONS} />
      <SelectField
        formik={formik}
        name="reviewCadence"
        label="Preferred Ongoing Review Cadence"
        options={REVIEW_CADENCE_OPTIONS}
        advisory="Clients who hold regular QBRs with their processors consistently achieve 15-25% better outcomes over 3 years — better rates at renewal, faster dispute resolution, and early access to new products. We facilitate these reviews."
      />
      <SelectField
        formik={formik}
        name="coMarketingInterest"
        label="Interest in Co-Marketing / Case Study?"
        options={CO_MARKETING_OPTIONS}
        advisory="Reference clients often receive additional rate concessions and priority support. We protect your interests in any co-marketing arrangements."
      />
      <TextAreaField
        formik={formik}
        name="partnershipPriorities"
        label="Partnership Priorities (rank what matters most)"
        placeholder="e.g. 1) Lowest effective rate, 2) Best approval rates, 3) Dedicated account manager who knows our business, 4) No surprise fees, 5) Strong dispute resolution SLAs..."
        hint="Tell us how you'd rank: price, approval rates, support quality, technology, compliance support, international capability, brand reputation."
        advisory="Most RFP processes overweight price and underweight service quality. At 3 years in, a processor who saves you 0.1% but costs you 30 hours/month in disputes is net negative. We balance these in the scorecard."
      />
      <TextAreaField
        formik={formik}
        name="additionalNotes"
        label="Anything Else — Open Field"
        placeholder="Board mandates, prior bad experiences you want us to watch for, specific processor relationships to avoid, internal politics we should know, timeline constraints, budget approvals required..."
      />
    </div>
  );
}

const STEPS = [Step0, Step1, Step2, Step3, Step4, Step5, Step6];

function ProgressBar({ active }: { active: number }) {
  const pct = ((active + 1) / PAYMENTS_SECTIONS.length) * 100;
  const minutesRemaining = STEP_MINUTES.slice(active).reduce((a, b) => a + b, 0);
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3 gap-4">
        <p className="text-xs font-semibold tracking-[0.14em] uppercase" style={{ color: "oklch(0.5 0.06 60)" }}>
          Section {active + 1} of {PAYMENTS_SECTIONS.length} — {PAYMENTS_SECTIONS[active]}
        </p>
        <p className="text-xs font-semibold shrink-0" style={{ color: "oklch(0.52 0.15 50)" }}>
          Est. {minutesRemaining} min remaining
        </p>
      </div>
      <div className="h-1 rounded-full overflow-hidden mb-3" style={{ background: "oklch(0.88 0.02 70)" }}>
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: "var(--gold)" }} />
      </div>
      <div className="flex justify-between">
        {PAYMENTS_SECTIONS.map((s, i) => (
          <div key={s} className="w-2 h-2 rounded-full" style={{ background: i <= active ? "var(--gold)" : "oklch(0.85 0.02 70)" }} />
        ))}
      </div>
    </div>
  );
}

function RFPPreview({ text, onEdit, onConfirm, confirmed }: { text: string; onEdit: () => void; onConfirm: () => void; confirmed: boolean }) {
  const blocks: React.ReactNode[] = [];
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    if (line.startsWith("# ")) {
      blocks.push(
        <h2 key={i} className="text-xl font-bold mt-8 mb-3 pb-2 border-b-2" style={{ fontFamily: "var(--font-display)", color: "oklch(0.2 0.02 50)", borderColor: "var(--gold)" }}>
          {line.slice(2)}
        </h2>,
      );
    } else if (line.startsWith("## ")) {
      blocks.push(
        <h3 key={i} className="text-base font-bold mt-5 mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--gold)" }}>
          {line.slice(3)}
        </h3>,
      );
    } else if (line.match(/^[-*]\s+/)) {
      blocks.push(
        <div key={i} className="flex gap-2 text-sm py-0.5" style={{ color: "oklch(0.3 0.02 50)" }}>
          <span style={{ color: "var(--gold)" }}>·</span>
          <span>{line.replace(/^[-*]\s+/, "")}</span>
        </div>,
      );
    } else if (line.trim() === "") {
      blocks.push(<div key={i} className="h-2" />);
    } else {
      blocks.push(
        <p key={i} className="text-sm leading-relaxed" style={{ color: "oklch(0.3 0.02 50)" }}>
          {line}
        </p>,
      );
    }
  });

  return (
    <div>
      <div className="flex justify-between items-start gap-4 flex-wrap mb-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] uppercase mb-2" style={{ color: "oklch(0.52 0.15 170)" }}>
            RampRate Payments Advisory · Draft Preview
          </p>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "oklch(0.2 0.02 50)" }}>
            Your RFP — Authored by RampRate
          </h2>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all"
            style={{ borderColor: "oklch(0.85 0.04 70)", color: "oklch(0.45 0.08 60)" }}
          >
            <ArrowLeft size={14} />
            Edit
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: "var(--gold)" }}
          >
            <Download size={14} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="rounded-2xl p-8" style={{ background: "white", border: "1px solid oklch(0.9 0.01 70)" }}>
        {blocks}
      </div>

      <div className="rounded-2xl p-8 mt-8 flex justify-between items-center flex-wrap gap-6" style={{ background: "var(--dark)" }}>
        <div>
          <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
            This is a preview. Your advisor refines and distributes it.
          </h3>
          <p className="text-sm text-white/60 max-w-lg">
            Confirm your intake and a RampRate advisor takes ownership —
            refining this RFP, distributing it to matched processors under
            our letterhead, scoring every response, and negotiating on your
            behalf. You never deal with processor sales reps directly.
          </p>
        </div>
        {confirmed ? (
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: "oklch(0.5 0.15 160)" }}>
            <Check size={16} />
            Advisor will contact you within 1 business day
          </div>
        ) : (
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all shrink-0"
            style={{ background: "var(--gold)" }}
          >
            Confirm &amp; Assign My Advisor
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function PaymentsIntakeForm() {
  const [active, setActive] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rfpText, setRfpText] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {},
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      setError(null);
      setSubmitting(true);
      try {
        await fetch("/api/payments-intake", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formData: values, sourceUrl: window.location.href }),
        });

        const res = await fetch("/api/payments-rfp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formData: values }),
        });
        const data = await res.json();
        setRfpText(data.rfp || "We couldn't generate a preview right now. Your RampRate advisor will draft your RFP directly.");
      } catch {
        setError("Something went wrong submitting your intake. Please try again or email us directly.");
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

  if (submitting) {
    return (
      <div className="text-center py-24 px-5">
        <div
          className="w-12 h-12 rounded-full mx-auto mb-8 animate-spin"
          style={{ border: "3px solid var(--gold)", borderTopColor: "transparent" }}
        />
        <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: "oklch(0.2 0.02 50)" }}>
          Preparing your RFP draft preview…
        </h2>
        <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: "oklch(0.45 0.02 50)" }}>
          This usually takes 60–90 seconds — the final version will be
          authored and refined by your RampRate advisor before it&apos;s
          distributed to any processor. Please don&apos;t close this tab.
        </p>
      </div>
    );
  }

  if (rfpText !== null) {
    return (
      <RFPPreview
        text={rfpText}
        onEdit={() => {
          setRfpText(null);
          setActive(PAYMENTS_SECTIONS.length - 1);
        }}
        onConfirm={() => setConfirmed(true)}
        confirmed={confirmed}
      />
    );
  }

  const Step = STEPS[active];
  const isLast = active === PAYMENTS_SECTIONS.length - 1;

  return (
    <form onSubmit={formik.handleSubmit}>
      <ProgressBar active={active} />
      <Step formik={formik} />

      {error && (
        <p className="mt-6 text-sm font-medium" style={{ color: "oklch(0.55 0.2 25)" }}>
          {error}
        </p>
      )}

      <div className="flex justify-between items-center mt-8">
        <button
          type="button"
          onClick={() => goToStep(Math.max(0, active - 1))}
          disabled={active === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all disabled:opacity-25 disabled:cursor-not-allowed"
          style={{ borderColor: "oklch(0.85 0.04 70)", color: "oklch(0.45 0.08 60)" }}
        >
          <ArrowLeft size={14} />
          Previous
        </button>

        <span className="text-xs" style={{ color: "oklch(0.6 0.02 50)" }}>
          {active + 1} / {PAYMENTS_SECTIONS.length}
        </span>

        {isLast ? (
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: "oklch(0.4 0.1 60)" }}
          >
            Submit Intake to RampRate
          </button>
        ) : (
          <button
            type="button"
            onClick={() => goToStep(Math.min(PAYMENTS_SECTIONS.length - 1, active + 1))}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: "var(--gold)" }}
          >
            Next
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </form>
  );
}
