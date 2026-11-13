import { chromium } from 'playwright';
import { mkdir,writeFile } from 'node:fs/promises';
const out=new URL('./responsive/',import.meta.url).pathname;
await mkdir(out,{recursive:true});
const browser=await chromium.launch();
const page=await browser.newPage({reducedMotion:'reduce',deviceScaleFactor:1});
const checks=[];
for(const width of [320,375,768,1024,1440,1920]) {
 await page.setViewportSize({width,height:900});
 await page.goto('http://localhost:3000/',{waitUntil:'networkidle'});
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});
 checks.push(await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,hero:Math.round(document.querySelector('.approved-home-hero').getBoundingClientRect().height),chooser:Math.round(document.querySelector('.approved-home-chooser').getBoundingClientRect().height),frame:Math.round(document.querySelector('.approved-home-frame').getBoundingClientRect().width),header:Math.round(document.querySelector('.mn-header').getBoundingClientRect().width)})));
 await page.screenshot({path:`${out}${width}.png`});
 if(width===375||width===1440)await page.screenshot({path:`${out}${width}-full.png`,fullPage:true});
}
await page.getByRole('button',{name:'Máy giặt',exact:true}).click();
console.log('Picker:',await page.getByRole('button',{name:'Máy giặt',exact:true}).getAttribute('aria-pressed'));
await page.setViewportSize({width:375,height:900});
await page.getByRole('button',{name:'Mở menu',exact:true}).click();
console.log('Menu:',await page.getByRole('dialog').isVisible());
console.log(checks);
await writeFile(`${out}checks.json`,JSON.stringify(checks,null,2));
await browser.close();
