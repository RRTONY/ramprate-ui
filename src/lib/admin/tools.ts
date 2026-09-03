import prettier from "prettier";
import * as gh from "@/lib/admin/github-client";
import { isPathDenied, isSanityTypeAllowed } from "@/lib/admin/guardrails";
import { client as sanityReadClient } from "@/lib/sanity/client";
import {
  createDraft,
  getDocumentForEditing,
  patchDraft,
} from "@/lib/admin/sanity-content";
import { checkPageSeo } from "@/lib/admin/seo-check";
import { checkLighthouse } from "@/lib/admin/lighthouse-check";
import { checkCode } from "@/lib/admin/code-check";

// Every connected MCP client writes code in whatever style it happens to
// produce, and this repo's CI treats a Prettier mismatch as a hard failure
// (lint-changed-files) - relying on the model to remember to call
// check_code_quality and manually reformat is exactly what didn't happen on
// a real PR, blocking it on pure formatting with zero logic changes. Format
// unconditionally here instead, so a write is correct by construction
// regardless of which client made it. Falls back to the original content
// for file types Prettier has no parser for (rare for what this tool
// writes) rather than blocking the write.
async function formatIfPossible(
  filePath: string,
  content: string,
): Promise<string> {
  try {
    return await prettier.format(content, { filepath: filePath });
  } catch {
    return content;
  }
}

// Anthropic tool schemas. Kept as plain objects (not the SDK's Tool type)
// since the SDK's messages.create() accepts this shape directly and it keeps
// this file dependency-light.
export const ADMIN_TOOLS = [
  {
    name: "github_list_dir",
    description:
      "List files and subdirectories at a path in the repo, relative to repo root. Use an empty string for the repo root.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description:
            'e.g. "src/app/about". Use "" (empty string) for the repo root — do not pass quotes, "." or "/".',
        },
      },
      required: ["path"],
    },
  },
  {
    name: "github_read_file",
    description:
      "Read the current contents of a file in the repo. Always do this before editing a file.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string", description: "e.g. src/app/about/page.tsx" },
      },
      required: ["path"],
    },
  },
  {
    name: "github_write_file",
    description:
      "Create or update a file with new content. Committed to this session's working branch — never main directly. Pass the FULL new file content, not a diff.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string" },
        content: { type: "string" },
        message: {
          type: "string",
          description: "Short commit message describing the change.",
        },
      },
      required: ["path", "content", "message"],
    },
  },
  {
    name: "github_delete_file",
    description:
      "Delete a file. Committed to this session's working branch — never main directly.",
    input_schema: {
      type: "object" as const,
      properties: { path: { type: "string" }, message: { type: "string" } },
      required: ["path", "message"],
    },
  },
  {
    name: "get_attachment",
    description:
      "Retrieve the base64 content and media type of a file the admin attached to this chat message, by its filename.",
    input_schema: {
      type: "object" as const,
      properties: { name: { type: "string" } },
      required: ["name"],
    },
  },
  {
    name: "github_write_binary_file",
    description:
      "Write a binary file (image, PDF, etc.) to the repo from base64 content — typically content you got via get_attachment. Committed to this session's working branch, never main directly.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string" },
        base64Content: { type: "string" },
        message: { type: "string" },
      },
      required: ["path", "base64Content", "message"],
    },
  },
  {
    name: "seo_check_page",
    description:
      "Fetch a live page on ramprate.com and report its title, meta description, canonical URL, OG tags, H1s, and JSON-LD block count — a quick SEO health check. Checks the LIVE production site, not the working branch.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string", description: "Site route, e.g. /growth or /" },
      },
      required: ["path"],
    },
  },
  {
    name: "lighthouse_check_page",
    description:
      "Run a real Lighthouse audit (via Google's PageSpeed Insights API) against a live page on ramprate.com — returns performance/accessibility/best-practices/SEO scores plus the top failing audits.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string", description: "Site route, e.g. /growth or /" },
        strategy: {
          type: "string",
          enum: ["mobile", "desktop"],
          description: "Defaults to mobile",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "check_code_quality",
    description:
      "Check proposed file content BEFORE writing it: runs ESLint, checks Prettier formatting, and flags a few project-specific anti-patterns (raw hex colors, <img> instead of <Image>, framer-motion imports). Always call this on .ts/.tsx/.css content before github_write_file, and fix anything it flags first.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description:
            "The file path this content is for, e.g. src/app/about/page.tsx",
        },
        content: { type: "string" },
      },
      required: ["path", "content"],
    },
  },
  {
    name: "check_pr_status",
    description:
      "Check the real, current status of every automatic check on the pending change (code style, formatting, the test suite, and the site-preview build) — call this any time the admin asks about a failing check, mentions an error or the workflow, or before telling them something is ready to publish. Returns each check's name and whether it's passing, still running, or failed, with a failed check's id (for get_check_log_excerpt) and a link. ALL of these checks block Publish equally — none of them are cosmetic-only.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_check_log_excerpt",
    description:
      "Get the tail of the real log output for one failed check, by its id from check_pr_status's failingChecks. Use this to see the actual error (a specific ESLint rule, a Prettier diff, or a failing test's assertion) instead of guessing — then fix the real file(s) that caused it.",
    input_schema: {
      type: "object" as const,
      properties: {
        checkRunId: {
          type: "number",
          description: "The id field from a failingChecks entry.",
        },
      },
      required: ["checkRunId"],
    },
  },
  {
    name: "create_download",
    description:
      "Hand the admin a generated file (PDF, CSV, report, image, etc.) to download from the chat — for something the admin should have as a file, not something committed to the repo. Base64-encode the content.",
    input_schema: {
      type: "object" as const,
      properties: {
        name: {
          type: "string",
          description: "Filename, e.g. seo-audit-2026-08.pdf",
        },
        mediaType: {
          type: "string",
          description: "e.g. application/pdf, text/csv, image/png",
        },
        base64Content: { type: "string" },
      },
      required: ["name", "mediaType", "base64Content"],
    },
  },
  {
    name: "sanity_query",
    description:
      "Run a read-only GROQ query against the live Sanity dataset to look up current content.",
    input_schema: {
      type: "object" as const,
      properties: { groq: { type: "string" } },
      required: ["groq"],
    },
  },
  {
    name: "sanity_get_document",
    description:
      "Get a Sanity document by its published id. Resolves to the in-progress draft if one exists.",
    input_schema: {
      type: "object" as const,
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },
  {
    name: "sanity_patch_document",
    description:
      "Patch fields on an existing Sanity document. Writes to a DRAFT only — the live document is untouched until the admin publishes.",
    input_schema: {
      type: "object" as const,
      properties: {
        id: { type: "string" },
        patch: {
          type: "object",
          description: "Fields to set on the document.",
        },
      },
      required: ["id", "patch"],
    },
  },
  {
    name: "sanity_create_document",
    description:
      "Create a new Sanity document as a DRAFT — not live until the admin publishes.",
    input_schema: {
      type: "object" as const,
      properties: {
        docType: { type: "string", description: "Sanity document _type." },
        fields: { type: "object" },
      },
      required: ["docType", "fields"],
    },
  },
];

export interface Attachment {
  mediaType: string;
  base64: string;
}

export interface Download {
  name: string;
  mediaType: string;
  base64: string;
}

export interface AdminToolContext {
  getReadBranch: () => string;
  ensureWriteBranch: () => Promise<string>;
  getPRNumber: () => number | null;
  getAttachment: (name: string) => Attachment | null;
  recordDownload: (file: Download) => void;
  log: (entry: string) => void;
}

export interface ToolCallResult {
  output: unknown;
  isError?: boolean;
}

function denied(path: string): ToolCallResult {
  return {
    output: {
      error: `"${path}" is off-limits to the admin agent and cannot be read or modified.`,
    },
    isError: true,
  };
}

// The model sometimes hands us a path that's been JSON-quoted (`""`,
// `"src/app"`), prefixed (`./`, `/`), or given a placeholder (`.`, `root`)
// for the repo root. Normalize all of it to a clean repo-relative path
// (`""` === root) before it reaches the GitHub API — a literal `""` was
// getting URL-encoded to `%22%22` and 404ing.
function normalizeRepoPath(raw: unknown): string {
  let p = String(raw ?? "").trim();
  while (
    p.length >= 2 &&
    ((p.startsWith('"') && p.endsWith('"')) ||
      (p.startsWith("'") && p.endsWith("'")))
  ) {
    p = p.slice(1, -1).trim();
  }
  p = p.replace(/^\.?\/+/, "").replace(/\/+$/, "");
  if (p === "." || p === "/" || p.toLowerCase() === "root") return "";
  return p;
}

function pathRequired(): ToolCallResult {
  return {
    output: { error: "A repo-relative file path is required." },
    isError: true,
  };
}

export async function runAdminTool(
  name: string,
  input: Record<string, unknown>,
  ctx: AdminToolContext,
): Promise<ToolCallResult> {
  switch (name) {
    case "github_list_dir": {
      const path = normalizeRepoPath(input.path);
      const entries = await gh.listDir(path, ctx.getReadBranch());
      return { output: entries };
    }

    case "github_read_file": {
      const path = normalizeRepoPath(input.path);
      if (!path) return pathRequired();
      if (isPathDenied(path)) return denied(path);
      const file = await gh.getFile(path, ctx.getReadBranch());
      if (!file)
        return { output: { error: `${path} does not exist` }, isError: true };
      return { output: { content: file.content } };
    }

    case "github_write_file": {
      const path = normalizeRepoPath(input.path);
      const rawContent = String(input.content ?? "");
      const message = String(input.message ?? "Admin chat edit");
      if (!path) return pathRequired();
      if (isPathDenied(path)) return denied(path);
      const content = await formatIfPossible(path, rawContent);
      const branch = await ctx.ensureWriteBranch();
      await gh.putFile(path, content, message, branch);
      ctx.log(`Wrote ${path} on ${branch}: ${message}`);
      return { output: { ok: true, path, branch } };
    }

    case "github_delete_file": {
      const path = normalizeRepoPath(input.path);
      const message = String(input.message ?? "Admin chat delete");
      if (!path) return pathRequired();
      if (isPathDenied(path)) return denied(path);
      const branch = await ctx.ensureWriteBranch();
      await gh.deleteFile(path, message, branch);
      ctx.log(`Deleted ${path} on ${branch}: ${message}`);
      return { output: { ok: true, path, branch } };
    }

    case "get_attachment": {
      const name = String(input.name ?? "");
      const att = ctx.getAttachment(name);
      if (!att)
        return {
          output: { error: `No attachment named "${name}"` },
          isError: true,
        };
      return { output: att };
    }

    case "github_write_binary_file": {
      const path = normalizeRepoPath(input.path);
      const base64Content = String(input.base64Content ?? "");
      const message = String(input.message ?? "Admin chat binary upload");
      if (!path) return pathRequired();
      if (isPathDenied(path)) return denied(path);
      const branch = await ctx.ensureWriteBranch();
      await gh.putFileBase64(path, base64Content, message, branch);
      ctx.log(`Wrote binary file ${path} on ${branch}: ${message}`);
      return { output: { ok: true, path, branch } };
    }

    case "seo_check_page": {
      const path = String(input.path ?? "/");
      try {
        const result = await checkPageSeo(path);
        return { output: result };
      } catch (err) {
        return {
          output: {
            error: err instanceof Error ? err.message : "Fetch failed",
          },
          isError: true,
        };
      }
    }

    case "lighthouse_check_page": {
      const path = String(input.path ?? "/");
      const strategy = input.strategy === "desktop" ? "desktop" : "mobile";
      try {
        const result = await checkLighthouse(path, strategy);
        return { output: result };
      } catch (err) {
        return {
          output: {
            error:
              err instanceof Error ? err.message : "Lighthouse check failed",
          },
          isError: true,
        };
      }
    }

    case "check_code_quality": {
      const path = normalizeRepoPath(input.path);
      const content = String(input.content ?? "");
      try {
        const result = await checkCode(path, content);
        return { output: result };
      } catch (err) {
        return {
          output: {
            error: err instanceof Error ? err.message : "Code check failed",
          },
          isError: true,
        };
      }
    }

    case "check_pr_status": {
      const prNumber = ctx.getPRNumber();
      if (!prNumber) {
        return {
          output: {
            status: "no_pending_change",
            message: "There's no pending change with checks running yet.",
          },
        };
      }
      try {
        const detail = await gh.getPRChecksDetail(prNumber);
        return { output: detail };
      } catch (err) {
        return {
          output: {
            error:
              err instanceof Error ? err.message : "Failed to check status",
          },
          isError: true,
        };
      }
    }

    case "get_check_log_excerpt": {
      const checkRunId = Number(input.checkRunId);
      if (!Number.isFinite(checkRunId)) {
        return {
          output: { error: "A numeric checkRunId is required." },
          isError: true,
        };
      }
      try {
        const log = await gh.getFailingCheckLogExcerpt(checkRunId);
        return { output: { log } };
      } catch (err) {
        return {
          output: {
            error: err instanceof Error ? err.message : "Failed to fetch log",
          },
          isError: true,
        };
      }
    }

    case "create_download": {
      const name = String(input.name ?? "");
      const mediaType = String(input.mediaType ?? "application/octet-stream");
      const base64Content = String(input.base64Content ?? "");
      ctx.recordDownload({ name, mediaType, base64: base64Content });
      ctx.log(`Created downloadable file ${name}`);
      return { output: { ok: true, name } };
    }

    case "sanity_query": {
      const groq = String(input.groq ?? "");
      const result = await sanityReadClient.fetch(groq);
      return { output: result };
    }

    case "sanity_get_document": {
      const id = String(input.id ?? "");
      const doc = await getDocumentForEditing(id);
      if (!doc)
        return {
          output: { error: `No document found for ${id}` },
          isError: true,
        };
      return { output: doc };
    }

    case "sanity_patch_document": {
      const id = String(input.id ?? "");
      const patch = (input.patch ?? {}) as Record<string, unknown>;
      const current = await getDocumentForEditing(id);
      if (!current)
        return {
          output: { error: `No document found for ${id}` },
          isError: true,
        };
      const currentType = (current as { _type?: string })._type ?? "";
      if (!isSanityTypeAllowed(currentType)) {
        return {
          output: {
            error: `"${currentType}" documents are not editable by the admin agent`,
          },
          isError: true,
        };
      }
      await patchDraft(id, patch);
      ctx.log(`Patched Sanity draft for ${id}`);
      return { output: { ok: true, id } };
    }

    case "sanity_create_document": {
      const docType = String(input.docType ?? "");
      const fields = (input.fields ?? {}) as Record<string, unknown>;
      if (!isSanityTypeAllowed(docType)) {
        return {
          output: {
            error: `"${docType}" is not in the admin-editable type allowlist`,
          },
          isError: true,
        };
      }
      const created = await createDraft(docType, fields);
      ctx.log(`Created Sanity draft ${created._id} (${docType})`);
      return { output: { ok: true, id: created._id } };
    }

    default:
      return { output: { error: `Unknown tool "${name}"` }, isError: true };
  }
}
