import {chromium} from 'playwright';import fs from 'node:fs/promises';import assert from 'node:assert/strict';
const b=await chromium.launch();const results=[];
const shared=await fs.readFile('packages/shared/src/index.ts','utf8');
const services=[...shared.slice(shared.indexOf('export const SERVICES'),shared.indexOf('export const BLOG_CATEGORIES')).matchAll(/slug: '([^']+)'/g)].map(m=>`/services/${m[1]}`);
for(const width of [320,375,390,430,768]){
 const p=await b.newPage({viewport:{width,height:844},reducedMotion:'reduce'});
 const routes=['/blog/bao-lau-nen-ve-sinh-may-lanh-mot-lan','/blog/category/may-lanh',...(width===320||width===768?services:[])];
 for(const route of routes){
  const response=await p.goto('http://localhost:3000'+route,{waitUntil:'networkidle'});
  const metrics=await p.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clipped:[...document.querySelectorAll('main *')].filter(e=>!e.closest('svg, [aria-hidden="true"],.sr-only')&&e.childNodes.length&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&e.scrollWidth>e.clientWidth+2&&!['inline','contents'].includes(getComputedStyle(e).display)).map(e=>({cls:e.className,text:e.textContent.trim().slice(0,80)}))}));
  assert.equal(response.status(),200,route);assert.ok(metrics.scrollWidth<=width,route);assert.equal(metrics.clipped.length,0,route);
  results.push({width,route,status:response.status(),...metrics});
  if(route.startsWith('/blog/'))await p.screenshot({path:`output/responsive-2026-10-31/extra-after-${width}-${route.replaceAll('/','-')}.png`,fullPage:true});
 }
 await p.close();
}
for(const viewport of [{width:844,height:390},{width:900,height:600}]){
 const p=await b.newPage({viewport,reducedMotion:'reduce'});await p.goto('http://localhost:3000',{waitUntil:'networkidle'});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth),viewport.width);
 await p.screenshot({path:`output/responsive-2026-10-31/landscape-${viewport.width}.png`,fullPage:true});results.push({...viewport,landscape:true});await p.close();
}
await fs.writeFile('output/responsive-2026-10-31/supplemental.json',JSON.stringify(results,null,2));await b.close();console.log('passed',results.length);
