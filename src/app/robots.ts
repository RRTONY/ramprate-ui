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
  // The Flow Circuit is mid-migration (auth/DB/payments not yet wired up) -
  // keep the whole section out of search until it's launch-ready, then
  // remove this line and add its real routes to sitemap.ts + llms.txt.
  '/flow/',
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
