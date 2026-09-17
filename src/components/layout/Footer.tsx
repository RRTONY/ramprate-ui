import Link from "next/link";
import { ArrowRight, ArrowUpRight, Linkedin, Twitter } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { toTelHref } from "@/lib/utils";

interface SocialLink {
  platform: string;
  url: string;
}

interface FooterProps {
  companyName?: string;
  phone?: string;
  email?: string;
  socialLinks?: SocialLink[];
}

const serviceLinks = [
  {
    label: "Relationship & Specialist Sourcing",
    href: "/services/relationship-specialist-sourcing",
  },
  {
    label: "Deal & Partnership Structuring",
    href: "/services/deal-partnership-structuring",
  },
  {
    label: "Blockchain & Payment Infrastructure",
    href: "/services/blockchain-tokenization-payment-infrastructure",
  },
  {
    label: "Growth Strategy & Fractional Execution",
    href: "/services/growth-strategy-fractional-execution",
  },
];

const companyLinks = [
  { label: "Case Studies", href: "/proof" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
];

export default function Footer({
  companyName,
  phone,
  email,
  socialLinks,
}: FooterProps) {
  const linkedinUrl =
    socialLinks?.find((link) => link.platform === "linkedin")?.url ||
    "https://www.linkedin.com/company/ramprate";
  const twitterUrl =
    socialLinks?.find((link) => link.platform === "twitter")?.url ||
    "https://twitter.com/ramprate";
  const contactEmail = email || "hello@ramprate.com";
  const contactPhone = phone || "+1(909)235-9945";

  return (
    <footer className="rr-public-footer">
      <div className="rr-public-footer-shell">
        <div className="rr-footer-intro">
          <div>
            <p className="rr-footer-kicker">Decision leverage, since 2000</p>
            <h2 className="rr-footer-heading">
              Make the next complex decision a clearer one.
            </h2>
          </div>
          <Link href="/contact" className="rr-footer-intro-cta">
            Book a Call <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="rr-footer-grid">
          <div className="rr-footer-brand-column">
            <Link
              href="/"
              className="rr-footer-logo"
              aria-label="RampRate home"
            >
              <Logo variant="light" size="md" />
            </Link>
            <p className="rr-footer-brand-copy">
              Senior-led advisory for complex technology, partnership, and
              growth decisions.
            </p>
            <a
              href="https://www.bcorporation.net/en-us/find-a-b-corp/company/ramp-rate-a-team-inc/"
              target="_blank"
              rel="noreferrer"
              className="rr-footer-cert"
            >
              <span aria-hidden="true" /> B Lab Certified
              <ArrowUpRight size={12} aria-hidden="true" />
            </a>
            <Link href="/impactsoul" className="rr-footer-impactsol">
              <span>ImpactSol</span>
              <small>A separate RampRate brand</small>
            </Link>
          </div>

          <div className="rr-footer-column">
            <p className="rr-footer-column-label">Services</p>
            <ul className="rr-footer-link-list">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
            <Link href="/services" className="rr-footer-all-services">
              All services <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>

          <div className="rr-footer-column">
            <p className="rr-footer-column-label">Company</p>
            <ul className="rr-footer-link-list">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rr-footer-column rr-footer-contact-column">
            <p className="rr-footer-column-label">Contact</p>
            <a
              href={`mailto:${contactEmail}`}
              className="rr-footer-contact-link"
            >
              {contactEmail}
            </a>
            <a
              href={`tel:${toTelHref(contactPhone)}`}
              className="rr-footer-contact-link"
            >
              {contactPhone}
            </a>
            <div
              className="rr-footer-socials"
              aria-label="RampRate social links"
            >
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rr-footer-social-icon"
                aria-label="LinkedIn"
              >
                <Linkedin size={17} strokeWidth={1.8} aria-hidden="true" />
              </a>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rr-footer-social-icon"
                aria-label="X / Twitter"
              >
                <Twitter size={17} strokeWidth={1.8} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="rr-footer-bottom">
          <p>
            © {new Date().getFullYear()} {companyName || "RampRate"}. All rights
            reserved.
          </p>
          <div>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
