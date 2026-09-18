# Public Route Restoration Notes

## Live Kumbaya page

The live `/kumbaya` route is an independent public **Shared Upside Protocol** intake. Its primary purpose is to capture event, organization, audience, venue, timing, contact, and priority details through a four-step form. Its visible supporting content explains the RampRate × ImpactSoul fit process, contains a B Lab directory link, and includes clearly marked reflective values and science/impact framing. Any restoration must retain the public intake purpose, its accessible labels and validation, its external B Lab and Sprout Social links, and the page’s separation from CMS and Flow.

## Live legacy brand navigation

The live site currently exposes **Syzygy** as Growth Strategy and **Torque** as Critical Issue Management in legacy “Practices” navigation. However, the live `/services` path currently returns a 404, while the feature branch intentionally uses a plain-language Services taxonomy and permanent compatibility redirects. Any new feature-branch addition must preserve canonical plain-language service URLs and may only expose Torque and Syzygy as clearly labelled legacy service identities or aliases—not silently replace the current catalog.

## Kumbaya venue-image attachment

The current Next project persists structured submissions through `storeFormSubmission`, which safely stores attachment metadata when an upstream upload path supplies it. Kumbaya now has a project-local server-only `storagePut` helper that requests a managed presigned upload URL through the injected platform runtime, uploads only JPG, PNG, or WebP bytes up to 8 MB, and returns a `/manus-storage/` reference. The regular intake endpoint validates and persists only the resulting key, path, name, MIME type, and byte size; it never stores image bytes in the database. Venue and moodboard URLs remain supported as optional alternatives.

## Kumbaya shared-header contrast

The restored Kumbaya page begins on a light paper hero, so the shared header now treats `/kumbaya` as a light route and uses the opaque surface with dark navigation from first render. Desktop and mobile visual review confirmed the header, search control, menu trigger, hierarchy, and first hero block remain readable without changing the page’s public intake behavior.

## Kumbaya venue-image control review

The optional venue photo or moodboard image input was reviewed inside the four-step Kumbaya form at desktop and mobile widths. It remains legible within the existing desktop form grid, exposes its image-type and file-size guidance, and retains the mobile route’s single-column, touch-friendly form progression. The route itself rendered successfully in both checks. Local preview retries may return a stale 404 for unrelated homepage managed images after a checkpoint restart; direct production delivery of those engagement assets was separately verified.

## About fixed-style extraction review

The About founder story, principals, and corporate facts region was checked at desktop and mobile widths after its fixed JSX typography, surface, stat-card, chip, and action styles moved to shared semantic classes. Both presentations retained readable paper and navy surfaces, controlled-gold emphasis, and the existing responsive content sequence. Managed team and advisor records, journey navigation, and external profiles were not changed; the remaining later About sections remain in the file-by-file audit queue.
