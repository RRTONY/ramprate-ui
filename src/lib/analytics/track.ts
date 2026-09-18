"use client";

// Thin wrapper around the two analytics scripts already loaded in
// src/app/layout.tsx (gtag/GA4 and Plausible) - fires a custom event on
// whichever is present, and silently no-ops otherwise (analytics blockers,
// GA disabled, etc. should never break the calling UI).
export function trackEvent(name: string, props?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;

  try {
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag === "function") {
      gtag("event", name, props ?? {});
    }
  } catch {
    // never let analytics break the UI
  }

  try {
    const plausible = (window as unknown as { plausible?: (event: string, opts?: { props?: Record<string, unknown> }) => void }).plausible;
    if (typeof plausible === "function") {
      plausible(name, props ? { props } : undefined);
    }
  } catch {
    // never let analytics break the UI
  }
}
