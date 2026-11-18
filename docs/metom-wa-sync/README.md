# Metom WhatsApp Analytics Sync (GRATIS)

Sumber data: Google Analytics 4 (GA4) untuk website [metom.id](https://metom.id/).

Mengisi 3 tab yang sudah ada di Google Sheet **Metom Project Monitoring**:
- **WA Overview**: snapshot rolling 28 hari, total klik, pengguna unik WhatsApp, pengguna website, CTR serta ruang untuk chat/qualified lead yang diverifikasi admin.
- **WA Daily**: data harian, formulir manual chat valid dan qualified lead tetap aman.
- **WA CTA Detail**: halaman asal & posisi tombol (jika custom dimension terdaftar).

## Persiapan (sekali saja)

1. Buka [Metom Project Monitoring](https://docs.google.com/spreadsheets/d/1BfdfK5NbPmf1JgnAj_T-Ppmy_WBTMZ491whm8OtZyDQ/edit#gid=1881118001).
2. Di GA4, buka **Admin > Property Settings / Property Details**, salin **Property ID (angka)**, bukan Measurement ID `G-TTHXJRKZ49`.
3. Masukkan angka tersebut di tab **WA Overview!C6**.
4. Dari Google Sheets buka **Extensions > Apps Script**. Buat file baru bernama `MetomWaSync.gs` (jangan hapus script SEO/GSC yang ada).
5. Salin isi [Code.gs](./Code.gs) ke file baru, lalu Save.
6. Di Apps Script **Services > + > Google Analytics Data API** (service identifier `AnalyticsData`) lalu **Add**. Jika script memakai project Google Cloud standard, enable juga **Google Analytics Data API** di project tersebut; bila default Google Cloud project, Apps Script biasanya mengaktifkannya otomatis.
7. Dari dropdown Functions pilih `setupMetomWaSync`, klik Run, dan izinkan akun yang punya akses read ke property GA4 serta edit Google Sheets.
8. Cek tab WA Overview C4/C7 dan isi A18:E18 serta WA Daily A7:D. Trigger berjalan setiap hari sekitar pukul 10 WIB (Apps Script dapat menggeser eksekusi dalam rentang jam).

Sumber resmi: https://developers.google.com/apps-script/advanced/analyticsdata

## Prinsip data

- `whatsapp_click` adalah **klik tombol menuju WhatsApp**, bukan konfirmasi pesan WA sudah dikirim.
- `totalUsers` dan pengguna unik WhatsApp periode harus diambil dari query GA4 periode utuh; jangan jumlahkan pengguna unik dari per hari/per halaman.
- Form pop-up telah dimatikan; jangan aktifkan lagi hanya untuk tracking.
- Kolom input manual WA Daily F/G adalah chat valid dan qualified lead. Script ini tidak mengisi atau menghapusnya.
- Script menggunakan 28 hari yang berakhir 3 hari lalu agar data lebih stabil, tidak real-time.
- CTR = unique WhatsApp click users ÷ total website users; bukan total event clicks ÷ sessions.
- Pastikan custom dimension event-scoped **cta_position** terdaftar pada GA4 untuk detail posisi; jika belum, fallback berdasarkan halaman.

## Limitasi / akses

Kode bisa disiapkan tanpa biaya langganan dan menggunakan kuota standar Google; memerlukan izin OAuth dan Property ID GA4 sebelum data bisa diambil. Tidak menjamin jumlah klik terisi jika event tidak tercatat atau tidak ada akses. Jika sync gagal, cek Execution log, apakah service aktif, property ID benar, dan akun memiliki minimal Viewer GA4.

Google Analytics Data API quotas: https://developers.google.com/analytics/devguides/reporting/data/v1/quotas
Google Apps Script quotas: https://developers.google.com/apps-script/guides/services/quotas
