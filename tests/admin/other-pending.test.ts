import { describe, expect, it } from "vitest";
import {
  otherPendingText,
  pendingRows,
  type ChangeSet,
} from "@/lib/admin/change-sets";
import { normalizeConversationUrl } from "@/lib/admin/change-describe";

const base = {
  _id: "",
  request: "Swap the hero image",
  requestedBy: { name: "Jane", email: "jane@ramprate.com" },
  branch: null,
} as const;
const mk = (
  key: string,
  status: ChangeSet["status"],
  createdAt: string,
  extra: Partial<ChangeSet> = {},
): ChangeSet =>
  ({
    ...base,
    key,
    title: key,
    status,
    createdAt,
    prNumber: null,
    ...extra,
  }) as ChangeSet;

describe("pendingRows (Other Pending Changes)", () => {
  const changes = [
    mk("20261008-cccccc", "ready_for_review", "2026-10-08T10:00:00Z", {
      prNumber: 51,
    }),
    mk("20261006-aaaaaa", "draft", "2026-10-06T10:00:00Z"),
    mk("20261007-bbbbbb", "awaiting_confirmation", "2026-10-07T10:00:00Z"),
    mk("20261005-pubbed", "published", "2026-10-05T10:00:00Z"),
  ];

  it("leaves out the change being shown and closed ones, oldest first", () => {
    const rows = pendingRows(changes, "20261007-bbbbbb");
    expect(rows.map((r) => r.changeId)).toEqual([
      "20261006-aaaaaa",
      "20261008-cccccc",
    ]);
  });

  it("gives each row its own preview, and only ready changes can be published", () => {
    const rows = pendingRows(changes);
    const ready = rows.find((r) => r.changeId === "20261008-cccccc")!;
    expect(ready.previewUrl).toBe(
      "https://deploy-preview-51--ramprate.netlify.app",
    );
    expect(ready.readyToPublish).toBe(true);
    const draft = rows.find((r) => r.changeId === "20261006-aaaaaa")!;
    expect(draft.previewUrl).toBeNull();
    expect(draft.readyToPublish).toBe(false);
    expect(draft.request).toBe("Swap the hero image");
    expect(draft.conversationUrl).toBeNull();
  });

  it("copes with a record missing its date", () => {
    expect(() =>
      pendingRows([
        mk("20261008-xxxxxx", "draft", undefined as never),
        ...changes,
      ]),
    ).not.toThrow();
  });
});

describe("otherPendingText", () => {
  it("says so plainly when there are none, or when the list couldn't load", () => {
    expect(otherPendingText([])).toBe("No other pending changes.");
    expect(otherPendingText(null)).toMatch(/Couldn't load/);
  });

  it("lists what, when, status, and the links", () => {
    const text = otherPendingText(
      pendingRows([
        mk("20261008-cccccc", "ready_for_review", "2026-10-08T17:00:00Z", {
          prNumber: 51,
          conversationUrl: "https://chatgpt.com/share/abc",
        }),
      ]),
    );
    expect(text).toContain("Ready for review");
    expect(text).toContain("Oct 8");
    expect(text).toContain("deploy-preview-51");
    expect(text).toContain("https://chatgpt.com/share/abc");
    expect(text).toContain('"Swap the hero image"');
  });
});

describe("normalizeConversationUrl", () => {
  it("keeps real ChatGPT and Claude chat links", () => {
    expect(normalizeConversationUrl("https://chatgpt.com/share/abc")).toBe(
      "https://chatgpt.com/share/abc",
    );
    expect(normalizeConversationUrl(" https://claude.ai/chat/123 ")).toBe(
      "https://claude.ai/chat/123",
    );
  });

  it("drops anything else", () => {
    for (const bad of [
      "",
      undefined,
      "http://chatgpt.com/c/1",
      "https://chatgpt.com/",
      "https://evil.com/chatgpt.com",
      "https://chatgpt.com.evil.com/c/1",
      "javascript:alert(1)",
    ]) {
      expect(normalizeConversationUrl(bad)).toBeNull();
    }
  });
});
