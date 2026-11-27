import { afterEach, describe, expect, it, vi } from "vitest";
import { copyWithFallback } from "@/components/shared/ShareLinks";

function fakeDocument(copyResult: boolean) {
  const area = {
    value: "",
    className: "",
    setAttribute: vi.fn(),
    select: vi.fn(),
    remove: vi.fn(),
  };
  const doc = {
    createElement: vi.fn(() => area),
    body: { appendChild: vi.fn() },
    execCommand: vi.fn(() => copyResult),
  };
  vi.stubGlobal("document", doc);
  return { doc, area };
}

afterEach(() => vi.unstubAllGlobals());

describe("copyWithFallback", () => {
  it("uses the async clipboard when there is one", async () => {
    const writeText = vi.fn(async () => {});
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    await copyWithFallback("https://ramprate.com/blog/x");
    expect(writeText).toHaveBeenCalledWith("https://ramprate.com/blog/x");
  });

  it("falls back to a hidden text box on older browsers, and cleans it up", async () => {
    vi.stubGlobal("navigator", {});
    const { doc, area } = fakeDocument(true);
    await copyWithFallback("https://ramprate.com/thinking/y");
    expect(area.value).toBe("https://ramprate.com/thinking/y");
    expect(doc.execCommand).toHaveBeenCalledWith("copy");
    expect(area.remove).toHaveBeenCalled();
  });

  it("rejects when the browser refuses to copy, so the page can show the link instead", async () => {
    vi.stubGlobal("navigator", {});
    const { area } = fakeDocument(false);
    await expect(copyWithFallback("u")).rejects.toThrow("copy failed");
    expect(area.remove).toHaveBeenCalled();
  });
});
