"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Send,
  Sparkles,
  ArrowRight,
  Globe,
  BookOpen,
  FileText,
  RotateCcw,
} from "lucide-react";
import { matchSitePages } from "@/lib/site-pages";

const quickMatch = matchSitePages;

const typeIcons = { page: Globe, blog: BookOpen, practice: FileText };

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED = [
  "How do you save companies money?",
  "What is the SPY Index?",
  "Tell me about Web3 advisory",
  "How does your fee model work?",
  "What is BioChain Sourcing?",
  "How do I apply as a BioChain supplier or buyer?",
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full animate-bounce inline-block bg-amber"
          style={{ animationDelay: `${i * 0.18}s`, animationDuration: "0.9s" }}
        />
      ))}
    </div>
  );
}

function parseInline(text: string, depth = 0): React.ReactNode {
  if (depth > 4) return text;
  const parts: React.ReactNode[] = [];
  // Named link and bare URL must come before bold/italic so they aren't swallowed
  const regex =
    /(\[([^\]]+)\]\((https?:\/\/[^)]+|\/[^)]*)\)|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|https?:\/\/[^\s<>"')\]]+)/g;
  let lastIndex = 0;
  let k = 0;
  let m: RegExpExecArray | null;

  const linkClass = "text-amber underline underline-offset-2";
  const codeClass =
    "bg-white/10 px-[5px] py-px rounded-[3px] text-[0.85em] font-mono text-[oklch(0.85_0.12_75)]";

  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index));

    if (m[1] && m[2] !== undefined && m[3] !== undefined) {
      // [text](url) - named link; text itself may contain bold/italic
      parts.push(
        <a
          key={k++}
          href={m[3]}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {parseInline(m[2], depth + 1)}
        </a>,
      );
    } else if (m[4] !== undefined) {
      // **bold** - recurse so links inside bold still render
      parts.push(
        <strong key={k++} className="text-white/95 font-semibold">
          {parseInline(m[4], depth + 1)}
        </strong>,
      );
    } else if (m[5] !== undefined) {
      // *italic* - recurse
      parts.push(<em key={k++}>{parseInline(m[5], depth + 1)}</em>);
    } else if (m[6] !== undefined) {
      // `code`
      parts.push(
        <code key={k++} className={codeClass}>
          {m[6]}
        </code>,
      );
    } else {
      // bare https?:// URL
      parts.push(
        <a
          key={k++}
          href={m[0]}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {m[0]}
        </a>,
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  if (parts.length === 0) return text;
  if (parts.length === 1) return parts[0];
  return <>{parts}</>;
}

function MessageContent({ content }: { content: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = content.split("\n");
  let i = 0,
    k = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push(
        <pre
          key={k++}
          className="bg-black/30 border border-white/8 rounded-lg px-3.5 py-2.5 overflow-x-auto text-[0.775rem] font-mono text-white/75 my-[0.2rem] leading-[1.6]"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>,
      );
      i++;
      continue;
    }

    // Headings
    const h1m = line.match(/^# (.+)/);
    if (h1m) {
      blocks.push(
        <p key={k++} className="font-bold text-[0.95rem] text-white my-[0.15rem]">
          {parseInline(h1m[1])}
        </p>,
      );
      i++;
      continue;
    }
    const h2m = line.match(/^## (.+)/);
    if (h2m) {
      blocks.push(
        <p key={k++} className="font-bold text-[0.9rem] text-white/95 my-[0.15rem]">
          {parseInline(h2m[1])}
        </p>,
      );
      i++;
      continue;
    }
    const h3m = line.match(/^### (.+)/);
    if (h3m) {
      blocks.push(
        <p key={k++} className="font-semibold text-[0.85rem] text-amber my-[0.1rem]">
          {parseInline(h3m[1])}
        </p>,
      );
      i++;
      continue;
    }

    // Bullet list
    if (line.match(/^[\-\*•]\s+/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^[\-\*•]\s+/)) {
        items.push(lines[i].replace(/^[\-\*•]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={k++} className="my-[0.1rem] p-0 list-none flex flex-col gap-[0.2rem]">
          {items.map((item, j) => (
            <li key={j} className="flex gap-[0.4rem] items-start">
              <span className="text-amber shrink-0 mt-[0.15rem] text-[0.7rem]">
                ▸
              </span>
              <span>{parseInline(item)}</span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    // Numbered list
    if (line.match(/^\d+\.\s+/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <ol key={k++} className="my-[0.1rem] p-0 list-none flex flex-col gap-[0.2rem]">
          {items.map((item, j) => (
            <li key={j} className="flex gap-[0.4rem] items-start">
              <span className="text-amber shrink-0 font-semibold min-w-[1rem] text-xs">
                {j + 1}.
              </span>
              <span>{parseInline(item)}</span>
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    // Horizontal rule
    if (line.match(/^-{3,}$/) || line.match(/^\*{3,}$/)) {
      blocks.push(
        <hr key={k++} className="border-none border-t border-white/8 my-[0.3rem]" />,
      );
      i++;
      continue;
    }

    // Blank line
    if (!line.trim()) {
      if (blocks.length > 0)
        blocks.push(<div key={k++} className="h-[0.3rem]" />);
      i++;
      continue;
    }

    // Paragraph
    blocks.push(
      <p key={k++} className="m-0 leading-[1.65]">
        {parseInline(line)}
      </p>,
    );
    i++;
  }

  return <div className="flex flex-col gap-[0.18rem]">{blocks}</div>;
}

export default function SiteSearch({
  scrolled = false,
}: {
  scrolled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const quickResults = quickMatch(query);
  const showQuickNav =
    query.trim().length >= 2 && quickResults.length > 0 && chat.length === 0;

  const openSearch = useCallback(() => {
    setOpen(true);
    setQuery("");
    setLoading(false);
  }, []);

  const closeSearch = useCallback(() => {
    setOpen(false);
    setQuery("");
    setLoading(false);
  }, []);

  const clearChat = useCallback(() => {
    setChat([]);
    setQuery("");
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleSubmit = useCallback(async () => {
    const q = query.trim();
    if (!q || loading) return;

    const newChat: ChatMsg[] = [...chat, { role: "user", content: q }];
    setChat(newChat);
    setQuery("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history: chat.slice(-10) }),
      });
      const data = await res.json();
      setChat((prev) => [...prev, { role: "assistant", content: data.answer }]);
    } catch {
      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Try again or reach out at /contact.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [query, loading, chat]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openSearch, closeSearch]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  // Lock body scroll while the modal is open so only the chat area scrolls.
  // Uses the position:fixed trick which also works on iOS Safari.
  // Also adds `ai-modal-open` class so external elements (e.g. survey button) can hide.
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    document.body.classList.add("ai-modal-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflowY = "scroll";
    return () => {
      document.body.classList.remove("ai-modal-open");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={openSearch}
        className={`font-body ai-btn-glow flex items-center gap-2 px-3.5 py-2 rounded-full border transition-all duration-300 text-sm group ${
          scrolled
            ? "border-gold/25 bg-[linear-gradient(135deg,rgba(212,168,67,0.07),rgba(212,168,67,0.03))] text-[oklch(0.35_0.03_50)]"
            : "border-gold/20 bg-[linear-gradient(135deg,rgba(212,168,67,0.12),rgba(255,255,255,0.04))] text-white/75"
        }`}
        aria-label="Ask RampRate AI"
      >
        <span className="ai-btn-sparkle">
          <Sparkles size={14} className="text-amber" />
        </span>
        <span className="hidden sm:inline text-xs font-semibold tracking-wide [letter-spacing:0.02em]">
          Ask RampRate
        </span>
        <kbd
          className={`hidden lg:inline text-[10px] px-1.5 py-0.5 rounded font-mono ${
            scrolled ? "bg-black/5 text-black/25" : "bg-white/10 text-white/25"
          }`}
        >
          ⌘K
        </kbd>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-100 bg-black/70 backdrop-blur-sm"
            onClick={closeSearch}
            aria-hidden="true"
            tabIndex={-1}
          />

          {/* Panel - full screen on mobile, centered modal on sm+ */}
          <div
            className="fixed z-101 flex flex-col
              inset-0
              sm:inset-auto sm:top-[8vh] sm:left-1/2 sm:-translate-x-1/2
              sm:w-[90%] sm:max-w-2xl sm:max-h-[80vh] sm:rounded-2xl
              bg-[rgba(8,12,22,0.98)] border border-white/9 shadow-[0_32px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.03)]"
            role="dialog"
            aria-modal="true"
            aria-label="RampRate AI Assistant"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between shrink-0 border-b border-white/7">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 bg-[linear-gradient(135deg,oklch(0.82_0.15_75),oklch(0.6_0.22_50))]">
                  <Sparkles size={17} className="text-[#050a15]" />
                </div>
                <div>
                  <p className="font-display text-white font-semibold text-sm leading-tight">
                    RampRate AI
                  </p>
                  <p className="font-mono text-[10px] leading-tight mt-0.5 text-white/30">
                    25 years of enterprise intelligence
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {chat.length > 0 && (
                  <button
                    onClick={clearChat}
                    aria-label="New chat"
                    className="font-mono flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all text-white/35 border border-white/8 hover:text-white/70 hover:border-white/16"
                  >
                    <RotateCcw size={11} />
                    <span className="hidden sm:inline">New chat</span>
                  </button>
                )}
                <button
                  onClick={closeSearch}
                  aria-label="Close"
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-all text-white/30 hover:bg-white/6 hover:text-white/80"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Scrollable chat area */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 sm:py-5 space-y-5">
              {/* Empty state - suggested questions */}
              {chat.length === 0 && !showQuickNav && (
                <div className="py-1">
                  <p className="font-body text-center text-sm leading-relaxed mb-5 text-white/35">
                    Ask anything about RampRate - sourcing, Web3, case results,
                    or enterprise strategy.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SUGGESTED.map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setQuery(q);
                          setTimeout(() => inputRef.current?.focus(), 50);
                        }}
                        className="font-body text-left px-4 py-3 rounded-xl text-sm transition-all leading-snug border border-white/7 text-white/55 bg-white/2 hover:bg-white/5 hover:border-white/14 hover:text-white/85"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick nav results */}
              {showQuickNav && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold mb-3 text-amber/50">
                    Quick Navigate
                  </p>
                  <div className="space-y-1">
                    {quickResults.map((item) => {
                      const Icon = typeIcons[item.type];
                      return (
                        <button
                          key={item.path}
                          onClick={() => {
                            router.push(item.path);
                            closeSearch();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left border border-transparent hover:bg-white/4 hover:border-white/8"
                        >
                          <Icon size={14} className="shrink-0 text-amber" />
                          <span className="font-body flex-1 text-sm text-white/80">
                            {item.title}
                          </span>
                          <ArrowRight size={12} className="shrink-0 text-white/20" />
                        </button>
                      );
                    })}
                  </div>
                  <p className="font-mono text-[10px] text-center mt-3 pt-3 text-white/18 border-t border-white/5">
                    Press Enter to ask AI instead
                  </p>
                </div>
              )}

              {/* Chat messages */}
              {chat.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-[linear-gradient(135deg,oklch(0.82_0.15_75),oklch(0.6_0.22_50))]">
                      <Sparkles size={12} className="text-[#050a15]" />
                    </div>
                  )}
                  <div
                    className={`font-body max-w-[82%] sm:max-w-[75%] px-4 py-3 text-sm leading-relaxed text-white/88 border ${
                      msg.role === "user"
                        ? "bg-[linear-gradient(135deg,oklch(0.82_0.15_75/0.18),oklch(0.6_0.22_50/0.12))] rounded-[1rem_1rem_0.2rem_1rem] border-white/10"
                        : "bg-white/4 rounded-[0.2rem_1rem_1rem_1rem] border-white/6"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <MessageContent content={msg.content} />
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-[linear-gradient(135deg,oklch(0.82_0.15_75),oklch(0.6_0.22_50))]">
                    <Sparkles size={12} className="text-[#050a15]" />
                  </div>
                  <div className="px-4 py-3 bg-white/4 border border-white/6 rounded-[0.2rem_1rem_1rem_1rem]">
                    <TypingDots />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            <div className="px-4 sm:px-5 py-3 sm:py-4 shrink-0 border-t border-white/7">
              <div className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all bg-white/4 border border-white/10 focus-within:border-white/20">
                <Search size={15} className="shrink-0 text-white/20" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={
                    chat.length > 0
                      ? "Follow up..."
                      : "Ask about sourcing, Web3, case results, strategy..."
                  }
                  className="font-body flex-1 bg-transparent text-sm outline-none placeholder:text-white/20 text-white/90 caret-[oklch(0.82_0.15_75)]"
                  disabled={loading}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!query.trim() || loading}
                  aria-label="Send message"
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0 disabled:opacity-25 bg-amber hover:not-disabled:bg-[oklch(0.78_0.17_75)]"
                >
                  <Send size={13} className="text-[#050a15]" />
                </button>
              </div>

              <div className="flex items-center justify-between mt-2 px-1">
                <span className="font-mono hidden sm:flex items-center gap-1 text-[10px] text-white/13">
                  <kbd className="px-1 rounded bg-white/5">⌘K</kbd> open ·{" "}
                  <kbd className="px-1 rounded bg-white/5">esc</kbd> close ·{" "}
                  <kbd className="px-1 rounded bg-white/5">↵</kbd> send
                </span>
                <span className="font-mono text-[10px] sm:hidden text-white/13">
                  Tap send or press enter
                </span>
                <span className="font-mono text-[10px] text-white/10">
                  RampRate · $10B intel
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
