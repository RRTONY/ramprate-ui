# Auto Promote Minor Edits

> Alex Veytsel's instruction to auto-promote minor content edits from staging to production without waiting for separate approval

For minor content edits (copy changes, section add/remove, small text tweaks), push straight from staging/Netlify preview into production once done, don't leave it sitting on a preview URL waiting for a separate go-ahead.

**Why:** Alex Veytsel said explicitly (Slack, referring to [project_biochain_sourcing](project_biochain_sourcing.md) copy edits on 2026-07-29/30): "For more minor edits like these, please automatically move from staging into production - if Tony looks at ramprate.com/biochain, he should see the latest content, even if he winds up changing it again." The expectation is Tony always sees current content on the real domain, even knowing it might change again shortly after.

**How to apply:** Applies to small copy/content edits on already-live pages (text swaps, adding/removing a section, minor layout tweaks) — not to net-new pages, structural changes, or anything with open compliance/legal questions (e.g. still hold major biochain changes for confirmation per the existing compliance-exposure note in [project_biochain_sourcing](project_biochain_sourcing.md)). When in doubt about "minor" vs "major," it's safer to ask, but default toward shipping small copy edits to prod immediately rather than parking them on a preview link.
