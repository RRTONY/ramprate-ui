interface JobCardProps {
  title: string
  department?: string
  location?: string
  type?: string
  applyUrl: string
}

export default function JobCard({title, department, location, type, applyUrl}: JobCardProps) {
  return (
    <div className="glass-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
      <div className="flex-1">
        <div className="flex flex-wrap gap-2 mb-3">
          {department && (
            <span
              className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{background: 'rgba(212,168,67,0.15)', color: 'var(--gold)', fontFamily: 'var(--font-mono)'}}
            >
              {department}
            </span>
          )}
          {type && (
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)'}}
            >
              {type}
            </span>
          )}
          {location && (
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1"
              style={{background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)'}}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {location}
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-white" style={{fontFamily: 'var(--font-display)'}}>
          {title}
        </h3>
      </div>
      <a
        href={applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-sm transition-opacity hover:opacity-90 shrink-0"
        style={{background: 'var(--gold)', color: 'var(--dark)', fontFamily: 'var(--font-body)'}}
      >
        Apply Now
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </a>
    </div>
  )
}
