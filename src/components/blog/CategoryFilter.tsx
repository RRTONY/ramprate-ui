"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
}

function FilterPills({ categories }: { categories: Category[] }) {
  const searchParams = useSearchParams();
  const active = searchParams.get("category");

  const pill =
    "font-body shrink-0 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.12em] transition-all whitespace-nowrap";
  const activeClass = "bg-gold text-dark";
  const inactiveClass = "bg-white/4 text-white/50 border border-white/8";

  return (
    <div className="relative pt-6 mb-10 pb-8 border-b border-white/7">
      {/* Right fade - hint that more pills exist off-screen */}
      <div className="absolute right-0 top-6 bottom-8 w-12 z-10 pointer-events-none bg-[linear-gradient(to_left,var(--dark)_30%,transparent)]" />

      <div className="flex gap-2 overflow-x-auto no-scrollbar pl-0.5 pr-14 pb-1">
        <Link
          href="/blog"
          className={`${pill} hover:opacity-80 ${!active ? activeClass : inactiveClass}`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/blog?category=${cat.slug.current}`}
            className={`${pill} hover:opacity-80 ${
              active === cat.slug.current ? activeClass : inactiveClass
            }`}
          >
            {cat.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

function FilterSkeleton() {
  return (
    <div className="relative pt-6 mb-10 pb-8 border-b border-white/7">
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-1 pb-1">
        {[50, 70, 90, 60, 80, 55, 75, 65, 85].map((w, i) => (
          <div
            key={i}
            className="shrink-0 h-8 rounded-full animate-pulse bg-white/7"
            style={{ width: `${w}px`, animationDelay: `${i * 60}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function CategoryFilter({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <Suspense fallback={<FilterSkeleton />}>
      <FilterPills categories={categories} />
    </Suspense>
  );
}
