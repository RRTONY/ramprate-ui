"use client";

import { useRef, useState } from "react";
import { ACCESS_CODE } from "../tsi-partnership/TsiPartnershipGate";

export default function TsiPhaseOneGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function attempt() {
    if (code.trim().toLowerCase() === ACCESS_CODE.toLowerCase()) {
      setUnlocked(true);
      setError(false);
      return;
    }

    setError(true);
    setCode("");
    inputRef.current?.focus();
  }

  if (unlocked) return children;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[oklch(0.97_0.02_75)] px-5 text-[oklch(0.24_0.03_315)]">
      <div className="w-full max-w-[360px] py-12">
        <p className="mb-3 text-center text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-[oklch(0.48_0.11_315)]">
          RampRate + TSI
        </p>
        <h1 className="font-[var(--font-fraunces)] text-center text-[1.7rem] font-semibold leading-tight">
          Phase One scope
        </h1>
        <p className="mt-3 text-center text-[0.92rem] leading-6 text-[oklch(0.46_0.03_310)]">
          This discussion is confidential. Enter the access code to continue.
        </p>

        <label className="sr-only" htmlFor="tsi-phase-one-code">
          Access code
        </label>
        <input
          ref={inputRef}
          id="tsi-phase-one-code"
          type="password"
          value={code}
          autoFocus
          autoComplete="off"
          placeholder="Access code"
          onChange={(event) => {
            setCode(event.target.value);
            setError(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") attempt();
          }}
          className="mt-7 w-full rounded-[10px] border border-[oklch(0.86_0.03_75)] bg-[oklch(0.97_0.02_75)] px-4 py-3 text-[0.95rem] text-[oklch(0.24_0.03_315)] outline-none focus:border-[oklch(0.48_0.11_315)]"
        />
        {error && (
          <p className="mt-2 text-[0.85rem] text-[oklch(0.5_0.17_25)]">
            Incorrect code. Please try again.
          </p>
        )}
        <button
          type="button"
          onClick={attempt}
          className="mt-3 w-full rounded-[10px] bg-[oklch(0.48_0.11_315)] px-4 py-[13px] text-[0.95rem] font-semibold text-[oklch(0.97_0.02_75)]"
        >
          Enter
        </button>
      </div>
    </main>
  );
}
