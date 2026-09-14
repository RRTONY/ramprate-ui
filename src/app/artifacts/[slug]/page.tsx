import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findArtifactBySlug } from "@/lib/artifacts";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artifact = await findArtifactBySlug(slug, { publishedOnly: true });
  if (!artifact) return {};

  const title = artifact.title;
  const description =
    artifact.description || `${artifact.title} - a RampRate artifact.`;
  const url = `https://ramprate.com/artifacts/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: ["/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}

export default async function ArtifactPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artifact = await findArtifactBySlug(slug, { publishedOnly: true });

  if (!artifact) notFound();

  return (
    <iframe
      // Deliberately no `allow-same-origin`: the pasted HTML runs in a
      // unique, opaque origin with no access to ramprate.com cookies,
      // session, or DOM - it cannot compromise the main site or the
      // Artifact Manager's own auth even if the artifact contains
      // arbitrary/malicious JavaScript. allow-scripts/forms/popups/modals
      // keep real interactive artifacts (buttons, forms, alerts, links
      // that open in a new tab) working normally.
      sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"
      srcDoc={artifact.html}
      title={artifact.title}
      style={{
        border: "none",
        display: "block",
        width: "100%",
        height: "100vh",
      }}
    />
  );
}
