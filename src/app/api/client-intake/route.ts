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

// Prefill lookup for the resume link a client gets once a team member
// approves their Stage 1 submission and continues to Stage 2 - mirrors
// supplier-intake-long's GET-by-token route.
export async function GET(req: NextRequest) {
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL
  if (!scriptUrl) {
    return NextResponse.json({ ok: false, error: 'Client intake is not configured.' }, { status: 500 })
  }

  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.json({ ok: false, error: 'Missing token' }, { status: 400 })
  }

  const sourceUrl = req.headers.get('referer') || ''
  const projectName = projectNameFromSourceUrl(sourceUrl)

  const url = new URL(scriptUrl)
  url.searchParams.set('token', token)
  url.searchParams.set('projectName', projectName)

  let result: { ok: boolean; error?: string; used?: boolean; values?: Record<string, string> }
  try {
    const res = await fetch(url.toString())
    result = await res.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Lookup failed.' }, { status: 502 })
  }

  return NextResponse.json(result)
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
    // formStage distinguishes the Step-1-only submission ('stage1-client-intake')
    // from the token-gated continuation ('stage2-client-intake') - see
    // scripts/supplier-intake-apps-script.gs, which mirrors the same
    // human-approval-gated pattern already used for supplier onboarding.
    formStage: body.formStage,
    clientToken: body.token,
    stage2UrlBase: body.stage2UrlBase,
    final: body.final,
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
