import {chromium} from 'playwright';
import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
const root=new URL('./shared-menu-v2/',import.meta.url).pathname;
const out=`${root}implementation/`;
await mkdir(out,{recursive:true});
const browser=await chromium.launch();
const page=await browser.newPage({deviceScaleFactor:1,reducedMotion:'reduce'});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
const checks=[];
async function compare(name) {
 const a=await sharp(`${root}${name}.png`).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const b=await sharp(`${out}${name}.png`).removeAlpha().raw().toBuffer({resolveWithObject:true});
 if(a.info.width!==b.info.width||a.info.height!==b.info.height)return {name,reference:a.info,actual:b.info};
 let changed=0,sum=0,max=0; const diff=Buffer.alloc(b.data.length);
 for(let i=0;i<diff.length;i+=3){let pixel=0;for(let j=0;j<3;j++){let d=Math.abs(a.data[i+j]-b.data[i+j]);diff[i+j]=d;sum+=d;pixel=Math.max(pixel,d);}if(pixel>20)changed++;max=Math.max(max,pixel);}
 await sharp(diff,{raw:b.info}).png().toFile(`${out}diff-${name}.png`);
 return {name,differentPixelsAbove20:changed,percent:100*changed/(diff.length/3),meanDifference:sum/diff.length,maxDifference:max};
}
// Match the approved mockup's desktop-load then resize capture sequence.
await page.setViewportSize({width:1440,height:1000});
await page.goto('http://localhost:3000/',{waitUntil:'networkidle'});
for(const [width,name] of [[1440,'desktop'],[375,'mobile'],[768,'tablet']]) {
 await page.setViewportSize({width,height:1000});
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});
 await page.screenshot({path:`${out}${name}.png`});
 checks.push(await compare(name));
 if(name!=='tablet') {
  await page.screenshot({path:`${out}${name}-full.png`,fullPage:true});
  checks.push(await compare(`${name}-full`));
 }
}
await page.setViewportSize({width:375,height:1000});
await page.getByRole('button',{name:'Mở menu',exact:true}).click();
const menu=await page.getByRole('dialog').isVisible();
await page.getByRole('button',{name:'Đóng menu',exact:true}).click();
await page.getByRole('button',{name:'Máy giặt',exact:true}).click();
const picker=await page.getByRole('button',{name:'Máy giặt',exact:true}).getAttribute('aria-pressed');
const widths=[];
for(const width of [320,375,768,1024,1440,1920]){
 await page.setViewportSize({width,height:1000});
 widths.push(await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth})));
}
const report={checks,menu,picker,errors,widths};
console.log(JSON.stringify(report,null,2));
await writeFile(`${out}verification.json`,JSON.stringify(report,null,2));
await browser.close();
