// The shared Apps Script backend (scripts/supplier-intake-apps-script.gs)
// serves responses through Google's own two-hop web app redirect, which is
// intermittently slow or briefly fails outright (~1 in 3 requests observed
// during 2026-09-16 testing) - a plain single fetch surfaces that as a
// "Lookup failed"/502 straight to the supplier, so every caller retries once
// on failure instead. Kept to 2 attempts with modest timeouts so the total
// stays under Netlify's default 10s function timeout even in the worst case.
export async function fetchAppsScriptJson(url: string, init?: RequestInit): Promise<{ ok: boolean; [key: string]: unknown }> {
  const attemptTimeouts = [6000, 3000]
  let lastErr: unknown

  for (const timeoutMs of attemptTimeouts) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(url, { ...init, signal: controller.signal })
      return await res.json()
    } catch (err) {
      lastErr = err
    } finally {
      clearTimeout(timeoutId)
    }
  }

  throw lastErr
}
