import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";
import { getConnectFrameHeight } from "../src/app/connect/ConnectFrame";

describe("Connect iframe message guard", () => {
  const frame = {} as Window;
  const origin = "https://ramprate.com";
  const message = (overrides: Record<string, unknown> = {}) =>
    ({
      origin,
      source: frame,
      data: { type: "ramprate-connect-height", height: 940.5 },
      ...overrides,
    }) as unknown as MessageEvent;
  it("accepts a finite height only from this iframe and rounds up safely", () => {
    expect(getConnectFrameHeight(message(), frame, origin)).toBe(942);
  });
  it.each([
    { origin: "https://example.com" },
    { source: {} },
    { source: null },
    { data: null },
    { data: { type: "other", height: 940 } },
    ...[NaN, Infinity, -1, 0, 99, 20001, "940", null].map((height) => ({
      data: { type: "ramprate-connect-height", height },
    })),
  ])("ignores an unrelated sender or invalid height %j", (overrides) => {
    expect(getConnectFrameHeight(message(overrides), frame, origin)).toBeNull();
  });
  it("ignores messages when the iframe window is unavailable", () => {
    expect(getConnectFrameHeight(message(), null, origin)).toBeNull();
  });
});

describe("Connect intrinsic height reporter", () => {
  const html = readFileSync("public/connect-form.html", "utf8");
  const script = html.slice(
    html.lastIndexOf("<script>") + 8,
    html.lastIndexOf("</script>"),
  );
  it("reports the content root, grows and shrinks independently of viewport height", () => {
    let height = 940.5;
    let resize: () => void = () => {};
    const root = { getBoundingClientRect: () => ({ height }) };
    const observe = vi.fn();
    const postMessage = vi.fn();
    const events: Record<string, () => void> = {};
    runInNewContext(script, {
      document: {
        querySelector: (selector: string) =>
          selector === "main.page" ? root : null,
        documentElement: { scrollHeight: 1500 },
      },
      ResizeObserver: class {
        constructor(callback: () => void) {
          resize = callback;
        }
        observe = observe;
      },
      window: {
        parent: { postMessage },
        location: { origin: "https://ramprate.com" },
        addEventListener: (name: string, callback: () => void) => {
          events[name] = callback;
        },
      },
    });
    expect(observe).toHaveBeenCalledWith(root);
    expect(postMessage).toHaveBeenLastCalledWith(
      { type: "ramprate-connect-height", height: 941 },
      "https://ramprate.com",
    );
    height = 3306;
    resize();
    expect(postMessage.mock.calls.at(-1)?.[0].height).toBe(3306);
    height = 650;
    resize();
    expect(postMessage.mock.calls.at(-1)?.[0].height).toBe(650);
    resize();
    expect(postMessage).toHaveBeenCalledTimes(3);
    height = NaN;
    events.resize();
    expect(postMessage).toHaveBeenCalledTimes(3);
  });
});

describe("Connect first-load font sizing", () => {
  it("holds the measured initial height during font loading, without delaying an opened form", () => {
    const html = readFileSync("public/connect-form.html", "utf8");
    const script = html.slice(
      html.lastIndexOf("<script>") + 8,
      html.lastIndexOf("</script>"),
    );
    let height = 1067;
    const rest = { hidden: true };
    const root = {
      getBoundingClientRect: () => ({ height }),
      querySelector: () => rest,
    };
    let resize = () => {};
    let fontsReady = () => {};
    const fonts = {
      status: "loading",
      ready: {
        then: (callback: () => void) => {
          fontsReady = callback;
        },
      },
    };
    const postMessage = vi.fn();
    runInNewContext(script, {
      document: { fonts, querySelector: () => root },
      ResizeObserver: class {
        constructor(callback: () => void) {
          resize = callback;
        }
        observe() {}
      },
      window: {
        parent: { postMessage },
        location: { origin: "https://ramprate.com" },
        addEventListener() {},
      },
    });
    expect(postMessage).not.toHaveBeenCalled();
    height = 993;
    fonts.status = "loaded";
    fontsReady();
    expect(postMessage.mock.calls.at(-1)?.[0].height).toBe(993);
    fonts.status = "loading";
    rest.hidden = false;
    height = 3306;
    resize();
    expect(postMessage.mock.calls.at(-1)?.[0].height).toBe(3306);
  });
});
