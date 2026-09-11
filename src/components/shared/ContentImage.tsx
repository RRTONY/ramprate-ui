import Image from "next/image";
import { urlFor } from "@/lib/content/image";

interface ContentImageProps {
  image: unknown;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}

function mediaLabel(image: unknown) {
  if (!image || typeof image !== "object") return "RampRate content image";
  const record = image as Record<string, unknown>;
  const candidates = [record.alt, record.title, record.altText];
  const label = candidates.find(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0,
  );
  return label?.trim() || "RampRate content image";
}

export default function ContentImage({
  image,
  alt,
  width = 800,
  height = 450,
  className,
  priority = false,
  fill = false,
}: ContentImageProps) {
  if (!image) return null;

  const src = urlFor(image).width(width).height(height).url();
  const alternative = alt ?? mediaLabel(image);
  const title = alternative || undefined;

  if (fill) {
    return (
      <Image
        src={src}
        alt={alternative}
        title={title}
        fill
        className={className}
        priority={priority}
        unoptimized
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alternative}
      title={title}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized
    />
  );
}
