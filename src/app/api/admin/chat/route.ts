import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { isPortalUnlocked } from "@/lib/portal-auth";
import { ADMIN_SYSTEM_PROMPT } from "@/lib/admin/system-prompt";
import {
  ADMIN_TOOLS,
  runAdminTool,
  type AdminToolContext,
} from "@/lib/admin/tools";
import { ADMIN_BRANCH_PREFIX } from "@/lib/admin/guardrails";
import * as gh from "@/lib/admin/github-client";
import { getAdminSession, setAdminSessionCookies } from "@/lib/admin/session";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

interface ChatAttachment {
  name: string;
  mediaType: string;
  base64: string;
}

interface Download {
  name: string;
  mediaType: string;
  base64: string;
}

// The full state of an in-progress turn, round-tripped opaquely between
// client and server (see below for why — Netlify's free-plan 10s
// synchronous function timeout means we can no longer run the whole
// tool-use loop server-side in one request).
interface TurnState {
  messages: Anthropic.MessageParam[];
  auditLog: string[];
  downloads: Download[];
  iteration: number;
}

const INLINE_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);
// Netlify Functions (this route's runtime, via @netlify/plugin-nextjs) hard-cap
// request payloads at 6MB. Base64 inflates raw bytes by ~4/3, so files must stay
// well under that once encoded and wrapped in JSON — 8MB raw (~10.9MB encoded)
// was silently rejected by Netlify before ever reaching this handler.
const MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024;
const MAX_TOTAL_ATTACHMENT_BYTES = 4 * 1024 * 1024;

// Sonnet + agentic tool use costs far more per call than the visitor chatbot's
// single-shot Haiku turns, so the daily cap here is much lower. This now
// counts real Anthropic API calls (one per step — see below), not user
// turns, so it's a genuinely accurate spend cap rather than the old
// per-turn count that quietly let a single complex turn make up to
// MAX_TOOL_ITERATIONS real calls without moving the counter.
const DAILY_LIMIT = 150;
const BLOCK_AT_PERCENT = 0.95;
const MAX_TOOL_ITERATIONS = 25;

let callsToday = 0;
let counterDate = new Date().toISOString().slice(0, 10);

function resetIfNewDay() {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== counterDate) {
    callsToday = 0;
    counterDate = today;
  }
}

function newBranchName(): string {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${ADMIN_BRANCH_PREFIX}${stamp}-${suffix}`;
}

// Human-readable label for what's happening right now, so the admin chat UI
// can show real progress ("Writing src/app/sourcing/page.tsx…") across a
// multi-step turn instead of a generic spinner with no idea how far along
// it is.
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

function describeStep(toolUses: Anthropic.ToolUseBlock[]): string {
  if (toolUses.length === 0) return "Thinking…";
  const label = describeToolCall(toolUses[0]);
  return toolUses.length > 1
    ? `${label} (+${toolUses.length - 1} more)`
    : label;
}

export async function POST(req: NextRequest) {
  const unlocked = await isPortalUnlocked("admin");
  if (!unlocked) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  resetIfNewDay();
  if (callsToday >= Math.floor(DAILY_LIMIT * BLOCK_AT_PERCENT)) {
    return NextResponse.json(
      { error: "Daily admin chat limit reached. Try again tomorrow." },
      { status: 429 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 },
    );
  }
  if (!process.env.GITHUB_TOKEN) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN is not configured" },
      { status: 500 },
    );
  }

  const {
    message,
    history = [],
    attachments = [],
    turnState: incomingTurnState,
  } = (await req.json().catch(() => ({}))) as {
    message?: string;
    history?: ChatMsg[];
    attachments?: ChatAttachment[];
    turnState?: TurnState;
  };

  if (!incomingTurnState && !message?.trim()) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const oversized = attachments.find(
    (a) => Buffer.byteLength(a.base64, "base64") > MAX_ATTACHMENT_BYTES,
  );
  if (oversized) {
    return NextResponse.json(
      { error: `"${oversized.name}" is too large (max 3MB per file)` },
      { status: 400 },
    );
  }
  const totalAttachmentBytes = attachments.reduce(
    (sum, a) => sum + Buffer.byteLength(a.base64, "base64"),
    0,
  );
  if (totalAttachmentBytes > MAX_TOTAL_ATTACHMENT_BYTES) {
    return NextResponse.json(
      {
        error:
          "Attachments are too large combined (max 4MB total) — attach fewer or smaller files at once.",
      },
      { status: 400 },
    );
  }
  // Rebuilt fresh every step, since nothing persists server-side between
  // requests — the client re-sends the same attachments on every step of a
  // turn so get_attachment keeps working no matter which step calls it.
  const attachmentMap = new Map(
    attachments.map((a) => [
      a.name,
      { mediaType: a.mediaType, base64: a.base64 },
    ]),
  );

  const session = await getAdminSession();
  let branch = session.branch;
  let prNumber = session.prNumber;
  const defaultBranch = await gh.getDefaultBranch();

  // Fresh turn: build the initial message from scratch, inlining images/PDFs
  // so Claude can actually see/read them. Continuation: pick up exactly
  // where the previous step's response left off.
  const state: TurnState = incomingTurnState ?? {
    messages: (() => {
      const userContent: Anthropic.ContentBlockParam[] = [
        {
          type: "text",
          text:
            (message ?? "").trim() +
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
            (m) =>
              ({ role: m.role, content: m.content }) as Anthropic.MessageParam,
          ),
        { role: "user", content: userContent } as Anthropic.MessageParam,
      ];
    })(),
    auditLog: [],
    downloads: [],
    iteration: 0,
  };

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
        state.auditLog.push(
          `Resumed existing session: PR #${existingPR.number} (${existingPR.branch})`,
        );
        return branch;
      }
      branch = newBranchName();
      await gh.createBranch(branch);
      state.auditLog.push(`Created branch ${branch}`);
      return branch;
    },
    getAttachment: (name) => attachmentMap.get(name) ?? null,
    recordDownload: (file) => state.downloads.push(file),
    log: (entry) => state.auditLog.push(entry),
  };

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // One step = one real Claude call (+ any tools it asks for), then return
  // control to the client. This is the whole reason for the turnState
  // round-trip: Netlify's free-plan synchronous function timeout is a hard
  // 10 seconds, and the old design ran up to MAX_TOOL_ITERATIONS Claude+
  // GitHub round trips inside a single request — trivially long enough to
  // get killed mid-flight on anything but the simplest one-tool edit. Doing
  // exactly one step per request keeps each individual request fast; the
  // client automatically calls back-to-back until the turn is done, so it
  // still looks like one message to the admin.
  state.iteration++;
  callsToday++;

  let response: Anthropic.Message;
  try {
    response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 8192,
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
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? `Claude API call failed: ${err.message}`
            : "Claude API call failed",
      },
      { status: 502 },
    );
  }

  state.messages.push({ role: "assistant", content: response.content });

  const toolUses = response.content.filter(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
  );
  const textBlock = response.content.find(
    (b): b is Anthropic.TextBlock => b.type === "text",
  );
  const stepText = textBlock?.text ?? "";
  const stepLabel = describeStep(toolUses);

  let done = response.stop_reason !== "tool_use" || toolUses.length === 0;

  if (!done) {
    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const call of toolUses) {
      const result = await runAdminTool(
        call.name,
        call.input as Record<string, unknown>,
        ctx,
      );
      toolResults.push({
        type: "tool_result",
        tool_use_id: call.id,
        content: JSON.stringify(result.output),
        is_error: result.isError,
      });
    }
    state.messages.push({ role: "user", content: toolResults });
  }

  let stepLimitReached = false;
  if (!done && state.iteration >= MAX_TOOL_ITERATIONS) {
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
      state.auditLog.push(`Opened PR #${pr.number}`);
    } else {
      prUrl = `https://github.com/RRTONY/ramprate-ui/pull/${prNumber}`;
    }
  }

  const res = NextResponse.json(
    done
      ? {
          done: true,
          answer: stepLimitReached
            ? `${stepText}\n\n(Stopped after ${MAX_TOOL_ITERATIONS} tool steps — send another message to continue.)`
            : stepText || "Done.",
          branch,
          prNumber,
          prUrl,
          auditLog: state.auditLog,
          downloads: state.downloads,
        }
      : {
          done: false,
          turnState: state,
          stepLabel,
          step: state.iteration,
          branch,
          prNumber,
          prUrl,
        },
  );

  if (branch) {
    setAdminSessionCookies(res, { branch, prNumber: prNumber ?? undefined });
  }

  return res;
}
