import { client } from "@/lib/sanity/client";
import { allPostSlugsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

export const BASE_URL = "https://ramprate.com";

export type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface RegisteredRoute {
  path: string; // e.g. "/kumbaya", "/" for home
  lastModified?: Date;
  changeFrequency: ChangeFrequency;
  priority: number;
  images?: string[];
}

export function routeUrl(path: string): string {
  return path === "/" ? BASE_URL : `${BASE_URL}${path}`;
}

// XML text content can't contain a bare '&' - it must be an entity reference
// (&amp;, &lt;, ...). Sanity's CDN image URLs always carry a raw '&' in their
// query string (?w=1200&auto=format), which breaks the sitemap's XML if left
// unescaped - browsers and Search Console both reject the feed at that point.
function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;");
}

// Every real, static (non-CMS-slug) public route on ramprate.com. This is the
// single source of truth consumed by both src/app/sitemap.ts and the traffic
// reporting system (src/lib/reports/*) - a route added here is automatically
// picked up by both, so there's nothing extra to remember when a new page
// ships.
const STATIC_ROUTES: RegisteredRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/expertise", changeFrequency: "monthly", priority: 0.8 },
  { path: "/proof", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/impactsoul", changeFrequency: "monthly", priority: 0.7 },
  { path: "/sourcing", changeFrequency: "monthly", priority: 0.8 },
  { path: "/process", changeFrequency: "monthly", priority: 0.7 },
  { path: "/growth", changeFrequency: "monthly", priority: 0.7 },
  { path: "/howwework", changeFrequency: "monthly", priority: 0.7 },
  { path: "/champions", changeFrequency: "monthly", priority: 0.7 },
  { path: "/careers", changeFrequency: "monthly", priority: 0.6 },
  { path: "/values", changeFrequency: "monthly", priority: 0.6 },
  { path: "/web3", changeFrequency: "monthly", priority: 0.6 },
  { path: "/torque", changeFrequency: "monthly", priority: 0.7 },
  {
    path: "/service-provider-intelligence-index",
    changeFrequency: "monthly",
    priority: 0.6,
  },
  { path: "/biochain", changeFrequency: "monthly", priority: 0.7 },
  {
    path: "/biochain/supplier-intake",
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    path: "/biochain/buyer-intake",
    changeFrequency: "monthly",
    priority: 0.6,
  },
  { path: "/biochain/process", changeFrequency: "monthly", priority: 0.6 },
  { path: "/sourcing/process", changeFrequency: "monthly", priority: 0.6 },
  { path: "/payments-advisory", changeFrequency: "monthly", priority: 0.7 },
  {
    path: "/payments-advisory/intel",
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    path: "/payments-advisory/intake",
    changeFrequency: "monthly",
    priority: 0.6,
  },
  { path: "/aidoc-ownership-brief", changeFrequency: "monthly", priority: 0.6 },
  { path: "/talk-to-us", changeFrequency: "monthly", priority: 0.7 },
  { path: "/kumbaya", changeFrequency: "monthly", priority: 0.7 },
  { path: "/thinking", changeFrequency: "weekly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.9 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/search", changeFrequency: "monthly", priority: 0.5 },
];

// Flow Circuit - static/public routes only, AND only the ones whose own
// `alternates.canonical` self-references ramprate.com. ~26 other /flow/*
// pages (pricing, assessment, testimonials, coaching, etc.) deliberately set
// their canonical to https://flow.tonygreenberg.com/... - listing those same
// URLs in the sitemap would contradict that canonical, so they're excluded
// there too. See also robots.ts, which excludes per-user/per-token result
// links (360, 360-results, consciousness/[id], family-360, peer-review,
// soulprint/report, team/[domain]) and /flow/admin + /flow/peer-assessment.
//
// Kept separate from STATIC_ROUTES (rather than merged) so the traffic
// reporting system can cleanly exclude this whole product with
// isFlowRoute() - Flow Circuit is a distinct product with its own owner and
// its own analytics story, not part of RampRate's/ImpactSoul's own traffic.
const FLOW_ROUTES: RegisteredRoute[] = [
  { path: "/flow", changeFrequency: "weekly", priority: 0.8 },
  { path: "/flow/bio", changeFrequency: "monthly", priority: 0.5 },
  { path: "/flow/combined-report", changeFrequency: "monthly", priority: 0.4 },
  { path: "/flow/compute-core", changeFrequency: "monthly", priority: 0.5 },
  {
    path: "/flow/conductor-playbook",
    changeFrequency: "monthly",
    priority: 0.4,
  },
  {
    path: "/flow/credibility-timeline",
    changeFrequency: "monthly",
    priority: 0.4,
  },
  { path: "/flow/efficacy", changeFrequency: "monthly", priority: 0.4 },
  { path: "/flow/find-your-path", changeFrequency: "monthly", priority: 0.5 },
  { path: "/flow/inspirations", changeFrequency: "monthly", priority: 0.4 },
  { path: "/flow/intel", changeFrequency: "monthly", priority: 0.4 },
  { path: "/flow/journey", changeFrequency: "monthly", priority: 0.4 },
  { path: "/flow/ma-playbook", changeFrequency: "monthly", priority: 0.4 },
  { path: "/flow/magic-questions", changeFrequency: "monthly", priority: 0.4 },
  { path: "/flow/origin-story", changeFrequency: "monthly", priority: 0.4 },
  { path: "/flow/protocol", changeFrequency: "monthly", priority: 0.4 },
  {
    path: "/flow/relationship-calculator",
    changeFrequency: "monthly",
    priority: 0.5,
  },
  { path: "/flow/sample-reports", changeFrequency: "monthly", priority: 0.5 },
  { path: "/flow/science", changeFrequency: "monthly", priority: 0.5 },
  { path: "/flow/team-builder", changeFrequency: "monthly", priority: 0.4 },
  { path: "/flow/why-teams-fail", changeFrequency: "monthly", priority: 0.4 },

  // login/signup/forgot-password/reset-password are also excluded: they're
  // zero-content auth forms with no unique metadata (now noindex - see their
  // page.tsx files) and have no SEO value in a public sitemap or traffic
  // report.
];

export function isFlowRoute(path: string): boolean {
  return path === "/flow" || path.startsWith("/flow/");
}

interface PostSlugDoc {
  slug: { current: string };
  section?: string;
  publishedAt?: string;
  _updatedAt?: string;
  mainImage?: Parameters<typeof urlFor>[0];
}

// Note: intentionally not iterating Sanity's generic "page" documents here.
// That document type has no matching `/[slug]/page.tsx` catch-all route -
// it's only used for SEO/content lookups on specific hardcoded pages - so
// mapping every doc's slug to a route produced both duplicates of routes
// already listed above and routes for slugs with no real page (404s), e.g.
// leftover WordPress migration docs like "purpose-promise" and
// "our-process". Every real static route is already listed explicitly
// above.
//
// Route each post under its real section path so this matches where the
// page is actually served (and its canonical URL): thinking posts ->
// /thinking, everything else -> /blog.
function postToRoute(p: PostSlugDoc): RegisteredRoute {
  return {
    path:
      p.section === "thinking"
        ? `/thinking/${p.slug.current}`
        : `/blog/${p.slug.current}`,
    ...((p._updatedAt || p.publishedAt) && {
      lastModified: new Date(p._updatedAt || p.publishedAt!),
    }),
    changeFrequency: "monthly",
    priority: 0.6,
    ...(p.mainImage && {
      images: [escapeXml(urlFor(p.mainImage).width(1200).url())],
    }),
  };
}

// /blog/category/[slug] is a permanentRedirect() to /blog?category=X, not a
// real rendered page - it never returns 200, so it never belongs in this
// registry.

export async function getRegisteredRoutes(): Promise<RegisteredRoute[]> {
  const posts: PostSlugDoc[] = await client.fetch(allPostSlugsQuery);
  return [...STATIC_ROUTES, ...FLOW_ROUTES, ...posts.map(postToRoute)];
}

// The routes RampRate's own traffic report should cover: everything except
// the separate Flow Circuit product (see isFlowRoute above).
export async function getReportableRoutes(): Promise<RegisteredRoute[]> {
  const routes = await getRegisteredRoutes();
  return routes.filter((r) => !isFlowRoute(r.path));
}
