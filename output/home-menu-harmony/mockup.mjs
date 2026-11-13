import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const out=new URL('./',import.meta.url).pathname;
await mkdir(out,{recursive:true});
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1,reducedMotion:'reduce'});
await page.goto('http://localhost:3000/',{waitUntil:'networkidle'});
const source=await page.content();
await writeFile(`${out}source.html`,source);
const clean=source.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace('<head>','<head><base href="http://localhost:3000/">');
await page.setContent(clean,{waitUntil:'networkidle'});
await page.evaluate(()=>{
 document.querySelectorAll('nextjs-portal,.mn-floating').forEach(e=>e.remove());
 document.querySelectorAll('[style]').forEach(e=>{for(const key of ['opacity','transform','visibility','translate'])e.style.removeProperty(key);});
});
await page.addStyleTag({content:`
html .mn-site[data-home] { background:linear-gradient(180deg,#edf9fe 0px,#e8f7fd 650px,#f8fcff 1050px,#fff 1600px)!important; }
html .mn-site[data-home] > header.mn-header { position:relative; top:0; padding-top:12px; background:transparent!important; }
html .mn-site[data-home] > header.mn-header .mn-nav-shell {
 background:transparent!important; border:0!important; border-bottom:1px solid #cce4f0!important;
 border-radius:0!important; box-shadow:none!important; backdrop-filter:none!important;
 padding:12px 0 20px!important;
}
html .mn-site[data-home] > header .mn-brand { gap:10px; }
html .mn-site[data-home] > header .mn-brand .brand-mark { width:62px!important; height:44px!important; }
html .mn-site[data-home] > header .mn-brand strong { font-size:20px!important; }
html .mn-site[data-home] > header .mn-nav-book { border-radius:12px!important; background:#0763cd!important; box-shadow:0 5px 14px #0964c51c!important; }
html .mn-site[data-home] > header .mn-desktop-nav a { font-size:14px!important; font-weight:500; }
html .mn-site[data-home] > header .mn-hotline > span { background:#fff!important; border-color:#c8e0f4!important; }
html .mn-site[data-home] main > div:first-child { background:transparent!important; }
.approved-home-frame > .approved-home-hero {
 margin:0!important; border:0!important; border-radius:0!important; background:transparent!important;
 padding:24px 0 12px!important; grid-template-columns:48% 52%!important; gap:0!important;
}
.approved-home-hero [class*="heroCopy"] { padding:24px 0!important; }
.approved-home-hero h1 { font-size:46px!important; line-height:1.16!important; letter-spacing:-.045em!important; }
.approved-home-hero h1 span { color:#087dc1!important; }
.approved-home-hero [class*="eyebrow"] { color:#0878ac!important; font-size:11px!important; letter-spacing:.1em!important; margin-bottom:18px!important; }
.approved-home-hero [class*="subtitle"] { font-size:20px!important; margin-top:20px!important; }
.approved-home-hero [class*="promises"] { margin:28px 0!important; gap:20px!important; }
.approved-home-hero [class*="heroArt"] { width:100%!important; max-width:590px!important; margin:0!important; justify-self:end; }
.approved-home-hero [class*="book"] { background:#0763cd!important; }
.approved-home-hero [class*="call"] { background:#ffffffb8!important; border-color:#c6e1f0!important; }
.approved-home-hero [class*="book"],.approved-home-hero [class*="call"] { min-height:52px!important; border-radius:12px!important; padding:12px 20px!important; font-size:15px!important; }
.approved-home-chooser { margin-top:10px!important; padding:24px!important; border-radius:20px!important; border:1px solid #d8eaf3!important; background:#fff!important; box-shadow:0 14px 36px #16617e0b!important; }
.approved-home-chooser [class*="equipment"] { background:#f6fbfe!important; border-color:#e2eef6; }
.approved-home-chooser [aria-pressed="true"] { background:#eaf5ff!important; border-color:#91c9ed!important; }
.approved-home-frame > div[id^="services-"] > section { padding-top:36px!important; }
.approved-home-frame > [class*="process"] { background:#fff!important; box-shadow:none!important; }
@media(max-width:900px) {
 html .mn-site[data-home] > header.mn-header { padding-top:8px; }
 html .mn-site[data-home] > header.mn-header .mn-nav-shell { padding:4px 0 12px!important; }
 html .mn-site[data-home] > header .mn-brand .brand-mark { width:42px!important; height:32px!important; }
 html .mn-site[data-home] > header .mn-brand strong { font-size:12px!important; }
 html .mn-site[data-home] > header .mn-nav-book { font-size:11px!important; padding-inline:10px!important; }
 html .mn-site[data-home] > header .mn-menu-button { background:#ffffffb8!important; border-color:#c6e1f0!important; border-radius:10px; }
 .approved-home-frame > .approved-home-hero { padding:8px 0 4px!important; grid-template-columns:1fr!important; }
 .approved-home-hero [class*="heroCopy"] { padding:20px 2px 0!important; }
 .approved-home-hero h1 { font-size:30px!important; }
 .approved-home-hero [class*="eyebrow"] { font-size:10px!important; margin-bottom:14px!important; }
 .approved-home-hero [class*="subtitle"] { font-size:15px!important; margin-top:14px!important; }
 .approved-home-hero [class*="promises"] { margin:20px 0!important; gap:10px 14px!important; }
 .approved-home-hero [class*="promises"] li { font-size:12px!important; }
 .approved-home-hero [class*="book"],.approved-home-hero [class*="call"] { padding:10px 8px!important; min-height:48px!important; font-size:13px!important; }
 .approved-home-hero [class*="heroArt"] { width:85%!important; max-width:310px!important; justify-self:center; margin:14px 0 0!important; }
 .approved-home-chooser { margin-top:12px!important; padding:16px!important; border-radius:16px!important; }
 .approved-home-chooser [class*="chooserIntro"] { margin-bottom:14px; }
 .approved-home-chooser [class*="chooserIntro"] h2 { font-size:22px!important; }
 .approved-home-frame > div[id^="services-"] > section { padding-top:28px!important; }
}
@media(min-width:601px) and (max-width:900px) {
 .approved-home-frame > .approved-home-hero { grid-template-columns:1fr 1fr!important; align-items:center; }
 .approved-home-hero h1 { font-size:32px!important; }
 .approved-home-hero [class*="heroArt"] { width:100%!important; }
}
html body .mn-site[data-home] { background:linear-gradient(180deg,#edf9fe 0px,#e8f7fd 650px,#f8fcff 1050px,#fff 1600px)!important; }
html body .mn-site[data-home] > header.mn-header,
html body .mn-site[data-home] > header.mn-header .mn-nav-shell,
html body .mn-site[data-home] #mn-main-content,
html body .mn-site[data-home] main.mn-home,
html body .mn-site[data-home] main.mn-home > div:first-child { background:transparent!important; }
`});
await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});
await writeFile(`${out}mockup.html`,await page.content());
const checks=[];
for(const [width,height,name] of [[1440,1000,'desktop'],[375,1000,'mobile'],[768,1000,'tablet']]) {
 await page.setViewportSize({width,height});
 await page.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
 await page.screenshot({path:`${out}${name}.png`});
 if(name==='desktop'||name==='mobile')await page.screenshot({path:`${out}${name}-full.png`,fullPage:true});
 checks.push(await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth})));
}
console.log(checks);
await browser.close();
