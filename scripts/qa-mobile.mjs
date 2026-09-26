/**
 * Read-only mobile browser QA using Playwright Chromium (390x844).
 * Never submits valid forms and never opens real WhatsApp.
 */
import { chromium,devices } from 'playwright';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({...devices['iPhone 13'],viewport:{width:390,height:844},deviceScaleFactor:1});
await context.addInitScript(()=>{
  try{localStorage.setItem('metom_wa_flow_v1','form')}catch(_){}
});
const page=await context.newPage();
const errors=[];
const details=[];
page.on('pageerror',e=>errors.push('JS: '+e.message));
for(const pathname of ['/','/jasa-desain-interior-malang/','/kontak/']){
 const response=await page.goto('https://metom.id'+pathname,{waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForTimeout(1300);
 const state=await page.evaluate(()=>({
  width:window.innerWidth,
  bodyScrollWidth:document.documentElement.scrollWidth,
  menuVisible:!!document.querySelector('#menuBtn')&&getComputedStyle(document.querySelector('#menuBtn')).display!=='none',
  h1:document.querySelectorAll('h1').length,
  analytics:typeof window.gtag==='function',
  wa:document.querySelectorAll('a[href*="whatsapp.com"],a[href*="wa.me"]').length
 }));
 details.push({path:pathname,http:response?.status(),...state});
 if(response?.status()!==200)errors.push(pathname+' HTTP '+response?.status());
 if(state.bodyScrollWidth>state.width+2)errors.push(pathname+' horizontal overflow: '+state.bodyScrollWidth+'>'+state.width);
 if(!state.menuVisible)errors.push(pathname+' mobile menu button not visible');
 if(state.h1!==1)errors.push(pathname+' H1 count '+state.h1);
 if(!state.analytics)errors.push(pathname+' gtag unavailable');
 if(state.wa<1)errors.push(pathname+' missing WhatsApp link');
 if(pathname==='/'){
  const toggle=page.locator('#menuBtn');
  await toggle.click();
  const opened=await page.evaluate(()=>document.body.classList.contains('mobile-open'));
  if(!opened)errors.push('Mobile menu did not open');
  await toggle.click();
  const closed=await page.evaluate(()=>!document.body.classList.contains('mobile-open'));
  if(!closed)errors.push('Mobile menu did not close');
  await page.waitForFunction(()=>!!document.querySelector('#metomLeadForm'),{timeout:8000}).catch(()=>{});
  if(await page.locator('#metomLeadForm').count()){
   await page.locator('.wa-float').click({timeout:8000});
   if(!await page.locator('.metom-lead-modal.is-open').count())errors.push('WhatsApp form experiment modal did not open');
   else{
    await page.locator('.metom-lead-submit').click({timeout:5000});
    if(!await page.locator('.metom-lead-error.is-visible').count())errors.push('Empty lead form validation did not display');
    await page.locator('.metom-lead-close').click();
   }
  }else errors.push('Lead modal script not initialized');
 }
}
await browser.close();
console.log(JSON.stringify(details,null,2));
errors.forEach(e=>console.error('FAIL '+e));
console.log('MOBILE BROWSER QA: '+(errors.length?'FAIL '+errors.length+' issues':'PASS'));
if(process.env.GITHUB_STEP_SUMMARY){
 fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,'\n## Mobile Chromium QA (390x844)\n'+
 details.map(x=>'- '+x.path+': HTTP '+x.http+', overflow '+(x.bodyScrollWidth>x.width)+'; menu '+x.menuVisible+'; GA4 '+x.analytics).join('\n')+
 '\n'+errors.map(x=>'- FAIL '+x).join('\n')+'\n');
}
if(errors.length)process.exitCode=1;
