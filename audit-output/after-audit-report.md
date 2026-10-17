# UI audit — after

Target: http://127.0.0.1:3010 · Mode: local

| Metric | Count |
| --- | ---: |
| pages | 2 |
| axeViolations | 0 |
| axeAffectedNodes | 0 |
| axeIncomplete | 2 |
| interactiveElements | 102 |
| missingTransitions | 0 |
| unsafeTransitions | 0 |
| smallTouchTargets | 0 |
| horizontalOverflows | 0 |
| layoutAnimations | 0 |

## / / desktop

![Screenshot](after-desktop.png)


## / / mobile

![Screenshot](after-mobile.png)


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
