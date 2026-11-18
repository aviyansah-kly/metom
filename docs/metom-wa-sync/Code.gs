/**
 * Metom GA4 -> Google Sheets (gratis, tanpa Supermetrics)
 * Tambahkan file ini ke Apps Script milik spreadsheet "Metom Project Monitoring".
 * Sebelum run: Services > + > Google Analytics Data API (AnalyticsData) > Add.
 * Isi GA4 Property ID numerik pada WA Overview!C6, bukan Measurement ID G-TTHXJRKZ49.
 *
 * Aman bagi tab SEO dan Leads: hanya mengubah tab WA Overview, WA Daily,
 * dan WA CTA Detail. Manual chat valid/qualified di WA Daily F:G tidak ditimpa.
 */
const METOM_WA_SHEET_ID = '1BfdfK5NbPmf1JgnAj_T-Ppmy_WBTMZ491whm8OtZyDQ';
const METOM_WA_EVENT = 'whatsapp_click';
const METOM_WA_TIMEZONE = 'Asia/Jakarta';
const METOM_WA_START_DAYS_AGO = 30;
const METOM_WA_END_DAYS_AGO = 3; // GA4 biasanya lebih stabil setelah pemrosesan.

function setupMetomWaSync() {
  // Validasi konfigurasi/akses terlebih dahulu, jangan memasang trigger gagal.
  syncMetomWaAnalytics();
  const existing = ScriptApp.getProjectTriggers().filter(
    trigger => trigger.getHandlerFunction() === 'syncMetomWaAnalytics'
  );
  if (!existing.length) {
    ScriptApp.newTrigger('syncMetomWaAnalytics').timeBased().everyDays(1).atHour(10).inTimezone(METOM_WA_TIMEZONE).create();
  }
  console.log('Metom WhatsApp tracking: sync sukses dan trigger harian aktif.');
}

function syncMetomWaAnalytics() {
  const ss = SpreadsheetApp.openById(METOM_WA_SHEET_ID);
  const overview = metomGetTab_(ss, 'WA Overview');
  const daily = metomGetTab_(ss, 'WA Daily');
  const detail = metomGetTab_(ss, 'WA CTA Detail');
  const propertyId = String(overview.getRange('C6').getDisplayValue()).trim();
  if (!/^\d{5,}$/.test(propertyId)) {
    throw new Error('Isi GA4 Property ID numerik pada WA Overview!C6. Ini berbeda dari G-TTHXJRKZ49.');
  }
  if (typeof AnalyticsData === 'undefined') {
    throw new Error('Aktifkan Apps Script Services > Google Analytics Data API (AnalyticsData).');
  }

  const dates = [{startDate: METOM_WA_START_DAYS_AGO + 'daysAgo', endDate: METOM_WA_END_DAYS_AGO + 'daysAgo'}];
  const eventFilter = {filter:{fieldName:'eventName',stringFilter:{matchType:'EXACT',value:METOM_WA_EVENT}}};
  const query = (dimensions, metrics, filtered) => {
    const request = {
      dateRanges: dates,
      metrics: metrics.map(name => ({name:name})),
      ...(dimensions.length ? {dimensions:dimensions.map(name=>({name:name}))} : {}),
      ...(filtered ? {dimensionFilter:eventFilter} : {})
    };
    return AnalyticsData.Properties.runReport(request, 'properties/' + propertyId);
  };

  // Agregasi 28 hari: pengguna unik periode dihitung oleh GA4 langsung,
  // bukan menjumlahkan daily unique users.
  const total = query([], ['totalUsers'], false);
  const waTotal = query(['eventName'], ['eventCount','totalUsers'], true);
  const totalUsers = metomMetric_(total,0,0);
  const waClicks = metomMetric_(waTotal,0,0);
  const waUsers = metomMetric_(waTotal,0,1);
  const end = metomDateAgo_(METOM_WA_END_DAYS_AGO);
  const start = metomDateAgo_(METOM_WA_START_DAYS_AGO);
  const syncedAt = new Date();

  // Snapshot: A:E dan J:L saja. F/I berisi ARRAYFORMULA;
  // G:H adalah jumlah chat yang hanya boleh diisi setelah diverifikasi admin.
  const snapshotDates = overview.getRange(18,1,183,1).getDisplayValues();
  let snapshotIndex = snapshotDates.findIndex(r=>String(r[0]).trim()===end);
  if (snapshotIndex<0) snapshotIndex=snapshotDates.findIndex(r=>!String(r[0]).trim());
  if (snapshotIndex<0) throw new Error('WA Overview penuh (A18:A200), perlu menambah baris histori sebelum sync.');
  const snapshotRow = 18 + snapshotIndex;
  overview.getRange(snapshotRow,1,1,5).setValues([[end,start,totalUsers,waClicks,waUsers]]);
  overview.getRange(snapshotRow,10,1,3).setValues([[syncedAt,'Google Analytics Data API / whatsapp_click','28 hari final, klik CTA (bukan pesan WA terkirim)']]);
  overview.getRange(snapshotRow,10).setNumberFormat('yyyy-mm-dd hh:mm');

  // Harian: upsert 28 tanggal, simpan input manual F/G dan formula spill E.
  const allUsersDaily = query(['date'], ['totalUsers'], false);
  const waDaily = query(['date','eventName'], ['eventCount','totalUsers'], true);
  const lookup = Object.create(null);
  for (const row of (allUsersDaily.rows || [])) {
    const key=metomDateFromGa_(row.dimensionValues[0].value);
    lookup[key]={users:Number(row.metricValues[0].value||0),clicks:0,waUsers:0};
  }
  for (const row of (waDaily.rows || [])) {
    const key=metomDateFromGa_(row.dimensionValues[0].value);
    lookup[key]??={users:0,clicks:0,waUsers:0};
    lookup[key].clicks=Number(row.metricValues[0].value||0);
    lookup[key].waUsers=Number(row.metricValues[1].value||0);
  }
  const dailyDates=daily.getRange(7,1,494,1).getDisplayValues().map(x=>String(x[0]).trim());
  let updated=0;
  for(let offset=METOM_WA_START_DAYS_AGO;offset>=METOM_WA_END_DAYS_AGO;offset--){
    const date=metomDateAgo_(offset);
    const values=lookup[date]||{users:0,clicks:0,waUsers:0};
    let idx=dailyDates.indexOf(date);
    if(idx<0) idx=dailyDates.indexOf('');
    if(idx<0) throw new Error('WA Daily penuh, perlu tambah row.');
    const row=7+idx;
    daily.getRange(row,1,1,4).setValues([[date,values.users,values.clicks,values.waUsers]]);
    daily.getRange(row,8,1,2).setValues([['GA4 Data API',syncedAt]]);
    dailyDates[idx]=date;
    updated++;
  }

  // Breakdown: coba custom dimension CTA Position jika sudah diregistrasi GA4;
  // jika belum, tetap tulis rincian pagePath (tanpa mengarang nilai posisi).
  let breakdown, includesPosition=true;
  try{
    breakdown=query(['pagePath','customEvent:cta_position','eventName'],['eventCount','totalUsers'],true);
  }catch(err){
    includesPosition=false;
    console.log('Custom dimension cta_position belum tersedia; fallback ke pagePath: '+err);
    breakdown=query(['pagePath','eventName'],['eventCount','totalUsers'],true);
  }
  const values=(breakdown.rows||[]).slice(0,345).map(row=>[
    end,start,
    row.dimensionValues[0].value,
    includesPosition ? row.dimensionValues[1].value : 'Belum terdaftar',
    Number(row.metricValues[0].value||0),
    Number(row.metricValues[1].value||0),
    syncedAt,
    'GA4 Data API'
  ]);
  detail.getRange(6,1,345,8).clearContent();
  if(values.length)detail.getRange(6,1,values.length,8).setValues(values);
  detail.getRange('G6:G350').setNumberFormat('yyyy-mm-dd hh:mm');

  overview.getRange('C4').setValue('Terhubung — otomatis via Google Apps Script (gratis)');
  console.log('Metom WA sinkron sukses: '+start+'..'+end+', clicks='+waClicks+', users='+waUsers+', daily='+updated+', CTA rows='+values.length);
}
function metomGetTab_(ss,name){
  const sheet=ss.getSheetByName(name);
  if(!sheet)throw new Error('Sheet tidak ditemukan: '+name);
  return sheet;
}
function metomMetric_(response,rowIndex,metricIndex){
  return Number(response.rows?.[rowIndex]?.metricValues?.[metricIndex]?.value||0);
}
function metomDateAgo_(days){
  return Utilities.formatDate(
    new Date(Date.now()-days*86400000), METOM_WA_TIMEZONE,'yyyy-MM-dd'
  );
}
function metomDateFromGa_(yyyymmdd){
  return yyyymmdd.slice(0,4)+'-'+yyyymmdd.slice(4,6)+'-'+yyyymmdd.slice(6,8);
}
