import { NextRequest, NextResponse } from "next/server";
import { sanityFetch } from "@/lib/sanity/client";
import { searchPostsQuery } from "@/lib/sanity/queries";
import { buildGroqSearchTerm } from "@/lib/search";
import { matchSitePages } from "@/lib/site-pages";

interface SanityPost {
  _id: string;
  title?: string;
  slug?: { current: string };
  excerpt?: string;
  section?: string;
}

// Lightweight typeahead used by SearchInput/HeaderSearch as the user types -
// trimmed fields, small result counts. The full /search page (Server
// Component) does its own richer Sanity fetch for the actual results page;
// this route exists only for the fast live-suggestions dropdown.
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() || "";

  if (q.length < 2) {
    return NextResponse.json({ pages: [], posts: [] });
  }

  const pages = matchSitePages(q, 4).map((p) => ({
    title: p.title,
    path: p.path,
    description: p.description,
  }));

  let posts: SanityPost[] = [];
  try {
    posts =
      (await sanityFetch<SanityPost[]>({
        query: searchPostsQuery,
        params: { q: buildGroqSearchTerm(q) },
        tags: ["posts"],
        revalidate: 30,
      })) ?? [];
  } catch {
    posts = [];
  }

  return NextResponse.json({
    pages,
    posts: posts.slice(0, 4).map((p) => ({
      title: p.title,
      slug: p.slug?.current,
      section: p.section,
      excerpt: p.excerpt,
    })),
  });
}
