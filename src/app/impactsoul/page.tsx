import {client} from '@/lib/sanity/client'
import {pageBySlugQuery} from '@/lib/sanity/queries'
import PageBuilder from '@/components/shared/PageBuilder'
import type {Metadata} from 'next'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch(pageBySlugQuery, {slug: 'impactsoul'})
  return {
    title: page?.seo?.metaTitle || page?.title || 'ImpactSoul',
    description: page?.seo?.metaDescription || 'RampRate ImpactSoul Initiative',
  }
}

export default async function ImpactSoulPage() {
  const page = await client.fetch(pageBySlugQuery, {slug: 'impactsoul'})

  if (!page) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">ImpactSoul</h1>
        <p className="text-gray-600">Create a page with slug &quot;impactsoul&quot; in Sanity Studio.</p>
      </div>
    )
  }

  return <PageBuilder sections={page.pageBuilder} />
}
