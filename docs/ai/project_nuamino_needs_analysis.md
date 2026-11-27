# NuAmino needs analysis form

Private page: `/nuamino-needs-analysis` (noindex, not in `SITE_PAGES`). Separate from Active Pharm. The questions and RampRate's preliminary understandings are in `src/lib/nuamino-needs-fields.ts`. The form prefills each answer with that understanding; the respondent edits what is wrong.

## Where submissions go: ClickUp (since 2026-10-30)

`/api/nuamino-needs-analysis` validates the submission and creates one task per submission in the ClickUp list **NuAmino Needs Analysis** (id `901115645506`, Clients & Pipeline space). The task description lists every section, question and answer, and marks answers the respondent left unchanged with "_(Kept our existing understanding)_", so reviewers can see at a glance what they corrected.

- Token: the existing `CLICKUP_API_TOKEN` (Sam's personal ClickUp token).
- Optional settings: `NUAMINO_CLICKUP_LIST_ID` (default `901115645506`) and `NUAMINO_CLICKUP_REVIEWERS` (comma-separated ClickUp user ids, default `87464545,87423169`, Sam and Darryl).
- If the task cannot be created, the visitor is told to retry (502). A failed reviewer comment is only logged, since the task is already saved.

**Why the task is not assigned:** Sam and Darryl each have a ClickUp automation that moves any task assigned to them into their own task list ("Sam's Tasks", "Darryl's Tasks") instantly, which would pull submissions out of the NuAmino list. Tested 2026-10-30. Instead, each reviewer gets an **assigned comment** on the task, which shows in their ClickUp inbox without moving it. The same automation is why the Connect form's tasks were landing in Darryl's Tasks (see the Connect notes in `README.md`).

The earlier plan (a Google Sheet + Apps Script web app via `NUAMINO_NEEDS_SCRIPT_URL`) was never set up and is no longer used.

Tests: `tests/nuamino-clickup.test.ts`. Before sharing the questionnaire, submit one clearly labeled test on the preview or live page, confirm the task appears in the NuAmino list with both review comments, then delete it.
