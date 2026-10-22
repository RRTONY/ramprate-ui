// A bare "https://linkedin.com" passes a plain URL check but tells us nothing
// about who applied, so only a personal profile link (/in/<handle>, or the
// legacy /pub/<handle>) counts.
export function isLinkedInProfileUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  } catch {
    return false;
  }

  const host = url.hostname.toLowerCase();
  if (host !== "linkedin.com" && !host.endsWith(".linkedin.com")) return false;

  return /^\/(in|pub)\/[^/]+/i.test(url.pathname);
}
