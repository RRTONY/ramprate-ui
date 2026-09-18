import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Champions unified public system", () => {
  it("uses plain-language service references and the shared navy-and-gold program tokens", async () => {
    const [page, css] = await Promise.all([
      readFile(resolve(process.cwd(), "src/app/champions/page.tsx"), "utf8"),
      readFile(resolve(process.cwd(), "src/app/globals.css"), "utf8"),
    ]);

    expect(page).toContain('tag: "Growth Strategy & Fractional Execution"');
    expect(page).toContain('tag: "Blockchain & Payment Infrastructure"');
    expect(page).toContain(
      'href: "/services/relationship-specialist-sourcing"',
    );
    expect(page).not.toContain('tag: "Syzygy"');
    expect(page).not.toContain('tag: "Stratum"');
    expect(css).toContain("--champion-night: #071221;");
    expect(css).toContain("--champion: #b88716;");
    expect(css).not.toContain("--champion: #7728cc;");
  });

  it("uses utilities for the fixed hero surface and typography while retaining program actions", async () => {
    const page = await readFile(
      resolve(process.cwd(), "src/app/champions/page.tsx"),
      "utf8",
    );

    expect(page).toContain("bg-[radial-gradient");
    expect(page).toContain("font-display");
    expect(page).toContain("font-mono");
    expect(page).toContain('href="#apply"');
    expect(page).toContain('href="#qualifies"');
    const hero = page.slice(
      page.indexOf("{/* ═══ HERO ═══ */}"),
      page.indexOf("{/* ═══ 01 HOW IT WORKS ═══ */}"),
    );
    expect(hero).not.toContain("style={{");
  });

  it("keeps only mapped divider and spacing geometry inline after fixed presentation extraction", async () => {
    const page = await readFile(
      resolve(process.cwd(), "src/app/champions/page.tsx"),
      "utf8",
    );

    expect(page.match(/style=\{\{/g) ?? []).toHaveLength(4);
    expect(page).toContain("index === 0");
    expect(page).toContain("rowIndex === 0");
    expect(page).not.toContain("fontFamily:");
  });
});
