(function(){
  'use strict';

  // Paste the Google Apps Script Web App /exec URL here after deployment.
  const LEAD_ENDPOINT='https://script.google.com/macros/s/AKfycbxGHv747pKebB77YhOyFumQENlnWLYwAyES0rvWWfyBVbC0LJx9nBEOM7lNNPSRuWOC/exec';

  function isReady(){
    return /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/i.test(LEAD_ENDPOINT);
  }
  if(!isReady()) return;

  const EXPERIMENT_KEY='metom_wa_flow_v1';
  let experimentVariant=localStorage.getItem(EXPERIMENT_KEY);
  if(experimentVariant!=='form'&&experimentVariant!=='direct'){
    experimentVariant=Math.random()<0.5?'form':'direct';
    localStorage.setItem(EXPERIMENT_KEY,experimentVariant);
  }

  function ga(eventName,params){
    if(typeof window.gtag!=='function') return;
    window.gtag('event',eventName,Object.assign({
      experiment_name:'wa_flow_v1',
      experiment_variant:experimentVariant,
      page_path:location.pathname,
      page_title:document.title
    },params||{}));
  }

  try{
    if(sessionStorage.getItem('metom_wa_flow_v1_exposed')!=='1'){
      ga('experiment_exposure');
      sessionStorage.setItem('metom_wa_flow_v1_exposed','1');
    }
  }catch(_){
    ga('experiment_exposure');
  }

  const style=document.createElement('style');
  style.textContent=`
    .metom-lead-modal{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(15,15,15,.52);backdrop-filter:blur(5px)}
    .metom-lead-modal.is-open{display:flex}
    .metom-lead-dialog{width:min(100%,460px);max-height:calc(100svh - 36px);overflow:auto;background:#fff;color:#151515;padding:26px;border:1px solid #dedede;box-shadow:0 20px 60px rgba(0,0,0,.24)}
    .metom-lead-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;margin-bottom:20px}
    .metom-lead-title{margin:0;font:500 28px/1.08 "Google Sans",Arial,sans-serif;letter-spacing:-.035em}
    .metom-lead-close{border:0;background:transparent;font-size:28px;line-height:1;cursor:pointer;padding:0 0 8px 8px;color:#555}
    .metom-lead-field{display:grid;gap:7px;margin-bottom:14px}
    .metom-lead-field label{font-size:13px;font-weight:600}
    .metom-lead-field input,.metom-lead-field textarea{width:100%;border:1px solid #cfcfcf;background:#fff;color:#151515;padding:14px 15px;font:inherit;font-size:16px;outline:none;border-radius:0;min-height:50px}
    .metom-lead-field input:focus,.metom-lead-field textarea:focus{border-color:#151515}
    .metom-lead-field textarea{min-height:92px;resize:vertical}
    .metom-lead-actions{display:grid;gap:8px;margin-top:18px}
    .metom-lead-submit{min-height:54px;border:1px solid #151515;background:#151515;color:#fff;font:600 15px Arial,sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;text-decoration:none;padding:0 18px}
    .metom-lead-error{display:none;color:#a52323;font-size:13px;margin-top:8px}
    .metom-lead-error.is-visible{display:block}
    @media(max-width:600px){
      .metom-lead-modal{align-items:flex-end;padding:0;background:rgba(15,15,15,.46)}
      .metom-lead-dialog{width:100%;max-height:92svh;padding:22px 18px 18px;border:0;border-radius:18px 18px 0 0;box-shadow:0 -16px 44px rgba(0,0,0,.18)}
      .metom-lead-head{margin-bottom:18px}
      .metom-lead-title{font-size:24px;line-height:1.08;max-width:300px}
      .metom-lead-field{margin-bottom:12px}
      .metom-lead-field input,.metom-lead-field textarea{min-height:52px;padding:14px;font-size:16px}
      .metom-lead-field textarea{min-height:86px}
      .metom-lead-actions{margin-top:14px}
      .metom-lead-submit{min-height:54px}
    }
  `;
  document.head.appendChild(style);

  const modal=document.createElement('div');
  modal.className='metom-lead-modal';
  modal.setAttribute('aria-hidden','true');
  modal.innerHTML=`
    <div class="metom-lead-dialog" role="dialog" aria-modal="true" aria-labelledby="metomLeadTitle">
      <div class="metom-lead-head">
        <div>
          <h2 class="metom-lead-title" id="metomLeadTitle">Konsultasi via WhatsApp</h2>
        </div>
        <button class="metom-lead-close" type="button" aria-label="Tutup">×</button>
      </div>
      <form id="metomLeadForm">
        <div class="metom-lead-field">
          <label for="metomLeadName">Nama</label>
          <input id="metomLeadName" name="name" autocomplete="name" required maxlength="80">
        </div>
        <div class="metom-lead-field">
          <label for="metomLeadPhone">No. WhatsApp</label>
          <input id="metomLeadPhone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="08xxxxxxxxxx" required maxlength="24">
        </div>
        <div class="metom-lead-field">
          <label for="metomLeadNeed">Kebutuhan</label>
          <textarea id="metomLeadNeed" name="need" placeholder="Contoh: kitchen set rumah di Malang" required maxlength="800"></textarea>
        </div>
        <div class="metom-lead-actions">
          <a class="metom-lead-submit" data-metom-wa-submit href="https://api.whatsapp.com/send/?phone=6281231131796&type=phone_number&app_absent=0" rel="noopener">Lanjut ke WhatsApp</a>
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
  const submitLink=modal.querySelector('.metom-lead-submit');
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
    ga('lead_form_open',{cta_position:ctaPosition});
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
    if(link.hasAttribute('data-metom-wa-submit')) return;

    const position=positionOf(link);
    ga('wa_cta_click',{cta_position:position});

    if(experimentVariant==='direct'){
      ga('direct_whatsapp_click',{cta_position:position});
      return;
    }

    e.preventDefault();
    openModal(link);
  },true);

  function queryParam(name){
    return new URLSearchParams(location.search).get(name)||'';
  }

  function getLeadData(){
    return {
      name:form.elements.name.value.trim(),
      phone:form.elements.phone.value.trim(),
      need:form.elements.need.value.trim()
    };
  }

  function isLeadValid(data){
    return data.name.length>=2 &&
      data.phone.replace(/\D/g,'').length>=9 &&
      data.need.length>=5;
  }

  function buildWhatsAppUrl(data){
    const msg='Halo Metom Design, saya '+data.name+'. Saya ingin konsultasi mengenai '+data.need+'.';
    return 'https://api.whatsapp.com/send/?phone=6281231131796&text='+encodeURIComponent(msg)+'&type=phone_number&app_absent=0';
  }

  function updateSubmitHref(){
    const data=getLeadData();
    submitLink.href=buildWhatsAppUrl(data);
  }

  form.addEventListener('input',updateSubmitHref);
  updateSubmitHref();

  form.addEventListener('submit',function(e){
    e.preventDefault();
    submitLink.click();
  });

  submitLink.addEventListener('click',function(e){
    errorEl.classList.remove('is-visible');

    const data=getLeadData();
    if(!isLeadValid(data)){
      e.preventDefault();
      errorEl.textContent='Mohon lengkapi nama, nomor WhatsApp, dan kebutuhan Anda.';
      errorEl.classList.add('is-visible');

      if(data.name.length<2) form.elements.name.focus();
      else if(data.phone.replace(/\D/g,'').length<9) form.elements.phone.focus();
      else form.elements.need.focus();
      return;
    }

    // Keep the destination as a native WA link before navigation.
    submitLink.href=buildWhatsAppUrl(data);

    const payload=new URLSearchParams({
      name:data.name,
      phone:data.phone,
      need:data.need,
      page:location.href,
      path:location.pathname,
      cta_position:ctaPosition,
      utm_source:queryParam('utm_source'),
      utm_medium:queryParam('utm_medium'),
      utm_campaign:queryParam('utm_campaign'),
      referrer:document.referrer||'',
      experiment_variant:experimentVariant
    });

    // Tracking must never block the customer's WhatsApp navigation.
    let beaconSent=false;
    try{
      if(navigator.sendBeacon){
        beaconSent=navigator.sendBeacon(LEAD_ENDPOINT,payload);
      }
    }catch(_){}

    if(!beaconSent){
      try{
        fetch(LEAD_ENDPOINT,{
          method:'POST',
          mode:'no-cors',
          headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},
          body:payload.toString(),
          keepalive:true
        }).catch(function(){});
      }catch(_){}
    }

    ga('lead_form_submit',{
      contact_method:'whatsapp',
      cta_position:ctaPosition
    });

    // IMPORTANT: do not preventDefault here.
    // Safari follows the native <a href="https://wa.me/..."> tap directly.
  });
})();