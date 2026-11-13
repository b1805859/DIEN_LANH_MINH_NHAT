# Hero leg anatomy and airflow — 2026-11-01

Asset: apps/web/public/images/redesign/hero-family-service-finder-v5.webp
Generated with built-in image_gen.imagegen. The full prompt and image source are recorded in apps/web/lib/content/asset-provenance.json.

Changed only the woman's trouser legs, ankles and slippers using a localized feathered composite. Both hero image layers point to v5 so the foreground mask stays aligned. Original v4 retained.

Increased finder fan spread from 0.48 to 0.68. The shared constant drives both the GLSL volume envelope and JavaScript particle bounds. Preserved the emission origin, upper vent tangent, room projection and people mask. Other compositions unchanged.

Visual QA: desktop screenshot at fixed animation time t=3; two natural lower legs and slippers on rug; wider mist and particle distribution behind people. No browser console errors. Targeted ESLint passed.
