import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readSource = (relativePath: string) =>
  readFile(resolve(process.cwd(), relativePath), "utf8");

describe("public homepage refresh contract", () => {
  it("keeps an accessible grouped Services navigation and canonical public destinations", async () => {
    const header = await readSource("src/components/layout/Header.tsx");

    expect(header).toContain('aria-label="Primary navigation"');
    expect(header).toContain('aria-controls="public-services-menu"');
    expect(header).toContain("aria-expanded={servicesOpen}");
    expect(header).toContain('event.key === "Escape"');
    expect(header).toContain('href="/services"');
    expect(header).toContain('{ label: "Case Studies", href: "/proof" }');
    expect(header).toContain('{ label: "About", href: "/about" }');
    expect(header).toContain('{ label: "Blog", href: "/blog" }');
    expect(header).toContain('{ label: "Contact Us", href: "/contact" }');
    expect(header).toContain("Relationship & Specialist Sourcing");
    expect(header).toContain("Growth Strategy & Fractional Execution");
    expect(header).not.toContain('className="rr-header-cta"');
    expect(header).toContain('className="rr-mobile-menu-cta"');
  });

  it("keeps the public footer’s service, legal, impact, and contact paths", async () => {
    const footer = await readSource("src/components/layout/Footer.tsx");

    expect(footer).toContain('href="/impactsoul"');
    expect(footer).toContain('href="/services"');
    expect(footer).toContain('href="/contact"');
    expect(footer).toContain('href="/privacy"');
    expect(footer).toContain('href="/terms"');
    expect(footer).toContain("A separate RampRate brand");
    expect(footer).toContain("Book a Call");
    expect(footer).toContain('className="rr-footer-social-icon"');
    expect(footer).toContain('aria-label="LinkedIn"');
    expect(footer).toContain('aria-label="X / Twitter"');
    expect(footer).not.toContain("LinkedIn <ArrowUpRight");
  });

  it("uses liquid-glass hero accents, readable evidence-led proof, and a managed video fallback", async () => {
    const [home, clientWall, media, styles] = await Promise.all([
      readSource("src/components/home/HomeContent.tsx"),
      readSource("src/components/home/ClientWall.tsx"),
      readSource("src/components/home/CinematicHeroMedia.tsx"),
      readSource("src/app/globals.css"),
    ]);

    expect(home).toContain("B Lab Certified");
    expect(home).toContain("Book a Call");
    expect(home).toContain("View Case Studies");
    expect(clientWall).toContain("25 Years Inside the World&apos;s Most");
    expect(clientWall).toContain("$10B+ in decisions transacted");
    expect(clientWall).toContain("A decision record, not a logo wall");
    expect(clientWall).toContain("aria-expanded={showAllClients}");
    expect(clientWall).toContain("rr-client-ledger-icon");
    expect(clientWall).toContain("iconLabel");
    expect(home).toContain("paramount-editorial_6bc75d56.jpg");
    expect(home).toContain("ebay-editorial_2f4aaef4.jpg");
    expect(home).toContain("noia-editorial_7fa1f45a.jpg");
    expect(home).toContain("home-proof-card-image");
    expect(home).toContain("rr-booking-action");
    expect(media).toContain("/hero.webp");
    expect(media).toContain("ramprate-cinematic-hero-loop_9982d784.mp4");
    expect(media).toContain("onCanPlay={() => setVideoReady(true)}");
    expect(media).toContain('"is-ready"');
    expect(styles).toContain(".rr-public-header {");
    expect(styles).toContain(".rr-public-footer {");
    expect(styles).toContain(".home-blue-eyebrow > span,");
    expect(styles).toContain("backdrop-filter: blur(16px) saturate(125%)");
    expect(styles).toContain(".home-blue-actions > a:last-child {");
    expect(styles).toContain(".rr-client-wall-ledger {");
    expect(styles).toContain(".rr-client-ledger-icon {");
    expect(styles).toContain(".home-compensation-section {");
    expect(styles).toContain("--rr-gold-deep: #75570f");
    expect(styles).toContain(".rr-footer-socials .rr-footer-social-icon {");
    expect(styles).toContain("@media (min-width: 1024px)");
    expect(styles).toContain(".rr-public-header-mobile {");
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
