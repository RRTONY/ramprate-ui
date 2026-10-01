import { describe, expect, it, vi } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { McpUser } from "@/lib/admin/mcp-auth";

const URI = "ui://ramprate-admin/pending-changes-v2.html";
const KEY = "20261002-abc123";

vi.mock("@/lib/admin/github-client", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/admin/github-client")>()),
  getDefaultBranch: vi.fn(async () => "master"),
  getFile: vi.fn(async (path: string) =>
    path === "AGENTS.md"
      ? { content: "# Rules", sha: "feedbeef1234567" }
      : null,
  ),
  listDir: vi.fn(async () => []),
}));

const change = {
  key: KEY,
  title: "New homepage headline",
  status: "ready_for_review",
  content: [],
};
const publishChange = vi.fn(async () => ({
  ok: true,
  changeId: KEY,
  mergeSha: "abc",
  published: [],
}));
const discardChange = vi.fn(async () => ({ ok: true, changeId: KEY }));
const createChangeSet = vi.fn(async () => ({ key: KEY }));

vi.mock("@/lib/admin/change-sets", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/admin/change-sets")>()),
  listOpenChangeSets: vi.fn(async () => [change]),
  getChangeSet: vi.fn(async (k: string) => (k === KEY ? change : null)),
  pendingOverview: vi.fn(async () => ({
    changes: [
      {
        changeId: KEY,
        title: change.title,
        status: "ready_for_review",
        statusLabel: "Ready for review",
        requestedBy: "Jane",
        createdAt: "2026-10-02T10:00:00Z",
      },
    ],
    olderChanges: [],
    unrelatedDrafts: [],
  })),
  buildReview: vi.fn(async () => ({
    changeId: KEY,
    title: change.title,
    status: "ready_for_review",
    canPublish: true,
    reviewToken: "tok123",
    areas: [{ label: "Home page", route: "/", shared: false }],
  })),
  publishChange: (...a: unknown[]) => publishChange(...(a as [])),
  discardChange: (...a: unknown[]) => discardChange(...(a as [])),
  createChangeSet: (...a: unknown[]) => createChangeSet(...(a as [])),
}));

async function connect(user: McpUser) {
  const { createAdminMcpServer } = await import("@/lib/admin/mcp-server");
  const [c, s] = InMemoryTransport.createLinkedPair();
  await createAdminMcpServer(user).connect(s);
  const client = new Client({ name: "t", version: "1" });
  await client.connect(c);
  return client;
}

const WRITER: McpUser = {
  name: "Jane",
  email: "jane@ramprate.com",
  role: "write",
};
const EDITOR: McpUser = {
  name: "Rob",
  email: "rob@ramprate.com",
  role: "edit",
};
const READER: McpUser = {
  name: "Ann",
  email: "ann@ramprate.com",
  role: "read",
};

describe("review card (ChatGPT / MCP Apps)", () => {
  it("links the card with both the MCP Apps key and ChatGPT's alias", async () => {
    const client = await connect(WRITER);
    const { tools } = await client.listTools();
    const meta = tools.find((x) => x.name === "list_pending_changes")!
      ._meta as Record<string, unknown>;
    expect((meta.ui as { resourceUri: string }).resourceUri).toBe(URI);
    expect(meta["openai/outputTemplate"]).toBe(URI);
    for (const name of ["publish_changes", "discard_change"]) {
      expect(
        (tools.find((x) => x.name === name)!._meta as Record<string, unknown>)[
          "openai/widgetAccessible"
        ],
      ).toBe(true);
    }
    await client.close();
  });

  it("labels tools so ChatGPT/Claude know which ones change things", async () => {
    const client = await connect(WRITER);
    const { tools } = await client.listTools();
    const by = (n: string) => tools.find((t) => t.name === n)!.annotations!;
    expect(by("github_read_file").readOnlyHint).toBe(true);
    expect(by("list_change_history").readOnlyHint).toBe(true);
    expect(by("github_write_file").readOnlyHint).toBe(false);
    expect(by("publish_changes").destructiveHint).toBe(true);
    expect(by("discard_change").destructiveHint).toBe(true);
    expect(by("send_email").openWorldHint).toBe(true);
    await client.close();
  });

  it("shows one change's review when given its id, rules version only in card-only _meta", async () => {
    const client = await connect(WRITER);
    const res = await client.callTool({
      name: "list_pending_changes",
      arguments: { change_id: KEY },
    });
    const sc = res.structuredContent as Record<string, unknown>;
    expect(sc.view).toBe("detail");
    expect(sc.changeId).toBe(KEY);
    expect(sc.reviewToken).toBe("tok123");
    expect(sc.youCanPublish).toBe(true);
    expect(sc.youCanDiscard).toBe(true);
    expect((res._meta as Record<string, unknown>).rulesVersion).toBe(
      "feedbeef12",
    );
    expect(JSON.stringify(res.content)).not.toContain("feedbeef12");
    await client.close();
  });

  it("an editor can discard but not publish; a reader can do neither", async () => {
    const ed = await connect(EDITOR);
    const sc = (
      await ed.callTool({ name: "list_pending_changes", arguments: {} })
    ).structuredContent as Record<string, unknown>;
    expect(sc.youCanPublish).toBe(false);
    expect(sc.youCanDiscard).toBe(true);
    await ed.close();

    const rd = await connect(READER);
    const { tools } = await rd.listTools();
    expect(tools.some((t) => t.name === "discard_change")).toBe(false);
    expect(tools.some((t) => t.name === "list_change_history")).toBe(true);
    await rd.close();
  });

  it("publish needs a change_id and the review token, and passes them through", async () => {
    const client = await connect(WRITER);
    const listed = await client.callTool({
      name: "list_pending_changes",
      arguments: { change_id: KEY },
    });
    const version = (listed._meta as Record<string, unknown>).rulesVersion;

    const missing = await client.callTool({
      name: "publish_changes",
      arguments: { rules_version: version },
    });
    expect(missing.isError).toBe(true);
    expect(publishChange).not.toHaveBeenCalled();

    const res = await client.callTool({
      name: "publish_changes",
      arguments: {
        rules_version: version,
        change_id: KEY,
        review_token: "tok123",
      },
    });
    expect(res.isError).toBeFalsy();
    expect(publishChange).toHaveBeenCalledWith(KEY, "tok123", WRITER);
    await client.close();
  });

  it("the card's Discard click gets past the rules gate", async () => {
    const client = await connect(EDITOR);
    const res = await client.callTool({
      name: "discard_change",
      arguments: { rules_version: "feedbeef12", change_id: KEY },
    });
    expect(res.isError).toBeFalsy();
    expect(discardChange).toHaveBeenCalledWith(KEY, EDITOR);
    await client.close();
  });

  it("start_change returns a change_id to use on every edit", async () => {
    const client = await connect(EDITOR);
    const res = await client.callTool({
      name: "start_change",
      arguments: {
        rules_version: "feedbeef12",
        title: "New headline",
        request: "Change the homepage headline",
      },
    });
    expect((res.structuredContent as Record<string, unknown>).change_id).toBe(
      KEY,
    );
    await client.close();
  });

  it("the card resource declares a border, a narrow CSP, and sends the review token", async () => {
    const client = await connect(WRITER);
    const r = await client.readResource({ uri: URI });
    const content = r.contents[0] as {
      mimeType: string;
      _meta: Record<string, unknown>;
      text: string;
    };
    expect(content.mimeType).toBe("text/html;profile=mcp-app");
    const ui = content._meta.ui as {
      prefersBorder: boolean;
      csp: { resourceDomains: string[] };
    };
    expect(ui.prefersBorder).toBe(true);
    expect(ui.csp.resourceDomains).toEqual(["https://esm.sh"]);
    expect(content.text).toContain("rules_version: rulesVersion");
    expect(content.text).toContain("args.review_token = data.reviewToken");
    expect(content.text).toContain(
      "You are about to publish these changes to the live RampRate website.",
    );
    expect(content.text).toContain("applyHostStyleVariables");
    await client.close();
  });
});
