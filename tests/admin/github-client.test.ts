import { describe, expect, it } from "vitest";
import { truncateLogTail } from "@/lib/admin/github-client";

describe("truncateLogTail", () => {
  it("returns short logs unchanged", () => {
    const log = "line 1\nline 2\nerror: something broke";
    expect(truncateLogTail(log)).toBe(log);
  });

  it("keeps only the last 200 lines of a long log", () => {
    const lines = Array.from({ length: 500 }, (_, i) => `line ${i}`);
    const result = truncateLogTail(lines.join("\n"));
    const resultLines = result.split("\n");
    expect(resultLines.length).toBe(200);
    expect(resultLines[0]).toBe("line 300");
    expect(resultLines[resultLines.length - 1]).toBe("line 499");
  });

  it("caps output at 8000 characters even for 200 long lines", () => {
    const lines = Array.from({ length: 200 }, (_, i) => `x`.repeat(100) + i);
    const result = truncateLogTail(lines.join("\n"));
    expect(result.length).toBeLessThanOrEqual(8000);
    // The end of the log (where the real failure lives) must survive the cap.
    expect(result.endsWith("199")).toBe(true);
  });
});
