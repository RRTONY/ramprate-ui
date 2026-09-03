import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as gh from "@/lib/admin/github-client";
import { ADMIN_BRANCH_PREFIX } from "@/lib/admin/guardrails";
import { listPendingDrafts, publishDraft } from "@/lib/admin/sanity-content";
import { ADMIN_TOOLS, runAdminTool } from "@/lib/admin/tools";
import { buildMcpToolContext } from "@/lib/admin/mcp-tool-context";
import {
  PENDING_CHANGES_HTML,
  PENDING_CHANGES_UI_URI,
} from "@/lib/admin/mcp-ui-widgets";

// MIME type the MCP Apps extension (https://mcpui.dev) expects for an
// interactive UI resource. Hosts that don't support MCP Apps simply never
// request this resource and show the tool's plain-text result instead.
const MCP_APP_MIME_TYPE = "text/html;profile=mcp-app";

// get_attachment / create_download are chat-UI-only concepts (a chat
// message's attachments, a file handed back through the chat) that don't
// apply over MCP — an MCP client reads/writes files through its own tools.
const EXCLUDED_FROM_MCP = new Set(["get_attachment", "create_download"]);

const CHAT_TOOLS = ADMIN_TOOLS.filter((t) => !EXCLUDED_FROM_MCP.has(t.name));

const SESSION_TOOLS = [
  {
    name: "list_pending_changes",
    description:
      "Show the current pending change, if any: which files differ from the live site, the pull request's automatic check status, and any unpublished Sanity content drafts. Call this before publish_changes.",
    input_schema: { type: "object" as const, properties: {}, required: [] },
    // Hosts that support MCP Apps render this alongside the plain-text
    // result as a status card with a real Publish button (see
    // mcp-ui-widgets.ts, which calls publish_changes via the widget
    // runtime's callServerTool bridge). Ignored by hosts that don't support
    // MCP Apps — they just see the plain-text result.
    _meta: { ui: { resourceUri: PENDING_CHANGES_UI_URI } },
  },
  {
    name: "publish_changes",
    description:
      "Go live: merge the pending pull request (only if its automatic checks are passing) and publish any pending Sanity drafts. This is the ONLY way anything reaches the real site. Always call list_pending_changes first and confirm with the human what's about to go live before calling this.",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
];

const MCP_TOOLS = [...CHAT_TOOLS, ...SESSION_TOOLS];

function toResult(output: unknown, isError = false) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(output, null, 2) }],
    isError,
  };
}

async function listPendingChanges() {
  const drafts = await listPendingDrafts();
  const existing = await gh.findOpenAdminPR(ADMIN_BRANCH_PREFIX);
  if (!existing) {
    return {
      branch: null,
      prNumber: null,
      prUrl: null,
      checkStatus: "unknown",
      failingChecks: [],
      files: [],
      drafts,
      canPublish: drafts.length > 0,
    };
  }

  const [compare, checks] = await Promise.all([
    gh.compareToDefaultBranch(existing.branch),
    gh.getPRChecksDetail(existing.number),
  ]);

  return {
    branch: existing.branch,
    prNumber: existing.number,
    prUrl: `https://github.com/${gh.GITHUB_REPO.owner}/${gh.GITHUB_REPO.repo}/pull/${existing.number}`,
    previewUrl: checks.previewUrl,
    checkStatus: checks.status,
    failingChecks: checks.failingChecks,
    files: compare.files,
    drafts,
    canPublish:
      (compare.files.length > 0 || drafts.length > 0) &&
      checks.status !== "failure" &&
      checks.status !== "pending",
  };
}

async function publishChanges() {
  const existing = await gh.findOpenAdminPR(ADMIN_BRANCH_PREFIX);
  const drafts = await listPendingDrafts();

  if (!existing && drafts.length === 0) {
    return { error: "Nothing pending to publish" };
  }

  let mergeSha: string | null = null;
  if (existing) {
    const status = await gh.getPRCombinedStatus(existing.number);
    if (status === "failure") {
      return {
        error:
          "The pull request's build checks are failing. Fix the issue before publishing.",
      };
    }
    if (status === "pending") {
      return {
        error:
          "The pull request's build checks are still running. Try again in a moment.",
      };
    }

    const merged = await gh.mergePR(existing.number);
    if (!merged.merged) {
      return { error: "GitHub could not merge the pull request." };
    }
    mergeSha = merged.sha;

    try {
      await gh.deleteBranch(existing.branch);
    } catch {
      // Branch may already be auto-deleted by GitHub's merge settings — not fatal.
    }
  }

  const publishedIds: string[] = [];
  for (const draft of drafts) {
    await publishDraft(draft.id);
    publishedIds.push(draft.publishedId);
  }

  return { ok: true, mergeSha, publishedIds };
}

// One fresh Server per request (see api/mcp/route.ts) — cheap to construct,
// and keeps this stateless like everything else the admin tools touch.
export function createAdminMcpServer(): Server {
  const server = new Server(
    { name: "ramprate-admin", version: "1.0.0" },
    { capabilities: { tools: {}, resources: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: MCP_TOOLS.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.input_schema,
      ...("_meta" in t ? { _meta: t._meta } : {}),
    })),
  }));

  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: [
      {
        uri: PENDING_CHANGES_UI_URI,
        name: "Pending changes",
        mimeType: MCP_APP_MIME_TYPE,
      },
    ],
  }));

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    if (request.params.uri !== PENDING_CHANGES_UI_URI) {
      throw new Error(`Unknown resource "${request.params.uri}"`);
    }
    return {
      contents: [
        {
          uri: PENDING_CHANGES_UI_URI,
          mimeType: MCP_APP_MIME_TYPE,
          text: PENDING_CHANGES_HTML,
          _meta: { ui: { csp: { resourceDomains: ["https://esm.sh"] } } },
        },
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: rawArgs } = request.params;
    const input = (rawArgs ?? {}) as Record<string, unknown>;

    if (name === "list_pending_changes") {
      return toResult(await listPendingChanges());
    }
    if (name === "publish_changes") {
      return toResult(await publishChanges());
    }
    if (!CHAT_TOOLS.some((t) => t.name === name)) {
      return toResult({ error: `Unknown tool "${name}"` }, true);
    }

    const { ctx, auditLog, finalize } = await buildMcpToolContext();
    const result = await runAdminTool(name, input, ctx);
    const session = await finalize();

    // Only append session/audit info when THIS call actually did something
    // (ensureWriteBranch/log calls push into auditLog) — not just because a
    // branch happens to already be open from an earlier call, which is true
    // for most calls once any change is pending. Also: never name this field
    // "log" — get_check_log_excerpt's own output already has a `log` string,
    // and spreading a same-named field after it silently clobbers it (this
    // is exactly the bug that shipped: get_check_log_excerpt started
    // returning `log: []` instead of the real log text, on any call made
    // while a PR was open).
    const isPlainObject =
      result.output &&
      typeof result.output === "object" &&
      !Array.isArray(result.output);
    const output =
      isPlainObject && auditLog.length > 0
        ? { ...(result.output as object), ...session, mcpAuditLog: auditLog }
        : result.output;

    return toResult(output, result.isError);
  });

  return server;
}
