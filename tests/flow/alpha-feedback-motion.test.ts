import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Alpha Feedback CSS motion migration", () => {
  it("uses scoped CSS for fixed entry effects while retaining feedback interactions", async () => {
    const [component, css] = await Promise.all([
      readFile(
        resolve(process.cwd(), "src/app/flow/feedback/AlphaFeedbackClient.tsx"),
        "utf8",
      ),
      readFile(resolve(process.cwd(), "src/app/globals.css"), "utf8"),
    ]);

    expect(component).not.toContain("framer-motion");
    expect(component).toContain("flow-alpha-feedback-heading");
    expect(component).toContain("flow-alpha-feedback-success");
    expect(component).toContain("submitFeedback.mutate");
    expect(component).toContain("setAccuracyRating");

    expect(css).toContain("@keyframes flow-alpha-feedback-heading");
    expect(css).toContain("@keyframes flow-alpha-feedback-success");
    expect(css).toContain("@media (prefers-reduced-motion: no-preference)");
  });
});
