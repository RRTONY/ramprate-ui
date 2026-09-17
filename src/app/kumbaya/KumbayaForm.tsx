"use client";

import { useMemo, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  KUMBAYA_ALL_FIELD_KEYS,
  KUMBAYA_ASKS_DISPLAY_LABEL,
  KUMBAYA_ASKS_OPTIONS,
  KUMBAYA_PRACTICAL_SUPPORT_OPTIONS,
  KUMBAYA_STEP0,
  KUMBAYA_STEP1,
  KUMBAYA_STEP2_FIT_FIELDS,
  KUMBAYA_STEP2_NAMES_DRAWER,
  KUMBAYA_STEP2_PROMOTION_DRAWER,
  KUMBAYA_STEP2_RISKS2,
  KUMBAYA_STEP2_TAIL_FIELDS,
  KUMBAYA_STEP3_FIELDS,
  KUMBAYA_UNITS_OPTIONS,
} from "@/lib/kumbaya-fields";
import { KumbayaField, KumbayaFieldGroupBlock } from "./KumbayaFieldRenderer";
import { buildKumbayaPrototype, computeKumbayaScore } from "./kumbaya-scoring";
import type { KumbayaScoreResult } from "./kumbaya-scoring";

// Loose Record type, same convention as the site's other Formik intake
// forms (see FormValues in src/components/supplier/formShared.tsx) -
// text/date/url/email/textarea/select fields are plain strings, the three
// checkbox groups are string[], and consent/connectionEngine are booleans.
export type KumbayaFormValues = Record<
  string,
  string | string[] | boolean | File | null | undefined
>;

const STEP_NAMES = ["The event", "The people", "The fit", "The readout", "Your prototype"];

const INITIAL_VALUES: KumbayaFormValues = Object.fromEntries(
  KUMBAYA_ALL_FIELD_KEYS.map((k) => [k, ""]),
);
INITIAL_VALUES.asks = [];
INITIAL_VALUES.units = [];
INITIAL_VALUES.practicalSupport = [];
INITIAL_VALUES.consent = false;
INITIAL_VALUES.connectionEngine = false;
INITIAL_VALUES.venueImage = null;
INITIAL_VALUES.companyWebsite = "";

const validationSchema = Yup.object().shape({
  event: Yup.string().required("Event name is required"),
  date: Yup.string().required("Event date is required"),
  venue: Yup.string().required("Location / venue is required"),
  contact: Yup.string().required("Organizer name + email is required"),
  priority: Yup.string().required("Tell us why this matters now"),
  asks: Yup.array()
    .of(Yup.string())
    .min(1, "Choose at least one kind of presence so we know which door you are opening."),
  consent: Yup.boolean().oneOf(
    [true],
    "Please confirm you understand this doesn't create a commitment.",
  ),
});

// Only these keys get touched/checked before allowing "Continue" from each
// step - mirrors the original's valid(step) native-required-field check
// plus its custom "at least one ask" rule for step 1.
const STEP_GATE_KEYS = [
  ["event", "date", "venue", "contact", "priority"],
  ["asks"],
  [],
  ["consent"],
  [],
];

function toggleArrayValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
}

export function KumbayaForm() {
  const [step, setStep] = useState(0);
  const [scoreResult, setScoreResult] = useState<KumbayaScoreResult | null>(null);
  const [prototypeText, setPrototypeText] = useState("");
  const [venuePreview, setVenuePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const venueInputRef = useRef<HTMLInputElement | null>(null);

  const formik = useFormik<KumbayaFormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      if (values.companyWebsite) return; // honeypot - never actually reachable by a real user

      setSubmitError(null);
      setSubmitting(true);
      const finalScore = computeKumbayaScore(values);
      const prototype = buildKumbayaPrototype(values);
      setScoreResult(finalScore);
      setPrototypeText(prototype.text);

      try {
        const payload: Record<string, unknown> = {};
        for (const key of KUMBAYA_ALL_FIELD_KEYS) {
          payload[key] = values[key] ?? "";
        }
        payload.asks = values.asks ?? [];
        payload.units = values.units ?? [];
        payload.practicalSupport = values.practicalSupport ?? [];
        payload.connectionEngine = values.connectionEngine ? "true" : "";
        payload.consent = values.consent ? "true" : "";
        payload.score = String(finalScore.score);
        payload.recommendation = finalScore.recommendation;
        payload.breakdown = finalScore.breakdownText;
        payload.prototype = prototype.text;
        payload.sourceUrl = window.location.href;

        const body = new FormData();
        body.append("payload", JSON.stringify(payload));
        if (values.venueImage instanceof File) {
          body.append("venueImage", values.venueImage);
        }

        const res = await fetch("/api/kumbaya-intake", { method: "POST", body });
        if (!res.ok) throw new Error("request failed");
        setStep(4);
      } catch {
        setSubmitError(
          "We could not save this intake yet. Please try again, or email your prototype directly to team@ramprate.com.",
        );
        setStep(4);
      } finally {
        setSubmitting(false);
      }
    },
  });

  async function goToStep(target: number) {
    if (target > step) {
      const errors = await formik.validateForm();
      const gateKeys = STEP_GATE_KEYS[step];
      const stepErrorFields = gateKeys.filter((name) => errors[name]);
      if (stepErrorFields.length) {
        formik.setTouched({
          ...formik.touched,
          ...Object.fromEntries(stepErrorFields.map((f) => [f, true])),
        });
        return;
      }
    }
    if (target === 3) {
      setScoreResult(computeKumbayaScore(formik.values));
    }
    setStep(target);
  }

  function handleVenueImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    formik.setFieldValue("venueImage", file);
    if (!file) {
      setVenuePreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setVenuePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function copyPrototype() {
    try {
      await navigator.clipboard.writeText(prototypeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy your sponsor-pitch prototype:", prototypeText);
    }
  }

  const asks = (formik.values.asks as string[]) || [];
  const units = (formik.values.units as string[]) || [];
  const practicalSupport = (formik.values.practicalSupport as string[]) || [];
  const asksError = formik.touched.asks && (formik.errors as Record<string, string>).asks;

  const prototype = useMemo(
    () => (step === 4 ? buildKumbayaPrototype(formik.values) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [step],
  );

  return (
    <>
      <div className="progress" aria-label="Form progress">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`stepdot${i === step ? " active" : ""}${i < step ? " done" : ""}`}
          />
        ))}
      </div>
      <div className="step-label">
        {step < 4
          ? `${step + 1} of 4 · ${STEP_NAMES[step]} · about 6–8 minutes total`
          : "Your prototype"}
      </div>

      <form id="intake" onSubmit={formik.handleSubmit}>
        <div style={{ position: "absolute", left: -9999, top: -9999 }} aria-hidden="true">
          <label htmlFor="companyWebsite">Company website</label>
          <input
            id="companyWebsite"
            name="companyWebsite"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={(formik.values.companyWebsite as string) || ""}
            onChange={formik.handleChange}
          />
        </div>

        {/* Step 0: The event */}
        <section className={`card step${step === 0 ? "" : " hidden"}`}>
          <h2>What are we walking into?</h2>
          <p className="sub">
            Give us the useful version: what is happening, who is there, and why this room might matter.
          </p>
          <div className="grid">
            <KumbayaFieldGroupBlock fields={KUMBAYA_STEP0[0].fields} formik={formik} />
            <details className="optional-drawer">
              <summary>{KUMBAYA_STEP0[1].drawerTitle}</summary>
              <div className="optional-grid">
                {KUMBAYA_STEP0[1].fields.map((f) => (
                  <KumbayaField key={f.key} field={f} formik={formik} />
                ))}
                <div className="field full">
                  <label htmlFor="venueImage">
                    Venue photo or moodboard
                    <span className="hint">
                      Optional. Give us a sense of the room, setting, and atmosphere. The image
                      previews here and the filename travels with the review.
                    </span>
                  </label>
                  <input
                    ref={venueInputRef}
                    id="venueImage"
                    name="venueImage"
                    type="file"
                    accept="image/*"
                    onChange={handleVenueImageChange}
                  />
                  <div className="venue-preview" style={{ display: venuePreview ? "block" : "none" }}>
                    {venuePreview && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={venuePreview} alt="Venue preview" />
                    )}
                  </div>
                </div>
              </div>
            </details>
            <KumbayaFieldGroupBlock fields={KUMBAYA_STEP0[2].fields} formik={formik} />
          </div>
          <div className="quipline">
            <span>Kumbaya rule:</span> bring the venue, the oddly perfect person, or the introduction
            nobody else thought to make. The room gets bigger when the map gets shared.
          </div>
          <div className="actions">
            <span />
            <button className="btn primary" type="button" onClick={() => goToStep(1)}>
              Continue →
            </button>
          </div>
        </section>

        {/* Step 1: The people */}
        <section className={`card step${step === 1 ? "" : " hidden"}`}>
          <h2>Who makes the room interesting?</h2>
          <p className="sub">
            Nothing below is required. The more you tell us, the better the sponsor-pitch prototype
            you get back.
          </p>
          <div className="grid">
            <details className="optional-drawer">
              <summary>{KUMBAYA_STEP1[0].drawerTitle}</summary>
              <div className="optional-grid">
                <KumbayaFieldGroupBlock fields={KUMBAYA_STEP1[0].fields} formik={formik} />
              </div>
            </details>
            <div className="field full">
              <label>What kind of presence are you requesting?</label>
              <div className="choicegrid">
                {KUMBAYA_ASKS_OPTIONS.map((opt) => (
                  <div className="choice" key={opt.id}>
                    <input
                      id={opt.id}
                      type="checkbox"
                      name="asks"
                      value={opt.value}
                      checked={asks.includes(opt.value)}
                      onChange={() => formik.setFieldValue("asks", toggleArrayValue(asks, opt.value))}
                    />
                    <label htmlFor={opt.id}>
                      {KUMBAYA_ASKS_DISPLAY_LABEL[opt.id] || opt.value}
                      <small>{opt.small}</small>
                    </label>
                  </div>
                ))}
              </div>
              {asksError && (
                <p style={{ color: "var(--red)", fontSize: 13, marginTop: 8 }}>{asksError}</p>
              )}
            </div>
            <KumbayaFieldGroupBlock fields={KUMBAYA_STEP1[1].fields} formik={formik} />
          </div>
          <div className="actions">
            <button className="btn back" type="button" onClick={() => setStep(0)}>
              ← Back
            </button>
            <button className="btn primary" type="button" onClick={() => goToStep(2)}>
              Continue →
            </button>
          </div>
        </section>

        {/* Step 2: The fit */}
        <section className={`card step${step === 2 ? "" : " hidden"}`}>
          <h2>Where could we fit?</h2>
          <p className="sub">
            Nothing below is required. The more you tell us, the better the sponsor-pitch prototype
            you get back.
          </p>
          <details className="optional-drawer" style={{ borderTop: 0, marginTop: 0, paddingTop: 0 }}>
            <summary>Portfolio and partner-company categories · open if useful</summary>
            <div className="businesses" style={{ marginTop: 12 }}>
              {KUMBAYA_UNITS_OPTIONS.map((opt) => (
                <label className="business" key={opt}>
                  <input
                    type="checkbox"
                    name="units"
                    value={opt}
                    checked={units.includes(opt)}
                    onChange={() => formik.setFieldValue("units", toggleArrayValue(units, opt))}
                  />{" "}
                  {opt}
                </label>
              ))}
            </div>
          </details>
          <div className="grid section">
            <KumbayaFieldGroupBlock fields={KUMBAYA_STEP2_FIT_FIELDS} formik={formik} />
          </div>
          <details className="optional-drawer section">
            <summary>Names, permission, CRM, and follow-through · open if useful</summary>
            <p className="sub" style={{ marginTop: 12 }}>
              We do not treat an attendee list as permission to market to people. Tell us what is
              real. Over time, Kumbaya can turn consented profiles into thoughtful top-three matches,
              with the right introduction format and a clear next step.
            </p>
            <div className="grid">
              <KumbayaFieldGroupBlock fields={KUMBAYA_STEP2_NAMES_DRAWER} formik={formik} />
            </div>
          </details>
          <details className="optional-drawer section">
            <summary>Promotion, PR, and the room before the room · open if useful</summary>
            <p className="sub" style={{ marginTop: 12 }}>
              Optional, by design. The more signal you share, the more precisely we can help
              promote, match, route, and strengthen the opportunity.
            </p>
            <div className="grid">
              <KumbayaFieldGroupBlock fields={KUMBAYA_STEP2_PROMOTION_DRAWER} formik={formik} />
              <div className="field full">
                <label>
                  Do you need practical support?
                  <span className="hint">
                    Optional. Check anything that would make the event more welcoming or useful.
                  </span>
                </label>
                <div className="choicegrid">
                  {KUMBAYA_PRACTICAL_SUPPORT_OPTIONS.map((opt) => (
                    <div className="choice" key={opt.id}>
                      <input
                        id={opt.id}
                        type="checkbox"
                        name="practicalSupport"
                        value={opt.value}
                        checked={practicalSupport.includes(opt.value)}
                        onChange={() =>
                          formik.setFieldValue(
                            "practicalSupport",
                            toggleArrayValue(practicalSupport, opt.value),
                          )
                        }
                      />
                      <label htmlFor={opt.id}>
                        {opt.value}
                        <small>{opt.small}</small>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </details>
          <div className="grid">
            <KumbayaFieldGroupBlock fields={KUMBAYA_STEP2_TAIL_FIELDS} formik={formik} />
            <div className="field full">
              <label className="checkrow">
                <input
                  type="checkbox"
                  id="connectionEngine"
                  name="connectionEngine"
                  checked={(formik.values.connectionEngine as boolean) || false}
                  onChange={(e) => formik.setFieldValue("connectionEngine", e.target.checked)}
                />{" "}
                We would like Kumbaya to help prepare and match the top three connections as this
                system matures.
              </label>
            </div>
          </div>
          <div className="section">
            <KumbayaField field={KUMBAYA_STEP2_RISKS2} formik={formik} />
          </div>
          <div className="actions">
            <button className="btn back" type="button" onClick={() => setStep(1)}>
              ← Back
            </button>
            <button className="btn primary" type="button" onClick={() => goToStep(3)}>
              Score the fit →
            </button>
          </div>
        </section>

        {/* Step 3: The readout */}
        <section className={`card step${step === 3 ? "" : " hidden"}`}>
          <h2>Your fit readout</h2>
          <p className="sub">This is an immediate internal triage, not a promise. The final call stays human.</p>
          {scoreResult && <ScoreResult result={scoreResult} asks={asks} units={units} />}
          <div className="section">
            <h3>Final details</h3>
            <div className="grid">
              <KumbayaFieldGroupBlock fields={KUMBAYA_STEP3_FIELDS} formik={formik} />
              <div className="field full">
                <label className="checkrow">
                  <input
                    type="checkbox"
                    id="truth"
                    name="consent"
                    checked={(formik.values.consent as boolean) || false}
                    onChange={(e) => formik.setFieldValue("consent", e.target.checked)}
                    required
                  />{" "}
                  I understand that submitting an application does not create a sponsorship,
                  speaking, funding, or introduction commitment.
                </label>
                {formik.touched.consent && formik.errors.consent && (
                  <p style={{ color: "var(--red)", fontSize: 13, marginTop: 8 }}>
                    {String(formik.errors.consent)}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="actions">
            <button className="btn back" type="button" onClick={() => setStep(2)}>
              ← Back
            </button>
            <button className="btn primary" type="submit" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit intake →"}
            </button>
          </div>
        </section>

        {/* Step 4: Your prototype */}
        <section className={`card step${step === 4 ? "" : " hidden"}`}>
          <div style={{ padding: "4px 0 8px" }}>
            <div className="eyebrow">Your next useful thing</div>
            <h2 style={{ fontSize: 38, marginTop: 12 }}>Your sponsor-pitch prototype.</h2>
            {prototype && <PrototypeResult prototype={prototype} />}
            {submitError && (
              <div
                style={{
                  marginTop: 16,
                  padding: "14px 16px",
                  borderRadius: 10,
                  border: "1px solid var(--red)",
                  background: "#2a1420",
                  color: "var(--ink)",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                We could not save this intake yet. Please try again, or email your prototype
                directly to{" "}
                <a href="mailto:team@ramprate.com" style={{ color: "var(--violet2)" }}>
                  team@ramprate.com
                </a>
                .
              </div>
            )}
            <div className="actions">
              <button className="btn" type="button" onClick={copyPrototype}>
                {copied ? "Copied" : "Copy prototype"}
              </button>
              <button className="btn primary" type="button" onClick={() => window.location.reload()}>
                Submit another event
              </button>
            </div>
            {!submitError && (
              <p className="sub" style={{ marginTop: 24 }}>
                Your intake has also been captured for review. If the event is within seven days,
                please contact your RampRate point person directly. Time is now the scarce resource.
              </p>
            )}
            <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 0 }}>
              Built with RampRate × ImpactSoul
            </p>
          </div>
        </section>
      </form>
    </>
  );
}

function ScoreResult({
  result,
  asks,
  units,
}: {
  result: KumbayaScoreResult;
  asks: string[];
  units: string[];
}) {
  return (
    <div id="result">
      <div className="summary">
        <div className="score">
          <div className="num">
            {result.score}
            <span style={{ fontSize: 20, color: "var(--muted)" }}>/100</span>
          </div>
          <p>internal fit signal · draft rubric</p>
        </div>
        <div className="score">
          <div className="num" style={{ fontSize: 25, marginTop: 9 }}>
            {result.leadTimeLabel}
          </div>
          <p>lead-time read</p>
        </div>
      </div>
      <div className={`route ${result.klass}`}>
        <span className="pill">{result.recommendation}</span>
        <h3>{result.recommendationHeading}</h3>
        <p>{result.description}</p>
      </div>
      <div className="route">
        <span className="pill">Internal scoring card</span>
        {result.breakdown.map((row) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid var(--line)",
              padding: "9px 0",
              color: "var(--muted)",
            }}
          >
            <span>{row.label}</span>
            <strong style={{ color: "var(--ink)" }}>
              {row.points} / {row.max}
            </strong>
          </div>
        ))}
      </div>
      <div className="route">
        <span className="pill">Possible routes</span>
        <p>
          {asks.join(" · ") || "No specific ask selected"}
          {units.length ? " · " + units.join(" · ") : ""}
        </p>
      </div>
    </div>
  );
}

function PrototypeResult({
  prototype,
}: {
  prototype: ReturnType<typeof buildKumbayaPrototype>;
}) {
  return (
    <div id="prototype">
      <div className="route good">
        <span className="pill">Headline</span>
        <h3>{prototype.headline}</h3>
        <p>{prototype.paragraph}</p>
      </div>
      {prototype.people.length ? (
        <div className="route">
          <span className="pill">Who’s in the room</span>
          <ul style={{ margin: 0, paddingLeft: 20, color: "var(--muted)" }}>
            {prototype.people.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="route">
          <span className="pill">Who’s in the room</span>
          <p>Add a few names and links if you want the pitch to feel more specific.</p>
        </div>
      )}
      {prototype.backing ? (
        <div className="route">
          <span className="pill">Why this is worth backing</span>
          <p>{prototype.backing}</p>
        </div>
      ) : (
        <div className="route">
          <span className="pill">Why this is worth backing</span>
          <p>Add the investment level or visibility offered and this line will sharpen automatically.</p>
        </div>
      )}
      {prototype.publishing ? (
        <div className="route">
          <span className="pill">Publishing opportunity</span>
          <p>
            {prototype.publishing} Distribution: {prototype.distribution}.
          </p>
        </div>
      ) : (
        <div className="route">
          <span className="pill">Publishing opportunity</span>
          <p>
            Tell us whether an article, interview, recap, or event feature could help bring in
            sponsors, attendees, or speakers.
          </p>
        </div>
      )}
    </div>
  );
}
