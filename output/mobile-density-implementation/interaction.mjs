import{chromium}from'playwright';import assert from'node:assert/strict';import fs from'node:fs/promises';
const b=await chromium.launch();const results=[];
for(const width of[320,375,390,430,768]){
 const p=await b.newPage({viewport:{width,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://localhost:3000',{waitUntil:'networkidle'});
 const mainOrder=await p.locator('.mn-home-content').evaluate(e=>[...e.children].map(x=>x.className));assert.ok(mainOrder[0].includes('mn-home-services'));
 for(const title of['Quy trình làm việc','Về Minh Nhật']){
  const control=p.getByRole('button',{name:new RegExp('^'+title)});assert.equal(await control.getAttribute('aria-expanded'),'false');const id=await control.getAttribute('aria-controls');assert.equal(await p.locator(`[id="${id}"]`).isVisible(),false);
  await control.click();assert.equal(await control.getAttribute('aria-expanded'),'true');assert.equal(await p.locator(`[id="${id}"]`).isVisible(),true);
  await p.waitForTimeout(450);assert.ok(await p.locator(`[id="${id}"] a`).count()>0);
  await p.screenshot({path:`output/mobile-density-implementation/after/${width}-${title==='Về Minh Nhật'?'about':'process'}-open.png`});
  await control.click();assert.equal(await p.locator(`[id="${id}"]`).isVisible(),false);
 }
 for(const title of['Liên kết nhanh','Dịch vụ nổi bật']){
  const control=p.getByRole('button',{name:title,exact:true});assert.equal(await control.getAttribute('aria-expanded'),'false');await control.click();assert.equal(await control.getAttribute('aria-expanded'),'true');const ids=(await control.getAttribute('aria-controls')).split(' ');for(const id of ids)assert.equal(await p.locator(`[id="${id}"]`).isVisible(),true);await control.click();
 }
 await p.getByRole('button',{name:'Mở menu',exact:true}).click();await p.getByRole('dialog',{name:'Điều hướng di động',exact:true}).waitFor();await p.keyboard.press('Escape');await p.getByRole('dialog',{name:'Điều hướng di động',exact:true}).waitFor({state:'hidden'});
 await p.locator('#home-service-grid a').first().click();await p.waitForURL('**/services/sua-may-lanh');assert.ok(await p.locator('.mn-booking-form').count());
 await p.goto('http://localhost:3000',{waitUntil:'networkidle'});await p.getByRole('tab',{name:'Bài viết',exact:true}).click();assert.equal(await p.getByRole('tab',{name:'Bài viết',exact:true}).getAttribute('aria-selected'),'true');
 // Reuse the touch drag path to ensure the contact bubbles remain independent.
 const ai=p.getByRole('button',{name:'Mở AI tư vấn',exact:true});const r=await ai.boundingBox();const c=await p.context().newCDPSession(p);await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:r.x+24,y:r.y+24}]});for(let n=1;n<=8;n++)await c.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:r.x+24+(60-r.x-24)*n/8,y:r.y+24+(300-r.y-24)*n/8}]});await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.equal(await p.getByRole('dialog',{name:'AI tư vấn Minh Nhật',exact:true}).count(),0);assert.ok((await ai.boundingBox()).y<400);await ai.click();await p.getByRole('dialog',{name:'AI tư vấn Minh Nhật',exact:true}).waitFor();await p.getByRole('button',{name:'Đóng tư vấn AI',exact:true}).click();
 await p.setViewportSize({width:1024,height:1000});await p.waitForTimeout(250);assert.equal(await p.locator('.mn-disclosure-toggle:visible').count(),0);assert.equal(await p.locator('.mn-footer-toggle:visible').count(),0);assert.ok((await p.locator('.mn-home-content').evaluate(e=>e.firstElementChild.className)).includes('mn-home-about'));
 assert.deepEqual(errors,[]);results.push({width,disclosures:true,footerLinks:true,menu:true,serviceNavigation:true,tabs:true,touchDrag:true,desktopResize:true,pageErrors:errors});await p.close();
}
for(const width of[320,390,768,1440]){const p=await b.newPage({viewport:{width,height:844},reducedMotion:'no-preference'});await p.addInitScript(()=>{window.draws=0;const draw=WebGLRenderingContext.prototype.drawArrays;WebGLRenderingContext.prototype.drawArrays=function(...args){if(this.canvas.closest('.mn-home-hero'))window.draws++;return draw.apply(this,args)}});await p.goto('http://localhost:3000',{waitUntil:'networkidle'});await p.waitForFunction(()=>window.draws>4);const start=await p.evaluate(()=>window.draws);await p.waitForTimeout(600);assert.ok(await p.evaluate(()=>window.draws)>start);await p.screenshot({path:`output/mobile-density-implementation/after/${width}-airflow.png`});results.push({width,airflow:true});await p.close()}
await fs.writeFile('output/mobile-density-implementation/interactions.json',JSON.stringify(results,null,2));await b.close();console.log(results);
