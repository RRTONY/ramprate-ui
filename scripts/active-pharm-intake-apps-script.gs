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

// Submissions from this address skip the staff email and are what
// removeTestSubmissions() deletes - use it for any end-to-end test.
const TEST_EMAIL = 'apf-test@example.com';

// The original questionnaire tabs. Every submission also fills their yellow
// input cells (latest submission wins - the Responses tab keeps full history,
// and "Intake -> Fill tabs from selected response row" re-fills an older one).
const TAB_BUDGET = '1a. Budget & Priorities';
const TAB_SUPPLIERS = '1b. Supplier Inventory';
const TAB_GROWTH = '1c. Growth & Capacity Expansion';
const TAB_SURVEY_RESPONDENT = '2a. Survey - By Respondent';
// 2b says "copy this tab for each supplier covered" - the original stays as
// a blank template and each submission gets one filled copy per supplier,
// named with this prefix so the next fill can find and replace them.
const TAB_SURVEY_SUPPLIER = '2b. Survey - By Supplier';
const SUPPLIER_COPY_PREFIX = '2b - ';
const COMPANY_NAME = 'TheActivePharm';
const RAW_JSON_HEADER = 'Raw Submission (JSON)';
// Sheets rejects any cell over 50,000 chars, which would fail the whole row.
const MAX_CELL_CHARS = 49000;

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Intake')
    .addItem('Fill tabs from selected response row', 'fillTabsFromSelectedResponse')
    .addItem('Remove test submissions', 'removeTestSubmissions')
    .addToUi();
}

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

    // The Responses row is already saved, so a tab layout problem (renamed
    // tab, moved section) must never turn into a failed submission.
    try {
      fillFormTabs(data);
    } catch (fillErr) {
      console.error('fillFormTabs failed: ' + fillErr);
    }

    lock.releaseLock();

    const isTest = ((data.respondent && data.respondent.email) || '').toLowerCase() === TEST_EMAIL;
    try {
      if (!isTest) sendStaffNotification(data);
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

  // FIXED (found via a real end-to-end test 2026-09-21): this used to
  // interpolate the client's own free-text otherLabel straight into the
  // column header ('Priority: ' + otherLabel), so every submission with
  // different custom "Other" text created a brand-new Sheet column instead
  // of reusing one - confirmed live, two test submissions with different
  // otherLabel text produced two separate columns. Column header is now
  // always fixed; the free text goes in its own column below instead.
  PRIORITY_ITEMS.forEach(function (item) {
    row['Priority: ' + item.label] = ranks[item.key] !== undefined ? ranks[item.key] : '';
  });
  row['Priority: Other - Description'] = priorities.otherLabel || '';

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

  const raw = JSON.stringify(data);
  row[RAW_JSON_HEADER] = raw.length <= MAX_CELL_CHARS ? raw : '(too large to store - refill from this row unavailable)';

  return row;
}

// ---------------------------------------------------------------------------
// Filling the questionnaire tabs (1a / 1b / 1c / 2a / 2b copies)
// ---------------------------------------------------------------------------

function fillFormTabs(data) {
  data = data || {};
  const ss = SpreadsheetApp.openById(SHEET_ID);
  fillBudgetTab(ss.getSheetByName(TAB_BUDGET), data);
  fillSupplierTab(ss.getSheetByName(TAB_SUPPLIERS), data.suppliers || []);
  fillGrowthTab(ss.getSheetByName(TAB_GROWTH), data.growth || {});
  fillRespondentSurveyTab(ss.getSheetByName(TAB_SURVEY_RESPONDENT), data);
  rebuildSupplierSurveyTabs(ss, data);
}

function contactLine(respondent) {
  return [respondent.email, respondent.phone].filter(Boolean).join(' / ');
}

function fillRespondentSurveyTab(sh, data) {
  if (!sh) return console.warn('Tab not found: ' + TAB_SURVEY_RESPONDENT);
  const respondent = data.respondent || {};
  const ranks = (data.priorities && data.priorities.ranks) || {};
  const supplierNames = (data.suppliers || []).map(function (s) { return s.name; }).filter(Boolean);

  writeBlock(sh.getRange('C4:C7'), [
    [respondent.name ? COMPANY_NAME : ''],
    [respondent.name],
    [contactLine(respondent)],
    [supplierNames.join(', ')],
  ]);
  writeBlock(sh.getRange(29, 3, PRIORITY_ITEMS.length, 1), PRIORITY_ITEMS.map(function (item) {
    return [ranks[item.key]];
  }));
}

function rebuildSupplierSurveyTabs(ss, data) {
  const template = ss.getSheetByName(TAB_SURVEY_SUPPLIER);
  if (!template) return console.warn('Tab not found: ' + TAB_SURVEY_SUPPLIER);

  ss.getSheets().forEach(function (sh) {
    if (sh.getName().indexOf(SUPPLIER_COPY_PREFIX) === 0) ss.deleteSheet(sh);
  });

  const respondent = data.respondent || {};
  const used = {};
  (data.suppliers || []).forEach(function (s, i) {
    let name = SUPPLIER_COPY_PREFIX + (String(s.name || '').replace(/[\[\]*?:\/\\]/g, ' ').trim() || 'Supplier ' + (i + 1)).slice(0, 80);
    for (let n = 2; used[name.toLowerCase()]; n++) name = name.replace(/ \(\d+\)$/, '') + ' (' + n + ')';
    used[name.toLowerCase()] = true;

    const copy = ss.insertSheet(name, template.getIndex() + i, { template: template });
    writeBlock(copy.getRange('C4:C8'), [
      [COMPANY_NAME],
      [respondent.name],
      [contactLine(respondent)],
      [s.name],
      [s.category],
    ]);
  });
}

// Cell addresses match the yellow input cells on the tab as of 2026-09-24.
function fillBudgetTab(sh, data) {
  if (!sh) return console.warn('Tab not found: ' + TAB_BUDGET);
  const respondent = data.respondent || {};
  const budget = data.budget || {};
  const categories = budget.categories || [];
  const priorities = data.priorities || {};
  const ranks = priorities.ranks || {};

  writeBlock(sh.getRange('C6:C8'), [[respondent.name], [respondent.email], [respondent.phone]]);
  writeBlock(sh.getRange('C12:C13'), [[fmtUSD(budget.centralTotal)], [fmtUSD(budget.decentralTotal)]]);
  writeBlock(sh.getRange(19, 3, BUDGET_CATEGORIES.length, 2), BUDGET_CATEGORIES.map(function (_, i) {
    const cat = categories[i] || {};
    return [fmtUSD(cat.amount), cat.notes];
  }));
  writeBlock(sh.getRange('C32:C33'), [[priorities.initiatives], [priorities.savingsUse]]);
  writeBlock(sh.getRange(36, 3, PRIORITY_ITEMS.length, 1), PRIORITY_ITEMS.map(function (item) {
    return [ranks[item.key]];
  }));
  writeBlock(sh.getRange('D42'), [[priorities.otherLabel ? 'Other: ' + priorities.otherLabel : '']]);
}

const SUPPLIER_FIRST_ROW = 11;
const SUPPLIER_LAST_ROW = 25;

// Columns B..M. Rows 6-7 are the tab's own samples and 8-10 its
// "<$50K" rows, so real entries start at row 11.
function fillSupplierTab(sh, suppliers) {
  if (!sh) return console.warn('Tab not found: ' + TAB_SUPPLIERS);
  const lastRow = growBlock(sh, SUPPLIER_FIRST_ROW, Math.max(SUPPLIER_LAST_ROW, sh.getLastRow()), suppliers.length);
  const values = [];
  for (let r = SUPPLIER_FIRST_ROW; r <= lastRow; r++) {
    const s = suppliers[r - SUPPLIER_FIRST_ROW];
    values.push(s ? [
      s.name, s.category, fmtUSD(s.spend), s.geography, s.states, s.startDate,
      s.endDate, s.renewal, s.pendingChanges, s.certifications, s.owner, s.notes,
    ] : new Array(12).fill(''));
  }
  writeBlock(sh.getRange(SUPPLIER_FIRST_ROW, 2, values.length, 12), values);
}

const GROWTH_FIRST_ROW = 13;

// Rows 13 up to two rows above the "Expansion Budget" heading, columns A..I.
// The heading is looked up by text rather than hardcoded because inserting
// overflow rows pushes it down.
function fillGrowthTab(sh, growth) {
  if (!sh) return console.warn('Tab not found: ' + TAB_GROWTH);
  const rows = growth.rows || [];

  writeBlock(sh.getRange('D5:D6'), [[growth.isDriver], [growth.driverDescription]]);

  let budgetRow = findRowInColumnA(sh, 'Expansion Budget');
  if (!budgetRow) return console.warn('"Expansion Budget" heading not found on ' + TAB_GROWTH);
  const lastRow = growBlock(sh, GROWTH_FIRST_ROW, budgetRow - 2, rows.length);
  budgetRow += lastRow - (budgetRow - 2);

  const values = [];
  for (let r = GROWTH_FIRST_ROW; r <= lastRow; r++) {
    const g = rows[r - GROWTH_FIRST_ROW];
    values.push(g ? [
      g.geography, g.category, g.product, g.currentVolume, g.desiredVolume,
      g.basis, g.targetDate, g.canFlex, g.notes,
    ] : new Array(9).fill(''));
  }
  writeBlock(sh.getRange(GROWTH_FIRST_ROW, 1, values.length, 9), values);

  const amount = fmtUSD(growth.budgetAmount);
  const amountText = amount === '' ? '' : '$' + amount.toLocaleString('en-US');
  writeBlock(sh.getRange(budgetRow + 1, 4, 2, 1), [
    [growth.hasSeparateBudget],
    [[amountText, growth.budgetPeriod].filter(Boolean).join(' - ')],
  ]);
}

// Inserts rows inside the block (before its last row, so formatting and
// drop-downs carry over) when a submission has more entries than the tab
// has slots. Returns the block's new last row.
function growBlock(sh, firstRow, lastRow, needed) {
  const extra = needed - (lastRow - firstRow + 1);
  if (extra > 0) {
    sh.insertRowsBefore(lastRow, extra);
    return lastRow + extra;
  }
  return lastRow;
}

function findRowInColumnA(sh, text) {
  const cell = sh.getRange('A:A').createTextFinder(text).matchEntireCell(true).findNext();
  return cell ? cell.getRow() : 0;
}

// Writes values into a range, turning Yes/No answers into ticked/unticked
// boxes for any cell that has a checkbox, so checkboxes can be added to the
// tabs later without touching this script.
function writeBlock(range, values) {
  const rules = range.getDataValidations();
  range.setValues(values.map(function (row, r) {
    return row.map(function (value, c) { return toCellValue(value, rules[r][c]); });
  }));
}

function toCellValue(value, rule) {
  if (rule && rule.getCriteriaType() === SpreadsheetApp.DataValidationCriteria.CHECKBOX) {
    const custom = rule.getCriteriaValues();
    const yes = value === true || /^(yes|y|true|x)$/i.test(String(value === undefined || value === null ? '' : value).trim());
    if (custom.length) return yes ? custom[0] : (custom.length > 1 ? custom[1] : '');
    return yes;
  }
  if (value === undefined || value === null) return '';
  return preventFormulaInjection(value);
}

// ---------------------------------------------------------------------------
// Sheet menu actions (run from the spreadsheet, not reachable via the web app)
// ---------------------------------------------------------------------------

function fillTabsFromSelectedResponse() {
  const ui = SpreadsheetApp.getUi();
  const sheet = getOrCreateResponsesSheet();
  const active = SpreadsheetApp.getActiveSheet();
  const rowNum = active.getActiveCell().getRow();
  if (active.getName() !== RESPONSES_TAB_NAME || rowNum < 2) {
    ui.alert('Open the "' + RESPONSES_TAB_NAME + '" tab and click any cell in the response row you want, then run this again.');
    return;
  }
  const data = readRawSubmission(sheet, rowNum);
  if (!data) {
    ui.alert('Row ' + rowNum + ' has no stored submission data (it was saved before this feature existed, or was too large).');
    return;
  }
  fillFormTabs(data);
  ui.alert('Tabs 1a, 1b, 1c, 2a and the per-supplier 2b tabs now show the response from row ' + rowNum + '.');
}

function readRawSubmission(sheet, rowNum) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const col = headers.indexOf(RAW_JSON_HEADER) + 1;
  if (!col) return null;
  try {
    return JSON.parse(sheet.getRange(rowNum, col).getValue());
  } catch (err) {
    return null;
  }
}

// Deletes Responses rows submitted with TEST_EMAIL, then re-fills the tabs
// from the latest remaining real response (or clears them if there is none).
function removeTestSubmissions() {
  const sheet = getOrCreateResponsesSheet();
  const lastRow = sheet.getLastRow();
  let removed = 0;

  // No early return when there are no rows to delete - the tabs below still
  // need resetting even if the Responses rows were already removed by hand.
  if (lastRow >= 2) {
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const emailCol = headers.indexOf('Respondent Email') + 1;
    if (emailCol) {
      const emails = sheet.getRange(2, emailCol, lastRow - 1, 1).getValues();
      for (let i = emails.length - 1; i >= 0; i--) {
        if (String(emails[i][0]).trim().toLowerCase() === TEST_EMAIL) {
          sheet.deleteRow(i + 2);
          removed++;
        }
      }
    }
  }

  let latest = null;
  for (let r = sheet.getLastRow(); r >= 2 && !latest; r--) latest = readRawSubmission(sheet, r);
  fillFormTabs(latest || {});

  console.log('Removed ' + removed + ' test submission(s).');
  try {
    SpreadsheetApp.getUi().alert('Removed ' + removed + ' test submission(s).');
  } catch (noUiErr) { /* run from the script editor, not the sheet */ }
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
