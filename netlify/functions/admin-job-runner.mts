// A Netlify Scheduled Function — NOT a Next.js route. Lives outside
// src/app/api on purpose: Netlify's scheduled/background "advanced API
// routes" only work with the legacy Pages Router (pages/api/*.ts with an
// exported `config`), and this project is pure App Router. Relative imports
// (not the `@/` alias) on purpose too: this file is bundled by Netlify's own
// function bundler, separately from the Next.js build, and that bundler
// resolving tsconfig path aliases isn't a verified assumption — unlike the
// relative path below, which needs no such assumption.
//
// Ticks once a minute (Netlify's minimum interval) and advances ONE queued
// admin-chat job by exactly one bounded step — the same step logic the
// streaming /api/admin/chat route uses, extracted into agent-step.ts so a
// slow or failed step never depends on a live browser connection surviving
// it. If this run itself gets killed by Netlify's own execution limit
// mid-step, the job simply stays out of "done"/"error" and the next tick
// (a minute later) picks it up again — nothing is lost, since state lives
// in the job store, not in this invocation's memory.
import {
  runAgentStep,
  type AgentTurnState,
} from "../../src/lib/admin/agent-step";
import {
  getJob,
  listActiveJobIds,
  updateJob,
} from "../../src/lib/admin/job-store";
import {
  dailyLimitReached,
  recordAdminChatCall,
} from "../../src/lib/admin/rate-limit";

// Deliberately tight, mirroring the streaming route's own budget after it
// was proven too generous in production (src/app/api/admin/chat/route.ts:
// even a simple request silently hit Netlify's real kill before that
// route's own timeout could fire). A Scheduled Function's real execution
// ceiling is a separate, equally unverified number — same fix applies: fail
// fast and leave the job "queued" for the next tick rather than gamble on a
// bigger number and risk this run getting killed mid-step with nothing
// saved.
const TOOL_TIME_BUDGET_MS = 8_000;

async function handler() {
  const jobIds = await listActiveJobIds();
  if (jobIds.length === 0) {
    return new Response("no active jobs");
  }

  // One job per tick keeps each invocation small and bounded — a slow job
  // doesn't starve every other job waiting behind it forever, since the
  // next tick picks up wherever this one left off.
  const jobId = jobIds[0];
  const job = await getJob(jobId);
  if (!job || job.status === "done" || job.status === "error") {
    // Already finished by a previous tick, or the record vanished — clear
    // it from the index instead of reprocessing. updateJob only needs a
    // status to react to; an empty patch re-derives from what's already
    // stored.
    if (job) await updateJob(jobId, {});
    return new Response(`job ${jobId} already finished or missing`);
  }

  if (dailyLimitReached()) {
    await updateJob(jobId, {
      status: "error",
      error: "Daily admin chat limit reached. Try again tomorrow.",
    });
    return new Response("daily limit reached");
  }

  await updateJob(jobId, { status: "running" });
  recordAdminChatCall();

  const state: AgentTurnState = {
    messages: job.messages,
    auditLog: job.auditLog,
    downloads: job.downloads,
    iteration: job.iteration,
    branch: job.branch,
    prNumber: job.prNumber,
  };

  try {
    const result = await runAgentStep(state, {
      attachments: job.attachments,
      timeBudgetMs: TOOL_TIME_BUDGET_MS,
      requestStartedAt: Date.now(),
    });

    if (result.type === "error") {
      await updateJob(jobId, { status: "error", error: result.error });
    } else if (result.type === "done") {
      await updateJob(jobId, {
        status: "done",
        answer: result.answer,
        branch: result.branch,
        prNumber: result.prNumber,
        auditLog: result.auditLog,
        downloads: result.downloads,
      });
    } else {
      await updateJob(jobId, {
        status: "queued",
        messages: result.state.messages,
        auditLog: result.state.auditLog,
        downloads: result.state.downloads,
        iteration: result.state.iteration,
        branch: result.branch,
        prNumber: result.prNumber,
        stepLabel: result.stepLabel,
      });
    }
  } catch (err) {
    // A step that throws (its own Claude-call timeout included, or any
    // other uncaught error) just goes back to "queued" for the next tick to
    // retry — state already lives in the store, not in this invocation, so
    // nothing is lost.
    await updateJob(jobId, {
      status: "queued",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }

  return new Response(`processed job ${jobId}`);
}

export default handler;

export const config = {
  schedule: "*/1 * * * *",
};
