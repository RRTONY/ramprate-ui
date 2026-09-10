"use client";

import { useEffect, useState } from "react";

const LEGAL_PARTNER_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeDGA75w6a1Pi-OKTxA34MWdiwn6WJVMM8a_CMqQNcSJv0HEA/viewform";

export default function PrivateAdvisorySubNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed top-16 sm:top-20 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-black/5"
          : "border-b border-white/10 bg-[rgba(10,15,26,0.95)] backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center h-11">
        <a
          href={LEGAL_PARTNER_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-opacity duration-300 hover:opacity-85"
          style={{ background: "var(--gold)", color: "var(--dark)" }}
        >
          Become a Legal Partner
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </a>
      </div>
    </div>
  );
}
