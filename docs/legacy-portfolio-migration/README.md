# Migrasi aset Metom lama → metom.id (draft, belum publikasi)

Sumber: https://www.metomdesign.com/ (halaman utama dan layanan; ditinjau 28 September 2026). **Inventaris berikut diambil dari label proyek di situs lama, bukan bukti file gambar sudah berhasil diunduh.** Hindari menggunakan aset dari stok / ilustrasi sebagai foto pekerjaan nyata; minta persetujuan pemilik sebelum memublikasikan foto pelanggan.

| Nama di website lama | Konteks situs lama | Penempatan yang disarankan di situs baru | Status |
|---|---|---|---|
| Bu Dr. Dian — Ruang Tamu | Ruang tamu rumah, Malang | `/proyek/` kategori Hunian; dukung `/interior-rumah-malang/` | Gambar asli belum diunduh/divalidasi |
| Bu Dr. Dian — Interior Rumah | Interior desain rumah, Malang | Gabungkan dalam studi kasus Dr. Dian jika terbukti satu proyek | Belum divalidasi |
| Bu Endang — Buffet TV | Furniture rumah, Malang | `/custom-furniture-malang/`, katalog portofolio Furniture | Belum divalidasi |
| Al Izzah — Lobby | Situs lama menyebut Lobby — Kantor, Malang | Cek isi foto dan kesesuaian proyek `/proyek/al-izzah/` yang sudah ada, jangan asumsikan tipe bangunan hanya dari label | Perlu pencocokan foto |
| Pak Adi Bromo — Kitchen Set | Kitchen set rumah, Malang | `/kitchen-set-malang/`, kartu proyek kitchen set | Belum divalidasi |
| IIBS — Lab Putri | Laboratorium sekolah, Cikarang/Bekasi | Kategori Pendidikan, bukan layanan lokal Malang; studi kasus pendidikan jika tersedia | Belum divalidasi |

## Aturan seleksi gambar
1. Prioritaskan enam kelompok portofolio ini, dan ambil semua varian foto asli per proyek jika tersedia. Simpan judul, caption dan URL asal untuk setiap gambar.
2. Materi layanan/gambar dekorasi, ilustrasi proses, avatar testimonial, ikon, logo dan stok dipisahkan dari **foto proyek aktual**.
3. Jangan memakai nama klien / identitas pribadi pada nama file publik bila belum ada izin; jika tidak ada konfirmasi, pakai kategori umum dan tandai perlu persetujuan.
4. Foto yang sama tidak boleh diduplikasi ke banyak halaman hanya untuk SEO. Satu foto boleh direferensikan lintas halaman dengan alt text spesifik sesuai konteks, bukan keyword stuffing.
5. Setelah aset diunduh: pilih foto lebar berkualitas untuk hero; foto aktual 3:2 atau 4:3 untuk kartu portofolio; beberapa foto horizontal/vertikal untuk detail proyek; optimalkan WEBP/AVIF dan sediakan ukuran responsif.
6. Jangan menimpa `assets/projects/al-izzah/` dan aset eksisting tanpa pemeriksaan visual karena situs baru sudah memiliki aset proyek Al Izzah, Charis National Academy dan Malang Strudel.
7. Masukkan hanya hasil pekerjaan yang dapat diatribusikan ke Metom. Hindari membuat harga, tahun, luas ruang, testimoni, atau cakupan layanan yang tidak tertera pada sumber.

## Rencana tata letak
- Homepage: 1 hero nyata representatif, logo klien yang sudah tersedia, lalu 3 kartu portofolio utama tepat setelah pengenalan / layanan. Pilih proyek Hunian, Komersial, Pendidikan yang benar-benar terdokumentasi.
- `/proyek/`: filter Hunian, Kitchen Set, Custom Furniture, Komersial, Pendidikan; setiap item tautan ke studi kasus jika datanya cukup.
- Halaman jasa: gunakan foto asli **berdasarkan kategori** dan link ke proyek terkait. Gunakan label 'Contoh Pekerjaan' bila data proyek masih terbatas.
- Halaman proyek: title, kategori, lokasi (tingkat kota hanya jika dari sumber), foto hero, galeri, deskripsi yang didukung sumber dan CTA konsultasi.

## Status teknis
HTML situs lama dapat dilihat melalui indeks web, tetapi URL file media dan WordPress media API tidak dapat diambil dalam sesi ini. Jangan menyatakan file sudah dimigrasikan atau tayang sampai unduhan, pemetaan satu per satu, QA, dan deployment diverifikasi.
