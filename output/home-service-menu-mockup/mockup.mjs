import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';
const out = new URL('./', import.meta.url).pathname;
const { home, services } = JSON.parse(await readFile(`${out}snapshot.json`, 'utf8'));
const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const stripScripts = str => str.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
await page.setContent(`<!doctype html><html lang="vi"><head><base href="http://localhost:3000/">${stripScripts(home.head)}${services.styles}</head><body class="${home.bodyClass}">${stripScripts(home.body)}</body></html>`,{waitUntil:'networkidle'});
await page.evaluate(({header})=>{
  document.querySelectorAll('script,nextjs-portal').forEach(el=>el.remove());
  document.querySelector('header.mn-header').outerHTML=header;
  const head=document.querySelector('header.mn-header');
  head.querySelectorAll('[aria-current]').forEach(el=>el.removeAttribute('aria-current'));
  head.querySelector('.mn-desktop-nav a[href="/"]').setAttribute('aria-current','page');
  document.querySelectorAll('[style]').forEach(el=>{
    el.style.removeProperty('opacity');
    el.style.removeProperty('transform');
    el.style.removeProperty('translate');
    el.style.removeProperty('visibility');
  });
  const eyebrow=document.querySelector('[class*="eyebrow"]');
  eyebrow.textContent='ĐIỆN LẠNH MINH NHẬT · CẦN THƠ';
  document.querySelector('[class*="heroCopy"] h1').innerHTML='Điện lạnh Cần Thơ.<br><span>Chăm sóc ngôi nhà bạn.</span>';
  document.querySelector('[class*="subtitle"]').textContent='Sửa chữa · Vệ sinh · Lắp đặt tại nhà';
  document.querySelectorAll('.mn-floating').forEach(el=>el.remove());
  const hero=document.querySelector('section[class*="hero"]');
  hero.classList.add('preview-hero');
  hero.closest('[class*="frame"]').classList.add('preview-frame');
  document.querySelector('[class*="chooser"]').classList.add('preview-chooser');
},services);
await page.addStyleTag({content:`
html { background:#fff!important; }
body { margin:0; }
html .mn-site[data-home] { background:#fff!important; }
html .mn-site[data-home] > header.mn-header { width:calc(100% - 32px); max-width:1200px; padding-top:16px; }
html .mn-site[data-home] > header.mn-header .mn-nav-shell { background:#fff!important; }
html .mn-site[data-home] > header.mn-header .mn-brand, html .mn-site[data-home] > header.mn-header .mn-hotline strong { color:#18364c!important; }
html .mn-site[data-home] > header.mn-header .mn-nav-book { background:#0c5bd3!important; }
.preview-frame { max-width:1200px!important; margin-inline:auto!important; }
.preview-frame > .preview-hero { margin:16px 16px 0; padding:28px 22px 0; border:1px solid #d8edf8; border-radius:24px; background:linear-gradient(120deg,#f2fbff,#e8f8ff); overflow:hidden; }
.preview-hero [class*="eyebrow"] { font-size:11px!important; font-weight:700; letter-spacing:.09em; color:#0977a7!important; margin-bottom:18px!important; }
.preview-hero [class*="eyebrow"]:after { display:none; }
.preview-hero h1 { font-size:32px!important; line-height:1.17!important; letter-spacing:-.045em!important; }
.preview-hero h1 span { color:#007eb8!important; }
.preview-hero [class*="subtitle"] { font-size:16px!important; margin-top:18px!important; }
.preview-hero [class*="promises"] { gap:12px 16px!important; margin:22px 0!important; }
.preview-hero [class*="promises"] li { font-size:12px!important; }
.preview-hero [class*="book"],.preview-hero [class*="call"] { min-height:48px!important; font-size:15px!important; padding:12px 18px!important; border-radius:12px!important; }
.preview-hero [class*="book"] { background:#0c5bd3!important; }
.preview-hero [class*="call"] { border:1px solid #c8dfef; box-shadow:none!important; }
.preview-hero [class*="heroArt"] { margin-top:8px; }
.preview-chooser { margin:20px 16px 0!important; padding:20px!important; border-color:#dceaf3!important; border-radius:20px!important; background:#fff!important; box-shadow:0 8px 28px #123d6710; }
.preview-chooser [class*="chooserIntro"] h2 { font-size:25px!important; }
.preview-chooser [class*="chooserIntro"] p { font-size:14px!important; }
.preview-chooser [class*="equipment"] { background:#f6fbff!important; }
.preview-frame > [class*="services"] { padding:32px 16px 0!important; }
.preview-frame [class*="sectionHeading"] h2 { font-size:30px!important; }
.preview-frame [class*="sectionHeading"] p { letter-spacing:0!important; font-size:15px!important; }
.preview-frame > [class*="process"] { margin:32px 16px!important; }
.preview-frame [class*="card"] h3 { font-size:23px!important; }
.mn-home-coverage-band { margin-top:32px; }
@media(min-width:901px) {
html .mn-site[data-home] > header.mn-header { width:calc(100% - 48px); padding-top:24px; }
.preview-frame > .preview-hero { margin:16px 0 0; padding:28px 0 16px 42px!important; grid-template-columns:49% 51%!important; min-height:490px; }
.preview-hero h1 { font-size:46px!important; }
.preview-hero [class*="subtitle"] { font-size:20px!important; }
.preview-hero [class*="promises"] { margin:30px 0!important; }
.preview-hero [class*="promises"] li { font-size:13px!important; }
.preview-hero [class*="heroArt"] { width:104%!important; margin:0 0 0 -4%; }
.preview-chooser { margin:24px 0 0!important; grid-template-columns:24% 1fr!important; gap:20px!important; padding:24px!important; }
.preview-chooser [class*="deviceBox"] { height:100px!important; }
.preview-chooser [class*="equipment"] > span:last-child { font-size:13px!important; }
.preview-frame > [class*="services"] { padding:36px 0 0!important; }
.preview-frame > [class*="process"] { margin:32px 0!important; }
}
@media(min-width:901px) and (max-width:1250px) { .preview-frame { width:calc(100% - 48px)!important; } .preview-hero h1 { font-size:36px!important; } }
@media(max-width:900px) {
.preview-hero [class*="heroCopy"] { padding:0!important; }
.preview-hero [class*="actions"] { display:grid!important; grid-template-columns:1fr 1fr; gap:8px!important; }
.preview-hero [class*="book"], .preview-hero [class*="call"] { padding:10px!important; font-size:13px!important; gap:6px!important; }
.preview-hero [class*="book"] svg, .preview-hero [class*="call"] svg { width:18px!important; height:18px!important; }
.preview-hero [class*="heroArt"] { max-width:400px!important; }
.preview-frame [class*="serviceGrid"] { gap:16px; }
html .mn-site[data-home] > header.mn-header .mn-hotline { display:none; }
.preview-frame [class*="card"] { min-height:230px; }
}
`});
await page.evaluate(async()=>{await document.fonts.ready; await Promise.all([...document.images].map(im=>{im.loading='eager'; return im.decode().catch(()=>{});}));});
await writeFile(`${out}home-mockup.html`,await page.content());
await page.screenshot({path:`${out}desktop.png`,fullPage:false});
await page.screenshot({path:`${out}desktop-full.png`,fullPage:true});
const checks=[];
for(const width of [375,768,1024,1440]) {
  await page.setViewportSize({width,height:900});
  await page.evaluate(async()=>{await Promise.all([...document.images].map(im=>im.decode().catch(()=>{})));});
  checks.push(await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,imagesMissing:[...document.images].filter(i=>!i.complete||!i.naturalWidth).length})));
  if(width===375) {
    await page.screenshot({path:`${out}mobile.png`});
    await page.screenshot({path:`${out}mobile-full.png`,fullPage:true});
  }
}
await writeFile(`${out}layout-checks.json`,JSON.stringify(checks,null,2));
console.log(checks);
await browser.close();
