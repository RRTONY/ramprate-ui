/**
 * Upload SPII platform images to Sanity.
 *
 * Usage:
 *   SANITY_TOKEN=<your-token> node scripts/upload-spii-images.mjs
 *
 * Get a token: https://www.sanity.io/manage → project xdo1fb5d → API → Tokens → Add API token (Editor role)
 */

import {createReadStream} from 'fs'
import {resolve, dirname} from 'path'
import {fileURLToPath} from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const PROJECT_ID = 'xdo1fb5d'
const DATASET    = 'production'
const TOKEN      = process.env.SANITY_TOKEN

if (!TOKEN) {
  console.error('❌  Set SANITY_TOKEN env var before running.\n   SANITY_TOKEN=<token> node scripts/upload-spii-images.mjs')
  process.exit(1)
}

const images = [
  {
    path: resolve(__dirname, '../public/images/spii/spii-platform-1.png'),
    label: 'SPII Platform — Vendor Matching Engine',
  },
  {
    path: resolve(__dirname, '../public/images/spii/spii-platform-2.png'),
    label: 'SPII Platform — 315 Variables Analysis',
  },
]

async function upload(imagePath, label) {
  const url = `https://${PROJECT_ID}.api.sanity.io/v2021-03-25/assets/images/${DATASET}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'image/png',
    },
    body: createReadStream(imagePath),
    duplex: 'half',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`HTTP ${res.status}: ${text}`)
  }

  const data = await res.json()
  console.log(`✅  ${label}`)
  console.log(`    Asset ID : ${data.document._id}`)
  console.log(`    URL      : ${data.document.url}\n`)
  return data.document
}

console.log('Uploading SPII images to Sanity...\n')
for (const img of images) {
  await upload(img.path, img.label)
}
console.log('Done. Copy the Asset IDs above if you want to reference them in Sanity documents.')
