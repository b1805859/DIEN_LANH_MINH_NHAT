# Trang chủ theo mockup — 01/10/2026

Mẫu gốc: `Trang chủ Điện Lạnh Minh Nhật hiện đại.png`, 1024 × 1536.

## Kết quả

Đã dựng đủ header, hero, 5 dịch vụ, giới thiệu, quy trình 4 bước, thư viện 5 ảnh và footer. Giữ Next.js 16, React, cấu trúc route, đặt lịch và các trang khác của dự án. CSS Module và chrome riêng cho `/` tránh thay đổi giao diện những route khác. Các chỉnh sửa chưa commit có sẵn trước phiên làm việc được giữ nguyên.

Mốc đầu mỗi khu vực ở native viewport: hero 0; dịch vụ 466; giới thiệu 720; quy trình 1023; thư viện 1196; footer 1354; hết trang 1536.

- `production-1024.png`: ảnh chụp bản production cuối cùng.
- `comparison-1024.png`: mockup bên trái, bản production bên phải ở cùng tỷ lệ.
- `home-{320,375,390,768,1024,1280,1440}.png`: ảnh kiểm tra responsive.
- `results.json`, `results.md`: kết quả kiểm tra tích hợp cuối cùng.

## Xác minh

- `npm run build:web`: PASS, 106 routes generated.
- `npm run lint --workspace @minhnhat/web`: PASS.
- TypeScript trong production build: PASS.
- `git diff --check` và Prettier trên file UI thay đổi: PASS.
- 13/13 kiểm tra trình duyệt: 7 viewport, tìm kiếm không dấu/Escape/focus, gallery và bàn phím, video 14 giây/phát/dừng, menu mobile, điều hướng đặt lịch, không pageerror.
- Bản production: HTTP 200, đúng mốc bố cục và không pageerror.
- Không gửi form đặt lịch hoặc liên hệ thật; không deploy.

Chạy: `npm run dev:web`, sau đó `node apps/web/scripts/reference-home-qa.mjs`.

## Giới hạn đối chiếu

Bố cục và các mốc kích thước đã được đo theo mẫu. Ảnh mới được tái tạo bằng ImageGen; góc chụp, người, chi tiết thiết bị và một số đường nét icon vẫn khác bản raster. Không xác nhận trùng pixel tuyệt đối 100%. Những nhãn điều hướng không đọc rõ trong raster được chuẩn hóa thành tiếng Việt dễ đọc. Phone/email/năm ở footer chép theo mockup. YouTube/TikTok chỉ hiện biểu tượng nếu chưa cấu hình URL kênh, tránh liên kết tới kênh không xác minh.

Nguồn và nội dung ảnh: `apps/web/public/images/home-reference/ASSETS.md`. Video là montage minh họa từ các ảnh đã tạo, có nhãn minh họa và phụ đề tiếng Việt.
