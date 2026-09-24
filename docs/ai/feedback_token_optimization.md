# Token Optimization

> Rules for Claude API token cost control — model selection, polling, caching, separate keys, max_tokens caps

VCOS Claude API burned $900+ in 3 weeks due to 45-second polling + Opus as default model. Alex capped monthly spend at $250. These rules prevent recurrence.

**Rule 1 — Default model is Haiku, never Opus**
Use `claude-haiku-4-5-20251001` for all internal tools. Escalate to `claude-sonnet-4-6` only for multi-paragraph synthesis. Use `claude-opus-4-8` only with an explicit written justification in the code comment. Never set Opus as a default.

**Why:** Opus costs 25× more than Haiku per token. Using Opus as a default for internal apps is the primary driver of the $900 overage.

**How to apply:** Every new `messages.create` call must have an explicit model constant from the `selectModel()` helper. If you're tempted to use Opus, ask: "Would Haiku get this right 80% of the time?" If yes, use Haiku.

---

**Rule 2 — No polling. Ever.**
Never call the Claude API on a `setInterval` or `setTimeout` loop. All AI calls must be triggered by a user action (button click, form submit, webhook event).

**Why:** 45-second polling = 1,920 calls/day. At Opus rates with a 2K-token prompt that is ~$150/day.

**How to apply:** Search for `setInterval` in any file that imports `anthropic` or uses `ANTHROPIC_API_KEY`. Delete the interval. Replace with an on-demand button or a webhook handler.

---

**Rule 3 — Hard `max_tokens` cap on every call**
Always set `max_tokens` explicitly. Use these caps:
- Classification / tagging: 128–256
- Summaries: 1024
- Drafts: 2048
- Long reports (justified): 4096
Never use 32768 or leave uncapped on an internal tool.

**Why:** The uncapped `/api/ai` endpoint (32768 max_tokens) was flagged in the architecture review as a cost risk. One runaway call can cost as much as 128 normal ones.

**How to apply:** Create a `TOKEN_CAPS` constant in each app's `lib/claude/` directory. Reference it by task type in every `messages.create` call.

---

**Rule 4 — Separate API key per app**
Create one Anthropic API key per deployed application in console.anthropic.com. Name: `vcos-reeve`, `vcos-reports`, `ramprate-site`, etc. Set a per-key monthly spending limit of $50 in Anthropic Billing.

**Why:** With one shared key, it's impossible to know which app caused an overage. Per-key limits also prevent one runaway app from consuming the full monthly budget.

**How to apply:** When deploying a new Claude-powered app, create a new key first. Add it to `.env` as `ANTHROPIC_API_KEY`. Never share keys across apps.

---

**Rule 5 — Prompt caching for repeated system prompts**
Any system prompt longer than ~1000 tokens that is sent on every request must include `cache_control: { type: "ephemeral" }`. Cache hits cost 10% of normal input rate.

**Why:** A 2000-token system prompt sent 100 times/day = 200K tokens/day = $180/month at Haiku rates. With caching that drops to $18/month.

**How to apply:** Pass `system` as an array with the cache_control block (not a plain string). Monitor `response.usage.cache_read_input_tokens` to verify hits.

---

**Rule 6 — Test token use before launching**
After building a new Claude integration, run it 10 times manually and check the Anthropic usage console. Confirm total cost per run before enabling for any automated or public use.

**Why:** Alex noted Claude auto-raises spend limits and there are reports of people burning $6K overnight. A 10-run test costs cents and catches runaway patterns early.

**How to apply:** After any new Claude feature, open console.anthropic.com → Usage → filter by the app's API key → check cost per call. Only enable automated use after verifying cost is acceptable.

---

**Rule 7 — Claude Agent SDK for new integrations (long-term)**
Any NEW Claude integration should be built using the Claude Agent SDK + CLI OAuth, not raw API calls with `ANTHROPIC_API_KEY`. SDK-authenticated sessions absorb inference cost into the Claude subscription.

**Why:** Alex confirmed that Anthropic allows subscription-absorbed inference for apps built on the Claude Agent SDK within their ecosystem. This eliminates per-token billing for low-volume internal tools.

**How to apply:** Install `@anthropic-ai/sdk`, authenticate with `claude login` CLI, use the session token. This is an architectural rewrite — plan it for new features, not as an emergency hotfix.
