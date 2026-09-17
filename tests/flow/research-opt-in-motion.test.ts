import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const optInSource = fs.readFileSync(
  path.join(process.cwd(), "src/components/flow/ResearchOptIn.tsx"),
  "utf8",
);
const flowStyles = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/globals.css"),
  "utf8",
);

describe("Flow Research Opt-In motion", () => {
  it("uses reduced-motion-safe CSS confirmation feedback rather than Framer Motion", () => {
    expect(optInSource).not.toContain("framer-motion");
    expect(optInSource).not.toContain("AnimatePresence");
    expect(optInSource).toContain("flow-research-opt-in-confirmation");
    expect(flowStyles).toContain(
      "@keyframes flow-research-opt-in-confirmation-enter",
    );
    expect(flowStyles).toContain("prefers-reduced-motion: reduce");
  });

  it("retains consent submission, pending feedback, local preference storage, and privacy copy", () => {
    expect(optInSource).toContain("updateResearchOptIn.useMutation");
    expect(optInSource).toContain("updateOptIn.mutateAsync");
    expect(optInSource).toContain(
      'localStorage.setItem("research_opt_in", "true")',
    );
    expect(optInSource).toContain("updateOptIn.isPending");
    expect(optInSource).toContain("Your data is anonymized");
  });
});
