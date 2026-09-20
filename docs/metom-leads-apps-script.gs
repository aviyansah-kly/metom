/**
 * Metom Lead Capture — Google Apps Script Web App
 * Target spreadsheet: Metom Project Monitoring
 * Sheet: Leads
 */
const SPREADSHEET_ID = '1BfdfK5NbPmf1JgnAj_T-Ppmy_WBTMZ491whm8OtZyDQ';
const SHEET_NAME = 'Leads';

function doGet() {
  return ContentService.createTextOutput('Metom lead endpoint is active.');
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error('Leads sheet not found.');

    const p = (e && e.parameter) ? e.parameter : {};
    const clean = value => String(value || '').replace(/[\r\n]+/g, ' ').trim();

    const row = [
      new Date(),
      clean(p.name),
      clean(p.phone),
      clean(p.need),
      clean(p.page || p.path),
      clean(p.cta_position),
      clean(p.utm_source),
      clean(p.utm_medium),
      clean(p.utm_campaign),
      clean(p.referrer),
      'New',
      ''
    ];

    sheet.appendRow(row);
    return ContentService
      .createTextOutput(JSON.stringify({ok:true}))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
