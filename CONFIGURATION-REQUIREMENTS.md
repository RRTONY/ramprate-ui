# Authentication and Environment Requirements

## Current Architecture

Ramprate uses the managed database for editorial content. The Flow Circuit frontend delegates both authentication and application-data requests to the external backend at `https://flow.tonygreenberg.com`. The current provider-discovery endpoint exposes **credentials authentication only**. Supabase is not used by this repository and must not be introduced as part of this implementation branch.

## Runtime Configuration Audit

| Configuration area                 | Repository handling                                                                                                                                                        | Required action                                                                                                       |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Managed content database           | `DATABASE_URL` is used server-side by the content data layer. Public routes read the `content_documents` table; image URLs remain references, not table-stored file bytes. | Use the managed runtime value only. Never commit a database URL or expose it to browser code.                         |
| Content updates                    | Managed content updates write directly to the database and become available to the public content layer.                                                                   | Use the restricted administrative content tools or an authenticated database workflow; no webhook secret is required. |
| Google Analytics                   | The root layout reads the managed content setting first, then `NEXT_PUBLIC_GA_ID`.                                                                                         | Configure only the public measurement identifier; do not place private Google credentials in client variables.        |
| Private portals and administration | Several server endpoints require existing portal, admin, GitHub, and email provider credentials.                                                                           | Keep all values in runtime configuration and rotate any values that were shared outside the intended secrets channel. |
| Flow Circuit authentication        | The local `/flow/api/auth/*` route forwards to the external Flow backend.                                                                                                  | Keep Flow credential-provider and session configuration in the external backend, not this repository.                 |

## Google Sign-In Requirement

Google sign-in cannot be activated by a page-only change in this repository because the frontend forwards its NextAuth-compatible authentication requests to `flow.tonygreenberg.com`, and that backend currently announces only a credentials provider.

To add Google authentication, the owner of the external Flow backend must configure a Google provider there, supply the required server-side OAuth credentials to that backend’s runtime environment, and register the exact callback URL emitted by that backend. The Ramprate frontend can then offer Google sign-in only after its forwarded provider endpoint lists `google`. No Google client secret belongs in this repository or its public runtime variables.

## Secret Handling

The supplied environment file is treated as sensitive runtime configuration only. No supplied value was copied into tracked source files, the environment template, test fixtures, or documentation. New environment-variable names are documented in `.env.local.example` without values.
