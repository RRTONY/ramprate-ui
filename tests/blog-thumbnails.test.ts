import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { localBlogThumbnail } from "@/lib/blog-thumbnails";

describe("localBlogThumbnail", () => {
  it("returns the local picture for both Yotta 2026 articles", () => {
    expect(localBlogThumbnail("data-centers-have-a-heart")).toBe(
      "/blog/yotta-2026-assets/cloud-neighbors-tacos8.webp",
    );
    expect(localBlogThumbnail("the-cloud-gets-rich")).toBe(
      "/blog/yotta-2026-assets/constellation-kitchen-tacos8.webp",
    );
  });

  it("points at files that exist in public/", () => {
    for (const slug of ["data-centers-have-a-heart", "the-cloud-gets-rich"]) {
      expect(existsSync(join("public", localBlogThumbnail(slug)!))).toBe(true);
    }
  });

  it("returns null for other, empty or missing slugs", () => {
    expect(localBlogThumbnail("some-other-post")).toBeNull();
    expect(localBlogThumbnail("")).toBeNull();
    expect(localBlogThumbnail(undefined)).toBeNull();
  });
});
