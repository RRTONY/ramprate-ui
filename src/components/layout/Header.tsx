'use client'

import Link from 'next/link'
import Image from 'next/image'
import {useState, useEffect} from 'react'
import {urlFor} from '@/lib/sanity/image'

interface NavItem {
  label: string
  href: string
}

interface HeaderProps {
  companyName?: string
  logo?: any
  navigation?: NavItem[]
}

const defaultNav: NavItem[] = [
  {label: 'Expertise', href: '/expertise'},
  {label: 'Proof', href: '/proof'},
  {label: 'About', href: '/about'},
  {label: 'Blog', href: '/blog'},
  {label: 'Thinking', href: '/thinking'},
  {label: 'Contact', href: '/contact'},
]

export default function Header({companyName, logo, navigation}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, {passive: true})
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = navigation?.length ? navigation : defaultNav

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
        <Link href="/" className="flex items-center gap-3">
          {logo ? (
            <Image
              src={urlFor(logo).width(160).height(40).url()}
              alt={companyName || 'RampRate'}
              width={160}
              height={40}
              priority
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
        <div className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium tracking-wide uppercase transition-opacity duration-200 hover:opacity-100"
              style={{
                color: 'rgba(255,255,255,0.75)',
                fontFamily: 'var(--font-body)',
              }}
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
          className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
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
          className="md:hidden border-t shadow-xl"
          style={{background: 'rgba(10,15,26,0.98)', borderColor: 'rgba(255,255,255,0.06)'}}
        >
          <div className="px-5 py-6 space-y-1">
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
