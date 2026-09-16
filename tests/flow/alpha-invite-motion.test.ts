import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Alpha Invite CSS motion migration", () => {
  it("moves fixed heading entry motion out of Framer Motion without changing invite behavior", async () => {
    const [component, css] = await Promise.all([
      readFile(
        resolve(process.cwd(), "src/app/flow/alpha/AlphaInviteClient.tsx"),
        "utf8",
      ),
      readFile(resolve(process.cwd(), "src/app/globals.css"), "utf8"),
    ]);

    expect(component).not.toContain("framer-motion");
    expect(component).toContain("flow-alpha-heading-enter");
    expect(component).toContain("createTeam.mutate");
    expect(component).toContain("copyToClipboard");
    expect(component).toContain("useAuth");

    expect(css).toContain("@keyframes flow-alpha-heading-enter");
    expect(css).toContain(".flow-alpha-heading-enter");
    expect(css).toContain("@media (prefers-reduced-motion: no-preference)");
  });
});
