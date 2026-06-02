/**
 * Apply AI-assigned categories to all 97 uncategorized Sanity blog posts.
 *
 * Usage:
 *   SANITY_TOKEN=<your-token> node scripts/apply-categories.mjs
 *
 * Get a token:
 *   1. Go to https://www.sanity.io/manage → project xdo1fb5d
 *   2. API → Tokens → Add API token (Editor role)
 *   3. Copy the token and run this script
 *
 * OR login via CLI first:
 *   npx sanity login
 *   SANITY_TOKEN=$(npx sanity debug --secrets 2>/dev/null | grep token | head -1 | awk '{print $2}') node scripts/apply-categories.mjs
 */

import {readFileSync} from 'fs'
import {fileURLToPath} from 'url'
import {dirname, resolve} from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const PROJECT_ID = 'xdo1fb5d'
const DATASET    = 'production'
const TOKEN      = process.env.SANITY_TOKEN

if (!TOKEN) {
  console.error(`
❌  SANITY_TOKEN not set.

To get a token:
  1. Open https://www.sanity.io/manage/project/xdo1fb5d
  2. Go to API → Tokens → Add API Token (choose Editor)
  3. Run:  SANITY_TOKEN=<paste-token> node scripts/apply-categories.mjs
`)
  process.exit(1)
}

const mutations = JSON.parse(
  readFileSync(resolve(__dirname, 'sanity_category_mutations.json'), 'utf8'),
)

const BATCH = 25  // Sanity allows up to 500 mutations per request
const batches = []
for (let i = 0; i < mutations.mutations.length; i += BATCH) {
  batches.push(mutations.mutations.slice(i, i + BATCH))
}

console.log(`\nApplying categories to ${mutations.mutations.length} posts in ${batches.length} batches…\n`)

let applied = 0
for (const [idx, batch] of batches.entries()) {
  const url = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/${DATASET}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({mutations: batch}),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error(`❌  Batch ${idx + 1} failed: HTTP ${res.status}\n${text}`)
    process.exit(1)
  }

  const data = await res.json()
  applied += batch.length
  console.log(`✅  Batch ${idx + 1}/${batches.length} — ${applied}/${mutations.mutations.length} posts updated`)

  if (idx < batches.length - 1) {
    await new Promise(r => setTimeout(r, 200))  // small delay between batches
  }
}

console.log(`\n🎉  Done! All ${applied} posts now have categories assigned.`)
console.log('    Categories will appear on the blog within 60 seconds (ISR revalidation).\n')
