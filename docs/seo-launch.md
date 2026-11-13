# SEO launch and follow-up

## Current scope

Public content is currently served from checked-in data (`packages/shared/src/index.ts`,
`apps/web/lib/content/blog-content.ts`, `service-details.ts`, `service-search-content.ts`).
The admin blog/SEO screens are not yet the source of public article bodies or metadata.
Publishing via admin alone must not be assumed to update the public site. Edit these
files and redeploy until a separate CMS integration is implemented and tested.

## Vercel configuration

Set Production `NEXT_PUBLIC_SITE_URL=https://dien-lanh-minh-nhat.vercel.app`.
Use the stable site origin, never a generated deployment URL. All canonical URLs,
schema URLs, robots and sitemap use the same helper. Production rejects localhost
and non-HTTPS origins. Do not change the production origin to run a local audit;
set an environment override on the isolated audit/build command instead.

Preview deployments are noindex through metadata/Vercel and have an empty sitemap.
The 44 service/area combinations stay accessible with noindex, follow and are excluded
from sitemap until each has useful unique local information. Do not block these paths
in robots: crawlers must be able to read their noindex. Four area hubs remain indexable.
No fake `lastmod`, prices, opening hours, warranty periods, ratings or business metrics
are emitted. Demo project detail pages remain noindex and outside sitemap.

## Google Search Console (owner action)

1. Sign into the Google account that should own the property. Add a **URL-prefix**
   property for `https://dien-lanh-minh-nhat.vercel.app/`. A `vercel.app` subdomain
   should not be verified as a DNS Domain property you do not own.
2. Select HTML tag verification. Copy only the content/token into Vercel Production
   `NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_VERIFICATION`, then redeploy. The layout
   already emits the verification meta tag. Leave the tag in place after verification.
3. Confirm ownership in Search Console. Submit `sitemap.xml` in Sitemaps.
4. Inspect home and the 11 `/services/...` URLs. Run the live test and review
   Google's chosen canonical, crawlability and indexed state. Request indexing for
   the key updated pages where available; submission does not guarantee indexing.
5. Review Pages/Indexing and Search results by page/query. Track impressions, clicks
   and contact/booking conversions; do not infer indexing from `site:` searches alone.

## Business owner input still needed

- Confirm business name, public/service address and service areas against Google
  Business Profile. Do not invent branch addresses. The existing Plus Code/address
  should be verified before adding further location attributes.
- Confirm actual hours, inspection fees, service prices and warranty conditions.
- Supply original job photos and permission to publish customer feedback. Generated
  illustrations are not evidence of completed jobs or actual staff.
- A technician should review model-dependent guidance before it is expanded into
  repair instructions. Existing articles intentionally avoid DIY electrical/gas work.

## Google Business Profile

Verify the business in the owner's account; choose truthful categories/services,
set real hours, website and coverage, publish real photos and request genuine reviews.
Never buy reviews, offer rewards for positive reviews or stuff the business name
with keywords. Keep phone/name/address consistent across the website and profile.

## Custom domain later

Connect the purchased domain in Vercel, choose one primary HTTPS host, update the
Production site URL and redeploy. Configure permanent redirects from the old
Vercel origin and alternate host, preserving paths. Inspect canonical/sitemap/schema
again. Add/verify the new Search Console property, submit its sitemap and follow
Google's site-move process if the indexed host changes. Keep old redirects active.

## Verification commands

- `node scripts/audit-seo.mjs http://localhost:3000` (dev)
- `node scripts/audit-seo.mjs https://dien-lanh-minh-nhat.vercel.app` after deployment
- `npx tsc --noEmit --incremental false -p apps/web/tsconfig.json`

For a production build with a separate output folder:
`NEXT_PUBLIC_SITE_URL=https://dien-lanh-minh-nhat.vercel.app UI_AUDIT_DIST_DIR=.next-seo-build npm run build:web`

Use Search Console, Rich Results Test and production Web Vitals for external
verification. Schema helps describe content but does not guarantee rich results,
indexing or ranking. FAQ markup is not a promise of FAQ snippets for this business.

## Reference

- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/essentials/spam-policies
- https://support.google.com/business/answer/7091?hl=vi
