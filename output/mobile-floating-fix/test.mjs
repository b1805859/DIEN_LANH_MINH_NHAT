import { chromium } from 'playwright';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
const b=await chromium.launch();const results=[];
for(const width of [320,375,390,393,430,768]){
 const p=await b.newPage({viewport:{width,height:852},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
 await p.goto('http://localhost:3000/blog',{waitUntil:'networkidle'});
 const client=await p.context().newCDPSession(p);
 const drag=async(r,x,y)=>{const start={x:r.x+r.width/2,y:r.y+r.height/2};await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[start]});for(let n=1;n<=12;n++)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start.x+(x-start.x)*n/12,y:start.y+(y-start.y)*n/12}]});await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})};
 const ai=p.getByRole('button',{name:'Mở AI tư vấn',exact:true}),zalo=p.getByRole('link',{name:'Liên hệ qua Zalo',exact:true});
 const before=await ai.boundingBox();assert.ok(before.x>=0&&before.x+before.width<=width&&before.height>=44);
 await drag(before,56,270);
 assert.equal(await p.getByRole('dialog',{name:'AI tư vấn Minh Nhật',exact:true}).count(),0);
 const moved=await ai.boundingBox();assert.ok(Math.abs(moved.x-before.x)>30&&moved.y<400);
 const zr=await zalo.boundingBox();assert.ok(zr.x>moved.x&&zr.y>moved.y);
 let popups=0;p.on('popup',popup=>{popups++;popup.close()});
 await drag(zr,100,450);await p.waitForTimeout(100);assert.equal(popups,0);
 await ai.click();await p.getByRole('dialog',{name:'AI tư vấn Minh Nhật',exact:true}).waitFor();
 const dialog=await p.getByRole('dialog',{name:'AI tư vấn Minh Nhật',exact:true}).boundingBox();assert.ok(dialog.x>=0&&dialog.x+dialog.width<=width+1&&dialog.y>=0&&dialog.y+dialog.height<=852);
 await p.getByRole('button',{name:'Đóng tư vấn AI',exact:true}).click();await ai.waitFor();const restored=await ai.boundingBox();assert.ok(Math.abs(restored.x-moved.x)<1&&Math.abs(restored.y-moved.y)<1);
 await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await p.waitForTimeout(500);
 const footer=await p.locator('.mn-home-footer').boundingBox();assert.ok(Math.abs(footer.y+footer.height-852)<2,`footer must reach viewport bottom at ${width}: ${footer.y+footer.height}`);
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth),width);
 await p.screenshot({path:`output/mobile-floating-fix/blog-footer-${width}.png`});
 // Drag outside the viewport: the bubble must remain reachable.
 const r=await ai.boundingBox();await drag(r,0,0);const clamped=await ai.boundingBox();assert.ok(clamped.x>=12&&clamped.y>=12);
 await p.setViewportSize({width:1024,height:852});await p.waitForTimeout(100);assert.equal(await ai.evaluate(e=>e.style.left),'');
 results.push({width,dragAI:true,dragZalo:true,noAccidentalClick:true,chat:true,positionRestored:true,footerGap:0,clamped:true,desktopReset:true});await p.close();
}
await fs.writeFile('output/mobile-floating-fix/results.json',JSON.stringify(results,null,2));await b.close();console.log(results);
