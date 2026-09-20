/**
 * Metom Lead Capture — Google Apps Script Web App
 * Target spreadsheet: Metom Project Monitoring
 * Sheet: Leads
 *
 * Security notes:
 * - public endpoint, but rejects malformed/automated submissions
 * - server-side validation and duplicate throttling
 * - spreadsheet formula-injection protection
 * - honeypot + minimum fill time
 */
const SPREADSHEET_ID = '1BfdfK5NbPmf1JgnAj_T-Ppmy_WBTMZ491whm8OtZyDQ';
const SHEET_NAME = 'Leads';
const FORM_TOKEN = 'metom-lead-v2';
const MIN_FILL_MS = 1200;
const DUPLICATE_TTL_SECONDS = 60;

function doGet() {
  return ContentService.createTextOutput('Metom lead endpoint is active.');
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function safeCell_(value, maxLen) {
  let text = String(value || '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);

  // Prevent Google Sheets formula injection.
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

function plain_(value, maxLen) {
  return String(value || '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

function throttleKey_(phone, need) {
  const raw = phone + '|' + need.toLowerCase();
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw);
  return 'lead_' + Utilities.base64EncodeWebSafe(digest).slice(0, 32);
}

function doPost(e) {
  try {
    const p = (e && e.parameter) ? e.parameter : {};

    // Simple bot checks. These are not secrets; they reduce generic automated abuse.
    if (plain_(p.form_token, 40) !== FORM_TOKEN) return json_({ok:false, error:'invalid_form'});
    if (plain_(p.website, 200) !== '') return json_({ok:false, error:'spam_rejected'});

    const startedAt = Number(p.started_at || 0);
    if (!startedAt || (Date.now() - startedAt) < MIN_FILL_MS) {
      return json_({ok:false, error:'too_fast'});
    }

    const name = plain_(p.name, 80);
    const phoneDigits = String(p.phone || '').replace(/\D/g, '').slice(0, 15);
    const needRaw = plain_(p.need, 800);

    if (name.length < 2) return json_({ok:false, error:'invalid_name'});
    if (phoneDigits.length < 9 || phoneDigits.length > 15) return json_({ok:false, error:'invalid_phone'});
    if (needRaw.length < 5) return json_({ok:false, error:'invalid_need'});

    const page = plain_(p.page || p.path, 500);
    if (page && !/^https:\/\/metom\.id(?:\/|$)/i.test(page) && !/^\//.test(page)) {
      return json_({ok:false, error:'invalid_page'});
    }

    const cache = CacheService.getScriptCache();
    const throttleKey = throttleKey_(phoneDigits, needRaw);
    if (cache.get(throttleKey)) return json_({ok:true, duplicate:true});
    cache.put(throttleKey, '1', DUPLICATE_TTL_SECONDS);

    const row = [
      new Date(),
      safeCell_(name, 80),
      safeCell_(p.phone, 24),
      safeCell_(needRaw, 800),
      safeCell_(page, 500),
      safeCell_(p.cta_position, 60),
      safeCell_(p.utm_source, 120),
      safeCell_(p.utm_medium, 120),
      safeCell_(p.utm_campaign, 160),
      safeCell_(p.referrer, 500),
      'New',
      ''
    ];

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const sheet = ss.getSheetByName(SHEET_NAME);
      if (!sheet) throw new Error('Leads sheet not found.');
      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    return json_({ok:true});
  } catch (error) {
    console.error(error);
    return json_({ok:false, error:'server_error'});
  }
}
