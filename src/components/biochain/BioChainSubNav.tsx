"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Overview", href: "/biochain" },
  { label: "Become a Supplier", href: "/biochain/supplier-intake" },
  { label: "Become a Client", href: "/biochain/buyer-intake" },
  { label: "Process", href: "/biochain/process" },
];

export default function BioChainSubNav() {
  const pathname = usePathname();

  return (
    <div
      className="fixed top-16 sm:top-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-black/5"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center gap-6 h-11 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          const linkClass = active
            ? "text-[oklch(0.52_0.12_70)]"
            : "text-[oklch(0.35_0.03_50)] hover:text-[oklch(0.18_0.03_50)]";
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
