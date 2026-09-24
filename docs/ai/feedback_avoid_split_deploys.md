# Avoid Split Deploys

> User dislikes logic split across two files/deploys that must be coordinated by hand - consolidate into one deployable artifact when possible

When a feature's logic is split across two separately-deployed pieces (e.g. a Python CLI that computes something and POSTs it back to a Google Apps Script, requiring staff to run the script AND redeploy/coordinate the .gs separately), the user wants that collapsed into a single artifact rather than kept as two.

**Why:** 2026-07-14, on the supplier-intake scoring engine (`scripts/score_suppliers.py` writing scores back into `scripts/supplier-intake-apps-script.gs`'s Sheet via a POST): user said *"we don't want to save in two time and deploy in two time we need to fix this issue"* — the operational overhead of keeping two files in sync and coordinating two deploys was the actual complaint, not a bug in either file individually. Once scoring moved fully into the `.gs` (so submissions score themselves automatically on write), the user immediately followed up asking to delete the now-redundant Python file entirely rather than keep it as a "just in case" leftover — see [project_supplier_intake](project_supplier_intake.md).

**How to apply:** When a feature naturally spans a script/tool plus a live deployed service, default to asking whether logic can live in the single live artifact instead of splitting it, especially if the split piece requires a human to manually run something and redeploy separately to take effect. If asked to bring split logic together, also proactively check for and clean up now-dead references (JSON comments, doc sections, cross-file mentions) pointing at the removed piece rather than leaving them stale.
