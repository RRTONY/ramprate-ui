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
          className="w-2 h-2 rounded-full animate-bounce inline-block"
          style={{
            background: "oklch(0.82 0.15 75)",
            animationDelay: `${i * 0.18}s`,
            animationDuration: "0.9s",
          }}
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

  const linkStyle = {
    color: "oklch(0.82 0.15 75)",
    textDecoration: "underline",
    textUnderlineOffset: "2px",
  } as const;
  const codeStyle = {
    background: "rgba(255,255,255,0.1)",
    padding: "1px 5px",
    borderRadius: "3px",
    fontSize: "0.85em",
    fontFamily: "monospace",
    color: "oklch(0.85 0.12 75)",
  } as const;

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
          style={linkStyle}
        >
          {parseInline(m[2], depth + 1)}
        </a>,
      );
    } else if (m[4] !== undefined) {
      // **bold** - recurse so links inside bold still render
      parts.push(
        <strong
          key={k++}
          style={{ color: "rgba(255,255,255,0.95)", fontWeight: 600 }}
        >
          {parseInline(m[4], depth + 1)}
        </strong>,
      );
    } else if (m[5] !== undefined) {
      // *italic* - recurse
      parts.push(<em key={k++}>{parseInline(m[5], depth + 1)}</em>);
    } else if (m[6] !== undefined) {
      // `code`
      parts.push(
        <code key={k++} style={codeStyle}>
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
          style={linkStyle}
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
          style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "0.5rem",
            padding: "0.6rem 0.875rem",
            overflowX: "auto",
            fontSize: "0.775rem",
            fontFamily: "monospace",
            color: "rgba(255,255,255,0.75)",
            margin: "0.2rem 0",
            lineHeight: 1.6,
          }}
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
        <p
          key={k++}
          style={{
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "white",
            margin: "0.15rem 0",
          }}
        >
          {parseInline(h1m[1])}
        </p>,
      );
      i++;
      continue;
    }
    const h2m = line.match(/^## (.+)/);
    if (h2m) {
      blocks.push(
        <p
          key={k++}
          style={{
            fontWeight: 700,
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.95)",
            margin: "0.15rem 0",
          }}
        >
          {parseInline(h2m[1])}
        </p>,
      );
      i++;
      continue;
    }
    const h3m = line.match(/^### (.+)/);
    if (h3m) {
      blocks.push(
        <p
          key={k++}
          style={{
            fontWeight: 600,
            fontSize: "0.85rem",
            color: "oklch(0.82 0.15 75)",
            margin: "0.1rem 0",
          }}
        >
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
        <ul
          key={k++}
          style={{
            margin: "0.1rem 0",
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "0.2rem",
          }}
        >
          {items.map((item, j) => (
            <li
              key={j}
              style={{
                display: "flex",
                gap: "0.4rem",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  color: "oklch(0.82 0.15 75)",
                  flexShrink: 0,
                  marginTop: "0.15rem",
                  fontSize: "0.7rem",
                }}
              >
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
        <ol
          key={k++}
          style={{
            margin: "0.1rem 0",
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "0.2rem",
          }}
        >
          {items.map((item, j) => (
            <li
              key={j}
              style={{
                display: "flex",
                gap: "0.4rem",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  color: "oklch(0.82 0.15 75)",
                  flexShrink: 0,
                  fontWeight: 600,
                  minWidth: "1rem",
                  fontSize: "0.75rem",
                }}
              >
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
        <hr
          key={k++}
          style={{
            border: "none",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            margin: "0.3rem 0",
          }}
        />,
      );
      i++;
      continue;
    }

    // Blank line
    if (!line.trim()) {
      if (blocks.length > 0)
        blocks.push(<div key={k++} style={{ height: "0.3rem" }} />);
      i++;
      continue;
    }

    // Paragraph
    blocks.push(
      <p key={k++} style={{ margin: 0, lineHeight: 1.65 }}>
        {parseInline(line)}
      </p>,
    );
    i++;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.18rem" }}>
      {blocks}
    </div>
  );
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
        className="ai-btn-glow flex items-center gap-2 px-3.5 py-2 rounded-full border transition-all duration-300 text-sm group"
        style={{
          borderColor: scrolled
            ? "rgba(212,168,67,0.25)"
            : "rgba(212,168,67,0.2)",
          background: scrolled
            ? "linear-gradient(135deg,rgba(212,168,67,0.07),rgba(212,168,67,0.03))"
            : "linear-gradient(135deg,rgba(212,168,67,0.12),rgba(255,255,255,0.04))",
          color: scrolled ? "oklch(0.35 0.03 50)" : "rgba(255,255,255,0.75)",
          fontFamily: "var(--font-body)",
        }}
        aria-label="Ask RampRate AI"
      >
        <span className="ai-btn-sparkle">
          <Sparkles size={14} style={{ color: "oklch(0.82 0.15 75)" }} />
        </span>
        <span
          className="hidden sm:inline text-xs font-semibold tracking-wide"
          style={{ letterSpacing: "0.02em" }}
        >
          Ask RampRate
        </span>
        <kbd
          className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded font-mono"
          style={{
            background: scrolled
              ? "rgba(0,0,0,0.05)"
              : "rgba(255,255,255,0.10)",
            color: scrolled ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.25)",
          }}
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
          />

          {/* Panel - full screen on mobile, centered modal on sm+ */}
          <div
            className="fixed z-101 flex flex-col
              inset-0
              sm:inset-auto sm:top-[8vh] sm:left-1/2 sm:-translate-x-1/2
              sm:w-[90%] sm:max-w-2xl sm:max-h-[80vh] sm:rounded-2xl"
            style={{
              background: "rgba(8,12,22,0.98)",
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow:
                "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="RampRate AI Assistant"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.82 0.15 75), oklch(0.6 0.22 50))",
                  }}
                >
                  <Sparkles size={17} style={{ color: "#050a15" }} />
                </div>
                <div>
                  <p
                    className="text-white font-semibold text-sm leading-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    RampRate AI
                  </p>
                  <p
                    className="text-[10px] leading-tight mt-0.5"
                    style={{
                      color: "rgba(255,255,255,0.3)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    25 years of enterprise intelligence
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {chat.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      fontFamily: "var(--font-mono)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.16)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.35)";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.08)";
                    }}
                  >
                    <RotateCcw size={11} />
                    <span className="hidden sm:inline">New chat</span>
                  </button>
                )}
                <button
                  onClick={closeSearch}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.3)";
                  }}
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
                  <p
                    className="text-center text-sm leading-relaxed mb-5"
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
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
                        className="text-left px-4 py-3 rounded-xl text-sm transition-all leading-snug"
                        style={{
                          border: "1px solid rgba(255,255,255,0.07)",
                          color: "rgba(255,255,255,0.55)",
                          fontFamily: "var(--font-body)",
                          background: "rgba(255,255,255,0.02)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.05)";
                          e.currentTarget.style.borderColor =
                            "rgba(255,255,255,0.14)";
                          e.currentTarget.style.color =
                            "rgba(255,255,255,0.85)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.02)";
                          e.currentTarget.style.borderColor =
                            "rgba(255,255,255,0.07)";
                          e.currentTarget.style.color =
                            "rgba(255,255,255,0.55)";
                        }}
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
                  <p
                    className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-3"
                    style={{
                      color: "oklch(0.82 0.15 75 / 0.5)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
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
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left"
                          style={{ border: "1px solid transparent" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.04)";
                            e.currentTarget.style.borderColor =
                              "rgba(255,255,255,0.08)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.borderColor = "transparent";
                          }}
                        >
                          <Icon
                            size={14}
                            className="shrink-0"
                            style={{ color: "oklch(0.82 0.15 75)" }}
                          />
                          <span
                            className="flex-1 text-sm"
                            style={{
                              color: "rgba(255,255,255,0.8)",
                              fontFamily: "var(--font-body)",
                            }}
                          >
                            {item.title}
                          </span>
                          <ArrowRight
                            size={12}
                            className="shrink-0"
                            style={{ color: "rgba(255,255,255,0.2)" }}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <p
                    className="text-[10px] text-center mt-3 pt-3"
                    style={{
                      color: "rgba(255,255,255,0.18)",
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
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
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.82 0.15 75), oklch(0.6 0.22 50))",
                      }}
                    >
                      <Sparkles size={12} style={{ color: "#050a15" }} />
                    </div>
                  )}
                  <div
                    className="max-w-[82%] sm:max-w-[75%] px-4 py-3 text-sm leading-relaxed"
                    style={{
                      background:
                        msg.role === "user"
                          ? "linear-gradient(135deg, oklch(0.82 0.15 75 / 0.18), oklch(0.6 0.22 50 / 0.12))"
                          : "rgba(255,255,255,0.04)",
                      color: "rgba(255,255,255,0.88)",
                      borderRadius:
                        msg.role === "user"
                          ? "1rem 1rem 0.2rem 1rem"
                          : "0.2rem 1rem 1rem 1rem",
                      border: `1px solid ${msg.role === "user" ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)"}`,
                      fontFamily: "var(--font-body)",
                    }}
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
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.82 0.15 75), oklch(0.6 0.22 50))",
                    }}
                  >
                    <Sparkles size={12} style={{ color: "#050a15" }} />
                  </div>
                  <div
                    className="px-4 py-3"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "0.2rem 1rem 1rem 1rem",
                    }}
                  >
                    <TypingDots />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            <div
              className="px-4 sm:px-5 py-3 sm:py-4 shrink-0"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
                onFocusCapture={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.20)")
                }
                onBlurCapture={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)")
                }
              >
                <Search
                  size={15}
                  className="shrink-0"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                />
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
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/20"
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontFamily: "var(--font-body)",
                    caretColor: "oklch(0.82 0.15 75)",
                  }}
                  disabled={loading}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!query.trim() || loading}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0 disabled:opacity-25"
                  style={{ background: "oklch(0.82 0.15 75)" }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled)
                      e.currentTarget.style.background = "oklch(0.78 0.17 75)";
                  }}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "oklch(0.82 0.15 75)")
                  }
                >
                  <Send size={13} style={{ color: "#050a15" }} />
                </button>
              </div>

              <div className="flex items-center justify-between mt-2 px-1">
                <span
                  className="hidden sm:flex items-center gap-1 text-[10px]"
                  style={{
                    color: "rgba(255,255,255,0.13)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  <kbd
                    className="px-1 rounded"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    ⌘K
                  </kbd>{" "}
                  open ·{" "}
                  <kbd
                    className="px-1 rounded"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    esc
                  </kbd>{" "}
                  close ·{" "}
                  <kbd
                    className="px-1 rounded"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    ↵
                  </kbd>{" "}
                  send
                </span>
                <span
                  className="text-[10px] sm:hidden"
                  style={{
                    color: "rgba(255,255,255,0.13)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Tap send or press enter
                </span>
                <span
                  className="text-[10px]"
                  style={{
                    color: "rgba(255,255,255,0.1)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
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
