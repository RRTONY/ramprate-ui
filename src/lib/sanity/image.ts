import {createImageUrlBuilder} from '@sanity/image-url'
import {client} from './client'

const builder = createImageUrlBuilder(client)

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  // auto('format') lets Sanity's CDN serve WebP/AVIF to browsers that support
  // it — smaller payloads and a Core Web Vitals win, applied everywhere urlFor
  // is used. Callers can still chain .width()/.height() afterward.
  return builder.image(source).auto('format')
}
