import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import {
  RULES_GATED_TOOLS,
  rulesVersionError,
  versionFromSha,
  withRulesVersionParam,
} from "@/lib/admin/project-rules";

const RULES_SHA = "abc123def4567890";
const RULES_VERSION = versionFromSha(RULES_SHA);
const WRITER = {
  name: "Test Writer",
  email: "w@ramprate.com",
  role: "write" as const,
};

vi.mock("@/lib/admin/github-client", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/admin/github-client")>()),
  getDefaultBranch: vi.fn(async () => "master"),
  getFile: vi.fn(async (path: string) => {
    if (path === "AGENTS.md")
      return {
        content: "# RampRate UI: Rules\n\nFollow these.",
        sha: RULES_SHA,
      };
    if (path === "docs/ai/TASK_GUIDE.md")
      return { content: "# Task Guide", sha: "t" };
    return null;
  }),
  listDir: vi.fn(async () => [
    { path: "docs/ai/README.md", type: "file", size: 1 },
    { path: "docs/ai/project_supplier_intake.md", type: "file", size: 1 },
    { path: "docs/ai/images", type: "dir", size: 0 },
  ]),
}));

const runAdminTool = vi.fn(async () => ({ output: { ok: true } }));
vi.mock("@/lib/admin/tools", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/admin/tools")>()),
  runAdminTool: (...args: unknown[]) => runAdminTool(...(args as [])),
}));

vi.mock("@/lib/admin/mcp-tool-context", () => ({
  buildMcpToolContext: async () => ({
    ctx: {},
    auditLog: [],
    finalize: async () => ({}),
  }),
}));

describe("rulesVersionError", () => {
  it("blocks when no version is sent", () => {
    expect(rulesVersionError(undefined, "v1")).toMatch(
      /call get_project_rules first/,
    );
    expect(rulesVersionError("  ", "v1")).toMatch(
      /call get_project_rules first/,
    );
    expect(rulesVersionError(42, "v1")).toMatch(/call get_project_rules first/);
  });

  it("blocks a stale version and names both versions", () => {
    const msg = rulesVersionError("old", "new");
    expect(msg).toMatch(/rules changed/);
    expect(msg).toContain("old");
    expect(msg).toContain("new");
  });

  it("allows the current version, ignoring surrounding spaces", () => {
    expect(rulesVersionError("v1", "v1")).toBeNull();
    expect(rulesVersionError(" v1 ", "v1")).toBeNull();
  });
});

describe("withRulesVersionParam", () => {
  it("adds a required rules_version without dropping existing fields", () => {
    const schema = withRulesVersionParam({
      type: "object" as const,
      properties: { path: { type: "string" } },
      required: ["path"],
    });
    expect(Object.keys(schema.properties)).toEqual(["path", "rules_version"]);
    expect(schema.required).toEqual(["path", "rules_version"]);
  });

  it("works on a schema with no required list", () => {
    const schema = withRulesVersionParam({
      type: "object" as const,
      properties: {},
    });
    expect(schema.required).toEqual(["rules_version"]);
  });
});

describe("MCP server rules gate", () => {
  let client: Client;

  beforeEach(async () => {
    runAdminTool.mockClear();
    const { createAdminMcpServer } = await import("@/lib/admin/mcp-server");
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    await createAdminMcpServer(WRITER).connect(serverTransport);
    client = new Client({ name: "test", version: "1.0.0" });
    await client.connect(clientTransport);
  });

  afterEach(async () => {
    await client.close();
  });

  function parse(result: Awaited<ReturnType<Client["callTool"]>>) {
    const content = result.content as Array<{ type: string; text: string }>;
    return JSON.parse(content[0].text);
  }

  it("tells every client to load the rules first", () => {
    expect(client.getInstructions()).toMatch(
      /call get_project_rules before anything else/,
    );
  });

  it("lists get_project_rules and requires rules_version only on gated tools", async () => {
    const { tools } = await client.listTools();
    const byName = new Map(tools.map((t) => [t.name, t]));
    expect(byName.has("get_project_rules")).toBe(true);
    for (const name of RULES_GATED_TOOLS) {
      expect(byName.get(name)?.inputSchema.required).toContain("rules_version");
    }
    expect(byName.get("github_read_file")?.inputSchema.required).not.toContain(
      "rules_version",
    );
  });

  it("returns the rules, version, guides (missing ones as null) and only markdown knowledge-base files", async () => {
    const out = parse(
      await client.callTool({ name: "get_project_rules", arguments: {} }),
    );
    expect(out.rulesVersion).toBe(RULES_VERSION);
    expect(out.rules).toContain("Follow these.");
    expect(out.knowledgeBase).toEqual([
      "docs/ai/README.md",
      "docs/ai/project_supplier_intake.md",
    ]);
    expect(out.howToUse).toContain("Status Report");
    expect(out.taskGuide).toBe("# Task Guide");
    expect(out.projectStructure).toBeNull();
  });

  it("refuses a write without rules_version and never runs the tool", async () => {
    const result = await client.callTool({
      name: "github_write_file",
      arguments: { path: "src/app/x.tsx", content: "x" },
    });
    expect(result.isError).toBe(true);
    expect(parse(result).error).toMatch(/call get_project_rules first/);
    expect(runAdminTool).not.toHaveBeenCalled();
  });

  it("refuses a stale rules_version", async () => {
    const result = await client.callTool({
      name: "sanity_patch_document",
      arguments: { id: "x", set: {}, rules_version: "stale00000" },
    });
    expect(result.isError).toBe(true);
    expect(parse(result).error).toMatch(/rules changed/);
    expect(runAdminTool).not.toHaveBeenCalled();
  });

  it("runs the write with the current version and strips rules_version first", async () => {
    const result = await client.callTool({
      name: "github_write_file",
      arguments: {
        path: "src/app/x.tsx",
        content: "x",
        rules_version: RULES_VERSION,
      },
    });
    expect(result.isError).toBeFalsy();
    expect(runAdminTool).toHaveBeenCalledTimes(1);
    const [name, input] = runAdminTool.mock.calls[0] as unknown as [
      string,
      Record<string, unknown>,
    ];
    expect(name).toBe("github_write_file");
    expect(input).toEqual({ path: "src/app/x.tsx", content: "x" });
  });

  it("stamps who made the change onto the commit message", async () => {
    await client.callTool({
      name: "github_write_file",
      arguments: {
        path: "src/app/x.tsx",
        content: "x",
        message: "Update hero copy",
        rules_version: RULES_VERSION,
      },
    });
    const [, input] = runAdminTool.mock.calls[0] as unknown as [
      string,
      Record<string, unknown>,
    ];
    expect(input.message).toBe("Update hero copy [by Test Writer]");
  });

  it("does not gate read-only tools", async () => {
    const result = await client.callTool({
      name: "github_read_file",
      arguments: { path: "src/app/page.tsx" },
    });
    expect(result.isError).toBeFalsy();
    expect(runAdminTool).toHaveBeenCalledTimes(1);
  });
});

describe("MCP transport behaviour for strict clients", () => {
  it("answers GET and DELETE with 405 instead of opening a never-ending stream", async () => {
    const { respondToMcp } = await import("@/lib/admin/mcp-handler");
    for (const method of ["GET", "DELETE"]) {
      const res = await respondToMcp(
        new Request("https://ramprate.com/api/mcp", {
          method,
          headers: { accept: "text/event-stream" },
        }),
        WRITER,
      );
      expect(res.status).toBe(405);
      expect(res.headers.get("allow")).toBe("POST");
    }
  });

  it("still answers a POST initialize normally", async () => {
    const { respondToMcp } = await import("@/lib/admin/mcp-handler");
    const res = await respondToMcp(
      new Request("https://ramprate.com/api/mcp", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json, text/event-stream",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "initialize",
          params: {
            protocolVersion: "2025-06-18",
            capabilities: {},
            clientInfo: { name: "t", version: "1" },
          },
        }),
      }),
      WRITER,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.result.serverInfo.name).toBe("ramprate-admin");
  });

  it("lists resource templates (empty) instead of 'method not found'", async () => {
    const { createAdminMcpServer } = await import("@/lib/admin/mcp-server");
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    await createAdminMcpServer(WRITER).connect(serverTransport);
    const c = new Client({ name: "t", version: "1" });
    await c.connect(clientTransport);
    const res = await c.listResourceTemplates();
    expect(res.resourceTemplates).toEqual([]);
    await c.close();
  });

  it("marks free-form object inputs as accepting any fields", async () => {
    const { createAdminMcpServer } = await import("@/lib/admin/mcp-server");
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    await createAdminMcpServer(WRITER).connect(serverTransport);
    const c = new Client({ name: "t", version: "1" });
    await c.connect(clientTransport);
    const { tools } = await c.listTools();
    const props = (name: string) =>
      tools.find((t) => t.name === name)?.inputSchema.properties as Record<
        string,
        { additionalProperties?: boolean }
      >;
    expect(props("sanity_patch_document").patch.additionalProperties).toBe(
      true,
    );
    expect(props("sanity_create_document").fields.additionalProperties).toBe(
      true,
    );
    await c.close();
  });
});
