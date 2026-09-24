# Task Guide: What Can We Do, and How

Use this to decide how to handle a request before touching anything. Rules are in
[`/AGENTS.md`](../../AGENTS.md); file locations are in [`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md).

## Step 1. Decide what kind of request it is

Ask yourself four questions, in order:

1. **Is it a question, a check, or a change?** Questions and checks (analytics, SEO, "is X working")
   change nothing: answer them directly with read-only tools.
2. **Where does the thing live?** Code in this repo, Sanity content, or outside the repo (Google
   Apps Script / Sheet, Netlify settings, DNS, Slack)? See the table below. Most page text is in
   **code**, not Sanity.
3. **How big is it?** A small copy edit, a normal change, or a big/risky one (new page, forms,
   routing, anything legal or compliance related)?
4. **Does it need a yes first?** Anything that publishes, deletes, emails someone, posts to Slack,
   spends money, or changes live SEO copy needs a clear yes from the person.

If the request is unclear, ask **one** short question with 2 to 4 options instead of guessing.

## Step 2. Find the row, follow it

| Request | Where it lives | How (MCP tools) | Ask first? |
| --- | --- | --- | --- |
| Change text/images on a page (home, practice pages, about, biochain...) | Code: `src/app/<route>/page.tsx` or its components | `github_read_file` → `github_write_file` → `check_code_quality` → `check_pr_status` → show preview | Only to publish. Minor copy on a live page can ship once done |
| Change a page's Google title / description | Sanity `pageSeo` for that route | `sanity_query` → `sanity_patch_document` (draft) | **Yes**, SEO copy is a business decision |
| Write / edit a blog or Thinking post | Sanity `post` (+ `category`) | `sanity_query` / `sanity_create_document` / `sanity_patch_document` (drafts) | Only to publish |
| Add / edit a team member or board advisor | Sanity `teamMember` / `boardAdvisor` | Sanity tools (drafts) | Only to publish |
| Change contact details (email, phone, address) | Sanity `siteSettings` | `sanity_patch_document` | Only to publish |
| Testimonials, case studies, client logos | **Code**, in the page/component that shows them | Code tools | Only to publish. Editing the Sanity types of the same name does nothing on the site |
| Add a new page | Code: new `src/app/<slug>/page.tsx` + `SITE_PAGES` + SEO + nav | Code tools, follow Page Patterns in AGENTS.md | **Yes**: confirm URL, content and whether it's in the nav |
| Add a redirect (old URL → new URL) | `public/_redirects` (or `next.config.ts`) | Code tools | Only to publish |
| Change the header menu / Practices dropdown | `src/components/layout/Header.tsx` | Code tools | Only to publish |
| Change a form's questions | Field file `src/lib/*-fields.ts` **and**, for supplier forms, the field lists in the Apps Script | Code tools for the site; the script must be pasted and redeployed by a person | **Yes**, since it affects scoring and the Sheet |
| Change form emails, scoring, Slack alerts, Sheet columns | Google Apps Script (outside the repo) | Not possible via MCP. Explain the change and hand over steps | **Yes** |
| Publish a sales HTML page | Artifact Manager at `/artifacts/admin` | Done by a person in the browser, not via MCP | n/a |
| SEO check or fix on a page | Code / Sanity | `seo_check_page`, `lighthouse_check_page`, `search_console_*` | Technical fixes: no. Copy changes: **yes** |
| "How is the site doing?" (traffic, rankings) | Google Analytics / Search Console | `check_analytics`, `search_console_performance` | No, read-only |
| Create / update a ClickUp task | ClickUp | `create_clickup_task`, `update_clickup_task` | Yes for delete |
| Send an email | Resend | `send_email` | **Always yes**, show the exact text first |
| Make a PDF report (reports, manuals, SOPs) | `create_report`: branded PDF, emailed | `create_report` (use `documentInfo` + `eyebrow` for manuals/SOPs) | **Yes**: confirm recipients, it sends an email |
| Anything in `/flow` | Code under `src/app/flow/` etc. | Code tools, `/flow` has its own patterns | Only to publish |
| Change env vars, secrets, `package.json`, `netlify.toml`, CI, DNS, the MCP server itself | Blocked or outside the repo | Not possible via MCP. Tell the person who can do it | n/a |

## Step 3. Do it the standard way

1. Read the files (or content) you'll change first. Read the matching `docs/ai/` note for that feature.
2. Make the smallest change that does the job, following the Coding Patterns in AGENTS.md.
3. Run the checks (AGENTS.md section 5). Through MCP: `check_code_quality` on every changed file,
   then `check_pr_status` until it passes, then open the preview link.
4. Review your own change with the Code Review Checklist (AGENTS.md section 4).
5. Show the person the preview and what will go live (`list_pending_changes`). Publish
   (`publish_changes`) only after a clear yes.
6. End with the Status Report (AGENTS.md section 7).

## Common mistakes to avoid

- Editing a Sanity `testimonial`/`caseStudy`/`clientLogo`/`page` and expecting the site to change. It won't.
- Changing a page's visible heading in Sanity: page text is in code; Sanity `pageSeo` only changes
  the Google title/description.
- Adding a page without adding it to `SITE_PAGES` (it won't show in site search or the chatbot).
- Changing a supplier form question on the site but not in the Apps Script field lists (answers
  stop saving) or the scoring rules.
- Adding a `loading.tsx` above a `[slug]` route (breaks real 404s).
- Publishing while the build check is still running or failing.
- Saying something works without having run a check.
