/**
 * METOM — Google Search Console -> Metom Project Monitoring
 * Manual one-time setup: run setupMetomGsc() from Apps Script editor.
 * After successful authorization, the script refreshes automatically every
 * morning around 08:00–09:00 WIB. It only reads Search Console traffic data.
 */
const METOM_GSC = Object.freeze({
  spreadsheetId: '1BfdfK5NbPmf1JgnAj_T-Ppmy_WBTMZ491whm8OtZyDQ',
  property: 'sc-domain:metom.id',
  endpoint: 'https://www.googleapis.com/webmasters/v3/sites/',
  timezone: 'Asia/Jakarta',
  searchTimezone: 'America/Los_Angeles',
  days: 28,
  finalLagDays: 3,
  queryLimit: 1000,
  pageLimit: 1000,
});

function setupMetomGsc() {
  // This first run prompts for OAuth scopes; no password or API key is stored.
  syncMetomGsc();
  const existing = ScriptApp.getProjectTriggers().filter(
    t => t.getHandlerFunction() === 'syncMetomGsc'
  );
  if (!existing.length) {
    ScriptApp.newTrigger('syncMetomGsc')
      .timeBased().everyDays(1).atHour(8)
      .inTimezone(METOM_GSC.timezone).create();
  }
  SpreadsheetApp.openById(METOM_GSC.spreadsheetId)
    .getSheetByName('SEO Overview').getRange('B3')
    .setValue('Aktif — sinkron otomatis setiap pagi sekitar pukul 08.00 WIB');
  Logger.log('Metom GSC connected and daily trigger installed.');
}

function syncMetomGsc() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) throw new Error('Another Metom GSC sync is running.');
  try {
    const ss = SpreadsheetApp.openById(METOM_GSC.spreadsheetId);
    const window = metomDateWindow_();
    const syncTime = Utilities.formatDate(new Date(), METOM_GSC.timezone, 'yyyy-MM-dd HH:mm:ss');
    const base = {startDate: window.start, endDate: window.end, type: 'web', dataState: 'final'};

    const summary = metomQuery_({...base, aggregationType:'byProperty', rowLimit:1});
    const queries = metomQuery_({...base, dimensions:['query'], rowLimit:METOM_GSC.queryLimit});
    const pages = metomQuery_({...base, dimensions:['page'], aggregationType:'byPage', rowLimit:METOM_GSC.pageLimit});
    const daily = metomQuery_({...base, dimensions:['date'], aggregationType:'byProperty', rowLimit:100});

    const qRows = (queries.rows || []).map(r => [
      r.keys[0], r.clicks, r.impressions, r.ctr, r.position, window.start, window.end, syncTime
    ]);
    const pRows = (pages.rows || []).map(r => [
      r.keys[0], r.clicks, r.impressions, r.ctr, r.position, window.start, window.end, syncTime
    ]);
    const dRows = (daily.rows || []).map(r => [
      r.keys[0], r.clicks, r.impressions, r.ctr, r.position, syncTime
    ]).sort((a,b) => a[0].localeCompare(b[0]));

    // Complete all API requests before replacing any previous report data.
    metomReplaceRows_(ss.getSheetByName('SEO Queries'), qRows, 8);
    metomReplaceRows_(ss.getSheetByName('SEO Pages'), pRows, 8);
    metomReplaceRows_(ss.getSheetByName('SEO Daily'), dRows, 6);

    const total = (summary.rows || [])[0] || {clicks:0, impressions:0, ctr:0, position:0};
    const overview = ss.getSheetByName('SEO Overview');
    overview.getRange('B4:B11').setValues([
      [syncTime], [window.start + ' s.d. ' + window.end + ' (tanggal Search Console/PT)'],
      [total.clicks], [total.impressions], [total.impressions ? total.ctr : '—'],
      [total.impressions ? total.position : '—'], [qRows.length], [pRows.length],
    ]);
    overview.getRange('B8').setNumberFormat('0.0%');
    overview.getRange('B9').setNumberFormat('0.0');
    metomAppendLog_(ss, [syncTime, 'SUCCESS', window.start + ' — ' + window.end,
      qRows.length, pRows.length, dRows.length, 'Data final Search Analytics']);
  } catch (err) {
    try {
      const ss = SpreadsheetApp.openById(METOM_GSC.spreadsheetId);
      const ts = Utilities.formatDate(new Date(), METOM_GSC.timezone, 'yyyy-MM-dd HH:mm:ss');
      metomAppendLog_(ss, [ts, 'ERROR', '', '', '', '', String(err.message || err).slice(0,400)]);
      ss.getSheetByName('SEO Overview').getRange('B3').setValue('Perlu pemeriksaan — lihat SEO Sync Log');
    } catch (logErr) { console.error('Could not record failure: ' + logErr); }
    throw err;
  } finally {
    lock.releaseLock();
  }
}

function metomDateWindow_() {
  // GSC dates use Pacific time, not the spreadsheet's WIB timezone.
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const date = offset => Utilities.formatDate(
    new Date(now - offset * day), METOM_GSC.searchTimezone, 'yyyy-MM-dd'
  );
  return {
    start: date(METOM_GSC.finalLagDays + METOM_GSC.days - 1),
    end: date(METOM_GSC.finalLagDays),
  };
}

function metomQuery_(payload) {
  const url = METOM_GSC.endpoint + encodeURIComponent(METOM_GSC.property)
    + '/searchAnalytics/query';
  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    headers: {Authorization: 'Bearer ' + ScriptApp.getOAuthToken()},
    muteHttpExceptions: true,
  });
  const code = response.getResponseCode();
  if (code < 200 || code >= 300) {
    throw new Error('Search Console API HTTP ' + code + ': '
      + response.getContentText().slice(0,300));
  }
  return JSON.parse(response.getContentText());
}

function metomReplaceRows_(sheet, rows, cols) {
  if (!sheet) throw new Error('Missing SEO report sheet.');
  const targetRows = Math.max(1, rows.length);
  if (sheet.getMaxRows() < targetRows + 1) {
    sheet.insertRowsAfter(sheet.getMaxRows(), targetRows + 1 - sheet.getMaxRows());
  }
  sheet.getRange(2, 1, sheet.getMaxRows() - 1, cols).clearContent();
  if (rows.length) sheet.getRange(2, 1, rows.length, cols).setValues(rows);
  if (rows.length) {
    const ctrCol = sheet.getName() === 'SEO Daily' ? 4 : 4;
    sheet.getRange(2, ctrCol, rows.length, 1).setNumberFormat('0.0%');
    sheet.getRange(2, 5, rows.length, 1).setNumberFormat('0.0');
  }
}

function metomAppendLog_(ss, row) {
  const log = ss.getSheetByName('SEO Sync Log');
  if (!log) throw new Error('Missing SEO Sync Log sheet.');
  log.appendRow(row);
}
