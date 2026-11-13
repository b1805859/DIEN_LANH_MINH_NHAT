# Admin trend charts — 2026-11-01

Implemented daily booking submissions and anonymous public page views, Vietnam time, with 7/30/90-day filters, separate line charts, refresh, keyboard inspection and a daily table. Unknown view history is null, not a fabricated zero. Development and admin traffic are excluded.

Validation passed:
- API build; Web production build (106 pages), TypeScript and targeted ESLint.
- API tests: 2 suites, 17 tests.
- PostgreSQL integration: booking timestamps on both sides of Vietnam midnight, page-view atomic increment, and trend aggregation. Fixtures rolled back.
- HTTP: unauthenticated trends 401; valid 7/30/90-day ranges; invalid ranges 400; admin/API/static paths rejected.
- Browser: authenticated dashboard, all ranges, 90-row table, keyboard date inspection; responsive chart at 390px without horizontal overflow.
- Production browser: initial public page counted once; client navigation increased total to two; admin page did not increase total. Counter data and temporary QA account removed after verification.
- No browser console errors on dashboard.

Screenshots: desktop.png (actual empty local data), mobile.png, tracking-check.png (two temporary QA page views, removed after test).

Database migration applied locally: 20261101000000_website_daily_metrics. Deploy this migration with the API before releasing the frontend. Historical web views cannot be recovered from this counter; collection starts with production traffic.
