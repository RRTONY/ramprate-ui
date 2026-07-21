"use client";

import type { Dispatch, SetStateAction } from "react";
import type { FormikProps } from "formik";
import * as Yup from "yup";
import { Check, X } from "lucide-react";
import type { FieldDef } from "@/lib/supplier-intake-fields";
import PhoneInput from "@/components/shared/PhoneInput";

export const inp = `w-full px-4 py-3 rounded-xl border border-black/8 bg-white/80 text-sm text-[oklch(0.2_0.02_50)] placeholder:text-black/30 outline-none transition-all duration-200 focus:border-[var(--gold)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(212,168,67,0.12)]`;
export const ta = `${inp} resize-y min-h-[110px]`;
export const sel = `${inp} appearance-none cursor-pointer`;
export const lbl = `block text-[11px] font-semibold tracking-[0.16em] uppercase mb-2`;
export const fw = `flex flex-col`;
export const req = <span className="text-[var(--gold)] ml-0.5">*</span>;

export type FormValues = Record<string, string | File | File[] | undefined>;

// Lenient on purpose: accepts bare domains ("example.com") as well as full
// URLs, unlike Yup's built-in .url() which requires a protocol.
const WEBSITE_RE = /^(https?:\/\/)?([\da-z-]+\.)+[a-z]{2,}([/?#].*)?$/i;

// Only formatting characters allowed (digits, spaces, dashes, parens, dots,
// one optional leading +) - rejects letters/junk outright.
const PHONE_ALLOWED_CHARS_RE = /^\+?[\d\s().-]+$/;

// Counting total string length (including formatting characters) is a weak
// proxy for "the right number of digits" - "+1 (555) 000-0000" is 18
// characters but only 11 digits, and a heavily-padded junk string could
// pass a length-only check. Count actual digits instead: 7-15 covers
// everything from a short local number to a full E.164 international one.
function isValidPhone(value: string): boolean {
  if (!PHONE_ALLOWED_CHARS_RE.test(value)) return false;
  const digitCount = value.replace(/\D/g, "").length;
  return digitCount >= 7 && digitCount <= 15;
}

export function fieldValidator(field: FieldDef) {
  const requiredMsg = `${field.label} is required`;
  switch (field.type) {
    case "email":
      return field.required
        ? Yup.string().email("Invalid email").required(requiredMsg)
        : Yup.string().email("Invalid email");
    case "tel": {
      const validator = Yup.string().test(
        "valid-phone",
        "Enter a valid phone number",
        (v) => !v || isValidPhone(v),
      );
      return field.required ? validator.required(requiredMsg) : validator;
    }
    case "url":
      return field.required
        ? Yup.string().matches(WEBSITE_RE, "Enter a valid website").required(requiredMsg)
        : Yup.string().matches(WEBSITE_RE, "Enter a valid website");
    case "file":
      return field.required ? Yup.mixed().required(requiredMsg) : Yup.mixed();
    case "pricing-table":
      return Yup.string().required(requiredMsg);
    case "date": {
      const validator = Yup.string().test(
        "valid-date",
        "Enter a valid date",
        (v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v),
      );
      return field.required ? validator.required(requiredMsg) : validator;
    }
    default: {
      if (field.key === "monthly_production_capacity") {
        const validator = Yup.string().test(
          "has-digit",
          "Include a number (e.g. 50,000 units/month)",
          (v) => !v || /\d/.test(v),
        );
        return field.required ? validator.required(requiredMsg) : validator;
      }
      if (field.key === "fda_registration_number") {
        return Yup.string().test(
          "valid-fda-reg",
          "Enter a valid FDA registration number (6-10 digits)",
          (v) => !v || /^\d{6,10}$/.test(v.replace(/[\s-]/g, "")),
        );
      }
      return field.required ? Yup.string().required(requiredMsg) : Yup.string();
    }
  }
}

export function buildValidationSchema(fields: FieldDef[]) {
  const shape: Record<string, ReturnType<typeof fieldValidator>> = {};
  fields.forEach((f) => {
    if (f.type === "pricing-table") {
      shape.pricing_compound_1 = Yup.string().required(`${f.label} - at least one compound is required`);
      return;
    }
    shape[f.key] = fieldValidator(f);
  });
  return Yup.object().shape(shape);
}

export function yearOptions(): number[] {
  const current = new Date().getFullYear();
  const years: number[] = [];
  for (let y = current; y >= 1950; y--) years.push(y);
  return years;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function FieldError({
  formik,
  name,
}: {
  formik: FormikProps<FormValues>;
  name: string;
}) {
  const message = formik.touched[name] && formik.errors[name];
  if (!message) return null;
  return (
    <p className="mt-1 text-[11px] font-medium" style={{ color: "oklch(0.55 0.2 25)" }}>
      {String(message)}
    </p>
  );
}

export function Card({
  icon: Icon,
  title,
  stepNumber,
  totalSteps,
  children,
}: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  title: string;
  stepNumber: number;
  totalSteps: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/5 overflow-hidden shadow-sm" style={{ background: "white" }}>
      <div
        className="px-7 py-5 border-b border-black/5 flex items-center gap-3"
        style={{ background: "oklch(0.98 0.015 75)" }}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.72 0.15 75 / 0.15)" }}>
          <Icon size={16} style={{ color: "var(--gold)" }} />
        </div>
        <div>
          <p
            className="text-[10px] font-semibold tracking-[0.18em] uppercase"
            style={{ color: "oklch(0.55 0.08 70)", fontFamily: "var(--font-body)" }}
          >
            Step {stepNumber} of {totalSteps}
          </p>
          <h3 className="text-base font-bold" style={{ fontFamily: "var(--font-display)", color: "oklch(0.2 0.02 50)" }}>
            {title}
          </h3>
        </div>
      </div>
      <div className="p-7">{children}</div>
    </div>
  );
}

export function StepBar({
  tabs,
  active,
  onStepClick,
}: {
  tabs: { label: string; Icon: React.ComponentType<{ size?: number }> }[];
  active: number;
  onStepClick: (target: number) => void;
}) {
  return (
    <div className="flex items-center mb-10">
      {tabs.map((tab, i) => {
        const done = i < active;
        const isActive = i === active;
        return (
          <div key={tab.label} className="flex items-center flex-1 last:flex-none">
            <button type="button" onClick={() => onStepClick(i)} className="flex flex-col items-center gap-1.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold transition-all duration-300 border-2"
                style={{
                  background: done ? "var(--gold)" : "white",
                  borderColor: done || isActive ? "var(--gold)" : "oklch(0.85 0.01 80)",
                  color: done ? "white" : isActive ? "var(--gold)" : "oklch(0.65 0.01 80)",
                  boxShadow: isActive ? "0 0 0 4px rgba(212,168,67,0.15)" : "none",
                }}
              >
                {done ? <Check size={14} strokeWidth={3} /> : <span className="text-xs">{i + 1}</span>}
              </div>
              <span
                className="hidden sm:block text-[10px] font-semibold tracking-wider uppercase whitespace-nowrap"
                style={{
                  color: isActive ? "var(--gold)" : done ? "oklch(0.52 0.12 70)" : "oklch(0.45 0.02 50)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {tab.label}
              </span>
            </button>
            {i < tabs.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-2 rounded-full transition-all duration-500"
                style={{ background: i < active ? "var(--gold)" : "oklch(0.88 0.01 80)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function FieldRenderer({
  field,
  formik,
  pricingRows,
  setPricingRows,
}: {
  field: FieldDef;
  formik: FormikProps<FormValues>;
  pricingRows?: number;
  setPricingRows?: Dispatch<SetStateAction<number>>;
}) {
  const v = formik.values;
  const value = (v[field.key] as string) ?? "";
  const span = field.type === "textarea" || field.type === "pricing-table";

  if (field.type === "pricing-table") {
    const rows = pricingRows ?? 1;
    return (
      <div className={`${fw} sm:col-span-2`}>
        <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
          {field.label} {field.required && req}
        </label>
        {field.helpText && (
          <p className="text-xs mb-3 leading-relaxed" style={{ color: "oklch(0.55 0.02 50)" }}>
            {field.helpText}
          </p>
        )}
        <div className="flex flex-col gap-3">
          {Array.from({ length: rows }).map((_, i) => {
            const n = i + 1;
            return (
              <div key={i} className="grid grid-cols-2 sm:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 items-start">
                <input type="text" name={`pricing_compound_${n}`} value={(v[`pricing_compound_${n}`] as string) ?? ""} onChange={formik.handleChange} placeholder="Compound" className={inp} />
                <input type="text" name={`pricing_unit_size_${n}`} value={(v[`pricing_unit_size_${n}`] as string) ?? ""} onChange={formik.handleChange} placeholder="Unit size" className={inp} />
                <input type="text" name={`pricing_price_${n}`} value={(v[`pricing_price_${n}`] as string) ?? ""} onChange={formik.handleChange} placeholder="Price / unit" className={inp} />
                <input type="text" name={`pricing_moq_tier_${n}`} value={(v[`pricing_moq_tier_${n}`] as string) ?? ""} onChange={formik.handleChange} placeholder="MOQ tier" className={inp} />
                {i === rows - 1 && rows > 1 && setPricingRows && (
                  <button
                    type="button"
                    onClick={() => setPricingRows((p) => Math.max(1, p - 1))}
                    className="flex items-center justify-center w-11 h-11 rounded-xl border transition-colors hover:bg-[oklch(0.97_0.02_75)]"
                    style={{ borderColor: "oklch(0.85 0.04 70)", color: "oklch(0.45 0.08 60)" }}
                    aria-label="Remove row"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <FieldError formik={formik} name="pricing_compound_1" />
        {rows < 5 && setPricingRows && (
          <button
            type="button"
            onClick={() => setPricingRows((p) => Math.min(5, p + 1))}
            className="mt-3 inline-flex items-center gap-2 text-xs font-semibold"
            style={{ color: "var(--gold)" }}
          >
            + Add another compound
          </button>
        )}
      </div>
    );
  }

  if (field.type === "file") {
    const existingFiles = field.multiple ? ((v[field.key] as File[] | undefined) ?? []) : undefined;
    return (
      <div className={fw}>
        <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
          {field.label} {field.required && req}
        </label>
        {field.helpText && (
          <p className="text-xs mb-2 leading-relaxed" style={{ color: "oklch(0.55 0.02 50)" }}>
            {field.helpText}
          </p>
        )}
        <input
          type="file"
          name={field.key}
          multiple={field.multiple}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx,.csv"
          onChange={(e) => {
            const chosen = Array.from(e.target.files ?? []);
            if (field.multiple) {
              formik.setFieldValue(field.key, [...(existingFiles ?? []), ...chosen]);
            } else {
              formik.setFieldValue(field.key, chosen[0]);
            }
            formik.setFieldTouched(field.key, true);
            // Reset so choosing the same file again (e.g. after removing it) still fires onChange.
            e.target.value = "";
          }}
          className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:cursor-pointer"
        />
        {field.multiple
          ? (v[field.key] as File[] | undefined)?.map((f, i) => (
              <div key={`${f.name}-${i}`} className="mt-1 flex items-center gap-2">
                <p className="text-[10px] font-medium" style={{ color: "oklch(0.52 0.12 70)" }}>
                  {f.name}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const next = [...((v[field.key] as File[]) ?? [])];
                    next.splice(i, 1);
                    formik.setFieldValue(field.key, next);
                  }}
                  aria-label={`Remove ${f.name}`}
                  className="text-black/30 hover:text-black/60"
                >
                  <X size={11} />
                </button>
              </div>
            ))
          : v[field.key] instanceof File && (
              <p className="mt-1 text-[10px] font-medium" style={{ color: "oklch(0.52 0.12 70)" }}>
                {(v[field.key] as File).name}
              </p>
            )}
        <FieldError formik={formik} name={field.key} />
      </div>
    );
  }

  return (
    <div className={`${fw} ${span ? "sm:col-span-2" : ""}`}>
      <label className={lbl} style={{ color: "oklch(0.52 0.12 70)" }}>
        {field.label} {field.required && req}
      </label>
      {field.helpText && (
        <p className="text-xs mb-2 leading-relaxed" style={{ color: "oklch(0.55 0.02 50)" }}>
          {field.helpText}
        </p>
      )}
      {field.type === "textarea" ? (
        <textarea name={field.key} value={value} onChange={formik.handleChange} placeholder={field.placeholder} className={ta} />
      ) : field.type === "select" ? (
        <select name={field.key} value={value} onChange={formik.handleChange} className={sel}>
          <option value="">Select option</option>
          {field.options?.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : field.type === "year-select" ? (
        <select name={field.key} value={value} onChange={formik.handleChange} className={sel}>
          <option value="">Select year</option>
          {yearOptions().map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      ) : field.type === "date" ? (
        <input type="date" name={field.key} value={value} onChange={formik.handleChange} className={inp} />
      ) : field.type === "tel" ? (
        <PhoneInput
          name={field.key}
          value={value}
          onChange={(next) => formik.setFieldValue(field.key, next)}
          onBlur={() => formik.setFieldTouched(field.key, true)}
          placeholder={field.placeholder}
        />
      ) : (
        <input
          type={field.type === "email" ? "email" : "text"}
          name={field.key}
          value={value}
          onChange={formik.handleChange}
          placeholder={field.placeholder}
          className={inp}
        />
      )}
      <FieldError formik={formik} name={field.key} />
    </div>
  );
}
