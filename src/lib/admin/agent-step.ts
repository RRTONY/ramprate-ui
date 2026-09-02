import Anthropic from "@anthropic-ai/sdk";
import { ADMIN_SYSTEM_PROMPT } from "@/lib/admin/system-prompt";
import {
  ADMIN_TOOLS,
  runAdminTool,
  type AdminToolContext,
} from "@/lib/admin/tools";
import { ADMIN_BRANCH_PREFIX } from "@/lib/admin/guardrails";
import * as gh from "@/lib/admin/github-client";

// The framework-agnostic core of one admin-chat step: one Claude call (+ any
// tools it asks for), bounded by a time budget. Originally lived inline in
// src/app/api/admin/chat/route.ts (the streaming HTTP route); extracted so a
// Netlify Scheduled Function can also drive a turn forward one step at a
// time, without either caller needing to duplicate this logic. Behavior is
// unchanged from the route's original inline version — only where it lives
// moved.

export interface StepAttachment {
  name: string;
  mediaType: string;
  base64: string;
}

export interface StepDownload {
  name: string;
  mediaType: string;
  base64: string;
}

export interface StepHistoryMsg {
  role: "user" | "assistant";
  content: string;
}

const INLINE_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

// Builds the first message of a fresh turn, inlining images/PDFs so Claude
// can actually see/read them. Pure — no network or store access — so it's
// safe to call from either the streaming route or a job's "start" endpoint.
export function buildInitialMessages(input: {
  message: string;
  history: StepHistoryMsg[];
  attachments: StepAttachment[];
}): Anthropic.MessageParam[] {
  const { message, history, attachments } = input;
  const userContent: Anthropic.ContentBlockParam[] = [
    {
      type: "text",
      text:
        message.trim() +
        (attachments.length
          ? `\n\n[Attached: ${attachments.map((a) => a.name).join(", ")} — images and PDFs above are already visible/readable inline. Only use get_attachment if you need to commit one of these into the repo as a file via github_write_binary_file.]`
          : ""),
    },
  ];
  for (const att of attachments) {
    if (INLINE_IMAGE_TYPES.has(att.mediaType)) {
      userContent.push({
        type: "image",
        source: {
          type: "base64",
          media_type: att.mediaType as "image/jpeg",
          data: att.base64,
        },
      });
    } else if (att.mediaType === "application/pdf") {
      userContent.push({
        type: "document",
        source: {
          type: "base64",
          media_type: "application/pdf",
          data: att.base64,
        },
        title: att.name,
      });
    }
  }
  return [
    ...history
      .slice(-20)
      .map(
        (m) => ({ role: m.role, content: m.content }) as Anthropic.MessageParam,
      ),
    { role: "user", content: userContent } as Anthropic.MessageParam,
  ];
}

export interface AgentTurnState {
  messages: Anthropic.MessageParam[];
  auditLog: string[];
  downloads: StepDownload[];
  iteration: number;
  branch: string | null;
  prNumber: number | null;
}

export interface RunStepDeps {
  attachments: StepAttachment[];
  timeBudgetMs: number;
  requestStartedAt: number;
  onTextDelta?: (delta: string) => void;
  onStatus?: (stepLabel: string, step: number) => void;
}

export type StepResult =
  | {
      type: "done";
      answer: string;
      branch: string | null;
      prNumber: number | null;
      prUrl: string | null;
      auditLog: string[];
      downloads: StepDownload[];
    }
  | {
      type: "continue";
      state: AgentTurnState;
      stepLabel: string;
      branch: string | null;
      prNumber: number | null;
      prUrl: string | null;
    }
  | { type: "error"; error: string };

const MAX_TOOL_ITERATIONS = 25;

function newBranchName(): string {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${ADMIN_BRANCH_PREFIX}${stamp}-${suffix}`;
}

// Human-readable label for what's happening right now, so a chat UI can show
// real progress ("Writing src/app/sourcing/page.tsx…") instead of a generic
// spinner with no idea how far along it is.
function describeToolCall(call: Anthropic.ToolUseBlock): string {
  const input = call.input as Record<string, unknown>;
  const path = typeof input.path === "string" ? input.path : "";
  switch (call.name) {
    case "github_list_dir":
      return `Looking at ${path || "the repo root"}`;
    case "github_read_file":
      return `Reading ${path}`;
    case "github_write_file":
      return `Writing ${path}`;
    case "github_delete_file":
      return `Deleting ${path}`;
    case "github_write_binary_file":
      return `Saving ${path}`;
    case "get_attachment":
      return `Retrieving ${String(input.name ?? "attachment")}`;
    case "seo_check_page":
      return `Checking SEO on ${String(input.path ?? "")}`;
    case "lighthouse_check_page":
      return `Running a Lighthouse check on ${String(input.path ?? "")}`;
    case "check_code_quality":
      return `Checking code quality for ${path}`;
    case "check_pr_status":
      return "Checking the pending change's automatic checks";
    case "get_check_log_excerpt":
      return "Reading the details of a failed check";
    case "create_download":
      return `Preparing ${String(input.name ?? "a file")} for download`;
    case "sanity_query":
      return "Querying Sanity content";
    case "sanity_get_document":
      return `Reading Sanity document ${String(input.id ?? "")}`;
    case "sanity_patch_document":
      return `Updating Sanity document ${String(input.id ?? "")}`;
    case "sanity_create_document":
      return `Creating a new Sanity ${String(input.docType ?? "document")}`;
    default:
      return `Running ${call.name}`;
  }
}

export function describeStep(toolUses: Anthropic.ToolUseBlock[]): string {
  if (toolUses.length === 0) return "Thinking…";
  const label = describeToolCall(toolUses[0]);
  return toolUses.length > 1
    ? `${label} (+${toolUses.length - 1} more)`
    : label;
}

export async function runAgentStep(
  state: AgentTurnState,
  deps: RunStepDeps,
): Promise<StepResult> {
  let branch = state.branch;
  let prNumber = state.prNumber;
  const defaultBranch = await gh.getDefaultBranch();

  // The session cookie / threaded branch can outlive the branch it points
  // at — its PR may have been merged/closed outside this app's own Publish
  // flow, or the branch deleted directly. Every GitHub call keyed on a dead
  // branch 404s. Check once up front and reset to a fresh session instead of
  // failing on it.
  if (branch) {
    const exists = await gh.branchExists(branch);
    if (!exists) {
      branch = null;
      prNumber = null;
    }
  }

  const attachmentMap = new Map(
    deps.attachments.map((a) => [
      a.name,
      { mediaType: a.mediaType, base64: a.base64 },
    ]),
  );
  const auditLog = [...state.auditLog];
  const downloads = [...state.downloads];

  const ctx: AdminToolContext = {
    getReadBranch: () => branch ?? defaultBranch,
    ensureWriteBranch: async () => {
      if (branch) return branch;
      // Single-admin assumption: if another tab already has a session in
      // flight, adopt it instead of forking a second, conflicting branch.
      const existingPR = await gh.findOpenAdminPR(ADMIN_BRANCH_PREFIX);
      if (existingPR) {
        branch = existingPR.branch;
        prNumber = existingPR.number;
        auditLog.push(
          `Resumed existing session: PR #${existingPR.number} (${existingPR.branch})`,
        );
        return branch;
      }
      branch = newBranchName();
      await gh.createBranch(branch);
      auditLog.push(`Created branch ${branch}`);
      return branch;
    },
    getPRNumber: () => prNumber ?? null,
    getAttachment: (name) => attachmentMap.get(name) ?? null,
    recordDownload: (file) => downloads.push(file),
    log: (entry) => auditLog.push(entry),
  };

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const iteration = state.iteration + 1;

  const mstream = client.messages.stream({
    model: "claude-sonnet-5",
    // Verified against a real page in this repo (src/app/sourcing/page.tsx,
    // ~39K chars / ~1057 lines): 8192 was NOT enough headroom for
    // github_write_file to emit a full-file rewrite of a page this size in
    // one tool call. 16000 completed cleanly. This cap only bounds the
    // ceiling, not actual spend.
    max_tokens: 16000,
    system: [
      {
        type: "text",
        text: ADMIN_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: ADMIN_TOOLS as Anthropic.Tool[],
    messages: state.messages,
  });
  mstream.on("text", (delta) => deps.onTextDelta?.(delta));

  let response: Anthropic.Message;
  try {
    // Nothing running INSIDE a doomed request can save itself once the
    // platform decides to kill it — racing the call against our own,
    // deliberately conservative deadline turns that silent kill into a
    // clear result instead, and actually stops the Anthropic request
    // (abort) rather than leaving it running for nothing once the caller
    // has already given up on it.
    const remainingMs = Math.max(
      deps.timeBudgetMs - (Date.now() - deps.requestStartedAt),
      1000,
    );
    response = await Promise.race([
      mstream.finalMessage(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("CLAUDE_CALL_TIMEOUT")), remainingMs);
      }),
    ]);
  } catch (err) {
    if (err instanceof Error && err.message === "CLAUDE_CALL_TIMEOUT") {
      mstream.abort();
      return {
        type: "error",
        error:
          'This is taking longer than the server allows to answer in one go. Try asking for one smaller, more specific fix at a time instead of a broad "fix this" request.',
      };
    }
    return {
      type: "error",
      error:
        err instanceof Error
          ? `Claude API call failed: ${err.message}`
          : "Claude API call failed",
    };
  }

  // Bare timing checkpoint (visible in Netlify's function logs) — there's no
  // APM here, and a "cut off" failure gives the caller zero detail about
  // where the time actually went, so this is the only way to tell a slow
  // Claude call apart from a slow tool chain after the fact.
  console.log(
    `[admin-chat] step ${iteration}: Claude call took ${Date.now() - deps.requestStartedAt}ms`,
  );

  const messages = [
    ...state.messages,
    { role: "assistant", content: response.content } as Anthropic.MessageParam,
  ];

  const toolUses = response.content.filter(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
  );
  const textBlock = response.content.find(
    (b): b is Anthropic.TextBlock => b.type === "text",
  );
  const stepText = textBlock?.text ?? "";
  const stepLabel = describeStep(toolUses);

  // A response cut off mid-generation (e.g. a huge file rewrite that
  // outgrows max_tokens) is NOT a normal finish — stop_reason just won't be
  // "tool_use" either, so without this check it would silently fall through
  // to "done" below with a truncated answer and no indication anything went
  // wrong, even though the intended edit never happened.
  if (response.stop_reason === "max_tokens") {
    return {
      type: "error",
      error:
        "Claude's response was cut off mid-generation (likely writing a very large file in one go). Try asking for a smaller, more targeted change instead of a full-file rewrite.",
    };
  }

  let done = response.stop_reason !== "tool_use" || toolUses.length === 0;

  if (!done) {
    deps.onStatus?.(stepLabel, iteration);
    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    let outOfTime = false;
    for (const call of toolUses) {
      if (Date.now() - deps.requestStartedAt > deps.timeBudgetMs) {
        outOfTime = true;
      }
      if (outOfTime) {
        toolResults.push({
          type: "tool_result",
          tool_use_id: call.id,
          content: JSON.stringify({
            error:
              "Not run yet — this step ran out of time. It will run on the next step, right after this one.",
          }),
          is_error: true,
        });
        continue;
      }
      const result = await runAdminTool(
        call.name,
        call.input as Record<string, unknown>,
        ctx,
      );
      console.log(
        `[admin-chat] step ${iteration}: ${call.name} finished at ${Date.now() - deps.requestStartedAt}ms`,
      );
      toolResults.push({
        type: "tool_result",
        tool_use_id: call.id,
        content: JSON.stringify(result.output),
        is_error: result.isError,
      });
    }
    messages.push({ role: "user", content: toolResults });
  }

  let stepLimitReached = false;
  if (!done && iteration >= MAX_TOOL_ITERATIONS) {
    done = true;
    stepLimitReached = true;
  }

  // Open (or confirm) the PR as soon as this turn has produced a commit —
  // cheap and idempotent, so it's fine to check on every step rather than
  // only at the very end.
  let prUrl: string | null = null;
  if (branch) {
    if (!prNumber) {
      const pr = await gh.openPR(
        branch,
        "Admin chat: site edits",
        "Opened automatically by the admin chat. Review the diff before publishing.",
      );
      prNumber = pr.number;
      prUrl = pr.url;
      auditLog.push(`Opened PR #${pr.number}`);
    } else {
      prUrl = `https://github.com/RRTONY/ramprate-ui/pull/${prNumber}`;
    }
  }

  if (done) {
    return {
      type: "done",
      answer: stepLimitReached
        ? `${stepText}\n\n(Stopped after ${MAX_TOOL_ITERATIONS} tool steps — send another message to continue.)`
        : stepText || "Done.",
      branch,
      prNumber,
      prUrl,
      auditLog,
      downloads,
    };
  }

  return {
    type: "continue",
    state: { messages, auditLog, downloads, iteration, branch, prNumber },
    stepLabel,
    branch,
    prNumber,
    prUrl,
  };
}
