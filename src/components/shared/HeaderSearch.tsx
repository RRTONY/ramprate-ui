"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { useSearchSuggestions, SearchSuggestionsDropdown } from "./SearchSuggestions";
import { SITE_PAGES } from "@/lib/site-pages";

interface Props {
  scrolled?: boolean;
}

// Shown before the visitor has typed anything (2+ chars are required to hit
// the live /api/search suggestions below) - a handful of hand-picked
// destinations rather than a blank bar with nothing to click.
const DEFAULT_SUGGESTION_PATHS = ["/proof", "/expertise", "/biochain-sourcing", "/blog"];
const DEFAULT_SUGGESTIONS = SITE_PAGES.filter((p) => DEFAULT_SUGGESTION_PATHS.includes(p.path));

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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;
    close();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const iconColor = scrolled ? "oklch(0.35 0.03 50)" : "rgba(255,255,255,0.8)";
  const { pages, posts } = useSearchSuggestions(open ? query : "");

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
              className="relative flex items-center gap-3 w-full max-w-7xl mx-auto"
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
              {query.trim().length >= 2 ? (
                <button
                  type="submit"
                  className="p-1.5 rounded-lg transition-all shrink-0 hover:opacity-70"
                  style={{ color: "var(--gold)" }}
                  aria-label="Go to search results"
                >
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={close}
                  className="p-1.5 rounded-lg transition-all shrink-0 hover:opacity-60"
                  style={{ color: "oklch(0.5 0.03 50)" }}
                  aria-label="Close search"
                >
                  <X size={18} />
                </button>
              )}
              {query.trim().length >= 2 ? (
                <SearchSuggestionsDropdown
                  pages={pages}
                  posts={posts}
                  query={query.trim()}
                  onNavigate={close}
                  variant="light"
                />
              ) : (
                <div
                  className="absolute left-0 right-0 top-full mt-2 rounded-xl overflow-hidden shadow-2xl z-50"
                  style={{ background: "white", border: "1px solid rgba(0,0,0,0.08)" }}
                >
                  <div className="px-2 py-2">
                    <p
                      className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: "oklch(0.55 0.02 50)", fontFamily: "var(--font-body)" }}
                    >
                      Popular
                    </p>
                    {DEFAULT_SUGGESTIONS.map((p) => (
                      <Link
                        key={p.path}
                        href={p.path}
                        onClick={close}
                        className="block px-3 py-2 rounded-lg transition-colors hover:bg-[rgba(212,168,67,0.08)]"
                      >
                        <p className="text-sm font-semibold" style={{ color: "oklch(0.2 0.02 50)", fontFamily: "var(--font-body)" }}>
                          {p.title}
                        </p>
                        <p className="text-xs line-clamp-1" style={{ color: "oklch(0.5 0.02 50)", fontFamily: "var(--font-body)" }}>
                          {p.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>
        </>
      )}
    </>
  );
}
