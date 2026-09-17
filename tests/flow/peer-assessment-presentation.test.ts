import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (path: string) => resolve(process.cwd(), path);

describe("Peer Assessment presentation", () => {
  it("uses scoped CSS for its fixed intro texture while retaining progress derived from the question flow", async () => {
    const [source, publicCss, flowCss] = await Promise.all([
      readFile(
        projectFile("src/app/flow/peer-assessment/PeerAssessmentClient.tsx"),
        "utf8",
      ),
      readFile(projectFile("src/app/globals.css"), "utf8"),
      readFile(projectFile("src/app/flow/globals.css"), "utf8"),
    ]);

    expect(source).toContain("peer-assessment-intro-texture");
    expect(source).not.toContain("transparenttextures.com/patterns/cubes.png");
    expect(publicCss).toContain(".peer-assessment-intro-texture {");
    expect(publicCss).toContain("transparenttextures.com/patterns/cubes.png");
    expect(source).toContain("flow-peer-progress-bar");
    expect(source).toContain("style={{ width: `${progress}%` }}");
    expect(flowCss).toContain(".flow-peer-progress-bar {");
  });
});
