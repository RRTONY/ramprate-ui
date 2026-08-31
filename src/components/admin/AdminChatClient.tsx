"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

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

  for (const rawLine of lines) {
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
  return <div className="space-y-1.5">{blocks}</div>;
}

function TypingIndicator({ status }: { status: string | null }) {
  return (
    <div className="self-start bg-white/6 rounded-lg px-4 py-3 flex items-center gap-2.5 max-w-[85%]">
      <span className="flex items-center gap-1.5 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" />
      </span>
      {status && (
        <span className="text-xs font-body text-white/40 truncate">
          {status}
        </span>
      )}
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
  const [publishResult, setPublishResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchPendingChanges().then(setPending);
  }, []);

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
    const existingTotal = attachments.reduce((sum, a) => sum + a.base64.length * 0.75, 0);
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

  // Netlify's free-plan synchronous function timeout is a hard 10 seconds,
  // which the old single-request design (a whole tool-use loop server-side)
  // could easily exceed on anything beyond a trivial one-tool edit. Instead,
  // the server now does exactly one Claude call (+ any tools it asks for)
  // per request and hands back an opaque `turnState` if it isn't done yet.
  // This loop keeps calling the endpoint with that turnState until the turn
  // finishes — from the admin's point of view it's still just "send one
  // message," but under the hood it's several short, fast requests chained
  // automatically instead of one long request that risks getting killed
  // mid-flight.
  const MAX_CLIENT_STEPS = 30;

  const send = async () => {
    if (!input.trim() || sending) return;
    const userMsg: ChatMsg = {
      role: "user",
      content: attachments.length
        ? `${input.trim()} [${attachments.map((a) => a.name).join(", ")}]`
        : input.trim(),
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    const outgoingMessage = input.trim();
    const outgoingHistory = messages;
    const outgoingAttachments = attachments;
    setInput("");
    setAttachments([]);
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

        let data: {
          done?: boolean;
          turnState?: unknown;
          stepLabel?: string;
          step?: number;
          answer?: string;
          error?: string;
          downloads?: ChatDownload[];
        };
        try {
          data = await res.json();
        } catch {
          // Netlify (or an intermediary) rejected the request before it
          // reached our handler — e.g. payload too large — so the body
          // isn't JSON.
          throw new Error(
            res.status === 413
              ? "Request rejected — payload too large (try removing an attachment)."
              : `Server returned an unreadable response (status ${res.status}).`,
          );
        }

        if (!res.ok) {
          setMessages([
            ...nextMessages,
            {
              role: "assistant",
              content: data.error || "Something went wrong.",
            },
          ]);
          break;
        }

        fetchPendingChanges().then(setPending);

        if (data.done) {
          setMessages([
            ...nextMessages,
            {
              role: "assistant",
              content: data.answer!,
              downloads: data.downloads,
            },
          ]);
          break;
        }

        turnState = data.turnState;
        setStepStatus(
          data.stepLabel
            ? `Step ${data.step ?? step}: ${data.stepLabel}`
            : `Step ${data.step ?? step}…`,
        );
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

  const checkStatusLabel: Record<PendingChanges["checkStatus"], string> = {
    success: "Build passing",
    pending: "Build running…",
    failure: "Build failing",
    unknown: "No build status yet",
  };

  return (
    <div className="min-h-screen bg-dark text-white flex flex-col md:flex-row">
      <section className="flex-1 flex flex-col p-4 sm:p-6 gap-4 min-w-0 md:max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-gold">
            RampRate Admin
          </h1>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="text-xs font-body text-white/40 hover:text-white/70"
            >
              Clear chat
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 min-h-[50vh]">
          {messages.length === 0 && (
            <p className="text-white/50 font-body text-sm">
              Describe what you want changed on the site or in Sanity content.
              Nothing goes live until you click Publish.
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`font-body text-sm rounded-lg px-4 py-3 max-w-[85%] ${
                m.role === "user"
                  ? "self-end bg-gold/20 text-white"
                  : "self-start bg-white/6 text-white/90"
              }`}
            >
              {renderMessageContent(m.content)}
              {m.downloads?.map((d) => (
                <a
                  key={d.name}
                  href={`data:${d.mediaType};base64,${d.base64}`}
                  download={d.name}
                  className="mt-2 flex items-center gap-2 text-xs text-gold underline"
                >
                  ⬇ {d.name}
                </a>
              ))}
            </div>
          ))}
          {sending && <TypingIndicator status={stepStatus} />}
        </div>
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attachments.map((a) => (
              <span
                key={a.name}
                className="text-xs font-body bg-white/10 rounded-full pl-3 pr-1 py-1 flex items-center gap-2"
              >
                {a.name}
                <button
                  onClick={() => removeAttachment(a.name)}
                  aria-label={`Remove ${a.name}`}
                  className="w-4 h-4 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        {attachError && (
          <p className="text-xs font-body text-red-400">{attachError}</p>
        )}
        <div className="flex gap-2">
          <label className="px-4 py-3 rounded-lg bg-white/6 border border-white/10 text-sm font-body cursor-pointer hover:bg-white/10">
            📎
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
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            placeholder="Update the hero headline on /growth…"
            className="flex-1 min-w-0 rounded-lg px-4 py-3 bg-white/6 border border-white/10 text-sm font-body focus:outline-none focus:border-gold"
          />
          <button
            onClick={send}
            disabled={sending}
            className="px-5 py-3 rounded-lg bg-gold text-dark font-body font-semibold text-sm disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </section>

      <aside className="w-full md:w-72 lg:w-96 shrink-0 border-t md:border-t-0 md:border-l border-white/10 p-4 sm:p-6 flex flex-col gap-4 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
        <h2 className="font-display text-lg font-bold">Pending changes</h2>

        <div className="flex flex-col gap-1">
          {pending?.prUrl && (
            <a
              href={pending.prUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-gold underline font-body"
            >
              View pull request #{pending.prNumber}
            </a>
          )}
          {pending?.previewUrl && (
            <a
              href={pending.previewUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-gold underline font-body"
            >
              Open preview & test it
            </a>
          )}
        </div>

        {pending && (
          <div className="flex items-center gap-2 text-xs font-body text-white/60">
            {pending.checkStatus === "pending" && (
              <Spinner className="w-3.5 h-3.5 text-white/50" />
            )}
            <span>{checkStatusLabel[pending.checkStatus]}</span>
          </div>
        )}

        {pending && pending.failingChecks.length > 0 && (
          <div className="flex flex-col gap-1 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
            {pending.failingChecks.map((c) => (
              <a
                key={c.name}
                href={c.url ?? undefined}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-body text-red-300 underline"
              >
                {c.name} failed
              </a>
            ))}
            <p className="text-xs font-body text-white/50">
              Tell the chat to fix this.
            </p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto flex flex-col gap-2">
          {pending?.files.map((f) => (
            <div
              key={f.path}
              className="text-xs font-mono bg-white/6 rounded px-3 py-2 break-all"
            >
              {f.path}
              <span className="text-white/40">
                {" "}
                (+{f.additions}/-{f.deletions})
              </span>
            </div>
          ))}
          {pending?.drafts.map((d) => (
            <div
              key={d.id}
              className="text-xs font-mono bg-white/6 rounded px-3 py-2 wrap-break-word"
            >
              {d.type}: {d.title}
            </div>
          ))}
          {pending &&
            pending.files.length === 0 &&
            pending.drafts.length === 0 && (
              <p className="text-xs font-body text-white/40">
                Nothing pending.
              </p>
            )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={publish}
            disabled={!pending?.canPublish || publishing}
            className="w-full py-3 rounded-lg bg-gold text-dark font-body font-semibold text-sm disabled:opacity-30 flex items-center justify-center gap-2"
          >
            {publishing && <Spinner className="w-4 h-4" />}
            {publishing ? "Publishing…" : "Publish"}
          </button>
          {publishing && (
            <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="progress-slide h-full w-1/3 rounded-full bg-gold" />
            </div>
          )}
        </div>
        {publishResult && (
          <div
            className={`rounded-lg p-3 text-xs font-body ${
              publishResult.ok
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                : "bg-red-500/10 border border-red-500/30 text-red-300"
            }`}
          >
            {publishResult.ok ? "✅ " : "⚠️ "}
            {publishResult.message}
          </div>
        )}
      </aside>
    </div>
  );
}
