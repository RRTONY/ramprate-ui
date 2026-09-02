import { describe, expect, it } from "vitest";
import { computeWorkflowSteps } from "@/lib/admin/workflow-steps";

describe("computeWorkflowSteps", () => {
  it("starts with just Write pending when nothing has changed yet", () => {
    const steps = computeWorkflowSteps({
      filePaths: [],
      draftCount: 0,
      checkStatus: "unknown",
      canPublish: false,
      published: false,
    });
    expect(steps.map((s) => s.id)).toEqual(["write", "publish"]);
    expect(steps[0].status).toBe("pending");
    expect(steps[1].status).toBe("pending");
  });

  it("requires a test step once code files are changed, and flags it missing", () => {
    const steps = computeWorkflowSteps({
      filePaths: ["src/lib/admin/workflow-steps.ts"],
      draftCount: 0,
      checkStatus: "unknown",
      canPublish: false,
      published: false,
    });
    const test = steps.find((s) => s.id === "test");
    expect(test?.status).toBe("pending");
    expect(test?.detail).toMatch(/doesn't include a test/);
  });

  it("marks the test step done once a matching tests/ file is included", () => {
    const steps = computeWorkflowSteps({
      filePaths: [
        "src/lib/admin/workflow-steps.ts",
        "tests/admin/workflow-steps.test.ts",
      ],
      draftCount: 0,
      checkStatus: "pending",
      canPublish: false,
      published: false,
    });
    const test = steps.find((s) => s.id === "test");
    expect(test?.status).toBe("done");
    // Checks are running, so it should be the active step.
    const checks = steps.find((s) => s.id === "checks");
    expect(checks?.status).toBe("active");
  });

  it("skips the test step for a content-only draft change with no code files", () => {
    const steps = computeWorkflowSteps({
      filePaths: [],
      draftCount: 1,
      checkStatus: "unknown",
      canPublish: false,
      published: false,
    });
    expect(steps.map((s) => s.id)).not.toContain("test");
    expect(steps.find((s) => s.id === "write")?.status).toBe("done");
  });

  it("locks Publish to pending when an earlier step has failed, even if canPublish is stale-true", () => {
    const steps = computeWorkflowSteps({
      filePaths: [
        "src/lib/admin/workflow-steps.ts",
        "tests/admin/workflow-steps.test.ts",
      ],
      draftCount: 0,
      checkStatus: "failure",
      canPublish: true,
      published: false,
    });
    const checks = steps.find((s) => s.id === "checks");
    const publish = steps.find((s) => s.id === "publish");
    expect(checks?.status).toBe("error");
    expect(publish?.status).toBe("pending");
  });

  it("marks Publish done once published, after checks passed", () => {
    const steps = computeWorkflowSteps({
      filePaths: [
        "src/lib/admin/workflow-steps.ts",
        "tests/admin/workflow-steps.test.ts",
      ],
      draftCount: 0,
      checkStatus: "success",
      canPublish: true,
      published: true,
    });
    expect(steps.every((s) => s.status === "done")).toBe(true);
  });
});
