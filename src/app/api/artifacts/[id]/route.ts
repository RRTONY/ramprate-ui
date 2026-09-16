import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireArtifactAdmin } from "@/lib/artifact-auth";
import { writeClient } from "@/lib/sanity/write-client";
import {
  getArtifactById,
  htmlAssetField,
  slugExists,
  slugify,
  uploadHtmlAsset,
  validateHtmlSize,
  validateSlug,
} from "@/lib/artifacts";

// The admin list intentionally omits `html` for performance (see
// listArtifacts) - the edit form fetches the real content, resolved from
// the Sanity file asset, through this single-artifact endpoint instead.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauthorized = await requireArtifactAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const artifact = await getArtifactById(id);
  if (!artifact) {
    return NextResponse.json(
      { ok: false, error: "Not found." },
      { status: 404 },
    );
  }
  return NextResponse.json({ ok: true, artifact });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauthorized = await requireArtifactAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const existing = await getArtifactById(id);
  if (!existing) {
    return NextResponse.json(
      { ok: false, error: "Not found." },
      { status: 404 },
    );
  }

  const body = await req.json().catch(() => null);
  const patch: Record<string, unknown> = {};
  const unsetFields: string[] = [];
  const oldSlug = existing.slug;
  let newSlug = oldSlug;

  if (typeof body?.title === "string" && body.title.trim()) {
    patch.title = body.title.trim();
  }
  if (typeof body?.description === "string") {
    patch.description = body.description.trim() || undefined;
  }
  if (typeof body?.html === "string" && body.html.trim()) {
    const sizeError = validateHtmlSize(body.html);
    if (sizeError) {
      return NextResponse.json({ ok: false, error: sizeError }, { status: 400 });
    }
    const assetId = await uploadHtmlAsset(body.html, oldSlug);
    patch.htmlAsset = htmlAssetField(assetId);
    // Superseded by the freshly-uploaded asset above - clear the legacy
    // inline field so resolveHtml() never has stale content to fall back
    // to once an artifact has moved to asset-based storage.
    unsetFields.push("html");
  }
  if (typeof body?.slug === "string" && body.slug.trim()) {
    newSlug = slugify(body.slug);
    const slugError = validateSlug(newSlug);
    if (slugError) {
      return NextResponse.json(
        { ok: false, error: slugError },
        { status: 400 },
      );
    }
    if (newSlug !== oldSlug && (await slugExists(newSlug, id))) {
      return NextResponse.json(
        {
          ok: false,
          error: `The slug "${newSlug}" is already in use by another artifact.`,
        },
        { status: 409 },
      );
    }
    patch.slug = { _type: "slug", current: newSlug };
  }
  if (body?.status === "published" || body?.status === "draft") {
    patch.status = body.status;
    if (body.status === "published" && existing.status !== "published") {
      patch.publishedAt = new Date().toISOString();
    }
  }

  let patchBuilder = writeClient.patch(id).set(patch);
  if (unsetFields.length) patchBuilder = patchBuilder.unset(unsetFields);
  await patchBuilder.commit();

  revalidatePath("/artifacts");
  revalidatePath(`/artifacts/${oldSlug}`);
  if (newSlug !== oldSlug) revalidatePath(`/artifacts/${newSlug}`);

  return NextResponse.json({ ok: true, slug: newSlug });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauthorized = await requireArtifactAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const existing = await getArtifactById(id);
  if (!existing) {
    return NextResponse.json(
      { ok: false, error: "Not found." },
      { status: 404 },
    );
  }

  await writeClient.delete(id);

  revalidatePath("/artifacts");
  revalidatePath(`/artifacts/${existing.slug}`);

  return NextResponse.json({ ok: true });
}
