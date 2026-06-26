export default function SearchLoading() {
  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh' }}>

      {/* ── HERO SKELETON ── */}
      <section className="relative pt-28 sm:pt-36 pb-12 sm:pb-16 overflow-hidden">
        {/* Badge */}
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div
            className="h-3 w-14 rounded-full mb-4 animate-pulse"
            style={{ background: 'rgba(212,168,67,0.2)' }}
          />
          {/* Heading */}
          <div
            className="h-9 sm:h-12 w-72 sm:w-96 rounded-lg mb-8 animate-pulse"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          />
          {/* Search input */}
          <div
            className="h-14 w-full rounded-xl animate-pulse"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          />
        </div>
      </section>

      {/* ── RESULTS SKELETON ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-24">

        {/* Section label */}
        <div className="flex items-center justify-between mb-6">
          <div
            className="h-5 w-32 rounded animate-pulse"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          />
          <div
            className="h-3 w-16 rounded animate-pulse"
            style={{ background: 'rgba(212,168,67,0.15)' }}
          />
        </div>

        {/* Card grid — 6 skeleton cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} delay={i * 60} />
          ))}
        </div>
      </div>
    </div>
  )
}

function SkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Thumbnail */}
      <div
        className="h-40 sm:h-48 animate-pulse"
        style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))' }}
      />

      {/* Body */}
      <div className="p-5 sm:p-6">
        {/* Badges row */}
        <div className="flex gap-2 mb-3">
          <div
            className="h-4 w-12 rounded-full animate-pulse"
            style={{ background: 'rgba(212,168,67,0.15)', animationDelay: `${delay + 40}ms` }}
          />
          <div
            className="h-4 w-16 rounded-full animate-pulse"
            style={{ background: 'rgba(255,255,255,0.06)', animationDelay: `${delay + 80}ms` }}
          />
        </div>

        {/* Title lines */}
        <div
          className="h-5 w-full rounded mb-1.5 animate-pulse"
          style={{ background: 'rgba(255,255,255,0.09)', animationDelay: `${delay + 60}ms` }}
        />
        <div
          className="h-5 w-3/4 rounded mb-4 animate-pulse"
          style={{ background: 'rgba(255,255,255,0.07)', animationDelay: `${delay + 80}ms` }}
        />

        {/* Excerpt lines */}
        <div className="space-y-1.5 mb-4">
          {[100, 90, 70].map((w, j) => (
            <div
              key={j}
              className="h-3.5 rounded animate-pulse"
              style={{
                width: `${w}%`,
                background: `rgba(255,255,255,${0.05 - j * 0.01})`,
                animationDelay: `${delay + 100 + j * 40}ms`,
              }}
            />
          ))}
        </div>

        {/* Date */}
        <div
          className="h-3 w-24 rounded animate-pulse"
          style={{ background: 'rgba(255,255,255,0.04)', animationDelay: `${delay + 180}ms` }}
        />
      </div>
    </div>
  )
}
