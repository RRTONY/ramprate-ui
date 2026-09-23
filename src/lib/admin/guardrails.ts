// Files the admin agent (MCP tool calls) may never read or write, regardless
// of what's asked — closes off the agent editing its own gate, secrets, or
// build config. Checked on every read/write/delete tool call.
const DENYLIST_PATTERNS: RegExp[] = [
  /^\.env(\..*)?$/i,
  // next.config.ts is intentionally NOT blocked — the admin needs it for
  // redirect rules (e.g. /bio -> /biochain). netlify.toml, .env*, and the
  // rest below stay blocked.
  /^package(-lock)?\.json$/i,
  /^yarn\.lock$/i,
  /^netlify\.toml$/i,
  /^\.mcp\.json$/i,
  /^\.github\//i,
  /^\.git\//i,
  /^middleware\.ts$/i,
  /^src\/middleware\.ts$/i,
  /^src\/lib\/portal-auth\.ts$/i,
  /^src\/lib\/admin\//i,
  /^src\/lib\/sanity\/write-client\.ts$/i,
  /^src\/app\/api\/mcp\//i,
];

// Denylisted files that hold no secrets, so the agent may read (never write)
// them - lets a connected Claude/ChatGPT/Manus session see build, deploy and
// CI settings for inventory and debugging without being able to change them.
const READ_ONLY_PATTERNS: RegExp[] = [
  /^package\.json$/i,
  /^netlify\.toml$/i,
  /^\.github\/workflows\/[^/]+\.ya?ml$/i,
  /^middleware\.ts$/i,
  /^src\/middleware\.ts$/i,
];

function normalizePath(path: string): string {
  return path.replace(/^\/+/, "");
}

export function isPathDenied(path: string): boolean {
  const normalized = normalizePath(path);
  return DENYLIST_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function isPathReadDenied(path: string): boolean {
  const normalized = normalizePath(path);
  return (
    isPathDenied(normalized) &&
    !READ_ONLY_PATTERNS.some((pattern) => pattern.test(normalized))
  );
}

// Sanity document types the admin chat is allowed to create/patch. Excludes
// `seo`, which is an embedded object type used inside other documents, not a
// standalone document the agent should create on its own.
export const SANITY_EDITABLE_TYPES = [
  "siteSettings",
  "page",
  "pageSeo",
  "teamMember",
  "boardAdvisor",
  "post",
  "category",
  "testimonial",
  "caseStudy",
  "clientLogo",
  "confidentialTestimonial",
  "reportRun",
] as const;

export type SanityEditableType = (typeof SANITY_EDITABLE_TYPES)[number];

export function isSanityTypeAllowed(type: string): type is SanityEditableType {
  return (SANITY_EDITABLE_TYPES as readonly string[]).includes(type);
}

export const ADMIN_BRANCH_PREFIX = "admin/vibe-";

export function isAdminBranch(branch: string): boolean {
  return branch.startsWith(ADMIN_BRANCH_PREFIX);
}
