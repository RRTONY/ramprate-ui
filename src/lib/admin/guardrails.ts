// Files the admin chat agent may never read or write, regardless of what the
// admin asks for in the chat — closes off the agent editing its own gate,
// secrets, or build config. Checked on every read/write/delete tool call.
const DENYLIST_PATTERNS: RegExp[] = [
  /^\.env(\..*)?$/i,
  // next.config.ts is intentionally NOT blocked — the admin needs it for
  // redirect rules (e.g. /bio -> /biochain). netlify.toml, .env*, and the
  // rest below stay blocked.
  /^package(-lock)?\.json$/i,
  /^yarn\.lock$/i,
  /^netlify\.toml$/i,
  /^\.github\//i,
  /^\.git\//i,
  /^middleware\.ts$/i,
  /^src\/middleware\.ts$/i,
  /^src\/lib\/portal-auth\.ts$/i,
  /^src\/lib\/admin\//i,
  /^src\/lib\/sanity\/write-client\.ts$/i,
  /^src\/app\/api\/admin\//i,
];

export function isPathDenied(path: string): boolean {
  const normalized = path.replace(/^\/+/, "");
  return DENYLIST_PATTERNS.some((pattern) => pattern.test(normalized));
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
] as const;

export type SanityEditableType = (typeof SANITY_EDITABLE_TYPES)[number];

export function isSanityTypeAllowed(type: string): type is SanityEditableType {
  return (SANITY_EDITABLE_TYPES as readonly string[]).includes(type);
}

export const ADMIN_BRANCH_PREFIX = "admin/vibe-";

export function isAdminBranch(branch: string): boolean {
  return branch.startsWith(ADMIN_BRANCH_PREFIX);
}
