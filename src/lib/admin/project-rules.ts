import * as gh from "@/lib/admin/github-client";

export const RULES_PATH = "AGENTS.md";
export const KNOWLEDGE_BASE_DIR = "docs/ai";
// Returned alongside the rules so a connecting client gets the "what kind of
// request is this, and where does it live" answers in the same first call,
// instead of exploring the repo file by file.
export const GUIDE_PATHS = {
  taskGuide: "docs/ai/TASK_GUIDE.md",
  projectStructure: "docs/ai/PROJECT_STRUCTURE.md",
} as const;

// Tools that change the site, its content, or reach someone outside the
// session. A connected Claude/ChatGPT session can ignore server
// instructions, so these refuse to run until the caller proves it loaded the
// current rules by echoing back the rulesVersion from get_project_rules.
// Stateless by design (no session memory on Netlify): the proof travels
// with each call instead.
export const RULES_GATED_TOOLS = new Set([
  "github_write_file",
  "github_write_binary_file",
  "github_delete_file",
  "sanity_patch_document",
  "sanity_create_document",
  "publish_changes",
  "send_email",
  "create_report",
]);

export const RULES_VERSION_PARAM = "rules_version";

const CACHE_TTL_MS = 5 * 60 * 1000;
let cached: { version: string; content: string; at: number } | null = null;

export function versionFromSha(sha: string): string {
  return sha.slice(0, 10);
}

export async function getProjectRules(): Promise<{
  version: string;
  content: string;
}> {
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached;
  const branch = await gh.getDefaultBranch();
  const file = await gh.getFile(RULES_PATH, branch);
  if (!file) throw new Error(`${RULES_PATH} not found on ${branch}`);
  cached = {
    version: versionFromSha(file.sha),
    content: file.content,
    at: Date.now(),
  };
  return cached;
}

let cachedGuides: {
  guides: Record<keyof typeof GUIDE_PATHS, string | null>;
  at: number;
} | null = null;

// A missing guide is returned as null rather than failing the whole call -
// the rules are what matter; the guides only speed things up.
export async function getProjectGuides(): Promise<
  Record<keyof typeof GUIDE_PATHS, string | null>
> {
  if (cachedGuides && Date.now() - cachedGuides.at < CACHE_TTL_MS)
    return cachedGuides.guides;
  const branch = await gh.getDefaultBranch();
  const keys = Object.keys(GUIDE_PATHS) as Array<keyof typeof GUIDE_PATHS>;
  const files = await Promise.all(
    keys.map((k) => gh.getFile(GUIDE_PATHS[k], branch).catch(() => null)),
  );
  const guides = Object.fromEntries(
    keys.map((k, i) => [k, files[i]?.content ?? null]),
  ) as Record<keyof typeof GUIDE_PATHS, string | null>;
  cachedGuides = { guides, at: Date.now() };
  return guides;
}

export async function listKnowledgeBase(): Promise<string[]> {
  const branch = await gh.getDefaultBranch();
  const entries = await gh.listDir(KNOWLEDGE_BASE_DIR, branch);
  return entries
    .filter((e) => e.type === "file" && e.path.endsWith(".md"))
    .map((e) => e.path);
}

export function rulesVersionError(
  provided: unknown,
  current: string,
): string | null {
  if (typeof provided !== "string" || provided.trim() === "") {
    return `Blocked: call get_project_rules first, read and follow the rules it returns, then retry this call with ${RULES_VERSION_PARAM} set to its rulesVersion.`;
  }
  if (provided.trim() !== current) {
    return `Blocked: the project rules changed since you read them (you sent ${provided.trim()}, current is ${current}). Call get_project_rules again, re-read the rules, then retry with the new ${RULES_VERSION_PARAM}.`;
  }
  return null;
}

type JsonSchema = {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
};

export function withRulesVersionParam<T extends JsonSchema>(
  schema: T,
): T & { required: string[] } {
  return {
    ...schema,
    properties: {
      ...schema.properties,
      [RULES_VERSION_PARAM]: {
        type: "string",
        description:
          "The rulesVersion returned by get_project_rules. Required: proves the project rules (AGENTS.md) were read this conversation.",
      },
    },
    required: [...(schema.required ?? []), RULES_VERSION_PARAM],
  };
}
