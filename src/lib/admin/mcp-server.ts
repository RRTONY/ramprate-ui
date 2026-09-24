import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as gh from "@/lib/admin/github-client";
import { ADMIN_BRANCH_PREFIX } from "@/lib/admin/guardrails";
import { listPendingDrafts, publishDraft } from "@/lib/admin/sanity-content";
import { ADMIN_TOOLS, runAdminTool, waitForChecks } from "@/lib/admin/tools";
import { buildMcpToolContext } from "@/lib/admin/mcp-tool-context";
import {
  RULES_GATED_TOOLS,
  RULES_PATH,
  RULES_VERSION_PARAM,
  getProjectGuides,
  getProjectRules,
  listKnowledgeBase,
  rulesVersionError,
  withRulesVersionParam,
} from "@/lib/admin/project-rules";
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
    name: "get_project_rules",
    description:
      "CALL THIS FIRST, before anything else in a conversation. Returns RampRate's project rules (AGENTS.md: workflow, plain-language style, coding patterns, code review checklist, testing rules, and the Status Report format every reply must end with), a task guide (which kind of request goes where, what can't be done via this server, what needs a yes), a project structure map (where every page, form and system lives), the list of background notes in docs/ai/, and a rulesVersion. Every tool that changes the site, content, or sends email requires that rulesVersion as its rules_version argument and refuses to run without it. Read the rules fully and follow them for the rest of the conversation.",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "list_pending_changes",
    description:
      "Show the current pending change, if any: which files differ from the live site, the pull request's automatic check status, and any unpublished Sanity content drafts. Call this before publish_changes. If checks are still running, this call itself waits up to ~20s for them before returning — if the result still comes back with checkStatus \"pending\" and a `note` field, just call this again rather than telling the human you'll wait or check back later; there's no real timer on your side to do that with.",
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
    waitForChecks(existing.number),
  ]);

  return {
    branch: existing.branch,
    prNumber: existing.number,
    prUrl: `https://github.com/${gh.GITHUB_REPO.owner}/${gh.GITHUB_REPO.repo}/pull/${existing.number}`,
    previewUrl: checks.previewUrl,
    checkStatus: checks.status,
    ...(checks.note ? { note: checks.note } : {}),
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

// Sent to every connecting client during the MCP handshake and meant to act
// like a system-prompt hint (per the MCP spec). The real rules live in one
// place, AGENTS.md on the default branch, served by get_project_rules - not
// duplicated here, so they can't drift. Some clients ignore these
// instructions, which is why the write tools are also hard-gated on
// rules_version (see project-rules.ts).
const ADMIN_SERVER_INSTRUCTIONS = `This server lets you edit the RampRate marketing site's code and Sanity content.

STEP 1, EVERY CONVERSATION: call get_project_rules before anything else, read the rules it
returns in full, and follow them for the rest of the conversation. They override your defaults.
Every tool that changes the site, its content, or sends email requires the rulesVersion it
returns as the rules_version argument, and refuses to run without it.

The rules cover, among other things:
- Plain, short, jargon-free replies (the day-to-day user is non-technical), no em dashes.
- This site's design system and coding patterns (Tailwind tokens, oklch colors, next/image,
  server components, per-section fixed backgrounds rather than a light/dark toggle).
- A code review checklist and testing steps to run before calling anything done
  (check_code_quality on changed files, then check_pr_status and the preview link).
- Confirming with the person before publish_changes or anything outward-facing.
- Ending every reply that did work with the Status Report format in section 7 of the rules.

Background notes for each feature are in docs/ai/ (listed by get_project_rules). Read the
relevant one with github_read_file before changing that feature.`;

// One fresh Server per request (see api/mcp/route.ts) — cheap to construct,
// and keeps this stateless like everything else the admin tools touch.
export function createAdminMcpServer(): Server {
  const server = new Server(
    { name: "ramprate-admin", version: "1.0.0" },
    {
      capabilities: { tools: {}, resources: {} },
      instructions: ADMIN_SERVER_INSTRUCTIONS,
    },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: MCP_TOOLS.map((t) => ({
      name: t.name,
      description: RULES_GATED_TOOLS.has(t.name)
        ? `${t.description} Requires ${RULES_VERSION_PARAM} from get_project_rules.`
        : t.description,
      inputSchema: RULES_GATED_TOOLS.has(t.name)
        ? withRulesVersionParam(t.input_schema)
        : t.input_schema,
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

  // Declaring the resources capability means clients may also ask for
  // templates; answering "method not found" there made some clients abort
  // setup. There are none, so say so.
  server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({
    resourceTemplates: [],
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
    const { [RULES_VERSION_PARAM]: rulesVersion, ...input } = (rawArgs ??
      {}) as Record<string, unknown>;

    if (name === "get_project_rules") {
      const [rules, guides, knowledgeBase] = await Promise.all([
        getProjectRules(),
        getProjectGuides(),
        listKnowledgeBase().catch(() => []),
      ]);
      return toResult({
        rulesVersion: rules.version,
        howToUse: `Follow every rule below for the rest of this conversation. For each request, first use taskGuide to decide what kind of task it is, where it lives (most page text is in code, not Sanity) and whether it needs a yes, and projectStructure to find the files. Pass "${rules.version}" as ${RULES_VERSION_PARAM} on every tool that changes something. End every reply that did work with the Status Report from section 7. Before touching a feature, read its note from knowledgeBase with github_read_file.`,
        rules: rules.content,
        taskGuide: guides.taskGuide,
        projectStructure: guides.projectStructure,
        knowledgeBase,
      });
    }

    if (RULES_GATED_TOOLS.has(name)) {
      let current: string;
      try {
        current = (await getProjectRules()).version;
      } catch (err) {
        return toResult(
          {
            error: `Could not load ${RULES_PATH} to check the rules version, so this change was not made: ${String(err)}`,
          },
          true,
        );
      }
      const blocked = rulesVersionError(rulesVersion, current);
      if (blocked) return toResult({ error: blocked }, true);
    }

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
