import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true,channel:"chrome"});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1,reducedMotion:'reduce'});
const errors=[];page.on('pageerror',e=>errors.push(e.message)); page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
const routes=[['home','/'],['services','/services'],['about','/about'],['projects','/projects'],['blog','/blog'],['booking','/booking'],['contact','/contact'],['service-detail','/services/sua-may-lanh'],['article','/blog/bao-lau-nen-ve-sinh-may-lanh-mot-lan'],['project-detail','/projects/lap-dat-may-lanh-ninh-kieu'],['area','/areas/ninh-kieu'],['area-service','/areas/cai-rang/sua-tu-lanh']];
const results=[];
async function loadPhotos(){await page.evaluate(async()=>{const photos=[...document.images]; for(const image of photos) image.loading='eager'; await Promise.all(photos.map(image=>image.decode().catch(()=>{}))); await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});await page.waitForTimeout(150);}

for(const [name,path] of routes){const response=await page.goto('https://dien-lanh-minh-nhat.vercel.app'+path,{waitUntil:'networkidle'});await loadPhotos();await page.screenshot({path:`output/production-review/before/${name}-desktop.png`,fullPage:true,animations:'disabled'});results.push({path,status:response.status(),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});}
await page.setViewportSize({width:1122,height:900});await page.goto('https://dien-lanh-minh-nhat.vercel.app',{waitUntil:'networkidle'});await loadPhotos();await page.locator('.mn-home-hero').screenshot({path:'output/production-review/before/hero-1122.png',animations:'disabled'});
await page.setViewportSize({width:390,height:844});for(const [name,path] of routes){await page.goto('https://dien-lanh-minh-nhat.vercel.app'+path,{waitUntil:'networkidle'});await loadPhotos();await page.screenshot({path:`output/production-review/before/${name}-mobile.png`,fullPage:true,animations:'disabled'});results.push({path,mobile:true,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});}
await fs.writeFile('output/production-review/before/render-results.json',JSON.stringify({results,errors},null,2));console.log(JSON.stringify({results,errors}));await browser.close();
