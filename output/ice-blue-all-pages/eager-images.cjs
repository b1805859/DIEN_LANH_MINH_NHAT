const fs=require('node:fs'); const path=require('node:path'); const ts=require('typescript');
const root=path.join(__dirname,'preview');
function visit(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(e.isSymbolicLink()||e.name.startsWith('.next'))continue; const f=path.join(dir,e.name);if(e.isDirectory())visit(f);else if(e.name.endsWith('.tsx')){
  let s=fs.readFileSync(f,'utf8'); const ast=ts.createSourceFile(f,s,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);const edits=[];
  function walk(node){if(ts.isJsxOpeningElement(node)||ts.isJsxSelfClosingElement(node)){const tag=node.tagName.getText(ast);if(['Image','LoadingImage','img'].includes(tag)){
    const attrs=node.attributes.properties;const loading=attrs.find(a=>ts.isJsxAttribute(a)&&a.name.text==='loading');
    if(loading)edits.push([loading.getStart(ast),loading.getEnd(),'loading="eager"']);
    else edits.push([node.tagName.getEnd(),node.tagName.getEnd(),' loading="eager"']);
  }}ts.forEachChild(node,walk);}walk(ast);for(const [a,b,t]of edits.sort((a,b)=>b[0]-a[0]))s=s.slice(0,a)+t+s.slice(b);fs.writeFileSync(f,s);
}}}visit(root);
const settings=path.join(root,'lib/integrations/settings.ts'); let s=fs.readFileSync(settings,'utf8');
s=s.replace('process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || BUSINESS.address',"'XP8W+263, Unnamed, Road, Cái Răng, Cần Thơ, Việt Nam'");
s=s.replace('process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || BUSINESS.googleMapsUrl',"'https://maps.app.goo.gl/bxgjSHcq7YArXPxH6'");
s=s.replace('process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL || BUSINESS.googleMapsEmbedUrl',"'https://maps.google.com/maps?ll=9.9650142,105.7455554&z=18&hl=vi&output=embed'");fs.writeFileSync(settings,s);
console.log('Eager image loading enabled in isolated preview only.');
