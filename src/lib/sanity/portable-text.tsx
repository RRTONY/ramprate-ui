import React from 'react'
import {PortableText, type PortableTextComponents} from '@portabletext/react'
import Link from 'next/link'
import {urlFor} from './image'

// ── Helpers ───────────────────────────────────────────────────────────────────

function getYouTubeId(url: string): string | null {
  const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

function getVimeoId(url: string): string | null {
  const match = url?.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return match ? match[1] : null
}

const calloutStyles: Record<string, {bg: string; border: string; icon: string; label: string}> = {
  tip:     {bg: 'rgba(130,180,80,0.08)',  border: 'oklch(0.6 0.15 140)', icon: '💡', label: 'Tip'},
  info:    {bg: 'rgba(60,120,220,0.08)',  border: 'oklch(0.55 0.18 250)', icon: 'ℹ️', label: 'Info'},
  warning: {bg: 'rgba(220,160,0,0.08)',   border: 'oklch(0.72 0.18 80)',  icon: '⚠️', label: 'Warning'},
  success: {bg: 'rgba(40,180,100,0.08)',  border: 'oklch(0.6 0.18 160)', icon: '✅', label: 'Success'},
  error:   {bg: 'rgba(220,60,60,0.08)',   border: 'oklch(0.55 0.22 20)',  icon: '❌', label: 'Error'},
}

// ── Components ────────────────────────────────────────────────────────────────

export const portableTextComponents: PortableTextComponents = {
  types: {
    // ── Divider ───────────────────────────────────────────────────────────────
    divider: ({value}) => {
      const spacingMap: Record<string, string> = {sm: '16px', md: '32px', lg: '56px'}
      const margin = spacingMap[value?.spacing || 'md']
      return (
        <hr style={{
          border: 'none',
          borderTop: `1px ${value?.style || 'solid'} rgba(255,255,255,0.15)`,
          margin: `${margin} 0`,
        }} />
      )
    },

    // ── Spacer ────────────────────────────────────────────────────────────────
    spacer: ({value}) => {
      const heightMap: Record<string, string> = {sm: '24px', md: '48px', lg: '80px', xl: '120px'}
      return <div style={{height: heightMap[value?.height || 'md']}} aria-hidden="true" />
    },

    // ── Code Block ────────────────────────────────────────────────────────────
    codeBlock: ({value}) => {
      if (!value?.code) return null
      return (
        <figure style={{margin: '28px 0'}}>
          {value.filename && (
            <div style={{
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '6px 6px 0 0',
              padding: '6px 16px',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: 'rgba(255,255,255,0.4)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}>
              {value.filename}
            </div>
          )}
          <pre style={{
            background: 'rgba(0,0,0,0.35)',
            borderRadius: value.filename ? '0 0 6px 6px' : '6px',
            padding: 'clamp(12px, 4vw, 20px)',
            overflowX: 'auto',
            margin: 0,
            border: '1px solid rgba(255,255,255,0.06)',
            borderTop: value.filename ? 'none' : undefined,
          }}>
            <code style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              lineHeight: '1.7',
              color: 'rgba(255,255,255,0.85)',
              whiteSpace: 'pre',
            }}>
              {value.code}
            </code>
          </pre>
          {value.language && value.language !== 'text' && (
            <div style={{fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '6px', fontFamily: 'var(--font-mono)'}}>
              {value.language}
            </div>
          )}
        </figure>
      )
    },

    // ── Callout / Notice Box ──────────────────────────────────────────────────
    callout: ({value}) => {
      if (!value?.body) return null
      const s = calloutStyles[value.type || 'info'] || calloutStyles.info
      return (
        <div style={{
          background: s.bg,
          borderLeft: `3px solid ${s.border}`,
          borderRadius: '0 6px 6px 0',
          padding: '14px 18px',
          margin: '24px 0',
        }}>
          {value.title ? (
            <div style={{fontWeight: 600, marginBottom: '6px', color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-body)'}}>
              {s.icon} {value.title}
            </div>
          ) : (
            <span style={{marginRight: '8px'}}>{s.icon}</span>
          )}
          <p style={{margin: 0, color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: '1.6'}}>
            {!value.title && ''}{value.body}
          </p>
        </div>
      )
    },

    // ── Button / CTA ──────────────────────────────────────────────────────────
    button: ({value}) => {
      if (!value?.label || !value?.url) return null
      const alignMap: Record<string, string> = {left: 'flex-start', center: 'center', right: 'flex-end'}
      const justify = alignMap[value.align || 'left']

      const baseStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '12px 24px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: 600,
        fontFamily: 'var(--font-body)',
        textDecoration: 'none',
        transition: 'opacity 0.15s',
      }
      const styleMap: Record<string, React.CSSProperties> = {
        primary:   {background: 'oklch(0.55 0.15 30)', color: '#fff'},
        secondary: {background: 'transparent', border: '2px solid oklch(0.55 0.15 30)', color: 'oklch(0.82 0.15 75)'},
        ghost:     {background: 'transparent', color: 'oklch(0.82 0.15 75)', padding: '12px 0'},
      }

      return (
        <div style={{display: 'flex', justifyContent: justify, margin: '24px 0'}}>
          <a
            href={value.url}
            target={value.newTab ? '_blank' : undefined}
            rel={value.newTab ? 'noopener noreferrer' : undefined}
            style={{...baseStyle, ...styleMap[value.style || 'primary']}}
          >
            {value.label}
            {value.style === 'ghost' && <span>→</span>}
          </a>
        </div>
      )
    },

    // ── YouTube ───────────────────────────────────────────────────────────────
    youtube: ({value}) => {
      const id = getYouTubeId(value?.url || '')
      if (!id) return null
      return (
        <figure style={{margin: '28px 0'}}>
          <div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '6px'}}>
            <iframe
              src={`https://www.youtube.com/embed/${id}`}
              title={value.caption || 'YouTube video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none'}}
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-sm text-center" style={{color: 'rgba(255,255,255,0.45)'}}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },

    // ── Vimeo ─────────────────────────────────────────────────────────────────
    vimeo: ({value}) => {
      const id = getVimeoId(value?.url || '')
      if (!id) return null
      return (
        <figure style={{margin: '28px 0'}}>
          <div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '6px'}}>
            <iframe
              src={`https://player.vimeo.com/video/${id}`}
              title={value.caption || 'Vimeo video'}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none'}}
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-sm text-center" style={{color: 'rgba(255,255,255,0.45)'}}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },

    // ── Image ─────────────────────────────────────────────────────────────────
    image: ({value}) => {
      if (!value?.asset?._ref) return null
      const align = value.alignment || value.className || ''
      const isLeft = align.includes('alignleft')
      const isRight = align.includes('alignright')
      const isCenter = align.includes('aligncenter')

      const imgStyle: React.CSSProperties = {
        border: 'none',
        borderRadius: 0,
        boxShadow: 'none',
        height: 'auto',
        maxWidth: '100%',
        ...(value.width && {width: value.width}),
        ...(isLeft && {float: 'left', margin: '20px 20px 20px 0'}),
        ...(isRight && {float: 'right', margin: '20px 0 20px 20px'}),
        ...(isCenter && {display: 'block', margin: '20px auto'}),
        ...(!isLeft && !isRight && !isCenter && {display: 'block', margin: '20px 0'}),
      }

      return (
        <figure style={{margin: 0}}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={urlFor(value).width(800).url()}
            alt={value.alt || ''}
            style={imgStyle}
          />
          {value.caption && (
            <figcaption className="mt-2 text-sm" style={{color: 'rgba(255,255,255,0.45)', clear: isLeft || isRight ? 'both' : undefined}}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },

  block: {
    h1: ({children}) => (
      <h1 className="text-3xl font-bold mt-10 mb-4 text-white" style={{fontFamily: 'var(--font-display)'}}>
        {children}
      </h1>
    ),
    h2: ({children}) => (
      <h2 className="text-2xl font-bold mt-10 mb-4 text-white" style={{fontFamily: 'var(--font-display)'}}>
        {children}
      </h2>
    ),
    h3: ({children}) => (
      <h3 className="text-xl font-bold mt-8 mb-3 text-white" style={{fontFamily: 'var(--font-display)'}}>
        {children}
      </h3>
    ),
    h4: ({children}) => (
      <h4 className="text-lg font-semibold mt-6 mb-2 text-white" style={{fontFamily: 'var(--font-display)'}}>
        {children}
      </h4>
    ),
    normal: ({children}) => (
      <p className="mb-5 leading-relaxed" style={{color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)'}}>
        {children}
      </p>
    ),
    lead: ({children}) => (
      <p className="mb-6 leading-relaxed text-xl" style={{color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-body)', fontWeight: 400}}>
        {children}
      </p>
    ),
    blockquote: ({children}) => (
      <blockquote
        className="border-l-4 pl-5 my-6 italic"
        style={{borderColor: 'oklch(0.82 0.15 75)', color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-body)'}}
      >
        {children}
      </blockquote>
    ),
    pullquote: ({children}) => (
      <blockquote style={{
        borderTop: '2px solid oklch(0.82 0.15 75)',
        borderBottom: '2px solid oklch(0.82 0.15 75)',
        margin: '36px 0',
        padding: '24px 0',
        textAlign: 'center',
        fontFamily: 'var(--font-display)',
        fontSize: '1.35rem',
        fontStyle: 'italic',
        lineHeight: '1.5',
        color: 'rgba(255,255,255,0.9)',
      }}>
        {children}
      </blockquote>
    ),
    textCenter: ({children}) => (
      <p className="mb-5 leading-relaxed text-center" style={{color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)'}}>
        {children}
      </p>
    ),
    textRight: ({children}) => (
      <p className="mb-5 leading-relaxed text-right" style={{color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)'}}>
        {children}
      </p>
    ),
    textJustify: ({children}) => (
      <p className="mb-5 leading-relaxed" style={{color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)', textAlign: 'justify'}}>
        {children}
      </p>
    ),
  },

  list: {
    bullet: ({children}) => (
      <ul className="list-disc list-outside ml-6 mb-5 space-y-1.5" style={{color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)'}}>
        {children}
      </ul>
    ),
    number: ({children}) => (
      <ol className="list-decimal list-outside ml-6 mb-5 space-y-1.5" style={{color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)'}}>
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({children}) => <li className="leading-relaxed">{children}</li>,
    number: ({children}) => <li className="leading-relaxed">{children}</li>,
  },

  marks: {
    strong: ({children}) => <strong className="font-semibold text-white">{children}</strong>,
    em: ({children}) => <em style={{color: 'rgba(255,255,255,0.9)'}}>{children}</em>,
    underline: ({children}) => <span style={{textDecoration: 'underline'}}>{children}</span>,
    'strike-through': ({children}) => <span style={{textDecoration: 'line-through', opacity: 0.7}}>{children}</span>,
    sup: ({children}) => <sup style={{fontSize: '0.75em', verticalAlign: 'super'}}>{children}</sup>,
    sub: ({children}) => <sub style={{fontSize: '0.75em', verticalAlign: 'sub'}}>{children}</sub>,
    highlight: ({children}) => (
      <mark style={{background: 'oklch(0.82 0.18 80)', color: 'oklch(0.15 0.02 50)', borderRadius: '2px', padding: '0 2px'}}>
        {children}
      </mark>
    ),
    code: ({children}) => (
      <code className="px-1.5 py-0.5 rounded text-sm font-mono" style={{background: 'rgba(255,255,255,0.08)', color: 'oklch(0.82 0.15 75)'}}>
        {children}
      </code>
    ),
    link: ({children, value}) => {
      const target = value?.blank ? '_blank' : undefined
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{color: 'oklch(0.82 0.15 75)'}}
        >
          {children}
        </a>
      )
    },
    internalLink: ({children, value}) => {
      const href = value?.reference?.slug?.current
        ? `/${value.reference.slug.current}`
        : '#'
      return (
        <Link href={href} className="underline underline-offset-2 hover:opacity-70" style={{color: 'oklch(0.82 0.15 75)'}}>
          {children}
        </Link>
      )
    },
  },
}

export {PortableText}
