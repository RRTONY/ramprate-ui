import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "../../src/app/flow/api/auth/[...nextauth]/route";

describe("Flow external authentication proxy", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("forwards provider discovery to the existing external backend without exposing local credentials", async () => {
    const upstreamFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ credentials: { id: "credentials" } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", upstreamFetch);

    const response = await GET(
      new Request("https://ramprate.com/flow/api/auth/providers", {
        headers: { "x-auth-return-redirect": "1" },
      }),
      { params: Promise.resolve({ nextauth: ["providers"] }) },
    );

    expect(upstreamFetch).toHaveBeenCalledOnce();
    expect(upstreamFetch).toHaveBeenCalledWith(
      new URL("https://flow.tonygreenberg.com/api/auth/providers"),
      expect.objectContaining({ method: "GET", redirect: "manual" }),
    );
    expect(await response.json()).toEqual({
      credentials: { id: "credentials" },
    });
  });
});
