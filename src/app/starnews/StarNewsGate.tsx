"use client";

import { useRef, useState } from "react";

export default function StarNewsGate() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function submit() {
    if (submitting) return;
    setSubmitting(true);
    setError(false);

    try {
      const response = await fetch("/starnews/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setError(true);
        setPassword("");
        inputRef.current?.focus();
        return;
      }

      setUnlocked(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (unlocked) {
    return (
      <iframe
        src="/starnews/content"
        title="StarNews × RampRate Partnership Discussion"
        className="block h-dvh w-full border-0 bg-[oklch(0.98_0.01_80)]"
      />
    );
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[oklch(0.98_0.01_80)] px-6 text-[oklch(0.25_0.02_290)]">
      <div className="w-full max-w-sm">
        <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[oklch(0.5_0.12_310)]">
          RampRate + StarNews
        </p>
        <h1 className="font-display text-center text-[1.8rem] leading-tight">
          Partnership discussion
        </h1>
        <p className="mt-3 text-center text-sm leading-6 text-[oklch(0.48_0.02_30)]">
          This discussion is confidential. Enter the access password to
          continue.
        </p>

        <div className="mt-7">
          <label className="sr-only" htmlFor="starnews-password">
            Password
          </label>
          <input
            ref={inputRef}
            id="starnews-password"
            type="password"
            value={password}
            autoFocus
            autoComplete="off"
            placeholder="Password"
            onChange={(event) => {
              setPassword(event.target.value);
              setError(false);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") void submit();
            }}
            className="w-full rounded-lg border border-[oklch(0.9_0.02_80)] bg-white px-4 py-3 text-sm outline-none focus:border-[oklch(0.5_0.12_310)]"
          />
          {error && (
            <p className="mt-2 text-sm text-red-700">
              Incorrect password. Please try again.
            </p>
          )}
          <button
            type="button"
            disabled={submitting}
            onClick={() => void submit()}
            className="mt-3 w-full rounded-lg bg-[oklch(0.5_0.12_310)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {submitting ? "Checking…" : "Enter"}
          </button>
        </div>
      </div>
    </main>
  );
}
