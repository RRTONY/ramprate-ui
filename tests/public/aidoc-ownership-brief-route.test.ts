import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (path: string) => resolve(process.cwd(), path);

describe("Aidoc ownership brief route", () => {
  it("mounts its interactive gate as a client component and retains public route metadata", async () => {
    const [page, gate] = await Promise.all([
      readFile(projectFile("src/app/aidoc-ownership-brief/page.tsx"), "utf8"),
      readFile(
        projectFile("src/app/aidoc-ownership-brief/AiDocGate.tsx"),
        "utf8",
      ),
    ]);

    expect(gate.startsWith('"use client";')).toBe(true);
    expect(gate).toContain("useState");
    expect(page).toContain('import AiDocGate from "./AiDocGate"');
    expect(page).toContain("<AiDocGate />");
    expect(page).toContain('canonical: "/aidoc-ownership-brief"');
    expect(page).toContain("<JsonLd");
  });
});
