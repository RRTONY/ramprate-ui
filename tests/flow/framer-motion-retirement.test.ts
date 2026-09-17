import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const sourceRoot = join(process.cwd(), "src");

async function sourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return sourceFiles(path);
      return /\.(?:ts|tsx)$/.test(entry.name) ? [path] : [];
    }),
  );
  return files.flat();
}

describe("Framer Motion retirement", () => {
  it("keeps application source and package dependencies free of Framer Motion", async () => {
    const [packageJson, files] = await Promise.all([
      readFile(join(process.cwd(), "package.json"), "utf8"),
      sourceFiles(sourceRoot),
    ]);

    expect(packageJson).not.toContain('"framer-motion"');

    const matches = (
      await Promise.all(
        files.map(async (file) => {
          const source = await readFile(file, "utf8");
          return source.includes("framer-motion")
            ? relative(process.cwd(), file)
            : null;
        }),
      )
    ).filter((match): match is string => Boolean(match));

    expect(matches).toEqual([]);
  });
});
