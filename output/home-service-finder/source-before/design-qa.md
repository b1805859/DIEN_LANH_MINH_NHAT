# Mobile booking journey — design QA

final result: passed

## Source and implementation
- Selected source: `/var/folders/nv/2ztsn7wj3fg53nxgybl4cpvh0000gn/T/codex-clipboard-e7466e2a-e956-4ef5-bb96-383631c3bb9a.png`.
- User-approved adaptation: all five steps must fit one mobile viewport, accounting for the existing sticky navigation and contact toolbar.
- Source pixels: 853×1844. Normalized to 390×844 for comparison (negligible aspect ratio rounding). Browser captures: CSS and pixels 390×844, deviceScaleFactor 1.
- Full-view comparison: `output/process-mobile-implementation/comparison-final.png` (source, Home, Services).
- Home capture: `output/process-mobile-implementation/390x844.png`.
- Services capture: `output/process-mobile-implementation/services-390-final.png`.
- Additional viewports: 320×568, 360×740, 375×667, 393×852, 430×932; desktop 1440×1000.
- State: scrolled with the section top at approximately 66px, below the 60px navigation; contact toolbar occupies the last 76px. Normal and reduced motion checked.

## Findings and comparison history
1. Before implementation, mobile cards occupied about 2313px in total, hiding most of the journey. Replaced the mobile card stack with five equal timeline rows, left numbered circles/rail, center copy and right illustrations. Existing source illustration assets reused.
2. First Services capture exposed an inherited dark section background behind navy text (P1). Set the mobile section background token, including its full-width pseudo-element, to the same ice-blue surface as Home. Compared the corrected Services capture together with the source and Home; contrast is restored.
3. Desktop screenshot `output/process-mobile-implementation/section-1440.png` confirms the original five-column illustrated layout remains unchanged.

## Required fidelity surfaces
- Typography: existing site family retained; navy bold titles and cyan heading accent match the source hierarchy. Mobile step titles 16px, descriptions 13px; short screens use 15px titles. Full copy preserved with no truncation or overlap in tested sizes.
- Spacing/layout: rail, five numbered circles, separators and bottom booking CTA match the selected composition. Intentional smaller circles and illustrations leave space for persistent navigation/toolbar. At 390×844 the section is 696px high; CTA ends at approximately 750px, before the toolbar at 768px. At 320×568 the section is 420px high and CTA ends at approximately 478px, before the toolbar at 492px.
- Colors: ice-blue #f3faff, navy #071e42, cyan #00aeef and muted blue #385776. The existing site's booking button styling is retained. Services and Home both use a readable ice-blue mobile timeline.
- Images: all five existing raster illustrations depict the same subjects/art direction as the mockup, rendered without stretching or clipping. Illustrations are intentionally hidden at viewport heights ≤600px to preserve readable copy and the full five-step view; medium-height phones retain smaller illustrations.
- Copy: all five titles and descriptions match the selected mockup; CTA reads “Đặt lịch dịch vụ”.
- Focused review: the normalized 390px captures show every row's title, description, numbered marker, illustration and CTA clearly, so an additional enlarged crop was unnecessary. Short-screen captures were separately inspected for text/divider collisions.

## Browser and functional verification
- Chromium/Playwright rendered the actual Next.js site at the listed mobile dimensions; the existing in-app Browser was also selected and its page structure inspected.
- No horizontal document overflow or text extending below its row in tested dimensions.
- All five rows remain fully opaque/readable with normal motion and reduced motion.
- Booking CTA clicked and navigated to `/booking`.
- Final Home/Services runs had no runtime or console errors. An intermediate test mutated image loading attributes before hydration, causing test-only mismatch warnings; the test was corrected to wait for hydration without mutating DOM and final clean captures were repeated.
- ESLint on both changed TSX files passed. TypeScript `--noEmit --incremental false` passed. `git diff --check` passed.

## Implementation checklist
- [x] Compact five-row timeline on phone viewports ≤700px.
- [x] Viewport height reserves navigation, toolbar and safe-area space.
- [x] Five steps and booking CTA visible together at tested portrait sizes.
- [x] Shared component works on Home and Services.
- [x] Existing desktop journey preserved.
- [x] Before/after visual comparison reviewed; no remaining P0/P1/P2 findings.

## Follow-up polish / limits
- Extremely short landscape viewports and browser text enlargement may require scrolling; a readable five-step layout cannot fit every possible height or accessibility zoom level. Tested fit guarantee applies to the listed portrait phone viewports at default text size.

---

# Admin Aurora — corrected against the supplied mockup

The earlier admin QA pass was rejected by the user and is superseded by this measured comparison. Its report is retained in `output/admin-aurora-exact-review/superseded-admin-qa.md`.

## Source and rendered evidence
- Source: `/var/folders/nv/2ztsn7wj3fg53nxgybl4cpvh0000gn/T/codex-clipboard-5a14de10-a7e5-4889-ae6e-1f6f49838394.png`.
- Reference and desktop CSS viewport: **1585 × 992**, density 1. No size resampling of the reference or screenshot.
- Raw browser capture: `output/admin-aurora-exact-review/dashboard-final-raw.jpg`.
- Display-normalized capture: `output/admin-aurora-exact-review/dashboard-final.png`.
- Full paired comparison: `output/admin-aurora-exact-review/paired-final.png` (source left, rendered app right).
- Native-size focused comparisons: `hero-paired-final.png`, `summary-paired-final.png`, `metrics-paired-final.png` in the same directory (source above, rendered app below).
- Measured DOM bounds: `output/admin-aurora-exact-review/geometry-final.json`.
- Browser screenshots arrive as JPEG without an ICC tag. The native Mac capture's Display P3 values were assigned the system Display P3 profile and converted to sRGB for comparisons and exported PNG previews. Raw captures are retained. This only normalizes screenshot display; it does not change CSS, crop, geometry or content.
- State: authenticated dashboard with local-only API fixtures reproducing the reference's **4 / 9 / 3 / 4**. The production query and authentication flow remain intact. Fixture credentials and endpoints are not part of application code.

## Comparison iterations and fixes
1. **[P1, resolved] Incorrect Aurora imagery.** The previous generic, busy wave asset was visibly different. Restored separate wallpaper, hero and sidebar plates from the supplied screenshot, instead of reusing one generic image for all three. Only decorative artwork is rasterized; text, navigation, buttons and statistics remain native interactive elements.
2. **[P2, resolved] Layout, type and identity drift.** Measured the screenshot regions, rebuilt desktop spacing, increased/corrected label and display sizes, matched the administrator label and MN avatar, corrected badge widths and gradients, and moved resource cards below the reference viewport. Passes 1–3 are retained as screenshots and paired comparisons.
3. **[P2, resolved] Summary CTA wrapped.** Pass 1 rendered the CTA at 74px tall, increasing the header and pushing all four metrics down 11px. Kept its label on one line, corrected padding and width, then placed it at the source's exact coordinates. Re-captured the whole page and the summary region.
4. **[P2, resolved] Typography bounds.** Compared native-size title and metric crops. Main heading text now measures 760.32px wide; adjusted weight, tracking, description wrapping, eyebrow size and summary title size against the source.
5. **[P2, resolved] Responsive and inherited styles.** At 1440px the desktop reference proportions need adaptation to avoid colliding text/actions. Added a narrower desktop layout, condensed badge padding to keep appointment navigation on one line, retained the mobile drawer, and stacked the primary action at 320px. An independently added shared elevation sheet applied shadows to the overview and metrics; admin-specific selectors preserve the reference's flat surfaces. Final computed shadows are `none`.

## Desktop geometry checked against the source
| Region | x | y | width | height |
| --- | ---: | ---: | ---: | ---: |
| Sidebar | 16 | 84 | 337 | 852 |
| Topbar | 374 | 88 | 1178 | 88 |
| Profile | 1295 | 106 | 230 | 58 |
| Hero | 374 | 207 | 1178 | 307 |
| Overview | 374 | 538 | 1178 | 307 |
| Summary CTA | 1255 | 572 | 268 | 52 |
| First metric | 400 | 672 | 264.24 | 152 |
| Resource heading | 376 | 879 | 1174 | 31 |

Fractional grid track widths are normal browser rounding. The other three metric tracks start at x=681.24, 962.48 and 1247.73, all at y=672 and height 152.

## Required fidelity surfaces
- **Typography:** Be Vietnam Pro with Vietnamese glyphs; 45px/900 heading with measured tracking, 19.2px description and reference line breaks, 25px summary heading, 16px metric labels, 46px values and 15px helpers. Compared actual native-size glyphs, weight, line height and text widths against the source.
- **Spacing/layout:** major frame measurements match the table above; sidebar rows, card gaps, corner radii, content padding and CTA bounds checked in paired captures. No resource cards intrude into the source viewport.
- **Colors/surfaces:** matched cyan-to-blue controls, navy text/sidebar, pale blue white panels, border colors and four semantic metric accents. Removed the previous gray wallpaper overlay and unexpected card shadows.
- **Images:** separate source-conditioned decorative plates in `apps/web/public/images/admin/aurora-{canvas,hero,sidebar}-reference.webp`. Existing logo retained; icon family reused. No screenshot-based controls or text overlays that impersonate live UI.
- **Copy:** title, navigation labels, identity, CTA/helper text and status sections follow the mockup. Dynamic production values still come from the API.

## Login and interaction checks
- Real app login: `http://localhost:3000/admin/login`, rendered in the in-app Browser at 1585 × 992 and 390 × 844.
- Login evidence: `login-desktop-final-raw.jpg`, `login-desktop-final.png`, `login-mobile-390.jpg` in the evidence directory. The reference supplies no separate login composition; the login inherits its wallpaper, sidebar artwork, palette, rounded surfaces and controls.
- Empty submission reports email/password validation errors; reveal/hide password updates correctly. No real credentials were used.
- Local fixture sign-in redirects to the dashboard; refresh and logout work. Mobile drawer opens, traps focus, closes with Escape, restores focus, and is inert when closed.
- Desktop 1440 × 1000 and mobile 390 × 844 / 320 × 740 reviewed. Document width equals viewport width in tested sizes. 320px primary CTA recaptured after stacking it.
- Browser console error snapshots were empty. TypeScript no-emit, targeted ESLint and Prettier checks passed; diff whitespace check passed.
- Real API authentication and booking mutations were not integration-tested with user credentials.

## Remaining precision limits
- Source is a flattened mockup. Restored decorative artwork and native browser font antialiasing retain minor pixel-level differences; this pass does **not** assert byte-for-byte or every-pixel identity with the source bitmap. These residuals do not change layout, hierarchy, navigation or interaction.
- Prior unrelated changes, including shared elevation styles and previous mobile QA content, are preserved.

## Implementation checklist
- [x] Correct separate source-conditioned Aurora assets.
- [x] Measured desktop frames, typography, controls and identity corrected.
- [x] Native-size and full-view paired comparisons reviewed after fixes.
- [x] Login follows the corrected style; desktop/mobile and primary interactions checked.

final result: passed


# Mobile density implementation QA — 2026-10-31

Source visual truth: /Users/macbookprom1/.codex/generated_images/01a18ffe-5ef3-7560-a7e0-f7df7db4a2ba/exec-906e5d24-3395-4e53-9650-df8975311b01.png (second displayed mockup), combined with the approved collapsible sections from the third mockup.

Implementation: http://localhost:3000/
Screenshot: output/mobile-density-implementation/qa-390-top.png
Full-view comparison: output/mobile-density-implementation/qa-comparison.png
Focused service-card comparison: output/mobile-density-implementation/qa-cards-comparison.png

Viewport: 390x844 CSS px, deviceScaleFactor 1, mobile touch context. Source raster: 853x1844 pixels, normalized to 390x844 for comparison. State: top of homepage, optional sections collapsed, reduced motion enabled to stabilize capture. Airflow tested separately with no-preference.

Comparison history:
- P2 initial: duplicate old/new service heading from competing responsive selectors. Fixed by scoping the desktop-label visibility to the service heading.
- P2 initial: description/CTA overlaid bright photo and family area; last service row extended below viewport. Fixed by shortening only the mobile description, giving copy its own upper area, keeping CTA over upper room space, reducing thumbnail height and gaps. Post-fix evidence: qa-390-top.png and qa-comparison.png. All six service names fit at 390x844; no clipped labels.
- The inner-page project-card selector initially lost against shared CSS. Increased specificity within the existing inner-page wrapper. Post-fix evidence: after/390-blog-top.png.

Required fidelity surfaces:
- Fonts/typography: existing Be Vietnam Pro retained. Hero 26px; mobile description 14px; service heading 22px; service labels 14px with natural wrapping; buttons at least 44px. No scale-down of the whole page, text ellipsis or line clamps.
- Spacing/layout: compact hero and two-column service grid from 375px, horizontal cards at 320px, three columns at 768px. Services precede optional sections in both visual and hydrated reading/tab order. Original desktop section order restored at >900px.
- Colors/tokens: existing palette and design language retained. No new color palette introduced. Brand logo, buttons and original gradients retained.
- Image quality/assets: original logo, service photos, hero scene, technician mask and WebGL rendering retained. Generated mockup imagery was not substituted for production imagery. Existing cover mapping handles the new mobile scene aspect ratio.
- Copy/content: original service names, links and full content retained; mobile hero uses a concise equivalent description. Full about/process content opens on request. Footer phone/address/legal links remain visible; navigation groups expand.

Accepted intentional differences: the mockup generated a different room composition and shorter service names. The implementation retains original photos, logo and full service names per user constraints, adapts the photo/copy separation to keep the original family unobscured, and uses the approved collapsible sections. These are not pending fidelity fixes.

Primary interactions tested at 320/375/390/430/768: section expansion/collapse and aria state, footer group links, menu, service navigation, article tab, touch dragging/chat open-close, resize back to desktop. No JavaScript page errors in these flows. 15 layout cases had no horizontal overflow. Desktop comparison at 1024/1440 on home/services/blog: 250 measured elements had identical position, dimensions, font, display, margin and padding. HeroAirflow and draggable bubble sources unchanged by SHA-256. TypeScript and scoped ESLint passed.

Remaining limits: Chromium local only; no real Safari/iOS device validation, analytics/conversion validation or full WCAG certification. Coverage below the first screen retains the existing map and interactions. No deployment performed.

Implementation checklist: selected direction implemented; original assets/airflow preserved; optional sections functional; mobile sizes tested; desktop checked; no actionable P0/P1/P2 findings remain.

final result: passed


## Admin mobile implementation — 2026-10-31

Final result: passed.

Implemented the approved dashboard, bookings and services mobile layouts, preserving existing desktop presentation and data handlers. No unresolved P0/P1/P2 findings in the tested scope.

Reference/implementation comparisons: output/admin-mobile-implementation/comparison-{dashboard,bookings,services}.png (source normalized 853x1844 to 390x844; reference left, implementation right). Source paths and intentional differences are recorded in comparison-metadata.json and report.txt.

Validation: 15 mobile viewport/route cases without horizontal overflow; six desktop geometry comparisons identical, gradient raster delta at most 2/255; populated desktop booking screenshot pixel-identical; 10 interaction groups passed with isolated API fixtures; ESLint, TypeScript and diff checks passed. Public Hero airflow and draggable bubble files unchanged by SHA-256. No production mutations or deployment. Physical-device/Safari testing remains outside this local Chromium verification.

Full report: output/admin-mobile-implementation/report.txt


## Bạn thợ AI chat implementation — 2026-10-31

Source visual truth: `output/ai-chat-implementation/reference.png` (1536×1024), the exact user-selected mockup. Scope: replace the old AI launcher entirely and implement its matching responsive chat in the existing website.

Evidence: `output/ai-chat-implementation/{pc,laptop,mobile}-open.png`, `{pc,laptop,mobile}-panel.png`, `{pc,laptop,mobile}-comparison.png`; closed launcher captures `{pc,laptop,mobile}-closed.png`; full implementation overview `implementation-preview.png`.

Viewport/state: PC 1440×1000, laptop 1280×800, mobile 390×844; identical greeting, user “Máy lạnh nhà tôi không lạnh”, AI airflow question and two replies. Source board crops PC 456×612, laptop 374×576, mobile 397×680 are normalized to actual component widths 400/360/370 CSS px without stretching the source. Native IAB screenshots can omit browser scrollbar pixels; per-axis screenshot/CSS ratios from `*-meta.json` normalize rendered crops to CSS size. `compare.mjs` reproduces comparisons. Full-frame captures retain surrounding website context; focused panel comparisons make typography and controls readable.

Comparison history:
- Initial P2: public paragraph styles overrode chat text colors, including the white user text. Fixed with component-scoped explicit colors; verified computed colors white for user and #244675 for assistant.
- Initial P2: roomy desktop/mobile heights changed the mockup's proportions; narrower message bubbles could clip the final response at the target conversation state. Adjusted PC/laptop/mobile heights to 560/555/640 px, header padding, greeting/question line breaks, bubble widths and spacing. Final target conversation fits the PC/mobile log (scrollHeight equals clientHeight at capture); longer conversations scroll independently. Final comparison evidence: `pc-comparison.png`, `laptop-comparison.png`, `mobile-comparison.png`.
- Initial P2: native input focus outline leaked into the rounded composer. Removed only the input outline, keeping the visible focus-within ring on its form and explicit keyboard focus on buttons/links. Post-fix composer visible in final comparisons.
- Initial P2: using a complete mascot for tiny message avatars reduced similarity. Added a dedicated head-only mascot for header/messages; full mechanic mascot retained on the launcher.

Required fidelity surfaces:
- Fonts/typography: existing Be Vietnam Pro, assistant 14–15px, mobile input 16px, bold blue title/replies, readable wrapping; reference greeting and question wording retained.
- Spacing/layout: 400px PC, 360px laptop, 370px mobile sheet within 390px viewport; pale header on desktop, mobile handle, white content, outlined replies side-by-side on desktop and stacked on phone, rounded composer, technician support row. PC is about 23px taller than the normalized source for full conversation readability; this is P3 polish, not a clipped-content issue.
- Colors/tokens: white/ice-blue surfaces, #0056bf heading, #0089f7 user bubble, #eaf6ff assistant bubble, amber status dot, blue send. The disabled empty send button retains the reference color while remaining disabled.
- Image/assets: transparent generated blue mechanic mascot and head-only avatar, inspected before use; no CSS/SVG stand-ins for custom artwork. Supplied Zalo source retained. Generated character proportions and standard library user/headset icons differ slightly from the raster concept (P3).
- Copy/content: title “Trợ lý Minh Nhật”, “Tư vấn bằng AI”, greeting/question, “Mình giúp nhé!”, quick replies, attachment control, composer and technician support are represented. Initial replies offer two real consultation entry points; airflow replies appear after the relevant symptom.

Interactions verified through in-app Chromium: open, typed send, empty-send disabled, quick reply branch, image picker/preview/removal, minimize/reopen preserving conversation, close, Escape, focus return, technician link destination. Old `.ai-chat-action` count is 0; new AI trigger count is 1. Existing Zalo retained. Image attachments stay local; response directs actual image review to the technician/Zalo, without claiming visual analysis. Existing rule-based consultation logic remains the engine.

Responsive checks: 1440/1280/390/320 widths and 390×420 short viewport; no horizontal overflow, composer visible at short height. VisualViewport keyboard positioning is retained; physical iOS/Safari keyboard behavior was not tested. Phone background scroll locks while the sheet is open. Reduced-motion behavior inherited from existing MotionConfig.

Validation: scoped ESLint and TypeScript `--noEmit --incremental false` passed. No browser errors in a fresh tab during the final interaction run. Earlier development hot-reload CSS emitted a Next mini-css-extract HMR removeChild error; a fresh-tab run after changes had no such errors. No production deployment or external messages sent.

Follow-up polish (P3): generated mascot art and library icon geometry are close to, rather than pixel-identical copies of, the flattened concept. Screenshot raster antialiasing and a few layout pixels differ across viewports. Real-device/Safari verification remains outside this local Chromium pass.

Implementation checklist: old launcher removed; new mascot launcher implemented; selected chat styling implemented; responsive states compared; interaction checks, ESLint and TypeScript passed; no unresolved P0/P1/P2 findings in this scope.

final result: passed


## ICE FLOW chat gradient — 2026-10-31

Source: `output/ai-chat-ice-flow/reference.png` (1513×1040), the exact selected attachment. Implementation: local `http://localhost:3000/`, CSS-only update in `floating-actions.module.css` using the existing mascot, content and interaction handlers.

Evidence: `output/ai-chat-ice-flow/{pc,laptop,mobile}-open.png` (surrounding website), `*-panel.png` (focused chat), `pc-comparison.png` and `mobile-comparison.png` (reference left, implementation right), and `implementation-preview.png`. CSS viewports: 1440×1000, 1280×800, 390×844. Screenshot dimensions are normalized using screenshot/CSS ratios recorded in `*-meta.json`; source crops PC 674×868 and mobile 529×877 are resized proportionally to component widths 400px and 370px. Source mock panels are presentation-scale illustrations, not exact viewport captures. Compared matching greeting, user cooling symptom, airflow question and quick replies.

Findings/fixes: initial HMR view retained the old stylesheet; restarted the stopped local dev server and opened a fresh IAB tab. The fresh rendered result contains the blue→cyan header and white header text on all viewports. Full panel gradient initially placed cyan too low; gave the header its own gradient and bounded the panel background to the top area. Final evidence is the rendered source/implementation comparisons. No actionable P0/P1/P2 findings remain for this palette update.

Required fidelity surfaces:
- Typography: existing Be Vietnam Pro, sizes, line breaks and weight retained; white title/subtitle and white controls match the selected header treatment; navy text remains readable on ice surfaces.
- Spacing/layout: existing PC/laptop/mobile responsive shell retained, mobile handle white, quick replies rounded and stacked on phone; rounded white composer now contains attachment/input/send as one surface; pale cyan support row appears below it.
- Colors: azure→cyan header, light ice-blue conversation gradient, pale assistant bubbles, blue→azure user bubbles, cyan outlines/frame, blue send and light cyan footer/support gradient match ICE FLOW.
- Images: original generated mascot/avatar reused, no new assets required; subtle cyan halo on header avatar matches the mockup.
- Copy: chat copy, reply choices, labels and support text preserved. Functional initial/long conversation states are retained rather than hardcoding the mock transcript.

Verification: typed send, quick replies, minimize/reopen preserving history; 1440/1280/390 and 320×568 layouts checked; no chat horizontal overflow, send control stays visible on small screen. Fresh-tab browser errors: none. Prettier check and scoped git diff check passed; no JS/TS behavior changed, so additional unit tests were not added. Existing input focus ring remains visible and header focus uses white outline.

P3 residuals: implementation retains prior responsive panel dimensions (PC slightly taller than normalized source), existing generated mascot and library icons; small raster antialiasing/color sampling differences remain. Long conversation scrolling is expected. Physical-device/Safari checks and deployment were not performed.

Checklist: approved palette applied, mockup compared, responsive checks passed, core chat interactions verified, local preview retained.

final result: passed
