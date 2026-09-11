import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "../..");

describe("independent RampRate CMS route", () => {
  it("mounts the reusable console on the CMS API without the Flow provider shell", async () => {
    const [source, layoutSource, legacyFlowRouteSource] = await Promise.all([
      readFile(path.join(projectRoot, "src/app/cms/page.tsx"), "utf8"),
      readFile(path.join(projectRoot, "src/app/cms/layout.tsx"), "utf8"),
      readFile(
        path.join(projectRoot, "src/app/flow/admin/content/page.tsx"),
        "utf8",
      ),
    ]);

    expect(source).toContain('apiBase="/api/cms"');
    expect(source).toContain("includeMemberManagement");
    expect(source).toContain('returnHref="/"');
    expect(layoutSource).not.toContain("FlowProviders");
    expect(legacyFlowRouteSource).toContain('redirect("/cms")');
  });

  it("retains a database-backed team workspace and a standalone CMS sign-in action", async () => {
    const [consoleSource, membersApiSource, loginPageSource] =
      await Promise.all([
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
        readFile(path.join(projectRoot, "src/app/cms/login/page.tsx"), "utf8"),
      ]);

    expect(consoleSource).toContain("CMS team access");
    expect(consoleSource).toContain("Sign in to RampRate CMS");
    expect(consoleSource).toContain("/api/cms/auth/session");
    expect(consoleSource).toContain('href="/cms/login"');
    expect(consoleSource).not.toContain("/flow/login");
    expect(membersApiSource).toContain("cmsAdminMembers");
    expect(membersApiSource).toContain("temporaryPassword");
    expect(membersApiSource).toContain("hashCmsPassword");
    expect(membersApiSource).toContain("owner");
    expect(loginPageSource).toContain("CmsLoginForm");
  });

  it("uses hashed passwords and opaque database sessions for CMS access", async () => {
    const [accessSource, loginApiSource, schemaSource] = await Promise.all([
      readFile(path.join(projectRoot, "src/lib/admin/access.ts"), "utf8"),
      readFile(
        path.join(projectRoot, "src/app/api/cms/auth/login/route.ts"),
        "utf8",
      ),
      readFile(path.join(projectRoot, "src/lib/content/schema.ts"), "utf8"),
    ]);

    expect(accessSource).toContain("cmsAdminSessions");
    expect(accessSource).toContain("hashCmsSessionToken");
    expect(accessSource).not.toContain("flow.tonygreenberg.com");
    expect(loginApiSource).toContain("verifyCmsPassword");
    expect(loginApiSource).toContain("createCmsSessionToken");
    expect(schemaSource).toContain("cmsAdminSessions");
    expect(schemaSource).toContain("passwordHash");
  });
});
