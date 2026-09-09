# Ramprate Content Migration Design

## Objective

Replace the public Sanity dataset with the managed database while preserving existing routes, published text, Portable Text blocks, page-builder configuration, and external media URLs.

## Storage Model

The migration uses a single `content_documents` table with typed, indexed records. This avoids lossy conversion of Sanity’s flexible page-builder and Portable Text structures while providing indexed fields for the production read paths.

| Field                               | Purpose                                                                                                                                         |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `source_id`                         | Stable identifier from the source dataset; supports idempotent re-imports.                                                                      |
| `content_type`                      | The original document type, such as `post`, `page`, `category`, or `siteSettings`.                                                              |
| `slug`, `route`, `section`, `title` | Indexed fields used by route, archive, category, and metadata lookups.                                                                          |
| `published_at`, `source_updated_at` | Source publication and update order for public listing and rebuild logic.                                                                       |
| `data`                              | The original structured content after reference expansion. It preserves current fields without storing untrusted executable code or file bytes. |

## Content and Media Strategy

The exported dataset contains 319 authored documents and 646 `sanity.imageAsset` metadata documents. The migration imports both into the database. It expands document references during import so public routes receive image metadata with a resolved `url` field. Image binaries remain at their published HTTPS URLs and are not stored in the database.

## Query Compatibility

A new server-only content layer will replace the existing Sanity client and GROQ constants. Its typed query descriptors retain the existing page-level calling pattern during the transition, then the old `src/lib/sanity` modules, Studio route, revalidation route, and Sanity packages can be removed after verification.

## Deployment Compatibility

The deployment failure is caused by the image selecting pnpm 12, which rejects its generated `--prod=false` flag. The project now pins pnpm 11.24.0, a tested release that accepts that flag. The final migration checkpoint will confirm the managed build succeeds.
