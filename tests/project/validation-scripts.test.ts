import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("project validation scripts", () => {
  it("keeps the production build deterministic and exposes a typecheck health command", async () => {
    const packageFile = new URL("../../package.json", import.meta.url);
    const packageJson = JSON.parse(await readFile(packageFile, "utf8")) as {
      scripts: Record<string, string>;
    };

    expect(packageJson.scripts.build).toBe(
      "NODE_ENV=production next build --webpack",
    );
    expect(packageJson.scripts.typecheck).toBe("tsc --noEmit");
    expect(packageJson.scripts.check).toBe("pnpm typecheck");
  });
});
