# Authentication and Environment Requirements

## Current Architecture

Ramprate uses **Sanity** for managed editorial content. The Flow Circuit frontend delegates both authentication and application-data requests to the external backend at `https://flow.tonygreenberg.com`. The current provider-discovery endpoint exposes **credentials authentication only**. Supabase is not used by this repository and must not be introduced as part of this implementation branch.

## Runtime Configuration Audit

| Configuration area                 | Repository handling                                                                                                                             | Required action                                                                                                       |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Sanity content                     | Public project and dataset identifiers are consumed by `src/lib/sanity/client.ts`; all reads use `sanityFetch()` where cache tags are required. | Keep production values in runtime configuration. Store no access token in Git.                                        |
| Sanity revalidation                | `REVALIDATION_SECRET` protects the content revalidation endpoint.                                                                               | Configure as a server-only deployment secret and align the Sanity webhook header with it.                             |
| Google Analytics                   | The root layout reads a Sanity-managed identifier first, then `NEXT_PUBLIC_GA_ID`.                                                              | Configure only the public measurement identifier; do not place private Google credentials in client variables.        |
| Private portals and administration | Several server endpoints require existing portal, admin, GitHub, and email provider credentials.                                                | Keep all values in runtime configuration and rotate any values that were shared outside the intended secrets channel. |
| Flow Circuit authentication        | The local `/flow/api/auth/*` route forwards to the external Flow backend.                                                                       | Keep Flow credential-provider and session configuration in the external backend, not this repository.                 |

## Google Sign-In Requirement

Google sign-in cannot be activated by a page-only change in this repository because the frontend forwards its NextAuth-compatible authentication requests to `flow.tonygreenberg.com`, and that backend currently announces only a credentials provider.

To add Google authentication, the owner of the external Flow backend must configure a Google provider there, supply the required server-side OAuth credentials to that backend’s runtime environment, and register the exact callback URL emitted by that backend. The Ramprate frontend can then offer Google sign-in only after its forwarded provider endpoint lists `google`. No Google client secret belongs in this repository or its public runtime variables.

## Secret Handling

The supplied environment file is treated as sensitive runtime configuration only. No supplied value was copied into tracked source files, the environment template, test fixtures, or documentation. New environment-variable names are documented in `.env.local.example` without values.
