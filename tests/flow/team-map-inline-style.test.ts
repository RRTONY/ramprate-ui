import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("Flow Team Map scatter-plot presentation styles", () => {
  it("uses scoped CSS for fixed chart shell and label presentation while retaining computed SVG data", async () => {
    const [source, stylesheet] = await Promise.all([
      readFile(
        new URL(
          "../../src/app/flow/team-map/TeamMapPageClient.tsx",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(
        new URL("../../src/app/flow/globals.css", import.meta.url),
        "utf8",
      ),
    ]);

    expect(source).toContain("flow-team-map-scatter");
    expect(source).toContain("flow-team-map-scatter-axis-label");
    expect(source).toContain("flow-team-map-scatter-chart");
    expect(source).toContain('x1="240"');
    expect(source).toContain("teamMembers.length");
    expect(source).not.toContain(
      'style={{ maxWidth: "540px", display: "block", margin: "0 auto" }}',
    );
    expect(source).not.toContain(
      'style={{ display: "flex", alignItems: "center" }}',
    );

    expect(stylesheet).toContain(".flow-team-map-scatter {");
    expect(stylesheet).toContain(".flow-team-map-scatter-axis-label {");
    expect(stylesheet).toContain(".flow-team-map-scatter-chart {");
  });
});
