# Content Source

Folder ini menjadi **content handoff layer** antara versi static dan WordPress.

Tujuannya agar data project dan artikel tidak hanya tersimpan di HTML sehingga proses migrasi ke CMS lebih mudah.

## Folder

- `projects/` — data project/case study.
- `journal/` — data artikel/jurnal.

Gunakan satu file per slug. Nama file harus sama dengan slug URL.

Contoh:

```
content/projects/al-izzah.md
content/blog/harga-kitchen-set-malang.md
```

## Naming asset

Untuk project baru gunakan pola:

```
assets/projects/{slug}/cover.webp
assets/projects/{slug}/gallery-01.webp
assets/projects/{slug}/gallery-02.webp
```

Untuk artikel:

```
assets/journal/{slug}/cover.webp
assets/journal/{slug}/image-01.webp
```

Hindari spasi pada nama file baru. Gunakan lowercase + kebab-case.
