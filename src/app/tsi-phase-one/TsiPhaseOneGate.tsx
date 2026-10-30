"use client";

import { useRef, useState } from "react";

const ACCESS_HASH =
  "51eb2ecd57391422872b32c35ea1a30a1238a7607f64864efa82b9c3505e3a58";

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export default function TsiPhaseOneGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function attempt() {
    const hash = await sha256(code.trim());
    if (hash === ACCESS_HASH) {
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
            if (event.key === "Enter") void attempt();
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
          onClick={() => void attempt()}
          className="mt-3 w-full rounded-[10px] bg-[oklch(0.48_0.11_315)] px-4 py-[13px] text-[0.95rem] font-semibold text-[oklch(0.97_0.02_75)]"
        >
          Enter
        </button>
      </div>
    </main>
  );
}
