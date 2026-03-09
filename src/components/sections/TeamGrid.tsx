import SanityImage from '@/components/shared/SanityImage'

interface Member {
  name?: string
  role?: string
  photo?: any
  linkedin?: string
  slug?: {current: string}
}

interface TeamGridProps {
  heading?: string
  members?: Member[]
}

export default function TeamGrid({heading, members}: TeamGridProps) {
  if (!members?.length) return null

  return (
    <section className="py-24" style={{background: 'var(--dark-mid)', color: '#fff'}}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {heading && (
          <div className="mb-14 text-center">
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-3"
              style={{color: 'var(--gold)', fontFamily: 'var(--font-body)'}}
            >
              The Team
            </p>
            <h2
              className="font-bold text-white"
              style={{fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)'}}
            >
              {heading}
            </h2>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member, i) => (
            <div key={i} className="text-center">
              {member.photo && (
                <div className="mb-5 mx-auto w-36 h-36 rounded-full overflow-hidden ring-2 ring-white/10">
                  <SanityImage
                    image={member.photo}
                    alt={member.name || ''}
                    width={144}
                    height={144}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h3
                className="text-base font-bold text-white mb-1"
                style={{fontFamily: 'var(--font-display)'}}
              >
                {member.name}
              </h3>
              <p
                className="text-sm mb-3"
                style={{color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)'}}
              >
                {member.role}
              </p>
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
                  style={{color: 'var(--gold)', fontFamily: 'var(--font-body)'}}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
