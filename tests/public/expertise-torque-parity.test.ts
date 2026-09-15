import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Expertise Torque parity", () => {
  it("uses the current live Torque practice identity and route", async () => {
    const source = await readFile(
      resolve(process.cwd(), "src/app/expertise/page.tsx"),
      "utf8",
    );

    expect(source).toContain('name: "Torque"');
    expect(source).toContain('href: "/torque"');
    expect(source).toContain('"$10B+ Transacted"');
    expect(source).toContain("litigation counsel sourcing");
    expect(source).not.toContain('name: "Private Advisory"');
  });
});
