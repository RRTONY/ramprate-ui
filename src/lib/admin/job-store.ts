import { randomUUID } from "crypto";
import { getStore } from "@netlify/blobs";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";

// One admin-chat turn, persisted so a Netlify Scheduled Function (not the
// browser, and not a single HTTP request) can drive it forward one step at a
// time — see src/lib/admin/agent-step.ts and netlify/functions/admin-job-runner.mts.
// "queued" means the next scheduled tick should run a step; "running" is set
// briefly by the runner so two overlapping ticks can't process the same job
// twice; a step that throws leaves the job "queued" again for the next tick
// to retry, rather than failing the whole turn.
export type JobStatus = "queued" | "running" | "done" | "error";

export interface JobDownload {
  name: string;
  mediaType: string;
  base64: string;
}

export interface JobAttachment {
  name: string;
  mediaType: string;
  base64: string;
}

export interface JobRecord {
  id: string;
  status: JobStatus;
  messages: MessageParam[];
  // Kept alongside the job (not just used once to build the first message)
  // because every step's get_attachment tool call needs them, and there's
  // no live browser connection re-sending them on each tick like the old
  // streaming route relied on.
  attachments: JobAttachment[];
  auditLog: string[];
  downloads: JobDownload[];
  iteration: number;
  branch: string | null;
  prNumber: number | null;
  stepLabel: string | null;
  answer: string | null;
  error: string | null;
  createdAt: number;
  updatedAt: number;
}

const STORE_NAME = "admin-jobs";
const ACTIVE_INDEX_KEY = "active-index";
const jobKey = (id: string) => `job:${id}`;

// Pure — no store I/O — so it's testable without a real Netlify Blobs
// connection. Keeping the index deduplicated matters: the runner and a
// browser poll could both try to (re-)add the same job id.
export function addToIndex(existing: string[], id: string): string[] {
  return existing.includes(id) ? existing : [...existing, id];
}

export function removeFromIndex(existing: string[], id: string): string[] {
  return existing.filter((existingId) => existingId !== id);
}

function store() {
  return getStore(STORE_NAME);
}

export async function createJob(
  initial: Pick<JobRecord, "messages" | "attachments" | "branch" | "prNumber">,
): Promise<string> {
  const id = randomUUID();
  const now = Date.now();
  const job: JobRecord = {
    id,
    status: "queued",
    messages: initial.messages,
    attachments: initial.attachments,
    auditLog: [],
    downloads: [],
    iteration: 0,
    branch: initial.branch,
    prNumber: initial.prNumber,
    stepLabel: null,
    answer: null,
    error: null,
    createdAt: now,
    updatedAt: now,
  };
  const s = store();
  await s.setJSON(jobKey(id), job);
  const index = ((await s.get(ACTIVE_INDEX_KEY, { type: "json" })) ??
    []) as string[];
  await s.setJSON(ACTIVE_INDEX_KEY, addToIndex(index, id));
  return id;
}

export async function getJob(id: string): Promise<JobRecord | null> {
  return ((await store().get(jobKey(id), { type: "json" })) ??
    null) as JobRecord | null;
}

export async function updateJob(
  id: string,
  patch: Partial<Omit<JobRecord, "id" | "createdAt">>,
): Promise<void> {
  const current = await getJob(id);
  if (!current) return;
  const updated: JobRecord = { ...current, ...patch, updatedAt: Date.now() };
  await store().setJSON(jobKey(id), updated);
  if (updated.status === "done" || updated.status === "error") {
    const index = ((await store().get(ACTIVE_INDEX_KEY, {
      type: "json",
    })) ?? []) as string[];
    await store().setJSON(ACTIVE_INDEX_KEY, removeFromIndex(index, id));
  }
}

export async function listActiveJobIds(): Promise<string[]> {
  return ((await store().get(ACTIVE_INDEX_KEY, { type: "json" })) ??
    []) as string[];
}
