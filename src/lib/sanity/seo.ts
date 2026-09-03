import type { Metadata } from "next";
import { sanityFetch } from "./client";
import { pageSeoQuery } from "./queries";
import { urlFor } from "./image";

export type SeoFields = {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ogImage?: any;
};

export async function getPageSeo(route: string) {
  return sanityFetch<{ seo?: SeoFields } | null>({
    query: pageSeoQuery,
    params: { route },
    tags: ["pageSeo"],
    revalidate: 60,
  });
}

// The root layout's title template ("%s | RampRate") appends the site name to
// every page title automatically. Editors sometimes also type "| RampRate"
// directly into a Sanity metaTitle field out of habit, which then gets the
// suffix appended a second time (e.g. "Post Title | RampRate | RampRate").
// Strip a trailing site-name suffix from Sanity-authored titles so the
// template only ever adds it once.
const SITE_NAME = "RampRate";
const SITE_NAME_SUFFIX_RE = new RegExp(`\\s*[|\\-–—]\\s*${SITE_NAME}\\s*$`, "i");

export function stripSiteNameSuffix(title?: string): string | undefined {
  if (!title) return title;
  const stripped = title.replace(SITE_NAME_SUFFIX_RE, "").trim();
  return stripped || title;
}

// Overlays Sanity-authored SEO fields onto a page's hardcoded fallback
// metadata. Only fields an editor actually filled in are overridden -
// everything else (icons, robots, etc.) keeps flowing from the fallback.
export function withSeoOverrides(
  fallback: Metadata,
  seo?: SeoFields | null,
): Metadata {
  if (!seo) return fallback;

  const title = stripSiteNameSuffix(seo.metaTitle) || fallback.title;
  const description = seo.metaDescription || fallback.description;
  const keywords = seo.keywords?.length ? seo.keywords : fallback.keywords;
  const ogImages = seo.ogImage
    ? [urlFor(seo.ogImage).width(1200).height(630).url()]
    : undefined;

  return {
    ...fallback,
    title,
    description,
    keywords,
    openGraph: {
      ...fallback.openGraph,
      title: stripSiteNameSuffix(seo.metaTitle) || fallback.openGraph?.title,
      description: seo.metaDescription || fallback.openGraph?.description,
      images: ogImages || fallback.openGraph?.images,
    },
  };
}
