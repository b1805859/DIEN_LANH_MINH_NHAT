import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';
const root='output/home-3d-360';
const browser=await chromium.launch({args:['--use-angle=swiftshader']});
const results={sizes:[],angles:[],errors:[]};
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 page.on('pageerror',e=>results.errors.push(e.message));
 await page.goto('http://127.0.0.1:3010/scene.html?t=0',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>window.__ready);
 for(const t of [0,2,4,6]){
  await page.evaluate(t=>window.__viewer.renderAt(t),t);
  await page.locator('#stage').screenshot({path:`${root}/angle-${t*45}.png`});
  results.angles.push({degrees:t*45,...await page.evaluate(()=>window.__viewer.stats)});
 }
 await page.evaluate(()=>window.__viewer.renderAt(0));
 await page.screenshot({path:`${root}/front-desktop.png`});
 const canvas=page.locator('canvas');const rect=await canvas.boundingBox();
 const before=await page.locator('#angle').textContent();
 await page.mouse.move(rect.x+rect.width*.7,rect.y+rect.height*.5);
 await page.mouse.down();await page.mouse.move(rect.x+rect.width*.3,rect.y+rect.height*.5,{steps:25});await page.mouse.up();
 await page.waitForFunction(before=>document.querySelector('#angle').textContent!==before,before);
 results.mouseDrag=true;
 await page.locator('#reset').click();
 for(let i=0;i<12;i++)await page.locator('#right').click();
 assert(Math.abs(await page.evaluate(()=>window.__viewer.angle)-Math.PI*2)<.001);
 results.fullRotation=true;
 await canvas.focus();await page.keyboard.press('ArrowRight');
 assert(await page.evaluate(()=>window.__viewer.angle)>Math.PI*2);
 results.keyboard=true;
 await page.locator('#reset').click();
 await page.waitForTimeout(200);const idle=await page.evaluate(()=>window.__viewer.stats.renderCount);
 await page.waitForTimeout(600);assert.equal(await page.evaluate(()=>window.__viewer.stats.renderCount),idle);
 results.idleDoesNotRender=true;
 await page.locator('#auto').click();await page.waitForTimeout(700);assert(await page.evaluate(()=>window.__viewer.stats.renderCount)>idle+2);
 await page.locator('#auto').click();await page.waitForTimeout(200);const stopped=await page.evaluate(()=>window.__viewer.stats.renderCount);await page.waitForTimeout(500);assert.equal(await page.evaluate(()=>window.__viewer.stats.renderCount),stopped);
 results.autoStartStop=true;
 const download=page.waitForEvent('download');await page.locator('#export').click();await(await download).saveAs(`${root}/minh-nhat-house-prototype.glb`);
 const glb=await fs.readFile(`${root}/minh-nhat-house-prototype.glb`);assert.equal(glb.toString('utf8',0,4),'glTF');assert.equal(glb.readUInt32LE(4),2);assert.equal(glb.readUInt32LE(8),glb.length);
 const json=JSON.parse(glb.toString('utf8',20,20+glb.readUInt32LE(12)));
 results.export={bytes:glb.length,meshes:json.meshes.length,materials:json.materials.length};
 const loaded=await page.evaluate(async()=>{const {GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js');const gltf=await new GLTFLoader().loadAsync('./minh-nhat-house-prototype.glb');let meshes=0;gltf.scene.traverse(o=>{if(o.isMesh)meshes++;});return meshes;});assert.equal(loaded,json.meshes.length);results.export.reimported=true;
 for(const [width,height] of [[360,800],[390,844],[768,1024],[1440,1000],[1920,1080]]){
  await page.setViewportSize({width,height});await page.locator('#reset').click();await page.waitForTimeout(100);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const geometry=await page.locator('canvas').boundingBox();assert(geometry.width>250&&geometry.height>=400);
  results.sizes.push({width,height,canvas:geometry});
  if(width===390)await page.screenshot({path:`${root}/mobile-390.png`,fullPage:true});
 }
 await page.evaluate(()=>window.__viewer.dispose());results.disposedMemory=await page.evaluate(()=>window.__viewer.stats.memory);
 assert.deepEqual(results.errors,[]);
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});const mobile=await context.newPage();
 await mobile.goto('http://127.0.0.1:3010/scene.html',{waitUntil:'networkidle'});await mobile.waitForFunction(()=>window.__ready);await mobile.locator('#stage').evaluate(e=>e.scrollIntoView({block:'center'}));
 const bounds=await mobile.locator('canvas').boundingBox();const angle=await mobile.locator('#angle').textContent();const cdp=await context.newCDPSession(mobile);const y=Math.max(20,bounds.y+bounds.height*.5),x=bounds.x+bounds.width*.75;
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let i=1;i<=15;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-i*12,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await mobile.waitForFunction(a=>document.querySelector('#angle').textContent!==a,angle);results.touchDrag=true;await context.close();
 const fallback=await browser.newPage();await fallback.route('https://cdn.jsdelivr.net/**',r=>r.abort());await fallback.goto('http://127.0.0.1:3010/scene.html');await fallback.locator('#fallback').waitFor({state:'visible',timeout:18000});assert(await fallback.locator('#fallback').evaluate(e=>e.complete&&e.naturalWidth>0));results.offlineFallback=true;
 console.log(JSON.stringify(results,null,2));
}finally{await fs.writeFile(`${root}/checks.json`,JSON.stringify(results,null,2));await browser.close();}
