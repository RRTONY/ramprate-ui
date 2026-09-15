// The shared Apps Script backend (scripts/supplier-intake-apps-script.gs)
// serves responses through Google's own two-hop web app redirect, which is
// intermittently slow or briefly fails outright (~1 in 3 requests observed
// during 2026-09-16 testing) - a plain single fetch surfaces that as a
// "Lookup failed"/502 straight to the supplier, so every caller retries once
// on failure instead. Timeouts bumped 2026-09-16 after a live 6s+3s budget
// still failed 2/3 - a real, successful round trip was observed taking
// 11.2s, so 9s total wasn't nearly enough headroom. This project's Netlify
// deploy tolerated an 11.2s response without killing the function, so
// 12s+8s (20s total) stays under whatever the real ceiling is with margin,
// while still giving a genuine second attempt if the first fails fast.
export async function fetchAppsScriptJson(url: string, init?: RequestInit): Promise<{ ok: boolean; [key: string]: unknown }> {
  const attemptTimeouts = [12000, 8000]
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
