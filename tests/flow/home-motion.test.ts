import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const homeSource = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/HomeClient.tsx"),
  "utf8",
);
const flowStyles = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/globals.css"),
  "utf8",
);

describe("Flow home motion", () => {
  it("uses reduced-motion-safe CSS instead of Framer Motion for display and hover feedback", () => {
    expect(homeSource).not.toContain("framer-motion");
    expect(homeSource).not.toContain("<motion.");
    expect(homeSource).toContain("flow-home-hero-enter");
    expect(homeSource).toContain("flow-home-actions-enter");
    expect(homeSource).toContain("flow-home-note-enter");
    expect(homeSource).toContain("flow-home-role-card");
    expect(homeSource).toContain("flow-home-path-enter--delayed");
    expect(flowStyles).toContain("@keyframes flow-home-hero-enter");
    expect(flowStyles).toContain(".flow-home-role-card:hover");
    expect(flowStyles).toContain("prefers-reduced-motion: reduce");
  });

  it("retains the primary assessment and science actions, role cards, team submission, and calculator", () => {
    expect(homeSource).toContain('href="/flow/assessment"');
    expect(homeSource).toContain('href="/flow/science"');
    expect(homeSource).toContain(
      "router.push(\n        `/flow/assessment?team=${encodeURIComponent(teamCode.trim())}`,",
    );
    expect(homeSource).toContain("Find Your Natural Role");
    expect(homeSource).toContain("Spark");
    expect(homeSource).toContain("Conductor");
    expect(homeSource).toContain(
      'placeholder="Enter your company domain (e.g. ramprate.com)"',
    );
    expect(homeSource).toContain("<FrictionDashboard />");
  });
});
