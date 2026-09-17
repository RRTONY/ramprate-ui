# Public Route Restoration Notes

## Live Kumbaya page

The live `/kumbaya` route is an independent public **Shared Upside Protocol** intake. Its primary purpose is to capture event, organization, audience, venue, timing, contact, and priority details through a four-step form. Its visible supporting content explains the RampRate × ImpactSoul fit process, contains a B Lab directory link, and includes clearly marked reflective values and science/impact framing. Any restoration must retain the public intake purpose, its accessible labels and validation, its external B Lab and Sprout Social links, and the page’s separation from CMS and Flow.

## Live legacy brand navigation

The live site currently exposes **Syzygy** as Growth Strategy and **Torque** as Critical Issue Management in legacy “Practices” navigation. However, the live `/services` path currently returns a 404, while the feature branch intentionally uses a plain-language Services taxonomy and permanent compatibility redirects. Any new feature-branch addition must preserve canonical plain-language service URLs and may only expose Torque and Syzygy as clearly labelled legacy service identities or aliases—not silently replace the current catalog.

## Kumbaya venue-image attachment

The current Next project persists structured submissions through `storeFormSubmission`, which safely stores attachment metadata when an upstream upload path supplies it. The project does not currently contain the documented runtime `storagePut` helper or another configured server-side managed-storage adapter. The existing `client-intake` route forwards attachment metadata to an external endpoint but does not upload bytes. Kumbaya can therefore not truthfully claim file-upload support until a managed runtime storage adapter is available; venue and moodboard URLs remain supported in the current form.
