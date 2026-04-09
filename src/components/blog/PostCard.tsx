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
    <article
      className="rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-2px]"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
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
        <Link href={`/blog/${post.slug?.current}`} className="block h-40 sm:h-48 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, oklch(0.14 0.03 260) 0%, oklch(0.18 0.04 280) 50%, oklch(0.14 0.02 240) 100%)' }}>
          {/* Decorative rings */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-10" style={{ border: '1px solid oklch(0.82 0.15 75)', background: 'transparent' }} />
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-15" style={{ border: '1px solid oklch(0.82 0.15 75)', background: 'transparent' }} />
          <div className="absolute top-4 -left-6 w-20 h-20 rounded-full opacity-8" style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'transparent' }} />
          {/* Amber glow */}
          <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: 'oklch(0.82 0.15 75)', filter: 'blur(24px)' }} />
          {/* Category label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.25em] px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(212,168,67,0.12)', color: 'oklch(0.82 0.15 75)', border: '1px solid rgba(212,168,67,0.2)', fontFamily: 'var(--font-mono)' }}
            >
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
                href={`/blog/category/${cat.slug?.current}`}
                className="text-[10px] font-semibold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full transition-opacity hover:opacity-70"
                style={{
                  background: 'rgba(212,168,67,0.12)',
                  color: 'var(--gold)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {cat.title}
              </Link>
            ))}
          </div>
        )}
        <h3
          className="text-base font-bold text-white mb-2 leading-snug"
          style={{fontFamily: 'var(--font-display)'}}
        >
          <Link href={`/blog/${post.slug?.current}`} className="hover:opacity-80 transition-opacity">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && (
          <p
            className="text-sm mb-4 line-clamp-3 leading-relaxed"
            style={{color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)'}}
          >
            {post.excerpt}
          </p>
        )}
        {date && (
          <p
            className="text-xs font-medium"
            style={{
              color: 'rgba(255,255,255,0.25)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {date}
          </p>
        )}
      </div>
    </article>
  )
}
