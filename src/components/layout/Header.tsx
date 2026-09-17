"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
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
  const servicesMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeOnPointerAway = (event: PointerEvent) => {
      if (!servicesMenuRef.current?.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setServicesOpen(false);
    };

    document.addEventListener("pointerdown", closeOnPointerAway);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnPointerAway);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const lightBgPaths = [
    "/attorney",
    "/henry-jannol",
    "/josh-bykowski",
    "/legal-master",
  ];
  const lightBgExactPaths = ["/biochain", "/biochain-sourcing"];
  const isLightPage =
    lightBgPaths.some((path) => pathname.startsWith(path)) ||
    lightBgExactPaths.includes(pathname);
  const dark = scrolled || isLightPage;
  const navLinkClass = dark
    ? "text-[#152337] hover:text-[#050b14]"
    : "text-white/80 hover:text-white";
  const mobileIconClass = dark ? "text-[#152337]" : "text-white";
  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <nav
      className={`rr-public-header ${dark ? "is-scrolled" : ""}`}
      aria-label="Primary navigation"
    >
      <div className="rr-public-header-inner">
        <Link
          href="/"
          className="rr-public-header-logo"
          aria-label="RampRate home"
        >
          <Logo variant={dark ? "dark" : "light"} size="md" />
        </Link>

        <div className="rr-public-header-desktop hidden lg:flex">
          <div
            ref={servicesMenuRef}
            className="rr-header-services relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              aria-expanded={servicesOpen}
              aria-controls="public-services-menu"
              className={`rr-public-nav-link ${navLinkClass}`}
              onClick={() => setServicesOpen((open) => !open)}
            >
              Services
              <ChevronDown
                size={14}
                strokeWidth={1.8}
                aria-hidden="true"
                className={servicesOpen ? "rotate-180" : ""}
              />
            </button>
            {servicesOpen ? (
              <div
                id="public-services-menu"
                className="rr-header-services-panel"
                aria-label="RampRate services"
              >
                <div className="rr-header-services-panel-top">
                  <p className="rr-header-menu-kicker">Find your leverage</p>
                  <Link
                    href="/services"
                    className="rr-header-services-index"
                    onClick={() => setServicesOpen(false)}
                  >
                    All services <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
                <div className="rr-header-services-list">
                  {services.map((service, index) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className="rr-header-service-link"
                      onClick={() => setServicesOpen(false)}
                    >
                      <span className="rr-header-service-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <span className="rr-header-service-title">
                          {service.label}
                        </span>
                        <span className="rr-header-service-description">
                          {service.desc}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setServicesOpen(false)}
              className={`rr-public-nav-link ${navLinkClass}`}
            >
              {item.label}
            </Link>
          ))}

          <div className="rr-public-header-utilities">
            <HeaderSearch scrolled={dark} />
            <SiteSearch scrolled={dark} />
            <Link href="/contact" className="rr-header-cta">
              Book a Call <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="rr-public-header-mobile lg:hidden">
          <HeaderSearch scrolled={dark} />
          <SiteSearch scrolled={dark} />
          <button
            type="button"
            className={`rr-mobile-menu-toggle ${mobileIconClass}`}
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-marketing-menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div id="mobile-marketing-menu" className="rr-public-mobile-menu">
          <div className="rr-public-mobile-menu-inner">
            <div className="rr-mobile-menu-group">
              <p className="rr-mobile-menu-label">Services</p>
              <Link
                href="/services"
                className="rr-mobile-services-index"
                onClick={closeMobileMenu}
              >
                View all services <ArrowRight size={15} aria-hidden="true" />
              </Link>
              {services.map((service, index) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className="rr-mobile-service-link"
                  onClick={closeMobileMenu}
                >
                  <span className="rr-header-service-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="rr-header-service-title">
                      {service.label}
                    </span>
                    <span className="rr-header-service-description">
                      {service.desc}
                    </span>
                  </span>
                </Link>
              ))}
            </div>

            <div className="rr-mobile-menu-group rr-mobile-menu-links">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rr-mobile-nav-link"
                  onClick={closeMobileMenu}
                >
                  {item.label}
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              ))}
            </div>

            <Link
              href="/contact"
              className="rr-mobile-menu-cta"
              onClick={closeMobileMenu}
            >
              Book a Call <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
