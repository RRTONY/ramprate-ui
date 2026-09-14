import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireArtifactAdmin } from "@/lib/artifact-auth";
import { writeClient } from "@/lib/sanity/write-client";
import {
  getArtifactById,
  slugExists,
  slugify,
  validateSlug,
} from "@/lib/artifacts";

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
  const oldSlug = existing.slug;
  let newSlug = oldSlug;

  if (typeof body?.title === "string" && body.title.trim()) {
    patch.title = body.title.trim();
  }
  if (typeof body?.description === "string") {
    patch.description = body.description.trim() || undefined;
  }
  if (typeof body?.html === "string" && body.html.trim()) {
    patch.html = body.html;
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

  await writeClient.patch(id).set(patch).commit();

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
