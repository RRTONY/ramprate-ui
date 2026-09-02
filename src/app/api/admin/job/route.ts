import { NextRequest, NextResponse } from "next/server";
import { isPortalUnlocked } from "@/lib/portal-auth";
import { getAdminSession } from "@/lib/admin/session";
import {
  buildInitialMessages,
  type StepAttachment,
  type StepHistoryMsg,
} from "@/lib/admin/agent-step";
import { createJob } from "@/lib/admin/job-store";

// Netlify Functions (this route's runtime, via @netlify/plugin-nextjs) hard-cap
// request payloads at 6MB. Base64 inflates raw bytes by ~4/3, so files must stay
// well under that once encoded and wrapped in JSON — mirrors the same limits
// on the streaming chat route.
const MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024;
const MAX_TOTAL_ATTACHMENT_BYTES = 4 * 1024 * 1024;

interface JobRequestAttachment {
  name: string;
  mediaType: string;
  base64: string;
}

// Starts a background admin-chat job: writes the initial state to the job
// store (src/lib/admin/job-store.ts) and returns immediately — no Claude
// call happens here. netlify/functions/admin-job-runner.mts picks it up on
// its next scheduled tick and drives it forward one bounded step at a time
// (src/lib/admin/agent-step.ts). The browser polls
// GET /api/admin/job/[jobId] for progress instead of holding one long
// connection open for the whole turn.
export async function POST(req: NextRequest) {
  const unlocked = await isPortalUnlocked("admin");
  if (!unlocked) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
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
    history?: StepHistoryMsg[];
    attachments?: JobRequestAttachment[];
  };

  if (!message?.trim()) {
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
  const messages = buildInitialMessages({
    message,
    history,
    attachments: stepAttachments,
  });

  const jobId = await createJob({
    messages,
    attachments: stepAttachments,
    branch: session.branch,
    prNumber: session.prNumber,
  });

  return NextResponse.json({ jobId });
}
