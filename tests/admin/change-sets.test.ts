import { beforeEach, describe, expect, it, vi } from "vitest";
import type { McpUser } from "@/lib/admin/mcp-auth";

// In-memory stand-in for the Sanity write client: enough of its API for
// change-sets.ts and sanity-content.ts, with _rev bumped on every write so
// conflict checks behave like the real thing.
const docs = new Map<string, Record<string, unknown>>();
let revCounter = 0;
const nextRev = () => `r${++revCounter}`;
function put(doc: Record<string, unknown>) {
  docs.set(String(doc._id), { ...doc, _rev: nextRev() });
}

function patchBuilder(id: string) {
  const ops: Array<(d: Record<string, unknown>) => void> = [];
  const b = {
    set(fields: Record<string, unknown>) {
      ops.push((d) => Object.assign(d, fields));
      return b;
    },
    setIfMissing(fields: Record<string, unknown>) {
      ops.push((d) => {
        for (const [k, v] of Object.entries(fields))
          if (d[k] === undefined) d[k] = v;
      });
      return b;
    },
    append(key: string, items: unknown[]) {
      ops.push((d) => {
        d[key] = [...((d[key] as unknown[]) ?? []), ...items];
      });
      return b;
    },
    async commit() {
      const d = { ...(docs.get(id) ?? { _id: id }) };
      ops.forEach((op) => op(d));
      put(d);
      return d;
    },
  };
  return b;
}

function transaction() {
  const ops: Array<() => void> = [];
  const t = {
    createOrReplace(doc: Record<string, unknown>) {
      ops.push(() => put(doc));
      return t;
    },
    delete(id: string) {
      ops.push(() => docs.delete(id));
      return t;
    },
    async commit() {
      ops.forEach((op) => op());
    },
  };
  return t;
}

vi.mock("@/lib/sanity/write-client", () => ({
  writeClient: {
    getDocument: async (id: string) => docs.get(id) ?? null,
    create: async (doc: Record<string, unknown>) => {
      put(doc);
      return docs.get(String(doc._id));
    },
    createOrReplace: async (doc: Record<string, unknown>) => put(doc),
    createIfNotExists: async (doc: Record<string, unknown>) => {
      if (!docs.has(String(doc._id))) put(doc);
    },
    delete: async (id: string) => docs.delete(id),
    patch: (id: string) => patchBuilder(id),
    transaction,
    fetch: async (query: string, params: Record<string, unknown> = {}) => {
      const all = [...docs.values()];
      if (query.includes('path("drafts.**")')) {
        return all.filter((d) => String(d._id).startsWith("drafts."));
      }
      const statuses = (params.statuses as string[]) ?? [];
      return all
        .filter((d) => d._type === params.type)
        .filter((d) => !statuses.length || statuses.includes(String(d.status)))
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
        .slice(0, Number(params.limit ?? 100));
    },
  },
}));

const gh = {
  branches: new Map<string, Array<{ path: string; status: string }>>(),
  prs: new Map<
    number,
    { branch: string; head: string; open: boolean; merged?: boolean }
  >(),
  allBranches: new Set<string>(),
  nextPr: 100,
  checks: "success" as string,
  mergeShaFiles: new Map<
    string,
    {
      parentSha: string;
      files: Array<{
        path: string;
        status: string;
        previousPath: string | null;
      }>;
    }
  >(),
  fileShas: new Map<string, string | null>(), // `${ref}:${path}`
  createdStates: [] as Array<{
    branch: string;
    files: Array<{ path: string; sha: string | null }>;
  }>,
};

vi.mock("@/lib/admin/github-client", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/admin/github-client")>()),
  getDefaultBranch: async () => "master",
  compareToDefaultBranch: async (branch: string) => ({
    aheadBy: 1,
    files: (gh.branches.get(branch) ?? []).map((f) => ({
      ...f,
      additions: 1,
      deletions: 1,
    })),
  }),
  getPRHeadSha: async (n: number) => gh.prs.get(n)?.head ?? null,
  getPRChecksDetail: async () => ({
    status: gh.checks,
    previewUrl: "https://deploy-preview-100--ramprate.netlify.app",
    failingChecks: [],
  }),
  getPRCombinedStatus: async () => gh.checks,
  mergePR: vi.fn(async (n: number, sha?: string) => {
    const pr = gh.prs.get(n)!;
    if (sha && sha !== pr.head)
      throw Object.assign(new Error("409"), { status: 409 });
    pr.open = false;
    return { merged: true, sha: `merge-${n}` };
  }),
  deleteBranch: vi.fn(async (b: string) => {
    gh.allBranches.delete(b);
  }),
  closePR: vi.fn(async (n: number) => {
    gh.prs.get(n)!.open = false;
  }),
  listOpenAdminPRs: async () =>
    [...gh.prs.entries()]
      .filter(([, p]) => p.open)
      .map(([number, p]) => ({
        number,
        branch: p.branch,
        url: `https://github.com/x/pull/${number}`,
      })),
  getPRState: async (n: number) => {
    const pr = gh.prs.get(n)!;
    return {
      open: pr.open,
      merged: !!pr.merged,
      mergeSha: pr.merged ? `m-${n}` : null,
    };
  },
  listBranches: async () => [...gh.allBranches],
  getCommitFiles: async (sha: string) => gh.mergeShaFiles.get(sha)!,
  getFileSha: async (path: string, ref: string) =>
    gh.fileShas.get(`${ref}:${path}`) ?? null,
  createBranchWithFileStates: async (
    branch: string,
    files: Array<{ path: string; sha: string | null }>,
  ) => {
    gh.createdStates.push({ branch, files });
    gh.branches.set(
      branch,
      files.map((f) => ({
        path: f.path,
        status: f.sha ? "modified" : "removed",
      })),
    );
  },
  openPR: async (branch: string) => {
    const number = gh.nextPr++;
    gh.prs.set(number, { branch, head: `head-${number}`, open: true });
    return { number, branch, url: `https://github.com/x/pull/${number}` };
  },
}));

// The real waitForChecks polls for up to 20s while checks are pending.
vi.mock("@/lib/admin/tools", () => ({
  waitForChecks: async () => ({
    status: gh.checks,
    previewUrl: "https://deploy-preview-100--ramprate.netlify.app",
    failingChecks: [],
  }),
}));

const cs = await import("@/lib/admin/change-sets");
const USER: McpUser = {
  name: "Tony",
  email: "tony@ramprate.com",
  role: "write",
};

async function codeChange(title: string, files: string[]) {
  const change = await cs.createChangeSet({
    title,
    request: title,
    user: USER,
  });
  const branch = cs.branchForChange(change.key);
  gh.branches.set(
    branch,
    files.map((path) => ({ path, status: "modified" })),
  );
  const pr = gh.nextPr++;
  gh.prs.set(pr, { branch, head: `head-${pr}`, open: true });
  await cs.patchChangeSet(change.key, { branch, prNumber: pr });
  return (await cs.getChangeSet(change.key))!;
}

async function review(key: string) {
  const change = (await cs.getChangeSet(key))!;
  return cs.buildReview(change, 0);
}

beforeEach(() => {
  docs.clear();
  gh.branches.clear();
  gh.prs.clear();
  gh.mergeShaFiles.clear();
  gh.fileShas.clear();
  gh.createdStates = [];
  gh.allBranches.clear();
  gh.checks = "success";
});

describe("change sets keep each request separate", () => {
  it("reviews and publishes only the chosen change", async () => {
    const home = await codeChange("Homepage headline", ["src/app/page.tsx"]);
    const about = await codeChange("About tweak", ["src/app/about/page.tsx"]);
    await cs.submitForReview(home, "Changed the homepage headline.", []);
    await cs.submitForReview(about, "About tweak.", []);

    const r = await cs.buildReview((await cs.getChangeSet(home.key))!, 1);
    expect(r.areas.map((a) => a.label)).toEqual(["Home page"]);
    expect(r.facts).toContain("1 other waiting change is NOT included.");
    expect(r.previewLinks[0].url).toBe(
      "https://deploy-preview-100--ramprate.netlify.app/",
    );
    expect(r.canPublish).toBe(true);

    const res = await cs.publishChange(home.key, r.reviewToken, USER);
    expect(res.ok).toBe(true);
    expect(gh.prs.get(home.prNumber!)!.open).toBe(false);
    expect(gh.prs.get(about.prNumber!)!.open).toBe(true);
    expect((await cs.getChangeSet(about.key))!.status).toBe("ready_for_review");
    expect((await cs.getChangeSet(home.key))!.status).toBe("published");
  });

  it("refuses to publish a draft, or with a stale review", async () => {
    const c = await codeChange("X", ["src/app/page.tsx"]);
    const r = await review(c.key);
    expect((await cs.publishChange(c.key, r.reviewToken, USER)).ok).toBe(false);

    await cs.submitForReview(c, "X", []);
    const r2 = await review(c.key);
    gh.prs.get(c.prNumber!)!.head = "head-new"; // more was added after review
    const res = await cs.publishChange(c.key, r2.reviewToken, USER);
    expect(res).toMatchObject({ ok: false });
    expect(gh.prs.get(c.prNumber!)!.open).toBe(true);
  });

  it("refuses while the site check is failing or running", async () => {
    const c = await codeChange("X", ["src/app/page.tsx"]);
    await cs.submitForReview(c, "X", []);
    for (const state of ["failure", "pending"]) {
      gh.checks = state;
      const r = await review(c.key);
      expect(r.canPublish).toBe(false);
      expect((await cs.publishChange(c.key, r.reviewToken, USER)).ok).toBe(
        false,
      );
    }
  });

  it("won't submit an empty change", async () => {
    const c = await cs.createChangeSet({
      title: "Empty",
      request: "x",
      user: USER,
    });
    expect((await cs.submitForReview(c, "x", [])).ok).toBe(false);
  });
});

describe("content (Sanity) edits", () => {
  it("publishes only this change's drafts, never someone's Studio draft", async () => {
    put({
      _id: "post1",
      _type: "post",
      title: "Where Relationships Become Revenue.",
    });
    put({ _id: "post2", _type: "post", title: "Other" });
    put({
      _id: "drafts.post2",
      _type: "post",
      title: "Half-finished Studio edit",
    });

    const c = await cs.createChangeSet({
      title: "Headline",
      request: "x",
      user: USER,
    });
    expect(
      await cs.claimContent(c, {
        id: "post1",
        type: "post",
        title: "Where",
        isNew: false,
      }),
    ).toBeNull();
    put({
      ...docs.get("post1")!,
      _id: "drafts.post1",
      title: "Welcome to Ramprate",
    });
    await cs.submitForReview(
      (await cs.getChangeSet(c.key))!,
      "New headline.",
      [],
    );

    const r = await review(c.key);
    expect(r.beforeAfter).toContainEqual({
      label: "Blog post: Where › Title",
      before: "Where Relationships Become Revenue.",
      after: "Welcome to Ramprate",
    });
    const res = await cs.publishChange(c.key, r.reviewToken, USER);
    expect(res.ok).toBe(true);
    expect(docs.get("post1")!.title).toBe("Welcome to Ramprate");
    expect(docs.has("drafts.post1")).toBe(false);
    expect(docs.get("drafts.post2")!.title).toBe("Half-finished Studio edit");
    expect(docs.get("post2")!.title).toBe("Other");
  });

  it("refuses to claim content that has Studio edits or belongs to another change", async () => {
    put({ _id: "p", _type: "post", title: "P" });
    put({ _id: "drafts.p", _type: "post", title: "Studio" });
    const a = await cs.createChangeSet({
      title: "A",
      request: "x",
      user: USER,
    });
    expect(
      await cs.claimContent(a, {
        id: "p",
        type: "post",
        title: "P",
        isNew: false,
      }),
    ).toMatch(/Sanity Studio/);

    put({ _id: "q", _type: "post", title: "Q" });
    expect(
      await cs.claimContent(a, {
        id: "q",
        type: "post",
        title: "Q",
        isNew: false,
      }),
    ).toBeNull();
    const b = await cs.createChangeSet({
      title: "B",
      request: "x",
      user: USER,
    });
    expect(
      await cs.claimContent(b, {
        id: "q",
        type: "post",
        title: "Q",
        isNew: false,
      }),
    ).toMatch(/another waiting change/);
  });

  it("refuses to publish over content someone else published meanwhile", async () => {
    put({ _id: "p", _type: "post", title: "Old" });
    const c = await cs.createChangeSet({
      title: "C",
      request: "x",
      user: USER,
    });
    await cs.claimContent(c, {
      id: "p",
      type: "post",
      title: "P",
      isNew: false,
    });
    put({ ...docs.get("p")!, _id: "drafts.p", title: "Mine" });
    await cs.submitForReview((await cs.getChangeSet(c.key))!, "x", []);
    put({ ...docs.get("p")!, title: "Someone else's" });
    const r = await review(c.key);
    const res = await cs.publishChange(c.key, r.reviewToken, USER);
    expect(res).toMatchObject({ ok: false });
    expect(docs.get("p")!.title).toBe("Someone else's");
  });
});

describe("discard", () => {
  it("throws away only this change's code and drafts", async () => {
    put({ _id: "p", _type: "post", title: "P" });
    put({ _id: "other", _type: "post", title: "O" });
    put({ _id: "drafts.other", _type: "post", title: "Studio" });
    const c = await codeChange("C", ["src/app/page.tsx"]);
    await cs.claimContent(c, {
      id: "p",
      type: "post",
      title: "P",
      isNew: false,
    });
    put({ ...docs.get("p")!, _id: "drafts.p", title: "Edit" });

    const res = await cs.discardChange(c.key, USER);
    expect(res.ok).toBe(true);
    expect(gh.prs.get(c.prNumber!)!.open).toBe(false);
    expect(docs.has("drafts.p")).toBe(false);
    expect(docs.get("p")!.title).toBe("P");
    expect(docs.has("drafts.other")).toBe(true);
    const after = (await cs.getChangeSet(c.key))!;
    expect(after.status).toBe("discarded");
    expect(after.discardedBy).toBe("Tony");
    expect((await cs.discardChange(c.key, USER)).ok).toBe(false);
  });

  it("can close an older waiting change that has no record", async () => {
    gh.prs.set(7, {
      branch: "admin/vibe-20260926-old111",
      head: "h",
      open: true,
    });
    const overview = await cs.pendingOverview();
    expect(overview.olderChanges).toEqual([
      {
        changeId: "20260926-old111",
        prNumber: 7,
        prUrl: "https://github.com/x/pull/7",
      },
    ]);
    expect((await cs.discardChange("20260926-old111", USER)).ok).toBe(true);
    expect(gh.prs.get(7)!.open).toBe(false);
  });
});

describe("history and undo", () => {
  async function publishedCodeChange() {
    const c = await codeChange("Headline", [
      "src/app/page.tsx",
      "public/new.png",
    ]);
    await cs.submitForReview(c, "x", []);
    const r = await review(c.key);
    gh.mergeShaFiles.set(`merge-${c.prNumber}`, {
      parentSha: "parent",
      files: [
        { path: "src/app/page.tsx", status: "modified", previousPath: null },
        { path: "public/new.png", status: "added", previousPath: null },
      ],
    });
    expect((await cs.publishChange(c.key, r.reviewToken, USER)).ok).toBe(true);
    return (await cs.getChangeSet(c.key))!;
  }

  it("records the change in history with who, what and status", async () => {
    await publishedCodeChange();
    const [entry] = await cs.changeHistory(10);
    expect(entry).toMatchObject({
      title: "Headline",
      status: "published",
      requestedBy: "Tony",
      publishedBy: "Tony",
      canUndo: true,
    });
    expect(entry.changed).toContain("Home page");
  });

  it("undo makes a new waiting change that restores the old files", async () => {
    const orig = await publishedCodeChange();
    const m = orig.mergeSha!;
    gh.fileShas.set(`master:src/app/page.tsx`, "new-blob");
    gh.fileShas.set(`${m}:src/app/page.tsx`, "new-blob");
    gh.fileShas.set(`master:public/new.png`, "img");
    gh.fileShas.set(`${m}:public/new.png`, "img");
    gh.fileShas.set(`parent:src/app/page.tsx`, "old-blob");

    const res = await cs.undoChange(orig.key, USER);
    expect(res.ok).toBe(true);
    expect(gh.createdStates[0].files).toEqual([
      { path: "src/app/page.tsx", sha: "old-blob" },
      { path: "public/new.png", sha: null },
    ]);
    const undo = (await cs.getChangeSet(
      (res as { changeId: string }).changeId,
    ))!;
    expect(undo.status).toBe("ready_for_review");
    expect(undo.undoes).toBe(orig.key);
    expect((await cs.undoChange(orig.key, USER)).ok).toBe(false); // already waiting

    const r = await review(undo.key);
    expect((await cs.publishChange(undo.key, r.reviewToken, USER)).ok).toBe(
      true,
    );
    expect((await cs.getChangeSet(orig.key))!.undoneBy).toBe(undo.key);
  });

  it("refuses to undo when the same file changed again later", async () => {
    const orig = await publishedCodeChange();
    gh.fileShas.set(`master:src/app/page.tsx`, "even-newer");
    gh.fileShas.set(`${orig.mergeSha}:src/app/page.tsx`, "new-blob");
    const res = await cs.undoChange(orig.key, USER);
    expect(res).toMatchObject({ ok: false });
    expect((res as { error: string }).error).toContain("Home page");
    expect(gh.createdStates).toHaveLength(0);
  });

  it("undoes a content edit by restoring the previous version as a draft", async () => {
    put({ _id: "p", _type: "post", title: "Before" });
    const c = await cs.createChangeSet({
      title: "C",
      request: "x",
      user: USER,
    });
    await cs.claimContent(c, {
      id: "p",
      type: "post",
      title: "P",
      isNew: false,
    });
    put({ ...docs.get("p")!, _id: "drafts.p", title: "After" });
    await cs.submitForReview((await cs.getChangeSet(c.key))!, "x", []);
    await cs.publishChange(c.key, (await review(c.key)).reviewToken, USER);
    expect(docs.get("p")!.title).toBe("After");

    const res = await cs.undoChange(c.key, USER);
    expect(res.ok).toBe(true);
    expect(docs.get("drafts.p")!.title).toBe("Before");
    expect(docs.get("p")!.title).toBe("After"); // nothing live until published
    const key = (res as { changeId: string }).changeId;
    await cs.publishChange(key, (await review(key)).reviewToken, USER);
    expect(docs.get("p")!.title).toBe("Before");
  });

  it("only published changes can be undone", async () => {
    const c = await codeChange("X", ["src/app/page.tsx"]);
    expect((await cs.undoChange(c.key, USER)).ok).toBe(false);
  });
});

describe("keeping in step with GitHub", () => {
  it("marks changes merged or closed in GitHub, and deletes leftover branches", async () => {
    put({ _id: "p", _type: "post", title: "P" });
    const merged = await codeChange("Merged in GitHub", ["src/app/page.tsx"]);
    const closed = await codeChange("Closed in GitHub", [
      "src/app/about/page.tsx",
    ]);
    await cs.claimContent(closed, {
      id: "p",
      type: "post",
      title: "P",
      isNew: false,
    });
    put({ ...docs.get("p")!, _id: "drafts.p", title: "Edit" });
    const waiting = await codeChange("Still waiting", [
      "src/app/blog/page.tsx",
    ]);
    Object.assign(gh.prs.get(merged.prNumber!)!, { open: false, merged: true });
    gh.prs.get(closed.prNumber!)!.open = false;
    for (const c of [merged, closed, waiting])
      gh.allBranches.add(cs.branchForChange(c.key));
    gh.allBranches.add("admin/vibe-20260901-old000"); // abandoned, no PR

    const open = await cs.reconcileWithGitHub(await cs.listOpenChangeSets());
    expect(open.map((c) => c.key)).toEqual([waiting.key]);
    expect((await cs.getChangeSet(merged.key))!).toMatchObject({
      status: "published",
      publishedBy: "Merged directly in GitHub",
    });
    expect((await cs.getChangeSet(closed.key))!.status).toBe("discarded");
    expect(docs.has("drafts.p")).toBe(false);
    expect([...gh.allBranches]).toEqual([cs.branchForChange(waiting.key)]);
  });

  it("keeps a change with no pull request yet, and its branch", async () => {
    const c = await cs.createChangeSet({
      title: "New",
      request: "x",
      user: USER,
    });
    await cs.patchChangeSet(c.key, { branch: cs.branchForChange(c.key) });
    gh.allBranches.add(cs.branchForChange(c.key));
    const open = await cs.reconcileWithGitHub(await cs.listOpenChangeSets());
    expect(open).toHaveLength(1);
    expect(gh.allBranches.has(cs.branchForChange(c.key))).toBe(true);
  });
});
