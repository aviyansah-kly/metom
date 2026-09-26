#!/usr/bin/env node
/**
 * Metom read-only live smoke test. Run on a network-enabled GitHub runner:
 * node scripts/qa-live.mjs
 * Never submits forms, accesses private customer data or creates real leads.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';

const SITE='https://metom.id';
const sitemap=fs.readFileSync('sitemap.xml','utf8');
const urls=[...sitemap.matchAll(/<loc>(https:\/\/metom\.id\/[^<]*)<\/loc>/g)].map(m=>m[1]);
const failures=[];
const results=[];
assert.equal(urls.length,20,'Production sitemap URL count has changed; review expectations');

async function request(url,{redirect='follow',method='GET'}={}){
  let last;
  for(let i=0;i<2;i++){
    try{return await fetch(url,{redirect,method,headers:{'User-Agent':'Metom-QA/1.0 (+https://metom.id/)'},signal:AbortSignal.timeout(18000)})}
    catch(e){last=e}
  }
  throw last;
}
async function checkPage(url){
  const res=await request(url);
  const html=await res.text();
  const relative=new URL(url).pathname;
  const title=/<title>[^<]+<\/title>/i.test(html);
  const h1=(html.match(/<h1(?:\s|>)/gi)||[]).length;
  const canonicals=[...html.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi)].map(m=>m[0]);
  const expectedCanonical=canonicals.some(t=>t.includes('href="'+url+'"'));
  const noindex=/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
  const pass=res.status===200 && title && h1===1 && expectedCanonical && !noindex;
  results.push({url,status:res.status,title,h1,canonical:expectedCanonical,noindex,pass});
  if(!pass)failures.push('PAGE '+relative+' HTTP '+res.status+' title='+title+' h1='+h1+' canonical='+expectedCanonical+' noindex='+noindex);
}
const batches=[];
for(let i=0;i<urls.length;i+=4)batches.push(urls.slice(i,i+4));
for(const batch of batches){
  await Promise.all(batch.map(async url=>{
    try{await checkPage(url)}catch(e){failures.push('PAGE '+url+' fetch error: '+e.message)}
  }));
}

for(const path of ['/robots.txt','/sitemap.xml','/assets/analytics.js','/assets/lead-capture.js','/assets/brand/metom_favicon.png']){
 try{
  const res=await request(SITE+path);
  const body=path.endsWith('.png')?'':await res.text();
  let valid=res.status===200;
  if(path==='/robots.txt')valid=valid&&body.includes('Sitemap: https://metom.id/sitemap.xml');
  if(path==='/sitemap.xml')valid=valid&&body.includes('<urlset');
  if(path==='/assets/analytics.js')valid=valid&&body.includes('G-TTHXJRKZ49')&&body.includes('generate_lead');
  if(path==='/assets/lead-capture.js')valid=valid&&body.includes('metom-lead-v2');
  console.log('ASSET '+res.status+' '+path+' '+(valid?'PASS':'FAIL'));
  if(!valid)failures.push('ASSET '+path+' HTTP '+res.status+' or expected content missing');
 }catch(e){failures.push('ASSET '+path+' '+e.message)}
}
try{
 const r=await request(SITE+'/');
 for(const header of ['strict-transport-security','content-security-policy','x-content-type-options','x-frame-options'])
  if(!r.headers.get(header))failures.push('SECURITY missing '+header);
 console.log('SECURITY HEADERS '+(failures.some(x=>x.startsWith('SECURITY'))?'FAIL':'PASS'));
}catch(e){failures.push('SECURITY homepage request '+e.message)}
try{
 const r=await request(SITE+'/jurnal/',{redirect:'manual'});
 const location=r.headers.get('location')||'';
 if(r.status!==301||!(location==='/blog/'||location===SITE+'/blog/'))
   failures.push('REDIRECT /jurnal/ HTTP '+r.status+' location '+location);
 else console.log('REDIRECT /jurnal/ 301 PASS');
}catch(e){failures.push('REDIRECT /jurnal/ '+e.message)}
try{
 const r=await request('http://metom.id/',{redirect:'manual'});
 const location=r.headers.get('location')||'';
 if(![301,302,307,308].includes(r.status)||!location.startsWith('https://'))
  failures.push('REDIRECT http://metom.id/ HTTP '+r.status+' location '+location);
 else console.log('REDIRECT http://  HTTPS PASS');
}catch(e){failures.push('REDIRECT http:// '+e.message)}

const count=results.filter(r=>r.pass).length;
console.log('LIVE PAGE QA: '+count+'/'+urls.length+' pass; '+failures.length+' issues');
for(const issue of failures)console.error('FAIL '+issue);
if(process.env.GITHUB_STEP_SUMMARY){
 const summary=['## Metom live read-only QA','20 sitemap URLs (HTTP 200, title, single H1, canonical, indexability), key assets, security headers and redirects.','**Pages passed: '+count+'/'+urls.length+'**','**Issues: '+failures.length+'**',
   ...failures.map(x=>'- '+x),'','Note: this is HTTP/HTML QA, not a mobile browser, real WhatsApp submission, GA4 event verification, Apps Script delivery or Google Lighthouse/PageSpeed score.'];
 fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,summary.join('\n')+'\n');
}
if(failures.length)process.exitCode=1;
