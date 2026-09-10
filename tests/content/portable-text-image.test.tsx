// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import React from "react";
import { vi, describe, expect, it } from "vitest";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <span role="img" aria-label={alt} data-source={src} />
  ),
}));

import {
  PortableText,
  portableTextComponents,
} from "@/lib/content/portable-text";

describe("migrated Portable Text image blocks", () => {
  it("renders an image using the expanded asset URL retained by the managed database migration", () => {
    render(
      <PortableText
        value={[
          {
            _key: "migrated-image",
            _type: "image",
            alt: "A managed database content image",
            asset: {
              _id: "image-migrated-800x600-jpg",
              url: "https://cdn.sanity.io/images/xdo1fb5d/production/migrated.jpg",
            },
          },
        ]}
        components={portableTextComponents}
      />,
    );

    expect(
      screen
        .getByRole("img", { name: "A managed database content image" })
        .getAttribute("data-source"),
    ).toBe(
      "https://cdn.sanity.io/images/xdo1fb5d/production/migrated.jpg?w=800",
    );
  });
});
