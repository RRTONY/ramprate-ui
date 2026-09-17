import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const wizardSource = fs.readFileSync(
  path.join(process.cwd(), "src/components/flow/OnboardingWizard.tsx"),
  "utf8",
);
const flowStyles = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/globals.css"),
  "utf8",
);

describe("Flow Onboarding Wizard motion", () => {
  it("uses reduced-motion-safe CSS rather than Framer Motion and Unicode checklist marks", () => {
    expect(wizardSource).not.toContain("framer-motion");
    expect(wizardSource).not.toContain("<motion.");
    expect(wizardSource).not.toContain("AnimatePresence");
    expect(wizardSource).not.toContain('icon: "⚡"');
    expect(wizardSource).toContain("flow-onboarding-backdrop");
    expect(wizardSource).toContain("flow-onboarding-step-enter");
    expect(wizardSource).toContain("BarChart3");
    expect(flowStyles).toContain("@keyframes flow-onboarding-step-enter");
    expect(flowStyles).toContain("prefers-reduced-motion: reduce");
  });

  it("retains step navigation, invitation feedback, team routing, and close behavior", () => {
    expect(wizardSource).toContain("setStep(step + 1)");
    expect(wizardSource).toContain("navigator.clipboard.writeText(inviteLink)");
    expect(wizardSource).toContain(
      "router.push(`/flow/team-map?team=${teamCode}`)",
    );
    expect(wizardSource).toContain('router.push("/flow/team-builder")');
    expect(wizardSource).toContain("onClose()");
  });
});
