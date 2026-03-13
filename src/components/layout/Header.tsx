'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useState, useEffect} from 'react'
import Logo from '@/components/shared/Logo'
import SiteSearch from '@/components/shared/SiteSearch'

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

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [practicesOpen, setPracticesOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, {passive: true})
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false)
    setPracticesOpen(false)
  }, [pathname])

  // Earth-tone colors matching reference site
  const navTextColor = scrolled ? 'oklch(0.35 0.03 50)' : 'rgba(255,255,255,0.8)'
  const navHoverColor = scrolled ? 'oklch(0.18 0.03 50)' : '#ffffff'
  const mobileIconColor = scrolled ? 'oklch(0.18 0.03 50)' : '#ffffff'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-black/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16 sm:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Logo variant={scrolled ? 'dark' : 'light'} size="md" />
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
              className="text-sm font-medium tracking-wide uppercase transition-colors duration-300"
              style={{color: navTextColor, fontFamily: 'var(--font-body)'}}
              onMouseEnter={e => (e.currentTarget.style.color = navHoverColor)}
              onMouseLeave={e => (e.currentTarget.style.color = navTextColor)}
            >
              Practices
            </button>
            {practicesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                <div className="bg-white rounded-lg shadow-xl border border-black/5 p-4 min-w-[220px]">
                  {practices.map((p) => (
                    <Link
                      key={p.href}
                      href={p.href}
                      className="flex items-center justify-between px-3 py-2.5 rounded-md transition-colors group"
                      style={{fontFamily: 'var(--font-body)'}}
                      onClick={() => setPracticesOpen(false)}
                      onMouseEnter={e => (e.currentTarget.style.background = 'oklch(0.94 0.03 80)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span
                        className="text-sm font-medium transition-colors"
                        style={{color: 'oklch(0.18 0.03 50)'}}
                      >
                        {p.label}
                      </span>
                      <span className="text-xs" style={{color: 'oklch(0.5 0.02 50)'}}>
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
              className="text-sm font-medium tracking-wide uppercase transition-colors duration-300"
              style={{color: navTextColor, fontFamily: 'var(--font-body)'}}
              onMouseEnter={e => (e.currentTarget.style.color = navHoverColor)}
              onMouseLeave={e => (e.currentTarget.style.color = navTextColor)}
            >
              {item.label}
            </Link>
          ))}

          <SiteSearch scrolled={scrolled} />

          <Link
            href="/contact"
            className="ml-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 shadow-sm"
            style={{
              background: 'oklch(0.82 0.15 75)',
              color: 'oklch(0.18 0.03 50)',
              fontFamily: 'var(--font-body)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'oklch(0.78 0.16 75)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'oklch(0.82 0.15 75)')}
          >
            Tell Us What&apos;s Broken
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <SiteSearch scrolled={scrolled} />
          <button
            className="p-2 transition-colors"
            style={{color: mobileIconColor}}
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
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-black/5 shadow-lg">
          <div className="px-5 py-6 space-y-1">
            {/* Practices in mobile */}
            <p
              className="px-3 py-1 text-xs uppercase tracking-widest mb-1"
              style={{color: 'oklch(0.5 0.02 50)', fontFamily: 'var(--font-body)'}}
            >
              Practices
            </p>
            {practices.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="flex items-center justify-between px-3 py-2.5 rounded-md transition-colors"
                style={{fontFamily: 'var(--font-body)'}}
                onClick={() => setMobileOpen(false)}
                onMouseEnter={e => (e.currentTarget.style.background = 'oklch(0.94 0.03 80)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span className="text-sm font-medium" style={{color: 'oklch(0.18 0.03 50)'}}>{p.label}</span>
                <span className="text-xs" style={{color: 'oklch(0.5 0.02 50)'}}>{p.desc}</span>
              </Link>
            ))}
            <div className="border-t border-black/5 my-3" />
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-3 text-sm font-medium rounded-md transition-colors"
                style={{color: 'oklch(0.18 0.03 50)', fontFamily: 'var(--font-body)'}}
                onClick={() => setMobileOpen(false)}
                onMouseEnter={e => (e.currentTarget.style.background = 'oklch(0.94 0.03 80)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3">
              <Link
                href="/contact"
                className="block text-center px-5 py-3 rounded-md text-sm font-semibold"
                style={{
                  background: 'oklch(0.82 0.15 75)',
                  color: 'oklch(0.18 0.03 50)',
                  fontFamily: 'var(--font-body)',
                }}
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
