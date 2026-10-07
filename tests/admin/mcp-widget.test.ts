import { describe, expect, it, vi } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { McpUser } from "@/lib/admin/mcp-auth";

const URI = "ui://ramprate-admin/pending-changes-v5.html";
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
  getPRHeadSha: vi.fn(async () => "head41"),
  getPRChecksDetail: vi.fn(async () => ({
    status: "success",
    previewUrl: "https://deploy-preview-41--ramprate.netlify.app",
    failingChecks: [],
  })),
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
const createChangeSet = vi.fn(async () => ({
  key: KEY,
  title: "New headline",
  request: "x",
}));
const confirmChange = vi.fn(async () => ({
  ok: true,
  changeId: KEY,
  appliesTo: "mobile",
}));
const recordDevices = vi.fn(async () => {});
const WAITING = "20261002-wait01";

vi.mock("@/lib/admin/change-sets", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/admin/change-sets")>()),
  listOpenChangeSets: vi.fn(async () => [change]),
  getChangeSet: vi.fn(async (k: string) =>
    k === KEY
      ? {
          ...change,
          prNumber: 41,
          files: [{ path: "src/app/about/page.tsx", status: "modified" }],
        }
      : k === WAITING
        ? {
            key: WAITING,
            title: "Tabs",
            status: "awaiting_confirmation",
            understoodAs: "Move the menu to the right.",
            content: [],
          }
        : null,
  ),
  changeHistory: vi.fn(async () => [
    { changeId: KEY, title: "Headline", status: "published", canUndo: true },
  ]),
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
    checks: [],
  })),
  publishChange: (...a: unknown[]) => publishChange(...(a as [])),
  discardChange: (...a: unknown[]) => discardChange(...(a as [])),
  createChangeSet: (...a: unknown[]) => createChangeSet(...(a as [])),
  confirmChange: (...a: unknown[]) => confirmChange(...(a as [])),
  recordDevices: (...a: unknown[]) => recordDevices(...(a as [])),
  reconcileWithGitHub: vi.fn(async (open: unknown[]) => open),
  markEdited: vi.fn(async () => {}),
}));

vi.mock("@/lib/admin/device-preview", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/admin/device-preview")>()),
  captureDevices: vi.fn(
    async (_url: string, _live: string, devices = ["phone", "laptop"]) =>
      [
        {
          device: "phone",
          version: "after",
          image: "data:image/jpeg;base64,PHONE",
          width: 412,
          height: 823,
        },
        {
          device: "laptop",
          version: "after",
          image: null,
          timedOut: true,
          width: null,
          height: null,
          error: "Took too long",
        },
      ].filter((s) => (devices as string[]).includes(s.device)),
  ),
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
        understood_as: "Change the homepage headline.",
        needs_confirmation: false,
      },
    });
    const sc = res.structuredContent as Record<string, unknown>;
    expect(sc.change_id).toBe(KEY);
    expect(sc.state).toBe("working");
    await client.close();
  });

  it("start_change needs understood_as, so the AI always says what it will do", async () => {
    const client = await connect(EDITOR);
    const res = await client.callTool({
      name: "start_change",
      arguments: {
        rules_version: "feedbeef12",
        title: "T",
        request: "R",
        needs_confirmation: true,
      },
    });
    expect(res.isError).toBe(true);
    await client.close();
  });

  it("an unclear request shows 'I understand your request as' and waits for a yes", async () => {
    const client = await connect(EDITOR);
    const res = await client.callTool({
      name: "start_change",
      arguments: {
        rules_version: "feedbeef12",
        title: "Tabs",
        request: "move the tabs to the right",
        understood_as: "Move the desktop navigation menu to the right side.",
        applies_to: "desktop",
        needs_confirmation: true,
      },
    });
    const sc = res.structuredContent as Record<string, unknown>;
    expect(sc.view).toBe("confirm");
    expect(sc.state).toBe("awaiting_ok");
    expect(sc.appliesToLabel).toBe("Desktop only (mobile unchanged)");
    expect(String(sc.next)).toContain("STOP");
    expect(createChangeSet).toHaveBeenLastCalledWith(
      expect.objectContaining({
        needsConfirmation: true,
        appliesTo: "desktop",
      }),
    );
    expect((res._meta as Record<string, unknown>).rulesVersion).toBe(
      "feedbeef12",
    );
    await client.close();
  });

  it("refuses edits until the person confirms, then confirm_change unlocks them", async () => {
    const client = await connect(EDITOR);
    const edit = await client.callTool({
      name: "github_write_file",
      arguments: {
        rules_version: "feedbeef12",
        change_id: WAITING,
        path: "src/components/layout/Header.tsx",
        content: "x",
        message: "x",
      },
    });
    expect(edit.isError).toBe(true);
    expect(JSON.stringify(edit.content)).toContain("hasn't confirmed");

    const ok = await client.callTool({
      name: "confirm_change",
      arguments: {
        rules_version: "feedbeef12",
        change_id: WAITING,
        applies_to: "mobile",
      },
    });
    expect(ok.isError).toBeFalsy();
    expect(confirmChange).toHaveBeenCalledWith(WAITING, "mobile");
    await client.close();
  });

  it("history comes back as a card with Restore for people who may use it", async () => {
    const client = await connect(WRITER);
    const res = await client.callTool({
      name: "list_change_history",
      arguments: {},
    });
    const sc = res.structuredContent as Record<string, unknown>;
    expect(sc.view).toBe("history");
    expect(sc.youCanRestore).toBe(true);
    expect((res._meta as Record<string, unknown>).rulesVersion).toBe(
      "feedbeef12",
    );
    await client.close();
  });

  it("phone and laptop screenshots go to the card only, never into the model's text", async () => {
    const client = await connect(READER);
    const res = await client.callTool({
      name: "preview_on_devices",
      arguments: { change_id: KEY },
    });
    expect(res.isError).toBeFalsy();
    const sc = res.structuredContent as Record<string, unknown>;
    expect(sc.view).toBe("devices");
    expect(sc.page).toBe("/about");
    const shots = (res._meta as { shots: Array<{ image: string }> }).shots;
    expect(shots.map((s) => s.image)).toEqual([
      "data:image/jpeg;base64,PHONE",
      null,
    ]);
    expect(JSON.stringify(res.content)).not.toContain("base64");
    expect(sc.missing).toEqual(["laptop"]);
    expect(recordDevices).toHaveBeenLastCalledWith(KEY, {
      headSha: "head41",
      phone: "ok",
      laptop: "timed_out",
    });
    await client.close();
  });

  it("Retry re-takes only the missing device", async () => {
    const client = await connect(READER);
    const res = await client.callTool({
      name: "preview_on_devices",
      arguments: { change_id: KEY, devices: ["laptop"] },
    });
    const sc = res.structuredContent as Record<string, unknown>;
    expect(sc.retaken).toEqual(["laptop"]);
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
    expect(content.text).toContain('" to the live RampRate website.');
    // Same three actions, same place, every time.
    expect(content.text).toContain('button("preview", "Preview"');
    expect(content.text).toContain('button("discard", "Discard"');
    expect(content.text).toContain('button("publish", "Publish"');
    expect(content.text).toContain('name: "confirm_change"');
    expect(content.text).toContain('name: "undo_change"');
    expect(content.text).toContain("applyHostStyleVariables");
    await client.close();
  });
});

describe("attached files (2026-10-08: ChatGPT/Claude can't send base64)", () => {
  it("tells ChatGPT the binary tool takes an attached file", async () => {
    const client = await connect(WRITER);
    const { tools } = await client.listTools();
    const tool = tools.find((t) => t.name === "github_write_binary_file")!;
    expect(
      (tool._meta as Record<string, unknown>)["openai/fileParams"],
    ).toEqual(["file"]);
    const file = (
      tool.inputSchema.properties as Record<string, { required?: string[] }>
    ).file;
    expect(file.required).toEqual(["download_url", "file_id"]);
    expect(tool.inputSchema.required).not.toContain("base64Content");
    await client.close();
  });

  it("gives an upload link for an open change, and refuses one not confirmed yet", async () => {
    vi.stubEnv("PORTAL_AUTH_SECRET", "test-secret");
    const client = await connect(EDITOR);
    const ok = await client.callTool({
      name: "request_upload_link",
      arguments: {
        change_id: KEY,
        path: "public/images/tsi-hero.png",
        rules_version: "feedbeef12",
      },
    });
    const sc = ok.structuredContent as Record<string, string>;
    expect(ok.isError).toBe(false);
    expect(sc.uploadUrl).toMatch(
      /^https:\/\/ramprate\.com\/api\/mcp\/upload\?t=rmcp_up\./,
    );

    const waiting = await client.callTool({
      name: "request_upload_link",
      arguments: {
        change_id: WAITING,
        path: "public/a.png",
        rules_version: "feedbeef12",
      },
    });
    expect(waiting.isError).toBe(true);

    const denied = await client.callTool({
      name: "request_upload_link",
      arguments: {
        change_id: KEY,
        path: "src/lib/admin/tools.ts",
        rules_version: "feedbeef12",
      },
    });
    expect(denied.isError).toBe(true);
    await client.close();
    vi.unstubAllEnvs();
  });

  it("explains what to do instead when the AI sends a file name as base64", async () => {
    const client = await connect(EDITOR);
    const res = await client.callTool({
      name: "github_write_binary_file",
      arguments: {
        change_id: KEY,
        path: "public/images/tsi-hero.png",
        base64Content: "/mnt/data/tsi-hero.png",
        message: "hero",
        rules_version: "feedbeef12",
      },
    });
    expect(res.isError).toBe(true);
    expect(JSON.stringify(res.content)).toContain("request_upload_link");
    await client.close();
  });
});

describe("Other Pending Changes (team feedback 2026-10-08)", () => {
  it("adds the other waiting changes to a change's review, for the card and the AI", async () => {
    const sets = await import("@/lib/admin/change-sets");
    const other = {
      key: "20261001-old111",
      title: "Old footer tweak",
      request: "Change the footer text",
      status: "ready_for_review",
      createdAt: "2026-10-01T09:00:00Z",
      requestedBy: { name: "Rob", email: "rob@ramprate.com" },
      prNumber: 40,
      content: [],
    };
    vi.mocked(sets.listOpenChangeSets).mockResolvedValue([
      { ...change, createdAt: "2026-10-02T10:00:00Z" },
      other,
    ] as never);
    const client = await connect(WRITER);
    const res = await client.callTool({
      name: "list_pending_changes",
      arguments: { change_id: KEY },
    });
    const sc = res.structuredContent as {
      otherPending: Array<{ changeId: string; previewUrl: string }>;
      otherPendingNote: string;
    };
    expect(sc.otherPending.map((r) => r.changeId)).toEqual(["20261001-old111"]);
    expect(sc.otherPending[0].previewUrl).toContain("deploy-preview-40");
    expect(sc.otherPendingNote).toContain("Other Pending Changes");
    expect(sc.otherPendingNote).toContain("Old footer tweak");
    await client.close();
    vi.mocked(sets.listOpenChangeSets).mockResolvedValue([change] as never);
  });

  it("says there are none when this is the only change", async () => {
    const client = await connect(WRITER);
    const res = await client.callTool({
      name: "list_pending_changes",
      arguments: { change_id: KEY },
    });
    const sc = res.structuredContent as {
      otherPending: unknown[];
      otherPendingNote: string;
    };
    expect(sc.otherPending).toEqual([]);
    expect(sc.otherPendingNote).toContain("No other pending changes.");
    await client.close();
  });

  it("leaves read-only tools alone", async () => {
    const client = await connect(WRITER);
    const res = await client.callTool({
      name: "github_list_dir",
      arguments: { path: "src" },
    });
    expect(JSON.stringify(res)).not.toContain("otherPending");
    await client.close();
  });

  it("card shows the section with Preview, Publish, Discard and a way back to the chat", async () => {
    const { PENDING_CHANGES_HTML } = await import("@/lib/admin/mcp-ui-widgets");
    for (const text of [
      "Other pending changes",
      "No other pending changes.",
      '"Continue in chat"',
      '"Open conversation"',
      'openAndConfirm(r.changeId, "publish"',
    ]) {
      expect(PENDING_CHANGES_HTML).toContain(text);
    }
  });
});

describe("card script", () => {
  it("is valid JavaScript after the template is filled in (an unescaped quote once left the card stuck on Loading)", async () => {
    const { PENDING_CHANGES_HTML } = await import("@/lib/admin/mcp-ui-widgets");
    const { execFileSync } = await import("child_process");
    const { mkdtempSync, writeFileSync } = await import("fs");
    const { tmpdir } = await import("os");
    const { join } = await import("path");
    const script = /<script type="module">([\s\S]*)<\/script>/.exec(
      PENDING_CHANGES_HTML,
    )![1];
    const file = join(mkdtempSync(join(tmpdir(), "card-")), "card.mjs");
    writeFileSync(file, script);
    expect(() =>
      execFileSync(process.execPath, ["--check", file], { stdio: "pipe" }),
    ).not.toThrow();
  });
});

describe("tool definitions stay valid (2026-10-08: one bad schema made ChatGPT drop every tool)", () => {
  it("every tool's input schema is well formed", async () => {
    const client = await connect(WRITER);
    const { tools } = await client.listTools();
    const problems: string[] = [];
    const check = (
      name: string,
      schema: Record<string, unknown>,
      at: string,
    ) => {
      const props = (schema.properties ?? {}) as Record<
        string,
        Record<string, unknown>
      >;
      const required = (schema.required ?? []) as string[];
      if (new Set(required).size !== required.length)
        problems.push(`${name}${at}: duplicate in required`);
      for (const key of required) {
        if (!(key in props))
          problems.push(`${name}${at}: required "${key}" has no property`);
      }
      for (const [key, prop] of Object.entries(props)) {
        if (prop.type === "object") check(name, prop, `${at}.${key}`);
      }
    };
    for (const t of tools) {
      if (!/^[a-zA-Z0-9_-]{1,64}$/.test(t.name))
        problems.push(`${t.name}: bad name`);
      if (t.inputSchema.type !== "object")
        problems.push(`${t.name}: not an object schema`);
      check(t.name, t.inputSchema as Record<string, unknown>, "");
    }
    expect(problems).toEqual([]);
    await client.close();
  });
});
