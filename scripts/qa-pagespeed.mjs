/**
 * Optional live mobile PageSpeed Insights probe. Reports real API results only;
 * does not invent a score when Google API rate-limits this runner.
 */
import fs from 'node:fs';
const pages=['https://metom.id/','https://metom.id/jasa-desain-interior-malang/'];
const lines=['## Google PageSpeed Insights: mobile'];
for(const url of pages){
 const api='https://www.googleapis.com/pagespeedonline/v5/runPagespeed?strategy=mobile&category=performance&url='+encodeURIComponent(url);
 try{
  const response=await fetch(api,{signal:AbortSignal.timeout(100000)});
  const data=await response.json();
  if(!response.ok){
   const err='PSI unavailable HTTP '+response.status+': '+String(data.error?.message||'').slice(0,220);
   console.log(url+' '+err);lines.push('- '+url+': '+err);continue;
  }
  const a=data.lighthouseResult?.audits||{};
  const score=data.lighthouseResult?.categories?.performance?.score;
  const format=(id)=>a[id]?.displayValue||'n/a';
  const result=url+' MOBILE Performance: '+(Number.isFinite(score)?Math.round(score*100)+'/100':'n/a')+
   ', LCP '+format('largest-contentful-paint')+', CLS '+format('cumulative-layout-shift')+
   ', TBT '+format('total-blocking-time')+', FCP '+format('first-contentful-paint');
  console.log(result);lines.push('- '+result);
 }catch(e){
  const msg='PSI unavailable: '+e.message;
  console.log(url+' '+msg);lines.push('- '+url+': '+msg);
 }
}
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,lines.join('\n')+'\n');
