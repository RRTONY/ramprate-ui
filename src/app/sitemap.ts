import {client} from '@/lib/sanity/client'
import {allPostSlugsQuery, allCategorySlugsQuery} from '@/lib/sanity/queries'
import {urlFor} from '@/lib/sanity/image'
import type {MetadataRoute} from 'next'

const BASE_URL = 'https://ramprate.com'

// XML text content can't contain a bare '&' - it must be an entity reference
// (&amp;, &lt;, ...). Sanity's CDN image URLs always carry a raw '&' in their
// query string (?w=1200&auto=format), which breaks the sitemap's XML if left
// unescaped - browsers and Search Console both reject the feed at that point.
function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([
    client.fetch(allPostSlugsQuery),
    client.fetch(allCategorySlugsQuery),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    {url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1},
    {url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.8},
    {url: `${BASE_URL}/expertise`, changeFrequency: 'monthly', priority: 0.8},
    {url: `${BASE_URL}/proof`, changeFrequency: 'monthly', priority: 0.8},
    {url: `${BASE_URL}/contact`, changeFrequency: 'monthly', priority: 0.7},
    {url: `${BASE_URL}/impactsoul`, changeFrequency: 'monthly', priority: 0.7},
    {url: `${BASE_URL}/sourcing`, changeFrequency: 'monthly', priority: 0.8},
    {url: `${BASE_URL}/process`, changeFrequency: 'monthly', priority: 0.7},
    {url: `${BASE_URL}/growth`, changeFrequency: 'monthly', priority: 0.7},
    {url: `${BASE_URL}/howwework`, changeFrequency: 'monthly', priority: 0.7},
    {url: `${BASE_URL}/careers`, changeFrequency: 'monthly', priority: 0.6},
    {url: `${BASE_URL}/values`, changeFrequency: 'monthly', priority: 0.6},
    {url: `${BASE_URL}/web3`, changeFrequency: 'monthly', priority: 0.6},
    {url: `${BASE_URL}/private-advisory`, changeFrequency: 'monthly', priority: 0.7},
    {url: `${BASE_URL}/service-provider-intelligence-index`, changeFrequency: 'monthly', priority: 0.6},
    {url: `${BASE_URL}/biochain`, changeFrequency: 'monthly', priority: 0.7},
    {url: `${BASE_URL}/biochain/supplier-intake`, changeFrequency: 'monthly', priority: 0.6},
    {url: `${BASE_URL}/biochain/buyer-intake`, changeFrequency: 'monthly', priority: 0.6},
    {url: `${BASE_URL}/biochain/catalogue`, changeFrequency: 'monthly', priority: 0.6},
    {url: `${BASE_URL}/biochain/process`, changeFrequency: 'monthly', priority: 0.6},
    {url: `${BASE_URL}/sourcing/process`, changeFrequency: 'monthly', priority: 0.6},
    {url: `${BASE_URL}/payments-advisory`, changeFrequency: 'monthly', priority: 0.7},
    {url: `${BASE_URL}/payments-advisory/intel`, changeFrequency: 'monthly', priority: 0.6},
    {url: `${BASE_URL}/payments-advisory/intake`, changeFrequency: 'monthly', priority: 0.6},
    {url: `${BASE_URL}/aidoc-ownership-brief`, changeFrequency: 'monthly', priority: 0.6},
    {url: `${BASE_URL}/thinking`, changeFrequency: 'weekly', priority: 0.7},
    {url: `${BASE_URL}/blog`, changeFrequency: 'weekly', priority: 0.9},
    {url: `${BASE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3},
    {url: `${BASE_URL}/terms`, changeFrequency: 'yearly', priority: 0.3},
    {url: `${BASE_URL}/search`, changeFrequency: 'monthly', priority: 0.5},

    // Flow Circuit - static/public routes only. Excludes per-user/per-token
    // result links (360, 360-results, consciousness/[id], family-360,
    // peer-review, soulprint/report, team/[domain]) - see robots.ts.
    {url: `${BASE_URL}/flow`, changeFrequency: 'weekly', priority: 0.8},
    {url: `${BASE_URL}/flow/admin`, changeFrequency: 'monthly', priority: 0.3},
    {url: `${BASE_URL}/flow/alpha`, changeFrequency: 'monthly', priority: 0.4},
    {url: `${BASE_URL}/flow/assessment`, changeFrequency: 'monthly', priority: 0.6},
    {url: `${BASE_URL}/flow/bio`, changeFrequency: 'monthly', priority: 0.5},
    {url: `${BASE_URL}/flow/coaching`, changeFrequency: 'monthly', priority: 0.5},
    {url: `${BASE_URL}/flow/combined-report`, changeFrequency: 'monthly', priority: 0.4},
    {url: `${BASE_URL}/flow/compute-core`, changeFrequency: 'monthly', priority: 0.5},
    {url: `${BASE_URL}/flow/conductor-playbook`, changeFrequency: 'monthly', priority: 0.4},
    {url: `${BASE_URL}/flow/consciousness`, changeFrequency: 'monthly', priority: 0.5},
    {url: `${BASE_URL}/flow/credibility-timeline`, changeFrequency: 'monthly', priority: 0.4},
    {url: `${BASE_URL}/flow/deep-calibration`, changeFrequency: 'monthly', priority: 0.4},
    {url: `${BASE_URL}/flow/efficacy`, changeFrequency: 'monthly', priority: 0.4},
    {url: `${BASE_URL}/flow/enterprise-dashboard`, changeFrequency: 'monthly', priority: 0.4},
    {url: `${BASE_URL}/flow/family`, changeFrequency: 'monthly', priority: 0.5},
    {url: `${BASE_URL}/flow/feedback`, changeFrequency: 'monthly', priority: 0.3},
    {url: `${BASE_URL}/flow/find-your-path`, changeFrequency: 'monthly', priority: 0.5},
    {url: `${BASE_URL}/flow/forgot-password`, changeFrequency: 'yearly', priority: 0.2},
    {url: `${BASE_URL}/flow/inspirations`, changeFrequency: 'monthly', priority: 0.4},
    {url: `${BASE_URL}/flow/integrations`, changeFrequency: 'monthly', priority: 0.4},
    {url: `${BASE_URL}/flow/intel`, changeFrequency: 'monthly', priority: 0.4},
    {url: `${BASE_URL}/flow/investor-metrics`, changeFrequency: 'monthly', priority: 0.3},
    {url: `${BASE_URL}/flow/journey`, changeFrequency: 'monthly', priority: 0.4},
    {url: `${BASE_URL}/flow/login`, changeFrequency: 'yearly', priority: 0.2},
    {url: `${BASE_URL}/flow/ma-playbook`, changeFrequency: 'monthly', priority: 0.4},
    {url: `${BASE_URL}/flow/magic-questions`, changeFrequency: 'monthly', priority: 0.4},
    {url: `${BASE_URL}/flow/manager-guidebook`, changeFrequency: 'monthly', priority: 0.4},
    {url: `${BASE_URL}/flow/my-journey`, changeFrequency: 'monthly', priority: 0.3},
    {url: `${BASE_URL}/flow/origin-story`, changeFrequency: 'monthly', priority: 0.4},
    {url: `${BASE_URL}/flow/pricing`, changeFrequency: 'monthly', priority: 0.6},
    {url: `${BASE_URL}/flow/protocol`, changeFrequency: 'monthly', priority: 0.4},
    {url: `${BASE_URL}/flow/relationship-calculator`, changeFrequency: 'monthly', priority: 0.5},
    {url: `${BASE_URL}/flow/reports`, changeFrequency: 'monthly', priority: 0.3},
    {url: `${BASE_URL}/flow/research`, changeFrequency: 'monthly', priority: 0.4},
    {url: `${BASE_URL}/flow/reset-password`, changeFrequency: 'yearly', priority: 0.2},
    {url: `${BASE_URL}/flow/results`, changeFrequency: 'monthly', priority: 0.3},
    {url: `${BASE_URL}/flow/sample-reports`, changeFrequency: 'monthly', priority: 0.5},
    {url: `${BASE_URL}/flow/science`, changeFrequency: 'monthly', priority: 0.5},
    {url: `${BASE_URL}/flow/share`, changeFrequency: 'monthly', priority: 0.3},
    {url: `${BASE_URL}/flow/share-card`, changeFrequency: 'monthly', priority: 0.3},
    {url: `${BASE_URL}/flow/signup`, changeFrequency: 'yearly', priority: 0.5},
    {url: `${BASE_URL}/flow/soulprint`, changeFrequency: 'monthly', priority: 0.4},
    {url: `${BASE_URL}/flow/team-builder`, changeFrequency: 'monthly', priority: 0.4},
    {url: `${BASE_URL}/flow/team-comparison`, changeFrequency: 'monthly', priority: 0.3},
    {url: `${BASE_URL}/flow/team-dashboard`, changeFrequency: 'monthly', priority: 0.3},
    {url: `${BASE_URL}/flow/team-map`, changeFrequency: 'monthly', priority: 0.3},
    {url: `${BASE_URL}/flow/team-settings`, changeFrequency: 'monthly', priority: 0.2},
    {url: `${BASE_URL}/flow/testimonials`, changeFrequency: 'monthly', priority: 0.4},
    {url: `${BASE_URL}/flow/tribe-trial`, changeFrequency: 'monthly', priority: 0.4},
    {url: `${BASE_URL}/flow/white-label`, changeFrequency: 'monthly', priority: 0.4},
    {url: `${BASE_URL}/flow/why-teams-fail`, changeFrequency: 'monthly', priority: 0.4},
  ]

  // Note: intentionally not iterating Sanity's generic "page" documents here.
  // That document type has no matching `/[slug]/page.tsx` catch-all route - it's
  // only used for SEO/content lookups on specific hardcoded pages - so mapping
  // every doc's slug to a URL produced both duplicates of routes already listed
  // above and URLs for slugs with no real page (404s), e.g. leftover WordPress
  // migration docs like "purpose-promise" and "our-process". Every real static
  // route is already listed explicitly above.

  // Route each post under its real section path so the sitemap matches where the
  // page is actually served (and its canonical URL): thinking posts → /thinking,
  // everything else → /blog.
  const postRoutes: MetadataRoute.Sitemap = posts.map(
    (p: {
      slug: {current: string}
      section?: string
      publishedAt?: string
      _updatedAt?: string
      mainImage?: Parameters<typeof urlFor>[0]
    }) => ({
      url:
        p.section === 'thinking'
          ? `${BASE_URL}/thinking/${p.slug.current}`
          : `${BASE_URL}/blog/${p.slug.current}`,
      ...((p._updatedAt || p.publishedAt) && {lastModified: new Date(p._updatedAt || p.publishedAt!)}),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      ...(p.mainImage && {images: [escapeXml(urlFor(p.mainImage).width(1200).url())]}),
    }),
  )

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c: {slug: {current: string}; _updatedAt?: string}) => ({
    url: `${BASE_URL}/blog/category/${c.slug.current}`,
    ...(c._updatedAt && {lastModified: new Date(c._updatedAt)}),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  return [...staticRoutes, ...postRoutes, ...categoryRoutes]
}
