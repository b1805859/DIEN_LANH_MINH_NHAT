# UI audit — after-additional

Target: http://127.0.0.1:3010 · Mode: local

| Metric | Count |
| --- | ---: |
| pages | 12 |
| axeViolations | 0 |
| axeAffectedNodes | 0 |
| axeIncomplete | 14 |
| interactiveElements | 322 |
| missingTransitions | 0 |
| unsafeTransitions | 0 |
| smallTouchTargets | 0 |
| horizontalOverflows | 0 |
| layoutAnimations | 0 |

## /about / desktop

![Screenshot](after-additional-about-desktop.png)


## /about / mobile

![Screenshot](after-additional-about-mobile.png)


## /blog / desktop

![Screenshot](after-additional-blog-desktop.png)


## /blog / mobile

![Screenshot](after-additional-blog-mobile.png)


## /projects / desktop

![Screenshot](after-additional-projects-desktop.png)


## /projects / mobile

![Screenshot](after-additional-projects-mobile.png)


## /privacy-policy / desktop

![Screenshot](after-additional-privacy-policy-desktop.png)


## /privacy-policy / mobile

![Screenshot](after-additional-privacy-policy-mobile.png)


## /terms-of-service / desktop

![Screenshot](after-additional-terms-of-service-desktop.png)


## /terms-of-service / mobile

![Screenshot](after-additional-terms-of-service-mobile.png)


## /services/sua-may-lanh / desktop

![Screenshot](after-additional-services-sua-may-lanh-desktop.png)


## /services/sua-may-lanh / mobile

![Screenshot](after-additional-services-sua-may-lanh-mobile.png)


## Visual analysis

{
  "mode": "local",
  "note": "No Gemini call; inspect saved screenshots alongside DOM/Axe evidence."
}

## Limitations

- Automated checks do not establish complete WCAG compliance or actual frame rate.
- Totals count node occurrences per viewport/route; they are not unique components.
- Hidden/inert/disabled targets are excluded; unopened overlays need interaction verification.
- React debug source may be unavailable; inferred candidates require review.
- Axe incomplete checks require manual review.
