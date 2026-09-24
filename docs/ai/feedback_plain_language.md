# Plain Language

> Keep all replies to Chitraket plain and short; the day-to-day admin user is a non-technical business owner

Chitraket asked (2026-09-02) for **plain, simplified responses** — short, everyday English, no
jargon, no long explanations. Applies to chat replies here AND to anything user-facing that ships.

**Why:** Chitraket is the webmaster, but the person actually using `/admin` day-to-day is the
business owner, who has no coding or web background. Technical wording (branch, PR,
commit, deploy, metadata, schema, redirect rule, component, cache, API) means nothing to that
reader and makes the tool feel unusable.

**How to apply:**
- In my replies to Chitraket: lead with the answer in 1-3 sentences. Skip the mechanism unless he
  asks. Offer choices as a short list, not a wall of trade-offs.
- In the `/admin` agent's system prompt (`src/lib/admin/system-prompt.ts`): there is now a "WHO YOU
  ARE TALKING TO" block at the top enforcing plain English, 2-5 sentence replies, no code/paths in
  replies, and using the ```options button block for every decision. Keep that block intact; don't
  let later edits reintroduce jargon.
- In `/admin` UI copy (`src/components/admin/AdminChatClient.tsx`): plain labels only — "Changes
  waiting", "Ready to publish", "Show the details" (technical file list hidden behind it). See
  [project_admin_vibecoding](project_admin_vibecoding.md).
