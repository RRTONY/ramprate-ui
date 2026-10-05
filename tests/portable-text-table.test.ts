import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PortableText, portableTextComponents } from "@/lib/sanity/portable-text";

const render = (value: unknown[]) =>
  renderToStaticMarkup(createElement(PortableText, { value: value as never, components: portableTextComponents }));

const table = (rows: string[][], caption?: string) => ({
  _type: "table",
  _key: "t1",
  caption,
  rows: rows.map((cells, i) => ({ _type: "tableRow", _key: `r${i}`, cells })),
});

describe("portable text table", () => {
  it("renders a header row, row labels and data cells", () => {
    const html = render([table([["Factor", "ACH", "Wire"], ["FX", "None", "Required"]], "Compare rails")]);
    expect(html).toContain("<caption");
    expect(html).toContain("Compare rails");
    expect(html).toContain('<th scope="col"');
    expect(html).toContain('<th scope="row"');
    expect(html).toMatch(/<td[^>]*>Required<\/td>/);
  });

  it("only forces a minimum width on wide tables", () => {
    expect(render([table([["Size", "Evaluation"], ["$10,000", "Test"]])])).not.toContain("min-w-180");
    expect(render([table([["a", "b", "c", "d", "e"], ["1", "2", "3", "4", "5"]])])).toContain("min-w-180");
  });

  it("renders nothing for an empty or header-only table", () => {
    expect(render([table([])])).toBe("");
    expect(render([table([["Only", "Header"]])])).toBe("");
    expect(render([{ _type: "table", _key: "t2" }])).toBe("");
  });
});
