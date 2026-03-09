import {client} from '@/lib/sanity/client'
import {pageBySlugQuery} from '@/lib/sanity/queries'
import PageBuilder from '@/components/shared/PageBuilder'
import type {Metadata} from 'next'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch(pageBySlugQuery, {slug: 'sourcing'})
  return {
    title: page?.seo?.metaTitle || page?.title || 'Sourcing',
    description: page?.seo?.metaDescription || 'RampRate Strategic Sourcing',
  }
}

export default async function SourcingPage() {
  const page = await client.fetch(pageBySlugQuery, {slug: 'sourcing'})

  if (!page) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Sourcing</h1>
        <p className="text-gray-600">Create a page with slug &quot;sourcing&quot; in Sanity Studio.</p>
      </div>
    )
  }

  return <PageBuilder sections={page.pageBuilder} />
}
