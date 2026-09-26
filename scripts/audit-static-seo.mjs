#!/usr/bin/env node
/**
 * Metom's dependency-free, build-time technical SEO check.
 * Run: node scripts/audit-static-seo.mjs
 * It checks ONLY the 20 indexable URLs in sitemap.xml; /preview/home-v2 stays untouched.
 */
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const urls=[...sitemap.matchAll(/<loc>\s*(https:\/\/metom\.id\/[^<]*)\s*<\/loc>/g)].map(x=>x[1]);
const errors=[],warnings=[],titles=new Map(),descriptions=new Map();
const assert=(ok,page,message)=>{if(!ok)errors.push(page+': '+message)};
const tag=(html,name)=>[...html.matchAll(new RegExp('<'+name+'\\b[^>]*>','gi'))].map(x=>x[0]);
const attr=(html,key)=>{const m=html.match(new RegExp('\\b'+key+'\\s*=\\s*"([^"]*)"','i'));return m?.[1]||''};
const report=[];

for(const url of urls){
 const pathname=new URL(url).pathname;
 const relative=pathname.replace(/^\//,'').replace(/\/$/,'');
 const candidates=relative?[
   path.join(root,relative+'.html'),
   path.join(root,relative,'index.html')
 ]:[path.join(root,'index.html')];
 const file=candidates.find(fs.existsSync);
 assert(!!file,pathname,'No static source file found for sitemap URL');
 if(!file)continue;
 const html=fs.readFileSync(file,'utf8');
 const page=path.relative(root,file);
 const title=html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim()||'';
 const description=html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)/i)?.[1]||'';
 const h1=tag(html,'h1').length;
 const canonicals=tag(html,'link').filter(t=>/\brel=["']canonical["']/.test(t));
 const canon=canonicals.map(t=>attr(t,'href'));
 const robots=tag(html,'meta').find(t=>attr(t,'name').toLowerCase()==='robots');
 const icons=tag(html,'link').filter(t=>/\brel=["'](?:shortcut )?icon["']/.test(t));
 const scriptTags=tag(html,'script').filter(t=>attr(t,'src'));
 const styles=tag(html,'link').filter(t=>attr(t,'rel')==='stylesheet');
 const images=tag(html,'img');

 assert(title.length>0,pathname,'Missing title');
 assert(description.length>40,pathname,'Missing/short meta description');
 assert(h1===1,pathname,'Expected exactly one H1, found '+h1);
 assert(canon.length===1&&canon[0]===url,pathname,'Expected self-referencing canonical '+url+', found '+JSON.stringify(canon));
 assert(robots&&!/noindex/i.test(attr(robots,'content')),pathname,'Indexable sitemap page has noindex or missing robots tag');
 assert(icons.some(t=>attr(t,'href').startsWith('/assets/brand/metom_favicon.png')),pathname,'Favicon does not resolve to current static brand asset');
 for(const img of images)assert(/\balt\s*=/.test(img),pathname,'Image without alt attribute');
 for(const t of [...scriptTags,...styles]){const src=attr(t,'src')||attr(t,'href');assert(!/^assets\//.test(src),pathname,'Relative asset URL '+src+' may incur a wrong nested request');}
 if(titles.has(title))warnings.push(pathname+': duplicate title with '+titles.get(title));
 if(descriptions.has(description))warnings.push(pathname+': duplicate description with '+descriptions.get(description));
 titles.set(title,pathname);descriptions.set(description,pathname);
 const offscreen=images.filter((x,i)=>i>=2&&!/loading=["']lazy["']/.test(x)).length;
 if(offscreen>4)warnings.push(pathname+': '+offscreen+' later images without explicit lazy loading; check LCP vs offscreen rendering manually');
 report.push({page,h1,images:images.length,canonical:canon[0]});
}
assert(urls.length===20,'sitemap.xml','Expected 20 production indexable pages; found '+urls.length);
console.log('METOM STATIC SEO AUDIT');
console.log('Indexable sitemap URLs: '+urls.length);
console.log('HTML pages checked: '+report.length);
console.log('Errors: '+errors.length+'; warnings: '+warnings.length);
for(const x of warnings)console.warn('WARN '+x);
for(const x of errors)console.error('FAIL '+x);
if(process.env.GITHUB_STEP_SUMMARY){
 fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
   '## Metom static SEO QA\\nChecked **'+report.length+'** sitemap pages. **'+errors.length+'** errors, **'+warnings.length+'** warnings.\\n' +
   errors.map(x=>'- FAIL: '+x).join('\\n')+'\\n'+warnings.map(x=>'- WARN: '+x).join('\\n')+'\\n');
}
if(errors.length)process.exitCode=1;
