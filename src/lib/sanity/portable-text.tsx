import {PortableText, type PortableTextComponents} from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import {urlFor} from './image'

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({value}) => {
      if (!value?.asset?._ref) return null
      return (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || ''}
            width={800}
            height={450}
            className="rounded-lg w-full"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm" style={{color: 'rgba(255,255,255,0.45)'}}>
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
    blockquote: ({children}) => (
      <blockquote
        className="border-l-4 pl-5 my-6 italic"
        style={{borderColor: 'var(--gold)', color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-body)'}}
      >
        {children}
      </blockquote>
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
          style={{color: 'var(--gold)'}}
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
        <Link href={href} className="underline underline-offset-2 hover:opacity-70" style={{color: 'var(--gold)'}}>
          {children}
        </Link>
      )
    },
  },
}

export {PortableText}
