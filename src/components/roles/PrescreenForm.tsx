"use client";

import { useState } from "react";
import { KNOCKOUTS, roleApplyUrl } from "@/lib/roles";

type Result =
  { kind: "missing" } | { kind: "below" } | { kind: "ok"; href: string | null };

const inputClass =
  "w-full max-w-[200px] rounded-md border border-black/15 bg-white px-3 py-2.5 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold";

export default function PrescreenForm({
  roleId,
  applyUrl,
}: {
  roleId: string;
  applyUrl: string;
}) {
  const [exp, setExp] = useState("");
  const [rel, setRel] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function check(e: React.FormEvent) {
    e.preventDefault();
    const x = parseFloat(exp);
    const y = parseFloat(rel);
    if (isNaN(x) || isNaN(y)) return setResult({ kind: "missing" });
    if (x < KNOCKOUTS.experienceMin || y < KNOCKOUTS.relationshipsMin)
      return setResult({ kind: "below" });
    const src = new URLSearchParams(window.location.search).get("src");
    setResult({
      kind: "ok",
      href: roleApplyUrl({ apply_url: applyUrl, role_id: roleId }, src),
    });
  }

  const warn = "mt-4 rounded-md bg-warm-bg px-4 py-3 text-sm text-ink";

  return (
    <form onSubmit={check} noValidate className="space-y-5">
      <div>
        <label
          htmlFor="q-exp"
          className="mb-2 block text-sm font-semibold text-ink"
        >
          1. Years of directly relevant, hands-on experience (minimum{" "}
          {KNOCKOUTS.experienceMin})
        </label>
        <input
          id="q-exp"
          type="number"
          min={0}
          max={60}
          step={1}
          inputMode="numeric"
          required
          value={exp}
          onChange={(e) => setExp(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label
          htmlFor="q-rel"
          className="mb-2 block text-sm font-semibold text-ink"
        >
          2. Years building relevant professional relationships in these sectors
          (minimum {KNOCKOUTS.relationshipsMin})
        </label>
        <input
          id="q-rel"
          type="number"
          min={0}
          max={60}
          step={1}
          inputMode="numeric"
          required
          value={rel}
          onChange={(e) => setRel(e.target.value)}
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        className="inline-flex min-h-11 items-center justify-center rounded-md border border-gold px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold/10"
      >
        Check and continue
      </button>

      <div aria-live="polite">
        {result?.kind === "missing" && (
          <p className={warn}>Please answer both questions.</p>
        )}
        {result?.kind === "below" && (
          <p className={warn}>
            Thank you for your interest. This role requires both minimums shown
            at the top of this page, so we are not able to take your application
            forward for it.
          </p>
        )}
        {result?.kind === "ok" && (
          <div className="mt-4 space-y-3">
            <p className="rounded-md bg-[oklch(0.95_0.05_150)] px-4 py-3 text-sm text-ink">
              Thank you. You meet both requirements.
            </p>
            {result.href ? (
              <>
                <a
                  href={result.href}
                  rel="noopener"
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-gold px-6 py-3 text-sm font-semibold text-dark transition-opacity hover:opacity-90"
                >
                  Continue to application
                </a>
                <p className="text-xs text-ink-mid">
                  You will be taken to our application form. Please answer the
                  same two questions there.
                </p>
              </>
            ) : (
              <p className={warn}>The application link is not set up yet.</p>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
