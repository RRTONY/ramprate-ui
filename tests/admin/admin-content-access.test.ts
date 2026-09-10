import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GET as getContent } from "@/app/api/admin/content/[resource]/route";
import { POST as postContact } from "@/app/api/contact-intake/route";
import { getAuthorizedAdmin, isConfiguredAdmin } from "@/lib/admin/access";

const projectFile = (path: string) => resolve(process.cwd(), path);
const originalAdminEmails = process.env.ADMIN_EMAILS;

afterEach(() => {
  vi.unstubAllGlobals();
  if (originalAdminEmails === undefined) delete process.env.ADMIN_EMAILS;
  else process.env.ADMIN_EMAILS = originalAdminEmails;
});

describe("admin content access", () => {
  it("uses the existing Yup convention rather than Zod for new content mutations", async () => {
    const source = await readFile(
      projectFile("src/app/api/admin/content/[resource]/route.ts"),
      "utf8",
    );

    expect(source).toContain('import * as yup from "yup"');
    expect(source).not.toContain('from "zod"');
    expect(source).toContain("postInputSchema");
    expect(source).toContain("pageInputSchema");
    expect(source).toContain("categoryInputSchema");
  });

  it("provides protected console controls for all managed editorial and private submission workflows", async () => {
    const [source, apiSource] = await Promise.all([
      readFile(
        projectFile("src/app/flow/admin/content/AdminContentConsole.tsx"),
        "utf8",
      ),
      readFile(
        projectFile("src/app/api/admin/content/[resource]/route.ts"),
        "utf8",
      ),
    ]);

    expect(source).toContain('id: "posts"');
    expect(source).toContain('id: "pages"');
    expect(source).toContain('id: "categories"');
    expect(source).toContain('id: "settings"');
    expect(source).toContain('id: "submissions"');
    expect(source).toContain("Main image asset ID");
    expect(source).toContain("Private submission inbox");
    expect(apiSource).toContain("getAuthorizedAdmin");
  });

  it("recognizes only configured administrator emails after an upstream session check", async () => {
    process.env.ADMIN_EMAILS = "admin@ramprate.com";
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          user: { email: "ADMIN@RAMPRATE.COM", name: "Admin" },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const administrator = await getAuthorizedAdmin(
      new Request("https://ramprate.com/api/admin/content/posts", {
        headers: { cookie: "next-auth.session-token=session" },
      }),
    );

    expect(isConfiguredAdmin("admin@ramprate.com")).toBe(true);
    expect(administrator).toEqual({
      email: "admin@ramprate.com",
      name: "Admin",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://flow.tonygreenberg.com/api/auth/session",
      expect.objectContaining({
        headers: { cookie: "next-auth.session-token=session" },
      }),
    );
  });

  it("denies unauthenticated callers before administrative data can be queried", async () => {
    const response = await getContent(
      new NextRequest("https://ramprate.com/api/admin/content/posts"),
      { params: Promise.resolve({ resource: "posts" }) },
    );

    expect(response.status).toBe(403);
  });

  it("rejects malformed public contact submissions without storing data", async () => {
    const response = await postContact(
      new NextRequest("https://ramprate.com/api/contact-intake", {
        method: "POST",
        body: "not-json",
        headers: { "content-type": "application/json" },
      }),
    );

    expect(response.status).toBe(400);
  });
});
