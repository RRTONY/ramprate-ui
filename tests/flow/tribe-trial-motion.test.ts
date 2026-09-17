import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const tribeTrialSource = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/tribe-trial/TribeTrialClient.tsx"),
  "utf8",
);
const flowStyles = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/globals.css"),
  "utf8",
);

describe("Flow Tribe Trial motion", () => {
  it("uses reduced-motion-safe CSS rather than Framer Motion", () => {
    expect(tribeTrialSource).not.toContain("framer-motion");
    expect(tribeTrialSource).not.toContain("<motion.");
    expect(tribeTrialSource).toContain("flow-tribe-trial-enter");
    expect(tribeTrialSource).toContain("flow-tribe-trial-success-enter");
    expect(tribeTrialSource).toContain('"--flow-entry-delay": "80ms"');
    expect(flowStyles).toContain("@keyframes flow-tribe-trial-enter");
    expect(flowStyles).toContain("prefers-reduced-motion: reduce");
  });

  it("retains signup validation, mutation feedback, and result navigation", () => {
    expect(tribeTrialSource).toContain(
      "signup.mutate({ name: name.trim(), email: email.trim(), source })",
    );
    expect(tribeTrialSource).toContain(
      "Please enter your name and work email.",
    );
    expect(tribeTrialSource).toContain('router.push("/flow/results")');
    expect(tribeTrialSource).toContain('router.push("/flow/assessment")');
    expect(tribeTrialSource).toContain("setSubmitted(true)");
  });
});
