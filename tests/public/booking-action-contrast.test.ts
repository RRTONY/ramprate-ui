import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Public booking-action contrast", () => {
  it("uses a shared readable navy foreground for gold booking actions while retaining explicit route-level call actions", async () => {
    const [styles, home, services, servicePage] = await Promise.all([
      readFile(resolve(process.cwd(), "src/app/globals.css"), "utf8"),
      readFile(
        resolve(process.cwd(), "src/components/home/HomeContent.tsx"),
        "utf8",
      ),
      readFile(resolve(process.cwd(), "src/app/services/page.tsx"), "utf8"),
      readFile(
        resolve(process.cwd(), "src/components/services/ServicePage.tsx"),
        "utf8",
      ),
    ]);

    expect(styles).toContain('a[href^="/contact"].bg-gold');
    expect(styles).toContain("color: var(--rr-navy) !important");
    expect(home).toContain("rr-booking-action");
    expect(services).toContain('href="/contact"');
    expect(servicePage).toContain(
      "href={`/contact?service=${encodeURIComponent(service.title)}`}",
    );
  });
});
