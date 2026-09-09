type ImageSource = unknown;

function findImageUrl(source: ImageSource): string {
  if (!source || typeof source !== "object") return "";
  const image = source as { asset?: ImageSource; url?: unknown };
  if (typeof image.url === "string") return image.url;
  return findImageUrl(image.asset);
}

export function urlFor(source: ImageSource) {
  let width: number | undefined;
  let height: number | undefined;

  return {
    width(value: number) {
      width = value;
      return this;
    },
    height(value: number) {
      height = value;
      return this;
    },
    fit(_value: string) {
      return this;
    },
    crop(_value: string) {
      return this;
    },
    url() {
      const sourceUrl = findImageUrl(source);
      if (!sourceUrl) return "";
      const url = new URL(sourceUrl);
      if (width) url.searchParams.set("w", String(width));
      if (height) url.searchParams.set("h", String(height));
      return url.toString();
    },
  };
}
