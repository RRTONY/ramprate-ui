import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "../..");

describe("managed deployment launcher", () => {
  it("creates the runtime entrypoint expected by the managed platform after building", async () => {
    const packageJson = JSON.parse(
      await readFile(resolve(projectRoot, "package.json"), "utf8"),
    ) as { scripts: Record<string, string> };

    expect(packageJson.scripts.postbuild).toContain(
      "cp scripts/managed-start.mjs dist/index.js",
    );
  });

  it("starts Next.js on the platform-supplied port without a hardcoded listener", async () => {
    const launcher = await readFile(
      resolve(projectRoot, "scripts/managed-start.mjs"),
      "utf8",
    );

    expect(launcher).toContain('process.env.PORT ?? "3000"');
    expect(launcher).toContain("next({ dev: false, hostname, port })");
    expect(launcher).toContain("handle(request, response)");
  });
});
