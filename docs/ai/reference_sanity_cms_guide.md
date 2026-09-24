# Sanity Cms Guide

> Internal PDF guide teaching the non-dev team how to edit content in Sanity Studio

`Sanity-CMS-Guide.pdf` (project root, untracked/not in git) — an 11-section guide for non-developer team members covering: logging into Studio (`/studio`), draft vs. publish and the ~60s cache delay, editing the new Page SEO documents (see [project_seo_metadata](project_seo_metadata.md)), editing Site Settings, writing blog/thinking posts (with a warning about changing an already-published slug breaking URLs), managing team members/testimonials/case studies/client logos, working with images, and common mistakes (e.g. the stale-schema "unknown fields" warning — don't click "Remove field" without checking with a developer first).

Built as HTML styled to the site's brand (gold/dark/warm palette) and rendered to PDF via headless Chrome (`--headless --print-to-pdf`) since no pandoc/wkhtmltopdf was installed. If it needs updating later, regenerate from HTML the same way rather than editing the PDF directly.
