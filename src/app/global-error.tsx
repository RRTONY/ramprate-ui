'use client'

import {useEffect} from 'react'

// global-error replaces the entire document when the root layout itself throws,
// so it can't reach globals.css or the app's CSS variables - colors are hardcoded
// to match --dark/--gold from globals.css.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & {digest?: string}
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body style={{margin: 0, background: '#0a0f1a'}}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 20px',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div style={{textAlign: 'center'}}>
            <p
              style={{
                fontWeight: 700,
                lineHeight: 1,
                marginBottom: '1rem',
                color: 'rgba(255,255,255,0.06)',
                fontSize: 'clamp(3rem, 12vw, 6rem)',
              }}
            >
              500
            </p>
            <h1
              style={{
                fontWeight: 700,
                color: 'white',
                marginBottom: '1rem',
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              }}
            >
              Something Went Wrong
            </h1>
            <p
              style={{
                marginBottom: '2.5rem',
                maxWidth: '28rem',
                marginLeft: 'auto',
                marginRight: 'auto',
                color: 'rgba(255,255,255,0.45)',
              }}
            >
              An unexpected error occurred. Please try again.
            </p>
            <button
              onClick={() => retry()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.9rem 1.75rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 600,
                background: '#d4a843',
                color: '#0a0f1a',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
