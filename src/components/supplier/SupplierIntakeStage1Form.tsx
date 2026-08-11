"use client";

import { useRef, useState } from "react";
import { useFormik } from "formik";
import { Check, ArrowLeft, ArrowRight, Building2, Package, Gauge } from "lucide-react";
import { STAGE1_STEPS, STAGE1_REQUIRED_FIELD_COUNT } from "@/lib/supplier-intake-fields";
import {
  Card,
  StepBar,
  FieldRenderer,
  buildValidationSchema,
  type FormValues,
} from "./formShared";

const TABS = [
  { label: "Company & Contact", Icon: Building2 },
  { label: "Offer & Scale", Icon: Package },
  { label: "Terms & Track Record", Icon: Gauge },
];

const validationSchema = buildValidationSchema(STAGE1_STEPS.flat());

export default function SupplierIntakeStage1Form() {
  const [active, setActive] = useState(0);
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
        for (const [name, value] of Object.entries(values)) {
          if (value !== undefined) formData[name] = value as string;
        }

        const res = await fetch("/api/supplier-intake", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formData,
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
      const stepFieldKeys = STAGE1_STEPS[active].map((f) => f.key);
      const stepErrorFields = stepFieldKeys.filter((name) => errors[name]);
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

  if (submitted)
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-5">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg bg-[linear-gradient(135deg,var(--gold),oklch(0.62_0.18_75))]">
          <Check size={32} stroke="white" strokeWidth={2.5} />
        </div>
        <h2 className="font-display text-3xl font-bold mb-4">
          Application Received
        </h2>
        <p className="font-body text-base leading-relaxed mb-8 text-[oklch(0.45_0.02_50)]">
          Thank you for submitting your supplier profile. We will review it against active buyer
          mandates. If there is a fit, we will follow up with a longer application to confirm the
          details. No response means no current match - not a rejection.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[oklch(0.72_0.15_75/0.12)] text-[oklch(0.45_0.12_70)]">
          <div className="w-1.5 h-1.5 rounded-full bg-gold" />
          Submitted to RampRate Supplier Fit Index
        </div>
      </div>
    );

  const stepFields = STAGE1_STEPS[active];

  return (
    <form name="supplier-intake" onSubmit={formik.handleSubmit} className="font-body">
      <input ref={honeypotRef} type="text" name="bot_field" tabIndex={-1} autoComplete="off" className="hidden" />

      <StepBar tabs={TABS} active={active} onStepClick={goToStep} />

      <Card icon={TABS[active].Icon} title={TABS[active].label} stepNumber={active + 1} totalSteps={TABS.length}>
        <div className="grid sm:grid-cols-2 gap-5">
          {stepFields.map((field) => (
            <FieldRenderer key={field.key} field={field} formik={formik} />
          ))}
        </div>

        {active === TABS.length - 1 && (
          <>
            {error && (
              <p className="mt-6 text-xs font-medium text-[oklch(0.55_0.2_25)]">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="font-body mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 bg-[linear-gradient(135deg,var(--gold),oklch(0.58_0.18_68))]"
            >
              {submitting ? "Submitting…" : "Submit Application"}
              {!submitting && <ArrowRight size={16} />}
            </button>
            <p className="font-body mt-3 text-[11px] text-[oklch(0.6_0.02_50)]">
              <span className="text-gold">*</span> {STAGE1_REQUIRED_FIELD_COUNT} required fields
            </p>
          </>
        )}
      </Card>

      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={() => setActive((p) => Math.max(0, p - 1))}
          disabled={active === 0}
          className="font-body inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all disabled:opacity-25 disabled:cursor-not-allowed hover:bg-[oklch(0.97_0.02_75)] border-[oklch(0.85_0.04_70)] text-[oklch(0.45_0.08_60)]"
        >
          <ArrowLeft size={14} />
          Previous
        </button>

        <span className="font-body text-xs text-[oklch(0.6_0.02_50)]">
          {active + 1} / {TABS.length}
        </span>

        {active < TABS.length - 1 && (
          <button
            type="button"
            onClick={() => goToStep(Math.min(TABS.length - 1, active + 1))}
            className="font-body inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.01] bg-gold"
          >
            Next
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </form>
  );
}
