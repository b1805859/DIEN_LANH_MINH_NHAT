import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base='https://dien-lanh-minh-nhat.vercel.app';
const out='output/production-review/after';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});
const context=await browser.newContext({reducedMotion:'reduce',deviceScaleFactor:1});
const routes=[['home','/'],['services','/services'],['service-detail','/services/sua-may-lanh'],['about','/about'],['projects','/projects'],['news','/blog'],['contact','/contact'],['booking','/booking']];
const records=[];
for(const width of [1440,1280,1024,768,390,375]) {
 const page=await context.newPage();await page.setViewportSize({width,height:width<500?844:1000});
 for(const [name,path] of routes){
  const errors=[];const failed=[];const errorHandler=e=>errors.push(e.message);const responseHandler=r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()})};
  page.on('pageerror',errorHandler);page.on('response',responseHandler);
  await page.addInitScript(()=>{window.__qa={lcp:0,cls:0};new PerformanceObserver(list=>{for(const e of list.getEntries())window.__qa.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__qa.cls+=e.value}).observe({type:'layout-shift',buffered:true});});
  const response=await page.goto(base+path,{waitUntil:'networkidle'});
  const firstView=await page.evaluate(()=>({...window.__qa}));
  await page.evaluate(async()=>{for(const img of document.images)img.loading='eager';await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));await document.fonts.ready;});
  const dom=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,brokenImages:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.getAttribute('src')),h1:[...document.querySelectorAll('h1')].map(e=>e.textContent),canonical:document.querySelector('link[rel=canonical]')?.href,unlabelledFields:[...document.querySelectorAll('input:not([type=hidden]),select,textarea')].filter(e=>!e.labels?.length&&!e.getAttribute('aria-label')).map(e=>e.name),title:document.title}));
  await page.screenshot({path:`${out}/${name}-${width}.png`,fullPage:true,animations:'disabled'});
  if(width===1440&&name==='home')await page.locator('.mn-home-hero').screenshot({path:`${out}/home-hero.png`,animations:'disabled'});
  if(width===1440&&name==='services')await page.locator('.mn-support').screenshot({path:`${out}/support-banner.png`,animations:'disabled'});
  records.push({name,width,path,status:response.status(),...dom,firstView,errors,failed});
  page.off('pageerror',errorHandler);page.off('response',responseHandler);
 }
 await page.close();console.log('Captured width',width);
}
await fs.writeFile(`${out}/responsive-results.json`,JSON.stringify(records,null,2));
await context.close();await browser.close();
const faults=records.filter(r=>r.status!==200||r.overflow||r.brokenImages.length||r.errors.length||r.failed.length||r.unlabelledFields.length||r.h1.length!==1);
console.log(JSON.stringify({screenshots:records.length,faults},null,2));assert.equal(faults.length,0);
