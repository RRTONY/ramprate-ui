# NuAmino needs analysis form

Private page: `/nuamino-needs-analysis`. Separate from Active Pharm. The questions and preliminary understandings are in `src/lib/nuamino-needs-fields.ts`.

## Google Sheet setup required before publishing

The site endpoint `/api/nuamino-needs-analysis` posts validated submissions server-side to the URL in `NUAMINO_NEEDS_SCRIPT_URL`. This must be a **new NuAmino-only Google Apps Script web app**. Never reuse `ACTIVE_PHARM_INTAKE_SCRIPT_URL`, since that would mix customer submissions.

1. Create a new Google Sheet titled `NuAmino Needs Analysis - Responses`.
2. From that Sheet, choose Extensions > Apps Script, paste the script below and save.
3. Deploy > New deployment > Web app. Execute as the Sheet owner and allow incoming requests per approved company policy. Copy the generated `/exec` URL.
4. An administrator must add the `NUAMINO_NEEDS_SCRIPT_URL` environment variable in Netlify, then redeploy the website. The RampRate AI connector cannot change Netlify secrets or deploy Apps Script.
5. Submit a test response with a non-sensitive test account and confirm it appears in the Google Sheet before sharing the questionnaire.

Do not publish or distribute the questionnaire as a working intake until the end-to-end test succeeds.

```javascript
const FIELDS = [
  "licensing",
  "nevadaPeptides",
  "facilities",
  "lab",
  "customers",
  "revenue",
  "ip",
  "capacity",
  "portfolio",
  "funding",
  "marketRole",
  "catalog",
  "pricing",
  "moq",
  "leadTime",
  "terms",
  "shipping",
  "buyers",
  "monthlyCapacity",
  "stabilityTesting",
  "buyerMix",
  "partnershipModel",
  "idealCustomer",
  "avoidChannels",
  "growthTarget",
  "priorityProducts",
  "branding",
  "documentation",
  "availableCapacity",
  "scaleTrigger",
  "newBuyerTerms",
  "margins",
  "criteria",
  "exclusivity",
];

function safeCell(value) {
  const raw = String(value ?? "");
  return /^[=+@\-]/.test(raw) ? "'" + raw : raw;
}

function doPost(event) {
  try {
    const data = JSON.parse(event.postData.contents);
    if (
      data.form !== "NuAmino needs analysis" ||
      !data.respondent?.name ||
      !data.respondent?.email ||
      !data.answers?.stabilityTesting
    ) {
      throw new Error("Missing required fields");
    }
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Responses") ||
      SpreadsheetApp.getActiveSpreadsheet().insertSheet("Responses");
    const headers = [
      "Received at",
      "Respondent",
      "Email",
      "Title",
      "Intake scope",
    ]
      .concat(
        FIELDS.flatMap((name) => [name + " confirmation", name + " answer"]),
      )
      .concat(["Raw submission (JSON)"]);
    if (sheet.getLastRow() === 0) sheet.appendRow(headers);
    const row = [
      new Date(),
      safeCell(data.respondent.name),
      safeCell(data.respondent.email),
      safeCell(data.respondent.title),
      safeCell(data.verification?.intakeScope),
      ...FIELDS.flatMap((name) => [
        safeCell(data.verification?.[name]),
        safeCell(data.answers?.[name]),
      ]),
      safeCell(JSON.stringify(data)),
    ];
    sheet.appendRow(row);
    return ContentService.createTextOutput(
      JSON.stringify({ ok: true }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(error) }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

The web app should be made accessible only through the reviewed deployment policy. If publicly callable, Google Apps Script cannot enforce robust caller authentication by itself; prioritize access control and anti-abuse measures before sharing broadly. The endpoint does not send email and stores all text answers and confirmation choices in separate columns plus a raw JSON record.
