'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, MessageSquare } from 'lucide-react'

const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfK922nBlVCLc26ByHIh-2MBjcdURRdQow1sKWFGPGv9wbNRQ/viewform?embedded=true'
const FORM_LINK = 'https://forms.gle/K5QuamnhVYKAxx22A'
const STORAGE_KEY = 'rr_survey_dismissed'

export default function ExitSurvey() {
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    const d = sessionStorage.getItem(STORAGE_KEY)
    if (!d) setDismissed(false)
  }, [])

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (e.clientY <= 0 && !open && !dismissed) {
        setOpen(true)
      }
    },
    [open, dismissed]
  )

  useEffect(() => {
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [handleMouseLeave])

  const close = () => {
    setOpen(false)
    setDismissed(true)
    sessionStorage.setItem(STORAGE_KEY, '1')
  }

  return (
    <>
      {/* persistent tab — bottom-right */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-transform"
          style={{
            background: 'oklch(0.82 0.15 75)',
            color: 'oklch(0.15 0.02 75)',
            boxShadow: '0 8px 24px oklch(0.82 0.15 75 / 0.25)',
            fontFamily: 'var(--font-body)',
          }}
          aria-label="Quick survey"
        >
          <MessageSquare size={16} />
          <span className="hidden sm:inline">Quick Survey</span>
        </button>
      )}

      {/* modal overlay */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-xl overflow-hidden shadow-2xl" style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)' }}>
            {/* header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
              <p className="text-white/90 text-sm font-semibold" style={{ fontFamily: 'var(--font-body)' }}>
                30-Second Exit Survey
              </p>
              <button
                onClick={close}
                className="text-white/50 hover:text-white transition-colors"
                aria-label="Close survey"
              >
                <X size={18} />
              </button>
            </div>

            {/* embedded form */}
            <iframe
              src={FORM_URL}
              className="w-full border-0"
              style={{ height: '480px' }}
              title="RampRate Exit Survey"
              loading="lazy"
            />

            {/* fallback link */}
            <div className="px-5 py-2 border-t border-white/10 text-center">
              <a
                href={FORM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/40 hover:text-white/60 transition-colors underline"
              >
                Open in new tab
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
