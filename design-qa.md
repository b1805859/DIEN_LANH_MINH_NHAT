# Hero mockup implementation QA

final result: passed

## Latest long-arm correction
- User identified an unnaturally long arm across the sofa back behind the mother, missed in the previous visual review.
- Used built-in imagegen to remove that entire horizontal arm, hand and sleeve, restoring sofa upholstery. Far arms are now naturally occluded behind the seated bodies, while visible hands/laps and separate legs are retained.
- Inspected an enlarged family crop before integration and the production page afterward. The identified long arm is absent; no replacement arm crosses the sofa back.
- New asset: apps/web/public/images/redesign/hero-family-natural-arms.webp, 1661×947. Both hero image layers load it successfully. Airflow canvas remains present, no browser console errors or horizontal overflow observed.
- Production build, lint/type checks and diff check passed.
- Latest evidence: /Users/macbookprom1/Documents/Codex/2026-10-18/c/outputs/gia-dinh-khong-con-tay-dai.png. Closeup: chi-tiet-gia-dinh-sua-tay.png. Exact imagegen prompt and saved asset paths: family-arm-edit-notes.md in outputs.

## Latest family anatomy repair
- Used built-in imagegen precise-object-edit on the family region to simplify seated poses and repair hands, knees, legs and feet. Child now has two distinct short legs separate from the parents; hands rest naturally on lap/toy.
- Inspected an enlarged family detail before integration, then inspected the production page at 1440×900. No conspicuous merged limbs observed at these views. Faces, room composition, blanket-free sofa and technician remain visually consistent.
- New versioned asset: apps/web/public/images/redesign/hero-family-anatomy-fixed.webp. Generated PNG is 1660×947; normalized the one-pixel width difference to the existing 1661×947 rendering geometry during WebP export. Both scene and technician foreground use the same new source.
- Production browser confirms both images loaded at 1661×947, live airflow canvas present, no horizontal overflow and no console errors. Existing 1080-particle effect and contact bubbles retained.
- Production build, lint/type checks and diff check passed.
- Evidence: /Users/macbookprom1/Documents/Codex/2026-10-18/c/outputs/gia-dinh-da-sua-tay-chan.png. Prompt and asset details: family-anatomy-edit-notes.md in outputs.

## Latest raised contact bubbles
- Raised the home desktop contact groups by 48px: base bottom inset is now 72px, accounting for safe-area insets. Mobile contact bar is raised by 24px.
- Production browser verified at 1440×900: phone and AI bottom gaps 72px, Zalo 132.24px; at 451×700 mobile bar bottom=24px, button bottom gaps=32px.
- Production build, lint/types and diff check passed. Screenshot: /Users/macbookprom1/Documents/Codex/2026-10-18/c/outputs/bong-bong-nang-cao.png.

## Latest first-screen contact bubbles
- Removed the home-only unscrolled-header rule that hid the floating phone, Zalo and AI controls and disabled pointer events.
- At scrollY=0, desktop and mobile controls are visible, container opacity=1 and pointer-events=auto. Existing contact destinations retained. AI dialog opens and closes correctly.
- Production build, lint/types and diff check passed. Desktop evidence: /Users/macbookprom1/Documents/Codex/2026-10-18/c/outputs/bong-bong-lien-he.png.

## Latest blanket removal
- Removed the beige sofa throw using the built-in imagegen precise-object-edit workflow; reconstructed the sofa upholstery and rug.
- Saved a versioned asset: apps/web/public/images/redesign/hero-family-no-blanket.webp (1661×947, lossless). Both background and technician occlusion now reference this image. Original photo retained.
- Visually inspected the generated photo and production page at 1440×900: blanket absent, sofa continuous, family/technician placement and airflow remain aligned. Both images loaded at 1661×947; airflow canvas present; no horizontal overflow or browser console errors.
- Production build, lint/type checks and git diff --check passed.
- Evidence: /Users/macbookprom1/Documents/Codex/2026-10-18/c/outputs/sofa-da-bo-khan.png.

## Latest separated panels and photo scaling
- User requested a top gap above services and rescaling the airflow photograph, retaining the first-viewport composition.
- Services are now an independent rounded, bordered card, separated from the photograph by the shared page gap (16px desktop, 8px mobile), with the same space below. Home menu uses shared SiteHeader styling, including its calendar booking button.
- Photo, technician mask and airflow canvas resize together. Copy typography also responds to photo height so commitments do not overlap family heads on shorter desktop screens. Dense live particles are retained.
- At 1440×900: menu x=80, y=16, width=1280, height=62; photo y=94, height=666; services y=776, height=108, bottom=884. Following section begins at y=900.
- Checked 1440×800, 390×844 and 375×667: services have the requested gap, following section begins at viewport height, and there is no horizontal overflow. Inspected desktop and mobile screenshots; no text overlap, clipped labels or foreground alignment issues observed.
- Production build, lint/type checking and diff check passed. Browser console had no errors.
- Latest screenshot: /Users/macbookprom1/Documents/Codex/2026-10-18/c/outputs/menu-dich-vu-tach-biet.png.

## Latest shared-margin adjustment
- User reference: /var/folders/nv/2ztsn7wj3fg53nxgybl4cpvh0000gn/T/codex-clipboard-0d88f05b-9295-44f8-90dc-46768ac77a0f.png (About page).
- Home now inherits the inner-page content gutter, maximum width, header inset and section gap. Removed full-bleed header overrides; hero uses the same frame, border and rounded corners. Service strip aligns inside the hero frame.
- At 1440×900, both menu and hero start at x=80px and are 1280px wide. Menu top=16px; hero top=94px. Following section begins at y=900px.
- At 1024px, both share x=24px and width=976px; at 390px, both share x=16px and width=358px. No horizontal overflow. Document-level following-section boundaries remain 800px and 844px respectively.
- Hero height accounts for header inset, header height and gap; mobile navigation height accounts for its actual padded shell.
- Production build and diff checks passed; browser console had no errors.
- Latest screenshot: /Users/macbookprom1/Documents/Codex/2026-10-18/c/outputs/le-trang-chu-dong-bo.png.

## Previous compact navigation adjustment
- User requested smaller home navigation matching inner pages and a smaller service strip.
- Home menu now reuses shared SiteHeader logo, navigation, hotline and booking sizes; desktop menu height is 62px instead of 100px.
- Service strip reduced to 108px at 1440×900 and 96px at 1440×800, with 36px icons and max 14px text. Mobile strip reduced to 156.94px at 390×844.
- Browser checks at all three sizes: service bottom and following section top still equal viewport height; no horizontal overflow and no console errors. Production build and diff check passed.
- Latest screenshot: /Users/macbookprom1/Documents/Codex/2026-10-18/c/outputs/menu-va-dich-vu-gon-hon.png.

## Previous viewport and particle adjustment
- User requested that header + hero + services fit exactly in the first viewport, with following sections visible only after scrolling.
- Hero uses dynamic viewport height minus the existing header height. Desktop scene fills the remaining space; mobile distributes it between copy, photograph and service grid. Compact mobile styles keep labels and controls visible on shorter displays.
- Browser checks passed at 1440×900, 1440×800, 1920×1080, 390×844 and 375×667: hero bottom, service bottom and following section top align with viewport height (rounding <0.01px), with no horizontal overflow.
- PageDown exposed the next section; no scroll lock or snap interception added. Fresh production console had no errors.
- Particle count increased from 360 to 1080 (3×); deterministic low-discrepancy distribution avoids repeated clusters. Tiny size, movement and family/technician protection retained.
- Current screenshot: /Users/macbookprom1/Documents/Codex/2026-10-18/c/outputs/man-hinh-dau-hat-day-hon.png.
- Production build and diff check passed.

## Previous approved adjustment
- User requested restoring the service strip to its original floating position over the bottom of the photograph. This overrides the separated service strip in the earlier mockup.
- Production browser verified at 1435px: strip x=42.04px, width=1350.92px, height=147.59px, bottom aligned exactly with the photograph at y=919.59px. No horizontal overflow; live WebGL canvas remains present.
- Latest screenshot: /Users/macbookprom1/Documents/Codex/2026-10-18/c/outputs/thanh-dich-vu-vi-tri-cu.png.
- Build and diff checks passed again. Mobile retains the existing responsive four-column service layout.

## Target and evidence
- Selected reference: /var/folders/nv/2ztsn7wj3fg53nxgybl4cpvh0000gn/T/codex-clipboard-e45bd5ae-49e1-428e-ba99-db2803f3fd4a.png, 1435 × 1096 pixels.
- Implementation: http://localhost:3000/ (live airflow and particles).
- Desktop CSS viewport: 1435 × 1096, density 1. Full-page browser captures were cropped to the first 1096 pixels without resizing. This avoids the in-app browser's 61px-short viewport capture.
- Production screenshot: /Users/macbookprom1/Documents/Codex/2026-10-18/c/outputs/hero-mockup-applied.png (1435 × 1096).
- Same-input full comparison: /Users/macbookprom1/Documents/Codex/2026-10-18/c/work/mockup-comparison-final.png.
- Focused comparisons: /Users/macbookprom1/Documents/Codex/2026-10-18/c/work/focus-copy.png and focus-foreground.png. These were inspected for wrapping, typography, CTA and foreground occlusion; final spacing adjustments are shown in mockup-comparison-final.png.
- Final mobile: /Users/macbookprom1/Documents/Codex/2026-10-18/c/work/hero-final-mobile.png (390 × 740 crop of full browser capture, CSS viewport 390 × 844).

## Comparison history and resolved findings
1. P1: Original photograph made sofa/family smaller and farther right than selected mockup. Replaced with a clean photograph generated from the selected mockup, then converted losslessly to WebP. Family, complete sofa and coffee table are visible; editable text and live WebGL effects remain separate. Evidence: mockup-comparison-v2.png and mockup-comparison-final.png.
2. P2: Description wrapped after “mát” rather than “ấm”. Added the exact line break and refined vertical spacing; final comparison shows two lines matching the target.
3. P2: Home header brand/navigation was too small. Updated home-only header height, brand size and navigation/CTA typography. Final desktop comparison inspected.
4. P2: Service strip covered the sofa and photograph boundary differed. Services are now in document flow under a 7:4 image scene, boundary at y=919.6; no overlap with image. Final desktop comparison inspected.
5. Foreground alignment: removed old AC/family plates tied to the old photo, aligned the technician occlusion to the new photograph, and moved the airflow emitter to the new vent. Foreground focus comparison inspected; no substantial contour holes or cyan over the person observed.

## Required fidelity surfaces
- Fonts/typography: existing Be Vietnam Pro and icon system retained. Two-line bold heading, reference description, cyan pill CTA, readable service labels. Minor generated-reference optical differences are P3.
- Spacing/layout: upper-left copy; complete photo below header; eight service columns beneath image. At widths up to 900px copy stacks above the photograph to avoid covering family. No horizontal overflow at 390 or 1024px.
- Colors/tokens: original navy/cyan preserved. Airflow remains cyan through windows/curtain but becomes transparent over furniture. Family and sofa retain natural color and texture.
- Image quality/assets: full-resolution clean photo, lossless WebP, matching aspect ratio and cover projection. The SVG is solely an occlusion contour over the real photograph, not replacement artwork or an icon. Residual small photographic details differ from the generated reference; P3, no impact on composition or core task.
- Copy/content: headline, two-line description, booking CTA, three commitments and all eight original service links retained/matched.

## Runtime and interactions
- Hero booking CTA clicked; /booking form opened successfully, then returned home.
- Main service hrefs retained.
- Inspected 0s, 6s and 12s frames; 2135 changing pixels in the 400 × 300 window sample between 0s and 12s. Sparse micro-particles visibly present; independent WebGL point pass retained at original size/alpha (now 1080 points after the latest requested increase).
- WebGL canvas present after mobile/tablet/desktop resize. Source supports reduced motion and renderer cleanup.
- Fresh production home tab console: no error entries. Development-only CSS hot-reload errors occurred during edits and did not reproduce in production.
- npm run build:web passed compilation, lint/type checks and static generation (100 routes).
- git diff --check passed.

## Remaining P3 polish / limits
- Small photographic/optical differences from the generated reference can be refined if requested.
- No full accessibility certification or real-device performance profiling was performed.

## Implementation checklist
- [x] Match hero hierarchy and photo emphasis.
- [x] Preserve animated tiny particles independently from thinner mist.
- [x] Verify foreground occlusion and source vent alignment.
- [x] Verify responsive layout, CTA, console and production build.
- [x] Update localhost:3000 and refresh the user's existing tab.
