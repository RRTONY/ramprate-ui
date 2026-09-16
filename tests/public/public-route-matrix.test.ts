import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (path: string) => resolve(process.cwd(), path);

describe("representative public route matrix", () => {
  it("retains the unified shared public shell outside the CMS and Flow boundaries", async () => {
    const [layout, chrome, header, styles] = await Promise.all([
      readFile(projectFile("src/app/layout.tsx"), "utf8"),
      readFile(
        projectFile("src/components/shared/ConditionalChrome.tsx"),
        "utf8",
      ),
      readFile(projectFile("src/components/layout/Header.tsx"), "utf8"),
      readFile(projectFile("src/app/globals.css"), "utf8"),
    ]);

    expect(layout).toContain("<ConditionalChrome");
    expect(chrome).toContain('pathname?.startsWith("/cms")');
    expect(chrome).toContain('pathname?.startsWith("/flow")');
    expect(header).toContain('label: "Contact Us"');
    expect(styles).toContain("--rr-navy:");
    expect(styles).toContain("--rr-paper:");
    expect(styles).toContain("--gold:");
  });

  it("retains canonical services, specialist intake entry points, and protected gates", async () => {
    const [
      services,
      servicePage,
      paymentsIntake,
      clientIntake,
      supplierIntake,
      aiDoc,
    ] = await Promise.all(
      [
        "src/app/services/page.tsx",
        "src/app/services/[slug]/page.tsx",
        "src/app/payments-advisory/intake/page.tsx",
        "src/app/biochain/catalogue/page.tsx",
        "src/app/biochain/supplier-intake/page.tsx",
        "src/app/aidoc-ownership-brief/page.tsx",
      ].map((path) => readFile(projectFile(path), "utf8")),
    );

    expect(services).toContain('from "@/lib/service-catalog"');
    expect(servicePage).toContain("generateStaticParams");
    expect(paymentsIntake).toContain("<PaymentsIntakeForm");
    expect(clientIntake).toContain("<ClientIntakeForm />");
    expect(supplierIntake).toContain("<SupplierIntakeStage1Form />");
    expect(aiDoc).toContain("<AiDocGate />");
  });

  it("keeps approved legacy links as explicit permanent compatibility routes", async () => {
    const routes = await Promise.all(
      [
        "src/app/expertise/page.tsx",
        "src/app/growth/page.tsx",
        "src/app/web3/page.tsx",
        "src/app/torque/page.tsx",
        "src/app/sourcing/page.tsx",
        "src/app/thinking/page.tsx",
      ].map((path) => readFile(projectFile(path), "utf8")),
    );

    for (const route of routes) {
      expect(route).toContain("permanentRedirect(");
    }
  });
});
