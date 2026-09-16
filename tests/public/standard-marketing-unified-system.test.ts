import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("standard marketing public system", () => {
  it("keeps How We Work in the shared public visual and conversion language", async () => {
    const page = await readFile(
      resolve(process.cwd(), "src/app/howwework/page.tsx"),
      "utf8",
    );

    expect(page).toContain("bg-[var(--rr-navy-mid)]");
    expect(page).toContain('href="/contact"');
    expect(page).toContain('href="/proof"');
    expect(page).toContain('buttonText="Book a Call"');
    expect(page).not.toContain("Start a Conversation");
  });
});
