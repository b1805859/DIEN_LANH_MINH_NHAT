# Minh Nhật — đối chiếu mockup 28/09/2026

## Phạm vi triển khai

- Trang chủ desktop, mobile; menu mobile nền trắng.
- Chi tiết dịch vụ dùng chung template cho 10 dịch vụ; đối chiếu chính bằng `/services/sua-tu-lanh`.
- Đặt lịch, Giới thiệu, Liên hệ.
- Header, footer, CTA, thẻ thiết bị, quy trình, form và font tự lưu trong public.
- Giữ nguyên Next.js, API, cơ chế đăng nhập/quản trị và mutation đặt lịch. Thêm trường `notes` theo DTO API hiện có.
- Bổ sung `/areas` chuyển đến trang Ninh Kiều đã có để liên kết điều hướng không trả 404.

## File triển khai chính

- `apps/web/app/mockup.css`, `mockup-fonts.css`, `layout.tsx`
- `apps/web/app/page.tsx`, `services/[slug]/page.tsx`, `booking/page.tsx`, `about/page.tsx`, `contact/page.tsx`, `areas/page.tsx`
- `apps/web/components/layout/site-header.tsx`, `site-footer.tsx`
- `apps/web/components/forms/booking-form.tsx`
- `apps/web/public/images/mockup/`, `apps/web/public/fonts/`
- `apps/web/scripts/mockup-qa.mjs`, `mockup-compare.mjs`

Các thay đổi chưa commit tồn tại trước phiên làm việc (globals.css, package.json, content-sections, reveal, hooks, seo-content) được giữ nguyên. Next dev tự tạo AGENTS.md và CLAUDE.md.

## Assets

| Vị trí | Asset | Xử lý |
|---|---|---|
| Logo toàn trang | MinhNhatLogoMark | Tái sử dụng SVG hiện có |
| Zalo | public/icons/zalo.svg | Tái sử dụng |
| Ba thẻ dịch vụ | service-tools.png → mockup/card-{air,washer,fridge}.jpg | Crop xác định từ ảnh hiện có |
| Hero | mockup/hero.png | Image generation mới |
| Chi tiết tủ lạnh và ảnh giới thiệu thứ hai | mockup/fridge.png | Image generation mới |
| Đặt lịch | mockup/portrait.png | Image generation mới |
| Gallery tủ lạnh | mockup/fridge-{compressor,gauges,interior}.jpg | Ba ảnh generation mới |
| Ảnh sửa chữa và các dịch vụ khác | public/images/services/*.jpg | Tái sử dụng |
| Bản đồ | Google Maps iframe Cần Thơ | Bản đồ thật, tương tác được |
| Font | Be Vietnam Pro; Kalam | File font lưu cục bộ, tải từ Google Fonts |

Sáu ảnh được tạo bằng công cụ image_gen tích hợp, không dùng CLI/API fallback. Prompt và nguồn lưu trong `apps/web/public/images/mockup/ASSETS.md`.

## Kiểm tra

- `npm run build:web`: PASS, 106 route prerendered, bao gồm route chuyển hướng `/areas`.
- `npm run lint --workspace @minhnhat/web`: PASS.
- `npx tsc --noEmit -p apps/web/tsconfig.json`: PASS.
- 5 trang × 8 viewport: 375, 390, 430, 768, 1024, 1280, 1440, 1920: PASS.
- Không tràn ngang, không ảnh hiển thị bị lỗi và không có pageerror JavaScript trong 40 trường hợp.
- Menu mở/đóng, Escape, chọn dịch vụ: PASS trên 375/390/430.
- Bốn trường bắt buộc, chuẩn hóa điện thoại, gửi notes, trạng thái thành công: PASS qua request intercept. Không tạo booking thật; chưa kiểm tra máy chủ API production.
- Chi tiết máy đọc được: `results.json`.

## Đối chiếu hình ảnh

Các ảnh `compare-*.png` đặt mockup bên trái, implementation bên phải ở cùng chiều rộng. Có đủ home, service, booking, about, contact, mobile và menu. Đã sửa sau lượt đầu: khoảng trắng dư trước footer, crop ảnh thẻ thiết bị, tỷ lệ container desktop, cỡ chữ, chiều cao hero và lời cảm ơn.

Mockup được cung cấp là ảnh raster tổng hợp, không có asset/font/design file gốc. Không xác nhận pixel-perfect tuyệt đối: ảnh tái tạo khác người/bối cảnh và chữ trên đồng phục; logo SVG và một số icon tái sử dụng khác hình raster; font Be Vietnam Pro/Kalam là đối chiếu thị giác; bản đồ Google có nhãn/điều khiển thay đổi. Bottom nav giữ 4 mục hợp lệ trong source; hình tham chiếu có 5 icon với một số nhãn không đọc rõ. Năm trang và hai trạng thái mobile đã được triển khai và kiểm tra, nhưng các khác biệt asset này vẫn cần được tính khi nghiệm thu visual fidelity.

Chạy lại từ thư mục gốc:

```sh
npm run dev:web
node apps/web/scripts/mockup-qa.mjs
node apps/web/scripts/mockup-compare.mjs '/absolute/path/to/reference.png'
```
