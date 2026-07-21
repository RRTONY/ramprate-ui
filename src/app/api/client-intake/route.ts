import { NextRequest, NextResponse } from 'next/server'

const BRAND_NAMES: Record<string, string> = {
  'ramprate.com': 'RampRate',
  'tonygreenberg.com': 'TonyGreenberg',
}

function projectNameFromSourceUrl(sourceUrl: string) {
  try {
    const hostname = new URL(sourceUrl).hostname.replace(/^www\./, '')
    return `Client — ${BRAND_NAMES[hostname] || hostname}`
  } catch {
    return 'Client — Unknown'
  }
}

export async function POST(req: NextRequest) {
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL

  if (!scriptUrl) {
    return NextResponse.json({ ok: false, error: 'Client intake is not configured.' }, { status: 500 })
  }

  const body = await req.json()
  const sourceUrl = req.headers.get('referer') || body.sourceUrl || ''
  const projectName = projectNameFromSourceUrl(sourceUrl)

  const payload = {
    formData: body.formData,
    files: body.files,
    sourceUrl,
    projectName,
    // The whole buyer-intake form is filled and posted in one shot now - no
    // more stage1/stage2 split, so this is the only marker handleAppend
    // needs (see scripts/supplier-intake-apps-script.gs).
    formStage: 'client-intake',
  }

  const res = await fetch(scriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    return NextResponse.json({ ok: false, error: 'Submission failed.' }, { status: 502 })
  }

  const result = await res.json()
  return NextResponse.json(result)
}
