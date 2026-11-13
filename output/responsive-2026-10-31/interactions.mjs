import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const b=await chromium.launch();const results=[];
for(const width of [320,375,390,430,768]){
 const p=await b.newPage({viewport:{width,height:width===320?568:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 await p.goto('http://localhost:3000',{waitUntil:'networkidle'});
 const trigger=p.getByRole('button',{name:'Mở menu',exact:true});
 await trigger.click();await p.getByRole('dialog').waitFor({state:'visible'});
 assert.equal(await p.evaluate(()=>document.body.style.overflow),'hidden');
 const menuBounds=await p.getByRole('dialog').boundingBox();assert.ok(menuBounds.x>=0&&menuBounds.x+menuBounds.width<=width+1);
 await p.keyboard.press('Escape');await p.getByRole('dialog').waitFor({state:'hidden'});
 assert.notEqual(await p.evaluate(()=>document.body.style.overflow),'hidden');
 const first=await p.locator('#home-service-grid h3').first().textContent();
 await p.getByRole('button',{name:'Nhóm dịch vụ tiếp theo',exact:true}).click();
 assert.notEqual(await p.locator('#home-service-grid h3').first().textContent(),first);
 await p.getByRole('button',{name:'Nhóm dịch vụ trước',exact:true}).click();
 assert.equal(await p.locator('#home-service-grid h3').first().textContent(),first);
 await p.getByRole('tab',{name:'Bài viết',exact:true}).click();
 assert.equal(await p.getByRole('tab',{name:'Bài viết',exact:true}).getAttribute('aria-selected'),'true');
 await p.goto('http://localhost:3000/services',{waitUntil:'networkidle'});
 await p.getByRole('button',{name:'Tủ lạnh',exact:true}).click();
 assert.ok(await p.locator('.mn-service-grid h3').count()>0);
 assert.ok((await p.locator('.mn-service-grid h3').allTextContents()).every(t=>t.toLowerCase().includes('tủ lạnh')));
 await p.goto('http://localhost:3000/services/sua-may-lanh',{waitUntil:'networkidle'});
 const fields=await p.locator('main input,main select,main textarea').evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().width>0).map(e=>({font:parseFloat(getComputedStyle(e).fontSize),h:e.getBoundingClientRect().height,right:e.getBoundingClientRect().right})));
 assert.ok(fields.length>0&&fields.every(e=>e.font>=16&&e.h>=44&&e.right<=width));
 await p.screenshot({path:`output/responsive-2026-10-31/booking-${width}.png`,fullPage:true});
 results.push({width,menu:true,slider:true,tabs:true,filters:true,form:true});await p.close();
}
for(const width of [320,390,768,1440]){
 const p=await b.newPage({viewport:{width,height:844},reducedMotion:'no-preference'});
 await p.addInitScript(()=>{window.__airflowDraws=0;const draw=WebGLRenderingContext.prototype.drawArrays;WebGLRenderingContext.prototype.drawArrays=function(...args){if(this.canvas.closest('.mn-home-hero'))window.__airflowDraws++;return draw.apply(this,args)}});
 await p.goto('http://localhost:3000',{waitUntil:'networkidle'});
 await p.locator('.mn-home-hero canvas').scrollIntoViewIfNeeded();
 await p.waitForFunction(()=>window.__airflowDraws>5);
 const start=await p.evaluate(()=>window.__airflowDraws);await p.waitForTimeout(600);const end=await p.evaluate(()=>window.__airflowDraws);
 assert.ok(end>start,`airflow must animate at ${width}`);
 const canvas=await p.locator('.mn-home-hero canvas').evaluate(e=>({w:e.width,h:e.height,css:e.getBoundingClientRect().toJSON(),parent:e.parentElement.getBoundingClientRect().toJSON()}));
 assert.ok(canvas.w>0&&canvas.h>0&&Math.abs(canvas.css.width-canvas.parent.width)<1);
 await p.screenshot({path:`output/responsive-2026-10-31/airflow-${width}.png`});
 results.push({width,airflow:true,draws:end-start});await p.close();
}
await fs.writeFile('output/responsive-2026-10-31/interactions.json',JSON.stringify(results,null,2));
await b.close();console.log(JSON.stringify(results,null,2));
