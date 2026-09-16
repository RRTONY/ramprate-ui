"use client";

import { useState } from "react";

export interface FaqItem {
  q: string;
  a: React.ReactNode;
  searchText: string;
}

export default function PartnerFaqSection({
  items,
  dark = false,
}: {
  items: FaqItem[];
  dark?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());

  const q = query.trim().toLowerCase();

  function expandAll() {
    setOpenSet(new Set(items.map((_, i) => i)));
  }
  function collapseAll() {
    setOpenSet(new Set());
  }
  function toggle(i: number, open: boolean) {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (open) next.add(i);
      else next.delete(i);
      return next;
    });
  }

  return (
    <>
      <div className="flex gap-3 justify-end mb-4">
        <button
          onClick={expandAll}
          className="rounded-full border border-current px-3 py-1.5 text-[10px] font-mono uppercase tracking-wide opacity-80 hover:opacity-100"
        >
          Expand all
        </button>
        <button
          onClick={collapseAll}
          className="rounded-full border border-current px-3 py-1.5 text-[10px] font-mono uppercase tracking-wide opacity-80 hover:opacity-100"
        >
          Collapse all
        </button>
      </div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search this section"
        className={`w-full mb-6 rounded-xl border px-4 py-3 text-[15px] outline-none focus:border-gold ${
          dark
            ? "border-white/15 bg-dark-mid text-white placeholder:text-white/40"
            : "border-black/10 bg-white text-ink"
        }`}
      />
      <div className="grid sm:grid-cols-2 gap-3.5 items-start">
        {items.map((item, i) => {
          const match = !q || item.searchText.includes(q);
          const isOpen = openSet.has(i) || (q.length > 0 && match);
          return (
            <details
              key={i}
              open={isOpen}
              onToggle={(e) =>
                toggle(i, (e.target as HTMLDetailsElement).open)
              }
              className={`rounded-2xl border overflow-hidden ${
                dark
                  ? "border-white/10 bg-dark-mid"
                  : "border-black/10 bg-white"
              } ${match ? "" : "hidden"}`}
            >
              <summary
                className={`relative cursor-pointer list-none font-bold text-[17px] leading-tight px-5 py-4 pr-12 [&::-webkit-details-marker]:hidden ${
                  dark ? "text-white" : "text-ink"
                }`}
              >
                {item.q}
                <span className="absolute right-4 top-3.5 text-xl text-gold">
                  {isOpen ? "–" : "+"}
                </span>
              </summary>
              <div
                className={`px-5 pb-5 text-[15px] leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:my-1.5 [&_ul_ul]:mt-1.5 [&_ul_ul]:opacity-80 ${
                  dark ? "text-white/70" : "text-ink-mid"
                }`}
              >
                {item.a}
              </div>
            </details>
          );
        })}
      </div>
    </>
  );
}
