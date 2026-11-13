import sharp from 'sharp';
import fs from 'node:fs/promises';
const dir='output/ai-chat-implementation';
const ref='output/ai-chat-implementation/reference.png';
const sources={pc:{left:104,top:347,width:456,height:612},laptop:{left:650,top:370,width:374,height:576},mobile:{left:1097,top:296,width:397,height:680}};
for(const [name,crop] of Object.entries(sources)){
const meta=JSON.parse(await fs.readFile(`${dir}/${name}-meta.json`,'utf8'));const image=sharp(`${dir}/${name}-open.png`);const d=await image.metadata();const b=meta.panel;const rx=d.width/meta.view[0],ry=d.height/meta.view[1];const box={left:Math.round(b.x*rx),top:Math.round(b.y*ry),width:Math.round(b.width*rx),height:Math.round(b.height*ry)};
const render=await image.extract(box).resize({width:b.width,height:b.height}).png().toBuffer();await fs.writeFile(`${dir}/${name}-panel.png`,render);
const truth=await sharp(ref).extract(crop).resize({width:b.width}).png().toBuffer();const td=await sharp(truth).metadata();await sharp({create:{width:b.width*2+24,height:Math.max(b.height,td.height)+32,channels:3,background:'#e8f0f7'}}).composite([{input:truth,left:0,top:16},{input:render,left:b.width+24,top:16}]).png().toFile(`${dir}/${name}-comparison.png`);
}
await sharp({create:{width:1210,height:680,channels:3,background:'#edf5fc'}}).composite([{input:`${dir}/pc-panel.png`,left:20,top:20},{input:`${dir}/laptop-panel.png`,left:440,top:20},{input:`${dir}/mobile-panel.png`,left:820,top:20}]).png().toFile(`${dir}/implementation-preview.png`);
