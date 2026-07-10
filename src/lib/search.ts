const SEARCH_STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "up",
  "is",
  "it",
  "its",
  "this",
  "that",
  "are",
  "was",
  "be",
  "do",
  "how",
  "what",
  "why",
  "when",
  "where",
  "who",
]);

// GROQ `match` uses AND logic across space-separated tokens, so fewer, more
// specific words give better recall than a long phrase. Shared by the
// /search page (full results) and /api/search (live typeahead) so both
// stay in sync.
export function buildGroqSearchTerm(query: string): string {
  const words = query.trim().split(/\s+/).filter(Boolean);
  const significant = words.filter(
    (w) => w.length > 2 && !SEARCH_STOP_WORDS.has(w.toLowerCase()),
  );
  const searchWords = (significant.length > 0 ? significant : words).slice(0, 4);
  return searchWords.map((w) => `${w}*`).join(" ");
}
