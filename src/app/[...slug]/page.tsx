import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  PortableText,
  portableTextComponents,
} from "@/lib/content/portable-text";
import { getPublicPageByRoute } from "@/lib/content/client";
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
  const page = await getPublicPageByRoute(route);
  if (!page) return {};

  const seo = page.seo as Record<string, unknown> | undefined;
  const metaTitle =
    typeof seo?.metaTitle === "string" ? seo.metaTitle : page.title;
  const description =
    typeof seo?.metaDescription === "string"
      ? seo.metaDescription
      : `RampRate advisory information: ${page.title ?? "Resources"}.`;

  return {
    title: metaTitle as string,
    description,
    alternates: { canonical: route },
    robots: { index: true, follow: true },
  };
}

export default async function ManagedContentPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const route = toRoute(slug);
  const page = await getPublicPageByRoute(route);
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
