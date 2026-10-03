import { chromium } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../../', import.meta.url));
const output = path.join(root, 'output/company-reference');
await mkdir(output, {recursive:true});
const files = [];
async function collect(name) {
  for (const e of await readdir(path.join(root,name),{withFileTypes:true})) {
    const child = path.join(name,e.name);
    if(e.isDirectory()) await collect(child); else files.push(child);
  }
}
for(const dir of ['apps/web/components/home-reference','apps/web/components/services-reference','apps/web/components/areas-reference','apps/web/public']) await collect(dir);
files.push('apps/web/app/page.tsx','apps/web/app/services/page.tsx','apps/web/app/areas/page.tsx','apps/web/app/layout.tsx','apps/web/app/globals.css','apps/web/app/mockup.css','apps/web/app/mockup-fonts.css','apps/web/components/layout/site-chrome.tsx');
const hashes=Object.fromEntries(await Promise.all(files.map(async file=>[file,createHash('sha256').update(await readFile(path.join(root,file))).digest('hex')])));
await writeFile(path.join(output,'before-hashes.json'),JSON.stringify(hashes,null,2));
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({reducedMotion:'reduce',deviceScaleFactor:1});
await context.route(/\/bookings(?:\?.*)?$/,route=>route.request().method()==='POST'?route.abort():route.continue());
const page=await context.newPage();
for(const [url,name,width,height] of [['/','home',1024,900],['/services','services',941,900],['/areas','areas',880,1788]]) {
 await page.setViewportSize({width,height});
 await page.goto('http://localhost:3000'+url,{waitUntil:'networkidle'});
 await page.getByRole('heading',{level:1}).waitFor();
 await page.evaluate(async()=>{await document.fonts.ready;for(let y=0;y<document.documentElement.scrollHeight;y+=innerHeight*.75){scrollTo(0,y);await new Promise(r=>setTimeout(r,80));}await Promise.all([...document.images].filter(i=>i.getClientRects().length).map(i=>i.decode().catch(()=>{})));scrollTo(0,0);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
 await page.screenshot({path:path.join(output,name+'-before.png'),fullPage:true});
 const snapshot=await page.evaluate(()=>{
  const properties=['display','position','box-sizing','width','height','max-width','min-width','padding','margin','border','border-radius','color','background','font-family','font-size','font-weight','line-height','letter-spacing','text-align','grid-template-columns','grid-template-rows','flex-direction','gap','align-items','justify-content','object-fit','object-position','overflow','opacity','transform'];
  return {url:location.pathname,width:innerWidth,height:innerHeight,documentWidth:document.documentElement.scrollWidth,documentHeight:document.documentElement.scrollHeight,elements:[...document.querySelectorAll('body *')].filter(e=>!['SCRIPT','STYLE','NEXTJS-PORTAL','NOSCRIPT'].includes(e.tagName)&&!e.closest('nextjs-portal')&&e.getClientRects().length).map(e=>{const r=e.getBoundingClientRect();const css=getComputedStyle(e);return {tag:e.tagName,classes:String(e.className),rect:[r.x,r.y,r.width,r.height],properties:Object.fromEntries(properties.map(p=>[p,css.getPropertyValue(p)])),image:e instanceof HTMLImageElement?[e.currentSrc,e.naturalWidth,e.naturalHeight]:null};})};
 });
 await writeFile(path.join(output,name+'-before.json'),JSON.stringify(snapshot,null,2));
 console.log(`Captured ${name} ${width}x${height}`);
}
await browser.close();
console.log(`Baseline ready: ${files.length} hashes`);
