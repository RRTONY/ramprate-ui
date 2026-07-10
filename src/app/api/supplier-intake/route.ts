import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL

  if (!scriptUrl) {
    return NextResponse.json({ ok: false, error: 'Supplier intake is not configured.' }, { status: 500 })
  }

  const body = await req.json()
  const sourceUrl = req.headers.get('referer') || body.sourceUrl || ''

  let projectName = 'unknown'
  try {
    projectName = new URL(sourceUrl).hostname.replace(/^www\./, '')
  } catch {}

  const payload = {
    formStage: 'stage1-supplier-intake',
    // Hardcoded to this site's own real domain (not derived from the
    // request) so a Netlify preview/staging deploy never generates a
    // Stage 2 link that points at a throwaway preview URL. The Apps
    // Script backend is shared with other sites (e.g. tonygreenberg.com)
    // via the same mechanism - each site's own proxy route is responsible
    // for telling it its own correct Stage 2 URL.
    stage2UrlBase: 'https://ramprate.com/supplier-intake-long/',
    formData: body.formData,
    files: body.files,
    sourceUrl,
    projectName,
  }

  const res = await fetch(scriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    return NextResponse.json({ ok: false, error: 'Submission failed.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
