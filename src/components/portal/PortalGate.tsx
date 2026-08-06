"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PortalId } from "@/lib/portal-auth";

export default function PortalGate({
  portalId,
  title = "Secure Portal",
  subtitle = "This document is confidential. Enter your access code to continue.",
  placeholder = "Access code",
  incorrectMessage = "Incorrect code. Please try again.",
}: {
  portalId: PortalId;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  incorrectMessage?: string;
}) {
  const router = useRouter();
  const [attempt, setAttempt] = useState("");
  const [error, setError] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);

  const tryUnlock = async () => {
    if (loading) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/private-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portalId, password: attempt }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div
          className="text-2xl font-bold mb-2 text-center"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </div>
        <p
          className="text-sm text-gray-600 text-center mb-8"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {subtitle}
        </p>
        <div className="relative mb-3">
          <input
            type={showCode ? "text" : "password"}
            value={attempt}
            onChange={(e) => {
              setAttempt(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") tryUnlock();
            }}
            placeholder={placeholder}
            autoComplete="off"
            className="w-full px-4 py-3 pr-12 border-2 border-black rounded text-sm focus:outline-none"
            style={{
              fontFamily: "var(--font-body)",
              color: "#000000",
              background: "#ffffff",
            }}
          />
          <button
            type="button"
            onClick={() => setShowCode((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            tabIndex={-1}
            aria-label={showCode ? "Hide code" : "Show code"}
          >
            {showCode ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {error && (
          <p
            className="text-sm text-red-600 mb-3"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {incorrectMessage}
          </p>
        )}
        <button
          onClick={tryUnlock}
          disabled={loading}
          className="w-full py-3 bg-black text-white font-bold rounded text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {loading ? "Checking…" : "Enter"}
        </button>
      </div>
    </main>
  );
}
