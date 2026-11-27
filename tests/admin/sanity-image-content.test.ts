import { beforeEach, describe, expect, it, vi } from "vitest";

const patch = vi.hoisted(() => ({
  set: vi.fn(),
  setIfMissing: vi.fn(),
  insert: vi.fn(),
  append: vi.fn(),
  commit: vi.fn(),
}));
vi.mock("@/lib/sanity/write-client", () => ({
  writeClient: {
    getDocument: vi.fn(),
    createIfNotExists: vi.fn(),
    patch: vi.fn(() => patch),
    assets: { upload: vi.fn() },
  },
}));

import { writeClient } from "@/lib/sanity/write-client";
import {
  attachImageToDraft,
  isImageField,
  isImageTarget,
  patchDraft,
  uploadImageAsset,
} from "@/lib/admin/sanity-content";

const docs: Record<string, object> = {};
beforeEach(() => {
  vi.clearAllMocks();
  for (const k of Object.keys(docs)) delete docs[k];
  vi.mocked(writeClient.getDocument).mockImplementation(
    (async (id: string) => docs[id]) as never,
  );
  for (const fn of [patch.set, patch.setIfMissing, patch.insert, patch.append])
    fn.mockReturnValue(patch);
  patch.commit.mockResolvedValue({});
});

describe("patchDraft (refactored to share ensureDraft)", () => {
  it("still copies the published doc into a draft first", async () => {
    docs["p1"] = { _id: "p1", _type: "post" };
    await patchDraft("p1", { title: "x" });
    expect(writeClient.createIfNotExists).toHaveBeenCalledWith({
      _id: "drafts.p1",
      _type: "post",
    });
    expect(patch.set).toHaveBeenCalledWith({ title: "x" });
  });
});

describe("uploadImageAsset", () => {
  it("returns the asset id, url and size", async () => {
    vi.mocked(writeClient.assets.upload).mockResolvedValueOnce({
      _id: "image-a-10x20-png",
      url: "u",
      metadata: { dimensions: { width: 10, height: 20 } },
    } as never);
    await expect(uploadImageAsset(Buffer.from("x"), "a.png")).resolves.toEqual({
      assetId: "image-a-10x20-png",
      url: "u",
      width: 10,
      height: 20,
    });
    expect(writeClient.assets.upload).toHaveBeenCalledWith(
      "image",
      expect.any(Buffer),
      { filename: "a.png" },
    );
  });

  it("copes with no dimensions", async () => {
    vi.mocked(writeClient.assets.upload).mockResolvedValueOnce({
      _id: "image-b",
      url: "u",
    } as never);
    await expect(
      uploadImageAsset(Buffer.from("x"), "b.gif"),
    ).resolves.toMatchObject({ width: undefined, height: undefined });
  });
});

describe("picture targets", () => {
  it("allows only pictures that really show on ramprate.com", () => {
    expect(isImageTarget("post", "mainImage")).toBe(true);
    expect(isImageTarget("post", "body")).toBe(true);
    expect(isImageTarget("teamMember", "photo")).toBe(true);
    expect(isImageTarget("boardAdvisor", "photo")).toBe(true);
    expect(isImageTarget("testimonial", "photo")).toBe(false);
    expect(isImageTarget("clientLogo", "logo")).toBe(false);
    expect(isImageTarget("post", "photo")).toBe(false);
    expect(isImageTarget("toString", "body")).toBe(false);
    expect(isImageField("body")).toBe(true);
    expect(isImageField("heroImage")).toBe(false);
  });
});

describe("attachImageToDraft", () => {
  const image = { assetId: "image-a", alt: "Jane Doe" };

  it("replaces a single picture field on the draft only", async () => {
    docs["t1"] = { _id: "t1", _type: "teamMember" };
    await expect(attachImageToDraft("t1", "photo", image)).resolves.toEqual({});
    expect(writeClient.patch).toHaveBeenCalledWith("drafts.t1");
    expect(patch.set).toHaveBeenCalledWith({
      photo: { _type: "image", asset: { _type: "reference", _ref: "image-a" } },
    });
  });

  it("appends an inline block with alt and caption", async () => {
    docs["p1"] = { _id: "p1", _type: "post", body: [] };
    const { key } = await attachImageToDraft("p1", "body", {
      ...image,
      caption: "Team day",
    });
    expect(key).toMatch(/^[a-f0-9]{12}$/);
    expect(patch.setIfMissing).toHaveBeenCalledWith({ body: [] });
    expect(patch.append).toHaveBeenCalledWith("body", [
      {
        _type: "image",
        _key: key,
        asset: { _type: "reference", _ref: "image-a" },
        alt: "Jane Doe",
        caption: "Team day",
      },
    ]);
  });

  it("inserts after a real paragraph key, and refuses unknown or unsafe keys", async () => {
    docs["drafts.p1"] = {
      _id: "drafts.p1",
      _type: "post",
      body: [{ _key: "b1" }],
    };
    const { key } = await attachImageToDraft("p1", "body", image, "b1");
    expect(patch.insert).toHaveBeenCalledWith("after", 'body[_key=="b1"]', [
      expect.objectContaining({ _key: key }),
    ]);
    vi.mocked(writeClient.patch).mockClear();
    await expect(attachImageToDraft("p1", "body", image, "zz")).rejects.toThrow(
      'No paragraph with _key "zz" in body',
    );
    await expect(
      attachImageToDraft("p1", "body", image, '"] | evil'),
    ).rejects.toThrow("No paragraph");
    docs["p2"] = { _id: "p2", _type: "post" };
    await expect(attachImageToDraft("p2", "body", image, "b1")).rejects.toThrow(
      "No paragraph",
    );
    expect(writeClient.patch).not.toHaveBeenCalled();
  });
});
