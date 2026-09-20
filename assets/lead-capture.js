(function(){
  'use strict';

  // Paste the Google Apps Script Web App /exec URL here after deployment.
  const LEAD_ENDPOINT='';

  function isReady(){
    return /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/i.test(LEAD_ENDPOINT);
  }
  if(!isReady()) return;

  const style=document.createElement('style');
  style.textContent=`
    .metom-lead-modal{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(15,15,15,.58);backdrop-filter:blur(6px)}
    .metom-lead-modal.is-open{display:flex}
    .metom-lead-dialog{width:min(100%,520px);max-height:calc(100svh - 40px);overflow:auto;background:#fff;color:#151515;padding:30px;border:1px solid #dedede;box-shadow:0 24px 70px rgba(0,0,0,.28)}
    .metom-lead-head{display:flex;justify-content:space-between;gap:24px;align-items:flex-start;margin-bottom:24px}
    .metom-lead-eyebrow{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#777;margin-bottom:8px}
    .metom-lead-title{margin:0;font:500 30px/1.05 "Google Sans",Arial,sans-serif;letter-spacing:-.035em}
    .metom-lead-close{border:0;background:transparent;font-size:28px;line-height:1;cursor:pointer;padding:0;color:#555}
    .metom-lead-copy{margin:0 0 22px;color:#666;font-size:15px;line-height:1.55}
    .metom-lead-field{display:grid;gap:7px;margin-bottom:16px}
    .metom-lead-field label{font-size:13px;font-weight:600}
    .metom-lead-field input,.metom-lead-field textarea{width:100%;border:1px solid #cfcfcf;background:#fff;color:#151515;padding:13px 14px;font:inherit;outline:none;border-radius:0}
    .metom-lead-field input:focus,.metom-lead-field textarea:focus{border-color:#151515}
    .metom-lead-field textarea{min-height:110px;resize:vertical}
    .metom-lead-hint{font-size:12px;color:#777;margin-top:5px}
    .metom-lead-actions{display:grid;gap:10px;margin-top:22px}
    .metom-lead-submit{min-height:52px;border:1px solid #151515;background:#151515;color:#fff;font:600 15px Arial,sans-serif;cursor:pointer}
    .metom-lead-submit[disabled]{opacity:.55;cursor:wait}
    .metom-lead-privacy{font-size:11px;line-height:1.5;color:#777;margin:0}
    .metom-lead-error{display:none;color:#a52323;font-size:13px;margin-top:10px}
    .metom-lead-error.is-visible{display:block}
    @media(max-width:600px){.metom-lead-dialog{padding:24px 20px}.metom-lead-title{font-size:26px}}
  `;
  document.head.appendChild(style);

  const modal=document.createElement('div');
  modal.className='metom-lead-modal';
  modal.setAttribute('aria-hidden','true');
  modal.innerHTML=`
    <div class="metom-lead-dialog" role="dialog" aria-modal="true" aria-labelledby="metomLeadTitle">
      <div class="metom-lead-head">
        <div>
          <div class="metom-lead-eyebrow">Konsultasi Metom</div>
          <h2 class="metom-lead-title" id="metomLeadTitle">Ceritakan kebutuhan interior Anda.</h2>
        </div>
        <button class="metom-lead-close" type="button" aria-label="Tutup">×</button>
      </div>
      <p class="metom-lead-copy">Isi singkat dulu agar tim Metom punya konteks sebelum percakapan WhatsApp dimulai.</p>
      <form id="metomLeadForm">
        <div class="metom-lead-field">
          <label for="metomLeadName">Nama</label>
          <input id="metomLeadName" name="name" autocomplete="name" required maxlength="80">
        </div>
        <div class="metom-lead-field">
          <label for="metomLeadPhone">No. WhatsApp</label>
          <input id="metomLeadPhone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="08xxxxxxxxxx" required maxlength="24">
          <div class="metom-lead-hint">Nomor ini hanya digunakan untuk menindaklanjuti konsultasi Anda.</div>
        </div>
        <div class="metom-lead-field">
          <label for="metomLeadNeed">Kebutuhan</label>
          <textarea id="metomLeadNeed" name="need" placeholder="Contoh: kitchen set rumah di Malang, ukuran ruang ±3×4 m" required maxlength="800"></textarea>
        </div>
        <div class="metom-lead-actions">
          <button class="metom-lead-submit" type="submit">Lanjut ke WhatsApp</button>
          <p class="metom-lead-privacy">Dengan melanjutkan, Anda menyetujui data yang diisi digunakan Metom untuk menindaklanjuti permintaan konsultasi. Data personal tidak dikirim ke Google Analytics.</p>
          <div class="metom-lead-error" role="alert"></div>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  let targetUrl='https://wa.me/6281231131796';
  let ctaPosition='content';

  const form=modal.querySelector('#metomLeadForm');
  const closeBtn=modal.querySelector('.metom-lead-close');
  const submitBtn=modal.querySelector('.metom-lead-submit');
  const errorEl=modal.querySelector('.metom-lead-error');
  const nameInput=modal.querySelector('#metomLeadName');

  function positionOf(link){
    if(link.classList.contains('wa-float')) return 'floating_whatsapp';
    if(link.classList.contains('nav-cta')||link.classList.contains('enquire')) return 'header';
    if(link.closest('.final-cta')||link.closest('.final-actions')) return 'final_cta';
    if(link.closest('.footer')||link.closest('footer')) return 'footer';
    return 'content';
  }

  function openModal(link){
    targetUrl=link.href||targetUrl;
    ctaPosition=positionOf(link);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    setTimeout(()=>nameInput.focus(),50);
  }

  function closeModal(){
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    errorEl.classList.remove('is-visible');
  }

  closeBtn.addEventListener('click',closeModal);
  modal.addEventListener('click',e=>{if(e.target===modal) closeModal();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('is-open')) closeModal();});

  document.addEventListener('click',function(e){
    const link=e.target.closest('a[href]');
    if(!link) return;
    const href=link.href||'';
    if(!/(?:wa\.me|api\.whatsapp\.com|whatsapp\.com)/i.test(href)) return;
    e.preventDefault();
    openModal(link);
  },true);

  function queryParam(name){
    return new URLSearchParams(location.search).get(name)||'';
  }

  form.addEventListener('submit',async function(e){
    e.preventDefault();
    errorEl.classList.remove('is-visible');

    const name=form.elements.name.value.trim();
    const phone=form.elements.phone.value.trim();
    const need=form.elements.need.value.trim();

    if(name.length<2||phone.replace(/\D/g,'').length<9||need.length<5){
      errorEl.textContent='Mohon lengkapi nama, nomor WhatsApp, dan kebutuhan Anda.';
      errorEl.classList.add('is-visible');
      return;
    }

    submitBtn.disabled=true;
    submitBtn.textContent='Menyimpan...';

    const payload=new URLSearchParams({
      name:name,
      phone:phone,
      need:need,
      page:location.href,
      path:location.pathname,
      cta_position:ctaPosition,
      utm_source:queryParam('utm_source'),
      utm_medium:queryParam('utm_medium'),
      utm_campaign:queryParam('utm_campaign'),
      referrer:document.referrer||''
    });

    try{
      await fetch(LEAD_ENDPOINT,{
        method:'POST',
        mode:'no-cors',
        headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},
        body:payload.toString(),
        keepalive:true
      });

      if(typeof window.gtag==='function'){
        window.gtag('event','lead_form_submit',{
          contact_method:'whatsapp',
          cta_position:ctaPosition,
          page_path:location.pathname,
          page_title:document.title
        });
      }

      const msg='Halo Metom Design, saya '+name+'. Saya ingin konsultasi mengenai '+need+'. Nomor WhatsApp saya '+phone+'.';
      let wa='https://wa.me/6281231131796?text='+encodeURIComponent(msg);
      try{
        const original=new URL(targetUrl);
        const destPhone=original.searchParams.get('phone');
        if(destPhone) wa='https://wa.me/'+destPhone+'?text='+encodeURIComponent(msg);
      }catch(_){}

      closeModal();
      form.reset();
      window.open(wa,'_blank','noopener');
    }catch(err){
      errorEl.textContent='Data belum berhasil disimpan. Silakan coba sekali lagi.';
      errorEl.classList.add('is-visible');
    }finally{
      submitBtn.disabled=false;
      submitBtn.textContent='Lanjut ke WhatsApp';
    }
  });
})();