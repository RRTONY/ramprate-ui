import Link from 'next/link'
import Image from 'next/image'
import {urlFor} from '@/lib/sanity/image'

interface SocialLink {
  platform: string
  url: string
}

interface FooterProps {
  companyName?: string
  logo?: any
  bCorpBadge?: any
  footerText?: any
  address?: {street?: string; city?: string; state?: string; zip?: string}
  phone?: string
  email?: string
  socialLinks?: SocialLink[]
}

const brandLinks = [
  {label: 'RampRate', href: '/sourcing', desc: 'Enterprise IT Sourcing'},
  {label: 'Syzygy', href: '/growth', desc: 'Growth Strategy'},
  {label: 'Stratum', href: '/web3', desc: 'Web3 & Blockchain'},
  {label: 'ImpactSoul', href: '/impactsoul', desc: 'Impact & Regenerative'},
]

const companyLinks = [
  {label: 'Proof', href: '/proof'},
  {label: 'About', href: '/about'},
  {label: 'Process', href: '/process'},
  {label: 'Blog', href: '/blog'},
  {label: 'Thinking', href: '/thinking'},
  {label: 'Engage', href: '/contact'},
]

export default function Footer({
  companyName,
  logo,
  bCorpBadge,
  phone,
  email,
  socialLinks,
}: FooterProps) {
  const linkedinUrl = socialLinks?.find((l) => l.platform === 'linkedin')?.url || 'https://www.linkedin.com/company/ramprate'
  const twitterUrl = socialLinks?.find((l) => l.platform === 'twitter')?.url || 'https://twitter.com/ramprate'

  return (
    <footer style={{background: 'oklch(0.14 0.01 250)'}} className="text-white/60 py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Column 1 — Brand */}
          <div>
            <Link href="/" className="block mb-4">
              {logo ? (
                <Image
                  src={urlFor(logo).width(140).height(36).url()}
                  alt={companyName || 'RampRate'}
                  width={140}
                  height={36}
                  style={{filter: 'brightness(0) invert(1)'}}
                />
              ) : (
                <Image
                  src="/ramprate-logo.png"
                  alt="RampRate"
                  width={140}
                  height={36}
                  style={{filter: 'brightness(0) invert(1)'}}
                />
              )}
            </Link>
            <p className="text-xs text-white/30 mb-5 leading-relaxed" style={{fontFamily: 'var(--font-body)'}}>
              Since 2000. A fractional team of superstars creating trajectory-changing connections.
            </p>
            {bCorpBadge ? (
              <Image
                src={urlFor(bCorpBadge).width(60).height(60).url()}
                alt="Certified B Corporation"
                width={60}
                height={60}
              />
            ) : (
              <span
                className="text-[10px] font-medium border border-white/20 rounded px-2 py-0.5 tracking-wider uppercase text-white/40"
                style={{fontFamily: 'var(--font-mono)'}}
              >
                B Corp Certified
              </span>
            )}
          </div>

          {/* Column 2 — Brands */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-4"
              style={{fontFamily: 'var(--font-body)'}}
            >
              Brands
            </h4>
            <ul className="space-y-3">
              {brandLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group block"
                    style={{fontFamily: 'var(--font-body)'}}
                  >
                    <span className="text-sm text-white/70 group-hover:text-white transition-colors block">
                      {link.label}
                    </span>
                    <span className="text-xs text-white/30">{link.desc}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Company */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-4"
              style={{fontFamily: 'var(--font-body)'}}
            >
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                    style={{fontFamily: 'var(--font-body)'}}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Engage */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-4"
              style={{fontFamily: 'var(--font-body)'}}
            >
              Engage
            </h4>
            <div className="space-y-2 mb-6">
              <a
                href={`mailto:${email || 'hello@ramprate.com'}`}
                className="text-sm text-white/50 hover:text-white transition-colors block"
                style={{fontFamily: 'var(--font-body)'}}
              >
                {email || 'hello@ramprate.com'}
              </a>
              <a
                href={`tel:${phone || '+13106228989'}`}
                className="text-sm text-white/50 hover:text-white transition-colors block"
                style={{fontFamily: 'var(--font-body)'}}
              >
                {phone || '+1 (310) 622-8989'}
              </a>
            </div>
            <div className="flex gap-4">
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-white transition-colors"
                aria-label="X / Twitter"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30" style={{fontFamily: 'var(--font-body)'}}>
            &copy; {new Date().getFullYear()} {companyName || 'RampRate'}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-white/30 hover:text-white/50 transition-colors" style={{fontFamily: 'var(--font-body)'}}>
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-white/30 hover:text-white/50 transition-colors" style={{fontFamily: 'var(--font-body)'}}>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
