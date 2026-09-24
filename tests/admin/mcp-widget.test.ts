import { describe, expect, it, vi } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { McpUser } from "@/lib/admin/mcp-auth";

vi.mock("@/lib/admin/github-client", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/admin/github-client")>()),
  getDefaultBranch: vi.fn(async () => "master"),
  getFile: vi.fn(async (path: string) =>
    path === "AGENTS.md"
      ? { content: "# Rules", sha: "feedbeef1234567" }
      : null,
  ),
  listDir: vi.fn(async () => []),
  findOpenAdminPR: vi.fn(async () => ({ number: 42, branch: "admin/vibe-x" })),
  compareToDefaultBranch: vi.fn(async () => ({
    files: [{ path: "src/app/page.tsx", status: "modified" }],
  })),
  getPRCombinedStatus: vi.fn(async () => "success"),
}));
vi.mock("@/lib/admin/sanity-content", () => ({
  listPendingDrafts: vi.fn(async () => []),
  publishDraft: vi.fn(async () => {}),
}));
vi.mock("@/lib/admin/tools", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/admin/tools")>()),
  waitForChecks: vi.fn(async () => ({
    status: "success",
    failingChecks: [],
    previewUrl: "https://deploy-preview-42--ramprate.netlify.app",
  })),
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

describe("pending-changes card (ChatGPT / MCP Apps)", () => {
  it("links the card with both the MCP Apps key and ChatGPT's alias, plus status text", async () => {
    const client = await connect(WRITER);
    const { tools } = await client.listTools();
    const t = tools.find((x) => x.name === "list_pending_changes")!;
    const meta = t._meta as Record<string, unknown>;
    expect((meta.ui as { resourceUri: string }).resourceUri).toBe(
      "ui://ramprate-admin/pending-changes.html",
    );
    expect(meta["openai/outputTemplate"]).toBe(
      "ui://ramprate-admin/pending-changes.html",
    );
    expect(meta["openai/toolInvocation/invoking"]).toBeTruthy();
    expect(
      (
        tools.find((x) => x.name === "publish_changes")!._meta as Record<
          string,
          unknown
        >
      )["openai/widgetAccessible"],
    ).toBe(true);
    await client.close();
  });

  it("labels tools so ChatGPT/Claude know which ones change things", async () => {
    const client = await connect(WRITER);
    const { tools } = await client.listTools();
    const by = (n: string) => tools.find((t) => t.name === n)!.annotations!;
    expect(by("github_read_file").readOnlyHint).toBe(true);
    expect(by("github_write_file").readOnlyHint).toBe(false);
    expect(by("github_delete_file").destructiveHint).toBe(true);
    expect(by("publish_changes").destructiveHint).toBe(true);
    expect(by("send_email").openWorldHint).toBe(true);
    expect(by("github_read_file").title).toBe("Github Read File");
    await client.close();
  });

  it("gives the card structured data, and the rules version only in card-only _meta", async () => {
    const client = await connect(WRITER);
    const res = await client.callTool({
      name: "list_pending_changes",
      arguments: {},
    });
    const sc = res.structuredContent as Record<string, unknown>;
    expect(sc.prNumber).toBe(42);
    expect(sc.youCanPublish).toBe(true);
    expect(sc.canPublish).toBe(true);
    expect((res._meta as Record<string, unknown>).rulesVersion).toBe(
      "feedbeef12",
    );
    const text = (res.content as Array<{ text: string }>)[0].text;
    expect(text).not.toContain("feedbeef12");
    expect(JSON.stringify(sc)).not.toContain("feedbeef12");
    await client.close();
  });

  it("tells the card an editor can't publish", async () => {
    const client = await connect(EDITOR);
    const res = await client.callTool({
      name: "list_pending_changes",
      arguments: {},
    });
    expect(
      (res.structuredContent as Record<string, unknown>).youCanPublish,
    ).toBe(false);
    await client.close();
  });

  it("the card's Publish click (with the version from _meta) gets past the rules gate", async () => {
    const client = await connect(WRITER);
    const listed = await client.callTool({
      name: "list_pending_changes",
      arguments: {},
    });
    const version = (listed._meta as Record<string, unknown>).rulesVersion;
    const gh = await import("@/lib/admin/github-client");
    vi.spyOn(gh, "mergePR").mockResolvedValue({
      merged: true,
      sha: "abc",
    } as never);
    vi.spyOn(gh, "deleteBranch").mockResolvedValue(undefined as never);
    const res = await client.callTool({
      name: "publish_changes",
      arguments: { rules_version: version },
    });
    expect(res.isError).toBeFalsy();
    expect((res.structuredContent as Record<string, unknown>).ok).toBe(true);
    await client.close();
  });

  it("the card resource declares a border and a narrow CSP", async () => {
    const client = await connect(WRITER);
    const r = await client.readResource({
      uri: "ui://ramprate-admin/pending-changes.html",
    });
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
    expect(content.text).toContain("applyHostStyleVariables");
    await client.close();
  });
});
