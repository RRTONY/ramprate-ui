import { NextRequest, NextResponse } from "next/server";
import type Anthropic from "@anthropic-ai/sdk";
import { isPortalUnlocked } from "@/lib/portal-auth";
import { getAdminSession } from "@/lib/admin/session";
import {
  buildInitialMessages,
  runAgentStep,
  type AgentTurnState,
  type StepAttachment,
  type StepHistoryMsg,
} from "@/lib/admin/agent-step";
import { dailyLimitReached, recordAdminChatCall } from "@/lib/admin/rate-limit";

// This route streams its response (Server-Sent Events). Netlify's free plan
// hard-caps a *synchronous* function at ~10s; streaming a response is what
// let a single Sonnet call (which routinely needs more than 10s just to
// produce its first tool call) avoid an immediate 504, by getting Netlify to
// see the function respond right away instead of waiting on it silently.
// EXACTLY how much wall-clock time a streaming function gets past that,
// though, isn't verified against this plan's real, current limit — treat
// TOOL_TIME_BUDGET_MS below as a conservative guess, not a documented fact.
// When a request still comes back "cut off" with no detail, check
// agent-step.ts's console.log timing checkpoints in Netlify's function logs
// for the request to see whether the Claude call itself or the tool-call
// chain after it is what's running long, rather than re-guessing the budget
// blind.
export const dynamic = "force-dynamic";

interface ChatAttachment {
  name: string;
  mediaType: string;
  base64: string;
}

// The full state of an in-progress turn, round-tripped opaquely between
// client and server. Still one Claude call per HTTP request (see the step
// comment below); `branch`/`prNumber` are threaded through here too so a
// multi-step turn no longer depends on a Set-Cookie landing between steps —
// a streamed response has already flushed its headers by the time a branch
// gets created mid-stream, so cookie persistence moved to POST
// /api/admin/session, which the client calls once the turn settles.
interface TurnState {
  messages: Anthropic.MessageParam[];
  auditLog: string[];
  downloads: { name: string; mediaType: string; base64: string }[];
  iteration: number;
  branch?: string | null;
  prNumber?: number | null;
}

// Netlify Functions (this route's runtime, via @netlify/plugin-nextjs) hard-cap
// request payloads at 6MB. Base64 inflates raw bytes by ~4/3, so files must stay
// well under that once encoded and wrapped in JSON — 8MB raw (~10.9MB encoded)
// was silently rejected by Netlify before ever reaching this handler.
const MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024;
const MAX_TOTAL_ATTACHMENT_BYTES = 4 * 1024 * 1024;

// A single step can carry MULTIPLE tool_use blocks from one Claude response
// (e.g. read a file, check its code quality, write it back, check the PR
// status), and each one runs in sequence before the client ever gets control
// back. On Netlify's free plan, nothing stops that chain from quietly
// running past the platform's own hard timeout, which kills the function
// outright — no error, no turnState, the browser just sees the stream die
// (the "response was cut off" message). This budget makes the route yield
// control back to the client (a normal `step` event, which the client
// already auto-resumes) BEFORE that wall, instead of after it.
const TOOL_TIME_BUDGET_MS = 45_000;

export async function POST(req: NextRequest) {
  const requestStartedAt = Date.now();
  const unlocked = await isPortalUnlocked("admin");
  if (!unlocked) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (dailyLimitReached()) {
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
    history?: StepHistoryMsg[];
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

  const session = await getAdminSession();
  const stepAttachments: StepAttachment[] = attachments;

  // Everything below happens *inside* the stream so the very first byte goes
  // out immediately — no GitHub round-trip or Claude latency between the
  // client's fetch() and Netlify seeing the function respond.
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      const emit = (obj: unknown) => {
        if (closed) return;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      };
      const finish = () => {
        if (closed) return;
        closed = true;
        controller.close();
      };

      // Opening comment frame: forces headers to flush now, before any
      // upstream latency, so Netlify never treats this as a slow synchronous
      // response.
      controller.enqueue(encoder.encode(": open\n\n"));

      try {
        // Fresh turn: build the initial message from scratch. Continuation:
        // pick up exactly where the previous step's response left off.
        const turnState: AgentTurnState = incomingTurnState
          ? {
              messages: incomingTurnState.messages,
              auditLog: incomingTurnState.auditLog,
              downloads: incomingTurnState.downloads,
              iteration: incomingTurnState.iteration,
              branch: incomingTurnState.branch ?? session.branch,
              prNumber: incomingTurnState.prNumber ?? session.prNumber,
            }
          : {
              messages: buildInitialMessages({
                message: message ?? "",
                history,
                attachments: stepAttachments,
              }),
              auditLog: [],
              downloads: [],
              iteration: 0,
              branch: session.branch,
              prNumber: session.prNumber,
            };

        recordAdminChatCall();

        const result = await runAgentStep(turnState, {
          attachments: stepAttachments,
          timeBudgetMs: TOOL_TIME_BUDGET_MS,
          requestStartedAt,
          onTextDelta: (delta) => emit({ type: "text", delta }),
          onStatus: (stepLabel, step) =>
            emit({ type: "status", stepLabel, step }),
        });

        if (result.type === "error") {
          emit({ type: "error", error: result.error });
          finish();
          return;
        }

        if (result.type === "done") {
          emit({
            type: "done",
            answer: result.answer,
            branch: result.branch,
            prNumber: result.prNumber,
            prUrl: result.prUrl,
            auditLog: result.auditLog,
            downloads: result.downloads,
          });
        } else {
          emit({
            type: "step",
            turnState: result.state,
            stepLabel: result.stepLabel,
            step: result.state.iteration,
            branch: result.branch,
            prNumber: result.prNumber,
            prUrl: result.prUrl,
          });
        }
        finish();
      } catch (err) {
        emit({
          type: "error",
          error:
            err instanceof Error
              ? err.message
              : "Something went wrong handling this step.",
        });
        finish();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
