import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "../..");

describe("managed Dockerfile", () => {
  it("builds the Next.js application and starts the generated managed runtime launcher", async () => {
    const dockerfile = await readFile(resolve(projectRoot, "Dockerfile"), "utf8");

    expect(dockerfile).toContain("corepack pnpm install --frozen-lockfile");
    expect(dockerfile).toContain("corepack pnpm run build");
    expect(dockerfile).toContain('CMD ["node", "dist/index.js"]');
    expect(dockerfile).toContain("ENV NODE_ENV=production");
  });
});
