import Image from "next/image";
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

const brandLinks = [
  { label: "RampRate", href: "/sourcing", desc: "Enterprise IT Sourcing" },
  { label: "Syzygy", href: "/growth", desc: "Growth Strategy" },
  { label: "Stratum", href: "/web3", desc: "Web3 & Blockchain" },
  { label: "BioChain", href: "/biochain", desc: "Verified Bio-Sourcing" },
  { label: "ImpactSoul", href: "/impactsoul", desc: "Impact & Regenerative" },
  {
    label: "Torque",
    href: "/torque",
    desc: "Critical Issue Management",
  },
];

const companyLinks = [
  { label: "Proof", href: "/proof" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Thinking", href: "/thinking" },
  { label: "Careers", href: "/careers" },
  { label: "Engage", href: "/contact" },
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
    "https://x.com/ramprate";

  return (
    <footer className="bg-ed-ivory text-ed-ink border-t border-ed-line py-12 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-10 mb-10">
          {/* Column 1 - Brand */}
          <div className="col-span-2 lg:col-span-5 lg:pr-10">
            <Link href="/" className="inline-block mb-4">
              <Logo variant="dark" size="md" />
            </Link>
            <p className="font-body text-[15px] text-ed-muted leading-relaxed max-w-md">
              Since 2000, we&apos;ve brought extraordinary people, ideas, and
              organizations together to solve difficult problems, challenge
              conventional thinking, and create outcomes that change what&apos;s
              possible.
            </p>
            <a
              href="https://www.bcorporation.net/en-us/find-a-b-corp/company/ramp-rate-a-team-inc/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-3 rounded-md text-sm font-medium text-ed-ink hover:underline underline-offset-4"
            >
              <Image
                src="/bcorp-logo.svg"
                alt="Certified B Corporation"
                width={30}
                height={44}
                className="h-11 w-auto"
                unoptimized
              />
              View our B Lab profile
            </a>
          </div>

          {/* Column 2 - Brands */}
          <div className="lg:col-span-3">
            <p className="font-body text-sm font-semibold text-ed-ink mb-3">
              Practices
            </p>
            <ul className="space-y-2">
              {brandLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    title={link.desc}
                    className="font-body text-[15px] text-ed-muted hover:text-ed-forest transition-colors"
                  >
                    {link.label}
                    <span className="hidden sm:inline text-sm text-ed-muted/80">
                      {" "}
                      · {link.desc}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Company */}
          <div className="lg:col-span-2">
            <p className="font-body text-sm font-semibold text-ed-ink mb-3">
              Company
            </p>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-[15px] text-ed-muted hover:text-ed-forest transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Engage */}
          <div className="col-span-2 lg:col-span-2">
            <p className="font-body text-sm font-semibold text-ed-ink mb-3">
              Engage
            </p>
            <div className="space-y-2 mb-5">
              <a
                href={`mailto:${email || "hello@ramprate.com"}`}
                className="font-body text-[15px] text-ed-muted hover:text-ed-forest transition-colors block break-all"
              >
                {email || "hello@ramprate.com"}
              </a>
              <a
                href={`tel:${toTelHref(phone || "+19092359945")}`}
                className="font-body text-[15px] text-ed-muted hover:text-ed-forest transition-colors block"
              >
                {phone || "+1(909)235-9945"}
              </a>
            </div>
            <div className="flex gap-4">
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ed-muted hover:text-ed-forest transition-colors"
                aria-label="LinkedIn"
              >
                <svg
                  width="20"
                  height="20"
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
                className="text-ed-muted hover:text-ed-forest transition-colors"
                aria-label="X / Twitter"
              >
                <svg
                  width="20"
                  height="20"
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
        <div className="border-t border-ed-line pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-sm text-ed-muted">
            &copy; {new Date().getFullYear()} {companyName || "RampRate"}. All
            rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="font-body text-sm text-ed-muted hover:text-ed-forest transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="font-body text-sm text-ed-muted hover:text-ed-forest transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
