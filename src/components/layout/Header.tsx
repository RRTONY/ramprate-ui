'use client'

import Link from 'next/link'
import Image from 'next/image'
import {useState, useEffect, useRef} from 'react'
import {urlFor} from '@/lib/sanity/image'

interface HeaderProps {
  companyName?: string
  logo?: any
}

const practices = [
  {label: 'Sourcing', href: '/sourcing', desc: 'Enterprise IT'},
  {label: 'Syzygy', href: '/growth', desc: 'Founders'},
  {label: 'Stratum', href: '/web3', desc: 'Web3'},
  {label: 'ImpactSoul', href: '/impactsoul', desc: 'NGOs'},
]

const navItems = [
  {label: 'Process', href: '/process'},
  {label: 'Proof', href: '/proof'},
  {label: 'About', href: '/about'},
  {label: 'Blog', href: '/blog'},
  {label: 'Thinking', href: '/thinking'},
  {label: 'Engage', href: '/contact'},
]

export default function Header({companyName, logo}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [practicesOpen, setPracticesOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, {passive: true})
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(10,15,26,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16 sm:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          {logo ? (
            <Image
              src={urlFor(logo).width(160).height(40).url()}
              alt={companyName || 'RampRate'}
              width={160}
              height={40}
              priority
              style={{filter: 'brightness(0) invert(1)'}}
            />
          ) : (
            <Image
              src="/ramprate-logo.png"
              alt="RampRate"
              width={160}
              height={41}
              priority
              style={{filter: 'brightness(0) invert(1)'}}
            />
          )}
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Practices dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setPracticesOpen(true)}
            onMouseLeave={() => setPracticesOpen(false)}
          >
            <button
              className="text-sm font-medium tracking-wide uppercase transition-colors duration-300 hover:opacity-100"
              style={{color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-body)'}}
            >
              Practices
            </button>
            {practicesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                <div
                  className="rounded-lg shadow-xl p-4 min-w-[220px]"
                  style={{background: 'rgba(10,15,26,0.97)', border: '1px solid rgba(255,255,255,0.08)'}}
                >
                  {practices.map((p) => (
                    <Link
                      key={p.href}
                      href={p.href}
                      className="flex items-center justify-between px-3 py-2.5 rounded-md transition-colors group"
                      style={{fontFamily: 'var(--font-body)'}}
                      onClick={() => setPracticesOpen(false)}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span
                        className="text-sm font-medium"
                        style={{color: 'rgba(255,255,255,0.9)'}}
                      >
                        {p.label}
                      </span>
                      <span className="text-xs" style={{color: 'rgba(255,255,255,0.4)'}}>
                        {p.desc}
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
              className="text-sm font-medium tracking-wide uppercase transition-opacity duration-200 hover:opacity-100"
              style={{color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-body)'}}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/contact"
            className="ml-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 hover:opacity-90"
            style={{
              background: 'var(--gold)',
              color: 'var(--dark)',
              fontFamily: 'var(--font-body)',
            }}
          >
            Tell Us What&apos;s Broken
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-white/80 hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t shadow-xl"
          style={{background: 'rgba(10,15,26,0.98)', borderColor: 'rgba(255,255,255,0.06)'}}
        >
          <div className="px-5 py-6 space-y-1">
            {/* Practices in mobile */}
            <div className="pb-2">
              <p
                className="px-3 py-1 text-xs uppercase tracking-widest mb-1"
                style={{color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)'}}
              >
                Practices
              </p>
              {practices.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-md transition-colors hover:bg-white/5"
                  style={{fontFamily: 'var(--font-body)'}}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="text-sm font-medium" style={{color: 'rgba(255,255,255,0.85)'}}>
                    {p.label}
                  </span>
                  <span className="text-xs" style={{color: 'rgba(255,255,255,0.4)'}}>
                    {p.desc}
                  </span>
                </Link>
              ))}
            </div>
            <div className="border-t" style={{borderColor: 'rgba(255,255,255,0.06)'}} />
            <div className="pt-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-3 text-sm font-medium rounded-md transition-colors hover:bg-white/5"
                  style={{color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)'}}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pt-3">
              <Link
                href="/contact"
                className="block text-center px-5 py-3 rounded-md text-sm font-semibold"
                style={{background: 'var(--gold)', color: 'var(--dark)', fontFamily: 'var(--font-body)'}}
                onClick={() => setMobileOpen(false)}
              >
                Tell Us What&apos;s Broken
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
