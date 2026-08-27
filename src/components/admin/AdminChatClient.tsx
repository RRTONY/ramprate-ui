"use client";

import { useEffect, useState } from "react";

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

const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;

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

function saveMessages(messages: ChatMsg[]) {
  try {
    const toStore = messages
      .slice(-MAX_STORED_MESSAGES)
      .map(({ role, content }) => ({ role, content }));
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

function TypingIndicator() {
  return (
    <div className="self-start bg-white/6 rounded-lg px-4 py-3 flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" />
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
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [attachError, setAttachError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [pending, setPending] = useState<PendingChanges | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<string | null>(null);

  useEffect(() => {
    setMessages(loadStoredMessages());
    fetchPendingChanges().then(setPending);
  }, []);

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

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
      setAttachError(`"${tooBig.name}" is over 8MB — attach a smaller file.`);
      return;
    }
    const converted = await Promise.all(files.map(fileToAttachment));
    setAttachments((prev) => [...prev, ...converted]);
  };

  const removeAttachment = (name: string) => {
    setAttachments((prev) => prev.filter((a) => a.name !== name));
  };

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
    const outgoingAttachments = attachments;
    setInput("");
    setAttachments([]);
    setSending(true);
    setPublishResult(null);
    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input.trim(),
          history: messages,
          attachments: outgoingAttachments,
        }),
      });
      const data = await res.json();
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: res.ok ? data.answer : data.error || "Something went wrong.",
          downloads: res.ok ? data.downloads : undefined,
        },
      ]);
      fetchPendingChanges().then(setPending);
    } catch {
      setMessages([
        ...nextMessages,
        { role: "assistant", content: "Request failed — try again." },
      ]);
    } finally {
      setSending(false);
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
        setPublishResult(
          `Published.${data.mergeSha ? ` Merge commit ${String(data.mergeSha).slice(0, 7)}.` : ""}${
            data.publishedIds?.length
              ? ` ${data.publishedIds.length} content change(s) live.`
              : ""
          }`,
        );
      } else {
        setPublishResult(data.error || "Publish failed.");
      }
      fetchPendingChanges().then(setPending);
    } catch {
      setPublishResult("Publish request failed.");
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
    <div className="min-h-screen bg-dark text-white flex flex-col lg:flex-row">
      <section className="flex-1 flex flex-col p-6 gap-4 max-w-3xl">
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
          {sending && <TypingIndicator />}
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
            placeholder="e.g. Update the hero headline on /growth, or attach a mockup"
            className="flex-1 rounded-lg px-4 py-3 bg-white/6 border border-white/10 text-sm font-body focus:outline-none focus:border-gold"
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

      <aside className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-white/10 p-6 flex flex-col gap-4 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
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
              className="text-xs font-mono bg-white/6 rounded px-3 py-2"
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
              className="text-xs font-mono bg-white/6 rounded px-3 py-2"
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

        <button
          onClick={publish}
          disabled={!pending?.canPublish || publishing}
          className="w-full py-3 rounded-lg bg-gold text-dark font-body font-semibold text-sm disabled:opacity-30"
        >
          {publishing ? "Publishing…" : "Publish"}
        </button>
        {publishResult && (
          <p className="text-xs font-body text-white/70">{publishResult}</p>
        )}
      </aside>
    </div>
  );
}
