import { defineField, defineType } from "sanity";

// Sales-published HTML pages, served at /artifacts/[slug]. Written directly
// by the Artifact Manager (src/app/artifacts/admin) via the Sanity write
// client - unlike the admin-vibecoding content workflow, there is no
// drafts.<id> + PR-gated publish step here, since the entire point of this
// tool is Sales publishing without waiting on a webmaster/review step.
export default defineType({
  name: "artifact",
  title: "Artifact",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      description:
        "Short description shown on the /artifacts listing and used as the meta description.",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "html",
      title: "HTML (legacy, inline)",
      description:
        "Legacy inline storage for the HTML document - superseded by htmlAsset (a Sanity file asset, which isn't subject to Sanity's ~4MB mutation-document limit). Kept read-only here for artifacts created before that change; new/edited artifacts write to htmlAsset instead.",
      type: "text",
      rows: 20,
      readOnly: true,
    }),
    defineField({
      name: "htmlAsset",
      title: "HTML file",
      description:
        "The complete HTML document for this artifact, stored as a file asset (not inline) so it isn't bound by Sanity's mutation-document size limit. Rendered in a sandboxed iframe on the public page.",
      type: "file",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["published", "draft"] },
      initialValue: "draft",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),
    defineField({
      name: "createdBy",
      title: "Created By",
      description:
        "Free-text name/note - this tool uses one shared password, not per-user accounts.",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "status" },
  },
});
