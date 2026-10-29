import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { email } = vi.hoisted(() => ({ email: vi.fn() }));
vi.mock("../src/lib/admin/resend-client", () => ({ sendEmail: email }));
const secret = "fake-token-for-unit-tests-only";
const valid = {
  intent: "project",
  name: "Jane Doe",
  email: "Jane@example.com",
  company: "Acme Corp",
  role: "Founder",
  phone: "+1 (909) 235-9945",
  overview: "A project overview",
  needs: ["Advice or strategy", "IT and telecom sourcing"],
  timing: "Within a month",
  heard_from: "Tony",
  event_tag: "vegas",
  contact_preference: "Email",
  consent: true,
  source_page: "https://ramprate.com/connect",
  form_url: "https://ramprate.com/connect-form.html?event=vegas",
  submitted_at: "2026-10-30T12:00:00Z",
  details: {
    stage: "Just an idea",
    desired_outcome: "A successful launch",
    partnership_types: ["Technology"],
    introduced_person: {
      name: "Test Person",
      company: "Test Org",
      contact: "test-person@example.com",
      relationship: "A colleague",
    },
    person_knows: "Yes",
    worked_with_us_before: "Yes",
    rampate_contact: "Test contact",
    wants_to_reach: "Test team",
  },
};
const intentOptions = [
  "Seeking help (project or business)",
  "Introducing someone",
  "Proposing a partnership",
  "Other inquiry",
];
function definitions() {
  const dropdowns: Record<string, string[]> = {
    "Contact preference": ["Email", "WhatsApp", "Phone call"],
    Intent: intentOptions,
    Stage: [
      "Just an idea",
      "Being built",
      "Up and running",
      "Scaling or restructuring",
    ],
    Timing: [
      "As soon as possible",
      "Within a month",
      "In the next few months",
      "Just exploring",
    ],
  };
  const labels: Record<string, string[]> = {
    Needs: [
      "Advice or strategy",
      "IT and telecom sourcing",
      "Cutting technology costs",
      "Introductions",
      "A partnership",
      "Funding or investment",
      "Something else",
    ],
    "Partnership types": [
      "Services or sourcing",
      "Technology",
      "Referrals or introductions",
      "Investment",
      "Co-marketing or events",
      "Something else",
    ],
  };
  return [
    "Company",
    "Contact preference",
    "Email",
    "Event",
    "Heard from",
    "Intent",
    "Needs",
    "Partnership types",
    "Phone",
    "Role",
    "Source page",
    "Stage",
    "Submitted at",
    "Timing",
  ].map((name) => ({
    id: `field-${name}`,
    name,
    type: dropdowns[name]
      ? "drop_down"
      : labels[name]
        ? "labels"
        : (
            {
              Email: "email",
              Phone: "phone",
              "Source page": "url",
              "Submitted at": "date",
            } as Record<string, string>
          )[name] || "short_text",
    type_config: {
      options: (dropdowns[name] || labels[name] || []).map((value, index) => ({
        id: `option-${name}-${index}`,
        ...(labels[name]
          ? { label: value.toUpperCase() }
          : { name: value.toUpperCase() }),
      })),
    },
  }));
}
let fields = definitions();
let tasks: Record<string, unknown>[] = [];
let POST: typeof import("../src/app/api/connect/route").POST;
const fetchMock = vi.fn();
const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
function json(
  value: unknown,
  status = 200,
  headers: Record<string, string> = {},
) {
  return new Response(JSON.stringify(value), { status, headers });
}
function url(input: unknown) {
  return new URL(String(input));
}
function payloads() {
  return fetchMock.mock.calls
    .filter(
      ([input, init]) =>
        url(input).pathname.endsWith("/task") && init?.method === "POST",
    )
    .map(([, init]) => JSON.parse(init.body));
}
async function submit(body: unknown = valid) {
  return POST(
    new NextRequest("https://ramprate.com/api/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}
beforeEach(async () => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.stubEnv("CLICKUP_CONNECT_TOKEN", "");
  vi.stubEnv("CLICKUP_API_TOKEN", secret);
  vi.stubEnv("CONTEXT", "production");
  vi.stubEnv("CLICKUP_CONNECT_LIST_ID", "");
  vi.stubEnv("CLICKUP_CONNECT_ASSIGNEE", "");
  fields = definitions();
  tasks = [];
  email.mockResolvedValue({});
  fetchMock.mockImplementation(async (input: string, init: RequestInit) => {
    const u = url(input);
    if (u.pathname.endsWith("/field")) return json({ fields });
    if (init.method === "GET") return json({ tasks, last_page: true });
    return json({ id: "unit-task" });
  });
  vi.stubGlobal("fetch", fetchMock);
  POST = (await import("../src/app/api/connect/route")).POST;
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("Connect ClickUp integration", () => {
  it("creates one correctly named, assigned and tagged task in the fixed list, with all 14 mappings", async () => {
    expect((await submit()).status).toBe(200);
    expect(payloads()).toHaveLength(1);
    const createCall = fetchMock.mock.calls.find(
      ([input, init]) =>
        url(input).pathname.endsWith("/task") && init.method === "POST",
    )!;
    expect(url(createCall[0]).pathname).toBe("/api/v2/list/901115639111/task");
    expect(createCall[1].headers.Authorization).toBe(secret);
    const task = payloads()[0];
    expect(task).toMatchObject({
      name: "Vegas | Seeking help | Jane Doe | Acme Corp",
      status: "New",
      assignees: [87423169],
      tags: ["vegas"],
    });
    expect(task.custom_fields).toHaveLength(14);
    const values = Object.fromEntries(
      task.custom_fields.map((field: { id: string; value: unknown }) => [
        field.id.replace("field-", ""),
        field.value,
      ]),
    );
    expect(values).toEqual({
      Company: "Acme Corp",
      "Contact preference": "option-Contact preference-0",
      Email: valid.email,
      Event: "vegas",
      "Heard from": "Tony",
      Intent: "option-Intent-0",
      Needs: ["option-Needs-0", "option-Needs-1"],
      "Partnership types": ["option-Partnership types-1"],
      Phone: "+19092359945",
      Role: "Founder",
      "Source page": valid.source_page,
      Stage: "option-Stage-0",
      "Submitted at": Date.parse(valid.submitted_at),
      Timing: "option-Timing-1",
    });
    expect(
      task.custom_fields.find(
        (field: { id: string }) => field.id === "field-Submitted at",
      ).value_options,
    ).toEqual({ time: true });
    for (const heading of [
      "OVERVIEW",
      "DESIRED OUTCOME",
      "STAGE",
      "NEEDS",
      "TIMING",
      "INTRODUCED PERSON",
      "PARTNERSHIP TYPES",
      "WHO TO REACH",
      "AGREED",
      "SUBMITTED",
      "SOURCE PAGE",
      "FORM URL",
    ])
      expect(task.description).toContain(heading + "\n");
    expect(task.description).toContain("PDT");
    expect(task.description).toContain("Test Person");
    expect(task.description).toContain("A colleague");
    expect(email).toHaveBeenCalledTimes(2);
    expect(email.mock.calls.map(([message]) => message.to)).toEqual([
      "admin@ramprate.com",
      "hello@ramprate.com",
    ]);
    expect(email.mock.calls[0][0].text).not.toContain("ClickUp save failed");
    expect(fetchMock.mock.invocationCallOrder.at(-1)).toBeLessThan(
      email.mock.invocationCallOrder[0],
    );
  });
  it.each([
    ["project", 0],
    ["introduction", 1],
    ["partnership", 2],
    ["other", 3],
  ])("maps intent %s by its option name", async (intent, index) => {
    await submit({ ...valid, intent });
    expect(
      payloads()[0].custom_fields.find(
        (field: { id: string }) => field.id === "field-Intent",
      ).value,
    ).toBe(`option-Intent-${index}`);
  });
  it("uses Direct and no tag when the event is blank, and skips empty fields", async () => {
    await submit({
      ...valid,
      event_tag: "",
      phone: "",
      role: "",
      needs: [],
      timing: "",
      heard_from: "",
      contact_preference: "",
      submitted_at: "",
      details: {},
    });
    const task = payloads()[0];
    expect(task.name).toMatch(/^Direct \| Seeking help/);
    expect(task.tags).toEqual([]);
    expect(task.custom_fields.map((field: { id: string }) => field.id)).toEqual(
      ["field-Company", "field-Email", "field-Intent", "field-Source page"],
    );
  });
  it("caps the task title below 200 characters without changing field values", async () => {
    await submit({ ...valid, name: "n".repeat(100), company: "c".repeat(150) });
    expect(payloads()[0].name.length).toBeLessThan(200);
    expect(
      payloads()[0].custom_fields.find(
        (field: { id: string }) => field.id === "field-Company",
      ).value,
    ).toBe("c".repeat(150));
  });
  it("skips an unmatched dropdown and labels field, retaining raw values in the description", async () => {
    await submit({
      ...valid,
      contact_preference: "Send a letter",
      needs: ["Advice or strategy", "Unlisted need"],
    });
    const task = payloads()[0];
    expect(
      task.custom_fields.map((field: { id: string }) => field.id),
    ).not.toContain("field-Contact preference");
    expect(
      task.custom_fields.map((field: { id: string }) => field.id),
    ).not.toContain("field-Needs");
    expect(task.description).toContain("Send a letter");
    expect(task.description).toContain("Unlisted need");
  });
  it("matches custom field names exactly, skips a missing field and logs only its known name", async () => {
    fields = fields.map((field) =>
      field.name === "Company" ? { ...field, name: "company" } : field,
    );
    await submit();
    expect(payloads()[0].custom_fields).toHaveLength(13);
    expect(warn).toHaveBeenCalledWith(
      "CU_FIELD_MISSING_Company",
      expect.any(String),
    );
  });
  it("caches field metadata for five minutes and refreshes it after expiry", async () => {
    vi.useFakeTimers();
    await submit();
    await submit();
    expect(
      fetchMock.mock.calls.filter(([input]) =>
        url(input).pathname.endsWith("/field"),
      ),
    ).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(300001);
    await submit();
    expect(
      fetchMock.mock.calls.filter(([input]) =>
        url(input).pathname.endsWith("/field"),
      ),
    ).toHaveLength(2);
  });
  it.each(["Not a fit", "Moved to CRM", "New"])(
    "merges a case-insensitive recent email duplicate with status %s",
    async (status) => {
      tasks = [
        {
          id: "existing",
          date_created: String(Date.now() - 1000),
          status: { status },
          custom_fields: [{ id: "field-Email", value: "JANE@EXAMPLE.COM" }],
        },
      ];
      await submit();
      expect(payloads()).toHaveLength(0);
      const comment = fetchMock.mock.calls.find(
        ([input, init]) =>
          url(input).pathname === "/api/v2/task/existing/comment" &&
          init.method === "POST",
      )!;
      expect(JSON.parse(comment[1].body).comment_text).toMatch(
        /^New submission\n/,
      );
      expect(JSON.parse(comment[1].body).comment_text).toContain(
        valid.overview,
      );
      const updates = fetchMock.mock.calls.filter(
        ([input, init]) =>
          url(input).pathname === "/api/v2/task/existing" &&
          init.method === "PUT",
      );
      expect(updates).toHaveLength(status === "New" ? 0 : 1);
      if (updates.length)
        expect(JSON.parse(updates[0][1].body)).toEqual({ status: "New" });
      expect(warn).toHaveBeenCalledWith(
        "CU_DUPLICATE_MERGED",
        expect.any(String),
      );
      const query = url(
        fetchMock.mock.calls.find(
          ([input, init]) =>
            url(input).pathname.endsWith("/task") && init.method === "GET",
        )![0],
      ).searchParams;
      expect(query.get("include_closed")).toBe("true");
      expect(query.get("include_timl")).toBe("true");
      expect(query.has("date_created_gt")).toBe(true);
    },
  );
  it("does not merge an email match older than 30 days", async () => {
    tasks = [
      {
        id: "old",
        date_created: String(Date.now() - 31 * 86400000),
        custom_fields: [{ name: "Email", value: valid.email }],
      },
    ];
    await submit();
    expect(payloads()).toHaveLength(1);
  });
  it("paginates duplicate checking instead of inspecting only the first 100 tasks", async () => {
    const normal = fetchMock.getMockImplementation()!;
    fetchMock.mockImplementation(async (input, init) => {
      const u = url(input);
      if (u.pathname.endsWith("/task") && init.method === "GET")
        return json({
          tasks:
            u.searchParams.get("page") === "0"
              ? Array.from({ length: 100 }, (_, index) => ({
                  id: String(index),
                  date_created: String(Date.now()),
                  custom_fields: [],
                }))
              : [
                  {
                    id: "page-two",
                    date_created: String(Date.now()),
                    custom_fields: [{ name: "Email", value: valid.email }],
                  },
                ],
        });
      return normal(input, init);
    });
    await submit();
    expect(payloads()).toHaveLength(0);
    expect(
      fetchMock.mock.calls.some(([input]) =>
        url(input).pathname.endsWith("/page-two/comment"),
      ),
    ).toBe(true);
  });
  it("creates a task when the duplicate lookup fails", async () => {
    const normal = fetchMock.getMockImplementation()!;
    fetchMock.mockImplementation((input, init) =>
      init.method === "GET" && url(input).pathname.endsWith("/task")
        ? Promise.resolve(json({}, 403))
        : normal(input, init),
    );
    expect((await submit()).status).toBe(200);
    expect(payloads()).toHaveLength(1);
    expect(warn).toHaveBeenCalledWith("CU_NO_ACCESS_403", expect.any(String));
  });
  it("still creates a task with the full description if metadata is unavailable", async () => {
    const normal = fetchMock.getMockImplementation()!;
    fetchMock.mockImplementation((input, init) =>
      url(input).pathname.endsWith("/field")
        ? Promise.resolve(json({}, 403))
        : normal(input, init),
    );
    await submit();
    expect(payloads()[0].custom_fields).toEqual([]);
    expect(payloads()[0].description).toContain(valid.email);
  });
  it.each([429, 503])(
    "retries %s once, respecting Retry-After",
    async (status) => {
      vi.useFakeTimers();
      const normal = fetchMock.getMockImplementation()!;
      let calls = 0;
      fetchMock.mockImplementation((input, init) => {
        if (
          url(input).pathname.endsWith("/task") &&
          init.method === "POST" &&
          calls++ === 0
        )
          return Promise.resolve(json({}, status, { "retry-after": "1" }));
        return normal(input, init);
      });
      const response = submit();
      await vi.advanceTimersByTimeAsync(999);
      expect(payloads()).toHaveLength(1);
      await vi.advanceTimersByTimeAsync(1);
      expect((await response).status).toBe(200);
      expect(payloads()).toHaveLength(2);
    },
  );
  it("does not retry or make further API calls before a long Retry-After expires", async () => {
    fetchMock.mockResolvedValue(json({}, 429, { "retry-after": "60" }));
    expect((await submit()).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(email.mock.calls[0][0].text).toContain(
      "ClickUp save failed - please add this lead manually",
    );
  });
  it("times out after eight seconds even if fetch never settles", async () => {
    vi.useFakeTimers();
    fetchMock.mockImplementation(() => new Promise(() => {}));
    const response = submit();
    await vi.advanceTimersByTimeAsync(8001);
    expect((await response).status).toBe(200);
    expect(email).toHaveBeenCalledTimes(2);
    expect(email.mock.calls[0][0].text).toContain(valid.overview);
    expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
    expect(email.mock.calls[0][0].text).toContain("[CU_TIMEOUT]");
    expect(warn).toHaveBeenCalledWith("CU_TIMEOUT", expect.any(String));
  });
  it("keeps visitor success and the complete failure email when task creation fails, without leaking data", async () => {
    const normal = fetchMock.getMockImplementation()!;
    fetchMock.mockImplementation((input, init) =>
      init.method === "POST"
        ? Promise.resolve(json({ error: `${secret} ${valid.email}` }, 400))
        : normal(input, init),
    );
    const response = await submit();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    const message = email.mock.calls[0][0].text;
    for (const value of [
      "ClickUp save failed - please add this lead manually",
      valid.overview,
      valid.source_page,
      valid.form_url,
      valid.email,
      valid.details.introduced_person.name,
    ])
      expect(message).toContain(value);
    const logs = JSON.stringify([...warn.mock.calls, ...errorLog.mock.calls]);
    for (const value of [secret, valid.name, valid.email, valid.overview])
      expect(logs).not.toContain(value);
  });
  it("does not call ClickUp or email for a honeypot or invalid submission", async () => {
    expect((await submit({ ...valid, website: "bot" })).status).toBe(200);
    expect((await submit({ ...valid, phone: "abc!!!" })).status).toBe(400);
    expect(
      (await submit({ ...valid, overview: "x".repeat(2001) })).status,
    ).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(email).not.toHaveBeenCalled();
  });
  it("uses only server configuration, never visitor list/status/assignee/custom fields", async () => {
    vi.stubEnv("CLICKUP_CONNECT_LIST_ID", "123456");
    vi.stubEnv("CLICKUP_CONNECT_ASSIGNEE", "12345");
    await submit({
      ...valid,
      list_id: "evil",
      status: "Closed",
      assignees: [666],
      custom_fields: [{ id: "evil", value: "evil" }],
    });
    const task = payloads()[0];
    expect(task.status).toBe("New");
    expect(task.assignees).toEqual([12345]);
    expect(
      fetchMock.mock.calls.every(([input]) => !String(input).includes("evil")),
    ).toBe(true);
    expect(
      fetchMock.mock.calls.some(
        ([input]) => url(input).pathname === "/api/v2/list/123456/task",
      ),
    ).toBe(true);
    expect(
      task.custom_fields.some((field: { id: string }) => field.id === "evil"),
    ).toBe(false);
  });
  it("fails safely without the token and never logs token-bearing thrown errors", async () => {
    fetchMock.mockRejectedValue(new Error(secret));
    await submit();
    vi.stubEnv("CLICKUP_API_TOKEN", "");
    await submit();
    expect(JSON.stringify(warn.mock.calls)).not.toContain(secret);
    expect(email.mock.calls[0][0].text).not.toContain(secret);
  });
  it("keeps email delivery failure behavior and logs only an error code and timestamp", async () => {
    email.mockRejectedValue(new Error(`${secret} ${valid.email}`));
    const response = await submit();
    expect(response.status).toBe(502);
    expect(errorLog).toHaveBeenCalledWith(
      "CONNECT_EMAIL_FAILED",
      expect.any(String),
    );
    expect(JSON.stringify(errorLog.mock.calls)).not.toContain(secret);
    expect(JSON.stringify(errorLog.mock.calls)).not.toContain(valid.email);
  });
  it.each([
    ["dedicated-test-token", secret, "dedicated-test-token"],
    ["", secret, secret],
    ["   ", secret, secret],
  ])(
    "prefers the Connect token and falls back to the existing API token",
    async (dedicated, fallback, expected) => {
      vi.stubEnv("CLICKUP_CONNECT_TOKEN", dedicated);
      vi.stubEnv("CLICKUP_API_TOKEN", fallback);
      await submit();
      expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe(expected);
      expect(JSON.stringify(warn.mock.calls)).not.toContain(expected);
    },
  );
  it.each([
    [401, "CU_UNAUTHORIZED_401"],
    [403, "CU_NO_ACCESS_403"],
    [404, "CU_LIST_NOT_FOUND_404"],
    [429, "CU_RATE_LIMIT_429"],
    [400, "CU_TASK_CREATE_FAILED_400"],
    [503, "CU_TASK_CREATE_FAILED_503"],
  ])(
    "reports only a safe code for ClickUp HTTP %s, identically in log, email and preview header",
    async (status, code) => {
      vi.stubEnv("CONTEXT", "deploy-preview");
      const normal = fetchMock.getMockImplementation()!;
      fetchMock.mockImplementation((input, init) =>
        init.method === "POST"
          ? Promise.resolve(
              json({ error: `${secret} ${valid.email}` }, status, {
                "retry-after": "60",
              }),
            )
          : normal(input, init),
      );
      const response = await submit();
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ ok: true });
      expect(response.headers.get("X-Connect-ClickUp")).toBe(code);
      expect(email.mock.calls[0][0].text.split("\n")[0]).toBe(
        `ClickUp save failed - please add this lead manually [${code}]`,
      );
      expect(warn).toHaveBeenCalledWith(
        code,
        expect.stringMatching(/^\d{4}-\d\d-\d\dT/),
      );
      const logs = JSON.stringify(warn.mock.calls);
      for (const value of [secret, valid.email, valid.name, valid.overview])
        expect(logs).not.toContain(value);
    },
  );
  it("reports missing tokens without calling ClickUp and never exposes diagnostics in production", async () => {
    vi.stubEnv("CLICKUP_CONNECT_TOKEN", "");
    vi.stubEnv("CLICKUP_API_TOKEN", "");
    const response = await submit();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(response.headers.get("X-Connect-ClickUp")).toBeNull();
    expect(email.mock.calls[0][0].text).toContain("[CU_TOKEN_MISSING]");
    expect(warn).toHaveBeenCalledWith("CU_TOKEN_MISSING", expect.any(String));
  });
  it("reports a field metadata failure safely while still saving a task", async () => {
    const normal = fetchMock.getMockImplementation()!;
    fetchMock.mockImplementation((input, init) =>
      url(input).pathname.endsWith("/field")
        ? Promise.resolve(json({ error: secret }, 400))
        : normal(input, init),
    );
    await submit();
    expect(warn).toHaveBeenCalledWith(
      "CU_FIELD_LOOKUP_FAILED_400",
      expect.any(String),
    );
    expect(payloads()).toHaveLength(1);
    expect(email.mock.calls[0][0].text).not.toContain("ClickUp save failed");
  });
});
