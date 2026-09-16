import Link from "next/link";
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
    socialLinks?.find((l) => l.platform === "linkedin")?.url ||
    "https://www.linkedin.com/company/ramprate";
  const twitterUrl =
    socialLinks?.find((l) => l.platform === "twitter")?.url ||
    "https://twitter.com/ramprate";

  return (
    <footer className="text-white/80 py-16 section-dark">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1 - Brand */}
          <div>
            <Link href="/" className="block mb-4">
              <Logo variant="light" size="md" />
            </Link>
            <p className="font-body text-xs text-white/75 mb-5 leading-relaxed">
              Senior-led advisory for complex technology, partnership, and
              growth decisions.
            </p>
            <a
              href="https://www.bcorporation.net/en-us/find-a-b-corp/company/ramp-rate-a-team-inc/"
              target="_blank"
              rel="noreferrer"
              className="inline-block font-mono text-[10px] font-medium border border-white/30 rounded px-2 py-0.5 tracking-wider uppercase text-white/75 hover:border-white/60 hover:text-white transition-colors"
            >
              B Lab Certified
            </a>
            <Link
              href="/impactsoul"
              className="mt-5 block border-l border-gold/70 pl-3 text-sm font-semibold text-white transition-colors hover:text-gold"
            >
              ImpactSol{" "}
              <span className="block pt-1 text-xs font-normal text-white/60">
                A separate RampRate brand
              </span>
            </Link>
          </div>

          {/* Column 2 - Services */}
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-white/75 mb-4">
              Services
            </p>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-body group block">
                    <span className="text-sm text-white/90 group-hover:text-white transition-colors block">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/services"
              className="mt-5 inline-flex text-xs font-semibold uppercase tracking-[0.14em] text-gold transition-colors hover:text-gold-light"
            >
              View all services
            </Link>
          </div>

          {/* Column 3 - Company */}
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-white/75 mb-4">
              Company
            </p>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/75 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-white/75 mb-4">
              Contact Us
            </p>
            <Link
              href="/contact"
              className="mb-5 inline-flex rounded-full border border-gold/55 px-4 py-2 text-sm font-semibold text-gold transition-colors hover:border-gold hover:bg-gold hover:text-[#071221]"
            >
              Book a Call
            </Link>
            <div className="space-y-2 mb-6">
              <a
                href={`mailto:${email || "hello@ramprate.com"}`}
                className="font-body text-sm text-white/75 hover:text-white transition-colors block"
              >
                {email || "hello@ramprate.com"}
              </a>
              <a
                href={`tel:${toTelHref(phone || "+19092359945")}`}
                className="font-body text-sm text-white/75 hover:text-white transition-colors block"
              >
                {phone || "+1(909)235-9945"}
              </a>
            </div>
            <div className="flex gap-4">
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="X / Twitter"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-white/75">
            &copy; {new Date().getFullYear()} {companyName || "RampRate"}. All
            rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="font-body text-xs text-white/75 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="font-body text-xs text-white/75 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
