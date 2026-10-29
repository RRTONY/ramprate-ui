import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../src/app/api/connect/route";
import { sendEmail } from "../src/lib/admin/resend-client";

vi.mock("../src/lib/admin/resend-client", () => ({
  sendEmail: vi.fn().mockResolvedValue({}),
}));
const valid = {
  intent: "project",
  name: "Test",
  email: "test@example.invalid",
  company: "Test",
  overview: "Test inquiry",
  consent: true,
};
function submit(body: unknown, headers: Record<string, string> = {}) {
  return POST(
    new NextRequest("https://ramprate.com/api/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
    }),
  );
}
beforeEach(() => vi.clearAllMocks());
describe("Connect submission safeguards", () => {
  it.each([
    ["abc!!!", 400],
    ["+1 (909) 235-9945", 200],
    ["12345", 400],
    ["", 200],
    ["1234567", 200],
    ["123456789012345", 200],
    ["1234567890123456", 400],
    ["12+34567", 400],
  ])("checks optional phone %s", async (phone, status) => {
    expect((await submit({ ...valid, phone })).status).toBe(status);
    expect(vi.mocked(sendEmail).mock.calls.length).toBe(status === 200 ? 2 : 0);
  });
  const limits: [string[], number][] = [
    [["name"], 100],
    [["email"], 254],
    [["company"], 150],
    [["role"], 100],
    [["phone"], 30],
    [["overview"], 2000],
    [["details", "introduced_person", "name"], 100],
    [["details", "introduced_person", "company"], 150],
    [["details", "introduced_person", "contact"], 150],
    [["details", "introduced_person", "relationship"], 300],
    [["details", "desired_outcome"], 300],
    [["details", "rampate_contact"], 150],
    [["details", "wants_to_reach"], 300],
    [["heard_from"], 200],
  ];
  it.each(limits)("rejects excessive field length %j", async (path, limit) => {
    const body: Record<string, unknown> = { ...valid };
    let target = body;
    for (const key of path.slice(0, -1)) {
      target[key] = {};
      target = target[key] as Record<string, unknown>;
    }
    target[path[path.length - 1]] = "x".repeat(limit + 1);
    const response = await submit(body);
    expect(response.status).toBe(400);
    expect((await response.json()).error).toContain(String(limit));
    expect(sendEmail).not.toHaveBeenCalled();
  });
  it("accepts a 2000-character overview without truncation", async () => {
    expect(
      (await submit({ ...valid, overview: "x".repeat(2000) })).status,
    ).toBe(200);
    expect(vi.mocked(sendEmail).mock.calls[0][0].text).toContain(
      "x".repeat(2000),
    );
  });
  it("rejects oversized bodies with and without Content-Length", async () => {
    const headerCases: Record<string, string>[] = [
      {},
      { "content-length": "22000" },
    ];
    for (const headers of headerCases) {
      expect(
        (await submit({ ...valid, extra: "x".repeat(21000) }, headers)).status,
      ).toBe(413);
    }
    expect(sendEmail).not.toHaveBeenCalled();
  });
  it("silently drops honeypot entries", async () => {
    expect((await submit({ ...valid, website: "bot" })).status).toBe(200);
    expect(sendEmail).not.toHaveBeenCalled();
  });
  it("rejects an empty form", async () => {
    expect((await submit({})).status).toBe(400);
    expect(sendEmail).not.toHaveBeenCalled();
  });
  it("returns a friendly HTML page for native POST without redirect or reflection", async () => {
    const response = await POST(
      new NextRequest("https://ramprate.com/api/connect", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "name=PrivatePerson&email=private%40example.com",
      }),
    );
    expect(response.status).toBe(400);
    expect(response.headers.get("location")).toBeNull();
    const html = await response.text();
    expect(html).toContain("hello@ramprate.com");
    expect(html).not.toContain("PrivatePerson");
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
