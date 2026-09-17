from pathlib import Path
import re
p=Path('index.html')
s=p.read_text()
css='''
/* Premium full-width final CTA */
.final-cta{position:relative;min-height:620px;padding:0;display:flex;align-items:stretch;overflow:hidden;background:#171717;color:#fff}
.final-cta-media{position:absolute;inset:0;z-index:0}
.final-cta-media img{width:100%;height:100%;object-fit:cover;filter:saturate(.82) contrast(1.03)}
.final-cta:after{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(90deg,rgba(9,9,9,.82) 0%,rgba(9,9,9,.58) 42%,rgba(9,9,9,.18) 74%,rgba(9,9,9,.08) 100%),linear-gradient(0deg,rgba(0,0,0,.34),rgba(0,0,0,.04) 48%)}
.final-cta-inner{position:relative;z-index:2;width:min(100%,var(--max));margin:auto;padding:96px var(--pad);display:flex;flex-direction:column;justify-content:flex-end;min-height:620px}
.final-cta .eyebrow{color:rgba(255,255,255,.68);margin-bottom:22px}
.final-cta .h2{max-width:980px;font-size:clamp(46px,5.2vw,78px);line-height:.96}
.final-cta .copy{color:rgba(255,255,255,.78);max-width:620px;margin:28px 0 0;font-size:18px}
.final-actions{display:flex;align-items:center;gap:18px;flex-wrap:wrap;margin-top:34px}
.final-cta .btn{border-color:#fff}
.final-cta .btn--dark{background:#fff;color:#111}
.final-meta{margin-top:58px;padding-top:18px;border-top:1px solid rgba(255,255,255,.28);display:flex;justify-content:space-between;gap:24px;max-width:980px;font-size:14px;color:rgba(255,255,255,.7)}
.final-meta strong{color:#fff;font-weight:500}
@media(max-width:720px){.final-cta,.final-cta-inner{min-height:620px}.final-cta-inner{padding:74px var(--pad) 34px}.final-cta .h2{font-size:42px}.final-cta .copy{font-size:16px}.final-actions{display:grid;grid-template-columns:1fr;width:100%;gap:10px}.final-actions .btn{width:100%}.final-meta{margin-top:42px;flex-direction:column;gap:8px}.final-cta:after{background:linear-gradient(0deg,rgba(0,0,0,.84) 0%,rgba(0,0,0,.54) 58%,rgba(0,0,0,.16) 100%)}}
'''
if '/* Premium full-width final CTA */' not in s:
    s=s.replace('</style>',css+'\n</style>',1)
old=re.search(r'<section class="final-cta">.*?</section>',s,re.S)
if not old:
    raise SystemExit('final CTA section not found')
new='''<section class="final-cta"><div class="final-cta-media"><img src="https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&q=88&w=2200" alt="Interior project Metom Design"></div><div class="final-cta-inner"><div class="eyebrow">Punya ruang yang ingin dikerjakan?</div><h2 class="h2">Ceritakan kebutuhan Anda. Kami bantu mulai dari langkah yang paling masuk akal.</h2><p class="copy">Kirim lokasi, jenis ruang, dan kebutuhan awal melalui WhatsApp. Tim Metom akan membantu mengarahkan apakah project sebaiknya dimulai dari desain, survey, custom furniture, atau langsung design & build.</p><div class="final-actions"><a class="btn btn--dark" href="https://api.whatsapp.com/send/?phone=6281231131796&text=Halo%20Metom%20Design%2C%20saya%20ingin%20konsultasi%20mengenai%20kebutuhan%20interior.%20Lokasi%20proyek%20saya%20di%20...%20dan%20kebutuhan%20saya%20adalah%20...&type=phone_number&app_absent=0" target="_blank" rel="noopener">Konsultasi via WhatsApp<svg class="icon-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a><a class="text-link" style="color:#fff;border-color:#fff" href="proyek.html">Lihat project terlebih dahulu<svg class="icon-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div><div class="final-meta"><span><strong>Berbasis di Malang</strong> · Melayani Malang Raya & Batu</span><span>Interior Design · Custom Furniture · Design & Build</span></div></div></section>'''
s=s[:old.start()]+new+s[old.end():]
p.write_text(s)
