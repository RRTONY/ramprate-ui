import { describe, expect, it, vi } from "vitest";
import {
  askRampRate,
  invokeBuiltInCompletion,
  parseAdvisoryRequest,
} from "../../src/lib/ai/rampRate";

describe("Ask RampRate built-in AI workflow", () => {
  it("uses Yup to reject malformed advisory input", async () => {
    await expect(
      parseAdvisoryRequest({ question: "", history: [] }),
    ).rejects.toThrow();
    await expect(
      parseAdvisoryRequest({
        question: "How can sourcing strategy reduce enterprise risk?",
        history: [{ role: "user", content: "Earlier context" }],
      }),
    ).resolves.toMatchObject({ history: [{ role: "user" }] });
  });

  it("calls the built-in server-side AI endpoint and returns its answer", async () => {
    const originalUrl = process.env.BUILT_IN_FORGE_API_URL;
    const originalKey = process.env.BUILT_IN_FORGE_API_KEY;
    process.env.BUILT_IN_FORGE_API_URL = "https://ai.example.test";
    process.env.BUILT_IN_FORGE_API_KEY = "test-key";
    const requestFn = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({ choices: [{ message: { content: "A focused answer." } }] }),
        { status: 200 },
      ),
    );

    await expect(
      askRampRate(
        { question: "How do you approach sourcing?", history: [] },
        requestFn,
      ),
    ).resolves.toBe("A focused answer.");
    expect(requestFn).toHaveBeenCalledWith(
      "https://ai.example.test/v1/chat/completions",
      expect.objectContaining({ method: "POST" }),
    );

    process.env.BUILT_IN_FORGE_API_URL = originalUrl;
    process.env.BUILT_IN_FORGE_API_KEY = originalKey;
  });

  it("supports bounded structured-document generation through the same server-side runtime", async () => {
    const originalUrl = process.env.BUILT_IN_FORGE_API_URL;
    const originalKey = process.env.BUILT_IN_FORGE_API_KEY;
    process.env.BUILT_IN_FORGE_API_URL = "https://ai.example.test";
    process.env.BUILT_IN_FORGE_API_KEY = "test-key";
    const requestFn = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({ choices: [{ message: { content: "# RFP Preview" } }] }),
        { status: 200 },
      ),
    );

    await expect(
      invokeBuiltInCompletion(
        {
          system: "Draft carefully.",
          messages: [{ role: "user", content: "Create an RFP." }],
          maxCompletionTokens: 4_000,
        },
        requestFn,
      ),
    ).resolves.toBe("# RFP Preview");

    process.env.BUILT_IN_FORGE_API_URL = originalUrl;
    process.env.BUILT_IN_FORGE_API_KEY = originalKey;
  });
});
