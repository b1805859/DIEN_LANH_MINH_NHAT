import {chromium} from 'playwright';import fs from 'node:fs/promises';
const b=await chromium.launch();const results=[];
for(const width of [320,390,430]){
 const p=await b.newPage({viewport:{width,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 for(const route of ['/','/services','/blog','/contact']){
  await p.goto('http://localhost:3000'+route,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
  const name=route==='/'?'home':route.slice(1);
  const metrics=await p.evaluate(()=>{const items=[...document.querySelectorAll('main > section, .mn-home-content > *, .mn-home-footer, .mn-service-grid, .mn-project-grid, .mn-service-card, .mn-page-hero')];return{height:document.documentElement.scrollHeight,screens:Math.round(document.documentElement.scrollHeight/innerHeight*10)/10,sections:items.map(e=>({cls:e.className,y:Math.round(e.getBoundingClientRect().top+scrollY),h:Math.round(e.getBoundingClientRect().height),text:e.textContent.trim().slice(0,80)}))}});
  results.push({width,route,...metrics});
  if(width===390){await p.screenshot({path:`output/mobile-density-review/${name}-top.png`});for(const selector of route==='/'?['.mn-home-about','.mn-home-process-journey','.mn-home-services','.mn-home-footer']:route==='/services'?['.mn-service-grid','.mn-home-footer']:route==='/blog'?['.mn-project-grid','.mn-home-footer']:['.mn-home-footer']){if(await p.locator(selector).count()){await p.locator(selector).scrollIntoViewIfNeeded();await p.waitForTimeout(700);await p.screenshot({path:`output/mobile-density-review/${name}-${selector.slice(1)}.png`});}}await p.screenshot({path:`output/mobile-density-review/${name}-full.png`,fullPage:true});}
 }
 await p.close();
}
await fs.writeFile('output/mobile-density-review/metrics.json',JSON.stringify(results,null,2));await b.close();console.log(results.map(({width,route,height,screens})=>({width,route,height,screens})));
