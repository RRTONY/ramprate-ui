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

  const linkClass = scrolled
    ? "text-[oklch(0.35_0.03_50)] hover:text-[oklch(0.18_0.03_50)]"
    : "text-white/80 hover:text-white";

  return (
    <div
      className={`fixed top-16 sm:top-20 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-black/5"
          : "border-b border-white/10 bg-[rgba(10,15,26,0.95)] backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center gap-6 h-11 overflow-x-auto no-scrollbar">
        <a
          href={LEGAL_PARTNER_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-body text-xs font-semibold tracking-wide uppercase whitespace-nowrap transition-colors duration-300 ${linkClass}`}
        >
          Become a Legal Partner
        </a>
      </div>
    </div>
  );
}
