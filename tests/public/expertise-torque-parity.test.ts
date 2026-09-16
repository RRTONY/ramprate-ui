import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Expertise compatibility route", () => {
  it("permanently redirects the retired multi-brand expertise page to the plain-language Services hub", async () => {
    const source = await readFile(
      resolve(process.cwd(), "src/app/expertise/page.tsx"),
      "utf8",
    );

    expect(source).toContain('permanentRedirect("/services")');
    expect(source).not.toContain("Five Brands");
    expect(source).not.toContain('name: "Torque"');
  });
});
