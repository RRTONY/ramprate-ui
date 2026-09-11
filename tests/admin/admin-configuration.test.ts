import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/admin/health/route";

describe("administrator configuration", () => {
  it("exposes a test-only health contract for database-managed CMS access", async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ databaseManaged: true });
  });
});
