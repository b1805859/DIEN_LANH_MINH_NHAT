import { chromium } from 'playwright';
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
const out=new URL('./',import.meta.url).pathname;
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1,reducedMotion:'reduce'});
await page.goto('http://localhost:3000/',{waitUntil:'networkidle'});
await page.evaluate(async()=>{await document.fonts.ready; await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});
await page.screenshot({path:`${out}implemented-desktop.png`});
await page.screenshot({path:`${out}implemented-desktop-full.png`,fullPage:true});
await page.setViewportSize({width:375,height:900});
await page.screenshot({path:`${out}implemented-mobile.png`});
const report=[];
for(const name of ['desktop','mobile']) {
 const a=await sharp(`${out}${name}.png`).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const b=await sharp(`${out}implemented-${name}.png`).removeAlpha().raw().toBuffer();
 let changed=0,total=0; const diff=Buffer.alloc(b.length);
 for(let i=0;i<b.length;i+=3){let max=0;for(let j=0;j<3;j++){const d=Math.abs(a.data[i+j]-b[i+j]);diff[i+j]=d;total+=d;max=Math.max(max,d);}if(max>20)changed++;}
 await sharp(diff,{raw:a.info}).png().toFile(`${out}diff-${name}.png`);
 report.push({name,changedPixelsPercent:100*changed/(b.length/3),meanChannelDifference:total/b.length});
}
console.log(report);
await writeFile(`${out}comparison.json`,JSON.stringify(report,null,2));
await page.getByRole('button',{name:'Mở menu',exact:true}).click();
console.log('Mobile menu visible:',await page.getByRole('dialog').isVisible());
await page.getByRole('button',{name:'Đóng menu',exact:true}).click();
await page.getByRole('button',{name:'Máy giặt',exact:true}).click();
console.log('Equipment picker:',await page.getByRole('button',{name:'Máy giặt',exact:true}).getAttribute('aria-pressed'));
await browser.close();
