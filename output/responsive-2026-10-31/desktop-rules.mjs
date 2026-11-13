import postcss from 'postcss';import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {chromium} from 'playwright';
const files={'mobile.css':'apps/web/app/mobile.css','palette-preview.css':'apps/web/app/palette-preview.css','hero.module.css':'apps/web/components/redesign/hero.module.css','site-header.module.css':'apps/web/components/layout/site-header.module.css'};
const b=await chromium.launch();const results=[];
for(const width of [901,1024,1280,1440,1920])for(const reducedMotion of ['reduce','no-preference']){
 const p=await b.newPage({viewport:{width,height:1000},reducedMotion});
 for(const [name,path]of Object.entries(files)){
  const a=postcss.parse(await fs.readFile(`output/responsive-2026-10-31/source-before/${name}`,'utf8'));
  const z=postcss.parse(await fs.readFile(path,'utf8'));
  async function active(root){const rules=[];for(const n of root.nodes){if(n.type==='comment')continue;if(n.type==='atrule'&&n.name==='media'){if(await p.evaluate(q=>matchMedia(q).matches,n.params))rules.push(...await active(n));}else if(n.type==='rule'){rules.push({selector:n.selector,decls:n.nodes.filter(x=>x.type!=='comment').map(x=>({prop:x.prop,value:x.value,important:x.important||false}))});}else rules.push(n.toString());}return rules;}
  const before=await active(a),after=await active(z);assert.deepEqual(after,before,`${name}: ${width} ${reducedMotion}`);results.push({file:path,width,reducedMotion,activeRules:before.length,identical:true});
 }await p.close();
}
await fs.writeFile('output/responsive-2026-10-31/desktop-rules.json',JSON.stringify(results,null,2));await b.close();console.log('Desktop active CSS identical:',results.length,'checks');
