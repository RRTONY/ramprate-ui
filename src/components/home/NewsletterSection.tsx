"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "done" | "error"
  >("idle");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    const data = new FormData();
    data.append("form-name", "newsletter");
    data.append("email", email);
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(
        data as unknown as Record<string, string>,
      ).toString(),
    })
      .then(() => {
        setStatus("done");
        setEmail("");
      })
      .catch(() => setStatus("error"));
  };

  return (
    <section className="section-light py-20 sm:py-24">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
        <div
          className="inline-block text-xs font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-5"
          style={{
            background: "rgba(100,60,30,0.08)",
            color: "oklch(0.55 0.15 30)",
            fontFamily: "var(--font-body)",
          }}
        >
          Intelligence Brief
        </div>
        <h2
          className="text-3xl sm:text-4xl font-bold mb-4"
          style={{
            fontFamily: "var(--font-display)",
            color: "oklch(0.18 0.03 50)",
          }}
        >
          Join 13,000+ IT Leaders
        </h2>
        <p
          className="text-base leading-relaxed mb-8 max-w-lg mx-auto"
          style={{
            fontFamily: "var(--font-body)",
            color: "oklch(0.45 0.02 50)",
          }}
        >
          Get RampRate&apos;s take on enterprise tech, sourcing, and market
          shifts - straight from principals. No fluff.
        </p>

        {status === "done" ? (
          <p
            className="text-base font-semibold"
            style={{
              color: "oklch(0.55 0.15 30)",
              fontFamily: "var(--font-body)",
            }}
          >
            You&apos;re in. Welcome to the list.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-4 py-3 rounded-md border text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor: "oklch(0.82 0.05 80)",
                fontFamily: "var(--font-body)",
              }}
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="px-6 py-3 rounded-md text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
              style={{
                background: "oklch(0.55 0.15 30)",
                fontFamily: "var(--font-body)",
              }}
            >
              {status === "submitting" ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p
            className="mt-3 text-xs"
            style={{
              color: "oklch(0.5 0.2 20)",
              fontFamily: "var(--font-body)",
            }}
          >
            Something went wrong. Try again or email us directly.
          </p>
        )}

        <p
          className="mt-4 text-xs"
          style={{
            color: "oklch(0.6 0.01 50)",
            fontFamily: "var(--font-body)",
          }}
        >
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
