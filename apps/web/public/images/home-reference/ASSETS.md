# Homepage reference assets — 1 October 2026

Reference: user-supplied `Trang chủ Điện Lạnh Minh Nhật hiện đại.png`, 1024 × 1536.
All photographs in this directory were created with the built-in ImageGen tool from that visual reference and encoded as WebP. They are illustrative reconstructions, not documentary photographs of completed jobs. No UI text from the mockup is baked into the page backgrounds; headings, navigation, cards and buttons are real HTML.

| File | Reference area and requested composition |
| --- | --- |
| hero.webp | Entire top hero photograph: dark glass interior, rear-view blue-capped technician, white wall AC, cyan airflow, original uniform branding; remove all website UI. |
| about.webp | About background: living room/AC/blue airflow on left, white copy space in center, tilted technician/condenser photo on right and pale cyan floor pattern; remove text and controls. |
| air-natural.webp | First service: white wall AC in bright modern interior, with artificial blue airflow removed. Original `air.webp` retained. |
| install.webp | Second service: blue-capped installer with yellow straps beside a white condenser. |
| ../services-reference/clean-air.webp | Third service and gallery: technician spraying the exposed evaporator coil with a protective washing bag. Reuses the same illustrative asset as Services and About. Earlier `clean.webp` and `clean-natural.webp` retained but no longer used by these cards. |
| washer.webp | Fourth service: white front-load washing machine, black circular door, bright laundry room with plants. |
| fridge.webp | Fifth service: stainless double-door refrigerator, white kitchen and plants. |
| technician.webp | Gallery fourth: back-facing technician servicing an open outdoor condenser on a glass patio. |
| gallery-repair.webp | Gallery first and process background: back-facing technician repairing a wall AC. |

Generated originals remain in the user's Codex generated_images directory. Project assets are self-contained in public; no runtime dependency on those original paths.

## Service photo cleanup — 3 October 2026

Tool: built-in ImageGen, precise-object-edit; saved as WebP quality 92 without resizing. Only the service photos containing artificial airflow were edited. The repair card uses `air-natural.webp`. The cleaning card and shared gallery subsequently switched to the existing `/images/services-reference/clean-air.webp` after the user requested a more realistic cleaning scene; the earlier brush scene is no longer displayed there. No new image was generated for that correction.

Air photo prompt:

> Use case: precise-object-edit. Asset type: website service-card photograph. Edit target: attached square photograph of a white wall air conditioner in a sunlit living room. Remove ONLY the artificial cyan/blue airflow visualization: glowing stream lines, translucent blue ribbons, mist, blue light glow at the air outlet, and their artificial blue cast on the wall. Reconstruct the wall and outlet underneath naturally with the original warm neutral daylight and physically realistic shadows. Keep the exact square composition, same camera angle, framing, air conditioner position and shape, white housing and dark open outlet, curtains, window, couch, pillows, coffee table, plant, lighting and photorealistic texture unchanged as closely as possible. This is a local cleanup of the existing image, not a redesign. No visible wind, no glow, no new elements, no text, no watermark.

Cleaning photo prompt:

> Use case: precise-object-edit. Asset type: website service-card photograph. Edit target: attached square photograph of the blue-capped technician brushing the open wall air conditioner. Remove ONLY the artificial cyan/blue airflow visualization: glowing curved stream lines and translucent cyan/blue ribbons descending from the left part of the unit, artificial mist and blue light on the wall/unit. Reconstruct the neutral wall, white plastic and dark heat-exchanger fins beneath the effects naturally. Keep the exact square composition, same camera angle and framing, exact technician identity, cap, uniform, pose, arm, glove and brush, opened white AC cover and dark fins, room and daylight as closely as possible. Preserve all natural blue clothing. Local cleanup of existing photo only. No visible airflow, no glowing lines or mist, no extra objects, no text or watermark.

`/videos/minh-nhat-process.webm` is a silent 14-second illustrative montage of these images with Vietnamese workflow captions. Rebuild using `node apps/web/scripts/create-home-video.mjs`; WebVTT captions are stored beside the video.

Homepage font: Roboto 400/500/600/700/800 downloaded from Google Fonts (Roboto v51), served locally in `/fonts/roboto-*.ttf`; SIL Open Font License at `/fonts/roboto-OFL.txt`.

The reference contains corrupted/unreadable navigation text. The six navigation items retain their reference order/roles with readable labels: Trang chủ, Dịch vụ, Về chúng tôi, Dự án, Tin tức, Liên hệ. Footer phone/email/year reproduce the supplied reference. YouTube and TikTok symbols remain non-links until actual channel URLs are configured; no unrelated channels were invented.
