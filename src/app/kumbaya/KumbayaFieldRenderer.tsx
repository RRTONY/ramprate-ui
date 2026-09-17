"use client";

import type { FormikProps } from "formik";
import type { KumbayaFieldDef } from "@/lib/kumbaya-fields";
import type { KumbayaFormValues } from "./KumbayaForm";

// Generic renderer for the form's plain text/date/url/email/textarea/select
// fields, driven by the KumbayaFieldDef manifest in
// src/lib/kumbaya-fields.ts - mirrors the FieldRenderer pattern already
// used by the site's other Formik intake forms
// (src/components/supplier/formShared.tsx), just against Kumbaya's own
// CSS classes (.field/.hint/etc, see kumbaya.css) instead of Tailwind
// utilities, since this page keeps the prototype's own design system.
export function KumbayaField({
  field,
  formik,
}: {
  field: KumbayaFieldDef;
  formik: FormikProps<KumbayaFormValues>;
}) {
  const { key, label, type, required, placeholder, hint, options, full, tall } = field;
  const value = (formik.values[key] as string) ?? "";

  return (
    <div className={`field${full ? " full" : ""}`}>
      <label htmlFor={key}>
        {label}
        {hint && <span className="hint">{hint}</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          id={key}
          name={key}
          value={value}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required={required}
          placeholder={placeholder}
          style={tall ? { minHeight: 170 } : undefined}
        />
      ) : type === "select" ? (
        <select
          id={key}
          name={key}
          value={value}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required={required}
        >
          <option value="">Select one</option>
          {options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={key}
          name={key}
          type={type}
          value={value}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required={required}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

export function KumbayaFieldGroupBlock({
  fields,
  formik,
}: {
  fields: KumbayaFieldDef[];
  formik: FormikProps<KumbayaFormValues>;
}) {
  return (
    <>
      {fields.map((f) => (
        <KumbayaField key={f.key} field={f} formik={formik} />
      ))}
    </>
  );
}
