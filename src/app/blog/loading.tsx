export default function BlogLoading() {
  return (
    <div style={{background: 'var(--dark)', minHeight: '100vh'}}>

      {/* Hero skeleton */}
      <section className="pt-32 pb-14 sm:pb-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="h-3 w-16 rounded-full animate-pulse mb-5" style={{background: 'rgba(212,168,67,0.2)'}} />
          <div className="h-12 sm:h-16 w-36 rounded-lg animate-pulse mb-4" style={{background: 'rgba(255,255,255,0.08)'}} />
          <div className="h-4 w-72 rounded-full animate-pulse" style={{background: 'rgba(255,255,255,0.05)'}} />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-24">

        {/* Category filter skeleton */}
        <div
          className="relative pt-6 mb-10 pb-8"
          style={{borderBottom: '1px solid rgba(255,255,255,0.07)'}}
        >
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-1 pb-1">
            {[50, 38, 90, 64, 76, 52, 68, 82, 58].map((w, i) => (
              <div
                key={i}
                className="shrink-0 h-8 rounded-full animate-pulse"
                style={{width: `${w}px`, background: 'rgba(255,255,255,0.07)', animationDelay: `${i * 60}ms`}}
              />
            ))}
          </div>
        </div>

        {/* Cards grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({length: 9}).map((_, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                animationDelay: `${i * 50}ms`,
              }}
            >
              {/* Image placeholder */}
              <div
                className="h-48 w-full animate-pulse"
                style={{background: 'rgba(255,255,255,0.06)', animationDelay: `${i * 50}ms`}}
              />
              <div className="p-6 space-y-3">
                {/* Category tag */}
                <div
                  className="h-5 w-16 rounded-full animate-pulse"
                  style={{background: 'rgba(212,168,67,0.1)', animationDelay: `${i * 50 + 30}ms`}}
                />
                {/* Title lines */}
                <div className="h-5 w-full rounded animate-pulse" style={{background: 'rgba(255,255,255,0.07)'}} />
                <div className="h-5 w-3/4 rounded animate-pulse" style={{background: 'rgba(255,255,255,0.05)'}} />
                {/* Excerpt lines */}
                <div className="pt-1 space-y-2">
                  <div className="h-3 w-full rounded animate-pulse" style={{background: 'rgba(255,255,255,0.04)'}} />
                  <div className="h-3 w-5/6 rounded animate-pulse" style={{background: 'rgba(255,255,255,0.04)'}} />
                  <div className="h-3 w-4/6 rounded animate-pulse" style={{background: 'rgba(255,255,255,0.04)'}} />
                </div>
                {/* Date */}
                <div className="h-3 w-24 rounded animate-pulse" style={{background: 'rgba(255,255,255,0.03)'}} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
