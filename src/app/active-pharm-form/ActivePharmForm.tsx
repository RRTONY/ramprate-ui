"use client";

import { useState, type CSSProperties } from "react";
import { Fraunces, Inter } from "next/font/google";
import { useFormik } from "formik";
import Logo from "@/components/shared/Logo";
import {
  BUDGET_CATEGORIES,
  EMPTY_GROWTH_ROW,
  EMPTY_SUPPLIER,
  GROWTH_BASIS_OPTIONS,
  INITIAL_VALUES,
  PRIORITY_ITEMS,
  RENEWAL_OPTIONS,
  STEP_GATE_KEYS,
  STEP_NAMES,
  STEP_SUBS,
  SUPPLIER_CATEGORY_OPTIONS,
  YES_NO_OPTIONS,
  YES_NO_UNDER_OPTIONS,
  validationSchema,
  type ActivePharmFormValues,
} from "./fields";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--apf-font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--apf-font-body",
});

function fmtUSD(value: string | number | undefined): string {
  const n = typeof value === "number" ? value : parseFloat(value || "0");
  if (!isFinite(n)) return "$0";
  return "$" + Math.round(n).toLocaleString("en-US");
}

function sumBudgetCategories(values: ActivePharmFormValues): number {
  return values.budget.categories.reduce((acc, c) => acc + (parseFloat(c.amount) || 0), 0);
}

function getIn<T>(obj: unknown, path: string): T | undefined {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj) as T | undefined;
}

const TrashIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <path
      d="M3 4h10M6.5 4V2.8c0-.4.3-.8.8-.8h1.4c.4 0 .8.3.8.8V4M4.5 4l.6 8.4c0 .6.5 1.1 1.1 1.1h3.6c.6 0 1.1-.5 1.1-1.1L11.5 4"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
    <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
    <path
      d="M4 12.5l5 5L20 7"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function ActivePharmForm() {
  const [step, setStep] = useState(0);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const totalSteps = STEP_NAMES.length;

  const formik = useFormik<ActivePharmFormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      setSubmitState("submitting");
      try {
        const res = await fetch("/api/active-pharm-intake", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            _meta: {
              submittedAt: new Date().toISOString(),
              sourceUrl: typeof window !== "undefined" ? window.location.href : "",
            },
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || "Submission failed");
        setSubmitState("done");
      } catch {
        setSubmitState("error");
      }
    },
  });

  const { values, errors, setFieldValue, handleSubmit } = formik;

  async function goToStep(n: number) {
    if (n > step) {
      const gateKeys = STEP_GATE_KEYS[step] || [];
      const stepErrors = await formik.validateForm();
      const blocking = gateKeys.filter((k) => getIn(stepErrors, k));
      if (blocking.length) {
        gateKeys.forEach((k) => formik.setFieldTouched(k, true, false));
        return;
      }
    }
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleNext() {
    if (step < totalSteps - 1) {
      goToStep(step + 1);
    } else {
      handleSubmit();
    }
  }

  const categorySum = sumBudgetCategories(values);
  const centralTotal = parseFloat(values.budget.centralTotal) || 0;
  const showReconcileNote = centralTotal > 0 && categorySum > centralTotal * 1.1;

  const topPriorities = [...PRIORITY_ITEMS]
    .map((p) => ({
      label: p.key === "other" ? values.priorities.otherLabel || p.label : p.label,
      value: values.priorities.ranks[p.key] ?? p.def,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  if (submitState === "done") {
    return (
      <div className={`apf-root ${fraunces.variable} ${inter.variable}`}>
        <div className="apf-success-view">
          <div className="apf-success-icon">
            <CheckIcon />
          </div>
          <h2>Intake received</h2>
          <p>
            Thanks — this gives RampRate what it needs to start the baseline review. Someone will
            follow up on any line items that need a closer look before the supplier interviews
            begin.
          </p>
          <div className="apf-success-meta">
            Submitted {new Date().toLocaleString()} · {values.suppliers.length} supplier
            {values.suppliers.length === 1 ? "" : "s"} on file
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`apf-root ${fraunces.variable} ${inter.variable}`}>
      <div className="apf-app">
        <aside className="apf-rail">
          <div className="apf-logo-mark">
            <Logo variant="dark" size="sm" />
          </div>
          <p className="apf-rail-heading">
            Supply chain baseline intake, prepared for TheActivePharm. Fifteen minutes, in five
            short parts.
          </p>

          <ol className="apf-steps" aria-label="Form progress">
            {STEP_NAMES.map((name, i) => (
              <li
                key={name}
                className={`apf-step-item ${i === step ? "is-active" : ""} ${i < step ? "is-done" : ""}`}
                aria-current={i === step ? "step" : undefined}
              >
                <span className="apf-step-badge">{i + 1}</span>
                <span className="apf-step-text">
                  <div className="apf-step-title">{name}</div>
                  <div className="apf-step-sub">{STEP_SUBS[i]}</div>
                </span>
              </li>
            ))}
          </ol>

          <div className="apf-rail-footer">
            Questions about any field? Reach your RampRate contact directly — nothing here is
            final.
          </div>
        </aside>

        <main className="apf-main">
          <form onSubmit={handleSubmit}>
            {step === 0 && (
              <section className="apf-panel">
                <div className="apf-panel-eyebrow">Part one of {totalSteps}</div>
                <h2>Respondent &amp; budget</h2>
                <p className="apf-panel-intro">
                  Start with who&apos;s filling this out, then give us a top-level read on annual
                  spend across your health-products supply chain. Estimates are fine — we&apos;ll
                  refine this together.
                </p>

                <div className="apf-section-block">
                  <h3>Respondent</h3>
                  <div className="apf-field-grid">
                    <div className="apf-field">
                      <label htmlFor="respName">Name &amp; title</label>
                      <input
                        type="text"
                        id="respName"
                        placeholder="e.g. Shane Power, VP Pharmacy Ops"
                        value={values.respondent.name}
                        onChange={(e) => setFieldValue("respondent.name", e.target.value)}
                      />
                      {errors.respondent?.name && (
                        <span className="apf-error-text">{errors.respondent.name}</span>
                      )}
                    </div>
                    <div className="apf-field">
                      <label htmlFor="respEmail">Email</label>
                      <input
                        type="email"
                        id="respEmail"
                        placeholder="you@theactivepharm.com"
                        value={values.respondent.email}
                        onChange={(e) => setFieldValue("respondent.email", e.target.value)}
                      />
                      {errors.respondent?.email && (
                        <span className="apf-error-text">{errors.respondent.email}</span>
                      )}
                    </div>
                    <div className="apf-field">
                      <label htmlFor="respPhone">
                        Phone <span className="apf-optional">(optional)</span>
                      </label>
                      <input
                        type="tel"
                        id="respPhone"
                        placeholder="(555) 000-0000"
                        value={values.respondent.phone}
                        onChange={(e) => setFieldValue("respondent.phone", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="apf-section-block">
                  <h3>Top-line spend</h3>
                  <p className="apf-section-note">
                    Current or upcoming fiscal year, in US$. Include everything centrally managed,
                    plus a rough estimate of anything handled at the clinic or provider level.
                  </p>
                  <div className="apf-field-grid">
                    <div className="apf-field">
                      <label htmlFor="budgetCentral">Total centralized supply chain spend</label>
                      <div className={`apf-money-field ${values.budget.centralTotal ? "apf-filled" : ""}`}>
                        <input
                          type="number"
                          min={0}
                          step={1000}
                          id="budgetCentral"
                          placeholder="0"
                          value={values.budget.centralTotal}
                          onChange={(e) => setFieldValue("budget.centralTotal", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="apf-field">
                      <label htmlFor="budgetDecentral">
                        Estimated clinic-level / decentralized spend
                      </label>
                      <div className={`apf-money-field ${values.budget.decentralTotal ? "apf-filled" : ""}`}>
                        <input
                          type="number"
                          min={0}
                          step={1000}
                          id="budgetDecentral"
                          placeholder="0"
                          value={values.budget.decentralTotal}
                          onChange={(e) => setFieldValue("budget.decentralTotal", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="apf-section-block">
                  <h3>Breakdown by category</h3>
                  <p className="apf-section-note">
                    An approximate annual dollar figure per category. Doesn&apos;t need to be
                    exact — it just needs to be directionally right.
                  </p>

                  <div className="apf-budget-table">
                    <div className="apf-budget-row apf-head">
                      <div>Category</div>
                      <div>US$ / year</div>
                      <div>Notes</div>
                    </div>
                    {BUDGET_CATEGORIES.map((cat, i) => (
                      <div className="apf-budget-row" key={cat}>
                        <div className="apf-cat-label">{cat}</div>
                        <div
                          className={`apf-money-field ${values.budget.categories[i].amount ? "apf-filled" : ""}`}
                        >
                          <input
                            type="number"
                            min={0}
                            step={500}
                            placeholder="0"
                            value={values.budget.categories[i].amount}
                            onChange={(e) =>
                              setFieldValue(`budget.categories[${i}].amount`, e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="optional note"
                            value={values.budget.categories[i].notes}
                            onChange={(e) =>
                              setFieldValue(`budget.categories[${i}].notes`, e.target.value)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="apf-budget-total">
                    <span className="apf-label">Captured so far</span>
                    <span className="apf-value">{fmtUSD(categorySum)}</span>
                  </div>
                  {showReconcileNote && (
                    <p className="apf-reconcile-note">
                      That&apos;s more than your top-line total above — worth a second look, but
                      not a blocker.
                    </p>
                  )}
                </div>
              </section>
            )}

            {step === 1 && (
              <section className="apf-panel">
                <div className="apf-panel-eyebrow">Part two of {totalSteps}</div>
                <h2>Priorities</h2>
                <p className="apf-panel-intro">
                  Two open questions, then a quick ranking. This shapes which suppliers and
                  categories we look at first.
                </p>

                <div className="apf-section-block">
                  <div className="apf-field">
                    <label htmlFor="priorityInitiatives">
                      Top initiatives for the next 12 months that would involve outsourced
                      supply-chain partners
                    </label>
                    <textarea
                      id="priorityInitiatives"
                      placeholder="e.g. adding pharmacy capacity in California and South Carolina, diversifying API sourcing beyond China, launching genomic-guided dosing"
                      value={values.priorities.initiatives}
                      onChange={(e) => setFieldValue("priorities.initiatives", e.target.value)}
                    />
                  </div>
                </div>

                <div className="apf-section-block">
                  <div className="apf-field">
                    <label htmlFor="prioritySavings">
                      If 10–20% of current supplier spend were freed up, what would you fund with
                      the savings?
                    </label>
                    <textarea
                      id="prioritySavings"
                      placeholder="e.g. clinical validation work, provider pilot programs, capital raise runway"
                      value={values.priorities.savingsUse}
                      onChange={(e) => setFieldValue("priorities.savingsUse", e.target.value)}
                    />
                  </div>
                </div>

                <div className="apf-section-block">
                  <h3>Rank what matters most</h3>
                  <p className="apf-section-note">
                    1 is least important, 10 is most important. Move the sliders — there&apos;s no
                    wrong answer here.
                  </p>
                  {PRIORITY_ITEMS.map((item) => {
                    const val = values.priorities.ranks[item.key] ?? item.def;
                    return (
                      <div className="apf-priority-row" key={item.key}>
                        {item.key === "other" ? (
                          <input
                            type="text"
                            className="apf-priority-label"
                            placeholder="Other (please specify)"
                            value={values.priorities.otherLabel}
                            onChange={(e) => setFieldValue("priorities.otherLabel", e.target.value)}
                          />
                        ) : (
                          <div className="apf-priority-label">{item.label}</div>
                        )}
                        <input
                          type="range"
                          min={1}
                          max={10}
                          value={val}
                          style={{ "--apf-fill": `${((val - 1) / 9) * 100}%` } as CSSProperties}
                          onChange={(e) =>
                            setFieldValue(
                              `priorities.ranks.${item.key}`,
                              parseInt(e.target.value, 10),
                            )
                          }
                        />
                        <div className="apf-priority-value">{val}</div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="apf-panel">
                <div className="apf-panel-eyebrow">Part three of {totalSteps}</div>
                <h2>Supplier inventory</h2>
                <p className="apf-panel-intro">
                  One entry per supplier above roughly $50K in annual spend — compounding
                  pharmacies, API/peptide sources, testing labs, packaging, logistics, genomic
                  testing, CRO or regulatory partners, device manufacturers. Group anything
                  smaller under &quot;Other&quot; at the end.
                </p>

                {values.suppliers.map((s, i) => (
                  <div className="apf-card" key={i}>
                    <div className="apf-card-head">
                      <span className="apf-card-title">Supplier #{i + 1}</span>
                      <button
                        type="button"
                        className="apf-icon-btn"
                        style={{
                          visibility: values.suppliers.length === 1 ? "hidden" : "visible",
                        }}
                        onClick={() =>
                          setFieldValue(
                            "suppliers",
                            values.suppliers.filter((_, idx) => idx !== i),
                          )
                        }
                      >
                        <TrashIcon />
                        Remove
                      </button>
                    </div>
                    <div className="apf-field-grid" style={{ marginTop: 14 }}>
                      <div className="apf-field apf-span-2">
                        <label>Supplier name</label>
                        <input
                          type="text"
                          placeholder="e.g. Olympia Pharmaceuticals"
                          value={s.name}
                          onChange={(e) => setFieldValue(`suppliers[${i}].name`, e.target.value)}
                        />
                      </div>
                      <div className="apf-field">
                        <label>Category</label>
                        <select
                          value={s.category}
                          onChange={(e) => setFieldValue(`suppliers[${i}].category`, e.target.value)}
                        >
                          <option value="">Select one</option>
                          {SUPPLIER_CATEGORY_OPTIONS.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="apf-field">
                        <label>Annualized spend</label>
                        <div className={`apf-money-field ${s.spend ? "apf-filled" : ""}`}>
                          <input
                            type="number"
                            min={0}
                            step={500}
                            placeholder="0"
                            value={s.spend}
                            onChange={(e) => setFieldValue(`suppliers[${i}].spend`, e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="apf-field">
                        <label>Geography / HQ</label>
                        <input
                          type="text"
                          placeholder="e.g. Asia Pacific (India)"
                          value={s.geography}
                          onChange={(e) => setFieldValue(`suppliers[${i}].geography`, e.target.value)}
                        />
                      </div>
                      <div className="apf-field">
                        <label>
                          States licensed / served <span className="apf-optional">(if applicable)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. CA, NV, AZ"
                          value={s.states}
                          onChange={(e) => setFieldValue(`suppliers[${i}].states`, e.target.value)}
                        />
                      </div>
                      <div className="apf-field">
                        <label>Contract start date</label>
                        <input
                          type="date"
                          value={s.startDate}
                          onChange={(e) => setFieldValue(`suppliers[${i}].startDate`, e.target.value)}
                        />
                      </div>
                      <div className="apf-field">
                        <label>Contract expiration</label>
                        <input
                          type="date"
                          value={s.endDate}
                          onChange={(e) => setFieldValue(`suppliers[${i}].endDate`, e.target.value)}
                        />
                      </div>
                      <div className="apf-field">
                        <label>Renewal planned?</label>
                        <select
                          value={s.renewal}
                          onChange={(e) => setFieldValue(`suppliers[${i}].renewal`, e.target.value)}
                        >
                          <option value="">Select one</option>
                          {RENEWAL_OPTIONS.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="apf-field">
                        <label>Internal contract owner</label>
                        <input
                          type="text"
                          placeholder="Name"
                          value={s.owner}
                          onChange={(e) => setFieldValue(`suppliers[${i}].owner`, e.target.value)}
                        />
                      </div>
                      <div className="apf-field apf-span-2">
                        <label>
                          Key certifications / licenses{" "}
                          <span className="apf-optional">(PCAB, NABP, DEA, cGMP, ISO 13485, CLIA, etc.)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. PCAB-accredited; DEA Sched. III-V"
                          value={s.certifications}
                          onChange={(e) =>
                            setFieldValue(`suppliers[${i}].certifications`, e.target.value)
                          }
                        />
                      </div>
                      <div className="apf-field apf-span-2">
                        <label>
                          Pending known changes{" "}
                          <span className="apf-optional">(scale-up, termination, re-bid, new SKU…)</span>
                        </label>
                        <textarea
                          placeholder="Anything on the horizon for this relationship?"
                          value={s.pendingChanges}
                          onChange={(e) =>
                            setFieldValue(`suppliers[${i}].pendingChanges`, e.target.value)
                          }
                        />
                      </div>
                      <div className="apf-field apf-span-2">
                        <label>
                          Other notes <span className="apf-optional">(optional)</span>
                        </label>
                        <textarea
                          value={s.notes}
                          onChange={(e) => setFieldValue(`suppliers[${i}].notes`, e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="apf-add-btn"
                  onClick={() => setFieldValue("suppliers", [...values.suppliers, { ...EMPTY_SUPPLIER }])}
                >
                  <PlusIcon />
                  Add another supplier
                </button>
                <p className="apf-item-count">
                  {values.suppliers.length} supplier{values.suppliers.length === 1 ? "" : "s"} added
                </p>
              </section>
            )}

            {step === 3 && (
              <section className="apf-panel">
                <div className="apf-panel-eyebrow">Part four of {totalSteps}</div>
                <h2>Growth &amp; capacity expansion</h2>
                <p className="apf-panel-intro">
                  Optional — only fill this in if growth or capacity expansion (new states, a new
                  product line, M&amp;A integration, rising demand) is actually part of this
                  engagement.
                </p>

                <div className="apf-section-block">
                  <div className="apf-field-grid">
                    <div className="apf-field apf-span-2">
                      <label>Is growth / capacity expansion a driver for this engagement?</label>
                      <select
                        value={values.growth.isDriver}
                        onChange={(e) => setFieldValue("growth.isDriver", e.target.value)}
                      >
                        <option value="">Select one</option>
                        {YES_NO_UNDER_OPTIONS.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="apf-field apf-span-2">
                      <label>
                        Briefly describe the growth driver(s){" "}
                        <span className="apf-optional">
                          (e.g. entering new states, new product line, M&amp;A integration, demand
                          increase)
                        </span>
                      </label>
                      <textarea
                        value={values.growth.driverDescription}
                        onChange={(e) => setFieldValue("growth.driverDescription", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="apf-section-block">
                  <h3>Volume / capacity detail</h3>
                  <p className="apf-section-note">
                    One row per geography/category that&apos;s scaling — current vs. desired
                    volume, target date, and whether your existing supplier(s) can flex to meet it.
                  </p>

                  {values.growth.rows.map((r, i) => (
                    <div className="apf-card" key={i}>
                      <div className="apf-card-head">
                        <span className="apf-card-title">Row #{i + 1}</span>
                        <button
                          type="button"
                          className="apf-icon-btn"
                          onClick={() =>
                            setFieldValue(
                              "growth.rows",
                              values.growth.rows.filter((_, idx) => idx !== i),
                            )
                          }
                        >
                          <TrashIcon />
                          Remove
                        </button>
                      </div>
                      <div className="apf-field-grid" style={{ marginTop: 14 }}>
                        <div className="apf-field">
                          <label>Geography / state</label>
                          <input
                            type="text"
                            placeholder="e.g. California"
                            value={r.geography}
                            onChange={(e) =>
                              setFieldValue(`growth.rows[${i}].geography`, e.target.value)
                            }
                          />
                        </div>
                        <div className="apf-field">
                          <label>Category</label>
                          <select
                            value={r.category}
                            onChange={(e) =>
                              setFieldValue(`growth.rows[${i}].category`, e.target.value)
                            }
                          >
                            <option value="">Select one</option>
                            {SUPPLIER_CATEGORY_OPTIONS.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="apf-field apf-span-2">
                          <label>Specific product / formulation</label>
                          <input
                            type="text"
                            placeholder="e.g. GLP-1 blends"
                            value={r.product}
                            onChange={(e) => setFieldValue(`growth.rows[${i}].product`, e.target.value)}
                          />
                        </div>
                        <div className="apf-field">
                          <label>Current volume / capacity</label>
                          <input
                            type="text"
                            placeholder="e.g. 12,000 units/month"
                            value={r.currentVolume}
                            onChange={(e) =>
                              setFieldValue(`growth.rows[${i}].currentVolume`, e.target.value)
                            }
                          />
                        </div>
                        <div className="apf-field">
                          <label>Desired volume / capacity</label>
                          <input
                            type="text"
                            placeholder="e.g. 18,000 units/month"
                            value={r.desiredVolume}
                            onChange={(e) =>
                              setFieldValue(`growth.rows[${i}].desiredVolume`, e.target.value)
                            }
                          />
                        </div>
                        <div className="apf-field">
                          <label>Basis</label>
                          <select
                            value={r.basis}
                            onChange={(e) => setFieldValue(`growth.rows[${i}].basis`, e.target.value)}
                          >
                            <option value="">Select one</option>
                            {GROWTH_BASIS_OPTIONS.map((o) => (
                              <option key={o} value={o}>
                                {o}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="apf-field">
                          <label>Target date</label>
                          <input
                            type="text"
                            placeholder="e.g. Q4 2026"
                            value={r.targetDate}
                            onChange={(e) =>
                              setFieldValue(`growth.rows[${i}].targetDate`, e.target.value)
                            }
                          />
                        </div>
                        <div className="apf-field apf-span-2">
                          <label>Can current supplier(s) flex to meet this?</label>
                          <select
                            value={r.canFlex}
                            onChange={(e) => setFieldValue(`growth.rows[${i}].canFlex`, e.target.value)}
                          >
                            <option value="">Select one</option>
                            {YES_NO_UNDER_OPTIONS.map((o) => (
                              <option key={o} value={o}>
                                {o}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="apf-field apf-span-2">
                          <label>
                            Notes <span className="apf-optional">(optional)</span>
                          </label>
                          <textarea
                            value={r.notes}
                            onChange={(e) => setFieldValue(`growth.rows[${i}].notes`, e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="apf-add-btn"
                    onClick={() =>
                      setFieldValue("growth.rows", [...values.growth.rows, { ...EMPTY_GROWTH_ROW }])
                    }
                  >
                    <PlusIcon />
                    Add another row
                  </button>
                  <p className="apf-item-count">
                    {values.growth.rows.length} row{values.growth.rows.length === 1 ? "" : "s"} added
                  </p>
                </div>

                <div className="apf-section-block">
                  <h3>Expansion budget</h3>
                  <p className="apf-section-note">
                    Does an expansion budget exist that&apos;s separate from the current run-rate
                    spend covered in the budget breakdown above?
                  </p>
                  <div className="apf-field-grid">
                    <div className="apf-field">
                      <label>Separate expansion budget?</label>
                      <select
                        value={values.growth.hasSeparateBudget}
                        onChange={(e) => setFieldValue("growth.hasSeparateBudget", e.target.value)}
                      >
                        <option value="">Select one</option>
                        {YES_NO_OPTIONS.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="apf-field">
                      <label>Approximate amount (US$)</label>
                      <div className={`apf-money-field ${values.growth.budgetAmount ? "apf-filled" : ""}`}>
                        <input
                          type="number"
                          min={0}
                          step={1000}
                          placeholder="0"
                          value={values.growth.budgetAmount}
                          onChange={(e) => setFieldValue("growth.budgetAmount", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="apf-field apf-span-2">
                      <label>Time period it covers</label>
                      <input
                        type="text"
                        placeholder="e.g. FY2026-2027"
                        value={values.growth.budgetPeriod}
                        onChange={(e) => setFieldValue("growth.budgetPeriod", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {step === 4 && (
              <section className="apf-panel">
                <div className="apf-panel-eyebrow">Part five of {totalSteps}</div>
                <h2>Review &amp; submit</h2>
                <p className="apf-panel-intro">
                  A quick summary of what you&apos;re about to send. Go back to any part to make
                  changes.
                </p>

                <div className="apf-section-block" style={{ marginTop: 24 }}>
                  <div className="apf-review-block">
                    <h4>Budget</h4>
                    <div className="apf-review-row">
                      <span className="apf-k">Centralized total (stated)</span>
                      <span className="apf-v">{fmtUSD(values.budget.centralTotal)}</span>
                    </div>
                    <div className="apf-review-row">
                      <span className="apf-k">Decentralized estimate (stated)</span>
                      <span className="apf-v">{fmtUSD(values.budget.decentralTotal)}</span>
                    </div>
                    <div className="apf-review-row">
                      <span className="apf-k">Sum of category breakdown</span>
                      <span className="apf-v">{fmtUSD(categorySum)}</span>
                    </div>
                  </div>

                  <div className="apf-review-block">
                    <h4>Top priorities (highest ranked first)</h4>
                    <ol className="apf-review-list" style={{ listStyle: "decimal", paddingLeft: 18 }}>
                      {topPriorities.map((p) => (
                        <li key={p.label} style={{ display: "list-item" }}>
                          {p.label} — {p.value}/10
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="apf-review-block">
                    <h4>Suppliers listed ({values.suppliers.length})</h4>
                    <ul className="apf-review-list">
                      {values.suppliers.map((s, i) => (
                        <li key={i}>
                          <span>{s.name || "Unnamed supplier"}</span>
                          <span className="apf-tag">{s.category || "No category selected"}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {values.growth.isDriver && (
                    <div className="apf-review-block">
                      <h4>Growth &amp; capacity expansion</h4>
                      <div className="apf-review-row">
                        <span className="apf-k">Driver for this engagement</span>
                        <span className="apf-v">{values.growth.isDriver}</span>
                      </div>
                      <div className="apf-review-row">
                        <span className="apf-k">Volume/capacity rows</span>
                        <span className="apf-v">{values.growth.rows.length}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="apf-confirm-row">
                  <input
                    type="checkbox"
                    id="confirmAccurate"
                    checked={values.confirmAccurate}
                    onChange={(e) => setFieldValue("confirmAccurate", e.target.checked)}
                  />
                  <label htmlFor="confirmAccurate">
                    To the best of my knowledge, the information above is accurate as of today,
                    and I understand RampRate may follow up on specific line items.
                  </label>
                </div>
                {errors.confirmAccurate && (
                  <p className="apf-error-text">{errors.confirmAccurate}</p>
                )}
                {submitState === "error" && (
                  <p className="apf-error-text">
                    Something went wrong sending this — please try again, or reach your RampRate
                    contact directly.
                  </p>
                )}
              </section>
            )}
          </form>
        </main>
      </div>

      <div className="apf-nav-bar">
        <button
          type="button"
          className="apf-btn apf-btn-ghost"
          disabled={step === 0}
          onClick={() => goToStep(step - 1)}
        >
          Back
        </button>
        <span className="apf-nav-progress">
          Part {step + 1} of {totalSteps}
        </span>
        <button
          type="button"
          className="apf-btn apf-btn-primary"
          disabled={submitState === "submitting"}
          onClick={handleNext}
        >
          {step === totalSteps - 1
            ? submitState === "submitting"
              ? "Submitting…"
              : "Submit intake form"
            : "Continue"}
        </button>
      </div>
    </div>
  );
}
