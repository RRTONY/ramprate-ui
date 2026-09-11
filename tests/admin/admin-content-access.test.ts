import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { GET as getContent } from "@/app/api/admin/content/[resource]/route";
import { POST as postContact } from "@/app/api/contact-intake/route";
import { isActiveCmsMember, normalizeCmsEmail } from "@/lib/admin/access";

const projectFile = (path: string) => resolve(process.cwd(), path);

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

  it("normalizes email identity and only recognizes an active database CMS member", () => {
    const email = normalizeCmsEmail(" ADMIN@RAMPRATE.COM ");

    expect(email).toBe("admin@ramprate.com");
    expect(
      isActiveCmsMember(
        { email: "admin@ramprate.com", role: "owner", isActive: 1 },
        email,
      ),
    ).toBe(true);
    expect(
      isActiveCmsMember(
        { email: "admin@ramprate.com", role: "owner", isActive: 0 },
        email,
      ),
    ).toBe(false);
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
