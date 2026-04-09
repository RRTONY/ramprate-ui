import Image from 'next/image'
import {urlFor} from '@/lib/sanity/image'

interface SanityImageProps {
  image: unknown
  alt?: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
}

export default function SanityImage({
  image,
  alt = '',
  width = 800,
  height = 450,
  className,
  priority = false,
  fill = false,
}: SanityImageProps) {
  if (!image) return null

  const src = urlFor(image).width(width).height(height).url()

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        unoptimized
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized
    />
  )
}
