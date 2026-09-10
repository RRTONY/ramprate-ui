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
});
