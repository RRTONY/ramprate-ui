"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics/track";

const inquiryTypes = [
  { label: "IT Sourcing / Cost Optimization", value: "sourcing" },
  { label: "Growth Advisory / Syzygy", value: "growth" },
  { label: "Web3 / Stratum", value: "web3" },
  { label: "Impact / ImpactSoul", value: "impact" },
  { label: "BioChain Sourcing (Buyer/Clinic)", value: "biochain" },
  { label: "Peptide Supplier / Become a Vendor", value: "peptide-supplier" },
  { label: "General Inquiry", value: "general" },
];

// 16px text keeps iOS Safari from zooming the page when a field is tapped.
const inputClass =
  "font-body w-full px-4 py-3 rounded-lg border border-ed-line bg-white text-base text-ed-ink placeholder:text-ed-muted/70 transition-colors hover:border-ed-muted/50 focus:outline-none focus:border-ed-forest focus:ring-2 focus:ring-ed-forest/25";
const labelClass =
  "font-body block text-[15px] font-semibold mb-1.5 text-ed-ink";

export default function ContactForm({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [started, setStarted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setStatus("sending");
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(
          data as unknown as Record<string, string>,
        ).toString(),
      });
      if (!res.ok) throw new Error(`Form post failed: ${res.status}`);
      trackEvent("form_complete", { form: "contact" });
      setStatus("sent");
    } catch {
      trackEvent("form_error", { form: "contact" });
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div
        className="bg-white rounded-2xl p-8 sm:p-12 border border-ed-line text-center"
        role="status"
      >
        <div className="w-14 h-14 mx-auto mb-6 rounded-full flex items-center justify-center bg-ed-sage">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-ed-forest"
            aria-hidden="true"
          >
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl font-bold mb-3 text-ed-ink">
          Message received
        </h3>
        <p className="font-body text-base leading-relaxed text-ed-muted max-w-md mx-auto">
          Thank you for reaching out. One of our principals will respond within
          24 hours. In the meantime, feel free to book a time directly on our
          calendar.
        </p>
      </div>
    );
  }

  return (
    <form
      name="contact"
      method="POST"
      onSubmit={handleSubmit}
      onFocus={() => {
        if (started) return;
        setStarted(true);
        trackEvent("form_start", { form: "contact" });
      }}
      className="bg-white rounded-2xl p-6 sm:p-10 border border-ed-line shadow-[0_1px_2px_oklch(0.3_0.02_170/0.04),0_12px_32px_-12px_oklch(0.3_0.02_170/0.12)]"
    >
      <input type="hidden" name="form-name" value="contact" />
      <p className="hidden" aria-hidden="true">
        <label>
          Leave this empty{" "}
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <h2 className="font-display text-2xl sm:text-3xl font-bold text-ed-ink">
        Start a conversation
      </h2>
      <p className="font-body mt-2 mb-8 text-base leading-relaxed text-ed-muted">
        Tell us what you are working on. A principal reads every message and
        replies within one business day.
      </p>

      <div className="grid sm:grid-cols-2 gap-x-5 gap-y-5">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name <span className="text-ed-muted font-normal">(required)</span>
          </label>
          <input
            type="text"
            id="contact-name"
            name="name"
            required
            autoComplete="name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Work email{" "}
            <span className="text-ed-muted font-normal">(required)</span>
          </label>
          <input
            type="email"
            id="contact-email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-company" className={labelClass}>
            Company
          </label>
          <input
            type="text"
            id="contact-company"
            name="company"
            autoComplete="organization"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-title" className={labelClass}>
            Title
          </label>
          <input
            type="text"
            id="contact-title"
            name="title"
            autoComplete="organization-title"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            Phone
          </label>
          <input
            type="tel"
            id="contact-phone"
            name="phone"
            autoComplete="tel"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-practice" className={labelClass}>
            I&apos;m interested in
          </label>
          {/* appearance-none: Safari otherwise ignores padding/border on a
              native select and draws a shorter, dark-outlined control. */}
          <div className="relative">
            <select
              id="contact-practice"
              name="practice"
              className={`${inputClass} appearance-none pr-11 cursor-pointer`}
            >
              <option value="">Select a topic</option>
              {inquiryTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ed-muted"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className={labelClass}>
            How can we help?
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            placeholder="A sentence or two is plenty."
            className={`${inputClass} resize-y min-h-32`}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="font-body inline-flex items-center justify-center gap-2 min-h-12 px-8 py-3.5 rounded-lg text-base font-semibold text-white bg-ed-forest transition-colors hover:bg-ed-forest-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ed-forest disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Start a Conversation"}
        </button>
        <p className="font-body text-sm text-ed-muted">
          The first conversation is always free.
        </p>
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="font-body mt-5 rounded-lg border border-ed-ink/15 bg-ed-ivory px-4 py-3 text-[15px] leading-relaxed text-ed-ink"
        >
          Your message did not go through. Please try again, or email us at{" "}
          <a
            href={`mailto:${email}`}
            className="font-semibold text-ed-violet underline underline-offset-2"
          >
            {email}
          </a>
          .
        </p>
      )}
    </form>
  );
}
