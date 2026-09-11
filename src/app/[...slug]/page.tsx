import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  PortableText,
  portableTextComponents,
} from "@/lib/content/portable-text";
import { getPublicPageByRoute } from "@/lib/content/client";
import { getPageSeo, withSeoOverrides } from "@/lib/content/seo";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

type PageParams = { slug: string[] };

function toRoute(slug: string[]) {
  return `/${slug.map(encodeURIComponent).join("/")}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const route = toRoute(slug);
  const [page, pageSeo] = await Promise.all([
    getPublicPageByRoute(route),
    getPageSeo(route),
  ]);
  if (!page) return {};
  const pageTitle =
    typeof page.title === "string" ? page.title : "RampRate resources";

  return withSeoOverrides(
    {
      title: pageTitle,
      description: `RampRate advisory information: ${pageTitle}.`,
      alternates: { canonical: route },
      robots: { index: true, follow: true },
    },
    pageSeo?.seo,
  );
}

export default async function ManagedContentPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const route = toRoute(slug);
  const [page, pageSeo] = await Promise.all([
    getPublicPageByRoute(route),
    getPageSeo(route),
  ]);
  if (!page) notFound();

  const pageTitle = typeof page.title === "string" ? page.title : "RampRate";
  const content = Array.isArray(page.content) ? page.content : [];

  return (
    <main className="blog-blue min-h-screen pt-32 pb-24">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: pageTitle, url: `https://ramprate.com${route}` },
        ])}
      />
      {isJsonLd(pageSeo?.jsonLd) && <JsonLd data={pageSeo.jsonLd} />}
      <article className="mx-auto max-w-4xl px-5 sm:px-8">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          RampRate resource
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white sm:text-6xl">
          {pageTitle}
        </h1>
        <div className="prose mt-10 max-w-none text-white/75">
          <PortableText value={content} components={portableTextComponents} />
        </div>
      </article>
    </main>
  );
}

function isJsonLd(
  value: unknown,
): value is Record<string, unknown> | Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value.every((item) =>
      Boolean(item && typeof item === "object" && !Array.isArray(item)),
    );
  }
  return Boolean(value && typeof value === "object");
}
