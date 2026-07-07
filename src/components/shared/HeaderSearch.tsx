"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";

interface Props {
  scrolled?: boolean;
}

export default function HeaderSearch({ scrolled = false }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Stable close - defined early so effects can reference it
  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  // Close when route pathname changes (navigating to a different page)
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  // Escape key to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  // Auto-redirect + close 600 ms after typing stops (min 2 chars)
  // Closes overlay immediately so it doesn't linger on the search page
  useEffect(() => {
    const q = query.trim();
    if (!open || q.length < 2) return;
    const timer = setTimeout(() => {
      close();
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }, 600);
    return () => clearTimeout(timer);
  }, [query, open, router, close]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;
    close();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const iconColor = scrolled ? "oklch(0.35 0.03 50)" : "rgba(255,255,255,0.8)";

  return (
    <>
      {/* Search icon trigger */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-lg transition-all hover:opacity-65"
        aria-label="Search site"
        style={{ color: iconColor }}
      >
        <Search size={18} />
      </button>

      {open && (
        <>
          {/* Backdrop - above header (z-50) */}
          <div
            className="fixed inset-0 z-55 bg-black/30 backdrop-blur-sm"
            onClick={close}
          />

          {/* Search bar - full-width, exact header height, above backdrop */}
          <div
            className="fixed inset-x-0 top-0 z-60 h-16 sm:h-20 flex items-center px-4 sm:px-8 shadow-xl"
            style={{
              background: "rgba(255,255,255,0.99)",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <form
              onSubmit={submit}
              className="flex items-center gap-3 w-full max-w-7xl mx-auto"
            >
              <Search
                size={18}
                className="shrink-0"
                style={{ color: "oklch(0.55 0.03 50)" }}
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, blog posts, insights..."
                className="flex-1 bg-transparent outline-none text-sm sm:text-base"
                style={{
                  color: "oklch(0.18 0.03 50)",
                  fontFamily: "var(--font-body)",
                }}
              />
              {/* Pulsing gold dot while debounce is counting down */}
              {query.trim().length >= 2 && (
                <span
                  className="shrink-0 w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: "oklch(0.82 0.15 75)" }}
                />
              )}
              <button
                type="button"
                onClick={close}
                className="p-1.5 rounded-lg transition-all shrink-0 hover:opacity-60"
                style={{ color: "oklch(0.5 0.03 50)" }}
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}
