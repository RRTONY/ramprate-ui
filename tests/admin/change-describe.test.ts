import { describe, expect, it } from "vitest";
import {
  describeFile,
  describeFiles,
  factsLine,
  normalizeChangeKey,
  newChangeKey,
  reviewToken,
  sanityBeforeAfter,
  valueToPlain,
} from "@/lib/admin/change-describe";

describe("describeFile", () => {
  it("names the home page and normal pages with their address", () => {
    expect(describeFile("src/app/page.tsx")).toEqual({
      label: "Home page",
      route: "/",
      shared: false,
    });
    expect(describeFile("src/app/about/page.tsx").route).toBe("/about");
  });

  it("drops route groups and doesn't mistake files that end in 'page'", () => {
    expect(describeFile("src/app/(site)/biochain/page.tsx").route).toBe(
      "/biochain",
    );
    expect(describeFile("src/app/about/homepage.tsx").route).toBe("/about");
  });

  it("treats dynamic pages and layouts as shared, with no single link", () => {
    expect(describeFile("src/app/blog/[slug]/page.tsx")).toMatchObject({
      label: "Every /blog/[slug] page",
      route: null,
      shared: true,
    });
    expect(describeFile("src/app/layout.tsx").shared).toBe(true);
  });

  it("names shared parts, images and hidden files plainly", () => {
    expect(describeFile("src/components/layout/Header.tsx").label).toBe(
      "Site header (every page)",
    );
    expect(describeFile("src/components/home/Hero.tsx").label).toContain(
      '"Hero"',
    );
    expect(describeFile("public/images/team.png").label).toBe(
      "Image or file: images/team.png",
    );
    expect(describeFile("src/app/api/ai/route.ts").label).toContain(
      "Behind-the-scenes",
    );
  });

  it("collapses several files on one page into one entry", () => {
    const areas = describeFiles([
      "src/app/about/page.tsx",
      "src/app/about/Team.tsx",
    ]);
    expect(areas).toHaveLength(1);
    expect(areas[0].label).toBe("/about page");
  });

  it("returns nothing for no files", () => {
    expect(describeFiles([])).toEqual([]);
  });
});

describe("sanityBeforeAfter", () => {
  it("shows only the fields that changed, in plain words", () => {
    const diff = sanityBeforeAfter(
      {
        _id: "x",
        _rev: "1",
        title: "Where Relationships Become Revenue.",
        n: 1,
      },
      { _id: "drafts.x", _rev: "2", title: "Welcome to Ramprate", n: 1 },
    );
    expect(diff).toEqual([
      {
        label: "Title",
        before: "Where Relationships Become Revenue.",
        after: "Welcome to Ramprate",
      },
    ]);
  });

  it("looks one level into objects like seo", () => {
    const diff = sanityBeforeAfter(
      { seo: { _type: "seo", metaTitle: "Old" } },
      { seo: { _type: "seo", metaTitle: "New" } },
    );
    expect(diff).toEqual([
      { label: "Seo › Meta Title", before: "Old", after: "New" },
    ]);
  });

  it("marks new documents and turns rich text into words", () => {
    const diff = sanityBeforeAfter(null, {
      body: [
        { _type: "block", children: [{ text: "Hello " }, { text: "world" }] },
      ],
    });
    expect(diff).toEqual([
      { label: "Body", before: "(new)", after: "Hello world" },
    ]);
  });

  it("returns nothing when nothing changed", () => {
    expect(sanityBeforeAfter({ a: 1 }, { a: 1 })).toEqual([]);
  });

  it("shortens long values and handles empties", () => {
    expect(valueToPlain("x".repeat(500)).length).toBeLessThanOrEqual(280);
    expect(valueToPlain("")).toBe("(empty)");
    expect(valueToPlain({ _type: "image", asset: {} })).toBe("(an image)");
  });
});

describe("reviewToken", () => {
  it("is stable regardless of draft order", () => {
    const a = reviewToken("abc", [
      { id: "b", rev: "2" },
      { id: "a", rev: "1" },
    ]);
    const b = reviewToken("abc", [
      { id: "a", rev: "1" },
      { id: "b", rev: "2" },
    ]);
    expect(a).toBe(b);
  });

  it("changes when the code or any draft changes", () => {
    const base = reviewToken("abc", [{ id: "a", rev: "1" }]);
    expect(reviewToken("abd", [{ id: "a", rev: "1" }])).not.toBe(base);
    expect(reviewToken("abc", [{ id: "a", rev: "2" }])).not.toBe(base);
    expect(reviewToken(null, [])).not.toBe(base);
  });
});

describe("factsLine", () => {
  it("says what changed and that nothing else is included", () => {
    expect(
      factsLine({
        areas: [{ label: "Home page", route: "/", shared: false }],
        content: [],
        checkStatus: "success",
        otherPendingCount: 0,
      }),
    ).toBe(
      "Changes: Home page. No other changes are included. Site check passed.",
    );
  });

  it("warns that other waiting changes are left out", () => {
    expect(
      factsLine({
        areas: [],
        content: ["Blog post: Hi"],
        checkStatus: null,
        otherPendingCount: 2,
      }),
    ).toContain("2 other waiting changes are NOT included.");
  });

  it("handles an empty change", () => {
    expect(
      factsLine({
        areas: [],
        content: [],
        checkStatus: null,
        otherPendingCount: 0,
      }),
    ).toContain("Nothing has been changed yet.");
  });
});

describe("change keys", () => {
  it("makes keys that normalize back to themselves", () => {
    const key = newChangeKey(new Date("2026-10-02T10:00:00Z"));
    expect(key).toMatch(/^20261002-[a-z0-9]{6}$/);
    expect(normalizeChangeKey(key)).toBe(key);
    expect(normalizeChangeKey(`adminChange.${key}`)).toBe(key);
    expect(normalizeChangeKey(`admin/vibe-${key}`)).toBe(key);
  });

  it("rejects anything else", () => {
    expect(normalizeChangeKey("")).toBeNull();
    expect(normalizeChangeKey(undefined)).toBeNull();
    expect(normalizeChangeKey("drafts.abc")).toBeNull();
    expect(normalizeChangeKey("20261002-ab12cd; drop")).toBeNull();
  });
});

describe("one status for content-only and finished changes", async () => {
  const { reviewChecks, reviewOutcome } =
    await import("@/lib/admin/change-describe");
  const contentOnly = reviewChecks({
    hasCode: false,
    build: null,
    buildStuck: false,
    headSha: null,
    lint: null,
    devices: null,
  });

  it("content-only changes need no build, so they can be ready at once", () => {
    expect(
      contentOnly.every((c) => c.state === "not_needed" && !c.required),
    ).toBe(true);
    const r = reviewOutcome({
      status: "ready_for_review",
      checks: contentOnly,
      hasPreview: false,
      problems: [],
    });
    expect(r.state).toBe("ready");
    expect(r.actions).toEqual({
      preview: false,
      discard: true,
      publish: true,
      retry: false,
    });
  });

  it("published and discarded changes offer no actions", () => {
    for (const status of ["published", "discarded"] as const) {
      const r = reviewOutcome({
        status,
        checks: contentOnly,
        hasPreview: true,
        problems: [],
      });
      expect(r.state).toBe(status);
      expect(Object.values(r.actions).some(Boolean)).toBe(false);
    }
  });

  it("a draft is 'Working' and can only be discarded or previewed", () => {
    const r = reviewOutcome({
      status: "draft",
      checks: contentOnly,
      hasPreview: true,
      problems: [],
    });
    expect(r.state).toBe("working");
    expect(r.actions).toEqual({
      preview: true,
      discard: true,
      publish: false,
      retry: false,
    });
  });

  it("problems that aren't checks still fail the review with the reason", () => {
    const r = reviewOutcome({
      status: "ready_for_review",
      checks: contentOnly,
      hasPreview: false,
      problems: ["Nothing has been changed yet"],
    });
    expect(r.state).toBe("failed");
    expect(r.nextStep).toContain("Nothing has been changed yet");
  });
});

describe("plain wording found in the live test (2026-10-06)", async () => {
  const { goesLiveList, reviewChecks, reviewOutcome } =
    await import("@/lib/admin/change-describe");

  it("only says 'open the Preview' once there is a preview", () => {
    const checks = reviewChecks({
      hasCode: true,
      build: "pending",
      buildStuck: false,
      headSha: "h",
      lint: { headSha: "h", files: [] },
      devices: null,
    });
    const building = reviewOutcome({
      status: "ready_for_review",
      checks,
      hasPreview: false,
      problems: [],
    });
    expect(building.state).toBe("checking");
    expect(building.nextStep).not.toContain("open the Preview");
    expect(
      reviewOutcome({
        status: "ready_for_review",
        checks,
        hasPreview: true,
        problems: [],
      }).nextStep,
    ).toContain("open the Preview");
  });

  it("labels only real pages as 'Page:'", () => {
    const items = goesLiveList({
      summary: null,
      appliesTo: "both",
      areas: [
        { label: "About page", route: "/about", shared: false },
        {
          label: "Behind-the-scenes file: src/lib/x.ts",
          route: null,
          shared: false,
        },
      ],
      content: [],
      otherPendingCount: 0,
    });
    expect(items).toEqual([
      "Page: About page",
      "Behind-the-scenes file: src/lib/x.ts",
      "Applies to: Desktop and mobile",
      "No other changes are included",
    ]);
  });
});
