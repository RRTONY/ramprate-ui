import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "../..");

describe("independent RampRate CMS route", () => {
  it("mounts the reusable console on the CMS API with team management enabled", async () => {
    const source = await readFile(
      path.join(projectRoot, "src/app/cms/page.tsx"),
      "utf8",
    );

    expect(source).toContain('apiBase="/api/cms"');
    expect(source).toContain("includeMemberManagement");
    expect(source).toContain('returnHref="/"');
  });

  it("retains a database-backed team workspace and a standalone CMS sign-in action", async () => {
    const [consoleSource, membersApiSource] = await Promise.all([
      readFile(
        path.join(
          projectRoot,
          "src/app/flow/admin/content/AdminContentConsole.tsx",
        ),
        "utf8",
      ),
      readFile(
        path.join(projectRoot, "src/app/api/cms/members/route.ts"),
        "utf8",
      ),
    ]);

    expect(consoleSource).toContain("CMS team access");
    expect(consoleSource).toContain("Sign in to RampRate CMS");
    expect(consoleSource).toContain("/flow/login?redirect=%2Fcms");
    expect(membersApiSource).toContain("cmsAdminMembers");
    expect(membersApiSource).toContain("owner");
  });
});
