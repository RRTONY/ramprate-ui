"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Password screen. On success the server sets the session cookie and the page
// is refreshed, so it renders the brief on the server (see page.tsx).
export default function CatoStrategicGate() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function submit() {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/cato-brief-strategic/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        setError(
          response.status === 503
            ? "Access is temporarily unavailable. Please try again later."
            : "That password did not work. Check it and try again.",
        );
        setPassword("");
        setSubmitting(false);
        inputRef.current?.focus();
        return;
      }
      setPassword("");
      router.refresh();
    } catch {
      setError("Could not check the password. Please try again.");
      setSubmitting(false);
      inputRef.current?.focus();
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[oklch(0.95_0.01_85)] px-4 py-8 text-[oklch(0.2_0.015_50)]">
      <form
        className="w-full max-w-100 border border-t-[3px] border-[oklch(0.83_0.02_80)] border-t-[oklch(0.2_0.015_50)] bg-[oklch(0.98_0.006_85)] px-6 pt-7 pb-6"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <p className="mb-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.09em] text-[oklch(0.52_0.22_300)]">
          Confidential
        </p>
        <h1 className="font-display mb-2.5 text-[26px] leading-tight font-semibold text-balance">
          GPU equipment financing brief
        </h1>
        <p className="mb-4 text-[15px] text-[oklch(0.38_0.02_60)]">
          Enter the access password you were given to view the brief.
        </p>
        <label
          htmlFor="cato-strategic-password"
          className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-[oklch(0.38_0.02_60)]"
        >
          Password
        </label>
        <input
          ref={inputRef}
          id="cato-strategic-password"
          type="password"
          value={password}
          autoFocus
          autoComplete="off"
          required
          onChange={(event) => {
            setPassword(event.target.value);
            setError("");
          }}
          className="w-full rounded-none border border-[oklch(0.2_0.015_50)] bg-white p-3 text-base outline-offset-2 focus-visible:outline-[3px] focus-visible:outline-[oklch(0.52_0.22_300)]"
        />
        <button
          type="submit"
          disabled={submitting}
          className="mt-3.5 flex min-h-11 w-full items-center justify-center gap-2 bg-[oklch(0.2_0.015_50)] p-3.5 text-[15px] font-semibold text-[oklch(0.98_0.006_85)] disabled:cursor-wait disabled:opacity-60"
        >
          {submitting && (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-4 animate-spin"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeOpacity="0.3"
                strokeWidth="3"
              />
              <path
                d="M21 12a9 9 0 0 0-9-9"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          )}
          View brief
        </button>
        <p
          role="alert"
          aria-live="polite"
          className="mt-2.5 min-h-5 text-sm text-[oklch(0.45_0.17_25)]"
        >
          {error}
        </p>
      </form>
    </main>
  );
}
