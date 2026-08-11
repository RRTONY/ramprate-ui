import Link from 'next/link'
import SanityImage from '@/components/shared/SanityImage'

interface Category {
  title?: string
  slug?: {current: string}
}

interface PostCardProps {
  post: {
    _id?: string
    title?: string
    slug?: {current: string}
    publishedAt?: string
    excerpt?: string
    mainImage?: any
    categories?: Category[]
  }
}

export default function PostCard({post}: PostCardProps) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <article className="rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-2px] bg-white/3 border border-white/6">
      {post.mainImage ? (
        <Link href={`/blog/${post.slug?.current}`} className="block overflow-hidden">
          <SanityImage
            image={post.mainImage}
            alt={post.title || ''}
            width={600}
            height={340}
            className="w-full h-40 sm:h-48 object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
          />
        </Link>
      ) : (
        <Link href={`/blog/${post.slug?.current}`} className="block h-40 sm:h-48 relative overflow-hidden bg-[linear-gradient(135deg,oklch(0.14_0.03_260)_0%,oklch(0.18_0.04_280)_50%,oklch(0.14_0.02_240)_100%)]">
          {/* Decorative rings */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-10 border border-amber bg-transparent" />
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-15 border border-amber bg-transparent" />
          <div className="absolute top-4 -left-6 w-20 h-20 rounded-full opacity-8 border border-white/15 bg-transparent" />
          {/* Amber glow */}
          <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full opacity-10 bg-amber blur-[24px]" />
          {/* Category label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] px-3 py-1.5 rounded-full bg-gold/12 text-amber border border-gold/20">
              {post.categories?.[0]?.title ?? 'RampRate'}
            </span>
          </div>
        </Link>
      )}
      <div className="p-6">
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.map((cat) => (
              <Link
                key={cat.slug?.current}
                href={`/blog?category=${cat.slug?.current}`}
                className="font-body text-[10px] font-semibold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full transition-opacity hover:opacity-70 bg-gold/12 text-gold"
              >
                {cat.title}
              </Link>
            ))}
          </div>
        )}
        <h3 className="font-display text-base font-bold text-white mb-2 leading-snug">
          <Link href={`/blog/${post.slug?.current}`} className="hover:opacity-80 transition-opacity">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && (
          <p className="font-body text-sm mb-4 line-clamp-3 leading-relaxed text-white/45">
            {post.excerpt}
          </p>
        )}
        {date && (
          <p className="font-mono text-xs font-medium text-white/25">
            {date}
          </p>
        )}
      </div>
    </article>
  )
}
