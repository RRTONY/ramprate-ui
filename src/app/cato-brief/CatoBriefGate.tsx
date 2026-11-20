"use client";
import { useRef, useState } from "react";
export default function CatoBriefGate() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  async function submit() {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/cato-brief/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        setError(
          response.status === 503
            ? "Access temporarily unavailable."
            : "Incorrect password.",
        );
        setPassword("");
        inputRef.current?.focus();
        return;
      }
      setUnlocked(true);
      setPassword("");
    } catch {
      setError("Could not verify access. Please retry.");
    } finally {
      setSubmitting(false);
    }
  }
  if (unlocked)
    return (
      <main className="min-h-dvh bg-white">
        <iframe
          src="/cato-brief/content"
          title="Cato Digital GPU Financing Brief"
          className="block h-dvh w-full border-0"
        />
      </main>
    );
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[oklch(0.97_0.01_80)] px-5 text-ink">
      <section className="w-full max-w-md rounded-xl border border-black/10 bg-white p-7 shadow-sm sm:p-10">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[oklch(0.48_0.09_70)]">
          RampRate · Confidential
        </p>
        <h1 className="font-display text-3xl">Cato Digital Financing Brief</h1>
        <p className="mt-3 text-sm leading-6 text-ink-mid">
          Enter your password to view the complete three-page financing brief.
        </p>
        <label
          htmlFor="cato-brief-password"
          className="mt-7 block text-sm font-medium"
        >
          Access password
        </label>
        <input
          ref={inputRef}
          id="cato-brief-password"
          type="password"
          autoComplete="off"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setError("");
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") void submit();
          }}
          className="mt-2 w-full rounded-lg border border-black/20 bg-white px-4 py-3 text-base outline-offset-2 focus:border-gold"
        />
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <button
          type="button"
          disabled={submitting}
          onClick={() => void submit()}
          className="mt-4 w-full rounded-lg bg-gold px-5 py-3 font-semibold text-dark disabled:opacity-60"
        >
          {submitting ? "Checking…" : "Open Brief"}
        </button>
      </section>
    </main>
  );
}
