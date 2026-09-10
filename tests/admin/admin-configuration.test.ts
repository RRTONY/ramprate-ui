import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/admin/health/route";

describe("administrator configuration", () => {
  it("accepts an administrator listed in the configured server-only allowlist", async () => {
    const configuredEmail = (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim())
      .find(Boolean);

    expect(configuredEmail).toBeTruthy();

    const response = await GET(
      new Request("https://ramprate.test/api/admin/health", {
        headers: { "x-admin-test-email": configuredEmail ?? "" },
      }) as never,
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ configured: true });
  });
});
