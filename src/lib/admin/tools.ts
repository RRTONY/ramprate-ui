import prettier from "prettier";
import * as gh from "@/lib/admin/github-client";
import {
  isPathDenied,
  isPathReadDenied,
  isSanityTypeAllowed,
} from "@/lib/admin/guardrails";
import { client as sanityReadClient } from "@/lib/sanity/client";
import {
  createDraft,
  getDocumentForEditing,
  patchDraft,
} from "@/lib/admin/sanity-content";
import { checkPageSeo } from "@/lib/admin/seo-check";
import { checkLighthouse } from "@/lib/admin/lighthouse-check";
import { checkCode } from "@/lib/admin/code-check";
import {
  createClickupTask,
  updateClickupTask,
  deleteClickupTask,
  type ClickupTaskFields,
} from "@/lib/admin/clickup-client";
import {
  generateReportPdf,
  type ReportDocumentInfo,
  type ReportSection,
} from "@/lib/admin/report-pdf";
import { getAnalyticsSummary } from "@/lib/admin/ga4-client";
import {
  deleteSitemap,
  getSearchPerformance,
  GSC_DIMENSIONS,
  GSC_FILTER_OPERATORS,
  GSC_SEARCH_TYPES,
  inspectUrls,
  listSitemaps,
  listSites,
  submitSitemap,
} from "@/lib/admin/gsc-client";
import { sendEmail } from "@/lib/admin/resend-client";

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
      "Check the real, current status of every automatic check on the pending change (code style, formatting, the test suite, and the site-preview build) — call this any time the admin asks about a failing check, mentions an error or the workflow, or before telling them something is ready to publish. If checks are still running, this call itself waits up to ~20s for them to finish before returning — you do not need to (and cannot) wait on your own between calls. If the result still comes back with status \"pending\" and a `note` field, that means it's still running even after that wait — just call this tool again rather than telling the admin you'll 'wait' or 'check back'; there's no real timer on your side to do that with. Returns each check's name and whether it's passing, still running, or failed, with a failed check's id (for get_check_log_excerpt) and a link. ALL of these checks block Publish equally — none of them are cosmetic-only.",
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
  {
    name: "create_clickup_task",
    description:
      'Create a task in ClickUp. This is a REAL, immediately-visible task on the live board — not a draft — so confirm the details with the admin before calling it. Defaults to the "Requests & Tickets" list in the Technology & Web space; pass listId as either a known alias ("ramprate.com", "requests", "tonygreenberg.com") or a raw ClickUp list ID to target a different list.',
    input_schema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Task title." },
        description: { type: "string" },
        priority: {
          type: "string",
          enum: ["urgent", "high", "normal", "low"],
        },
        dueDate: {
          type: "string",
          description: "ISO date, e.g. 2026-09-10.",
        },
        listId: {
          type: "string",
          description:
            'Alias ("ramprate.com", "requests", "tonygreenberg.com") or a raw ClickUp list ID. Defaults to "requests".',
        },
      },
      required: ["name"],
    },
  },
  {
    name: "update_clickup_task",
    description:
      "Update an existing ClickUp task's name, description, priority, due date, or status. This changes the REAL, live task immediately — confirm with the admin first.",
    input_schema: {
      type: "object" as const,
      properties: {
        taskId: { type: "string", description: "ClickUp task ID." },
        name: { type: "string" },
        description: { type: "string" },
        priority: {
          type: "string",
          enum: ["urgent", "high", "normal", "low"],
        },
        dueDate: { type: "string", description: "ISO date, e.g. 2026-09-10." },
        status: {
          type: "string",
          description:
            'The list\'s exact status name (e.g. "to do", "in progress", "complete") — these vary per list, so check the task or list first if unsure.',
        },
      },
      required: ["taskId"],
    },
  },
  {
    name: "delete_clickup_task",
    description:
      "Permanently delete a ClickUp task. This is irreversible on the real, live board — always confirm with the admin before calling this.",
    input_schema: {
      type: "object" as const,
      properties: {
        taskId: { type: "string", description: "ClickUp task ID." },
      },
      required: ["taskId"],
    },
  },
  {
    name: "check_analytics",
    description:
      "Pull real Google Analytics 4 traffic for ramprate.com over the last N days: total sessions, active users, and pageviews, plus the top 10 pages by views. Read-only.",
    input_schema: {
      type: "object" as const,
      properties: {
        days: {
          type: "number",
          description: "Lookback window in days. Defaults to 7.",
        },
      },
      required: [],
    },
  },
  {
    name: "search_console_sites",
    description:
      "List every Google Search Console property the site's service account can access (ramprate.com and any other site it has been added to), with its permission level. Read-only. If a site is missing, a human must add the service account as a user on that property in Search Console (Settings -> Users and permissions).",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "search_console_performance",
    description:
      "Real Google Search Console search performance: clicks, impressions, CTR (%) and average position, overall and broken down by query, page, country, device, date and/or search appearance, with optional filters and a period-over-period comparison. Read-only. Use it for: top keywords, top pages, which queries a page ranks for, ranking drops, CTR opportunities (high impressions, low CTR), traffic by country/device, daily trends. Data lags ~2-3 days. Defaults: ramprate.com, last 28 days, by query, 25 rows, web search.",
    input_schema: {
      type: "object" as const,
      properties: {
        site: {
          type: "string",
          description:
            'Property or domain, e.g. "ramprate.com", "sc-domain:ramprate.com" or "https://ramprate.com/". Defaults to ramprate.com.',
        },
        days: {
          type: "number",
          description:
            "Lookback window in days ending ~3 days ago. Default 28. Ignored if startDate is given. Search Console keeps 16 months.",
        },
        startDate: { type: "string", description: "YYYY-MM-DD (optional)." },
        endDate: { type: "string", description: "YYYY-MM-DD (optional)." },
        dimensions: {
          type: "array",
          items: { type: "string", enum: [...GSC_DIMENSIONS] },
          description:
            'Breakdown, e.g. ["query"], ["page"], ["page","query"], ["date"]. Default ["query"].',
        },
        filters: {
          type: "array",
          description:
            'Narrow results, e.g. [{"dimension":"page","operator":"contains","expression":"/sourcing"}] or [{"dimension":"country","operator":"equals","expression":"usa"}] (country = ISO 3166-1 alpha-3, lowercase; device = DESKTOP|MOBILE|TABLET).',
          items: {
            type: "object",
            properties: {
              dimension: { type: "string", enum: [...GSC_DIMENSIONS] },
              operator: { type: "string", enum: [...GSC_FILTER_OPERATORS] },
              expression: { type: "string" },
            },
            required: ["dimension", "expression"],
          },
        },
        rowLimit: {
          type: "number",
          description: "Rows to return, 1-1000. Default 25.",
        },
        searchType: {
          type: "string",
          enum: [...GSC_SEARCH_TYPES],
          description: "Default web.",
        },
        compare: {
          type: "boolean",
          description:
            "Also fetch the previous period of the same length and return a `change` per row (position change is positive when ranking improved).",
        },
      },
      required: [],
    },
  },
  {
    name: "search_console_inspect_url",
    description:
      "Google Search Console URL Inspection for up to 20 page URLs: whether Google has indexed each page and why not, last crawl time, robots.txt/fetch status, Google-chosen vs declared canonical (flags mismatches), sitemaps and referring URLs, mobile usability, rich results and their issues. Read-only. Note: this API cannot request indexing - that button exists only in the Search Console website.",
    input_schema: {
      type: "object" as const,
      properties: {
        urls: {
          type: "array",
          items: { type: "string" },
          description: "Full page URLs, e.g. https://ramprate.com/sourcing",
        },
        site: {
          type: "string",
          description: "Property the URLs belong to. Defaults to ramprate.com.",
        },
      },
      required: ["urls"],
    },
  },
  {
    name: "search_console_sitemaps",
    description:
      'Manage sitemaps in Google Search Console. action "list" (default, read-only): every submitted sitemap with last submitted/downloaded dates, pending state, error and warning counts, URLs submitted. action "submit": submit or resubmit a sitemap URL so Google re-reads it (safe; do it after a big content change). action "delete": remove a sitemap from Search Console - this is a live change, so confirm the exact sitemap URL with the admin before calling it unless they explicitly asked for the delete.',
    input_schema: {
      type: "object" as const,
      properties: {
        action: { type: "string", enum: ["list", "submit", "delete"] },
        sitemapUrl: {
          type: "string",
          description:
            'Full sitemap URL for submit/delete, e.g. "https://ramprate.com/sitemap.xml".',
        },
        site: {
          type: "string",
          description: "Property. Defaults to ramprate.com.",
        },
      },
      required: [],
    },
  },
  {
    name: "send_email",
    description:
      "Send a real email via Resend, from a verified @ramprate.com sender. This is a live send, not a draft — confirm the recipient and content with the admin before calling this, unless they've explicitly asked for a test send.",
    input_schema: {
      type: "object" as const,
      properties: {
        to: { type: "string", description: "Recipient email address." },
        subject: { type: "string" },
        text: { type: "string", description: "Plain-text body." },
        html: {
          type: "string",
          description: "Optional HTML body. Falls back to text if omitted.",
        },
        from: {
          type: "string",
          description:
            'Optional sender, e.g. "RampRate <admin@ramprate.com>". Defaults to a standard RampRate sender address.',
        },
      },
      required: ["to", "subject", "text"],
    },
  },
  {
    name: "create_report",
    description:
      "Generate a branded RampRate PDF report (dark cover with logo, gold accents, page numbers on every page, optional document-info + contents page, paragraphs, bullet lists, numbered steps, callouts, tables) and email it as an attachment via Resend. Confirm the recipients with the person before calling, since this sends an email. Always fixed to the site's own gold/dark-navy/warm-cream palette — never use other colors. Give it structured sections (heading + paragraphs/callout/table), not raw HTML.",
    input_schema: {
      type: "object" as const,
      properties: {
        title: {
          type: "string",
          description: 'Report title, e.g. "Weekly Traffic Summary".',
        },
        subtitle: { type: "string" },
        date: {
          type: "string",
          description: 'Display date, e.g. "September 5, 2026".',
        },
        sections: {
          type: "array",
          description: "Ordered list of report sections.",
          items: {
            type: "object",
            properties: {
              heading: { type: "string" },
              paragraphs: { type: "array", items: { type: "string" } },
              bullets: {
                type: "array",
                items: { type: "string" },
                description: "Bulleted list items.",
              },
              steps: {
                type: "array",
                items: { type: "string" },
                description: "Numbered steps, in order.",
              },
              callout: { type: "string" },
              table: {
                type: "object",
                properties: {
                  headers: { type: "array", items: { type: "string" } },
                  rows: {
                    type: "array",
                    items: { type: "array", items: { type: "string" } },
                  },
                },
              },
            },
            required: ["heading"],
          },
        },
        eyebrow: {
          type: "string",
          description:
            'Small gold label above the cover title, e.g. "Internal Guide" or "Standard Operating Procedure". Defaults to "RampRate Report".',
        },
        preparedBy: {
          type: "string",
          description: 'Footer credit. Defaults to "RampRate Web Team".',
        },
        documentInfo: {
          type: "object",
          description:
            "Optional. When given, adds a Document information page and a numbered Contents list after the cover (use for manuals, SOPs, guides).",
          properties: {
            version: { type: "string" },
            owner: { type: "string" },
            audience: { type: "string" },
            purpose: { type: "string" },
            classification: {
              type: "string",
              description: 'e.g. "Internal use only".',
            },
          },
        },
        recipients: {
          type: "array",
          items: { type: "string" },
          description: "Email addresses to send the report to.",
        },
        emailSubject: { type: "string" },
      },
      required: [
        "title",
        "subtitle",
        "date",
        "sections",
        "recipients",
        "emailSubject",
      ],
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

function optionalString(value: unknown): string | undefined {
  const s = typeof value === "string" ? value.trim() : "";
  return s || undefined;
}

async function gscCall(fn: () => Promise<unknown>): Promise<ToolCallResult> {
  try {
    return { output: await fn() };
  } catch (err) {
    return {
      output: {
        error:
          err instanceof Error ? err.message : "Search Console call failed",
      },
      isError: true,
    };
  }
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// A plain chat client (Claude.ai, ChatGPT) has no way to "wait 60s and check
// again" on its own - it only acts on conversation turns, so asking it to
// wait produces either a stall or a claimed wait that never really
// happened. Doing the waiting here instead means a single call gives an
// honest, current answer: either it resolved within this window, or the
// result says so explicitly and the caller should call again - a real
// instruction instead of asking the model to fake a timer it doesn't have.
// Bounded well under Netlify's synchronous function timeout (worst case,
// free-tier: 10s; this repo's actual plan has handled longer single calls
// already, but there's no reason to push that margin for a status check).
const CHECK_WAIT_BUDGET_MS = 20_000;
const CHECK_POLL_INTERVAL_MS = 3_000;

export async function waitForChecks(
  prNumber: number,
): Promise<gh.PRChecksDetail & { note?: string }> {
  const start = Date.now();
  let detail = await gh.getPRChecksDetail(prNumber);
  while (
    detail.status === "pending" &&
    Date.now() - start < CHECK_WAIT_BUDGET_MS
  ) {
    await sleep(CHECK_POLL_INTERVAL_MS);
    detail = await gh.getPRChecksDetail(prNumber);
  }
  if (detail.status === "pending") {
    return {
      ...detail,
      note: `Still pending after waiting ~${Math.round((Date.now() - start) / 1000)}s. Call check_pr_status again.`,
    };
  }
  return detail;
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
      if (isPathReadDenied(path)) return denied(path);
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
        const detail = await waitForChecks(prNumber);
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

    case "create_clickup_task": {
      const taskName = String(input.name ?? "").trim();
      if (!taskName) {
        return { output: { error: "A task name is required." }, isError: true };
      }
      try {
        const task = await createClickupTask({
          name: taskName,
          description:
            input.description !== undefined
              ? String(input.description)
              : undefined,
          priority: input.priority as ClickupTaskFields["priority"] | undefined,
          dueDate:
            input.dueDate !== undefined ? String(input.dueDate) : undefined,
          listId: input.listId !== undefined ? String(input.listId) : undefined,
        });
        ctx.log(`Created ClickUp task "${task.name}" (${task.id})`);
        return { output: { ok: true, ...task } };
      } catch (err) {
        return {
          output: {
            error:
              err instanceof Error
                ? err.message
                : "Failed to create ClickUp task",
          },
          isError: true,
        };
      }
    }

    case "update_clickup_task": {
      const taskId = String(input.taskId ?? "").trim();
      if (!taskId) {
        return { output: { error: "A taskId is required." }, isError: true };
      }
      try {
        const task = await updateClickupTask(taskId, {
          name: input.name !== undefined ? String(input.name) : undefined,
          description:
            input.description !== undefined
              ? String(input.description)
              : undefined,
          priority: input.priority as ClickupTaskFields["priority"] | undefined,
          dueDate:
            input.dueDate !== undefined ? String(input.dueDate) : undefined,
          status: input.status !== undefined ? String(input.status) : undefined,
        });
        ctx.log(`Updated ClickUp task "${task.name}" (${task.id})`);
        return { output: { ok: true, ...task } };
      } catch (err) {
        return {
          output: {
            error:
              err instanceof Error
                ? err.message
                : "Failed to update ClickUp task",
          },
          isError: true,
        };
      }
    }

    case "delete_clickup_task": {
      const taskId = String(input.taskId ?? "").trim();
      if (!taskId) {
        return { output: { error: "A taskId is required." }, isError: true };
      }
      try {
        await deleteClickupTask(taskId);
        ctx.log(`Deleted ClickUp task ${taskId}`);
        return { output: { ok: true, taskId } };
      } catch (err) {
        return {
          output: {
            error:
              err instanceof Error
                ? err.message
                : "Failed to delete ClickUp task",
          },
          isError: true,
        };
      }
    }

    case "check_analytics": {
      const days = Number(input.days ?? 7);
      try {
        const summary = await getAnalyticsSummary(
          Number.isFinite(days) && days > 0 ? days : 7,
        );
        return { output: summary };
      } catch (err) {
        return {
          output: {
            error:
              err instanceof Error ? err.message : "Analytics check failed",
          },
          isError: true,
        };
      }
    }

    case "search_console_sites":
      return gscCall(async () => ({ sites: await listSites() }));

    case "search_console_performance":
      return gscCall(() =>
        getSearchPerformance({
          site: optionalString(input.site),
          days: input.days === undefined ? undefined : Number(input.days),
          startDate: optionalString(input.startDate),
          endDate: optionalString(input.endDate),
          dimensions: Array.isArray(input.dimensions)
            ? input.dimensions.map(String)
            : undefined,
          rowLimit:
            input.rowLimit === undefined ? undefined : Number(input.rowLimit),
          searchType: optionalString(input.searchType),
          filters: Array.isArray(input.filters)
            ? (input.filters as Array<Record<string, unknown>>).map((f) => ({
                dimension: String(f?.dimension ?? ""),
                operator: optionalString(f?.operator),
                expression: String(f?.expression ?? ""),
              }))
            : undefined,
          compare: input.compare === true,
        }),
      );

    case "search_console_inspect_url": {
      const urls = Array.isArray(input.urls)
        ? input.urls.map(String)
        : input.url
          ? [String(input.url)]
          : [];
      if (!urls.length) {
        return {
          output: { error: "Pass `urls` (an array of full page URLs)." },
          isError: true,
        };
      }
      return gscCall(() => inspectUrls(optionalString(input.site), urls));
    }

    case "search_console_sitemaps": {
      const action = String(input.action ?? "list");
      const site = optionalString(input.site);
      const sitemapUrl = String(input.sitemapUrl ?? "");
      if (action === "submit")
        return gscCall(() => submitSitemap(site, sitemapUrl));
      if (action === "delete")
        return gscCall(() => deleteSitemap(site, sitemapUrl));
      return gscCall(() => listSitemaps(site));
    }

    case "send_email": {
      const to = String(input.to ?? "").trim();
      const subject = String(input.subject ?? "").trim();
      const text = String(input.text ?? "");
      if (!to || !subject || !text) {
        return {
          output: { error: "to, subject, and text are all required." },
          isError: true,
        };
      }
      try {
        const result = await sendEmail({
          to,
          subject,
          text,
          html: input.html !== undefined ? String(input.html) : undefined,
          from: input.from !== undefined ? String(input.from) : undefined,
        });
        ctx.log(`Sent email to ${to}: "${subject}"`);
        return { output: { ok: true, ...result } };
      } catch (err) {
        return {
          output: {
            error: err instanceof Error ? err.message : "Failed to send email",
          },
          isError: true,
        };
      }
    }

    case "create_report": {
      const title = String(input.title ?? "").trim();
      const subtitle = String(input.subtitle ?? "");
      const date = String(input.date ?? "");
      const sections = (input.sections ?? []) as ReportSection[];
      const recipients = (input.recipients ?? []) as string[];
      const emailSubject = String(input.emailSubject ?? "").trim();
      if (
        !title ||
        sections.length === 0 ||
        recipients.length === 0 ||
        !emailSubject
      ) {
        return {
          output: {
            error:
              "title, sections, recipients, and emailSubject are all required.",
          },
          isError: true,
        };
      }
      try {
        const pdfBuffer = await generateReportPdf({
          title,
          subtitle,
          date,
          sections,
          eyebrow: input.eyebrow ? String(input.eyebrow) : undefined,
          preparedBy: input.preparedBy ? String(input.preparedBy) : undefined,
          documentInfo:
            input.documentInfo && typeof input.documentInfo === "object"
              ? (input.documentInfo as ReportDocumentInfo)
              : undefined,
        });
        const filename = `${title.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "")}.pdf`;
        const result = await sendEmail({
          to: recipients,
          subject: emailSubject,
          text: `Attached: ${title}`,
          attachments: [{ filename, content: pdfBuffer.toString("base64") }],
        });
        ctx.log(
          `Created and emailed report "${title}" to ${recipients.join(", ")}`,
        );
        return { output: { ok: true, filename, recipients, ...result } };
      } catch (err) {
        return {
          output: {
            error:
              err instanceof Error ? err.message : "Failed to create report",
          },
          isError: true,
        };
      }
    }

    default:
      return { output: { error: `Unknown tool "${name}"` }, isError: true };
  }
}
