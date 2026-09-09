import type { ReactNode } from "react";
import { Activity, Network } from "lucide-react";

type FlowAuthShellProps = {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
};

const signalPoints = ["Map team energy", "Locate friction", "Move with intent"];

export default function FlowAuthShell({
  children,
  eyebrow,
  title,
  description,
}: FlowAuthShellProps) {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[radial-gradient(circle_at_12%_22%,oklch(0.62_0.17_270/0.18),transparent_24rem),radial-gradient(circle_at_88%_72%,oklch(0.75_0.16_85/0.17),transparent_25rem)] px-4 pb-16 pt-24 sm:px-6 sm:pt-32 lg:flex lg:items-center lg:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70 [background-image:linear-gradient(oklch(0.35_0.05_270/0.05)_1px,transparent_1px),linear-gradient(90deg,oklch(0.35_0.05_270/0.05)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="pointer-events-none absolute -left-14 top-40 -z-10 size-48 rounded-full border border-primary/15 sm:size-72" />
      <div className="pointer-events-none absolute -right-14 bottom-10 -z-10 size-52 rounded-full border border-accent/20 sm:size-80" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.8fr] lg:gap-16">
        <aside className="max-w-xl lg:pb-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/55 px-3 py-1.5 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary shadow-sm backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-accent shadow-[0_0_0_4px_oklch(0.76_0.15_85/0.14)]" />
            {eyebrow}
          </div>
          <h1 className="max-w-lg font-display text-4xl font-bold leading-[0.96] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>

          <div
            className="mt-7 flex flex-wrap gap-2.5"
            aria-label="Flow Circuit outcomes"
          >
            {signalPoints.map((point, index) => (
              <span
                key={point}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/8 bg-white/50 px-3 py-2 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm"
              >
                {index === 1 ? (
                  <Network
                    className="size-3.5 text-secondary"
                    aria-hidden="true"
                  />
                ) : (
                  <Activity
                    className="size-3.5 text-primary"
                    aria-hidden="true"
                  />
                )}
                {point}
              </span>
            ))}
          </div>
        </aside>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[1.75rem] bg-linear-to-br from-primary/16 via-white/0 to-accent/18 blur-xl" />
          {children}
        </div>
      </div>
    </div>
  );
}
