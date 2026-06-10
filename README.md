# ĐIỆN LẠNH MINH NHẬT

Website Local SEO + Lead Generation cho dịch vụ điện lạnh và sửa chữa tại Cần Thơ.

## Yêu Cầu

- Docker Desktop
- Node.js 20.11+ nếu muốn chạy lệnh npm local
- npm 10+

## Chạy Bằng Docker

Mở terminal tại thư mục project:

```powershell
cd d:\Develop\projects\DIEN_LANH_MINH_NHAT
```

Do đường dẫn project có ký tự tiếng Việt, trên Windows nên tắt Docker Compose Bake:

```powershell
$env:COMPOSE_BAKE="false"
```

Build và chạy toàn bộ stack:

```powershell
npm.cmd run deploy
```

Kiểm tra container:

```powershell
npm.cmd run docker:ps
```

Deploy lại riêng website sau khi sửa giao diện:

```powershell
npm.cmd run deploy:web
```

Lệnh này sẽ rebuild `web` và restart `nginx` để tránh lỗi 502 sau khi container web được tạo lại.

Deploy lại riêng API:

```powershell
npm.cmd run deploy:api
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

Build riêng website:

```powershell
npm.cmd run build:web
```

Build riêng API:

```powershell
npm.cmd run build:api
```

Test:

```powershell
npm.cmd run test
```

Audit production dependencies:

```powershell
npm.cmd audit --omit=dev
```

## Lệnh NPM Nhanh

Các script chính đã được khai báo trong `package.json`, chạy tại thư mục root project:

```powershell
npm.cmd run dev:web       # chạy web local
npm.cmd run dev:api       # chạy API local
npm.cmd run build         # build tất cả workspace
npm.cmd run build:web     # build riêng web
npm.cmd run build:api     # build riêng API
npm.cmd run deploy        # rebuild toàn bộ Docker Compose và restart nginx
npm.cmd run deploy:web    # rebuild service web và restart nginx
npm.cmd run deploy:api    # rebuild service API và restart nginx
npm.cmd run deploy:nginx  # chạy lại service nginx
npm.cmd run docker:ps     # xem trạng thái container
npm.cmd run logs:web      # xem log web
npm.cmd run logs:api      # xem log API
npm.cmd run lint          # lint tất cả workspace
npm.cmd run test          # test tất cả workspace
```

Trên PowerShell Windows, nếu `npm` bị chặn bởi execution policy, dùng `npm.cmd` như các ví dụ trên.

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
npm.cmd run logs:api
```

Web:

```powershell
npm.cmd run logs:web
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
