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

// A handful of this project's own house rules (AGENTS.md) that are cheap to
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
    test: (c, f) =>
      !/src\/(app|components)\/flow\//.test(f) &&
      /from ["']framer-motion["']/.test(c),
    message:
      "framer-motion import found — not allowed on the main marketing site (~140KB); it is only used inside the /flow product (AGENTS.md).",
  },
];

export async function checkCode(
  filePath: string,
  content: string,
): Promise<CodeCheckResult> {
  const absolutePath = path.join(process.cwd(), filePath);

  // Imported here (not left for ESLint to find on disk) so the build's file
  // tracing follows every plugin and helper the config needs into the
  // serverless bundle; left to ESLint, they load where tracing can't see
  // them, and the live check failed with "Cannot find module 'fast-glob'"
  // (needed by @next/eslint-plugin-next). Loaded on first use, not at the
  // top, so MCP calls that never lint don't pay for loading every plugin.
  const { default: eslintConfig } = await import("../../../eslint.config.mjs");
  const eslint = new ESLint({
    cwd: process.cwd(),
    overrideConfigFile: true,
    overrideConfig: eslintConfig,
  });
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

const LINTABLE = /\.(ts|tsx|js|jsx|mjs)$/;

// The server's own lint run over a change's code files, for the review's
// "Lint" check. A file that can't be linted is reported as "could not run"
// (which blocks publishing), never silently counted as passed.
export async function lintChangedFiles(
  files: Array<{ path: string; content: string | null }>,
): Promise<
  Array<{
    path: string;
    errors: number;
    warnings: number;
    couldNotRun: string | null;
  }>
> {
  const results = [];
  for (const f of files.filter((f) => LINTABLE.test(f.path))) {
    if (f.content === null) continue;
    try {
      const r = await checkCode(f.path, f.content);
      results.push({
        path: f.path,
        errors: r.eslint.errorCount,
        warnings: r.eslint.warningCount,
        couldNotRun: null,
      });
    } catch (err) {
      results.push({
        path: f.path,
        errors: 0,
        warnings: 0,
        couldNotRun: (err instanceof Error ? err.message : String(err))
          .split("\n")[0]
          .slice(0, 200),
      });
    }
  }
  return results;
}
