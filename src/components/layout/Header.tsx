"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Logo from "@/components/shared/Logo";
import SiteSearch from "@/components/shared/SiteSearch";
import HeaderSearch from "@/components/shared/HeaderSearch";

const practices = [
  { label: "Sourcing", href: "/sourcing", desc: "Enterprise IT" },
  { label: "Syzygy", href: "/growth", desc: "Founders" },
  { label: "Stratum", href: "/web3", desc: "Web3" },
  { label: "BioChain", href: "/biochain", desc: "Bio-Sourcing" },
  { label: "ImpactSoul", href: "/impactsoul", desc: "NGOs" },
  { label: "Private Advisory", href: "/private-advisory", desc: "Executive" },
];

const navItems = [
  { label: "Proof", href: "/proof" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Thinking", href: "/thinking" },
  { label: "Engage", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [practicesOpen, setPracticesOpen] = useState(false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
    setPracticesOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Pages with light/white backgrounds - force dark nav from the start (no dark hero)
  const lightBgPaths = [
    "/attorney",
    "/henry-jannol",
    "/josh-bykowski",
    "/legal-master",
  ];
  const lightBgExactPaths = ["/biochain"];
  const isLightPage =
    lightBgPaths.some((p) => pathname.startsWith(p)) ||
    lightBgExactPaths.includes(pathname);
  const dark = scrolled || isLightPage;
  const isBiochainPage = pathname.startsWith("/biochain");

  const navLinkClass = dark
    ? "text-[oklch(0.35_0.03_50)] hover:text-[oklch(0.18_0.03_50)]"
    : "text-white/80 hover:text-white";
  const mobileIconClass = dark ? "text-[oklch(0.18_0.03_50)]" : "text-white";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        dark
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16 sm:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Logo variant={dark ? "dark" : "light"} size="md" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {/* Practices dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setPracticesOpen(true)}
            onMouseLeave={() => setPracticesOpen(false)}
          >
            <button
              className={`font-body text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${navLinkClass}`}
            >
              Practices
            </button>
            {practicesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                <div className="bg-white rounded-lg shadow-xl border border-black/5 p-4 min-w-[270px]">
                  {practices.map((p) => (
                    <Link
                      key={p.href}
                      href={p.href}
                      className="font-body flex items-center justify-between gap-4 px-3 py-2.5 rounded-md transition-colors group hover:bg-[oklch(0.94_0.03_80)]"
                      onClick={() => setPracticesOpen(false)}
                    >
                      <span className="text-sm font-medium transition-colors text-[oklch(0.18_0.03_50)]">
                        {p.label}
                      </span>
                      <span className="text-xs shrink-0 text-[oklch(0.5_0.02_50)]">
                        {p.desc}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Catalogue link - only on BioChain pages */}
          {isBiochainPage && (
            <Link
              href="/biochain/catalogue"
              className={`font-body text-sm font-medium tracking-wide uppercase whitespace-nowrap transition-colors duration-300 ${navLinkClass}`}
            >
              Browse Catalogue
            </Link>
          )}

          {/* Regular nav items */}
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-body text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${navLinkClass}`}
            >
              {item.label}
            </Link>
          ))}

          <HeaderSearch scrolled={dark} />
          <SiteSearch scrolled={dark} />
        </div>

        {/* Mobile toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <HeaderSearch scrolled={dark} />
          <SiteSearch scrolled={dark} />
          <button
            className={`p-3 transition-colors ${mobileIconClass}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-black/5 shadow-lg">
          <div className="px-5 py-6 space-y-1">
            {/* Practices in mobile */}
            <p className="font-body px-3 py-1 text-xs uppercase tracking-widest mb-1 text-[oklch(0.5_0.02_50)]">
              Practices
            </p>
            {practices.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="font-body flex items-center justify-between px-3 py-2.5 rounded-md transition-colors hover:bg-[oklch(0.94_0.03_80)]"
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-sm font-medium text-[oklch(0.18_0.03_50)]">
                  {p.label}
                </span>
                <span className="text-xs text-[oklch(0.5_0.02_50)]">
                  {p.desc}
                </span>
              </Link>
            ))}
            <div className="border-t border-black/5 my-3" />
            {isBiochainPage && (
              <Link
                href="/biochain/catalogue"
                className="font-body block px-3 py-3 text-sm font-medium rounded-md transition-colors text-[oklch(0.18_0.03_50)] hover:bg-[oklch(0.94_0.03_80)]"
                onClick={() => setMobileOpen(false)}
              >
                Browse Catalogue
              </Link>
            )}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-body block px-3 py-3 text-sm font-medium rounded-md transition-colors text-[oklch(0.18_0.03_50)] hover:bg-[oklch(0.94_0.03_80)]"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
