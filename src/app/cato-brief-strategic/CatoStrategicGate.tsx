"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

type View = "desktop" | "mobile";

// Same rule as the original encrypted page: phones and narrow windows get
// the author's mobile layout, everything else the desktop one.
function pickView(): View {
  const w = Math.min(window.innerWidth, window.screen.width || 9999);
  const coarse = window.matchMedia?.("(pointer: coarse)").matches;
  return window.innerWidth <= 760 || (coarse && w <= 900) ? "mobile" : "desktop";
}

export default function CatoStrategicGate() {
  const [view, setView] = useState<View | null>(null); // null = locked
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Once open, switch layout if the window is resized across the breakpoint.
  useEffect(() => {
    if (!view) return;
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setView(pickView()), 250);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, [view]);

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
        inputRef.current?.focus();
        return;
      }
      setPassword("");
      setView(pickView());
    } catch {
      setError("Could not check the password. Please try again.");
      inputRef.current?.focus();
    } finally {
      setSubmitting(false);
    }
  }

  if (view) {
    return (
      <iframe
        key={view}
        src={`/cato-brief-strategic/content?view=${view}`}
        title={`Cato Digital GPU Financing Brief, ${view} view`}
        className="fixed inset-0 block h-dvh w-full border-0 bg-[oklch(0.95_0.01_85)]"
      />
    );
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[oklch(0.95_0.01_85)] px-4 py-8 text-[oklch(0.2_0.015_50)]">
      <form
        className="w-full max-w-[400px] border border-t-[3px] border-[oklch(0.83_0.02_80)] border-t-[oklch(0.2_0.015_50)] bg-[oklch(0.98_0.006_85)] px-6 pt-7 pb-6"
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
          {submitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
          View brief
        </button>
        <p role="alert" aria-live="polite" className="mt-2.5 min-h-5 text-sm text-[oklch(0.45_0.17_25)]">
          {error}
        </p>
      </form>
    </main>
  );
}
