# Home service finder — desktop QA, 2026-10-31

final result: passed

## Scope and source

- Source visual: `/Users/macbookprom1/develop/DIEN_LANH_MINH_NHAT/output/home-service-finder/reference.png` (899 × 1748 pixels).
- Implementation: http://localhost:3000/.
- Browser-rendered final screenshot: `/Users/macbookprom1/develop/DIEN_LANH_MINH_NHAT/output/home-service-finder/desktop-family-visible.png` (1425 × 1024 captured content pixels; requested desktop viewport 1440 × 1080, capture excludes browser/scrollbar chrome).
- State: home, top of page, all eleven services visible, entrance finished, existing live cooling effect enabled.
- Full composition: `output/home-service-finder/hero-comparison.png` (initial) and `hero-content-final-comparison.png` (final).
- Normalization: source hero cropped at 0,63 with size 899 × 621; final hero cropped at 113,94 with size 1200 × 792. Each resized to 720px width without changing aspect ratio. Existing site gutters/header are retained; the mock's full-bleed outer frame is not treated as a mismatch.
- Focused service-label comparison: `output/home-service-finder/services-comparison.png`. All eleven labels, final full-width water-heater tile, icon circles and arrows were reviewed at readable scale.

## User-directed deviations

- Existing introduction, five-step animated illustrated process, service coverage/map, projects and footer retained rather than replaced by mockup versions.
- The mockup's “Hiểu rõ dịch vụ trước khi đặt” section is omitted.
- Mobile at and below 900px retains its original hero, photo, eight-item gallery and section layout. Only desktop uses the new eleven-service finder.
- Blue panel extension was reduced from 64px to 20px at user's request.
- The desktop photo was recomposed twice because the initial image still placed part of the family/sofa behind the service panel. In the final v2 asset, the complete seating group and table sit farther right in the room. This changes photographic framing from the mock deliberately to satisfy the user's visibility correction.
- Narrow laptops 901–1199px place the menu and photo in separate rows; their DOM bounds do not overlap. This prevents the full service menu from concealing the family on narrower desktop windows. Mobile remains untouched.

## Findings and correction history

1. [P2, resolved] Initial hero cropped the technician/AC and hid the family behind the blue panel. Reduced excess vertical space, kept the scene and WebGL canvas on one right-aligned image projection, and generated a scene with the family in the visible zone.
2. [P2, resolved] User correctly identified residual family/sofa occlusion in v1. Replaced only the desktop photo with v2, relocated the whole sofa/family/table to the right background, and softened the foreground family protection mask. Final browser screenshot and `family-correction-comparison.png` show the blue panel no longer intersects the seating group.
3. [P2, resolved] New hero initially applied to mobile. Restored the complete original mobile hero implementation verbatim under a renamed export and retained the original gallery at the existing mobile breakpoint. Runtime check at 390px found the legacy hero and original image, no desktop finder, eight original service cards.
4. [P2, resolved] Narrow laptop crop could hide background subjects. The 1024px final layout has an 867px-wide photo on its own row below the panel; measured panel bottom equals photo top (733.84px), so no occlusion occurs.

No remaining actionable P0/P1/P2 findings in the requested desktop scope.

## Required fidelity surfaces

- Fonts/typography: existing Be Vietnam Pro retained. Navy bold two-line heading with blue second line, readable service names, no ellipsis or clipped labels. Small helper copy remains subordinate.
- Spacing/layout: two-column service catalogue on wide desktop; last service spans both tracks. Header alignment and existing content frame retained. Blue overflow reduced. Comparison crops normalized by content width.
- Colors/tokens: pale ice-blue gradient panel, white service tiles, existing blue actions and navy copy. Original cooling effect remains a live canvas, not baked into the photo.
- Image quality: built-in ImageGen edit saved as a 1660 × 947 WebP (`hero-family-service-finder-v2.webp`). New photo retains technician/AC and visibly separates the complete seating group from the panel. Existing mask system extended for the new family position; original WebGL shader/component unchanged.
- Copy/content: all eleven catalogue titles and routes derive from existing site content. No new claims, prices, reviews or guarantees. All five original process labels remain, and coverage choices/map are preserved.

## Verification

- Production build passed (106 static pages) after desktop/mobile split. Final photo/framing iterations subsequently passed targeted ESLint and TypeScript validation; CSS formatting passed.
- Browser service-link test: drinking-water-dispenser item navigated to `/services/sua-lap-may-nuoc-uong-nong-lanh` with matching heading.
- Browser CTA test: hero booking button navigated to `/booking`, showing the existing booking page.
- Wide desktop: eleven links, one cooling canvas, no horizontal overflow or clipped link containers.
- 1024px final: eleven links, no horizontal overflow, panel/photo regions do not overlap.
- 390px preservation check: original hero, original image, original gallery; mobile hero file equals the pre-task implementation except export name.
- Fresh final browser console: no errors or warnings.
- SHA-256 checks confirm original `hero-airflow.tsx`, `home-process-journey.tsx`, `process-timeline.tsx`, `verified-service-area.tsx` and `can-tho-map.json` unchanged from task start.
- Introduction content unchanged; page delta against the pre-task backup only replaces the hero import and switches the duplicate gallery to mobile-only.

## Follow-up polish

- P3: generated family scene differs from the original mock's camera distance; the complete seating group is intentionally smaller to stay visible.
- No backend booking submission was made; existing booking behavior was not modified.

## First-screen fit follow-up — 2026-10-31

final result: passed

User target: the entire desktop hero, all eleven service links, booking/phone controls and three promises must fit in the first viewport. Keep the reverted 1200px width and leave mobile unchanged.

- Source: `output/home-first-screen/user-reference.png` and previous accepted `output/home-service-finder/desktop-family-visible.png`.
- Final browser screenshot: `output/home-first-screen/home-1440x800.png` (1425 × 792 captured pixels; CSS viewport 1440 × 800).
- Additional screenshot: `output/home-first-screen/home-1440x700.png`.
- Visual comparison: `output/home-first-screen/first-screen-comparison.png`. The earlier fixed-height screenshot was cropped to the same top 792 captured pixels as the new 800px-viewport screenshot and both were normalized to 720px width. This compares first-view visibility; the prior capture itself used a taller viewport, so it is not a pixel-exact re-render of the old page at 800px.

[P2, resolved] The fixed 768px minimum plus content padding made the hero about 792px tall before adding the 94px header/gap. Replaced this with a desktop-only available-viewport height, capped at 768px on taller windows. The panel now uses a flex column, six flexible service rows and bounded container-height typography/spacing. The water-dispenser row has slightly more space for its helper label. No service names are hidden. Only the optional introductory sentence is omitted below 661px desktop height; services and actions stay visible. A 480px minimum preserves readable controls in unusually tiny windows.

Measured browser checks (`output/home-first-screen/checks.json`):

| CSS viewport | Hero bottom | Booking bottom | Promises bottom | Service links | Clipped links |
| --- | --- | --- | --- | --- | --- |
| 1366 × 768 | 752px | 704.61px | 734.60px | 11 | 0 |
| 1440 × 600 | 584px | 541.30px | 570.80px | 11 | 0 |
| 1440 × 1080 | 862px | 810.10px | 841.85px | 11 | 0 |
| 1440 × 800 | 784px | 735.30px | 765.80px | 11 | 0 |

All measured cases have no horizontal overflow and leave at least 16px below the hero in the first view. The existing 1200px maximum width remains; the reverted wide-screen stylesheet was not restored.

Fidelity review: existing font family/weights and blue/white/navy tokens retained; all labels readable without ellipses; tighter vertical rhythm is intentional; photo remains proportional with live airflow/particles and family/sofa outside the panel; all eleven titles, five-step process, introduction and coverage remain. The CSS changes apply only above 1199px; the existing narrow laptop composition and original mobile hero/gallery remain untouched. Original particle/process/coverage source hashes still pass.

Validation: CSS Prettier check passed; browser geometry and screenshot review passed. Console history contains two development CSS hot-reload `removeChild` errors from stylesheet replacement, not new application-path failures; full page reloads rendered successfully at all four tested viewports. No JavaScript logic, backend or navigation changes in this follow-up. Temporary browser viewport override reset.

## Family/sofa left adjustment — latest review

final result: passed

User requested a slight left shift of the family and sofa into the remaining empty space, away from the AC/technician. Existing constraints remain: original particle effect, protected content and mobile composition stay intact.

- Before: `output/home-first-screen/home-1440x800.png`.
- After: `output/home-family-left/home-1440x800.png`.
- Same desktop CSS viewport: 1440 × 800, top-of-home state. Both captures normalized proportionally to 720px wide in `output/home-family-left/comparison.png`; no aspect-ratio stretching.
- Final asset: `apps/web/public/images/redesign/hero-family-service-finder-v3.webp`, created by built-in ImageGen edit and encoded as a 1660 × 947 WebP. The first draft shifted too far and was not applied. Final prompt and artifact details are in `output/home-family-left/README.md`.

Visual review: family/sofa/table are farther left, all family members and complete sofa remain visible, the technician and AC retain their places, image quality is sharp and proportions natural. The wide desktop blue background is slightly narrower to avoid covering the moved sofa. Font family, text sizes, service-grid spacing, palette and all eleven labels are unchanged from the accepted first-screen layout. Only photo selection, mask and its surrounding background edge changed.

Both picture layers choose the same v3 image above 1365px. Below that width they select the prior v2 image/mask to avoid losing the seating group on narrower frames. At 1440 × 800, images loaded, eleven services present, one live particle canvas, no horizontal overflow, hero bottom 784px. At 1440 × 1080, hero bottom 862px. At 1280 × 800, v2 correctly selected and hero bottom remains 784px. After hydration at 390px, the legacy mobile hero is present, the desktop finder is absent and the original mobile photo is selected. Raw geometry/picture-selection evidence is in `output/home-family-left/checks.json` and `mobile-check.json`.

ESLint and TypeScript passed. Original airflow, process components, coverage component and map data still match pre-task hashes. No actionable P0/P1/P2 issues found. P3: the generated room edit is a perceptual repositioning rather than a literal pixel translation. Browser viewport override reset after verification.

## Silver-blue service selector — 2026-11-01

final result: passed

Scope: implement the user's selected desktop mockup in the existing home page. User explicitly deferred phone redesign; `home-mobile-hero.tsx`, `hero.module.css`, mobile styles and mobile mounting boundary are unchanged in this implementation. The homepage header/container additions are scoped to widths >=1200px. No deployment.

Source visual truth: `/var/folders/nv/2ztsn7wj3fg53nxgybl4cpvh0000gn/T/codex-clipboard-fd4f27e5-dcba-4f93-815d-2b1b55064f8d.png` (1565x1005 pixels).
Implementation: `output/home-service-selector/desktop-final.jpg`, browser-rendered in IAB at CSS viewport1565x1005, actual capture1550x995 pixels due host capture scaling. Both images were proportionally normalized to782px wide, without aspect distortion, in `output/home-service-selector/comparison-final.png`. The same top-of-home state and default Máy lạnh selection were compared. Airflow frozen at t=3 for repeatable evidence.
Focused evidence: `output/home-service-selector/detail-comparison-final.png`, source on left and implementation on right. This checks title weights, text wrapping, icons, category/service spacing, gradient and CTA. Additional browser captures: `laptop-1366.jpg`, `viewport-1440.jpg`, `viewport-1024.jpg`, `viewport-1920.jpg`. Phone/tablet observations were regression checks only, not redesign work.

### Comparison history and fixes

- Initial P1: previous narrow desktop frame and enlarged source projection placed gradient over the father. Restored aligned homepage/header gutters and a wider container at >=1200px, preserving the original photo/people-mask/airflow projection. The final comparison shows all people clear of the panel.
- Initial P2: title/service typography smaller than selected mock. Increased title to approximately50.5px and service labels17.8px at the reference viewport; moved introductory content down to match the source rhythm. Final full/detail comparisons show the intended two-column hierarchy and readable labels.
- Initial P2: category list overlapped booking on short laptops and by9px on wide1920px layout. Added compact desktop rules for short windows and reduced vertical category padding. Rechecked1366x768: category bottom635px, booking top649px;1920px: category bottom778.34px, booking top799.49px. No overlap.
- Colors: sampled initial source/background points and adjusted gradient to #e2edfd / #c5e0fb / #b0ddfb, with deep-blue-to-sky-blue selected tab/CTA. Final comparison is silver-blue, with no lavender cast.

### Required fidelity surfaces

- Fonts/typography: existing Be Vietnam Pro retained with Vietnamese subsets; navy heavy two-line headline, blue second line, clear section heading and lighter service labels. No clipped labels or ellipses.
- Spacing/layout: aligned white gutters,16px rounded hero/header, vertical equipment rail, service detail area, full-width booking and outlined phone row. Six groups retain stable positioning when selection changes. Smaller desktop windows may scroll vertically instead of hiding controls.
- Colors/tokens: silver-blue gradient, navy body, cobalt icons and blue-to-cyan actions match source direction; subtle browser rasterization differences remain acceptable P3.
- Images/assets: reuse the actual local room photograph, logo, Lucide icons and source-aligned people mask. Existing live airflow and particles preserved. No raster screenshot substituted for interactive UI. Photo framing/illustrative details differ slightly from generative mockup; keeping the approved original photo is intentional.
- Copy/content: mockup headings, service labels, phone and trust points preserved; links use existing catalogue data/routes. Di dời uses the short mockup label but retains the full existing service route. All11 service routes remain accessible across6 categories.

### Functional verification

IAB exercised all6 equipment tabs, confirming service counts5/2/1/1/1/1; Home keyboard key returns to Máy lạnh. Native tab roles, selected state, roving tab index and vertical arrow/Home/End navigation implemented. Sửa chữa máy lạnh navigation verified at `/services/sua-may-lanh`; booking navigation verified at `/booking`; no form submitted. Phone points to existing tel link. Evidence: `output/home-service-selector/interactions.json`.

No horizontal overflow at390,768,1024,1366,1440,1565,1920px. Exactly one airflow canvas is mounted. Final1565px hero frame x62.60/y128/w1424.80/h848; categories end778.34, booking starts799.49, benefits remain inside hero. Clean fresh browser tab reports no console errors. Development hot stylesheet replacement previously produced Next CSS-HMR removeChild errors; these did not recur in the fresh tab. Targeted ESLint and TypeScript noEmit pass.

### Follow-up polish

P3 only: existing font rendering and several line icons differ slightly from generated raster mockup. Existing floating chat/Zalo controls are preserved. Mobile redesign is explicitly deferred.

Implementation checklist complete: desktop layout, exact selected palette direction, functional categories/routes, local verification, reference comparison. final result: passed

## First-screen correction — supersedes previous desktop minimum-height acceptance

final result: passed

User reported the hero still exceeded the actual1440x~710 CSS viewport and requested the whole initial hero visible without scrolling. The earlier acceptance of vertical scrolling on short desktop windows was incorrect for this requirement.

P1 fixed: removed38/42rem minimum heights and the optional-copy hiding rule. Hero height now follows available dynamic viewport height after responsive header/inset/gaps. Typography, padding, category rows, icons, service rows, booking/phone rows and promises scale from the hero's own height. Header logo/CTA scale with viewport height so the actual header does not invalidate that budget. Phone styles and mobile hero remain untouched.

P2 fidelity corrections: restored the reference's taller top/bottom padding on tall viewports through continuous height-dependent spacing; retained compact spacing on laptop windows. Reduced right detail-column width, extended booking/phone bars to the reference proportion, and sized booking icon/text closer to the mock. Existing photograph and live airflow/people masks stay intact.

Source and normalization remain as above. Final source/implementation comparison: `output/home-service-selector/first-view-comparison.png`; focused typography/selector/CTA comparison: `output/home-service-selector/first-view-details.png`. Both were opened together after the final edits. Reference viewport1565x1005; implementation snapshot `fit-1565x1005.jpg`. User-sized proof: `fit-1440x710.jpg`.

Final browser geometry (all at scrollY0):

| CSS viewport | Hero bottom | Promises bottom | Booking top | Categories bottom |
| --- | --- | --- | --- | --- |
|1440x710|695.78|673.03|564.45|553.71|
|1440x600|592.26|576.57|472.20|463.29|
|1565x1005|976.00|935.78|791.59|776.36|

1366x768,1440x800 and1920x1080 also passed available-height, content-containment and non-overlap checks. First-view check evidence: `output/home-service-selector/first-view-checks.json`. No horizontal overflow. All six equipment options and selected five service links remain visible; booking, hotline and all promises are inside the frame and initial viewport, with no hidden content or internal scroll area.

Required surfaces rechecked: Be Vietnam Pro hierarchy/wrapping; matched two-column rhythm and outer gutters; same silver-blue palette and blue CTA; intact local photo/masks and icon library; all mockup copy retained including the previously hidden description. Residual P3: rasterized mock and browser font/icon rendering differ slightly; approved room source is preserved rather than regenerated. Targeted ESLint and TypeScript checks passed. No deployment performed. final result: passed

## Desktop action-width alignment correction

final result: passed

User requested the red-marked booking/phone/promises area be narrower, with its right edge aligned to the service arrows. Changed desktop-only CSS to share `--finder-detail-inset` between service-panel padding and actions/promises right margins, replacing the former negative20px expansion. All three rows retain their original left edge, height, colors and behavior; no mobile edits.

Browser evidence: `output/home-service-selector/aligned-actions.jpg`,1440x710 CSS viewport, default Máy lạnh selection at t=3. DOM measurements: service arrow right602.65625px; booking right602.65625px; phone right602.65625px; promises right602.65625px. Hero bottom695.78125px within710px viewport. Screenshot reviewed against the user's red-box annotation; all labels remain readable and the whole first frame stays visible. Typography/colors/images/copy unchanged; only the requested width alignment changed. final result: passed

## Phone first-screen service visibility

final result: passed

The user clarified that services must be visible immediately on phones. Added six compact, real service destination links beneath the mobile room image (air conditioner, washer, refrigerator, utilities, drinking-water cooler, bath water heater), with a visible heading and all-services link. Kept the existing detailed service cards below for browsing. Shortened the phone image stage using a bounded viewport-height size; preserved photo/airflow/people-mask alignment and hero booking CTA. Scoped the home phone assistant launcher to a48px control near the bottom so it no longer covers the sixth service button. Desktop styles and composition unchanged.

Evidence: `output/mobile-first-services/final-mobile.jpg`,390x700 CSS viewport, and `checks.json`. Phone viewport checks320x568,375x600,390x700,430x780 all show all6 links completely within the initial viewport, no horizontal overflow, and unobstructed center hit targets. Service nav bottom526.55,532,549,562.59px respectively. Links have52px minimum height with readable13px labels and real line icons. Máy lạnh link navigation verified at `/services/sua-may-lanh`. TypeScript noEmit and targeted ESLint pass.

Desktop regression at1440x710: desktop finder mounted, mobile shortcut DOM absent, hero bottom695.78125px; booking/arrow right both602.65625px, identical to the accepted desktop geometry. No deployment. Previous phone-design deferral is superseded only by this expressly requested first-screen service change.
