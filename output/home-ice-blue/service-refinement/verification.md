# Service card refinement

- Compact AC cards with short home-only descriptions; catalogue descriptions and URLs retained.
- Replaced inset rectangular pictures with transparent cutout illustrations on the card background. Equal desktop CTA baselines; capped illustration size for wide screens.
- Home header retains its light palette when scrolling; the dark scrolled theme still applies on other pages.
- Checked 360, 390, 768, 901, 1024, 1440, 1920 and 2560 px: no horizontal overflow or uncaught page errors, three AC cards, aligned desktop CTAs and readable scrolled header. Evidence: checks.json and final-*.png.
- Targeted ESLint and production build passed. Coverage, footer and floating controls unchanged.
- Asset: apps/web/public/images/home-ice-blue/services-cutout-v2.webp. Built-in image_gen edit, transparent_background=true, followed by WebP encoding retaining alpha. Original: exec-0038e6c3-acaa-4900-a5da-de4bfc48cdc9.png in this chat's generated_images directory.
- Prompt: Remove the entire pale blue background from the service sprite sheet, replace with genuine transparent alpha; preserve three equal square cells, positions, proportions, blue technician, AC airflow and condenser/toolbox; no text, logos, UI or opaque panels. Keep subtle local shadows and semi-transparent airflow.
- No production deployment.
