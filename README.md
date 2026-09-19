# Metom Design Website

Repository ini memiliki dua tujuan:

1. **Static production site** yang saat ini tayang di `metom.id`.
2. **WordPress implementation** yang disiapkan di folder `wordpress/` untuk tahap migrasi berikutnya.

## Struktur repository

```
/
├── index.html                    # Homepage static production
├── *.html                        # Landing/service pages static
├── proyek/                      # Clean nested project routes
├── jurnal/                      # Clean nested journal routes
├── assets/                      # CSS, JS, client logos, dan media shared
├── content/                     # Source content terstruktur untuk project & journal
├── wordpress/                   # Source theme WordPress; tidak ikut deploy static
├── deploy/                      # Router/config untuk cPanel
├── .github/workflows/           # Production deployment only
├── robots.txt
└── sitemap.xml
```

## Aturan update

### Update halaman static
Edit HTML halaman yang terkait. Gunakan URL asset absolut seperti:

```html
<link rel="stylesheet" href="/assets/detail.css">
<script src="/assets/detail.js"></script>
```

### Tambah project
1. Buat record baru dari `content/projects/_template.md`.
2. Simpan asset project dengan nama folder/slug yang konsisten.
3. Buat halaman static bila project perlu tayang sebelum WordPress aktif.
4. Saat WordPress aktif, record tersebut dipindahkan ke CPT `metom_project`.

### Tambah artikel
1. Buat record dari `content/blog/_template.md`.
2. Gunakan slug final sejak awal.
3. Saat WordPress aktif, record tersebut menjadi native WordPress Post.

## Deployment

- `main` = source kerja.
- `production` = source yang dideploy ke cPanel.
- Workflow production: `.github/workflows/deploy-cpanel.yml`.
- Folder `wordpress/`, `content/`, `deploy/`, dan file development tidak dikirim ke public static site.

## Prinsip URL

Public URL dipertahankan agar sama ketika pindah ke WordPress, misalnya:

- `/proyek/al-izzah/`
- `/blog/harga-kitchen-set-malang/`
- `/kitchen-set-malang/`

Jangan membuat URL publik baru hanya karena struktur folder repository berubah.
