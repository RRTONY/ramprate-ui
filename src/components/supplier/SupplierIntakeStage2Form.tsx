"use client";

import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import {
  Check,
  ArrowLeft,
  ArrowRight,
  Building2,
  FlaskConical,
  ShieldCheck,
  Briefcase,
  Scale,
  FolderOpen,
  Loader2,
} from "lucide-react";
import { STAGE2_STEPS, STAGE2_REQUIRED_FIELD_COUNT } from "@/lib/supplier-intake-fields";
import {
  Card,
  StepBar,
  FieldRenderer,
  buildValidationSchema,
  fileToBase64,
  type FormValues,
} from "./formShared";

const TABS = [
  { label: "Company Info", Icon: Building2 },
  { label: "Manufacturing", Icon: FlaskConical },
  { label: "Quality", Icon: ShieldCheck },
  { label: "Commercial", Icon: Briefcase },
  { label: "Regulatory", Icon: Scale },
  { label: "Documents", Icon: FolderOpen },
];

const validationSchema = buildValidationSchema(STAGE2_STEPS.flat());

type Phase = "loading" | "ready" | "invalid" | "used" | "submitted";

export default function SupplierIntakeStage2Form({ token }: { token: string }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [initialValues, setInitialValues] = useState<FormValues>({});
  const [active, setActive] = useState(0);
  const [pricingRows, setPricingRows] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement | null>(null);
  const hasMounted = useRef(false);

  const formik = useFormik<FormValues>({
    initialValues,
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (honeypotRef.current?.value) return;
      setError(null);
      setSubmitting(true);
      try {
        await saveProgress(values, true);
        setPhase("submitted");
      } catch {
        setError("Something went wrong submitting your application. Please try again or email us directly.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  async function saveProgress(values: FormValues, final: boolean) {
    const formData: Record<string, string> = {};
    const fileEntries: { fieldName: string; filename: string; mimeType: string; base64: string }[] = [];

    for (const [name, value] of Object.entries(values)) {
      if (value instanceof File) {
        if (final) {
          fileEntries.push({
            fieldName: name,
            filename: value.name,
            mimeType: value.type || "application/octet-stream",
            base64: await fileToBase64(value),
          });
        }
      } else if (value !== undefined && value !== "") {
        formData[name] = value;
      }
    }

    const res = await fetch("/api/supplier-intake-long", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        final,
        formData,
        files: fileEntries,
        sourceUrl: window.location.href,
      }),
    });

    const result = await res.json().catch(() => ({ ok: false }));
    if (!res.ok || !result.ok) {
      throw new Error(result.error || "Save failed");
    }
    return result;
  }

  // Load whatever was already saved for this token, or reject the link
  // outright if it's invalid or already used.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/supplier-intake-long?token=${encodeURIComponent(token)}`);
        const result = await res.json();
        if (cancelled) return;
        if (!result.ok) {
          setPhase(result.used ? "used" : "invalid");
          return;
        }
        setInitialValues(result.values || {});
        setPhase("ready");
      } catch {
        if (!cancelled) setPhase("invalid");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  // Autosave on every step advance (not on the very first render).
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (phase !== "ready") return;
    saveProgress(formik.values, false).catch(() => {
      // Best-effort - a failed autosave doesn't block the supplier from
      // continuing; the final submit will surface any real problem.
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  async function goToStep(target: number) {
    if (target > active) {
      const errors = await formik.validateForm();
      const stepFieldKeys = STAGE2_STEPS[active].map((f) => f.key);
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

  if (phase === "loading") {
    return (
      <div className="max-w-xl mx-auto text-center py-24 px-5">
        <Loader2 className="animate-spin mx-auto mb-4" size={28} style={{ color: "var(--gold)" }} />
        <p style={{ color: "oklch(0.45 0.02 50)", fontFamily: "var(--font-body)" }}>Loading your application…</p>
      </div>
    );
  }

  if (phase === "invalid" || phase === "used") {
    return (
      <div className="max-w-xl mx-auto text-center py-24 px-5">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
          {phase === "used" ? "This application has already been submitted" : "We couldn't find your application"}
        </h2>
        <p style={{ color: "oklch(0.45 0.02 50)", fontFamily: "var(--font-body)" }}>
          {phase === "used"
            ? "Thanks again for the detail - our team is reviewing it and will be in touch."
            : "This link may be mistyped or expired. Please check the link we sent, or contact us directly."}
        </p>
      </div>
    );
  }

  if (phase === "submitted") {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-5">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
          style={{ background: "linear-gradient(135deg, var(--gold), oklch(0.62 0.18 75))" }}
        >
          <Check size={32} stroke="white" strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
          Application Complete
        </h2>
        <p className="text-base leading-relaxed" style={{ color: "oklch(0.45 0.02 50)", fontFamily: "var(--font-body)" }}>
          Thank you for the detail. Our team will review it against active buyer mandates and be in
          touch if there&apos;s a fit.
        </p>
      </div>
    );
  }

  const stepFields = STAGE2_STEPS[active];

  return (
    <form name="supplier-intake-long" onSubmit={formik.handleSubmit} style={{ fontFamily: "var(--font-body)" }}>
      <input ref={honeypotRef} type="text" name="bot_field" tabIndex={-1} autoComplete="off" className="hidden" />

      <StepBar tabs={TABS} active={active} onStepClick={goToStep} />

      <Card icon={TABS[active].Icon} title={TABS[active].label} stepNumber={active + 1} totalSteps={TABS.length}>
        <div className="grid sm:grid-cols-2 gap-5">
          {stepFields.map((field) => (
            <FieldRenderer key={field.key} field={field} formik={formik} pricingRows={pricingRows} setPricingRows={setPricingRows} />
          ))}
        </div>

        {active === TABS.length - 1 && (
          <>
            {error && (
              <p className="mt-6 text-xs font-medium" style={{ color: "oklch(0.55 0.2 25)" }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ background: "linear-gradient(135deg, var(--gold), oklch(0.58 0.18 68))", fontFamily: "var(--font-body)" }}
            >
              {submitting ? "Submitting…" : "Submit Application"}
              {!submitting && <ArrowRight size={16} />}
            </button>
            <p className="mt-3 text-[11px]" style={{ color: "oklch(0.6 0.02 50)", fontFamily: "var(--font-body)" }}>
              <span style={{ color: "var(--gold)" }}>*</span> {STAGE2_REQUIRED_FIELD_COUNT} required fields · your progress is saved automatically as you go
            </p>
          </>
        )}
      </Card>

      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={() => setActive((p) => Math.max(0, p - 1))}
          disabled={active === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all disabled:opacity-25 disabled:cursor-not-allowed hover:bg-[oklch(0.97_0.02_75)]"
          style={{ borderColor: "oklch(0.85 0.04 70)", color: "oklch(0.45 0.08 60)", fontFamily: "var(--font-body)" }}
        >
          <ArrowLeft size={14} />
          Previous
        </button>

        <span className="text-xs" style={{ color: "oklch(0.6 0.02 50)", fontFamily: "var(--font-body)" }}>
          {active + 1} / {TABS.length}
        </span>

        {active < TABS.length - 1 && (
          <button
            type="button"
            onClick={() => goToStep(Math.min(TABS.length - 1, active + 1))}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.01]"
            style={{ background: "var(--gold)", fontFamily: "var(--font-body)" }}
          >
            Next
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </form>
  );
}
