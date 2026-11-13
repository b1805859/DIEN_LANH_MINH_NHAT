

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
