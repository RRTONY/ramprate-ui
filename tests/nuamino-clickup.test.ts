import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../src/app/api/nuamino-needs-analysis/route";
import { NUAMINO_SECTIONS } from "../src/lib/nuamino-needs-fields";

const licensing = NUAMINO_SECTIONS[0].questions[0];
const valid = {
  respondent: { name: "Jane Doe", email: "jane@example.com", title: "CEO" },
  answers: {
    licensing: licensing.understanding,
    revenue: "About $52M this year",
    stabilityTesting: "Yes, 12-month real-time studies",
  },
  verification: {},
  _meta: { sourceUrl: "https://ramprate.com/nuamino-needs-analysis" },
};

const fetchMock = vi.fn();
const error = vi.spyOn(console, "error").mockImplementation(() => {});

function submit(body: unknown = valid) {
  return POST(
    new NextRequest("https://ramprate.com/api/nuamino-needs-analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}
function calls() {
  return fetchMock.mock.calls.map(([input, init]) => ({
    path: new URL(String(input)).pathname,
    body: JSON.parse(String(init.body)),
  }));
}

beforeEach(() => {
  vi.stubEnv("CLICKUP_API_TOKEN", "fake-token");
  vi.stubEnv("NUAMINO_CLICKUP_LIST_ID", "");
  vi.stubEnv("NUAMINO_CLICKUP_REVIEWERS", "");
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockImplementation(
    async () => new Response(JSON.stringify({ id: "task1" }), { status: 200 }),
  );
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  fetchMock.mockReset();
  error.mockClear();
});

describe("NuAmino needs analysis to ClickUp", () => {
  it("creates one unassigned task in the NuAmino list with every question and answer", async () => {
    const res = await submit();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    const [task] = calls();
    expect(task.path).toBe("/api/v2/list/901115645506/task");
    expect(task.body.name).toBe("NuAmino needs analysis | Jane Doe | CEO");
    expect(task.body.assignees).toBeUndefined();
    const text: string = task.body.markdown_description;
    expect(text).toContain("jane@example.com");
    expect(text).toContain("About $52M this year");
    expect(text).toContain("_(Kept our existing understanding)_");
    for (const section of NUAMINO_SECTIONS) {
      expect(text).toContain(section.title);
      for (const question of section.questions)
        expect(text).toContain(question.label);
    }
  });

  it("puts an assigned review comment on the task for Sam and Darryl", async () => {
    await submit();
    const comments = calls().slice(1);
    expect(comments.map((c) => c.path)).toEqual([
      "/api/v2/task/task1/comment",
      "/api/v2/task/task1/comment",
    ]);
    expect(comments.map((c) => c.body.assignee)).toEqual([87464545, 87423169]);
  });

  it("uses the configured list and reviewers", async () => {
    vi.stubEnv("NUAMINO_CLICKUP_LIST_ID", "123");
    vi.stubEnv("NUAMINO_CLICKUP_REVIEWERS", " 7 ");
    await submit();
    expect(calls().map((c) => c.path)).toEqual([
      "/api/v2/list/123/task",
      "/api/v2/task/task1/comment",
    ]);
    expect(calls()[1].body.assignee).toBe(7);
  });

  it("still succeeds when a review comment fails, since the task is saved", async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "task1" })))
      .mockResolvedValue(new Response("", { status: 500 }));
    expect((await submit()).status).toBe(200);
    expect(JSON.stringify(error.mock.calls)).toContain(
      "NUAMINO_CLICKUP_COMMENT_FAILED",
    );
  });

  it("asks the visitor to retry when the task cannot be created", async () => {
    fetchMock.mockResolvedValue(new Response("", { status: 500 }));
    const res = await submit();
    expect(res.status).toBe(502);
    expect(calls()).toHaveLength(1);
    fetchMock.mockRejectedValue(new Error("network"));
    expect((await submit()).status).toBe(502);
  });

  it("refuses without a token or with bad configuration, without calling ClickUp", async () => {
    vi.stubEnv("CLICKUP_API_TOKEN", "");
    expect((await submit()).status).toBe(503);
    vi.stubEnv("CLICKUP_API_TOKEN", "fake-token");
    vi.stubEnv("NUAMINO_CLICKUP_REVIEWERS", "sam");
    expect((await submit()).status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects incomplete or malformed submissions without calling ClickUp", async () => {
    expect((await submit("not json")).status).toBe(400);
    expect((await submit({})).status).toBe(400);
    expect(
      (await submit({ ...valid, respondent: { name: "", email: "x" } })).status,
    ).toBe(400);
    expect(
      (await submit({ ...valid, answers: { stabilityTesting: " " } })).status,
    ).toBe(400);
    expect(
      (
        await submit({
          ...valid,
          answers: { ...valid.answers, revenue: "x".repeat(20001) },
        })
      ).status,
    ).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
