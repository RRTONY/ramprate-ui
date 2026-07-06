import {client} from '@/lib/sanity/client'
import {allPageSlugsQuery, allPostSlugsQuery, allCategorySlugsQuery} from '@/lib/sanity/queries'
import {urlFor} from '@/lib/sanity/image'
import type {MetadataRoute} from 'next'

const BASE_URL = 'https://ramprate.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, posts, categories] = await Promise.all([
    client.fetch(allPageSlugsQuery),
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
    {url: `${BASE_URL}/aidoc-ownership-brief`, changeFrequency: 'monthly', priority: 0.6},
    {url: `${BASE_URL}/thinking`, changeFrequency: 'weekly', priority: 0.7},
    {url: `${BASE_URL}/blog`, changeFrequency: 'weekly', priority: 0.9},
    {url: `${BASE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3},
    {url: `${BASE_URL}/terms`, changeFrequency: 'yearly', priority: 0.3},
    {url: `${BASE_URL}/search`, changeFrequency: 'monthly', priority: 0.5},
  ]

  const pageRoutes: MetadataRoute.Sitemap = pages
    .filter((p: {slug: {current: string}}) => !['home'].includes(p.slug.current))
    .map((p: {slug: {current: string}; _updatedAt?: string}) => ({
      url: `${BASE_URL}/${p.slug.current}`,
      ...(p._updatedAt && {lastModified: new Date(p._updatedAt)}),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

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
      ...(p.mainImage && {images: [urlFor(p.mainImage).width(1200).url()]}),
    }),
  )

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c: {slug: {current: string}; _updatedAt?: string}) => ({
    url: `${BASE_URL}/blog/category/${c.slug.current}`,
    ...(c._updatedAt && {lastModified: new Date(c._updatedAt)}),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  return [...staticRoutes, ...pageRoutes, ...postRoutes, ...categoryRoutes]
}
