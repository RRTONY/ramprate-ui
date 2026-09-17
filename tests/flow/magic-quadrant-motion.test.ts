import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const quadrantSource = fs.readFileSync(
  path.join(process.cwd(), "src/components/flow/MagicQuadrant.tsx"),
  "utf8",
);
const flowStyles = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/globals.css"),
  "utf8",
);

describe("Flow Magic Quadrant motion", () => {
  it("uses CSS and SVG feedback instead of Framer Motion", () => {
    expect(quadrantSource).not.toContain("framer-motion");
    expect(quadrantSource).not.toContain("<motion.");
    expect(quadrantSource).not.toContain("AnimatePresence");
    expect(quadrantSource).toContain("flow-magic-quadrant-point");
    expect(quadrantSource).toContain("flow-magic-quadrant-connection");
    expect(quadrantSource).toContain("flow-magic-quadrant-detail-enter");
    expect(flowStyles).toContain("@keyframes flow-magic-quadrant-enter");
    expect(flowStyles).toContain(
      "@keyframes flow-magic-quadrant-connection-draw",
    );
    expect(flowStyles).toContain("prefers-reduced-motion: reduce");
  });

  it("retains dynamic geometry, filtering, selection, connections, and external-link behavior", () => {
    expect(quadrantSource).toContain("setFilterMode");
    expect(quadrantSource).toContain("togglePhase");
    expect(quadrantSource).toContain("setSelectedItem(item)");
    expect(quadrantSource).toContain("left: `${item.x}%`");
    expect(quadrantSource).toContain("top: `${100 - item.y}%`");
    expect(quadrantSource).toContain('activePhase === "kinetic"');
    expect(quadrantSource).toContain('target="_blank"');
    expect(quadrantSource).toContain('rel="noopener noreferrer"');
  });
});
