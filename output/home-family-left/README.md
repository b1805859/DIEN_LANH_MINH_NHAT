# Family and sofa shifted left

Final asset: `apps/web/public/images/redesign/hero-family-service-finder-v3.webp` (1660 × 947, WebP quality 92).

Created with the built-in ImageGen edit tool from v2. Prompt: nudge only the complete family/sofa/coffee-table/rug group left into the empty space while keeping the foreground technician, AC, room, lighting, scale and camera unchanged; no baked airflow, particles or UI. The first edit overshot the requested shift and was discarded. A second edit used v2 as the edit target and the first draft only as a placement reference, asking for a smaller shift toward that draft. Final photo is the second edit.

Wide desktop images (1366px and above) select v3 using matching `<picture>` sources in both photo layers. Smaller desktops retain v2's previous composition. The wide-desktop panel background is trimmed by 44px at its widest point to leave room beside the sofa; the service grid remains in place. Mobile retains its original component and original photo.

Foreground family mask follows the shifted group; original WebGL effect code is unchanged. Introduction, five-step process and coverage/map components are unchanged. The first-screen hero dimensions and full eleven-service catalogue remain intact.

Evidence: `home-1440x800.png`, `comparison.png`, `checks.json`, `mobile-check.json`. ESLint and TypeScript passed.
