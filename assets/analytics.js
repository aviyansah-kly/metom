(function(){
  'use strict';

  const GA4_ID='G-TTHXJRKZ49';
  if(window.__metomGa4Initialized) return;
  window.__metomGa4Initialized=true;

  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};

  window.gtag('js',new Date());
  window.gtag('config',GA4_ID,{
    send_page_view:true
  });

  const script=document.createElement('script');
  script.async=true;
  script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(GA4_ID);
  document.head.appendChild(script);

  function cleanText(value){
    return (value||'').replace(/\s+/g,' ').trim().slice(0,120);
  }

  function ctaPosition(link){
    if(link.classList.contains('wa-float')) return 'floating_whatsapp';
    if(link.classList.contains('nav-cta')||link.classList.contains('enquire')) return 'header';
    if(link.closest('.final-cta')||link.closest('.final-actions')) return 'final_cta';
    if(link.closest('.footer')) return 'footer';
    if(link.closest('.footer-contact')) return 'footer_contact';
    return 'content';
  }

  function trackContact(link,method){
    const params={
      contact_method:method,
      cta_position:ctaPosition(link),
      link_text:cleanText(link.getAttribute('aria-label')||link.textContent),
      page_path:window.location.pathname,
      page_title:document.title
    };

    window.gtag('event','generate_lead',params);
    window.gtag('event',method+'_click',params);
  }

  document.addEventListener('click',function(event){
    const link=event.target.closest('a[href]');
    if(!link) return;

    const href=(link.getAttribute('href')||'').trim();
    const absoluteHref=link.href||href;

    if(/^tel:/i.test(href)){
      trackContact(link,'phone');
      return;
    }

    if(/^mailto:/i.test(href)){
      trackContact(link,'email');
      return;
    }

    if(/(?:wa\.me|api\.whatsapp\.com|whatsapp\.com)/i.test(absoluteHref)){
      trackContact(link,'whatsapp');
    }
  },{capture:true});
})();

(function(){
  if(document.querySelector('script[src="/assets/lead-capture.js"]')) return;
  const s=document.createElement('script');
  s.src='/assets/lead-capture.js?v=20260920-security-v3';
  s.defer=true;
  document.head.appendChild(s);
})();


/* METOM_BRAND_SYNC_20260922 */
(function(){
  function syncMetomBrandAssets(){
    var version='20260922-1';

    document.querySelectorAll('link[rel~="icon"],link[rel="shortcut icon"]').forEach(function(link){
      link.href='/assets/brand/metom_favicon.png?v='+version;
      link.type='image/png';
    });

    if(!document.querySelector('link[rel~="icon"]')){
      var icon=document.createElement('link');
      icon.rel='icon';
      icon.type='image/png';
      icon.href='/assets/brand/metom_favicon.png?v='+version;
      document.head.appendChild(icon);
    }

    document.querySelectorAll('img[src*="/assets/brand/metom_logo.png"],img[src*="assets/brand/metom_logo.png"]').forEach(function(img){
      img.src='/assets/brand/metom_logo.png?v='+version;
    });
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',syncMetomBrandAssets,{once:true});
  }else{
    syncMetomBrandAssets();
  }
})();


/* METOM_GLOBAL_HEADER_BRAND_20260922 */
(function(){
  var style=document.createElement('style');
  style.id='metom-global-header-brand';
  style.textContent=`
    .site-header .brand-logo{
      display:block!important;
      width:188px!important;
      height:auto!important;
      max-width:188px!important;
      max-height:62px!important;
      object-fit:contain!important;
    }
    .site-header .brand{
      min-width:245px!important;
      display:flex!important;
      align-items:center!important;
    }
    @media(max-width:1100px){
      .site-header .brand-logo{
        width:154px!important;
        max-width:154px!important;
        max-height:50px!important;
      }
      .site-header .brand{min-width:0!important}
    }
    @media(max-width:720px){
      .site-header .brand-logo{
        width:128px!important;
        max-width:128px!important;
        max-height:42px!important;
      }
    }
  `;
  document.head.appendChild(style);
})();
