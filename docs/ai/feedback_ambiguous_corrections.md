# Ambiguous Corrections

> When a terse correction could contradict a very recent explicit user decision, confirm which thing to change before editing — don't guess

During the [project_client_intake](project_client_intake.md) build (2026-07-08), the user had just explicitly
approved (via an AskUserQuestion answer) repointing 4 CTA buttons on `/biochain-sourcing`
from `/contact` to the new `/client-intake` form. Minutes later, in a short, grammatically
rough message ("don't change any where and don't replase contact"), they seemed to reverse
that decision — but the phrasing was ambiguous enough that it could also have meant
"don't touch the /contact page itself" or "don't touch the site nav," not "revert the
CTA links you just changed."

**Why this matters:** guessing wrong here is expensive in either direction — reverting
work the user actually wanted kept, or leaving in a change they explicitly asked to undo,
both erode trust. Asked a clarifying AskUserQuestion listing the exact 4 CTAs and their
current/previous hrefs before touching anything; user confirmed "yes, revert." Reverting
without asking would have been a coin flip with real cost either way.

**How to apply:** when a short/informal correction message could plausibly contradict a
decision the user explicitly made very recently (especially via a structured
AskUserQuestion answer, not just casual conversation), don't infer intent from grammar
alone — ask a concrete, options-based clarifying question that names the specific prior
change before editing or reverting anything. This is distinct from ordinary ambiguous
requests: the bar is lower for asking when reverting recent explicit work is on the table,
since undoing-then-redoing costs real edits either way.
