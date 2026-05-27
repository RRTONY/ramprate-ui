import {createClient, type QueryParams} from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xdo1fb5d',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-03-05',
  useCdn: false,
  stega: false,
})

// Typed fetch wrapper with Next.js ISR cache + tag-based revalidation.
// Use this instead of client.fetch() in all server components.
export async function sanityFetch<T = unknown>({
  query,
  params = {},
  tags = [],
  revalidate = 60,
}: {
  query: string
  params?: QueryParams
  tags?: string[]
  revalidate?: number | false
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate,
      tags: ['sanity', ...tags],
    },
  })
}
