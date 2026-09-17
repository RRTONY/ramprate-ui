import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const journeySource = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/journey/JourneyClient.tsx"),
  "utf8",
);
const flowStyles = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/globals.css"),
  "utf8",
);

describe("Flow Journey motion and iconography", () => {
  it("uses reduced-motion-safe CSS and Lucide checklist icons instead of Framer Motion and Unicode checks", () => {
    expect(journeySource).not.toContain("framer-motion");
    expect(journeySource).not.toContain("<motion.");
    expect(journeySource).toContain("flow-journey-hero-enter");
    expect(journeySource).toContain("flow-journey-step-enter");
    expect(journeySource).toContain(
      "import { ArrowRight, Check, User, Users, Zap }",
    );
    expect(flowStyles).toContain("@keyframes flow-journey-enter");
    expect(flowStyles).toContain("prefers-reduced-motion: reduce");
  });

  it("retains all three journey phases and their destinations", () => {
    expect(journeySource).toContain("Phase 1: The Mirror");
    expect(journeySource).toContain("Phase 2: The Circuit");
    expect(journeySource).toContain("Phase 3: The Ritual");
    expect(journeySource).toContain('link: "/team-builder"');
    expect(journeySource).toContain('link: "/protocol"');
    expect(journeySource).toContain("animationDelay: `${index * 160}ms`");
  });
});
