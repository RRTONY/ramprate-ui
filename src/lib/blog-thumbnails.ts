// Posts whose card picture is a local file instead of their Sanity mainImage.
// The two Yotta 2026 articles are hand-built pages (src/app/blog/<slug>/route.ts),
// so their Sanity records carry no image. Used by the blog list (PostCard) and
// the "Continue Reading" cards on each post, so both show the same picture.
const LOCAL_BLOG_THUMBNAILS: Record<string, string> = {
  "data-centers-have-a-heart": "/blog/yotta-2026-assets/cloud-neighbors-tacos8.webp",
  "the-cloud-gets-rich": "/blog/yotta-2026-assets/constellation-kitchen-tacos8.webp",
};

export function localBlogThumbnail(slug: string | undefined): string | null {
  return (slug && LOCAL_BLOG_THUMBNAILS[slug]) || null;
}
