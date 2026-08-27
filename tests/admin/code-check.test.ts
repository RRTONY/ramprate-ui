import { describe, expect, it } from "vitest";
import { checkCode } from "@/lib/admin/code-check";

describe("checkCode", () => {
  it("flags ESLint issues, Prettier formatting, and project anti-patterns together", async () => {
    const badCode = `export default function Bad() {\n  const unused = 5;\n  return <img src=\"/x.png\" style={{ color: '#ff0000' }} />;\n}\n`;
    const result = await checkCode("src/components/Bad.tsx", badCode);

    expect(
      result.eslint.messages.some(
        (m) => m.ruleId === "@typescript-eslint/no-unused-vars",
      ),
    ).toBe(true);
    expect(
      result.eslint.messages.some(
        (m) => m.ruleId === "@next/next/no-img-element",
      ),
    ).toBe(true);
    expect(result.prettier.formatted).toBe(false);
    expect(result.patternIssues.some((p) => p.includes("hex color"))).toBe(
      true,
    );
    expect(result.patternIssues.some((p) => p.includes("<img>"))).toBe(true);
  });

  it("reports clean results for well-formed, already-formatted code", async () => {
    const goodCode = `export default function Good() {\n  return <p>Hello</p>;\n}\n`;
    const result = await checkCode("src/components/Good.tsx", goodCode);

    expect(result.eslint.errorCount).toBe(0);
    expect(result.prettier.formatted).toBe(true);
    expect(result.patternIssues).toEqual([]);
  });

  it("does not flag framer-motion in files that don't import it, but does in ones that do", async () => {
    const withMotion = `import { motion } from "framer-motion";\nexport const X = () => <motion.div />;\n`;
    const result = await checkCode("src/components/X.tsx", withMotion);
    expect(result.patternIssues.some((p) => p.includes("framer-motion"))).toBe(
      true,
    );
  });
});
