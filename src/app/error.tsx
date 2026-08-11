"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
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
    <div className="min-h-screen flex items-center justify-center px-5 bg-dark">
      <div className="text-center">
        <p className="font-mono font-bold leading-none mb-4 text-white/6 text-[clamp(3rem,12vw,6rem)]">
          500
        </p>
        <h1 className="font-display font-bold text-white mb-4 text-[clamp(1.5rem,4vw,2.5rem)]">
          Something Went Wrong
        </h1>
        <p className="font-body mb-10 max-w-md mx-auto text-white/45">
          An unexpected error occurred while loading this page. Please try
          again.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => retry()}
            className="font-body inline-flex items-center gap-2.5 px-7 py-3.5 rounded-md text-sm font-semibold transition-opacity hover:opacity-90 bg-gold text-dark"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="font-body inline-flex items-center gap-2.5 px-7 py-3.5 rounded-md text-sm font-semibold border border-white/20 text-white transition-opacity hover:opacity-90"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
