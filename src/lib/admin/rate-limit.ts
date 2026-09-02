// Sonnet + agentic tool use costs far more per call than the visitor
// chatbot's single-shot Haiku turns, so the daily cap here is much lower.
// This counts real Anthropic API calls (one per admin-chat step), not user
// turns or jobs, so it's a genuinely accurate spend cap. Shared between the
// streaming chat route and the scheduled job runner so both draw from the
// same counter instead of two independent ones that would each undercount
// the true daily total.
//
// This is an in-memory, per-serverless-instance counter — already an
// approximation (not persisted, and Netlify may run more than one instance),
// same as before this was extracted into its own module.
const DAILY_LIMIT = 150;
const BLOCK_AT_PERCENT = 0.95;

let callsToday = 0;
let counterDate = new Date().toISOString().slice(0, 10);

function resetIfNewDay() {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== counterDate) {
    callsToday = 0;
    counterDate = today;
  }
}

export function dailyLimitReached(): boolean {
  resetIfNewDay();
  return callsToday >= Math.floor(DAILY_LIMIT * BLOCK_AT_PERCENT);
}

export function recordAdminChatCall(): void {
  resetIfNewDay();
  callsToday++;
}
