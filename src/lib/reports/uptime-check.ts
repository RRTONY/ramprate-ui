// Lightweight same-origin uptime/latency/broken-asset checker. Deliberately
// not a full Lighthouse crawl (that stays on the existing admin
// lighthouse_check_page tool, which hits PageSpeed Insights against the live
// site per CLAUDE.md's Audit Methodology section) - this just answers "did
// the page load, how long did it take, and are its own images/scripts/
// stylesheets actually reachable" for every registered URL, cheaply enough
// to run before every report.

const PAGE_TIMEOUT_MS = 12_000;
const ASSET_TIMEOUT_MS = 10_000;
const MAX_ASSETS_PER_PAGE = 15;
const ASSET_CONCURRENCY = 5;
const PAGE_CONCURRENCY = 3;

export interface AssetCheckResult {
  url: string;
  ok: boolean;
  status?: number;
  error?: string;
}

export interface PageUptimeResult {
  path: string;
  url: string;
  status: number | null;
  latencyMs: number | null;
  ok: boolean;
  error?: string;
  brokenAssets: AssetCheckResult[];
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    // cache: "no-store" - this runs inside a Next.js route handler, where
    // Next's extended `fetch` otherwise applies its own Data Cache/request
    // memoization semantics to outbound fetches. Confirmed live: identical
    // HEAD requests that succeed instantly from a plain Node script came
    // back as failures from inside the route handler without this.
    return await fetch(url, { ...options, signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timeout);
  }
}

// HTML attribute values are entity-encoded in rendered markup (a literal
// query-string "&" is written as "&amp;") - decode before building a URL, or
// "&amp;w=384&amp;q=75" gets treated as part of the "url" param's value
// instead of separate "w"/"q" params, which the image optimizer then
// (correctly) 400s on. Confirmed live: this was reading every single
// next/image URL on the site as "broken" until fixed.
function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'");
}

function extractSameOriginAssetUrls(html: string, baseUrl: string): string[] {
  const origin = new URL(baseUrl).origin;
  const urls = new Set<string>();
  const patterns = [
    /<img[^>]+src=["']([^"']+)["']/gi,
    /<script[^>]+src=["']([^"']+)["']/gi,
    /<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi,
  ];
  for (const pattern of patterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(html))) {
      try {
        const resolved = new URL(decodeHtmlEntities(match[1]), baseUrl);
        if (resolved.origin === origin) urls.add(resolved.toString());
      } catch {
        // malformed / data: URL - not a real asset to check
      }
    }
  }
  return Array.from(urls).slice(0, MAX_ASSETS_PER_PAGE);
}

async function checkAsset(url: string): Promise<AssetCheckResult> {
  try {
    const res = await fetchWithTimeout(url, { method: "HEAD" }, ASSET_TIMEOUT_MS);
    return { url, ok: res.ok, status: res.status };
  } catch (err) {
    return {
      url,
      ok: false,
      error: err instanceof Error ? err.message : "request failed",
    };
  }
}

// Site chrome (logo, shared hero images, etc.) repeats across almost every
// page - checking it separately per page both wastes requests and, tested
// live, occasionally trips false failures from bursting many near-identical
// requests at once. This cache makes each distinct asset URL get checked
// exactly once per report run, shared across all pages.
async function checkAssetCached(
  url: string,
  cache: Map<string, Promise<AssetCheckResult>>,
): Promise<AssetCheckResult> {
  const existing = cache.get(url);
  if (existing) return existing;
  const promise = checkAsset(url);
  cache.set(url, promise);
  return promise;
}

async function checkAssetsWithConcurrency(
  urls: string[],
  cache: Map<string, Promise<AssetCheckResult>>,
): Promise<AssetCheckResult[]> {
  const results: AssetCheckResult[] = [];
  for (let i = 0; i < urls.length; i += ASSET_CONCURRENCY) {
    const batch = urls.slice(i, i + ASSET_CONCURRENCY);
    results.push(...(await Promise.all(batch.map((u) => checkAssetCached(u, cache)))));
  }
  return results;
}

export async function checkPageUptime(
  path: string,
  absoluteUrl: string,
  assetCache: Map<string, Promise<AssetCheckResult>>,
): Promise<PageUptimeResult> {
  const start = Date.now();
  try {
    const res = await fetchWithTimeout(absoluteUrl, { method: "GET" }, PAGE_TIMEOUT_MS);
    const latencyMs = Date.now() - start;
    const html = res.ok ? await res.text() : "";
    const assetUrls = html ? extractSameOriginAssetUrls(html, absoluteUrl) : [];
    const brokenAssets = assetUrls.length
      ? (await checkAssetsWithConcurrency(assetUrls, assetCache)).filter((a) => !a.ok)
      : [];
    return {
      path,
      url: absoluteUrl,
      status: res.status,
      latencyMs,
      ok: res.ok,
      brokenAssets,
    };
  } catch (err) {
    return {
      path,
      url: absoluteUrl,
      status: null,
      latencyMs: Date.now() - start,
      ok: false,
      error: err instanceof Error ? err.message : "request failed",
      brokenAssets: [],
    };
  }
}

export async function checkAllPages(
  routes: { path: string; url: string }[],
): Promise<PageUptimeResult[]> {
  const assetCache = new Map<string, Promise<AssetCheckResult>>();
  const results: PageUptimeResult[] = [];
  for (let i = 0; i < routes.length; i += PAGE_CONCURRENCY) {
    const batch = routes.slice(i, i + PAGE_CONCURRENCY);
    results.push(
      ...(await Promise.all(
        batch.map((r) => checkPageUptime(r.path, r.url, assetCache)),
      )),
    );
  }
  return results;
}
