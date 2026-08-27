import { ESLint } from "eslint";
import prettier from "prettier";
import path from "path";

export interface CodeCheckMessage {
  line: number;
  severity: "error" | "warning";
  message: string;
  ruleId: string | null;
}

export interface CodeCheckResult {
  eslint: {
    errorCount: number;
    warningCount: number;
    messages: CodeCheckMessage[];
  };
  prettier: { formatted: boolean; suggestion?: string };
  patternIssues: string[];
}

// A handful of this project's own house rules (CLAUDE.md) that are cheap to
// check mechanically, on top of whatever generic ESLint/Prettier catch.
const PATTERN_CHECKS: Array<{
  test: (content: string, filePath: string) => boolean;
  message: string;
}> = [
  {
    test: (c, f) =>
      !f.endsWith("globals.css") &&
      !f.includes("global-error") &&
      /#[0-9a-fA-F]{3,8}\b/.test(c),
    message:
      "Raw hex color found — use oklch() per this project's design system (globals.css is the one exception).",
  },
  {
    test: (c) => /<img[\s>]/.test(c),
    message:
      "Raw <img> tag found — use next/image's <Image> component instead.",
  },
  {
    test: (c) => /from ["']framer-motion["']/.test(c),
    message:
      "framer-motion import found — it's a banned dead dependency in this project (CLAUDE.md).",
  },
];

export async function checkCode(
  filePath: string,
  content: string,
): Promise<CodeCheckResult> {
  const absolutePath = path.join(process.cwd(), filePath);

  const eslint = new ESLint({ cwd: process.cwd() });
  const isIgnored = await eslint.isPathIgnored(absolutePath).catch(() => false);
  let eslintResult: CodeCheckResult["eslint"] = {
    errorCount: 0,
    warningCount: 0,
    messages: [],
  };
  if (!isIgnored && /\.(ts|tsx|js|jsx)$/.test(filePath)) {
    const [result] = await eslint.lintText(content, { filePath: absolutePath });
    eslintResult = {
      errorCount: result?.errorCount ?? 0,
      warningCount: result?.warningCount ?? 0,
      messages: (result?.messages ?? []).map((m) => ({
        line: m.line ?? 0,
        severity: m.severity === 2 ? "error" : "warning",
        message: m.message,
        ruleId: m.ruleId,
      })),
    };
  }

  let prettierResult: CodeCheckResult["prettier"] = { formatted: true };
  try {
    const formatted = await prettier.format(content, { filepath: filePath });
    if (formatted.trim() !== content.trim()) {
      prettierResult = { formatted: false, suggestion: formatted };
    }
  } catch {
    // Prettier can't infer a parser for some file types (e.g. .md, .json5) - skip.
  }

  const patternIssues = PATTERN_CHECKS.filter((p) =>
    p.test(content, filePath),
  ).map((p) => p.message);

  return { eslint: eslintResult, prettier: prettierResult, patternIssues };
}
