"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SuggestedPage {
  title: string;
  path: string;
  description: string;
}

interface SuggestedPost {
  title?: string;
  slug?: string;
  section?: string;
  excerpt?: string;
}

export function useSearchSuggestions(query: string) {
  const [pages, setPages] = useState<SuggestedPage[]>([]);
  const [posts, setPosts] = useState<SuggestedPost[]>([]);
  const q = query.trim();

  useEffect(() => {
    if (q.length < 2) return;

    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          setPages(data.pages || []);
          setPosts(data.posts || []);
        })
        .catch(() => {});
    }, 200);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q]);

  // Derived at render time rather than reset via an effect - avoids an
  // extra render/setState cycle and keeps the "query too short" case a
  // pure function of the current input instead of stale leftover state.
  const effectivePages = q.length < 2 ? [] : pages;
  const effectivePosts = q.length < 2 ? [] : posts;

  return {
    pages: effectivePages,
    posts: effectivePosts,
    hasResults: effectivePages.length > 0 || effectivePosts.length > 0,
  };
}

export function SearchSuggestionsDropdown({
  pages,
  posts,
  query,
  onNavigate,
  variant = "dark",
}: {
  pages: SuggestedPage[];
  posts: SuggestedPost[];
  query: string;
  onNavigate: () => void;
  variant?: "dark" | "light";
}) {
  if (pages.length === 0 && posts.length === 0) return null;

  const isDark = variant === "dark";
  const mutedColor = isDark ? "rgba(255,255,255,0.4)" : "oklch(0.5 0.02 50)";
  const labelColor = isDark ? "rgba(255,255,255,0.35)" : "oklch(0.55 0.02 50)";
  const titleColor = isDark ? "white" : "oklch(0.2 0.02 50)";

  return (
    <div
      className="absolute left-0 right-0 top-full mt-2 rounded-xl overflow-hidden shadow-2xl z-50"
      style={{
        background: isDark ? "oklch(0.16 0.02 260)" : "white",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <div className="max-h-[60vh] overflow-y-auto py-2">
        {pages.length > 0 && (
          <div className="px-2 mb-1">
            <p
              className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: labelColor, fontFamily: "var(--font-body)" }}
            >
              Pages
            </p>
            {pages.map((p) => (
              <Link
                key={p.path}
                href={p.path}
                onClick={onNavigate}
                className="block px-3 py-2 rounded-lg transition-colors hover:bg-[rgba(212,168,67,0.08)]"
              >
                <p className="text-sm font-semibold" style={{ color: titleColor, fontFamily: "var(--font-body)" }}>
                  {p.title}
                </p>
                <p className="text-xs line-clamp-1" style={{ color: mutedColor, fontFamily: "var(--font-body)" }}>
                  {p.description}
                </p>
              </Link>
            ))}
          </div>
        )}
        {posts.length > 0 && (
          <div className="px-2">
            <p
              className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: labelColor, fontFamily: "var(--font-body)" }}
            >
              Blog &amp; Thinking
            </p>
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/${post.section === "thinking" ? "thinking" : "blog"}/${post.slug}`}
                onClick={onNavigate}
                className="block px-3 py-2 rounded-lg transition-colors hover:bg-[rgba(212,168,67,0.08)]"
              >
                <p className="text-sm font-semibold line-clamp-1" style={{ color: titleColor, fontFamily: "var(--font-body)" }}>
                  {post.title}
                </p>
                {post.excerpt && (
                  <p className="text-xs line-clamp-1" style={{ color: mutedColor, fontFamily: "var(--font-body)" }}>
                    {post.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
      <Link
        href={`/search?q=${encodeURIComponent(query)}`}
        onClick={onNavigate}
        className="block px-4 py-2.5 text-xs font-semibold text-center border-t transition-opacity hover:opacity-75"
        style={{
          color: "var(--gold)",
          borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
          fontFamily: "var(--font-body)",
        }}
      >
        See all results for &ldquo;{query}&rdquo; →
      </Link>
    </div>
  );
}
