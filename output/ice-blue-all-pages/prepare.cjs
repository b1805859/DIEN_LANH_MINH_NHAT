const fs = require('node:fs');
const path = require('node:path');
const postcss = require('postcss');
const ts = require('typescript');
const base = __dirname;
const preview = path.join(base, 'preview');
const repo = path.resolve(base, '../..');
const rgb = (hex) => {
  let s = hex.slice(1); if (s.length === 3 || s.length === 4) s = s.split('').map(c => c+c).join('');
  return [parseInt(s.slice(0,2),16),parseInt(s.slice(2,4),16),parseInt(s.slice(4,6),16)];
};
function recolor(hex, prop) {
  const [r,g,b] = rgb(hex); const bright = (r*.2126+g*.7152+b*.0722)/255;
  const colorful = Math.max(r,g,b)-Math.min(r,g,b)>65;
  const alpha = hex.length===9 ? hex.slice(7) : hex.length===5 ? hex.slice(4).repeat(2) : '';
  if (prop.includes('shadow')) return '#102a430c';
  if (prop.includes('border') || prop.includes('outline')) return '#d9e4ec' + alpha;
  if (prop.includes('background')) return (colorful && bright>.3 ? '#eaf4fa' : bright<.5 ? '#ffffff' : '#f5f9fc') + alpha;
  if (prop==='color' || prop==='fill' || prop==='stroke' || /--mn-(?:text|muted|cyan|ice|home-muted)/.test(prop)) {
    if (colorful && g>r+25 && b>r+25 && bright>.3) return '#007e96';
    return bright>.62 ? '#42556b' : '#102a43';
  }
  if (/--mn-(?:bg|surface|elevated|border|section-bg)/.test(prop)) return '#f5f9fc';
  return hex;
}
function walk(dir) {
  for (const item of fs.readdirSync(dir,{withFileTypes:true})) {
    if (item.isSymbolicLink()) continue;
    const file=path.join(dir,item.name);
    if (item.isDirectory()) { if(!item.name.startsWith('.next'))walk(file); }
    else if (item.name.endsWith('.css')) {
      const root=postcss.parse(fs.readFileSync(file,'utf8'));
      root.walkDecls(d=> {
        if (d.prop.includes('mask')) return;
        d.value=d.value.replace(/#[0-9a-f]{3,8}\b/gi,h=>recolor(h,d.prop));
        if (d.prop==='color' && /^(white|ivory|whitesmoke)$/i.test(d.value))d.value='#102a43';
      });
      fs.writeFileSync(file,root.toString());
    }
  }
}
walk(preview);
const conf=JSON.parse(fs.readFileSync(path.join(preview,'tsconfig.json'),'utf8'));
conf.compilerOptions.paths['@minhnhat/shared']=[path.join(repo,'packages/shared/src')];
fs.writeFileSync(path.join(preview,'tsconfig.json'),JSON.stringify(conf,null,2));
// Still-image preview: use the source's static rendering path consistently.
fs.writeFileSync(path.join(preview,'components/ui/use-motion-budget.ts'),`'use client';\nexport type MotionBudget = 'full' | 'limited' | 'reduced';\nexport function useMotionBudget(): MotionBudget { return 'reduced'; }\n`);
let layout=fs.readFileSync(path.join(preview,'app/layout.tsx'),'utf8');
layout=layout.replace("import './mobile.css';","import './mobile.css';\nimport './palette-preview.css';");
// The isolated preview never loads production analytics.
layout=layout.replace('integrationSettings.googleAnalyticsId ? (','false ? (');
fs.writeFileSync(path.join(preview,'app/layout.tsx'),layout);
// Block booking transmission in the review copy while preserving fields.
const formFile=path.join(preview,'components/forms/booking-form.tsx');
let form=fs.readFileSync(formFile,'utf8');
form=form.replace(/<form\b/, '<form data-mockup="true" onSubmitCapture={(event) => { event.preventDefault(); event.stopPropagation(); }}');
fs.writeFileSync(formFile,form);
const compiled=ts.transpileModule(fs.readFileSync(path.join(repo,'packages/shared/src/index.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const mod={exports:{}}; new Function('exports','module',compiled)(mod.exports,mod);
const {SERVICES,PRIORITY_DISTRICTS,BLOG_CATEGORIES,BLOG_POSTS}=mod.exports;
let id=0; const pages=[];
function add(route,title,group,type){ pages.push({id:++id,route,title,group,type,file:String(id).padStart(3,'0')+'-'+(route==='/'?'home':route.slice(1).replaceAll('/','--'))+'.png'}); }
add('/','Trang chủ','Trang chính','home'); add('/about','Giới thiệu','Trang chính','about');
add('/services','Dịch vụ','Trang chính','services'); add('/projects','Dự án minh họa','Trang chính','projects');
add('/blog','Bài viết','Trang chính','blog'); add('/booking','Đặt lịch','Trang chính','booking');
add('/contact','Liên hệ','Trang chính','contact'); add('/faq','Câu hỏi thường gặp','Trang chính','faq');
add('/privacy-policy','Chính sách bảo mật','Trang chính','privacy'); add('/terms-of-service','Điều khoản dịch vụ','Trang chính','terms');
for(const s of SERVICES)add('/services/'+s.slug,s.name,'Chi tiết dịch vụ','service-detail');
for(const p of ['lap-dat-may-lanh-ninh-kieu','sua-tu-lanh-binh-thuy','ve-sinh-may-giat-cai-rang','dien-nuoc-nha-pho'])add('/projects/'+p,p.replaceAll('-',' '),'Chi tiết dự án','project-detail');
for(const c of BLOG_CATEGORIES)add('/blog/category/'+c.slug,'Bài viết '+c.name,'Chuyên mục bài viết','blog-category');
for(const p of BLOG_POSTS)add('/blog/'+p.slug,p.title,'Chi tiết bài viết','blog-detail');
for(const d of PRIORITY_DISTRICTS)add('/areas/'+d.slug,'Điện lạnh tại '+d.shortName,'Khu vực phục vụ','area');
for(const d of PRIORITY_DISTRICTS)for(const s of SERVICES)add('/areas/'+d.slug+'/'+s.slug,s.name+' tại '+d.shortName,'Dịch vụ theo khu vực','area-service');
fs.writeFileSync(path.join(base,'pages.json'),JSON.stringify(pages,null,2));
fs.copyFileSync('/var/folders/nv/2ztsn7wj3fg53nxgybl4cpvh0000gn/T/codex-clipboard-ca32b346-48a4-480a-82f0-4b4008c3dee5.png',path.join(base,'selected-reference.png'));
console.log(JSON.stringify({pages:pages.length,templates:new Set(pages.map(p=>p.type)).size,groups:Object.fromEntries([...new Set(pages.map(p=>p.group))].map(g=>[g,pages.filter(p=>p.group===g).length]))}));
