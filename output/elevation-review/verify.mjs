import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const base='http://localhost:3000';
const xml=await (await fetch(base+'/sitemap.xml')).text();
const routes=[...new Set([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname).concat(['/projects/lap-dat-may-lanh-ninh-kieu','/projects/sua-tu-lanh-binh-thuy','/projects/ve-sinh-may-giat-cai-rang','/projects/dien-nuoc-nha-pho','/admin/login']))];
const browser=await chromium.launch();const results=[];
const selector='.mn-service-card, .mn-project-card, .mn-panel, .mn-process-grid article, .mn-reasons article, .mn-contact-map, .mn-contact-methods > a, .mn-contact-email, .mn-support, .mn-page-hero, .admin-login-panel';
await Promise.all([1440,390].map(async width=>{
 const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
 for(const route of routes){
  try {
   const response=await page.goto(base+route,{waitUntil:'load',timeout:30000});
   await page.evaluate(()=>document.fonts.ready);
   await page.locator('main').first().waitFor();
   const info=await page.evaluate(selector=>({overflow:document.documentElement.scrollWidth>innerWidth,cards:[...document.querySelectorAll(selector)].filter(el=>el.getBoundingClientRect().width>0).map(el=>({class:el.className,shadow:getComputedStyle(el).boxShadow,background:getComputedStyle(el).backgroundColor}))}),selector);
   results.push({route,width,status:response.status(),...info});
   if(['/','/about','/contact','/faq','/services/sua-may-lanh','/admin/login'].includes(route)){
    const target=page.locator(route==='/'?'.mn-service-card':route==='/about'?'.mn-reasons':route==='/contact'?'.mn-booking-shell':route==='/faq'?'.mn-faq-card':route==='/admin/login'?'.admin-login-panel':'.mn-detail-booking').first();
    if(await target.count())await target.scrollIntoViewIfNeeded();
    await page.screenshot({path:`output/elevation-review/final-${route.slice(1).replaceAll('/','-')||'home'}-${width}.png`});
   }
  }catch(error){results.push({route,width,error:String(error)});}
 }
 await page.close();
}));
await fs.writeFile('output/elevation-review/route-validation.json',JSON.stringify(results,null,2));
console.log(JSON.stringify({routes:routes.length,checks:results.length,failures:results.filter(r=>r.error||r.status!==200||r.overflow),unshadowed:[...new Set(results.flatMap(r=>(r.cards||[]).filter(c=>c.shadow==='none').map(c=>c.class)))]},null,2));
await browser.close();
