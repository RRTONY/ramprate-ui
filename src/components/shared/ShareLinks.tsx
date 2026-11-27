"use client";

import { useState, useSyncExternalStore } from "react";

// One-tap "Copy link" and native "Share" for public articles. Always shares
// the page's own canonical address (passed in), never window.location, so a
// visitor who arrived with tracking parameters still forwards a clean link.
// Only for public pages: never put this on token or password-gated routes.

const noop = () => () => {};

export function copyWithFallback(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  // Older iOS / in-app browsers without the async clipboard API.
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.className = "fixed -left-[9999px] opacity-0";
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand("copy");
  area.remove();
  return ok ? Promise.resolve() : Promise.reject(new Error("copy failed"));
}

export default function ShareLinks({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [status, setStatus] = useState("");
  const canShare = useSyncExternalStore(
    noop,
    () => typeof navigator.share === "function",
    () => false,
  );

  async function copy() {
    try {
      await copyWithFallback(url);
      setStatus("Link copied");
    } catch {
      setStatus(`Copy this link: ${url}`);
    }
  }

  async function share() {
    try {
      await navigator.share({ title, url });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        await copy();
      }
    }
  }

  const button =
    "inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 px-4 py-2 font-body text-sm text-white/80 transition-colors hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

  return (
    <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-white/10 pt-8">
      <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-gold">
        Share this
      </span>
      <button type="button" onClick={copy} className={button}>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        Copy link
      </button>
      {canShare && (
        <button type="button" onClick={share} className={button}>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <path d="M16 6l-4-4-4 4" />
            <path d="M12 2v13" />
          </svg>
          Share
        </button>
      )}
      <p
        role="status"
        aria-live="polite"
        className="w-full font-body text-sm text-white/60 empty:hidden"
      >
        {status}
      </p>
    </div>
  );
}
