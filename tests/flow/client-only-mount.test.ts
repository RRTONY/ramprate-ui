import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const clientOnlySource = fs.readFileSync(
  path.join(process.cwd(), "src/components/flow/ClientOnly.tsx"),
  "utf8",
);

describe("Flow ClientOnly mount guard", () => {
  it("notifies React after hydration so guarded Flow routes can mount", () => {
    expect(clientOnlySource).toContain("useSyncExternalStore");
    expect(clientOnlySource).toContain("const subscribeToMount = () => () => {};");
    expect(clientOnlySource).toContain("getClientMountSnapshot");
    expect(clientOnlySource).toContain("getServerMountSnapshot");
  });

  it("continues to suppress browser-only children during server rendering", () => {
    expect(clientOnlySource).toContain("if (!mounted) return null;");
  });
});
