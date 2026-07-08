import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL

  if (!scriptUrl) {
    return NextResponse.json({ ok: false, error: 'Client intake is not configured.' }, { status: 500 })
  }

  const body = await req.json()
  const sourceUrl = req.headers.get('referer') || body.sourceUrl || ''

  const BRAND_NAMES: Record<string, string> = {
    'ramprate.com': 'RampRate',
    'tonygreenberg.com': 'TonyGreenberg',
  }

  let projectName = 'Client — Unknown'
  try {
    const hostname = new URL(sourceUrl).hostname.replace(/^www\./, '')
    projectName = `Client — ${BRAND_NAMES[hostname] || hostname}`
  } catch {}

  const payload = {
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
