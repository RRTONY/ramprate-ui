# Active Pharm Intake

> /active-pharm-form Apps Script now fills Sheet tabs 1a/1b/1c/2a + one "2b - <Supplier>" copy per supplier from each submission; redeploy + live test pending as of 2026-09-24

scripts/active-pharm-intake-apps-script.gs (Sheet 1pPjedxIWmqXLDmkde_QaPi4ulrFIHr21d9KXWXUEQn4) writes history to the `Responses` tab AND, since 2026-09-24, fills the yellow input cells on tabs "1a. Budget & Priorities", "1b. Supplier Inventory" (rows 11-25, grows by inserting rows), "1c. Growth & Capacity Expansion" (rows 13-20, "Expansion Budget" heading found by text), "2a. Survey - By Respondent" (C4:C7 + ranks C29:C35), and per-supplier copies of "2b. Survey - By Supplier" (C4:C8 only; template stays blank, copies deleted and rebuilt each fill). Latest submission wins; a `Raw Submission (JSON)` column lets the sheet's "Intake" menu refill tabs from any row. Cells with checkbox validation get TRUE/FALSE from Yes/No automatically (user planned to add checkboxes later).

Test submissions use `apf-test@example.com` (skips staff email; "Intake -> Remove test submissions" deletes them).

The Sheet itself can be read without auth via `/export?format=xlsx` (link-shared) - useful for verifying writes. No clasp login on this machine, so code changes need a manual paste + redeploy by the user.

**Why:** user asked (2026-09-24) for form data to populate the original questionnaire tabs, not just the Responses log.
**How to apply:** after the user redeploys, live-test by POSTing to ACTIVE_PHARM_INTAKE_SCRIPT_URL with the test email, verify via xlsx export, then have them run Remove test submissions. Known sheet bugs flagged to user: 1b column H drop-down (Yes/No) sits on "Contract Expiration" instead of I "Renewal Planned?"; 1c drop-downs point at empty Lookup Tables columns A/D (values live in column B). Related: [project_supplier_intake](project_supplier_intake.md).
