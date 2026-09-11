import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (path: string) => resolve(process.cwd(), path);

describe("managed public page route", () => {
  it("resolves administrator-created routes through the relational content layer", async () => {
    const [routeSource, clientSource] = await Promise.all([
      readFile(projectFile("src/app/[...slug]/page.tsx"), "utf8"),
      readFile(projectFile("src/lib/content/client.ts"), "utf8"),
    ]);

    expect(routeSource).toContain('from "@/lib/content/client"');
    expect(routeSource).toContain("getPublicPageByRoute(route)");
    expect(routeSource).toContain("<PortableText");
    expect(routeSource).toContain("alternates: { canonical: route }");
    expect(clientSource).toContain("export const getPublicPageByRoute");
    expect(clientSource).toContain("eq(contentPages.route, route)");
  });

  it("uses direct managed-content paths rather than retired Sanity aliases", async () => {
    const [tsconfig, searchPage, thinkingPage] = await Promise.all([
      readFile(projectFile("tsconfig.json"), "utf8"),
      readFile(projectFile("src/app/search/page.tsx"), "utf8"),
      readFile(projectFile("src/app/thinking/[slug]/page.tsx"), "utf8"),
    ]);

    expect(tsconfig).not.toContain("@/lib/sanity/*");
    expect(tsconfig).not.toContain("@/components/shared/SanityImage");
    expect(searchPage).toContain('from "@/lib/content/client"');
    expect(searchPage).toContain('from "@/components/shared/ContentImage"');
    expect(thinkingPage).toContain('from "@/lib/content/portable-text"');
    expect(thinkingPage).toContain('from "@/components/shared/ContentImage"');
  });
});
