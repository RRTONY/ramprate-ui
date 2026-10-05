# Shared ownership interactive blog

Copied on 2026-10-06 at the user's request to reproduce the entire interactive page exactly.

- Source: https://syzygy-who-gets-to-plug-in.eclecticexe.chatgpt.site/shared-ownership
- Public route: /blog/shared-ownership. The route handler returns the original HTML from src/content/shared-ownership.json, including styles and calculator scripts, without the normal blog wrapper.
- Images and downloads: public/blog/shared-ownership-assets/. The hero uses lossless WebP with verified identical decoded RGB pixels, because the original PNG exceeds the MCP 4 MiB request limit after base64 encoding.
- A Sanity post with slug shared-ownership supplies the blog listing, sitemap and full-text search. SITE_PAGES supplies the AI page directory.
- The user explicitly chose the original interactive design. Preserve the original HTML image elements, colors and inline styles despite the normal React/Tailwind coding conventions. Do not rewrite the prose or reconcile the source's older appendix with its newer calculator model without asking.
- Only local asset URLs, canonical and social metadata URLs, and source-essay links were adjusted. All original styles and executable calculator code are preserved.
- Updating this article requires updating the stored HTML and its indexed Sanity text together. Do not replace this route with a remote iframe or redirect.

## Next.js route collision

Once the Sanity listing post is published, exclude shared-ownership from generateStaticParams in src/app/blog/[slug]/page.tsx. Otherwise Next.js 16.3.6 tries to prerender both the dedicated GET route and the dynamic blog page at the same path, failing with: Invariant: Expected an HTML size for prerendered app route /blog/shared-ownership. The initial preview passed before the listing record was published, so this issue appeared only during the production build. Keep the published post for indexing; reserve its route for the standalone HTML handler.

## Temporarily offline at the owner's request

The owner asked to remove this article from the live website on 2026-10-05 UTC and intends to publish tomorrow. The dedicated route returns HTTP 404 with noindex; all public post queries exclude the shared-ownership slug, and its SITE_PAGES entry is removed. The exact HTML, assets, and Sanity post remain saved. No automatic publication is scheduled. On a new publication request, restore the HTML response, remove the temporary query exclusion, and restore the SITE_PAGES entry. Keep the dynamic-route static-params collision exclusion described above.
