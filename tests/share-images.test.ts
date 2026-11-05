import { describe, expect, it, vi } from "vitest";

// Fake Sanity: urlFor(source).width(w).height(h).url() -> "sanity:<ref>:<w>x<h>".
vi.mock("@/lib/sanity/image", () => ({
  urlFor: (source: { asset: { _ref: string } }) => {
    const size = { w: 0, h: 0 };
    const chain = {
      width: (w: number) => ((size.w = w), chain),
      height: (h: number) => ((size.h = h), chain),
      url: () => `sanity:${source.asset._ref}:${size.w}x${size.h}`,
    };
    return chain;
  },
}));
vi.mock("@/lib/sanity/client", () => ({ sanityFetch: vi.fn() }));

const { shareImages, withSeoOverrides, DEFAULT_SHARE_IMAGE } = await import(
  "@/lib/sanity/seo"
);

const seoImage = { asset: { _ref: "seo" } };
const mainImage = { asset: { _ref: "main" } };

describe("shareImages", () => {
  it("uses the first image given, at 1200x630", () => {
    expect(shareImages(seoImage, mainImage)).toEqual(["sanity:seo:1200x630"]);
  });

  it("skips missing images and uses the next one", () => {
    expect(shareImages(undefined, mainImage)).toEqual(["sanity:main:1200x630"]);
    expect(shareImages(null, mainImage)).toEqual(["sanity:main:1200x630"]);
  });

  it("falls back to the site share image when there is no picture", () => {
    expect(DEFAULT_SHARE_IMAGE).toBe("/og.png");
    expect(shareImages(undefined, undefined)).toEqual(["/og.png"]);
    expect(shareImages()).toEqual(["/og.png"]);
  });
});

describe("withSeoOverrides share image", () => {
  const fallback = { title: "Page", openGraph: { images: ["/og.png"] } };

  it("uses the editor's Sanity share image when set", () => {
    expect(withSeoOverrides(fallback, { ogImage: seoImage }).openGraph?.images).toEqual([
      "sanity:seo:1200x630",
    ]);
  });

  it("keeps the page's own image when the editor set none", () => {
    expect(withSeoOverrides(fallback, { metaTitle: "X" }).openGraph?.images).toEqual([
      "/og.png",
    ]);
  });
});
