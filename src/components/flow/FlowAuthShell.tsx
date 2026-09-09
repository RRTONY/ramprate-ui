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
    <div className="relative isolate min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_84%_15%,oklch(0.72_0.15_68/0.72),transparent_31rem),radial-gradient(circle_at_10%_78%,oklch(0.36_0.13_32/0.85),transparent_34rem),linear-gradient(122deg,oklch(0.14_0.035_28),oklch(0.25_0.09_28)_56%,oklch(0.31_0.11_39))] px-4 pb-16 pt-24 sm:px-6 sm:pt-32 lg:flex lg:items-center lg:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-35 [background-image:linear-gradient(oklch(0.83_0.15_83/0.1)_1px,transparent_1px),linear-gradient(90deg,oklch(0.83_0.15_83/0.1)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="pointer-events-none absolute -left-14 top-40 -z-10 size-48 rounded-full border border-[oklch(0.83_0.15_83/0.24)] sm:size-72" />
      <div className="pointer-events-none absolute -right-14 bottom-10 -z-10 size-52 rounded-full border border-white/15 sm:size-80" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.8fr] lg:gap-16">
        <aside className="max-w-xl lg:pb-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[oklch(0.83_0.15_83/0.32)] bg-black/15 px-3 py-1.5 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[oklch(0.89_0.12_83)] shadow-sm backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-[oklch(0.83_0.15_83)] shadow-[0_0_0_4px_oklch(0.83_0.15_83/0.14)]" />
            {eyebrow}
          </div>
          <h1 className="max-w-lg font-display text-4xl font-bold leading-[0.96] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/78 sm:text-lg">
            {description}
          </p>

          <div
            className="mt-7 flex flex-wrap gap-2.5"
            aria-label="Flow Circuit outcomes"
          >
            {signalPoints.map((point, index) => (
              <span
                key={point}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/15 px-3 py-2 text-xs font-medium text-white/88 shadow-sm backdrop-blur-sm"
              >
                {index === 1 ? (
                  <Network
                    className="size-3.5 text-[oklch(0.83_0.15_83)]"
                    aria-hidden="true"
                  />
                ) : (
                  <Activity
                    className="size-3.5 text-[oklch(0.9_0.13_83)]"
                    aria-hidden="true"
                  />
                )}
                {point}
              </span>
            ))}
          </div>
        </aside>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[1.75rem] bg-linear-to-br from-[oklch(0.83_0.15_83/0.35)] via-white/0 to-[oklch(0.49_0.16_32/0.45)] blur-xl" />
          {children}
        </div>
      </div>
    </div>
  );
}
