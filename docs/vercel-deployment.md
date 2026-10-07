# Vercel deployment

Production frontend: https://dien-lanh-minh-nhat.vercel.app

Production API: https://dien-lanh-minh-nhat-api.vercel.app/api

Vercel scope: `shun-f9e0`. The frontend project uses `apps/web`; the API project uses `apps/api`. Both include workspace sources outside their root directory.

PostgreSQL is provided by the Neon Marketplace resource `minh-nhat-postgres` (Free plan, Singapore). Production tables and seed data were initialized on 2026-10-05. Existing local database data was not imported.

## Redeploy

Both projects are connected to `b1805859/DIEN_LANH_MINH_NHAT` on GitHub, with `main` as the production branch. Commit and push changes to `main` to trigger production builds. A successful build updates the corresponding production alias. No local Vercel CLI command is needed for routine updates.

```sh
git add <changed-files>
git commit -m "Describe the change"
git push origin main
```

Frontend and API builds are independent, so changes spanning both must remain compatible during rollout. Other branches create preview deployments; preview API/database environment variables need separate configuration before those environments can run.

### Manual fallback

Run from the repository root. Deploy the projects sequentially because `vercel link` changes the local project selection.

```sh
npx vercel link --yes --project dien-lanh-minh-nhat-api --scope shun-f9e0
npx vercel deploy --prod --yes --scope shun-f9e0

npx vercel link --yes --project dien-lanh-minh-nhat --scope shun-f9e0
npx vercel deploy --prod --yes --scope shun-f9e0
```

The API production build generates Prisma Client, compiles the API, then runs `prisma migrate deploy`. Commit migration SQL under `apps/api/prisma/migrations` whenever changing the Prisma schema. A schema edit alone does not create a migration. Migration failure blocks API deployment; preview builds skip migrations. Use backward-compatible migrations because the previous production API remains live during the build. Never run `migrate dev` or reset against production. The frontend build compiles the shared package first.

## Configuration

Frontend production variables include `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL=/api`, and the existing public business settings. The frontend Vercel rewrite forwards `/api/*` to the API project, so browser requests use the same origin. The API requires `DATABASE_URL`, `NODE_ENV=production`, explicit `CORS_ORIGIN`, and distinct strong `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` values. Secrets are stored in Vercel environment variables, not in source control.

The initial admin login is saved locally in `.vercel/admin-credentials.json` with owner-only permissions. Open that file locally to retrieve the password; do not commit or publish it. Local `.vercel` files and environment files are excluded from uploads and Git.

Production aliases are public; deployment-specific and preview URLs retain Vercel authentication protection. GitHub pushes now trigger automatic deployments for both projects.

## Verification

- Production homepage, booking page, FAQ and sitemap returned HTTP 200 with no localhost URLs.
- Homepage checked on desktop and a 390px mobile viewport: no horizontal overflow or broken loaded images; no browser JavaScript errors observed.
- API health, services, locations and settings returned HTTP 200.
- Admin authentication and authenticated dashboard requests succeeded.
- CORS permits the production frontend.
- The browser booking form saved a request without a district or appointment date. The temporary test booking was removed after database verification.
- Added migration `20261005000000_optional_booking_schedule` to align the old initial migration with the current optional booking fields.
