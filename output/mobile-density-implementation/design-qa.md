

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
