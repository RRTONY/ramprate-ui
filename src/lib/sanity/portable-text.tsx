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
            className="rounded-lg"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-500">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  marks: {
    link: ({children, value}) => {
      const target = value?.blank ? '_blank' : undefined
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
    },
    internalLink: ({children, value}) => {
      const href = value?.reference?.slug?.current
        ? `/${value.reference.slug.current}`
        : '#'
      return <Link href={href}>{children}</Link>
    },
  },
}

export {PortableText}
