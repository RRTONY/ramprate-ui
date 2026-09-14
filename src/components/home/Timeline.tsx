"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TimelineItem = { year: string; event: string };

export default function Timeline({ timeline }: { timeline: TimelineItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    trackRef.current?.scrollBy({
      left: direction === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Desktop: horizontal, arrow-driven (native scrollbar hidden) */}
      <div className="hidden md:block relative">
        <div
          ref={trackRef}
          className="flex gap-0 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {timeline.map((item) => (
            <div key={item.year} className="flex-shrink-0 w-[200px] relative">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full relative z-10 mb-3 bg-gold" />
                <div className="absolute top-1.5 left-1/2 w-full h-px bg-white/10" />
                <span className="font-mono text-lg font-bold mb-2 text-gold">
                  {item.year}
                </span>
                <p className="font-body text-xs text-center leading-relaxed px-3 text-white/50">
                  {item.event}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-3 mt-4">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll timeline left"
            className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 transition-colors hover:text-white hover:border-white/30"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll timeline right"
            className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 transition-colors hover:text-white hover:border-white/30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Mobile: vertical */}
      <div className="md:hidden space-y-0">
        {timeline.map((item, i) => (
          <div key={item.year} className="flex gap-5 relative">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full shrink-0 relative z-10 bg-gold" />
              {i < timeline.length - 1 && (
                <div className="w-px flex-1 mt-1 bg-white/10" />
              )}
            </div>
            <div className="pb-8">
              <span className="font-mono text-sm font-bold text-gold">
                {item.year}
              </span>
              <p className="font-body text-sm mt-1 leading-relaxed text-white/50">
                {item.event}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
