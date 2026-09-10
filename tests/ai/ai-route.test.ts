import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const aiMocks = vi.hoisted(() => ({
  askRampRate: vi.fn(),
  parseAdvisoryRequest: vi.fn(),
}));

vi.mock("@/lib/ai/rampRate", () => aiMocks);

const { POST } = await import("../../src/app/api/ai/route");

function post(body: unknown) {
  return new NextRequest("http://localhost/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("Ask RampRate API", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns a useful validation error for malformed questions", async () => {
    aiMocks.parseAdvisoryRequest.mockRejectedValueOnce(new Error("invalid"));

    const response = await POST(post({ question: "" }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Please enter a question between 2 and 2,000 characters.",
    });
    expect(aiMocks.askRampRate).not.toHaveBeenCalled();
  });

  it("returns a built-in AI advisory answer for validated input", async () => {
    aiMocks.parseAdvisoryRequest.mockResolvedValueOnce({
      question: "How can I reduce supplier risk?",
      history: [],
    });
    aiMocks.askRampRate.mockResolvedValueOnce("Start with a supplier-risk map.");

    const response = await POST(post({ question: "How can I reduce supplier risk?" }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      answer: "Start with a supplier-risk map.",
      source: "RampRate AI",
    });
  });

  it("returns a safe capacity response when the upstream AI runtime fails", async () => {
    aiMocks.parseAdvisoryRequest.mockResolvedValueOnce({
      question: "How can I reduce supplier risk?",
      history: [],
    });
    aiMocks.askRampRate.mockRejectedValueOnce(new Error("upstream unavailable"));

    const response = await POST(post({ question: "How can I reduce supplier risk?" }));

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      limited: true,
      contact: "/contact",
    });
  });
});
