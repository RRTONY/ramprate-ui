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

  return (
    <div
      className={`fixed top-16 sm:top-20 left-0 right-0 z-40 transition-all duration-500 ${
        light
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-black/5"
          : "border-b border-white/10 bg-[rgba(10,15,26,0.95)] backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center gap-6 h-11 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          const linkClass = active
            ? light
              ? "text-[oklch(0.52_0.12_70)]"
              : "text-white"
            : light
              ? "text-[oklch(0.35_0.03_50)] hover:text-[oklch(0.18_0.03_50)]"
              : "text-white/80 hover:text-white";
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`font-body text-xs font-semibold tracking-wide uppercase whitespace-nowrap transition-colors duration-300 ${linkClass}`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
