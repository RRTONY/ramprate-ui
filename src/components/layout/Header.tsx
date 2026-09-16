"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import Logo from "@/components/shared/Logo";
import SiteSearch from "@/components/shared/SiteSearch";
import HeaderSearch from "@/components/shared/HeaderSearch";

const services = [
  {
    label: "Relationship & Specialist Sourcing",
    href: "/services/relationship-specialist-sourcing",
    desc: "Find the right partner",
  },
  {
    label: "Deal & Partnership Structuring",
    href: "/services/deal-partnership-structuring",
    desc: "Make complex deals work",
  },
  {
    label: "Blockchain & Payment Infrastructure",
    href: "/services/blockchain-tokenization-payment-infrastructure",
    desc: "Build the foundation",
  },
  {
    label: "Growth Strategy & Fractional Execution",
    href: "/services/growth-strategy-fractional-execution",
    desc: "Turn plans into progress",
  },
];

const navItems = [
  { label: "Case Studies", href: "/proof" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
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

  // Un-scrolled state sits over the hero, which still carries a genuinely
  // deep indigo/magenta scrim on its left side (where the logo/nav live) even
  // after the bright-sunset rebrand, so nav text there stays white - same
  // logic as before, just no longer assuming every background is uniformly
  // bright. Only the scrolled/opaque-white-bar state uses dark ink.
  const navLinkClass = dark
    ? "text-[oklch(0.35_0.03_50)] hover:text-[oklch(0.18_0.03_50)]"
    : "text-white/85 hover:text-white";
  const mobileIconClass = dark ? "text-[oklch(0.18_0.03_50)]" : "text-white";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-[background-color,border-color,box-shadow] duration-150 ${
        dark
          ? "bg-white shadow-[0_12px_26px_rgba(15,23,42,0.12)] border-b border-black/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between gap-4 h-16 sm:h-[4.75rem]">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 shrink-0 transition-opacity hover:opacity-80"
        >
          <Logo variant={dark ? "dark" : "light"} size="md" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6">
          {/* Services dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={servicesOpen}
              className={`font-body inline-flex items-center gap-1.5 text-[0.72rem] font-semibold tracking-[0.08em] uppercase transition-colors duration-200 ${navLinkClass}`}
              onClick={() => setServicesOpen((open) => !open)}
            >
              Services
              <ChevronDown size={13} strokeWidth={1.8} aria-hidden="true" />
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                <div className="bg-white rounded-lg shadow-xl border border-black/5 p-4 min-w-[270px]">
                  <Link
                    href="/services"
                    className="font-body mb-2 flex items-center justify-between gap-4 rounded-md bg-[oklch(0.94_0.03_80)] px-3 py-2.5 text-sm font-semibold text-[oklch(0.18_0.03_50)] transition-colors hover:bg-[oklch(0.91_0.04_80)]"
                    onClick={() => setServicesOpen(false)}
                  >
                    View all services
                    <ChevronDown
                      className="rotate-[-90deg]"
                      size={14}
                      aria-hidden="true"
                    />
                  </Link>
                  {services.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className="font-body flex items-center justify-between gap-4 px-3 py-2.5 rounded-md transition-colors group hover:bg-[oklch(0.94_0.03_80)]"
                      onClick={() => setServicesOpen(false)}
                    >
                      <span className="text-sm font-medium transition-colors text-[oklch(0.18_0.03_50)]">
                        {service.label}
                      </span>
                      <span className="text-xs shrink-0 text-[oklch(0.5_0.02_50)]">
                        {service.desc}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Regular nav items */}
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setServicesOpen(false)}
              className={`font-body text-[0.72rem] font-semibold tracking-[0.08em] uppercase transition-colors duration-200 ${navLinkClass}`}
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
            className={`inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-black/5 ${mobileIconClass}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-marketing-menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-marketing-menu"
          className="lg:hidden bg-white border-t border-black/5 shadow-lg"
        >
          <div className="px-5 py-6 space-y-1">
            {/* Services in mobile */}
            <p className="font-body px-3 py-1 text-xs uppercase tracking-widest mb-1 text-[oklch(0.5_0.02_50)]">
              Services
            </p>
            <Link
              href="/services"
              className="font-body flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-semibold text-[oklch(0.18_0.03_50)] transition-colors hover:bg-[oklch(0.94_0.03_80)]"
              onClick={() => setMobileOpen(false)}
            >
              View all services
              <ChevronDown
                className="rotate-[-90deg]"
                size={14}
                aria-hidden="true"
              />
            </Link>
            {services.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="font-body flex items-center justify-between px-3 py-2.5 rounded-md transition-colors hover:bg-[oklch(0.94_0.03_80)]"
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-sm font-medium text-[oklch(0.18_0.03_50)]">
                  {service.label}
                </span>
                <span className="text-xs text-[oklch(0.5_0.02_50)]">
                  {service.desc}
                </span>
              </Link>
            ))}
            <div className="border-t border-black/5 my-3" />
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
