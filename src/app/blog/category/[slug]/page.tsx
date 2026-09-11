import { notFound, permanentRedirect } from "next/navigation";
import { client } from "@/lib/content/client";
import { categoryBySlugQuery } from "@/lib/content/queries";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await client.fetch(categoryBySlugQuery, { slug });
  if (!category) notFound();
  permanentRedirect(`/blog?category=${slug}`);
}
