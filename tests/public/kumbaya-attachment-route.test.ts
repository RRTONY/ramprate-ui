import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { storagePut } = vi.hoisted(() => ({ storagePut: vi.fn() }));

vi.mock("@/lib/storage", () => ({ storagePut }));

import { POST } from "@/app/api/kumbaya-intake/attachment/route";

function requestFor(file: File) {
  const formData = new FormData();
  formData.set("file", file);

  return new NextRequest("http://localhost/api/kumbaya-intake/attachment", {
    body: formData,
    method: "POST",
  });
}

describe("Kumbaya venue attachment endpoint", () => {
  beforeEach(() => {
    storagePut.mockReset();
  });

  it("rejects unsupported attachment types before storage is called", async () => {
    const response = await POST(
      requestFor(
        new File(["not an image"], "notes.txt", { type: "text/plain" }),
      ),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Use a JPG, PNG, or WebP image.",
      ok: false,
    });
    expect(storagePut).not.toHaveBeenCalled();
  });

  it("stores an allowed image and returns metadata rather than file bytes", async () => {
    storagePut.mockResolvedValue({
      key: "kumbaya/venue/venue-9f0ba7f3b13c.webp",
      url: "/manus-storage/kumbaya/venue/venue-9f0ba7f3b13c.webp",
    });

    const image = new File([new Uint8Array([1, 2, 3])], "Venue Photo.webp", {
      type: "image/webp",
    });
    const response = await POST(requestFor(image));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      attachment: {
        key: "kumbaya/venue/venue-9f0ba7f3b13c.webp",
        name: "Venue Photo.webp",
        size: 3,
        type: "image/webp",
        url: "/manus-storage/kumbaya/venue/venue-9f0ba7f3b13c.webp",
      },
      ok: true,
    });
    expect(storagePut).toHaveBeenCalledWith(
      "kumbaya/venue/venue-photo.webp",
      expect.any(Uint8Array),
      "image/webp",
    );
  });
});
