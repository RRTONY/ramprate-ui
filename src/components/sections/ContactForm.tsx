"use client";

import { useState } from "react";

const inquiryTypes = [
  { label: "Relationship & Specialist Sourcing", value: "sourcing" },
  { label: "Deal & Partnership Structuring", value: "deals" },
  { label: "Blockchain, Tokenization & Payment Infrastructure", value: "web3" },
  { label: "Growth Strategy & Fractional Execution", value: "growth" },
  { label: "Impact, ESG & Non-Dilutive Capital Advisory", value: "impact" },
  { label: "BioChain Sourcing (Buyer/Clinic)", value: "biochain" },
  { label: "Peptide Supplier / Become a Vendor", value: "peptide-supplier" },
  { label: "General Inquiry", value: "general" },
];

const inputClass =
  "font-body w-full rounded-lg border border-[#d9d3c7] bg-[#fbfaf7] px-4 py-3 text-sm text-[#121b27] transition-colors placeholder:text-[#667080] focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25";
const labelClass =
  "font-body mb-2 block text-xs font-medium uppercase tracking-wider text-[#344254]";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setError(null);

    try {
      const response = await fetch("/api/contact-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });
      if (!response.ok) throw new Error("Contact intake failed");
      setSubmitted(true);
    } catch {
      setError(
        "We could not save your message. Please try again or contact us directly.",
      );
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-gold/25 bg-white p-12 text-center shadow-[0_20px_60px_rgba(7,18,34,0.1)]">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/15">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="text-[#9b7417]"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-bold mb-3">
          Message Received
        </h3>
        <p className="font-body leading-relaxed text-[#51606f]">
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
      className="rounded-2xl border border-black/8 bg-white p-8 shadow-[0_20px_60px_rgba(7,18,34,0.08)]"
    >
      <input type="hidden" name="form-name" value="contact" />
      <h3 className="font-display text-xl font-bold mb-6">
        Start a Conversation
      </h3>

      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name *
          </label>
          <input
            type="text"
            id="contact-name"
            name="name"
            required
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email *
          </label>
          <input
            type="email"
            id="contact-email"
            name="email"
            required
            placeholder="you@company.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label htmlFor="contact-company" className={labelClass}>
            Company
          </label>
          <input
            type="text"
            id="contact-company"
            name="company"
            placeholder="Your company"
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
            placeholder="Your title"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            Phone
          </label>
          <input
            type="tel"
            id="contact-phone"
            name="phone"
            placeholder="+1 (555) 000-0000"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-practice" className={labelClass}>
            I&apos;m interested in
          </label>
          <select id="contact-practice" name="practice" className={inputClass}>
            <option value="">Select a topic</option>
            {inquiryTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          placeholder="Tell us about your challenge..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {error && (
        <p className="font-body mb-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="font-body inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-[#071221] shadow-[0_10px_30px_rgba(214,173,66,0.2)] transition-all hover:bg-gold-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold active:scale-[0.97]"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
        Send Message
      </button>
    </form>
  );
}
