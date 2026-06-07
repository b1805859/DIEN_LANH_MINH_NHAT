# Deployment Guide

## Prerequisites

- Docker Desktop or Docker Engine with Compose v2.
- Node.js 20.11+ for local development.
- DNS pointing to the production Nginx host.
- Production secrets for PostgreSQL and JWT.

## Environment

Copy `.env.example` to `.env` and set production values:

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_BUSINESS_PHONE`
- `NEXT_PUBLIC_ZALO_OA_URL`
- `NEXT_PUBLIC_FACEBOOK_MESSENGER_URL`
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`
- `NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_VERIFICATION`
- `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL`

Keep `COMPOSE_BAKE=false` on Windows workspaces with non-ASCII paths if Docker Buildx has path encoding issues.

## Build And Start

```bash
docker compose up -d --build
```

## Database

Apply the Prisma schema:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public" npx prisma db push --schema apps/api/prisma/schema.prisma
```

Seed initial data:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public" npm run prisma:seed --workspace @minhnhat/api
```

Default seeded admin:

- Email: `admin@minhnhat.local`
- Password: `ChangeMe123!`

Change this password before production use.

## Verification

```bash
npm run lint
npm run build
npm run test
npm audit --omit=dev
```

Runtime checks:

```bash
curl http://localhost/api/health
curl http://localhost/services
curl http://localhost/sitemap.xml
```

## Production Notes

- Put TLS termination in front of or inside Nginx.
- Rotate JWT secrets before launch.
- Replace placeholder phone, Zalo, Messenger, Google Maps, Analytics, and Search Console values.
- Move media storage to object storage when uploads become business-critical.

