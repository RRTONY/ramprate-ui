"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TimelineItem = {
  year: string;
  event: string;
};

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
      <div className="relative hidden md:block">
        <div
          ref={trackRef}
          className="flex gap-0 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {timeline.map((item) => (
            <div key={item.year} className="relative w-[200px] flex-shrink-0">
              <div className="flex flex-col items-center">
                <div className="relative z-10 mb-3 h-3 w-3 rounded-full bg-gold" />
                <div className="absolute top-1.5 left-1/2 h-px w-full bg-white/10" />
                <span className="font-mono mb-2 text-lg font-bold text-gold">
                  {item.year}
                </span>
                <p className="font-body px-3 text-center text-xs leading-relaxed text-white/50">
                  {item.event}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll timeline left"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll timeline right"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-0 md:hidden">
        {timeline.map((item, index) => (
          <div key={item.year} className="relative flex gap-5">
            <div className="flex flex-col items-center">
              <div className="relative z-10 h-3 w-3 shrink-0 rounded-full bg-gold" />
              {index < timeline.length - 1 && (
                <div className="mt-1 w-px flex-1 bg-white/10" />
              )}
            </div>
            <div className="pb-8">
              <span className="font-mono text-sm font-bold text-gold">
                {item.year}
              </span>
              <p className="font-body mt-1 text-sm leading-relaxed text-white/50">
                {item.event}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
