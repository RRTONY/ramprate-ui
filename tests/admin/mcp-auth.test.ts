import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import {
  authenticateMcpRequest,
  authenticateMcpToken,
  canUseTool,
  isMcpAuthConfigured,
  parseMcpUsers,
  type McpUser,
} from "@/lib/admin/mcp-auth";

const JANE = "a".repeat(64);
const BOB = "b".repeat(64);
const SHARED = "s".repeat(64);

const users = JSON.stringify([
  { name: "Jane", email: "jane@ramprate.com", token: JANE, role: "write" },
  { name: "Bob", email: "bob@ramprate.com", token: BOB, role: "read" },
]);

describe("parseMcpUsers", () => {
  beforeEach(() => vi.spyOn(console, "error").mockImplementation(() => {}));
  afterEach(() => vi.restoreAllMocks());

  it("loads valid entries and maps admin to write", () => {
    const list = parseMcpUsers(
      JSON.stringify([{ name: "A", token: JANE, role: "admin" }]),
    );
    expect(list).toEqual([
      { name: "A", email: "", role: "write", token: JANE },
    ]);
  });

  it("skips entries with a short token, unknown role or no name", () => {
    const list = parseMcpUsers(
      JSON.stringify([
        { name: "Short", token: "abc", role: "write" },
        { name: "Role", token: JANE, role: "superuser" },
        { token: JANE, role: "write" },
        { name: "Ok", token: BOB, role: "edit" },
      ]),
    );
    expect(list.map((u) => u.name)).toEqual(["Ok"]);
  });

  it("returns nothing for bad JSON or a non-array", () => {
    expect(parseMcpUsers("{nope")).toEqual([]);
    expect(parseMcpUsers('{"name":"x"}')).toEqual([]);
    expect(parseMcpUsers(undefined)).toEqual([]);
  });
});

describe("authenticateMcpToken", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("identifies each team member by their own token", () => {
    vi.stubEnv("MCP_ADMIN_USERS", users);
    expect(authenticateMcpToken(JANE)).toEqual({
      name: "Jane",
      email: "jane@ramprate.com",
      role: "write",
    });
    expect(authenticateMcpToken(BOB)?.role).toBe("read");
    expect(authenticateMcpToken("c".repeat(64))).toBeNull();
    expect(authenticateMcpToken("")).toBeNull();
  });

  it("never accepts the removed shared MCP_ADMIN_TOKEN, with or without a team list", () => {
    vi.stubEnv("MCP_ADMIN_TOKEN", SHARED);
    vi.stubEnv("MCP_ADMIN_USERS", users);
    expect(authenticateMcpToken(SHARED)).toBeNull();
    vi.stubEnv("MCP_ADMIN_USERS", "");
    expect(authenticateMcpToken(SHARED)).toBeNull();
    expect(isMcpAuthConfigured()).toBe(false);
  });

  it("is configured only when the team list has someone on it", () => {
    vi.stubEnv("MCP_ADMIN_USERS", "");
    expect(isMcpAuthConfigured()).toBe(false);
    vi.stubEnv("MCP_ADMIN_USERS", users);
    expect(isMcpAuthConfigured()).toBe(true);
  });

  it("reads the Bearer header", () => {
    vi.stubEnv("MCP_ADMIN_USERS", users);
    const req = (h?: string) =>
      new Request("https://x", { headers: h ? { authorization: h } : {} });
    expect(authenticateMcpRequest(req(`Bearer ${JANE}`))?.name).toBe("Jane");
    expect(authenticateMcpRequest(req(JANE))).toBeNull();
    expect(authenticateMcpRequest(req())).toBeNull();
  });
});

describe("canUseTool", () => {
  it("read: look only", () => {
    expect(canUseTool("read", "github_read_file")).toBe(true);
    expect(canUseTool("read", "github_write_file")).toBe(false);
    expect(canUseTool("read", "publish_changes")).toBe(false);
  });
  it("edit: changes but no publish, email or delete", () => {
    expect(canUseTool("edit", "github_write_file")).toBe(true);
    expect(canUseTool("edit", "sanity_patch_document")).toBe(true);
    for (const t of [
      "publish_changes",
      "send_email",
      "create_report",
      "delete_clickup_task",
    ])
      expect(canUseTool("edit", t)).toBe(false);
  });
  it("write: everything", () => {
    expect(canUseTool("write", "publish_changes")).toBe(true);
    expect(canUseTool("write", "send_email")).toBe(true);
  });
  it("a brand-new unknown tool is not open to read-only users", () => {
    expect(canUseTool("read", "some_future_tool")).toBe(false);
    expect(canUseTool("edit", "some_future_tool")).toBe(true);
  });
});

describe("MCP server per-user access", () => {
  async function connect(user: McpUser) {
    const { createAdminMcpServer } = await import("@/lib/admin/mcp-server");
    const [c, s] = InMemoryTransport.createLinkedPair();
    await createAdminMcpServer(user).connect(s);
    const client = new Client({ name: "t", version: "1" });
    await client.connect(c);
    return client;
  }

  it("only lists tools the person's role allows", async () => {
    const client = await connect({ name: "Bob", email: "", role: "read" });
    const names = (await client.listTools()).tools.map((t) => t.name);
    expect(names).toContain("github_read_file");
    expect(names).toContain("get_project_rules");
    expect(names).not.toContain("github_write_file");
    expect(names).not.toContain("publish_changes");
    await client.close();
  });

  it("refuses a disallowed tool even if called directly, naming the role", async () => {
    const client = await connect({ name: "Eve", email: "", role: "edit" });
    const res = await client.callTool({
      name: "publish_changes",
      arguments: {},
    });
    expect(res.isError).toBe(true);
    const text = (res.content as Array<{ text: string }>)[0].text;
    expect(text).toMatch(
      /Eve's access level \(edit\) doesn't allow publish_changes/,
    );
    await client.close();
  });
});
