# Metom GSC → Google Sheet (otomatis)

Script hanya **membaca** Search Console property `sc-domain:metom.id` lalu **menulis** 5 tab laporan di spreadsheet Metom Project Monitoring. Tidak meminta password Gmail, tidak mengakses Gmail/Drive, dan tidak mengubah properti Search Console. Sumber resmi: Google Search Analytics API.

## Status
- Struktur tab sudah dibuat.
- Source code dan manifest siap.
- **Belum aktif** sampai owner akun Google menjalankan otorisasi satu kali di Apps Script.
- Belum ada data SEO yang ditarik secara otomatis; jangan menyamakan angka screenshot lama dengan data API.

## Aktivasi sekali, bisa lewat laptop atau Safari iPhone mode Desktop
1. Masuk akun Google yang punya akses ke GSC `metom.id`, lalu buka [script.google.com/home/projects/create](https://script.google.com/home/projects/create).
2. Nama proyek: `Metom GSC Sync`. Salin isi [Code.gs](./Code.gs) ke editor `Code.gs`.
3. **Project Settings** → centang *Show "appsscript.json" manifest file in editor*; ganti manifest dengan isi [appsscript.json](./appsscript.json).
4. Save → pilih fungsi `setupMetomGsc` → **Run** → izinkan scope **Search Console readonly**, **Sheets**, **URL Fetch**, **manage own script triggers**. Jangan menyetujui izin Gmail/Drive karena tidak dibutuhkan.
5. Cek tab `SEO Overview` dan `SEO Sync Log`. Data akan diperbarui otomatis **setiap pagi kira-kira 08.00–09.00 WIB** oleh trigger buatan akun owner.

Jika editor sulit dipakai dari HP, tahap otorisasi dapat dilakukan saat memakai laptop; tab spreadsheet tetap siap sekarang. Bila Google menampilkan peringatan *unverified*, periksa nama proyek, akun, dan seluruh kode/scope sebelum melanjutkan. Jangan lakukan jika proyek bukan buatan sendiri.

## Laporan
- `SEO Overview`: ringkasan klik, impresi, CTR, posisi rata-rata untuk rolling 28 hari final.
- `SEO Queries`: pencarian dengan klik, impresi, CTR, posisi.
- `SEO Pages`: performa tiap URL.
- `SEO Daily`: tren harian.
- `SEO Sync Log`: catatan berhasil/gagal.
Data diambil sampai H-3 menurut tanggal **Pacific Time** (zona waktu GSC); jangan membandingkan langsung dengan screenshot yang memakai rentang berbeda. Data query dapat dibatasi/top rows oleh API. **Index coverage** tidak tersedia lewat Search Analytics API; tetap cek laporan Pages/URL Inspection untuk masalah pengindeksan.

## Troubleshooting
- `403 insufficientPermissions`: jalankan ulang `setupMetomGsc` dengan akun yang punya akses ke Domain Property `metom.id`, verifikasi 4 scope manifest.
- `403 API not enabled`: enable **Google Search Console API** pada project Google Cloud yang terkait Apps Script bila diminta.
- `SEO Sync Log` ERROR: baca pesan error; data tab lama sengaja dipertahankan bila permintaan API gagal.
