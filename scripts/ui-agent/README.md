# UI / UX & Motion self-healing pipeline

Chạy từ thư mục gốc monorepo. Web là workspace `@minhnhat/web`, Next.js, cổng mặc định 3000. Dùng Node 22 theo `apps/web/package.json`.

```sh
npm ci
npx playwright install chromium
npm run dev:web
```

Trong terminal khác:

```sh
npm run ui:audit
npm run ui:fix
```

- `ui:audit`: tạo ảnh viewport và toàn trang, Axe WCAG A/AA (2.0–2.2), DOM motion/touch metrics, kiểm tra reduced motion, nguồn React debug / ứng viên tìm kiếm. Lưu `before-audit-report.*` và bản mới nhất `audit-report.*`.
- `ui:fix`: đọc báo cáo Before (tạo nếu thiếu), sửa class qua AST và CSS qua PostCSS, áp dụng stylesheet quản lý tập trung, typecheck, lint, 7 regression tests, production build, audit After và 12 kiểm tra trạng thái tương tác. Lưu báo cáo đối chiếu, manifest SHA-256 và log xác minh. Thất bại trả exit code khác 0.
- Các sửa đổi ngữ nghĩa / hierarchy trong component được thực hiện và kiểm tra trực tiếp; auto-fixer không thực thi code từ Gemini hoặc tự viết lại logic nghiệp vụ.
- Sửa `templates/ui-interactions.css` thay vì bản sinh trong `apps/web/app/ui-interactions.css`. Chạy lại fixer không nhân đôi import hay thay đổi class đã hợp lệ.
- Chạy lại `ui:audit` để ghi nhận baseline mới. Fixer giữ baseline cùng URL/phạm vi để có thể lặp lại verification mà không mất số liệu ban đầu.

## Cấu hình

Biến môi trường truyền qua terminal được ưu tiên; dotenv đọc `.env.local`, `.env`, `apps/web/.env.local`, `apps/web/.env` và không in giá trị secret.

| Biến | Mặc định / công dụng |
| --- | --- |
| `TARGET_URL` | `http://localhost:3000`; giữ nguyên đường dẫn/query khi không truyền danh sách route |
| `AUDIT_PHASE` | `before`; đặt `after` để chụp ảnh sau, hoặc tên riêng để lưu bộ kiểm tra khác |
| `UI_AUDIT_PATHS` | Đường dẫn của `TARGET_URL`; danh sách route phân cách bởi dấu phẩy |
| `GEMINI_API_KEY` | Tùy chọn; gửi hai ảnh đầu + dữ liệu đo tới `gemini-2.5-flash` |
| `UI_AUDIT_LOCAL=1` | Buộc chạy local ngay cả khi đã cấu hình Gemini |
| `UI_AUDIT_DIST_DIR` | Thư mục output Next riêng để tránh ghi đè cache server khác |
| `UI_FIX_BUILD=0` | Bỏ qua production build khi lặp nhanh; mặc định có build |
| `UI_FIX_INTERACTIONS=0` | Bỏ qua bộ tình huống riêng cho site này; mặc định có chạy |

Không có key, hết quota hoặc lỗi Gemini: giữ đầy đủ báo cáo DOM + Axe và ảnh, không gián đoạn kiểm toán local. Gemini chỉ bổ sung nhận xét; không thay thế kết quả đo. Trường `sourceCandidates[].confidence = inferred` là ứng viên, không phải đường dẫn đã được React xác nhận.

## Server kiểm tra riêng

Nếu cổng 3000 đang có server khác, chạy trong terminal riêng:

```sh
cd apps/web
UI_AUDIT_DIST_DIR=.next-ui-audit ../../node_modules/.bin/next dev --hostname 127.0.0.1 --port 3010
```

Từ thư mục gốc:

```sh
TARGET_URL=http://127.0.0.1:3010 npm run ui:audit
TARGET_URL=http://127.0.0.1:3010 npm run ui:fix
TARGET_URL=http://127.0.0.1:3010 AUDIT_PHASE=after-routes UI_AUDIT_PATHS=/booking,/services,/contact,/faq,/admin/login npm run ui:audit
```

Fixer build với `NODE_ENV=production` và `.next-ui-build`, sau đó phục hồi `next-env.d.ts` / `tsconfig.json` vì Next có thể tự ghi các file này. Điều này tránh việc `.env` đặt `NODE_ENV=development` làm hỏng prerender production.

## Giới hạn và bằng chứng

- Tổng là **lượt xuất hiện theo route/viewport**, không phải số component duy nhất. 44×44px là chuẩn nội bộ được yêu cầu, chặt hơn một số ngoại lệ WCAG.
- Không đếm target hidden, inert hoặc disabled. Kích thước được lấy từ bounding box thực; kiểm tra Axe bổ sung phát hiện target bị che.
- Axe `incomplete` được giữ nguyên. Nền gradient / ảnh có thể khiến kiểm tra tương phản tự động không kết luận được. Không tuyên bố chứng nhận WCAG hoặc 60FPS từ ảnh chụp.
- Bộ tương tác kiểm tra native mobile dialog, dropdown dịch vụ, chat/quick prompts, tabs bằng phím, bộ lọc, validate form, notification, trả focus và reduced motion. POST đăng nhập được chặn và trả lỗi giả lập; form booking chỉ được thử dữ liệu trống. Không tạo lịch hẹn hoặc đăng nhập thật.
- `ConfirmDialog` được kiểm tra kiểu dữ liệu, lint và build; luồng quản trị cần phiên đăng nhập để kiểm tra thực tế. Không tạo phiên quản trị giả hoặc sửa dữ liệu.
- Xem `audit-output/improvement-summary.md`, `verification.json`, `interaction-verification.json` và các ảnh Before/After để kiểm tra kết quả.

Nguồn API: [Playwright](https://playwright.dev/docs/api/class-browser), [Axe Playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright), [MotionConfig](https://motion.dev/docs/react-motion-config), [AnimatePresence](https://motion.dev/docs/react-animate-presence), [Gemini generateContent](https://ai.google.dev/api/generate-content).
