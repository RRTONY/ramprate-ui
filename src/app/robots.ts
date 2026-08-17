import type {MetadataRoute} from 'next'

// Private/non-public paths kept out of all crawlers (including AI bots).
const disallow = [
  '/api/',
  '/studio/',
  '/attorney',
  '/attorney-rfi',
  '/henry-jannol',
  '/josh-bykowski',
  '/legal-master',
  '/supplier-intake-long',
  // Internal tool, not public content.
  '/flow/admin',
  // Tokenless duplicate of /flow/peer-review/[token] - no trailing slash since
  // Next serves this route without one (no trailingSlash config), and a
  // trailing-slash disallow entry only prefix-matches paths that have one.
  '/flow/peer-assessment',
  // Per-user/per-token result links - no stable public content to index,
  // and there's no list of valid tokens to enumerate in a sitemap anyway.
  '/flow/360/',
  '/flow/360-results/',
  '/flow/consciousness/',
  '/flow/family-360/',
  '/flow/peer-review/',
  '/flow/soulprint/report/',
  '/flow/team/',
]

// AI/answer-engine crawlers. Listing them explicitly (rather than relying on the
// '*' default) signals that RampRate welcomes being indexed and cited by AI tools,
// while still honoring the private-path disallows above.
const aiBots = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {userAgent: '*', allow: '/', disallow},
      {userAgent: aiBots, allow: '/', disallow},
    ],
    sitemap: 'https://ramprate.com/sitemap.xml',
  }
}
