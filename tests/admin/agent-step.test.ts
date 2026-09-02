import { describe, expect, it } from "vitest";
import { buildInitialMessages, describeStep } from "@/lib/admin/agent-step";
import type Anthropic from "@anthropic-ai/sdk";

describe("buildInitialMessages", () => {
  it("includes prior history plus the new user message", () => {
    const messages = buildInitialMessages({
      message: "change the headline",
      history: [
        { role: "user", content: "hi" },
        { role: "assistant", content: "hello, what should we change?" },
      ],
      attachments: [],
    });
    expect(messages).toHaveLength(3);
    expect(messages[0]).toEqual({ role: "user", content: "hi" });
    const last = messages[2] as Anthropic.MessageParam;
    expect(last.role).toBe("user");
  });

  it("inlines an image attachment as an image content block", () => {
    const messages = buildInitialMessages({
      message: "fix this",
      history: [],
      attachments: [
        { name: "bug.png", mediaType: "image/png", base64: "AAAA" },
      ],
    });
    const content = messages[0].content as Anthropic.ContentBlockParam[];
    expect(content.some((b) => b.type === "image")).toBe(true);
    const textBlock = content.find((b) => b.type === "text");
    expect((textBlock as { text: string }).text).toContain("bug.png");
  });

  it("inlines a PDF attachment as a document content block", () => {
    const messages = buildInitialMessages({
      message: "read this",
      history: [],
      attachments: [
        { name: "brief.pdf", mediaType: "application/pdf", base64: "AAAA" },
      ],
    });
    const content = messages[0].content as Anthropic.ContentBlockParam[];
    expect(content.some((b) => b.type === "document")).toBe(true);
  });

  it("only keeps the last 20 history messages", () => {
    const history = Array.from({ length: 25 }, (_, i) => ({
      role: (i % 2 === 0 ? "user" : "assistant") as "user" | "assistant",
      content: `message ${i}`,
    }));
    const messages = buildInitialMessages({
      message: "latest",
      history,
      attachments: [],
    });
    // 20 kept from history + 1 new user message.
    expect(messages).toHaveLength(21);
    expect(messages[0]).toEqual({ role: "assistant", content: "message 5" });
  });
});

describe("describeStep", () => {
  it("returns a thinking label when there are no tool calls", () => {
    expect(describeStep([])).toBe("Thinking…");
  });

  it("describes a single known tool call", () => {
    const toolUse = {
      type: "tool_use",
      id: "1",
      name: "github_read_file",
      input: { path: "src/app/page.tsx" },
    } as Anthropic.ToolUseBlock;
    expect(describeStep([toolUse])).toBe("Reading src/app/page.tsx");
  });

  it("appends a count when there are multiple tool calls", () => {
    const toolUse = {
      type: "tool_use",
      id: "1",
      name: "github_write_file",
      input: { path: "src/app/page.tsx" },
    } as Anthropic.ToolUseBlock;
    const other = { ...toolUse, id: "2" } as Anthropic.ToolUseBlock;
    expect(describeStep([toolUse, other])).toBe(
      "Writing src/app/page.tsx (+1 more)",
    );
  });

  it("falls back to the raw tool name for an unrecognized tool", () => {
    const toolUse = {
      type: "tool_use",
      id: "1",
      name: "some_new_tool",
      input: {},
    } as Anthropic.ToolUseBlock;
    expect(describeStep([toolUse])).toBe("Running some_new_tool");
  });
});
