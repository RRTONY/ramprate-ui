import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const findYourPathSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/app/flow/find-your-path/FindYourPathClient.tsx",
  ),
  "utf8",
);
const flowStyles = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/globals.css"),
  "utf8",
);

describe("Flow Find Your Path motion", () => {
  it("uses scoped reduced-motion-safe CSS instead of Framer Motion for presentation layers", () => {
    expect(findYourPathSource).not.toContain("framer-motion");
    expect(findYourPathSource).not.toContain("<motion.");
    expect(findYourPathSource).not.toContain("<AnimatePresence");
    expect(findYourPathSource).toContain("flow-find-your-path-hero-enter");
    expect(findYourPathSource).toContain("flow-find-your-path-question-enter");
    expect(findYourPathSource).toContain("flow-find-your-path-guidance-icon");
    expect(findYourPathSource).toContain("flow-find-your-path-portal-panel");
    expect(flowStyles).toContain(
      "@keyframes flow-find-your-path-question-enter",
    );
    expect(flowStyles).toContain(
      "@keyframes flow-find-your-path-guidance-icon",
    );
    expect(flowStyles).toContain("prefers-reduced-motion: reduce");
  });

  it("retains interactive portals, content-driven icon colors, and all internal and external destinations", () => {
    expect(findYourPathSource).toContain(
      "setActivePortal(activePortal === portal.id ? null : portal.id)",
    );
    expect(findYourPathSource).toContain("setHoveredQuestion(i)");
    expect(findYourPathSource).toContain("setHoveredQuestion(null)");
    expect(findYourPathSource).toContain(
      "style={{ backgroundColor: `${portal.color}30` }}",
    );
    expect(findYourPathSource).toContain("style={{ color: portal.color }}");
    expect(findYourPathSource).toContain('link: "/assessment"');
    expect(findYourPathSource).toContain('link: "/soulprint"');
    expect(findYourPathSource).toContain('link: "/team-builder"');
    expect(findYourPathSource).toContain('link: "https://impactsoul.is"');
    expect(findYourPathSource).toContain('link: "https://tonygreenberg.com"');
  });
});
