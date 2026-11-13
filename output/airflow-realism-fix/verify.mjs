import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const browser = await chromium.launch({ headless: true });
const results = [];
for (const [width, height] of [[1440,900],[1920,1080],[1024,900],[390,844]]) {
  const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  for(const time of [0,3,6]) {
    await page.goto(`http://localhost:3000/?t=${time}`,{waitUntil:'networkidle'});
    await page.waitForTimeout(900);
    const canvas = page.locator('.mn-hero-airflow');
    await canvas.screenshot({path:`output/airflow-realism-fix/scene-${width}-t${time}.png`});
    const state=await page.evaluate(()=>({canvas:document.querySelector('.mn-hero-airflow canvas')?.width,overflow:document.documentElement.scrollWidth>innerWidth}));
    results.push({width,time,...state,errors:[...errors]});
  }
  if(width===1440){
    await page.screenshot({path:'output/airflow-realism-fix/after.png'});
    await page.goto('http://localhost:3000/?airflow=off',{waitUntil:'networkidle'});
    await page.waitForTimeout(900);
    await page.locator('.mn-hero-airflow').screenshot({path:'output/airflow-realism-fix/scene-off.png'});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('http://localhost:3000/',{waitUntil:'networkidle'});
    await page.waitForTimeout(900);
    await page.locator('.mn-hero-airflow').screenshot({path:'output/airflow-realism-fix/reduced-a.png'});
    await page.waitForTimeout(1000);
    await page.locator('.mn-hero-airflow').screenshot({path:'output/airflow-realism-fix/reduced-b.png'});
  }
  await page.close();
}
await browser.close();
await fs.writeFile('output/airflow-realism-fix/results.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results));
if(results.some(r=>r.errors.length||r.overflow||!r.canvas))process.exitCode=1;
