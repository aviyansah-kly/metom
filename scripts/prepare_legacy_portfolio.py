#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageOps
import csv, re, shutil

ROOT=Path(__file__).resolve().parents[1]
REVIEW=ROOT/"legacy-review"
OUT=ROOT/"assets"/"legacy-projects"
OUT.mkdir(parents=True,exist_ok=True)

SELECT={
"pak-joko-3-jpg-5514de6fbfa0.jpg":("residential-pak-joko.webp","Hunian","Interior hunian hasil pengerjaan Metom"),
"ust-imron-2-jpg-40ebb55f4ec6.jpg":("residential-ust-imron.webp","Hunian","Detail interior hunian hasil pengerjaan Metom"),
"bu-endang-2-jpg-9f34cf05614c.jpg":("custom-furniture-bu-endang.webp","Custom Furniture","Built-in furniture hasil pengerjaan Metom"),
"mas-syaiful-jpg-d311a75100bb.jpg":("kitchen-mas-syaiful.webp","Kitchen Set","Kitchen set hasil pengerjaan Metom"),
"dr-dian-4-jpg-bb0e5cea3010.jpg":("kitchen-dr-dian.webp","Kitchen Set","Kitchen set L-shape hasil pengerjaan Metom"),
"dr-dian-3-jpg-3eb76fd75ae8.jpg":("built-in-dr-dian.webp","Custom Furniture","Built-in cabinet hasil pengerjaan Metom"),
"pak-adi-bromo-1-jpg-499abc79aa32.jpg":("wardrobe-pak-adi.webp","Custom Furniture","Wardrobe built-in hasil pengerjaan Metom"),
"rak-buku-2-jpg-28cfc8edcc03.jpg":("bookshelf-education.webp","Custom Furniture","Rak built-in untuk ruang pendidikan"),
"toilet-wastafel-2-jpg-d289d06f29ea.jpg":("vanity-custom.webp","Custom Furniture","Vanity dan kabinet custom hasil pengerjaan Metom"),
"lobby-al-izzah-3-jpg-716c8b56c4e8.jpg":("lobby-al-izzah.webp","Pendidikan","Area lobby proyek Metom"),
"lab-iibs-putri-2-jpg-2b1508acee80.jpg":("lab-iibs-01.webp","Pendidikan","Interior laboratorium proyek pendidikan"),
"lab-iibs-putri-4-jpg-cf527805e021.jpg":("lab-iibs-02.webp","Pendidikan","Interior laboratorium proyek pendidikan"),
"ruang-makan-putra-1-jpg-da34f993f2e4.jpg":("education-dining.webp","Pendidikan","Detail interior ruang pendidikan"),
"malang-strudel-1-jpg-cb78e0d287b0.jpg":("malang-strudel-retail.webp","Komersial","Interior retail Malang Strudel"),
"klinik-1-jpg-ffcfe2c5aa0d.jpg":("clinic-reception.webp","Komersial","Area reception proyek komersial Metom"),
"malang-strudel-3-jpg-7df6f6f805ca.jpg":("malang-strudel-gallery.webp","Komersial","Sudut interior retail Malang Strudel"),
"lobby-al-izzah-1-jpg-7bcbaa18398a.jpg":("lobby-al-izzah-gallery.webp","Pendidikan","Sudut lain area lobby proyek Metom"),
}

def locate(name):
    hits=list(REVIEW.rglob(name))
    if not hits:
        raise FileNotFoundError(name)
    return hits[0]

def export_webp(src,dst):
    with Image.open(src) as im:
        im=ImageOps.exif_transpose(im).convert("RGB")
        # Preserve native detail; never upscale legacy photos.
        if im.width > 1400:
            h=round(im.height*1400/im.width)
            im=im.resize((1400,h),Image.Resampling.LANCZOS)
        im.save(dst,"WEBP",quality=86,method=6)

rows=[]
for src_name,(dst_name,category,alt) in SELECT.items():
    src=locate(src_name)
    dst=OUT/dst_name
    export_webp(src,dst)
    with Image.open(dst) as im:
        rows.append([dst_name,category,im.width,im.height,alt,src_name])

with (OUT/"manifest.csv").open("w",newline="",encoding="utf-8") as f:
    w=csv.writer(f); w.writerow(["file","category","width","height","recommended_alt","legacy_source_file"]); w.writerows(rows)

def add_showcase(file_name,title,lead,items):
    path=ROOT/file_name
    html=path.read_text(encoding="utf-8")
    start="<!-- legacy-project-showcase:start -->"; end="<!-- legacy-project-showcase:end -->"
    if start in html:
        html=re.sub(re.escape(start)+r".*?"+re.escape(end),"",html,flags=re.S)
    cards=[]
    for img,meta,name in items:
        cards.append(f'<div class="card"><div class="card-media"><img src="/assets/legacy-projects/{img}" alt="{name}" loading="lazy" decoding="async"></div><div class="meta">{meta}</div><h3>{name}</h3></div>')
    section=(f'{start}<section class="section legacy-project-showcase"><div class="wrap">'
             f'<div class="section-head"><div><div class="eyebrow">Dokumentasi proyek</div><h2 class="h2">{title}</h2></div>'
             f'<p class="copy">{lead}</p></div><div class="project-grid">{"".join(cards)}</div></div></section>{end}')
    marker='<section class="section"><div class="wrap split"><div><div class="eyebrow">FAQ</div>'
    if marker in html:
        html=html.replace(marker,section+marker,1)
    else:
        html=html.replace('</main>',section+'</main>',1)
    path.write_text(html,encoding="utf-8")

add_showcase("kitchen-set-malang.html","Contoh pengerjaan kitchen set Metom.","Foto dari arsip project Metom lama yang masih relevan untuk menunjukkan hasil pengerjaan nyata.",[
("kitchen-mas-syaiful.webp","Kitchen Set","Kitchen set custom"),
("kitchen-dr-dian.webp","Kitchen Set","Kitchen set L-shape"),
("custom-furniture-bu-endang.webp","Built-in","Kabinet custom"),
])
add_showcase("custom-furniture-malang.html","Contoh custom furniture yang sudah dikerjakan.","Dokumentasi asli proyek Metom dipilih untuk menunjukkan variasi built-in furniture, wardrobe, rak, dan vanity.",[
("wardrobe-pak-adi.webp","Wardrobe","Wardrobe built-in"),
("bookshelf-education.webp","Built-in","Rak custom"),
("vanity-custom.webp","Vanity","Kabinet vanity custom"),
])
add_showcase("interior-rumah-malang.html","Dokumentasi interior hunian Metom.","Arsip proyek hunian lama ditampilkan sebagai bukti pekerjaan nyata tanpa menambahkan klaim luas, biaya, atau tahun proyek yang tidak terverifikasi.",[
("residential-pak-joko.webp","Hunian","Interior hunian"),
("residential-ust-imron.webp","Hunian","Detail interior hunian"),
("built-in-dr-dian.webp","Hunian · Built-in","Built-in cabinet"),
])
add_showcase("interior-komersial-malang.html","Beberapa ruang komersial dan institusi yang pernah dikerjakan.","Dokumentasi asli dari arsip website Metom lama, dipilih berdasarkan konteks ruang yang paling jelas.",[
("malang-strudel-retail.webp","Retail","Interior retail"),
("clinic-reception.webp","Komersial","Area reception"),
("lobby-al-izzah.webp","Pendidikan","Area lobby"),
])

# Homepage: replace only stock cards where project context is a safe match.
index=ROOT/"index.html"
html=index.read_text(encoding="utf-8")
repls={
'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=86&w=900':'/assets/legacy-projects/residential-pak-joko.webp',
'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&q=86&w=900':'/assets/legacy-projects/kitchen-mas-syaiful.webp',
'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=86&w=900':'/assets/legacy-projects/malang-strudel-retail.webp',
}
for old,new in repls.items(): html=html.replace(old,new)
html=html.replace('alt="Interior rumah modern"','alt="Interior hunian hasil pengerjaan Metom"',1)
html=html.replace('alt="Kitchen set modern"','alt="Kitchen set hasil pengerjaan Metom"',1)
html=html.replace('alt="Interior komersial"','alt="Interior retail Malang Strudel"',1)
index.write_text(html,encoding="utf-8")

# Project index gets a concise real-project archive without exposing private residential client names.
p=ROOT/"proyek.html"; html=p.read_text(encoding="utf-8")
start="<!-- legacy-archive:start -->"; end="<!-- legacy-archive:end -->"
if start in html: html=re.sub(re.escape(start)+r".*?"+re.escape(end),"",html,flags=re.S)
archive=[
("malang-strudel-retail.webp","Komersial · Retail","Malang Strudel"),
("lobby-al-izzah.webp","Pendidikan","Lobby"),
("lab-iibs-01.webp","Pendidikan","Laboratorium"),
("residential-pak-joko.webp","Hunian","Interior hunian"),
("residential-ust-imron.webp","Hunian","Interior hunian"),
("kitchen-mas-syaiful.webp","Kitchen Set","Kitchen set"),
("wardrobe-pak-adi.webp","Custom Furniture","Wardrobe built-in"),
("bookshelf-education.webp","Custom Furniture","Rak built-in"),
("clinic-reception.webp","Komersial","Area reception"),
]
cards=''.join(f'<div class="card"><div class="card-media"><img src="/assets/legacy-projects/{img}" alt="{name} — arsip proyek Metom" loading="lazy" decoding="async"></div><div class="meta">{meta}</div><h3>{name}</h3></div>' for img,meta,name in archive)
section=f'{start}<section class="section section--soft"><div class="wrap"><div class="section-head"><div><div class="eyebrow">Arsip proyek</div><h2 class="h2">Lebih banyak pekerjaan Metom.</h2></div><p class="copy">Pilihan foto dari website Metom sebelumnya. Kami menampilkan hanya dokumentasi proyek yang konteks pekerjaannya dapat dikenali dengan cukup jelas.</p></div><div class="project-grid">{cards}</div></div></section>{end}'
html=html.replace('</main>',section+'</main>',1)
p.write_text(html,encoding="utf-8")

print(f"Prepared {len(SELECT)} reviewed legacy assets and updated 6 static pages.")
