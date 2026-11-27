import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/admin/sanity-content", async (orig) => ({
  ...(await orig<typeof import("@/lib/admin/sanity-content")>()),
  getDocumentForEditing: vi.fn(),
  uploadImageAsset: vi.fn(),
  attachImageToDraft: vi.fn(),
}));

import {
  attachImageToDraft,
  getDocumentForEditing,
  uploadImageAsset,
} from "@/lib/admin/sanity-content";
import {
  ADMIN_TOOLS,
  runAdminTool,
  type AdminToolContext,
} from "@/lib/admin/tools";
import { READ_ONLY_TOOLS } from "@/lib/admin/mcp-auth";
import { RULES_GATED_TOOLS } from "@/lib/admin/project-rules";

const png = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1,
]).toString("base64");
const post = { _id: "drafts.p1", _type: "post", title: "Why sourcing" };
let ctx: AdminToolContext;
const fail = (r: { output: unknown }) => (r.output as { error: string }).error;

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(uploadImageAsset).mockResolvedValue({
    assetId: "image-x-1200x630-png",
    url: "https://cdn.sanity.io/x.png",
    width: 1200,
    height: 630,
  });
  vi.mocked(attachImageToDraft).mockResolvedValue({ key: "k1" });
  ctx = {
    log: vi.fn(),
    claimContent: vi.fn(async () => null),
  } as unknown as AdminToolContext;
});

describe("sanity_upload_image", () => {
  it("is listed, edit-level and rules-gated", () => {
    expect(ADMIN_TOOLS.some((t) => t.name === "sanity_upload_image")).toBe(
      true,
    );
    expect(READ_ONLY_TOOLS.has("sanity_upload_image")).toBe(false);
    expect(RULES_GATED_TOOLS.has("sanity_upload_image")).toBe(true);
  });

  it("refuses a bad name, missing alt or a fake file before uploading", async () => {
    expect(
      (
        await runAdminTool(
          "sanity_upload_image",
          { filename: "a.pdf", alt: "x", base64Content: png },
          ctx,
        )
      ).isError,
    ).toBe(true);
    expect(
      fail(
        await runAdminTool(
          "sanity_upload_image",
          { filename: "a.png", alt: " ", base64Content: png },
          ctx,
        ),
      ),
    ).toMatch(/alt is required/);
    const html = Buffer.from("<html>").toString("base64");
    expect(
      (
        await runAdminTool(
          "sanity_upload_image",
          { filename: "a.png", alt: "x", base64Content: html },
          ctx,
        )
      ).isError,
    ).toBe(true);
    expect(uploadImageAsset).not.toHaveBeenCalled();
  });

  it("uploads only and returns an image value for sanity_patch_document", async () => {
    const r = await runAdminTool(
      "sanity_upload_image",
      { filename: "a.png", alt: "Chart", base64Content: png },
      ctx,
    );
    expect(r.output).toMatchObject({
      ok: true,
      assetId: "image-x-1200x630-png",
      imageValue: { asset: { _ref: "image-x-1200x630-png" } },
    });
    expect(ctx.claimContent).not.toHaveBeenCalled();
  });

  it("places a team photo, claiming the member by name", async () => {
    vi.mocked(getDocumentForEditing).mockResolvedValueOnce({
      _id: "t1",
      _type: "teamMember",
      name: "Jane Doe",
    } as never);
    vi.mocked(attachImageToDraft).mockResolvedValueOnce({});
    const r = await runAdminTool(
      "sanity_upload_image",
      {
        filename: "jane.png",
        alt: "Jane Doe",
        base64Content: png,
        attach_to: { documentId: "t1", field: "photo" },
      },
      ctx,
    );
    expect(r.output).toMatchObject({ ok: true, field: "photo" });
    expect(ctx.claimContent).toHaveBeenCalledWith({
      id: "t1",
      type: "teamMember",
      title: "Jane Doe",
      isNew: false,
    });
  });

  it("places a picture inside a post's text after a paragraph", async () => {
    vi.mocked(getDocumentForEditing).mockResolvedValueOnce(post as never);
    const r = await runAdminTool(
      "sanity_upload_image",
      {
        filename: "a.png",
        alt: "Chart",
        caption: "Q3",
        base64Content: png,
        attach_to: { documentId: "p1", field: "body", afterBlockKey: "b1" },
      },
      ctx,
    );
    expect(r.output).toMatchObject({ ok: true, blockKey: "k1" });
    expect(attachImageToDraft).toHaveBeenCalledWith(
      "p1",
      "body",
      { assetId: "image-x-1200x630-png", alt: "Chart", caption: "Q3" },
      "b1",
    );
  });

  it("refuses targets whose pictures don't show on the site, before uploading", async () => {
    expect(
      fail(
        await runAdminTool(
          "sanity_upload_image",
          {
            filename: "a.png",
            alt: "x",
            base64Content: png,
            attach_to: { documentId: "p1", field: "heroImage" },
          },
          ctx,
        ),
      ),
    ).toMatch(/must be "mainImage", "body" or "photo"/);

    vi.mocked(getDocumentForEditing).mockResolvedValueOnce(null as never);
    expect(
      fail(
        await runAdminTool(
          "sanity_upload_image",
          {
            filename: "a.png",
            alt: "x",
            base64Content: png,
            attach_to: { documentId: "nope", field: "body" },
          },
          ctx,
        ),
      ),
    ).toBe("No document found for nope");

    vi.mocked(getDocumentForEditing).mockResolvedValueOnce({
      _id: "c1",
      _type: "testimonial",
    } as never);
    expect(
      fail(
        await runAdminTool(
          "sanity_upload_image",
          {
            filename: "a.png",
            alt: "x",
            base64Content: png,
            attach_to: { documentId: "c1", field: "photo" },
          },
          ctx,
        ),
      ),
    ).toMatch(/isn't a picture that shows on the site for a "testimonial"/);

    vi.mocked(getDocumentForEditing).mockResolvedValueOnce({
      _id: "x",
      _type: undefined,
    } as never);
    expect(
      (
        await runAdminTool(
          "sanity_upload_image",
          {
            filename: "a.png",
            alt: "x",
            base64Content: png,
            attach_to: { documentId: "x", field: "body" },
          },
          ctx,
        )
      ).isError,
    ).toBe(true);

    vi.mocked(getDocumentForEditing).mockResolvedValueOnce(post as never);
    expect(
      fail(
        await runAdminTool(
          "sanity_upload_image",
          {
            filename: "a.png",
            alt: "x",
            base64Content: png,
            attach_to: {
              documentId: "p1",
              field: "mainImage",
              afterBlockKey: "b1",
            },
          },
          ctx,
        ),
      ),
    ).toBe("afterBlockKey only applies to body.");

    vi.mocked(getDocumentForEditing).mockResolvedValueOnce({
      _id: "p9",
      _type: "post",
    } as never);
    ctx = {
      log: vi.fn(),
      claimContent: vi.fn(async () => "It belongs to another waiting change."),
    } as unknown as AdminToolContext;
    expect(
      fail(
        await runAdminTool(
          "sanity_upload_image",
          {
            filename: "a.png",
            alt: "x",
            base64Content: png,
            attach_to: { documentId: "p9", field: "body", afterBlockKey: "" },
          },
          ctx,
        ),
      ),
    ).toBe("It belongs to another waiting change.");
    expect(uploadImageAsset).not.toHaveBeenCalled();
  });

  it("says the upload worked but placing failed", async () => {
    vi.mocked(getDocumentForEditing).mockResolvedValueOnce(post as never);
    vi.mocked(attachImageToDraft).mockRejectedValueOnce(
      new Error("No paragraph"),
    );
    const r = await runAdminTool(
      "sanity_upload_image",
      {
        filename: "a.png",
        alt: "x",
        base64Content: png,
        attach_to: { documentId: "p1", field: "body" },
      },
      ctx,
    );
    expect(fail(r)).toMatch(
      /uploaded \(image-x-1200x630-png\) but couldn't be placed: No paragraph/,
    );
    vi.mocked(getDocumentForEditing).mockResolvedValueOnce(post as never);
    vi.mocked(attachImageToDraft).mockRejectedValueOnce("odd");
    expect(
      fail(
        await runAdminTool(
          "sanity_upload_image",
          {
            filename: "a.png",
            alt: "x",
            base64Content: png,
            attach_to: { documentId: "p1", field: "body" },
          },
          ctx,
        ),
      ),
    ).toMatch(/unknown error/);
  });
});
