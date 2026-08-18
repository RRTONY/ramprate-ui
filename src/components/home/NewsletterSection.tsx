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
        <div className="font-body inline-block text-xs font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-5 bg-[rgba(100,60,30,0.08)] text-[oklch(0.55_0.15_30)]">
          Intelligence Brief
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-[oklch(0.18_0.03_50)]">
          Join 13,000+ IT Leaders
        </h2>
        <p className="font-body text-base leading-relaxed mb-8 max-w-lg mx-auto text-[oklch(0.45_0.02_50)]">
          Get RampRate&apos;s take on enterprise tech, sourcing, and market
          shifts - straight from principals. No fluff.
        </p>

        {status === "done" ? (
          <p className="font-body text-base font-semibold text-[oklch(0.55_0.15_30)]">
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
              className="font-body flex-1 px-4 py-3 rounded-md border text-sm focus:outline-none focus:ring-2 border-[oklch(0.82_0.05_80)]"
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="font-body px-6 py-3 rounded-md text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60 whitespace-nowrap bg-[oklch(0.55_0.15_30)]"
            >
              {status === "submitting" ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="font-body mt-3 text-xs text-[oklch(0.5_0.2_20)]">
            Something went wrong. Try again or email us directly.
          </p>
        )}

        <p className="font-body mt-4 text-xs text-[oklch(0.5_0.01_50)]">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
