"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  COMMON_TIME_ZONES,
  describeZone,
  getTimeZoneChoices,
  modernZoneName,
  searchTimeZones,
  tzOffsetLabel,
} from "@/lib/relationship-profile-cities";
import type { TzSource } from "@/lib/relationship-profile-fields";

const focusRing =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ed-violet";
const choiceClass = `font-body min-h-11 w-full min-w-0 rounded-lg border px-3 py-3 text-left text-base leading-snug [overflow-wrap:anywhere] ${focusRing}`;
const linkClass = `font-body min-h-11 py-2 text-sm font-semibold text-ed-violet underline underline-offset-4 ${focusRing}`;

export default function RelationshipTimeZonePicker({
  id,
  value,
  timezone,
  source,
  error,
  onChange,
}: {
  id: string;
  value: string;
  timezone?: string;
  source?: TzSource;
  error?: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(-1);
  const [now, setNow] = useState(() => new Date());
  const [resultsHeight, setResultsHeight] = useState(256);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const searchAreaRef = useRef<HTMLDivElement>(null);
  const choices = useMemo(() => getTimeZoneChoices(), []);
  const results = useMemo(
    () => searchTimeZones(choices, query),
    [choices, query],
  );
  const common = [["", "Not sure, or skip"], ...COMMON_TIME_ZONES];
  const errorId = error ? `${id}-error` : undefined;

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
    function fitResults() {
      const height = window.visualViewport?.height ?? window.innerHeight;
      setResultsHeight(Math.min(256, Math.max(88, height * 0.35)));
      if (document.activeElement === searchRef.current) {
        searchAreaRef.current?.scrollIntoView({ block: "start" });
      }
    }
    fitResults();
    window.visualViewport?.addEventListener("resize", fitResults);
    return () =>
      window.visualViewport?.removeEventListener("resize", fitResults);
  }, [open]);

  function close() {
    setOpen(false);
    setQuery("");
    setActive(-1);
    triggerRef.current?.focus({ preventScroll: true });
  }

  function choose(zone: string) {
    onChange(zone);
    close();
  }

  const note = timezone
    ? source === "device"
      ? `Not sure, or skip. Using your device’s time zone for now: ${describeZone(timezone, now)}. We will confirm it with you.`
      : `Time zone: ${describeZone(timezone, now)}`
    : "Not sure, or skip";

  return (
    <div>
      <span
        id={`${id}-label`}
        className="font-body mb-2 block text-[15px] font-semibold text-ed-ink"
      >
        Time zone (optional)
      </span>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p
          id={`${id}-note`}
          role="status"
          className="font-body min-w-0 text-sm font-medium text-ed-forest [overflow-wrap:anywhere]"
        >
          {note}
        </p>
        <button
          ref={triggerRef}
          id={id}
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          aria-describedby={[`${id}-note`, errorId].filter(Boolean).join(" ")}
          onClick={() => (open ? close() : setOpen(true))}
          className={linkClass}
        >
          Not right? Change
        </button>
      </div>
      <p className="font-body mt-1 text-sm text-ed-muted">
        Leave this alone and we will use your city, when recognized.
      </p>
      {open && (
        <div
          ref={panelRef}
          id={`${id}-panel`}
          className="mt-3 min-w-0 rounded-xl border border-ed-line bg-ed-ivory p-3 sm:p-4"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              close();
            }
          }}
        >
          <p
            id={`${id}-common-label`}
            className="font-body mb-3 text-sm font-semibold text-ed-ink"
          >
            Common time zones
          </p>
          <div
            role="listbox"
            aria-labelledby={`${id}-common-label`}
            className="grid min-w-0 gap-2 sm:grid-cols-2"
            onKeyDown={(event) => {
              if (
                ![
                  "ArrowDown",
                  "ArrowUp",
                  "ArrowLeft",
                  "ArrowRight",
                  "Home",
                  "End",
                ].includes(event.key)
              )
                return;
              event.preventDefault();
              const options = [
                ...event.currentTarget.querySelectorAll<HTMLElement>(
                  '[role="option"]',
                ),
              ];
              const index = options.indexOf(
                document.activeElement as HTMLElement,
              );
              const next =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? options.length - 1
                    : (index +
                        (["ArrowDown", "ArrowRight"].includes(event.key)
                          ? 1
                          : -1) +
                        options.length) %
                      options.length;
              options[next]?.focus();
            }}
          >
            {common.map(([zone, label], index) => (
              <button
                key={zone}
                type="button"
                role="option"
                aria-selected={value === zone}
                tabIndex={
                  value === zone ||
                  (index === 0 && !common.some(([key]) => key === value))
                    ? 0
                    : -1
                }
                onClick={() => choose(zone)}
                className={`${choiceClass} ${value === zone ? "border-ed-forest bg-ed-sage" : "border-ed-ink/25 bg-white hover:border-ed-forest"}`}
              >
                <span className="block font-medium">{label}</span>
                {zone && (
                  <span className="mt-1 block text-sm text-ed-muted">
                    {tzOffsetLabel(zone, now)}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div ref={searchAreaRef} className="mt-5 scroll-mt-24">
            <label
              htmlFor={`${id}-search`}
              className="font-body mb-2 block text-[15px] font-semibold text-ed-ink"
            >
              More time zones
            </label>
            <input
              ref={searchRef}
              id={`${id}-search`}
              type="search"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={Boolean(query.trim())}
              aria-controls={`${id}-results`}
              aria-activedescendant={
                active >= 0 && results[active]
                  ? `${id}-result-${active}`
                  : undefined
              }
              aria-describedby={`${id}-search-help`}
              autoComplete="off"
              value={query}
              placeholder="Search city, country or time zone"
              onFocus={() =>
                searchAreaRef.current?.scrollIntoView({ block: "start" })
              }
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(-1);
              }}
              onKeyDown={(event) => {
                if (["ArrowDown", "ArrowUp"].includes(event.key)) {
                  event.preventDefault();
                  if (!results.length) return;
                  const next =
                    event.key === "ArrowDown"
                      ? (active + 1) % results.length
                      : active <= 0
                        ? results.length - 1
                        : active - 1;
                  setActive(next);
                  window.requestAnimationFrame(() =>
                    document
                      .getElementById(`${id}-result-${next}`)
                      ?.scrollIntoView({ block: "nearest" }),
                  );
                } else if (event.key === "Enter") {
                  event.preventDefault();
                  if (results[active]) choose(results[active].value);
                }
              }}
              className={`font-body min-h-12 w-full rounded-[10px] border-[1.5px] border-ed-ink/30 bg-white px-3 py-3 text-[17px] text-ed-ink ${focusRing}`}
            />
            <p
              id={`${id}-search-help`}
              role="status"
              className="font-body my-2 text-sm text-ed-muted"
            >
              {query.trim()
                ? results.length
                  ? `${results.length} results shown. Use arrow keys and Enter to choose.`
                  : "No time zones found. Try another city or country."
                : "Type to search. Up to 8 results will appear."}
            </p>
            <div
              id={`${id}-results`}
              role="listbox"
              aria-label="Time zone search results"
              className="scroll-mb-24 space-y-2 overflow-y-auto overscroll-contain"
              style={{ maxHeight: resultsHeight }}
            >
              {results.map((zone, index) => (
                <button
                  id={`${id}-result-${index}`}
                  key={zone.value}
                  type="button"
                  role="option"
                  aria-selected={active === index}
                  tabIndex={-1}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(zone.value)}
                  className={`${choiceClass} ${active === index ? "border-ed-forest bg-ed-sage" : "border-ed-ink/25 bg-white"}`}
                >
                  <span className="block font-medium">{zone.label}</span>
                  <span className="mt-1 block text-sm text-ed-muted">
                    {tzOffsetLabel(zone.value, now)}
                  </span>
                </button>
              ))}
            </div>
          </div>
          {value && (
            <p className="font-body mt-3 text-sm text-ed-muted">
              Current choice: {modernZoneName(value)}
            </p>
          )}
          <button type="button" onClick={close} className={linkClass}>
            Done
          </button>
        </div>
      )}
    </div>
  );
}
