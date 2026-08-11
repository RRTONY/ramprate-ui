'use client'

import {useState, useEffect} from 'react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, {passive: true})
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
      <button
        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        className="fixed bottom-24 sm:bottom-20 right-6 z-50 flex items-center justify-center w-11 h-11 rounded-full bg-amber text-[oklch(0.15_0.02_75)] shadow-[0_8px_24px_oklch(0.82_0.15_75/0.25)]"
        style={{animation: 'float 2s ease-in-out infinite'}}
        aria-label="Scroll to top"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </>
  )
}
