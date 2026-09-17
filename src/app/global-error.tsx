"use client";

import { useEffect } from "react";

// global-error replaces the entire document when the root layout itself throws,
// so it cannot rely on globals.css. Its semantic classes use a self-contained
// stylesheet that matches the shared public dark and gold visual system.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <style>{`
          .rr-global-error-body { margin: 0; background: #0a0f1a; }
          .rr-global-error-shell { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 0 20px; font-family: "DM Sans", sans-serif; }
          .rr-global-error-content { text-align: center; }
          .rr-global-error-code { margin: 0 0 1rem; color: rgba(255,255,255,.06); font-size: clamp(3rem, 12vw, 6rem); font-weight: 700; line-height: 1; }
          .rr-global-error-title { margin: 0 0 1rem; color: #fff; font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 700; }
          .rr-global-error-copy { max-width: 28rem; margin: 0 auto 2.5rem; color: rgba(255,255,255,.65); }
          .rr-global-error-retry { display: inline-flex; align-items: center; gap: .6rem; border: 0; border-radius: 6px; padding: .9rem 1.75rem; background: #d4a843; color: #0a0f1a; cursor: pointer; font: 600 .875rem "DM Sans", sans-serif; }
          .rr-global-error-retry:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
          .rr-global-error-retry:active { transform: scale(.97); }
        `}</style>
      </head>
      <body className="rr-global-error-body">
        <main
          className="rr-global-error-shell"
          role="alert"
          aria-live="assertive"
        >
          <div className="rr-global-error-content">
            <p className="rr-global-error-code">500</p>
            <h1 className="rr-global-error-title">Something Went Wrong</h1>
            <p className="rr-global-error-copy">
              An unexpected error occurred. Please try again.
            </p>
            <button onClick={() => retry()} className="rr-global-error-retry">
              Try Again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
