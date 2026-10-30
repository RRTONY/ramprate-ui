type TimelineItem = { year: string; event: string };

export default function Timeline({ timeline }: { timeline: TimelineItem[] }) {
  return (
    <div
      aria-label="RampRate milestones, scrolling from right to left"
      className="group relative overflow-hidden py-2"
      tabIndex={0}
    >
      <div className="timeline-marquee flex w-max items-start group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 items-start"
          >
            {timeline.map((item) => (
              <div
                key={item.year}
                className="relative w-[220px] shrink-0 px-3 text-center sm:w-[270px]"
              >
                <div className="absolute left-0 right-0 top-[5px] h-px bg-black/10" />
                <div className="relative z-10 mx-auto mb-4 h-3 w-3 rounded-full bg-rust" />
                <span className="font-mono text-lg font-bold text-rust">
                  {item.year}
                </span>
                <p className="font-body mt-2 text-sm leading-relaxed text-ink-mid">
                  {item.event}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="sr-only">
        The timeline moves automatically. Hover over it or focus it to pause.
      </p>
    </div>
  );
}
