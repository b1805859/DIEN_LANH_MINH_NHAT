# ĐIỆN LẠNH MINH NHẬT

Website Local SEO + Lead Generation cho dịch vụ điện lạnh và sửa chữa tại Cần Thơ.

## Yêu Cầu

- Docker Desktop
- Node.js 20.11+ nếu muốn chạy lệnh npm local
- npm 10+

## Chạy Bằng Docker

Mở terminal tại thư mục project:

```powershell
cd "d:\Develop\projects\ĐIỆN LẠNH MINH NHẬT"
```

Do đường dẫn project có ký tự tiếng Việt, trên Windows nên tắt Docker Compose Bake:

```powershell
$env:COMPOSE_BAKE="false"
```

Build và chạy toàn bộ stack:

```powershell
docker compose up -d --build
```

Kiểm tra container:

```powershell
docker compose ps
```

## Đường Dẫn

- Website: `http://localhost`
- API health: `http://localhost/api/health`
- Admin login: `http://localhost/admin/login`

Khi chạy bằng Docker, hãy mở admin bằng `http://localhost/admin/login` để frontend gọi API qua Nginx cùng origin `/api`.
- Sitemap: `http://localhost/sitemap.xml`

## Tài Khoản Admin Mặc Định

```text
Email: admin@minhnhat.local
Password: ChangeMe123!
```

Đổi mật khẩu này trước khi dùng production.

## Seed Database

Nếu database chưa có dữ liệu mẫu, chạy:

```powershell
$env:DATABASE_URL="postgresql://minh_nhat:minh_nhat_password@localhost:5432/minh_nhat?schema=public"
npx.cmd prisma db push --schema apps/api/prisma/schema.prisma
npm.cmd run prisma:seed --workspace @minhnhat/api
```

Dữ liệu seed gồm:

- Admin user
- Roles
- 8 dịch vụ chính
- 4 quận ưu tiên
- Blog categories
- Bài viết mẫu
- FAQ mẫu
- Business settings mẫu

## Lệnh Kiểm Tra

Cài dependencies local:

```powershell
npm.cmd install
```

Lint:

```powershell
npm.cmd run lint
```

Build:

```powershell
npm.cmd run build
```

Test:

```powershell
npm.cmd run test
```

Audit production dependencies:

```powershell
npm.cmd audit --omit=dev
```

## Dừng Project

```powershell
docker compose down
```

Nếu muốn xóa luôn volume database:

```powershell
docker compose down -v
```

## Xem Logs

Toàn bộ stack:

```powershell
docker compose logs -f
```

API:

```powershell
docker compose logs -f api
```

Web:

```powershell
docker compose logs -f web
```

PostgreSQL:

```powershell
docker compose logs -f postgres
```

## Cấu Hình Môi Trường

File mẫu:

```text
.env.example
```

Các biến quan trọng:

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

## Lỗi Thường Gặp

### Docker Desktop chưa chạy

Nếu gặp lỗi không kết nối được Docker engine, mở Docker Desktop rồi chạy lại:

```powershell
docker compose up -d --build
```

### Lỗi Docker Buildx với đường dẫn tiếng Việt

Chạy:

```powershell
$env:COMPOSE_BAKE="false"
docker compose up -d --build
```

### PowerShell không chạy được npm

Nếu `npm` bị chặn bởi execution policy, dùng `npm.cmd`:

```powershell
npm.cmd install
npm.cmd run build
```

## Tài Liệu Bổ Sung

- `architecture.md`
- `tasks.md`
- `docs/deployment.md`
- `docs/final-implementation-report.md`
- `docs/coverage-matrix.md`
