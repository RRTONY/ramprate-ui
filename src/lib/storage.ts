import { randomUUID } from "node:crypto";

function getForgeConfig() {
  const forgeUrl = process.env.BUILT_IN_FORGE_API_URL;
  const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;

  if (!forgeUrl || !forgeKey) {
    throw new Error("Managed storage is not configured for this environment.");
  }

  return { forgeKey, forgeUrl: forgeUrl.replace(/\/+$/, "") };
}

function normalizeKey(relativeKey: string) {
  return relativeKey.replace(/^\/+/, "");
}

function withUniqueSuffix(relativeKey: string) {
  const key = normalizeKey(relativeKey);
  const suffix = randomUUID().replace(/-/g, "").slice(0, 12);
  const dotIndex = key.lastIndexOf(".");

  return dotIndex === -1
    ? `${key}-${suffix}`
    : `${key.slice(0, dotIndex)}-${suffix}${key.slice(dotIndex)}`;
}

export async function storagePut(
  relativeKey: string,
  data: Uint8Array,
  contentType: string,
): Promise<{ key: string; url: string }> {
  const { forgeKey, forgeUrl } = getForgeConfig();
  const key = withUniqueSuffix(relativeKey);
  const presignUrl = new URL("v1/storage/presign/put", `${forgeUrl}/`);
  presignUrl.searchParams.set("path", key);

  const presignResponse = await fetch(presignUrl, {
    headers: { Authorization: `Bearer ${forgeKey}` },
  });

  if (!presignResponse.ok) {
    throw new Error("Managed storage could not prepare the upload.");
  }

  const { url: uploadUrl } = (await presignResponse.json()) as { url?: string };
  if (!uploadUrl) {
    throw new Error("Managed storage returned an invalid upload target.");
  }

  const uploadResponse = await fetch(uploadUrl, {
    body: Buffer.from(data),
    headers: { "Content-Type": contentType },
    method: "PUT",
  });

  if (!uploadResponse.ok) {
    throw new Error("Managed storage could not upload the attachment.");
  }

  return { key, url: `/manus-storage/${key}` };
}
