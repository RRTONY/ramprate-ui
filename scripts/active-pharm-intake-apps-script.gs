// Backend for /active-pharm-form (TheActivePharm Supply Chain Intake).
// Deliberately its own standalone Apps Script project, not folded into
// supplier-intake-apps-script.gs - that file is hardcoded to a different
// SHEET_ID and a completely different data shape (supplier scoring/staging),
// none of which applies to this one-shot needs-analysis intake. Keeping them
// separate means this file's SHEET_ID mistake can't ever silently write into
// the supplier-scoring sheet, and vice versa.
//
// ONE-TIME SETUP (manual - do this once):
//   1. Open the spreadsheet: https://docs.google.com/spreadsheets/d/1pPjedxIWmqXLDmkde_QaPi4ulrFIHr21d9KXWXUEQn4/edit
//   2. Extensions -> Apps Script
//   3. Delete any boilerplate code in the editor, paste this entire file in.
//   4. Deploy -> New deployment -> select type "Web app".
//      - Execute as: Me
//      - Who has access: Anyone
//   5. Deploy, copy the resulting /exec URL.
//   6. Set that URL as the ACTIVE_PHARM_INTAKE_SCRIPT_URL environment
//      variable in Netlify (Site settings -> Environment variables) AND in
//      this project's local .env for testing. The site's API route
//      (src/app/api/active-pharm-intake/route.ts) reads it from there - the
//      URL itself isn't a secret exactly, but keeping it out of the repo
//      matches every other intake form's pattern in this codebase.
//   7. Re-run step 4 ("Manage deployments" -> edit -> new version) any time
//      this file changes - pasting new code into the editor alone does not
//      update the live /exec URL's behavior until redeployed.

const SHEET_ID = '1pPjedxIWmqXLDmkde_QaPi4ulrFIHr21d9KXWXUEQn4';
const RESPONSES_TAB_NAME = 'Responses';

// Matches src/app/active-pharm-form's own BUDGET_CATEGORIES list exactly -
// keep these two in sync by hand if either changes. Fixed order/count (not
// derived from whatever the client happens to submit) so the Sheet's columns
// stay stable across submissions even if a future edit reorders the form.
const BUDGET_CATEGORIES = [
  'Compounding pharmacy / fulfillment (503A/503B) fees',
  'APIs, peptides & other active raw materials',
  'Excipients & other formulation ingredients',
  'Third-party testing & quality control (QC/QA labs)',
  'Packaging & labeling',
  'Cold chain, freight & 3PL / fulfillment logistics',
  'Genomic / DNA / pharmacogenomic testing',
  'Clinical research (CRO), blend validation & regulatory consulting',
  'Device & device-component manufacturing',
  'Internal supply chain / quality staff (only if targeted for outsource)',
  'Other (please specify)',
];

// 'other' renders with an editable label client-side (priorities.otherLabel)
// - buildRow below falls back to this fixed label if the client left it
// blank.
const PRIORITY_ITEMS = [
  { key: 'cost', label: 'Cost reduction' },
  { key: 'capacity', label: 'Adding licensed capacity in underserved states' },
  { key: 'diversify', label: 'Diversifying / de-risking API and raw-material sourcing' },
  { key: 'quality', label: 'Supplier quality & regulatory compliance' },
  { key: 'speed', label: 'Speed to onboard new suppliers or product lines' },
  { key: 'flexibility', label: 'Improved contract flexibility / reduced risk' },
  { key: 'other', label: 'Other (please specify)' },
];

// High-priority client (per the team's own request) - both as To recipients,
// not CC, so a new submission can't get lost in a CC pile the way the
// supplier-intake script's history shows CC-only notifications sometimes do.
const STAFF_NOTIFICATION_TO = 'admin@ramprate.com,rob@ramprate.com';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const data = JSON.parse(e.postData.contents);

    // Honeypot - silently accept without writing anything.
    if (data.bot_field) {
      return jsonResponse({ ok: true });
    }

    const row = buildRow(data);
    const sheet = getOrCreateResponsesSheet();
    appendRowWithHeaders(sheet, row);

    lock.releaseLock();

    try {
      sendStaffNotification(data);
    } catch (emailErr) {
      console.error('sendStaffNotification failed: ' + emailErr);
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (releaseErr) { /* already released above on the success path */ }
  }
}

function getOrCreateResponsesSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  return ss.getSheetByName(RESPONSES_TAB_NAME) || ss.insertSheet(RESPONSES_TAB_NAME);
}

function fmtUSD(n) {
  const num = parseFloat(n);
  return isFinite(num) ? num : '';
}

// Renders one supplier or growth-row entry as a readable multi-line block,
// rather than raw JSON, so the team can read submissions directly in the
// Sheet without any extra tooling. Multiple entries are joined by a divider
// in buildRow below.
function formatSupplierBlock(s, i) {
  s = s || {};
  return (
    '#' + (i + 1) + ' ' + (s.name || 'Unnamed supplier') + '\n' +
    'Category: ' + (s.category || '—') + '\n' +
    'Annualized spend: $' + (s.spend || '0') + '\n' +
    'Geography / HQ: ' + (s.geography || '—') + '\n' +
    'States licensed/served: ' + (s.states || '—') + '\n' +
    'Contract: ' + (s.startDate || '—') + ' to ' + (s.endDate || '—') + '\n' +
    'Renewal planned: ' + (s.renewal || '—') + '\n' +
    'Internal contract owner: ' + (s.owner || '—') + '\n' +
    'Certifications: ' + (s.certifications || '—') + '\n' +
    'Pending known changes: ' + (s.pendingChanges || '—') + '\n' +
    'Notes: ' + (s.notes || '—')
  );
}

function formatGrowthRowBlock(r, i) {
  r = r || {};
  return (
    '#' + (i + 1) + ' ' + (r.geography || '—') + ' / ' + (r.category || '—') + '\n' +
    'Specific product/formulation: ' + (r.product || '—') + '\n' +
    'Current volume/capacity: ' + (r.currentVolume || '—') + '\n' +
    'Desired volume/capacity: ' + (r.desiredVolume || '—') + '\n' +
    'Basis: ' + (r.basis || '—') + '\n' +
    'Target date: ' + (r.targetDate || '—') + '\n' +
    'Can current supplier(s) flex to meet this: ' + (r.canFlex || '—') + '\n' +
    'Notes: ' + (r.notes || '—')
  );
}

function buildRow(data) {
  const respondent = data.respondent || {};
  const budget = data.budget || {};
  const categories = budget.categories || [];
  const priorities = data.priorities || {};
  const ranks = priorities.ranks || {};
  const suppliers = data.suppliers || [];
  const growth = data.growth || {};
  const growthRows = growth.rows || [];

  const row = {
    Timestamp: new Date(),
    'Source URL': (data._meta && data._meta.sourceUrl) || '',
    'Respondent Name & Title': respondent.name || '',
    'Respondent Email': respondent.email || '',
    'Respondent Phone': respondent.phone || '',
    'Total Centralized Supply Chain Spend': fmtUSD(budget.centralTotal),
    'Estimated Decentralized Spend': fmtUSD(budget.decentralTotal),
  };

  BUDGET_CATEGORIES.forEach(function (label, i) {
    const cat = categories[i] || {};
    row['Budget: ' + label + ' ($)'] = fmtUSD(cat.amount);
    row['Budget: ' + label + ' (notes)'] = cat.notes || '';
  });

  row['Top Initiatives (Next 12 Months)'] = priorities.initiatives || '';
  row['If 10-20% of Spend Were Freed Up'] = priorities.savingsUse || '';

  PRIORITY_ITEMS.forEach(function (item) {
    const label = item.key === 'other' && priorities.otherLabel ? priorities.otherLabel : item.label;
    row['Priority: ' + label] = ranks[item.key] !== undefined ? ranks[item.key] : '';
  });

  row['Supplier Count'] = suppliers.length;
  row['Suppliers'] = suppliers.map(formatSupplierBlock).join('\n\n---\n\n');

  row['Growth/Capacity Expansion Driver?'] = growth.isDriver || '';
  row['Growth Driver Description'] = growth.driverDescription || '';
  row['Growth/Capacity Row Count'] = growthRows.length;
  row['Growth/Capacity Rows'] = growthRows.map(formatGrowthRowBlock).join('\n\n---\n\n');
  row['Separate Expansion Budget?'] = growth.hasSeparateBudget || '';
  row['Expansion Budget Amount'] = fmtUSD(growth.budgetAmount);
  row['Expansion Budget Period'] = growth.budgetPeriod || '';

  row['Confirmed Accurate'] = data.confirmAccurate ? 'Yes' : 'No';

  return row;
}

function appendRowWithHeaders(sheet, row) {
  let headers = sheet.getLastRow() > 0
    ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    : [];

  const newKeys = Object.keys(row).filter(function (k) { return headers.indexOf(k) === -1; });
  if (newKeys.length) {
    headers = headers.concat(newKeys);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  const outRow = headers.map(function (h) { return preventFormulaInjection(row[h] !== undefined ? row[h] : ''); });
  sheet.appendRow(outRow);
}

// Same guard as supplier-intake-apps-script.gs - a value starting with
// =, +, -, or @ is treated by Sheets as a formula, which is a real risk
// here since respondent name/notes/etc are free text the submitter controls.
function preventFormulaInjection(value) {
  if (typeof value === 'string' && /^[=+\-@]/.test(value)) {
    return "'" + value;
  }
  return value;
}

function sendStaffNotification(data) {
  const respondent = data.respondent || {};
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/edit';
  const supplierCount = (data.suppliers || []).length;

  MailApp.sendEmail({
    to: STAFF_NOTIFICATION_TO,
    subject: 'New TheActivePharm Supply Chain Intake Submission',
    body:
      'A new TheActivePharm supply chain intake just came in.\n\n' +
      'Respondent: ' + (respondent.name || 'Unknown') + (respondent.email ? ' (' + respondent.email + ')' : '') + '\n' +
      'Suppliers listed: ' + supplierCount + '\n\n' +
      'View the Sheet: ' + sheetUrl,
  });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
