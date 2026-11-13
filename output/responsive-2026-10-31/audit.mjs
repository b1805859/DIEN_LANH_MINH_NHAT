import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const phase=process.argv[2] || 'before';
const dir=`output/responsive-2026-10-31/${phase}`;
await fs.mkdir(dir,{recursive:true});
const browser=await chromium.launch({headless:true});
const routes=['/','/services','/services/sua-may-lanh','/about','/contact','/booking','/blog','/projects','/projects/lap-dat-may-lanh-ninh-kieu','/areas/ninh-kieu','/areas/ninh-kieu/sua-may-lanh','/faq','/privacy-policy','/terms-of-service'];
const widths=[320,375,390,430,768,1024,1440];
const results=[];
for(const width of widths){
 const context=await browser.newContext({viewport:{width,height:width===320?568:width<768?844:1000},reducedMotion:'reduce',isMobile:width<901,hasTouch:width<901});
 const page=await context.newPage();
 for(const route of routes){
  const key=route==='/'?'home':route.slice(1).replaceAll('/','-');
  try{
   const response=await page.goto(`http://localhost:3000${route}`,{waitUntil:'networkidle',timeout:60000});
   await page.evaluate(()=>document.fonts.ready);
   // Exercise lazy content and reveal every section before measuring.
   await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,30));}window.scrollTo(0,0)});
   await page.waitForTimeout(150);
   const metrics=await page.evaluate(()=>{
    const visible=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;};
    const elements=[...document.querySelectorAll('.mn-header *, main *, .mn-home-footer *')].filter(visible);
    const overflow=elements.filter(e=>{const r=e.getBoundingClientRect();return r.left < -1 || r.right>innerWidth+1}).filter(e=>!e.closest('svg, [aria-hidden="true"]') && !e.matches('img,canvas')).map(e=>({tag:e.tagName,cls:typeof e.className==='string'?e.className:'',text:e.textContent?.trim().slice(0,75),x:Math.round(e.getBoundingClientRect().x),w:Math.round(e.getBoundingClientRect().width)}));
    const clipped=elements.filter(e=>e.childNodes.length && [...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()) && e.scrollWidth>e.clientWidth+2 && !['inline','contents'].includes(getComputedStyle(e).display)).map(e=>({cls:e.className,text:e.textContent.trim().slice(0,80),w:e.clientWidth,sw:e.scrollWidth}));
    const smallTargets=[...document.querySelectorAll('.mn-header a,.mn-header button,main button, .mn-home-hero a')].filter(visible).filter(e=>{const r=e.getBoundingClientRect();return r.width<44||r.height<44}).map(e=>({cls:e.className,label:e.getAttribute('aria-label')||e.textContent.trim(),w:Math.round(e.getBoundingClientRect().width),h:Math.round(e.getBoundingClientRect().height)}));
    return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow,clipped,smallTargets};
   });
   results.push({width,route,status:response.status(),...metrics});
   if(width>=1024){
    const styles=await page.evaluate(()=>[...document.querySelectorAll('.mn-header, .mn-header *,main,main *, .mn-home-footer, .mn-home-footer *')].filter(e=>!e.closest('svg')).map(e=>{const s=getComputedStyle(e);return {tag:e.tagName,cls:e.getAttribute('class'),style:Array.from(s).filter(k=>!['opacity','transform','translate','scale','rotate','perspective-origin','transform-origin'].includes(k)).map(k=>`${k}:${s.getPropertyValue(k)}`).join(';')}}));
    await fs.writeFile(`${dir}/${width}-${key}-styles.json`,JSON.stringify(styles));
   }
   if([320,390,768,1440].includes(width))await page.screenshot({path:`${dir}/${width}-${key}.png`,fullPage:true,animations:'disabled'});
   console.log(`${phase} ${width} ${route}: overflow=${metrics.overflow.length}, clipped=${metrics.clipped.length}`);
  }catch(e){results.push({width,route,error:e.message});console.log(e.message)}
 }
 await context.close();
}
await fs.writeFile(`${dir}/results.json`,JSON.stringify(results,null,2));
await browser.close();
