import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireArtifactAdmin } from "@/lib/artifact-auth";
import { writeClient } from "@/lib/sanity/write-client";
import {
  htmlAssetField,
  listArtifacts,
  slugExists,
  slugify,
  uploadHtmlAsset,
  validateHtmlSize,
  validateSlug,
} from "@/lib/artifacts";

export async function GET() {
  const unauthorized = await requireArtifactAdmin();
  if (unauthorized) return unauthorized;

  const artifacts = await listArtifacts();
  return NextResponse.json({ ok: true, artifacts });
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireArtifactAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const html = typeof body?.html === "string" ? body.html : "";
  const description =
    typeof body?.description === "string" ? body.description.trim() : "";
  const status = body?.status === "published" ? "published" : "draft";
  const rawSlug =
    typeof body?.slug === "string" && body.slug.trim()
      ? slugify(body.slug)
      : slugify(title);

  if (!title) {
    return NextResponse.json(
      { ok: false, error: "Title is required." },
      { status: 400 },
    );
  }
  if (!html.trim()) {
    return NextResponse.json(
      { ok: false, error: "HTML is required." },
      { status: 400 },
    );
  }
  const sizeError = validateHtmlSize(html);
  if (sizeError) {
    return NextResponse.json({ ok: false, error: sizeError }, { status: 400 });
  }
  const slugError = validateSlug(rawSlug);
  if (slugError) {
    return NextResponse.json({ ok: false, error: slugError }, { status: 400 });
  }
  if (await slugExists(rawSlug)) {
    return NextResponse.json(
      {
        ok: false,
        error: `The slug "${rawSlug}" is already in use by another artifact.`,
      },
      { status: 409 },
    );
  }

  const assetId = await uploadHtmlAsset(html, rawSlug);
  const now = new Date().toISOString();
  const doc = await writeClient.create({
    _type: "artifact",
    title,
    slug: { _type: "slug", current: rawSlug },
    description: description || undefined,
    htmlAsset: htmlAssetField(assetId),
    status,
    publishedAt: status === "published" ? now : undefined,
  });

  revalidatePath("/artifacts");
  if (status === "published") revalidatePath(`/artifacts/${rawSlug}`);

  return NextResponse.json({ ok: true, id: doc._id, slug: rawSlug });
}
