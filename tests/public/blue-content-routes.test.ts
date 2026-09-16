import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (path: string) => resolve(process.cwd(), path);

describe("blue public content routes", () => {
  it("keeps the home, blog archive, and article routes on the database-backed blue presentation", async () => {
    const [home, blog, article] = await Promise.all([
      readFile(projectFile("src/components/home/HomeContent.tsx"), "utf8"),
      readFile(projectFile("src/app/blog/page.tsx"), "utf8"),
      readFile(projectFile("src/app/blog/[slug]/page.tsx"), "utf8"),
    ]);

    expect(home).toContain('className="home-blue min-h-screen"');
    expect(blog).toContain('className="blog-blue min-h-screen"');
    expect(article).toContain('className="blog-blue min-h-screen"');
    expect(blog).toContain('from "@/lib/content/client"');
    expect(article).toContain('from "@/lib/content/client"');
    expect(article).toContain("<ContentImage");
  });

  it("retains canonical and social-preview metadata for the archive and article routes", async () => {
    const [blog, article] = await Promise.all([
      readFile(projectFile("src/app/blog/page.tsx"), "utf8"),
      readFile(projectFile("src/app/blog/[slug]/page.tsx"), "utf8"),
    ]);

    expect(blog).toContain('canonical: "https://ramprate.com/blog"');
    expect(blog).toContain('images: ["/opengraph-image"]');
    expect(article).toContain("canonical: `/blog/${slug}`");
    expect(article).toContain('type: "article" as const');
  });

  it("keeps representative marketing routes connected to managed content while redirecting the retired Thinking archive to About", async () => {
    const [about, contact, proof, thinking] = await Promise.all([
      readFile(projectFile("src/app/about/page.tsx"), "utf8"),
      readFile(projectFile("src/app/contact/page.tsx"), "utf8"),
      readFile(projectFile("src/app/proof/page.tsx"), "utf8"),
      readFile(projectFile("src/app/thinking/page.tsx"), "utf8"),
    ]);

    for (const source of [about, contact, proof]) {
      expect(source).toContain('from "@/lib/content/seo"');
    }

    expect(about).toContain('from "@/lib/content/client"');
    expect(contact).toContain("<ContactForm />");
    expect(proof).toContain("<ProofClient");
    expect(thinking).toContain('permanentRedirect("/about#journey")');
  });

  it("retains managed SEO and structured-data boundaries across retained marketing routes", async () => {
    const pages = await Promise.all(
      [
        "src/app/careers/page.tsx",
        "src/app/impactsoul/page.tsx",
        "src/app/talk-to-us/page.tsx",
      ].map((path) => readFile(projectFile(path), "utf8")),
    );

    for (const source of pages) {
      expect(source).toContain('from "@/lib/content/seo"');
      expect(source).toContain("getPageSeo(");
      expect(source).toContain("withSeoOverrides(");
      expect(source).toContain("<JsonLd");
    }
  });

  it("keeps retired branded practice URLs as permanent routes to the approved Services architecture", async () => {
    const [expertise, growth, web3, torque, sourcing] = await Promise.all(
      [
        "src/app/expertise/page.tsx",
        "src/app/growth/page.tsx",
        "src/app/web3/page.tsx",
        "src/app/torque/page.tsx",
        "src/app/sourcing/page.tsx",
      ].map((path) => readFile(projectFile(path), "utf8")),
    );

    expect(expertise).toContain('permanentRedirect("/services")');
    expect(growth).toContain(
      'permanentRedirect("/services/growth-strategy-fractional-execution")',
    );
    expect(web3).toContain(
      'permanentRedirect("/services/blockchain-tokenization-payment-infrastructure")',
    );
    expect(torque).toContain(
      'permanentRedirect("/services/relationship-specialist-sourcing")',
    );
    expect(sourcing).toContain(
      'permanentRedirect("/services/relationship-specialist-sourcing")',
    );
  });

  it("retains metadata and structured-data boundaries on further public marketing routes", async () => {
    const [values, howWeWork, paymentsAdvisory] = await Promise.all(
      [
        "src/app/values/page.tsx",
        "src/app/howwework/page.tsx",
        "src/app/payments-advisory/page.tsx",
      ].map((path) => readFile(projectFile(path), "utf8")),
    );

    for (const source of [values, howWeWork, paymentsAdvisory]) {
      expect(source).toContain("export const metadata");
      expect(source).toContain("<JsonLd");
      expect(source).toContain("breadcrumbJsonLd(");
    }

    expect(paymentsAdvisory).toContain("serviceJsonLd(");
  });
});
