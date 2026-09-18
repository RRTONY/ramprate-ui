import { NextRequest, NextResponse } from "next/server";
import { storagePut } from "@/lib/storage";

export const runtime = "nodejs";

const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function safeFileName(name: string) {
  const fallback = "venue-image";
  const normalized = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || fallback;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Choose an image before uploading." },
        { status: 400 },
      );
    }

    if (!allowedImageTypes.has(file.type)) {
      return NextResponse.json(
        { ok: false, error: "Use a JPG, PNG, or WebP image." },
        { status: 400 },
      );
    }

    if (file.size === 0 || file.size > MAX_ATTACHMENT_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Images must be no larger than 8 MB." },
        { status: 400 },
      );
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const attachment = await storagePut(
      `kumbaya/venue/${safeFileName(file.name)}`,
      bytes,
      file.type,
    );

    return NextResponse.json({
      attachment: {
        key: attachment.key,
        name: file.name,
        size: file.size,
        type: file.type,
        url: attachment.url,
      },
      ok: true,
    });
  } catch (error) {
    console.error("[Kumbaya attachment] Unable to store attachment", error);
    return NextResponse.json(
      { ok: false, error: "We could not upload the image. Please try again." },
      { status: 500 },
    );
  }
}
