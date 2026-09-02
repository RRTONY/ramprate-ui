"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  computeWorkflowSteps,
  type WorkflowStep,
} from "@/lib/admin/workflow-steps";

interface ChatDownload {
  name: string;
  mediaType: string;
  base64: string;
}

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
  downloads?: ChatDownload[];
}

interface PendingAttachment {
  name: string;
  mediaType: string;
  base64: string;
}

// Must match src/app/api/admin/chat/route.ts — Netlify Functions (this app's
// API route runtime) hard-cap request payloads at 6MB, and base64 inflates
// raw file bytes by ~4/3, so the limits here are deliberately conservative.
const MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024;
const MAX_TOTAL_ATTACHMENT_BYTES = 4 * 1024 * 1024;

const EXAMPLE_PROMPTS = [
  "Change the headline on the Growth page",
  "Send visitors from /bio to the BioChain page",
  "Check the homepage for SEO problems and fix them",
  "Make the homepage load faster",
];

function fileToAttachment(file: File): Promise<PendingAttachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve({
        name: file.name,
        mediaType: file.type || "application/octet-stream",
        base64: result.split(",")[1] ?? "",
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface PendingFile {
  path: string;
  status: string;
  additions: number;
  deletions: number;
}

interface PendingDraft {
  id: string;
  publishedId: string;
  type: string;
  title: string;
}

interface FailingCheck {
  name: string;
  url: string | null;
}

interface PendingChanges {
  branch: string | null;
  prNumber: number | null;
  prUrl: string | null;
  previewUrl: string | null;
  checkStatus: "success" | "pending" | "failure" | "unknown";
  failingChecks: FailingCheck[];
  files: PendingFile[];
  drafts: PendingDraft[];
  canPublish: boolean;
}

async function fetchPendingChanges(): Promise<PendingChanges | null> {
  const res = await fetch("/api/admin/pending-changes");
  if (!res.ok) return null;
  return res.json();
}

// `/api/admin/chat` streams its reply, so it can't set the signed session
// cookie once a branch is created mid-stream. This persists (or clears, when
// branch is null) that cookie so the Pending changes panel and Publish keep
// working. Fire-and-forget: a failed persist just means the panel refreshes a
// turn late.
function persistSession(
  branch: string | null | undefined,
  prNumber: number | null | undefined,
): Promise<unknown> {
  return fetch("/api/admin/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      branch: branch ?? null,
      prNumber: prNumber ?? null,
    }),
  }).catch(() => undefined);
}

type ChatEvent =
  | { type: "text"; delta: string }
  | { type: "status"; stepLabel?: string; step?: number }
  | {
      type: "step";
      turnState: unknown;
      stepLabel?: string;
      step?: number;
      branch?: string | null;
      prNumber?: number | null;
    }
  | {
      type: "done";
      answer: string;
      downloads?: ChatDownload[];
      branch?: string | null;
      prNumber?: number | null;
    }
  | { type: "error"; error: string };

// Chat history is per-browser only (localStorage), not shared across devices
// or persisted server-side — good enough for a single-admin tool, and avoids
// needing a database just to remember a conversation. Downloads (base64
// payloads) are deliberately not persisted, to keep storage small.
const CHAT_STORAGE_KEY = "ramprate_admin_chat_history";
const MAX_STORED_MESSAGES = 50;

function loadStoredMessages(): ChatMsg[] {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Cached so useSyncExternalStore's getSnapshot returns a referentially
// stable value across repeated calls (it requires this — a fresh array on
// every call would look like a change on every render). Read once per page
// load; there's no cross-tab live sync here (matches this feature's existing
// design: chat history is per-browser only), so a static cache is correct,
// not just an optimization.
let cachedStoredMessages: ChatMsg[] | null = null;
function getStoredMessagesSnapshot(): ChatMsg[] {
  if (cachedStoredMessages === null) {
    cachedStoredMessages = loadStoredMessages();
  }
  return cachedStoredMessages;
}
// Must also be a stable reference across calls, same reason as the cache
// above — a fresh [] literal on every call trips React's "getServerSnapshot
// should be cached" warning (confirmed via a real hydration test).
const EMPTY_MESSAGES: ChatMsg[] = [];
function getServerMessagesSnapshot(): ChatMsg[] {
  return EMPTY_MESSAGES;
}
function noopSubscribe() {
  return () => {};
}

function saveMessages(messages: ChatMsg[]) {
  const toStore = messages
    .slice(-MAX_STORED_MESSAGES)
    .map(({ role, content }) => ({ role, content }));
  // Keep the useSyncExternalStore cache in sync with what's actually
  // stored, so a remount within the same session (SPA nav away and back)
  // can't see a stale pre-write snapshot.
  cachedStoredMessages = toStore;
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(toStore));
  } catch {
    // Storage full or unavailable (private mode, etc.) — not fatal, history just won't persist.
  }
}

// Small hand-rolled renderer for **bold**, `code`, and "- " bullet lists —
// enough to make Claude's replies readable without pulling in a markdown
// dependency for one chat panel.
function formatInline(text: string, keyPrefix: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(
        <strong key={`${keyPrefix}-${i++}`}>{token.slice(2, -2)}</strong>,
      );
    } else {
      parts.push(
        <code
          key={`${keyPrefix}-${i++}`}
          className="px-1 py-0.5 rounded bg-black/30 font-mono text-xs"
        >
          {token.slice(1, -1)}
        </code>,
      );
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

function renderMessageContent(content: string): React.ReactNode {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let codeBuffer: string[] | null = null;
  let blockIndex = 0;

  const flushList = () => {
    if (listBuffer.length === 0) return;
    const items = listBuffer;
    blocks.push(
      <ul key={`ul-${blockIndex++}`} className="list-disc pl-5 space-y-1">
        {items.map((item, i) => (
          <li key={i}>{formatInline(item, `li-${blockIndex}-${i}`)}</li>
        ))}
      </ul>,
    );
    listBuffer = [];
  };

  const flushCode = () => {
    if (codeBuffer === null) return;
    const code = codeBuffer.join("\n");
    blocks.push(
      <pre
        key={`pre-${blockIndex++}`}
        className="overflow-x-auto rounded-lg bg-black/40 border border-white/10 p-3 text-xs font-mono text-white/80"
      >
        <code>{code}</code>
      </pre>,
    );
    codeBuffer = null;
  };

  for (const rawLine of lines) {
    if (rawLine.trimStart().startsWith("```")) {
      if (codeBuffer === null) {
        flushList();
        codeBuffer = [];
      } else {
        flushCode();
      }
      continue;
    }
    if (codeBuffer !== null) {
      codeBuffer.push(rawLine);
      continue;
    }
    const line = rawLine.trim();
    if (line.startsWith("- ") || line.startsWith("* ")) {
      listBuffer.push(line.slice(2));
      continue;
    }
    flushList();
    if (line === "") continue;
    blocks.push(
      <p key={`p-${blockIndex++}`}>{formatInline(line, `p-${blockIndex}`)}</p>,
    );
  }
  flushList();
  flushCode();
  return <div className="space-y-2">{blocks}</div>;
}

// The admin agent can offer the site owner a set of choices by putting a
// fenced ```options block in its reply, one choice per line. We strip the
// block out of the rendered text and show the lines as buttons; clicking one
// sends that exact line back as the next message, so the owner never has to
// retype "option 1".
const OPTIONS_BLOCK = /```options\s*\n([\s\S]*?)```/i;

// Fallback: the model doesn't always use the block — it often writes choices
// as a plain trailing "1. … 2. …" list. If a reply reads like it's asking the
// reader to pick AND contains a short numbered list, show those as buttons
// too, so the owner still gets one-click answers.
const ASKS_TO_CHOOSE =
  /\b(option|options|want me to|which one|which option|would you like|do you want|pick one|choose|let me know which)\b/i;

function stripMarker(line: string): string {
  return line.replace(/^\s*(?:[-*]|\d+[.)])\s*/, "").trim();
}

function parseTrailingNumberedList(
  content: string,
): { text: string; options: string[] } | null {
  const lines = content.split("\n");
  const startIdx: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*\d+[.)]\s+\S/.test(lines[i])) startIdx.push(i);
  }
  if (startIdx.length < 2 || startIdx.length > 4) return null;
  for (let k = 0; k < startIdx.length; k++) {
    if (Number(lines[startIdx[k]].match(/^\s*(\d+)/)![1]) !== k + 1)
      return null;
  }
  const options: string[] = [];
  let listEnd = startIdx[startIdx.length - 1] + 1;
  for (let k = 0; k < startIdx.length; k++) {
    const from = startIdx[k];
    const hardStop = k + 1 < startIdx.length ? startIdx[k + 1] : lines.length;
    let to = from + 1;
    while (to < hardStop && lines[to].trim() !== "") to++;
    if (k === startIdx.length - 1) listEnd = to;
    const chunk = stripMarker(
      lines.slice(from, to).join(" ").replace(/\s+/g, " "),
    );
    if (!chunk || chunk.length > 240) return null;
    options.push(chunk);
  }
  const before = lines.slice(0, startIdx[0]).join("\n").trim();
  const after = lines.slice(listEnd).join("\n").trim();
  return { text: [before, after].filter(Boolean).join("\n\n"), options };
}

function extractOptions(content: string): {
  text: string;
  options: string[];
} {
  const match = content.match(OPTIONS_BLOCK);
  if (match) {
    const options = match[1].split("\n").map(stripMarker).filter(Boolean);
    return { text: content.replace(OPTIONS_BLOCK, "").trim(), options };
  }
  if (ASKS_TO_CHOOSE.test(content)) {
    const parsed = parseTrailingNumberedList(content);
    if (parsed) return parsed;
  }
  return { text: content, options: [] };
}

function Dots() {
  return (
    <span className="flex items-center gap-1 shrink-0">
      <span className="w-1.5 h-1.5 rounded-full bg-gold/70 animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-gold/70 animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-gold/70 animate-bounce" />
    </span>
  );
}

// The "RampRate" name label that sits above every assistant message, the
// same way Manus prints "manus" above each of its replies — no chat bubble,
// just the wordmark and then the text flowing full-width below it.
function Wordmark() {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-5 w-5 place-items-center rounded-md bg-gold/15 font-display text-[9px] font-bold text-gold">
        RR
      </span>
      <span className="font-display text-sm font-semibold text-white/80">
        RampRate
      </span>
    </div>
  );
}

function ThinkingRow({ status }: { status: string | null }) {
  return (
    <div className="flex flex-col gap-2">
      <Wordmark />
      <div className="flex items-center gap-2.5 font-body text-sm text-white/40">
        <Dots />
        <span className="truncate">{status ?? "Working…"}</span>
      </div>
    </div>
  );
}

function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StepIcon({ status }: { status: WorkflowStep["status"] }) {
  if (status === "done") {
    return (
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
        <svg
          viewBox="0 0 24 24"
          className="h-3 w-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path
            d="m5 13 4 4 10-10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-red-500/15 text-red-400 font-bold text-[11px]">
        !
      </span>
    );
  }
  if (status === "active") {
    return (
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
        <Spinner className="h-3 w-3" />
      </span>
    );
  }
  return (
    <span className="h-5 w-5 shrink-0 rounded-full border border-white/15" />
  );
}

// The Manus-style step checklist: shown docked above the composer, one row
// per pipeline stage (write -> test -> checks -> publish), each locked until
// the one before it is done — same "first task, then move to the next" rule
// the site owner asked for, computed by computeWorkflowSteps.
function WorkflowChecklist({ steps }: { steps: WorkflowStep[] }) {
  return (
    <div className="flex flex-col gap-2">
      {steps.map((step) => (
        <div key={step.id} className="flex items-start gap-2.5">
          <StepIcon status={step.status} />
          <div className="flex min-w-0 flex-col">
            <span
              className={`font-body text-sm ${
                step.status === "pending"
                  ? "text-white/40"
                  : step.status === "error"
                    ? "text-red-300"
                    : "text-white/85"
              }`}
            >
              {step.label}
            </span>
            {step.detail && (
              <span className="font-body text-xs text-amber-300/80">
                {step.detail}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminChatClient() {
  // localStorage doesn't exist during SSR. useSyncExternalStore renders the
  // safe empty snapshot on the server AND on the client's first hydration
  // pass (so they match), then swaps in the real stored value right after —
  // React's built-in mechanism for bridging browser-only storage into SSR'd
  // state, rather than a manual mount-effect + setState (which would tear:
  // server renders "no history", client hydrates with real history from a
  // previous session, and React flags the mismatch).
  const storedHistory = useSyncExternalStore(
    noopSubscribe,
    getStoredMessagesSnapshot,
    getServerMessagesSnapshot,
  );
  // Once the admin sends a message or clears the chat, session state takes
  // over from the stored snapshot — this is a local editing session, not a
  // live view of localStorage.
  const [sessionMessages, setSessionMessages] = useState<ChatMsg[] | null>(
    null,
  );
  const messages = sessionMessages ?? storedHistory;
  const setMessages = setSessionMessages;
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [attachError, setAttachError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [stepStatus, setStepStatus] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingChanges | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [progressOpen, setProgressOpen] = useState(true);
  const [publishResult, setPublishResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchPendingChanges().then(setPending);
  }, []);

  // GitHub Actions/Netlify checks can take a while to finish. Poll while
  // they're still running so a workflow failure shows up in the sidebar on
  // its own, instead of staying stuck on "Checking..." until the next chat
  // message happens to refetch it.
  useEffect(() => {
    if (pending?.checkStatus !== "pending") return;
    const id = setInterval(() => {
      fetchPendingChanges().then(setPending);
    }, 15000);
    return () => clearInterval(id);
  }, [pending?.checkStatus]);

  // Keep the newest message in view as it streams in.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, sending, stepStatus]);

  const autoGrow = () => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  const fillPrompt = (text: string) => {
    setInput(text);
    requestAnimationFrame(() => {
      taRef.current?.focus();
      autoGrow();
    });
  };

  useEffect(() => {
    // No-op until the admin does something (sessionMessages still null, so
    // `messages` above is just mirroring storedHistory) — otherwise this
    // would re-save the exact value it just read right back to storage on
    // mount, which is harmless but pointless.
    if (sessionMessages === null) return;
    saveMessages(sessionMessages);
  }, [sessionMessages]);

  const clearChat = () => {
    setMessages([]);
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const addFiles = async (fileList: FileList | null) => {
    if (!fileList) return;
    setAttachError(null);
    const files = Array.from(fileList);
    const tooBig = files.find((f) => f.size > MAX_ATTACHMENT_BYTES);
    if (tooBig) {
      setAttachError(`"${tooBig.name}" is over 3MB — attach a smaller file.`);
      return;
    }
    const existingTotal = attachments.reduce(
      (sum, a) => sum + a.base64.length * 0.75,
      0,
    );
    const newTotal = files.reduce((sum, f) => sum + f.size, 0);
    if (existingTotal + newTotal > MAX_TOTAL_ATTACHMENT_BYTES) {
      setAttachError(
        "Attachments are too large combined (max 4MB total) — remove one first.",
      );
      return;
    }
    const converted = await Promise.all(files.map(fileToAttachment));
    setAttachments((prev) => [...prev, ...converted]);
  };

  const removeAttachment = (name: string) => {
    setAttachments((prev) => prev.filter((a) => a.name !== name));
  };

  // The chat endpoint streams Server-Sent Events: `text` deltas render the
  // reply live, then one terminal `done` / `step` / `error` event. Netlify's
  // free plan caps a *synchronous* function at ~10s but a *streaming* one at
  // ~60s — a non-trivial edit used to blow the 10s budget and come back as a
  // raw 504. The turn is still chopped into one-Claude-call steps: on a
  // `step` event the client immediately re-POSTs the returned turnState, so
  // from the admin's side it's still "send one message."
  const MAX_CLIENT_STEPS = 30;

  // `override` is set when the admin clicks one of the agent's option
  // buttons — that choice is sent as the next message instead of whatever's
  // in the input box, and the input/attachments are left untouched.
  const send = async (override?: string) => {
    const text = (override ?? input).trim();
    if (!text || sending) return;
    const outgoingAttachments = override === undefined ? attachments : [];
    const userMsg: ChatMsg = {
      role: "user",
      content: outgoingAttachments.length
        ? `${text} [${outgoingAttachments.map((a) => a.name).join(", ")}]`
        : text,
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    const outgoingMessage = text;
    const outgoingHistory = messages;
    if (override === undefined) {
      setInput("");
      setAttachments([]);
    }
    setSending(true);
    setStepStatus(null);
    setPublishResult(null);

    let turnState: unknown = undefined;
    let step = 0;

    try {
      while (true) {
        step++;
        if (step > MAX_CLIENT_STEPS) {
          setMessages([
            ...nextMessages,
            {
              role: "assistant",
              content:
                "Stopped after too many steps — send another message to continue.",
            },
          ]);
          break;
        }

        const res = await fetch("/api/admin/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            turnState
              ? { attachments: outgoingAttachments, turnState }
              : {
                  message: outgoingMessage,
                  history: outgoingHistory,
                  attachments: outgoingAttachments,
                },
          ),
        });

        if (!res.ok || !res.body) {
          // A non-2xx or bodyless response never reaches the SSE stream —
          // e.g. auth/limit JSON errors from our handler, or Netlify
          // rejecting the request (413) before it got there.
          let errMsg: string;
          try {
            const data = await res.json();
            errMsg = data.error || "Something went wrong.";
          } catch {
            errMsg =
              res.status === 413
                ? "Request rejected — payload too large (try removing an attachment)."
                : `Server returned an unreadable response (status ${res.status}).`;
          }
          setMessages([
            ...nextMessages,
            { role: "assistant", content: errMsg },
          ]);
          break;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let streamedText = "";
        let terminal: ChatEvent | null = null;

        while (true) {
          const { done: streamDone, value } = await reader.read();
          if (streamDone) break;
          buffer += decoder.decode(value, { stream: true });
          const frames = buffer.split("\n\n");
          buffer = frames.pop() ?? "";
          for (const frame of frames) {
            const dataLine = frame
              .split("\n")
              .find((l) => l.startsWith("data:"));
            if (!dataLine) continue;
            let evt: ChatEvent;
            try {
              evt = JSON.parse(dataLine.slice(5).trim());
            } catch {
              continue;
            }
            if (evt.type === "text") {
              streamedText += evt.delta;
              setMessages([
                ...nextMessages,
                { role: "assistant", content: streamedText },
              ]);
            } else if (evt.type === "status") {
              setStepStatus(
                `Step ${evt.step ?? step}: ${evt.stepLabel ?? "Working…"}`,
              );
            } else {
              terminal = evt;
            }
          }
        }

        if (!terminal) {
          // Stream ended with no terminal event — Netlify most likely killed
          // the function at its streaming time limit, and there's no
          // turnState to resume from.
          setMessages([
            ...nextMessages,
            {
              role: "assistant",
              content:
                (streamedText ? `${streamedText}\n\n` : "") +
                "The response was cut off (server time limit). Try a smaller, more targeted request.",
            },
          ]);
          break;
        }

        if (terminal.type === "error") {
          setMessages([
            ...nextMessages,
            { role: "assistant", content: terminal.error },
          ]);
          break;
        }

        if (terminal.type === "done") {
          setMessages([
            ...nextMessages,
            {
              role: "assistant",
              content: terminal.answer,
              downloads: terminal.downloads,
            },
          ]);
          await persistSession(terminal.branch, terminal.prNumber);
          fetchPendingChanges().then(setPending);
          break;
        }

        // terminal.type === "step" — another Claude call still to run.
        turnState = terminal.turnState;
        setStepStatus(
          `Step ${terminal.step ?? step}: ${terminal.stepLabel ?? "Working…"}`,
        );
        if (terminal.branch) persistSession(terminal.branch, terminal.prNumber);
        fetchPendingChanges().then(setPending);
      }
    } catch (err) {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content:
            err instanceof Error
              ? err.message
              : "Request failed — check your connection and try again.",
        },
      ]);
    } finally {
      setSending(false);
      setStepStatus(null);
    }
  };

  const publish = async () => {
    if (publishing || !pending?.canPublish) return;
    setPublishing(true);
    setPublishResult(null);
    try {
      // keepalive so the browser finishes sending this request even if the
      // tab is closed right after clicking Publish — without it, closing the
      // window mid-request can abort the merge before it ever reaches the server.
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        keepalive: true,
      });
      const data = await res.json();
      if (res.ok) {
        setPublishResult({
          ok: true,
          message: `Published successfully.${data.mergeSha ? ` Merge commit ${String(data.mergeSha).slice(0, 7)}.` : ""}${
            data.publishedIds?.length
              ? ` ${data.publishedIds.length} content change(s) live.`
              : ""
          }`,
        });
      } else {
        setPublishResult({
          ok: false,
          message: data.error || "Publish failed.",
        });
      }
      fetchPendingChanges().then(setPending);
    } catch {
      setPublishResult({
        ok: false,
        message:
          "Publish request failed — check your connection and try again.",
      });
    } finally {
      setPublishing(false);
    }
  };

  const lastRole = messages[messages.length - 1]?.role;

  const workflowSteps = computeWorkflowSteps({
    filePaths: pending?.files.map((f) => f.path) ?? [],
    draftCount: pending?.drafts.length ?? 0,
    checkStatus: pending?.checkStatus ?? "unknown",
    canPublish: pending?.canPublish ?? false,
    published: publishResult?.ok ?? false,
  });
  const totalSteps = workflowSteps.length;
  const doneSteps = workflowSteps.filter((s) => s.status === "done").length;
  const hasAnyChange =
    (pending?.files.length ?? 0) > 0 || (pending?.drafts.length ?? 0) > 0;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-dark text-white">
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/10 bg-dark/80 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gold/15 font-display text-[11px] font-bold text-gold">
              RR
            </span>
            <div className="leading-tight">
              <h1 className="font-display text-base font-bold text-white">
                RampRate Admin
              </h1>
              <p className="font-body text-[11px] text-white/40">
                Nothing goes live until you press Publish
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="rounded-md px-2 py-1 font-body text-xs text-white/40 hover:bg-white/5 hover:text-white/70"
            >
              Clear chat
            </button>
          )}
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/10 font-display text-lg font-bold text-gold">
                  RR
                </span>
                <div>
                  <p className="font-display text-lg text-white">
                    What should we change?
                  </p>
                  <p className="mx-auto mt-1 max-w-sm font-body text-sm text-white/45">
                    Tell me the change you want in your own words. You review
                    it, and nothing goes live until you press Publish.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {EXAMPLE_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => fillPrompt(p)}
                      className="rounded-full border border-white/10 bg-white/3 px-3 py-1.5 font-body text-xs text-white/60 hover:border-gold/40 hover:text-white"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => {
              const isUser = m.role === "user";
              const { text, options } = isUser
                ? { text: m.content, options: [] as string[] }
                : extractOptions(m.content);
              const isLast = i === messages.length - 1;
              const optionsLive = options.length > 0 && isLast && !sending;
              const streamingThis = !isUser && isLast && sending;

              if (isUser) {
                return (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl bg-white/6 px-4 py-2.5 font-body text-sm leading-relaxed text-white">
                      {m.content}
                    </div>
                  </div>
                );
              }

              return (
                <div key={i} className="flex flex-col gap-2">
                  <Wordmark />
                  <div className="font-body text-[15px] leading-7 text-white/90">
                    {renderMessageContent(text)}
                    {streamingThis && (
                      <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-blink bg-gold align-middle" />
                    )}
                  </div>
                  {m.downloads?.map((d) => (
                    <a
                      key={d.name}
                      href={`data:${d.mediaType};base64,${d.base64}`}
                      download={d.name}
                      className="flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-xs text-gold hover:border-gold/40"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {d.name}
                    </a>
                  ))}
                  {options.length > 0 && (
                    <div className="mt-1 flex flex-col gap-2">
                      {options.map((opt, oi) => (
                        <button
                          key={opt}
                          onClick={() => optionsLive && send(opt)}
                          disabled={!optionsLive}
                          className="group flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/3 px-3.5 py-2.5 text-left font-body text-sm text-white/90 transition hover:border-gold/50 hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:bg-white/3"
                        >
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/10 text-[11px] font-bold text-white/60 group-hover:bg-gold/20 group-hover:text-gold">
                            {oi + 1}
                          </span>
                          <span className="min-w-0 flex-1">{opt}</span>
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4 shrink-0 text-white/30 transition group-hover:translate-x-0.5 group-hover:text-gold/70"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              d="m9 6 6 6-6 6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {sending && lastRole === "user" && (
              <ThinkingRow status={stepStatus} />
            )}
            {sending && lastRole === "assistant" && stepStatus && (
              <div className="flex items-center gap-2 font-body text-xs text-white/40">
                <Dots />
                <span className="truncate">{stepStatus}</span>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-white/10 bg-dark/85 backdrop-blur">
          {hasAnyChange && (
            <div className="mx-auto w-full max-w-3xl px-4 pt-3 sm:px-6">
              <div className="rounded-2xl border border-white/10 bg-dark-card">
                <button
                  onClick={() => setProgressOpen((v) => !v)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3"
                >
                  <span className="font-body text-sm font-semibold text-white/80">
                    {pending?.checkStatus === "failure"
                      ? "Something needs fixing"
                      : publishResult?.ok
                        ? "Published"
                        : "Task progress"}
                  </span>
                  <span className="flex items-center gap-2 font-body text-xs text-white/40">
                    {doneSteps}/{totalSteps}
                    <svg
                      viewBox="0 0 24 24"
                      className={`h-3.5 w-3.5 transition ${progressOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        d="m6 9 6 6 6-6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>

                {progressOpen && (
                  <div className="flex flex-col gap-3 border-t border-white/5 px-4 py-3">
                    <WorkflowChecklist steps={workflowSteps} />

                    {pending && pending.failingChecks.length > 0 && (
                      <div className="flex flex-col gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                        <p className="font-body text-xs text-red-200">
                          {pending.failingChecks.length === 1
                            ? "This check failed:"
                            : `${pending.failingChecks.length} checks failed:`}
                        </p>
                        <div className="flex flex-col gap-1">
                          {pending.failingChecks.map((check) =>
                            check.url ? (
                              <a
                                key={check.name}
                                href={check.url}
                                target="_blank"
                                rel="noreferrer"
                                className="font-mono text-xs text-red-300 underline"
                              >
                                {check.name}
                              </a>
                            ) : (
                              <span
                                key={check.name}
                                className="font-mono text-xs text-red-300"
                              >
                                {check.name}
                              </span>
                            ),
                          )}
                        </div>
                        <p className="font-body text-xs text-white/50">
                          Ask the assistant to fix it, then check back here.
                        </p>
                      </div>
                    )}

                    {pending?.previewUrl && (
                      <a
                        href={pending.previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex w-fit items-center gap-1.5 font-body text-xs text-gold underline"
                      >
                        Preview the site before publishing (opens in a new tab —
                        it can&rsquo;t be shown inline here)
                      </a>
                    )}

                    {(pending?.files.length ?? 0) > 0 ||
                    (pending?.drafts.length ?? 0) > 0 ? (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setShowDetails((v) => !v)}
                          className="w-fit font-body text-xs text-white/40 underline hover:text-white/70"
                        >
                          {showDetails
                            ? "Hide the details"
                            : "Show the details"}
                        </button>
                        {showDetails && (
                          <div className="flex flex-col gap-2">
                            {pending?.files.map((f) => (
                              <div
                                key={f.path}
                                className="break-all rounded-lg border border-white/5 bg-white/3 px-3 py-2 font-mono text-xs text-white/70"
                              >
                                {f.path}{" "}
                                <span className="text-emerald-400">
                                  +{f.additions}
                                </span>{" "}
                                <span className="text-red-400">
                                  -{f.deletions}
                                </span>
                              </div>
                            ))}
                            {pending?.drafts.map((d) => (
                              <div
                                key={d.id}
                                className="wrap-break-word rounded-lg border border-white/5 bg-white/3 px-3 py-2 font-mono text-xs text-white/70"
                              >
                                {d.type}: {d.title}
                              </div>
                            ))}
                            {pending?.prUrl && (
                              <a
                                href={pending.prUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="font-body text-xs text-gold underline"
                              >
                                Open the technical view on GitHub
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ) : null}

                    <button
                      onClick={publish}
                      disabled={!pending?.canPublish || publishing}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-3 font-body text-sm font-semibold text-dark hover:bg-gold-light disabled:opacity-30 disabled:hover:bg-gold"
                    >
                      {publishing && <Spinner className="h-4 w-4" />}
                      {publishing ? "Publishing…" : "Publish"}
                    </button>
                    {publishing && (
                      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                        <div className="progress-slide h-full w-1/3 rounded-full bg-gold" />
                      </div>
                    )}
                    {publishResult && (
                      <div
                        className={`rounded-lg p-3 font-body text-xs ${
                          publishResult.ok
                            ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                            : "border border-red-500/30 bg-red-500/10 text-red-300"
                        }`}
                      >
                        {publishResult.ok ? "✅ " : "⚠️ "}
                        {publishResult.message}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="mx-auto w-full max-w-3xl px-4 py-3 sm:px-6">
            {attachError && (
              <p className="mb-2 font-body text-xs text-red-400">
                {attachError}
              </p>
            )}
            <div className="rounded-2xl border border-white/10 bg-dark-card focus-within:border-gold/50">
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 border-b border-white/5 p-2.5">
                  {attachments.map((a) => (
                    <span
                      key={a.name}
                      className="flex items-center gap-1.5 rounded-lg bg-white/10 py-1 pl-2.5 pr-1 font-body text-xs"
                    >
                      {a.name}
                      <button
                        onClick={() => removeAttachment(a.name)}
                        aria-label={`Remove ${a.name}`}
                        className="grid h-4 w-4 place-items-center rounded-full bg-white/15 hover:bg-white/25"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-end gap-2 p-2">
                <label
                  className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80"
                  title="Attach files"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M12 5v14M5 12h14"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      addFiles(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </label>
                <textarea
                  ref={taRef}
                  rows={1}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    autoGrow();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Message RampRate Admin…"
                  className="max-h-[200px] min-h-[36px] flex-1 resize-none bg-transparent py-2 font-body text-sm text-white placeholder:text-white/35 focus:outline-none"
                />
                <button
                  onClick={() => send()}
                  disabled={sending || !input.trim()}
                  aria-label="Send"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-dark transition hover:bg-gold-light disabled:bg-white/10 disabled:text-white/30"
                >
                  {sending ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        d="M12 20V5m0 0-6 6m6-6 6 6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
