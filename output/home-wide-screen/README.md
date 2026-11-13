# Home wide-screen correction

Above 1440px, the home page frame now grows from 1200px up to 2160px rather than remaining fixed at 1200px. At 1920px it measures 1680px; at 2560px it measures 2160px. The same token aligns the header and home content.

Wide-screen hero typography, tiles, icons, button and height grow with bounded container units. Mobile and widths through 1440px retain their existing rules. Family/sofa asset, live particles, introduction, service process and coverage components remain in place.

Files: `apps/web/app/home-wide.css`, its import in `apps/web/app/layout.tsx`, and the wide-screen block in `apps/web/components/redesign/hero-service-finder.module.css`.

Browser checks and normalized comparison are recorded in the root `design-qa.md`. Screenshots are `home-1920.png` and `home-2560.png`; smaller proportional previews are provided for chat display.
