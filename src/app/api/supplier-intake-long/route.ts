import { NextRequest, NextResponse } from 'next/server'

// Mirrors scripts/supplier-intake-apps-script.gs's FIELD_NAME_MAP exactly -
// some Stage 2 field keys collide with the old single-stage form's field
// names and get written under those same legacy camelCase Sheet headers so
// historical columns don't fragment. Keep both maps in sync.
const FIELD_NAME_MAP: Record<string, string> = {
  legal_entity_name: 'legalEntityName',
  dba_name: 'dbaName',
  state_of_incorporation: 'stateOfIncorporation',
  year_founded: 'yearFounded',
  contact_name: 'contactName',
  contact_title: 'contactTitle',
  contact_email: 'contactEmail',
  contact_phone: 'contactPhone',
  principals: 'ownershipStructure',
  hq_address: 'headquartersAddress',
  num_employees: 'employeeCount',
  chain_of_custody: 'chainOfCustody',
  independent_testing_willingness: 'independentTestingWillingness',
  product_labeling: 'productLabeling',
  buyer_eligibility: 'buyerEligibility',
  testing_lab_name: 'testingLabName',
  coa_lot_specific: 'coaLotSpecific',
  coa_publicly_viewable: 'coaPubliclyViewable',
  coa_public_url: 'coaPubliclyViewableLink',
  identity_confirmation_method: 'identityConfirmationMethod',
  pricing_model: 'pricingModel',
  moq: 'moq',
  batch_traceability_practices: 'batchTraceabilityPractices',
  lead_time: 'standardLeadTime',
  payment_terms: 'paymentTermsAccepted',
  manufacturing_certifications: 'manufacturingCertifications',
  shipping_jurisdictions: 'shippingJurisdictions',
}
const REVERSE_FIELD_NAME_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(FIELD_NAME_MAP).map(([k, v]) => [v, k]),
)

function projectNameFromRequest(req: NextRequest, fallbackSourceUrl?: string) {
  const sourceUrl = req.headers.get('referer') || fallbackSourceUrl || ''
  try {
    return new URL(sourceUrl).hostname.replace(/^www\./, '')
  } catch {
    return 'unknown'
  }
}

export async function GET(req: NextRequest) {
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL
  if (!scriptUrl) {
    return NextResponse.json({ ok: false, error: 'Supplier intake is not configured.' }, { status: 500 })
  }

  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.json({ ok: false, error: 'Missing token' }, { status: 400 })
  }

  const projectName = projectNameFromRequest(req)
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

  if (!result.ok) {
    return NextResponse.json(result)
  }

  const values: Record<string, string> = {}
  for (const [header, value] of Object.entries(result.values || {})) {
    const key = REVERSE_FIELD_NAME_MAP[header] || header
    values[key] = value
  }

  return NextResponse.json({ ok: true, values })
}

export async function POST(req: NextRequest) {
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL
  if (!scriptUrl) {
    return NextResponse.json({ ok: false, error: 'Supplier intake is not configured.' }, { status: 500 })
  }

  const body = await req.json()
  if (!body.token) {
    return NextResponse.json({ ok: false, error: 'Missing token' }, { status: 400 })
  }

  const sourceUrl = req.headers.get('referer') || body.sourceUrl || ''
  const projectName = projectNameFromRequest(req, body.sourceUrl)

  const payload = {
    formStage: 'stage2-supplier-intake',
    supplierToken: body.token,
    final: !!body.final,
    formData: body.formData || {},
    files: body.files || [],
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

  const result = await res.json().catch(() => ({ ok: true }))
  return NextResponse.json(result)
}
