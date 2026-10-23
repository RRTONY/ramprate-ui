"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics/track";
import {
  CONSENT_KEY,
  CONSENT_LABEL,
  STEPS,
  TZ_PICK_KEY,
  displayValue,
  sanitizePrefill,
  validateValues,
  type FieldDef,
  type TzSource,
  type Values,
} from "@/lib/relationship-profile-fields";
import {
  TZ_EUROPE,
  TZ_FALLBACK,
  TZ_NORTH_AMERICA,
  describeZone,
  tzFromCity,
  tzOffsetLabel,
} from "@/lib/relationship-profile-cities";

const CORE_KEYS = [
  "fullName",
  "company",
  "role",
  "relType",
  "location",
  "hoursStart",
  "hoursEnd",
  "meetWindows",
  "channels",
  "response",
  "priorities",
  "email",
];

const focusRing =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ed-violet";
const labelClass = "font-body block text-[15px] font-semibold text-ed-ink mb-2";
const inputClass = `font-body w-full min-h-12 px-3.5 py-3 rounded-[10px] border-[1.5px] border-ed-ink/30 bg-white text-[17px] text-ed-ink placeholder:text-ed-muted/70 transition-colors hover:border-ed-muted focus:outline-none focus:border-ed-forest ${focusRing}`;
const primaryButton = `font-body min-h-12 px-6 py-3 rounded-lg bg-ed-forest text-base font-semibold text-white transition-colors hover:bg-ed-forest-dark disabled:opacity-60 ${focusRing}`;
const ghostButton = `font-body min-h-12 px-5 py-3 rounded-lg border-2 border-ed-ink/25 bg-white text-base font-semibold text-ed-ink transition-colors hover:border-ed-ink ${focusRing}`;

const str = (v: string | string[] | undefined): string =>
  typeof v === "string" ? v : "";
const list = (v: string | string[] | undefined): string[] =>
  Array.isArray(v) ? v : [];

function readPrefill(): Values {
  const part = window.location.hash
    .replace(/^#/, "")
    .split(".")
    .find((p) => p.startsWith("p-"));
  if (!part) return {};
  try {
    const b64 = part.slice(2).replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
    return sanitizePrefill(JSON.parse(new TextDecoder().decode(bytes)));
  } catch {
    return {};
  }
}

function zoneLabel(tz: string, label: string, withOffset: boolean): string {
  const offset = withOffset ? tzOffsetLabel(tz) : "";
  return offset ? `${label}, ${offset}` : label;
}

export default function RelationshipProfileForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [prefilled, setPrefilled] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [deviceTz, setDeviceTz] = useState("");
  const [allZones, setAllZones] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [done, setDone] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const reviewStep = STEPS.length;
  const isReview = step === reviewStep;

  useEffect(() => {
    trackEvent("form_start", { form: "relationship_profile" });
    const zones = (
      Intl as unknown as { supportedValuesOf?: (key: string) => string[] }
    ).supportedValuesOf?.("timeZone");
    const preset = readPrefill();
    const timer = window.setTimeout(() => {
      setMounted(true);
      setDeviceTz(Intl.DateTimeFormat().resolvedOptions().timeZone || "");
      setAllZones(zones ?? []);
      if (Object.keys(preset).length) {
        setValues(preset);
        setPrefilled(Object.keys(preset));
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const tzInfo = useMemo((): { tz: string; source: TzSource } | null => {
    const pick = str(values[TZ_PICK_KEY]);
    if (pick) return { tz: pick, source: "chosen" };
    const city = str(values.location);
    if (!city) return null;
    const fromCity = tzFromCity(city);
    if (fromCity) return { tz: fromCity, source: "city" };
    if (deviceTz) return { tz: deviceTz, source: "device" };
    return null;
  }, [values, deviceTz]);

  const tzNote = useMemo(() => {
    if (!str(values.location) && !str(values[TZ_PICK_KEY])) return "";
    if (!tzInfo) return "We will confirm the time zone with you.";
    if (tzInfo.source === "device") {
      return `We could not match that city, so we will use your device’s time zone (${describeZone(tzInfo.tz)}) for now. Choose one above if that is not right.`;
    }
    return `Time zone: ${describeZone(tzInfo.tz)}`;
  }, [values, tzInfo]);

  const zoneGroups = useMemo(() => {
    const taken = new Set(
      [...TZ_NORTH_AMERICA, ...TZ_EUROPE].map(([tz]) => tz),
    );
    const rest = (allZones.length ? allZones : TZ_FALLBACK)
      .filter(
        (z) =>
          !taken.has(z) &&
          z.includes("/") &&
          !/^(Etc|US|Canada|Brazil|Chile|Mexico)\//.test(z),
      )
      .sort()
      .map((z): [string, string] => {
        const parts = z.split("/");
        const place = parts.slice(1).join(" / ").replace(/_/g, " ");
        return [z, `${place} (${parts[0]})`];
      });
    return [
      { label: "North America", zones: TZ_NORTH_AMERICA },
      { label: "Europe", zones: TZ_EUROPE },
      { label: "Everywhere else", zones: rest },
    ];
  }, [allZones]);

  function setValue(key: string, value: string | string[]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setPrefilled((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : prev,
    );
  }

  function toggle(field: FieldDef, option: string) {
    if (field.type === "multi") {
      const current = list(values[field.key]);
      setValue(
        field.key,
        current.includes(option)
          ? current.filter((v) => v !== option)
          : [...current, option],
      );
    } else {
      setValue(field.key, str(values[field.key]) === option ? "" : option);
    }
  }

  function goTo(next: number) {
    setStep(next);
    window.requestAnimationFrame(() => {
      cardRef.current?.scrollIntoView({ block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    });
  }

  function focusField(key: string) {
    window.requestAnimationFrame(() => {
      const el = cardRef.current?.querySelector<HTMLElement>(
        `[data-field="${key}"] input, [data-field="${key}"] select, [data-field="${key}"] textarea, [data-field="${key}"] button`,
      );
      el?.focus({ preventScroll: true });
      el?.scrollIntoView({ block: "center" });
    });
  }

  function checkStep(index: number): boolean {
    const keys = STEPS[index].fields.map((f) => f.key);
    const { errors: found } = validateValues(values, keys);
    setErrors((prev) => {
      const next = { ...prev };
      keys.forEach((k) => delete next[k]);
      return { ...next, ...found };
    });
    const first = keys.find((k) => found[k]);
    if (first) focusField(first);
    return !first;
  }

  async function submit() {
    const { data, errors: found } = validateValues({
      ...values,
      [CONSENT_KEY]: consent ? "yes" : "",
    });
    const errorKeys = Object.keys(found);
    if (errorKeys.length) {
      setErrors(found);
      const index = STEPS.findIndex((s) => s.fields.some((f) => found[f.key]));
      if (index >= 0) {
        goTo(index);
        const first = STEPS[index].fields.find((f) => found[f.key]);
        if (first) focusField(first.key);
      }
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/relationship-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          values: data,
          meta: tzInfo ? { timezone: tzInfo.tz, tzSource: tzInfo.source } : {},
          website_url: honeypot,
        }),
      });
      if (!res.ok) throw new Error("failed");
      trackEvent("form_complete", { form: "relationship_profile" });
      setDone(true);
      window.requestAnimationFrame(() =>
        cardRef.current?.scrollIntoView({ block: "start" }),
      );
    } catch {
      setSubmitError(
        "Something went wrong sending your profile. Please try again in a moment, or email hello@ramprate.com.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function renderField(field: FieldDef) {
    const id = `rp-${field.key}`;
    const error = errors[field.key];
    const describedBy = error ? `${id}-error` : undefined;
    const invalid = error ? "true" : undefined;
    const label = (
      <>
        {field.label}
        {field.required && (
          <>
            <span aria-hidden="true" className="ml-1 text-red-700">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        )}
        {prefilled.includes(field.key) && (
          <span className="ml-2 rounded-full bg-ed-violet/10 px-2 py-0.5 align-middle text-xs font-semibold uppercase tracking-wide text-ed-violet">
            Pre-filled
          </span>
        )}
      </>
    );

    let control: React.ReactNode;
    if (field.type === "chips" || field.type === "multi") {
      const picked = list(values[field.key]);
      const single = str(values[field.key]);
      control = (
        <>
          <span id={`${id}-label`} className={labelClass}>
            {label}
          </span>
          <div
            role="group"
            aria-labelledby={`${id}-label`}
            aria-describedby={describedBy}
            className={`flex flex-wrap gap-2 ${error ? "rounded-xl outline outline-2 outline-offset-4 outline-red-700" : ""}`}
          >
            {(field.options ?? []).map((o) => {
              const on =
                field.type === "multi"
                  ? picked.includes(o.value)
                  : single === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(field, o.value)}
                  className={`font-body min-h-11 rounded-full border-[1.5px] px-4 py-2 text-base font-medium transition-colors max-[380px]:px-3 max-[380px]:text-[15px] ${focusRing} ${
                    on
                      ? "border-ed-forest bg-ed-sage font-semibold text-ed-ink"
                      : "border-ed-ink/25 bg-white text-ed-ink hover:border-ed-forest"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </>
      );
    } else if (field.type === "select" || field.type === "timezone") {
      control = (
        <>
          <label htmlFor={id} className={labelClass}>
            {label}
          </label>
          <div className="relative">
            <select
              id={id}
              value={str(values[field.key])}
              onChange={(e) => setValue(field.key, e.target.value)}
              aria-invalid={invalid}
              aria-describedby={describedBy}
              className={`${inputClass} appearance-none pr-10`}
            >
              <option value="">
                {field.type === "timezone" ? "Not sure, or skip" : "Select"}
              </option>
              {field.type === "timezone"
                ? zoneGroups.map((group) => (
                    <optgroup key={group.label} label={group.label}>
                      {group.zones.map(([tz, text]) => (
                        <option key={tz} value={tz}>
                          {zoneLabel(tz, text, mounted)}
                        </option>
                      ))}
                    </optgroup>
                  ))
                : (field.options ?? []).map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
            </select>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ed-muted"
            >
              <path d="M5 8l5 5 5-5" />
            </svg>
          </div>
          {field.hint && (
            <p className="font-body mt-2 text-sm text-ed-muted">{field.hint}</p>
          )}
          {field.type === "timezone" && tzNote && (
            <p
              aria-live="polite"
              className="font-body mt-2 text-sm font-medium text-ed-forest"
            >
              {tzNote}
            </p>
          )}
        </>
      );
    } else if (field.type === "textarea") {
      control = (
        <>
          <label htmlFor={id} className={labelClass}>
            {label}
          </label>
          <textarea
            id={id}
            rows={4}
            value={str(values[field.key])}
            onChange={(e) => setValue(field.key, e.target.value)}
            placeholder={field.placeholder}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={`${inputClass} min-h-28 resize-y leading-relaxed`}
          />
        </>
      );
    } else {
      control = (
        <>
          <label htmlFor={id} className={labelClass}>
            {label}
          </label>
          <input
            id={id}
            type={field.type}
            value={str(values[field.key])}
            onChange={(e) => setValue(field.key, e.target.value)}
            placeholder={field.placeholder}
            autoComplete={field.autoComplete ?? "off"}
            inputMode={field.inputMode}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={inputClass}
          />
        </>
      );
    }

    return (
      <div
        key={field.key}
        data-field={field.key}
        className={field.half ? "sm:col-span-1" : "sm:col-span-2"}
      >
        {control}
        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="font-body mt-1.5 text-sm text-red-700"
          >
            {error}
          </p>
        )}
      </div>
    );
  }

  function renderReview() {
    const shared = CORE_KEYS.filter((k) => {
      const v = values[k];
      return Array.isArray(v) ? v.length > 0 : Boolean(v);
    }).length;
    const percent = Math.round((shared / CORE_KEYS.length) * 100);

    return (
      <div>
        <div className="mt-6 flex items-center gap-4 rounded-xl border-l-4 border-ed-coral bg-ed-sage p-4">
          <span className="font-display flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-base font-bold">
            {percent}%
          </span>
          <div>
            <p className="font-body font-semibold">
              {shared} of {CORE_KEYS.length} key details shared
            </p>
            <p className="font-body text-sm text-ed-muted">
              That is plenty to get started. You can always add more later.
            </p>
          </div>
        </div>

        {STEPS.map((s) => {
          const rows = s.fields
            .filter((f) => f.key !== TZ_PICK_KEY)
            .map((f) => [f, values[f.key]] as const)
            .filter(([, v]) => (Array.isArray(v) ? v.length > 0 : Boolean(v)));
          const showZone = s.id === "when" && tzInfo;
          if (!rows.length && !showZone) return null;
          return (
            <section
              key={s.id}
              className="mt-6 overflow-clip rounded-xl border border-ed-line"
            >
              <h3 className="font-body bg-ed-ivory px-4 py-3 text-[13px] font-bold uppercase tracking-[0.12em]">
                {s.title}
              </h3>
              <dl>
                {rows.map(([f, v]) => (
                  <div
                    key={f.key}
                    className="grid gap-0.5 border-t border-ed-line px-4 py-3 sm:grid-cols-[180px_1fr] sm:gap-3"
                  >
                    <dt className="font-body text-sm font-semibold text-ed-muted">
                      {f.short ?? f.label}
                    </dt>
                    <dd className="font-body whitespace-pre-wrap break-words">
                      {v ? displayValue(f, v) : ""}
                    </dd>
                  </div>
                ))}
                {showZone && tzInfo && (
                  <div className="grid gap-0.5 border-t border-ed-line px-4 py-3 sm:grid-cols-[180px_1fr] sm:gap-3">
                    <dt className="font-body text-sm font-semibold text-ed-muted">
                      Time zone
                    </dt>
                    <dd className="font-body">{tzInfo.tz}</dd>
                  </div>
                )}
              </dl>
            </section>
          );
        })}

        <label
          className={`mt-6 flex cursor-pointer items-start gap-3 rounded-xl border-[1.5px] p-4 font-body text-base has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ed-violet ${
            errors[CONSENT_KEY] ? "border-red-700" : "border-ed-ink/25"
          }`}
        >
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              setErrors((prev) => ({ ...prev, [CONSENT_KEY]: "" }));
            }}
            aria-describedby={
              errors[CONSENT_KEY] ? "rp-consent-error" : undefined
            }
            className="mt-1 h-5 w-5 shrink-0 accent-ed-forest"
          />
          <span>
            <span aria-hidden="true" className="mr-1 text-red-700">
              *
            </span>
            <span className="sr-only">(required) </span>
            {CONSENT_LABEL}
          </span>
        </label>
        {errors[CONSENT_KEY] && (
          <p
            id="rp-consent-error"
            role="alert"
            className="font-body mt-1.5 text-sm text-red-700"
          >
            {errors[CONSENT_KEY]}
          </p>
        )}
        {submitError && (
          <p role="alert" className="font-body mt-4 text-[15px] text-red-700">
            {submitError}
          </p>
        )}
      </div>
    );
  }

  if (done) {
    const name = str(values.prefName) || str(values.fullName).split(" ")[0];
    return (
      <div
        ref={cardRef}
        role="status"
        className="scroll-mt-24 overflow-clip rounded-2xl border border-ed-line bg-white px-5 py-12 text-center sm:px-8 sm:py-16"
      >
        <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-ed-forest text-white">
          <svg
            aria-hidden="true"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h2 className="font-display text-3xl font-bold text-balance">
          Thank you{name ? `, ${name}` : ""}.
        </h2>
        <p className="font-body mx-auto mt-3 max-w-md text-lg text-ed-muted text-pretty">
          We have received your profile and will use it to schedule and
          communicate the way you prefer. If anything changes, just let us know
          at hello@ramprate.com.
        </p>
      </div>
    );
  }

  const total = STEPS.length + 1;
  const current = isReview ? null : STEPS[step];
  const remaining = 4 - step;
  const timeLabel =
    step < 4
      ? remaining >= 3
        ? "About 3 minutes"
        : remaining === 2
          ? "About 2 minutes"
          : "About 1 minute"
      : isReview
        ? "Almost done"
        : "Optional";

  return (
    <div
      ref={cardRef}
      className="relative scroll-mt-24 overflow-clip rounded-2xl border border-ed-line bg-white"
    >
      {prefilled.length > 0 && !isReview && (
        <p className="font-body mx-5 mt-6 rounded-xl border-l-4 border-ed-coral bg-ed-sage p-3.5 text-base sm:mx-7">
          <strong className="font-semibold">
            We have filled in what we already know.
          </strong>{" "}
          Please correct anything that is off and add what is missing.
        </p>
      )}

      <div className="px-5 pt-6 sm:px-7">
        <div className="font-body flex items-baseline justify-between gap-3 text-sm font-medium text-ed-muted">
          <span>
            Step <strong className="font-bold text-ed-ink">{step + 1}</strong>{" "}
            of {total} · {isReview ? "Review" : current?.title}
          </span>
          <span className="whitespace-nowrap">{timeLabel}</span>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-ed-line">
          <div
            className="h-full rounded-full bg-ed-forest transition-[width] duration-300"
            style={{ width: `${(step / (total - 1)) * 100}%` }}
          />
        </div>
        <div className="mt-4 hidden flex-wrap gap-x-1.5 gap-y-2 sm:flex">
          {[...STEPS.map((s) => s.title), "Review"].map((title, i) => (
            <button
              key={title}
              type="button"
              onClick={() => goTo(i)}
              aria-current={i === step ? "step" : undefined}
              className={`font-body min-h-10 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${focusRing} ${
                i === step
                  ? "border-ed-forest bg-ed-forest text-white"
                  : i < step
                    ? "border-ed-forest text-ed-forest"
                    : "border-ed-ink/20 text-ed-muted hover:border-ed-forest"
              }`}
            >
              {title}
              {STEPS[i]?.optional && i !== step ? " (optional)" : ""}
            </button>
          ))}
        </div>
      </div>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (isReview) {
            void submit();
          } else if (checkStep(step)) {
            goTo(step + 1);
          }
        }}
      >
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
        >
          <label>
            Leave this empty
            <input
              type="text"
              name="website_url"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </label>
        </div>

        <div className="px-5 pb-2 pt-8 sm:px-7">
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-[28px] font-bold leading-tight text-balance focus:outline-none sm:text-3xl"
          >
            {isReview ? "Review and send" : current?.title}
          </h2>
          <p className="font-body mt-2.5 max-w-prose text-[17px] text-ed-muted text-pretty">
            {isReview
              ? "This is what we have. Go back to change anything, then finish when it looks right."
              : current?.sub}
          </p>

          {current?.optional && (
            <span className="font-body mt-3 inline-block text-[13px] font-semibold uppercase tracking-widest text-ed-forest">
              Optional
            </span>
          )}
          {current && !current.optional && (
            <p className="font-body mt-3.5 text-sm text-ed-muted">
              {current.fields.some((f) => f.required) ? (
                <>
                  <span aria-hidden="true" className="mr-1 text-red-700">
                    *
                  </span>
                  Required. Everything else is optional.
                </>
              ) : (
                "Everything on this page is optional."
              )}
            </p>
          )}

          {current ? (
            <div className="mt-7 grid gap-5 sm:grid-cols-2 sm:gap-x-4">
              {current.fields.map(renderField)}
            </div>
          ) : (
            renderReview()
          )}
        </div>

        <div className="sticky bottom-0 z-10 mt-6 flex flex-wrap items-center gap-2 border-t border-ed-line bg-white px-5 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] sm:static sm:gap-3 sm:border-0 sm:px-7 sm:pb-7 sm:pt-4 sm:shadow-none">
          {step > 0 && (
            <button
              type="button"
              className={ghostButton}
              onClick={() => goTo(step - 1)}
            >
              Back
            </button>
          )}
          <span className="hidden sm:block sm:flex-1" />
          {current?.optional && (
            <button
              type="button"
              onClick={() => goTo(reviewStep)}
              className={`font-body order-last basis-full rounded-md px-2 py-1.5 text-center text-base font-semibold text-ed-violet underline underline-offset-4 sm:order-none sm:basis-auto ${focusRing}`}
            >
              Skip to review
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className={`${primaryButton} flex-1 sm:flex-none`}
          >
            {isReview ? (submitting ? "Sending..." : "Finish") : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
