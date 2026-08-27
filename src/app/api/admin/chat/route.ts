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

const INLINE_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);
const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;

// Sonnet + agentic tool use costs far more per call than the visitor chatbot's
// single-shot Haiku turns, so the daily cap here is much lower.
const DAILY_LIMIT = 20;
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
  } = (await req.json().catch(() => ({}))) as {
    message?: string;
    history?: ChatMsg[];
    attachments?: ChatAttachment[];
  };
  if (!message?.trim()) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const oversized = attachments.find(
    (a) => Buffer.byteLength(a.base64, "base64") > MAX_ATTACHMENT_BYTES,
  );
  if (oversized) {
    return NextResponse.json(
      { error: `"${oversized.name}" is too large (max 8MB per file)` },
      { status: 400 },
    );
  }
  const attachmentMap = new Map(
    attachments.map((a) => [
      a.name,
      { mediaType: a.mediaType, base64: a.base64 },
    ]),
  );

  const session = await getAdminSession();
  let branch = session.branch;
  let prNumber = session.prNumber;
  const auditLog: string[] = [];
  const downloads: { name: string; mediaType: string; base64: string }[] = [];
  const defaultBranch = await gh.getDefaultBranch();

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
    getAttachment: (name) => attachmentMap.get(name) ?? null,
    recordDownload: (file) => downloads.push(file),
    log: (entry) => auditLog.push(entry),
  };

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Images are inlined directly so Claude can see them (e.g. "match this
  // mockup"); every attachment, image or not, is also fetchable via the
  // get_attachment tool so it can be committed to the repo as-is.
  const userContent: Anthropic.ContentBlockParam[] = [
    {
      type: "text",
      text:
        message.trim() +
        (attachments.length
          ? `\n\n[Attached: ${attachments.map((a) => a.name).join(", ")} — use get_attachment to retrieve one if you need its raw content.]`
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
    }
  }

  const messages: Anthropic.MessageParam[] = [
    ...history
      .slice(-20)
      .map(
        (m) => ({ role: m.role, content: m.content }) as Anthropic.MessageParam,
      ),
    { role: "user", content: userContent },
  ];

  callsToday++;

  let iterations = 0;
  let finalText = "";
  let stepLimitReached = false;

  while (iterations < MAX_TOOL_ITERATIONS) {
    iterations++;
    const response = await client.messages.create({
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
      messages,
    });

    messages.push({ role: "assistant", content: response.content });

    const toolUses = response.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
    );

    const textBlock = response.content.find(
      (b): b is Anthropic.TextBlock => b.type === "text",
    );
    if (textBlock) finalText = textBlock.text;

    if (response.stop_reason !== "tool_use" || toolUses.length === 0) {
      break;
    }

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
    messages.push({ role: "user", content: toolResults });

    if (iterations >= MAX_TOOL_ITERATIONS) {
      stepLimitReached = true;
    }
  }

  // Open (or confirm) the PR once this turn produced at least one commit.
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

  const res = NextResponse.json({
    answer: stepLimitReached
      ? `${finalText}\n\n(Stopped after ${MAX_TOOL_ITERATIONS} tool steps — send another message to continue.)`
      : finalText || "Done.",
    branch,
    prNumber,
    prUrl,
    auditLog,
    downloads,
  });

  if (branch) {
    setAdminSessionCookies(res, { branch, prNumber: prNumber ?? undefined });
  }

  return res;
}
