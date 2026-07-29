"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const tabs = [
  { label: "Overview", href: "/biochain" },
  { label: "Become a Supplier", href: "/biochain/supplier-intake" },
  { label: "Become a Client", href: "/biochain/buyer-intake" },
  { label: "Process", href: "/biochain/process" },
];

const gold = "oklch(0.52 0.12 70)";

export default function BioChainSubNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isLightHeroPage = pathname === "/biochain";
  const light = scrolled || isLightHeroPage;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navTextColor = light ? "oklch(0.35 0.03 50)" : "rgba(255,255,255,0.8)";
  const navHoverColor = light ? "oklch(0.18 0.03 50)" : "#ffffff";
  const activeColor = light ? gold : "#ffffff";

  return (
    <div
      className={`fixed top-16 sm:top-20 left-0 right-0 z-40 transition-all duration-500 ${
        light
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-black/5"
          : "border-b border-white/10"
      }`}
      style={light ? undefined : { background: "rgba(10, 15, 26, 0.95)", backdropFilter: "blur(8px)" }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center gap-6 h-11 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="text-xs font-semibold tracking-wide uppercase whitespace-nowrap transition-colors duration-300"
              style={{
                color: active ? activeColor : navTextColor,
                fontFamily: "var(--font-body)",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.color = navHoverColor;
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.color = navTextColor;
              }}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
