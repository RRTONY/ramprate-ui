"use client";

import { useState } from "react";
import { COUNTRY_CODES, splitPhoneValue, joinPhoneValue } from "@/lib/country-codes";

// Matches the `inp`/`sel` constants duplicated across every intake form
// (formShared.tsx, ClientIntakeForm.tsx, PaymentsIntakeForm.tsx) so this
// drops in with no visual seams by default, while still letting a caller
// override to match a differently-styled form.
const defaultInputClass = `w-full px-4 py-3 rounded-xl border border-black/8 bg-white/80 text-sm text-[oklch(0.2_0.02_50)] placeholder:text-black/30 outline-none transition-all duration-200 focus:border-[var(--gold)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(212,168,67,0.12)]`;
const defaultSelectClass = `${defaultInputClass} appearance-none cursor-pointer`;

// Several countries share a dial code (+1 alone covers the US, Canada,
// Puerto Rico, Jamaica, the Dominican Republic...), so the dial code can't
// be the <option value> - a controlled <select> resolves duplicate values
// to whichever matching option happens to win internally, not necessarily
// the one the user actually picked. ISO code is unique per option instead.
function countryForDial(dial: string) {
  return COUNTRY_CODES.find((c) => c.dial === dial) ?? COUNTRY_CODES[0];
}
function countryForIso(iso: string) {
  return COUNTRY_CODES.find((c) => c.iso === iso) ?? COUNTRY_CODES[0];
}

export default function PhoneInput({
  value,
  onChange,
  onBlur,
  name,
  placeholder = "(555) 000-0000",
  inputClassName = defaultInputClass,
  selectClassName = defaultSelectClass,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  placeholder?: string;
  inputClassName?: string;
  selectClassName?: string;
}) {
  const { dial: parsedDial, number } = splitPhoneValue(value);

  // The selected country lives in local state, not purely derived from
  // `value`: an empty number collapses the combined value back to "" (so an
  // untouched optional field doesn't fail format validation), which would
  // otherwise silently discard a country the user already picked before
  // typing any digits. Re-synced only when a real value arrives from
  // outside (e.g. resumed/prefilled saved progress) - adjusted during
  // render (React's documented pattern for this) rather than in an effect,
  // so it doesn't cost an extra commit. A bare dial code can't distinguish
  // the exact country on resync (multiple countries can share one), so this
  // picks the first match, a reasonable default.
  const [prevValue, setPrevValue] = useState(value);
  const [iso, setIso] = useState(() => countryForDial(parsedDial).iso);
  if (value !== prevValue) {
    setPrevValue(value);
    if (value) setIso(countryForDial(parsedDial).iso);
  }

  const selectedDial = countryForIso(iso).dial;

  return (
    <div className="flex gap-2">
      {/* The width tug-of-war (fixed vs. flex-fill) lives on these wrapper
          divs, not on the select/input themselves - both of those already
          carry `w-full` from the shared style constants, and appending a
          conflicting width utility to the same element is a no-op more
          often than not, since Tailwind resolves same-property utilities by
          generated-CSS order, not by position in the className string. */}
      <div className="w-20 shrink-0">
        <select
          aria-label="Country calling code"
          value={iso}
          onChange={(e) => {
            const next = countryForIso(e.target.value);
            setIso(next.iso);
            onChange(joinPhoneValue(next.dial, number));
          }}
          onBlur={onBlur}
          className={`${selectClassName} truncate`}
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.iso} value={c.iso} title={c.name}>
              {c.flag} {c.dial}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-0">
        <input
          type="tel"
          inputMode="tel"
          name={name}
          value={number}
          onChange={(e) => onChange(joinPhoneValue(selectedDial, e.target.value))}
          onBlur={onBlur}
          placeholder={placeholder}
          className={inputClassName}
        />
      </div>
    </div>
  );
}
