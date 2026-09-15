import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("shared footer brand links", () => {
  it("uses the current Torque brand and live public route", async () => {
    const source = await readFile(
      resolve(process.cwd(), "src/components/layout/Footer.tsx"),
      "utf8",
    );

    expect(source).toContain('label: "Torque"');
    expect(source).toContain('href: "/torque"');
    expect(source).toContain('desc: "Litigation Counsel Sourcing"');
    expect(source).not.toContain('label: "Private Advisory"');
  });
});
