# Responsive home — 03/11/2026

Đã cập nhật bản local tại http://localhost:3006. Chưa deploy production.

## Vấn đề và thay đổi

- Hero dùng hai cột thật trên desktop và điện thoại xoay ngang đủ rộng; chữ, thông điệp và nút không đè lên hình nhà. Trên mobile/tablet dọc, nội dung và nút đứng trước ảnh, ảnh có giới hạn chiều rộng và giữ tỷ lệ.
- Cỡ chữ mô tả thẻ dịch vụ trước đây xuống khoảng 10.56 px ở 901 px và 12 px ở 1024 px. Hiện có ngưỡng tối thiểu 14 px, tiêu đề thẻ tối thiểu 17 px. Nội dung quyết định chiều cao thẻ thay vì ép theo tỷ lệ cố định.
- Thẻ dịch vụ trên tablet dùng hết chiều ngang; hình minh họa giới hạn kích thước, neo về góc dưới phải. Nhóm chỉ có một dịch vụ giữ đúng một thẻ.
- Chọn thiết bị: hai cột ở mobile, ba cột ở tablet, sáu cột từ 1101 px. Nhãn luôn hiện và không bắt buộc kéo ngang.
- Home dùng menu thu gọn đến 1100 px, tránh dồn chữ trên laptop nhỏ. CSS và xử lý đóng menu khi resize dùng cùng mốc 1101 px. Các trang trong giữ mốc cũ 901 px.
- Màn 320 px hiển thị hai nút hành động thành hai hàng, không xuống dòng trong nhãn nút. Nút chính, gọi điện, menu và liên kết chi tiết có vùng bấm tối thiểu 44 px.
- Quy trình giữ hai cột trên mobile, bốn cột trên desktop; nội dung không bị giới hạn chiều cao hay cỡ chữ quá nhỏ.

## Phạm vi bảo toàn

- Không sửa ảnh nhà, tủ lạnh đã duyệt hoặc overlay đường nước đã duyệt.
- Không sửa nguồn `VerifiedServiceArea`, `HomeFooter`, `FloatingActions`; `shasum -c output/home-ice-blue/preserved.sha` PASS cả ba.
- Không sửa CSS khu vực, footer hoặc Zalo/AI. Kiểm tra chọn khu vực, ảnh khu vực và accordion footer mobile đã qua.
- Không đổi dữ liệu dịch vụ, metadata, API hoặc luồng đặt lịch.

## Kết quả kiểm tra

- `node scripts/audit-home-responsive.mjs http://127.0.0.1:3006`: PASS 19 viewport: 320, 360, 390, 430, 600, 601, 768, 820, 844×390, 900, 901, 1024, 1100, 1101, 1122, 1280, 1440, 1920, 2560 px.
- Tại mỗi viewport: ảnh nhà có kích thước thực, hero không chồng hai cột, sáu nhóm thiết bị hoạt động, đủ số thẻ hiện tại, mô tả không nhỏ hơn 14 px, không tràn/cắt chữ trong thẻ, không tràn ngang tài liệu, nút chi tiết cao ít nhất 44 px, không lỗi JavaScript.
- PASS menu mở/đóng bằng Escape, resize 1100→1101 px, chọn nhóm bằng bàn phím và giữ focus, reflow tại 640 px (tương đương vùng CSS của màn 1280 px khi zoom 200%), safe-area top giả lập 44 px.
- PASS bốn route services, chi tiết sửa máy lạnh, contact, booking: HTTP 200, một H1, header trang trong vẫn hiện nút đặt lịch.
- PASS thêm 16 tổ hợp trang trong/màn hình: bốn route trên ở 360, 768, 1024, 1920 px; không tràn ngang, HTTP 200, không lỗi JavaScript. Chi tiết tại `inner-routes.json`.
- ESLint các component home và `site-header.tsx`: PASS.
- Build production `.next-ice-blue-build-v10`: PASS biên dịch, TypeScript, lint và prerender. Cấu hình TypeScript phát sinh riêng cho thư mục build đã được gỡ khỏi source sau build.
- SEO audit: PASS 36 URL sitemap, 11 dịch vụ, 7 bài viết; canonical đúng origin hiện tại; kiểm tra noindex và 404 qua.
- `git diff --check`, kiểm tra cú pháp script audit: PASS.

Đây là kiểm tra Chromium bằng Playwright. Chưa xác thực trên thiết bị thật hoặc Safari; WebKit runtime chưa được cài trên máy. Kiểm tra reflow không thay thế đo zoom trình duyệt thật; safe-area được giả lập bằng biến CSS.

## Bằng chứng

- `before-*.png`, `before.json`: trước sửa.
- `after-*.png`, `after.json`: bản production sau sửa, toàn trang và số đo của từng nhóm.
- `preview-390.png`, `preview-768.png`, `preview-1440.png`: đầu trang không có focus giả lập.
- `services-390.png`, `services-768.png`, `services-1440.png`: phần dịch vụ; header tạm ẩn trong ảnh chụp để không che tiêu đề khi cuộn.
- `preview-wide.png`: ảnh 2560 px thu nhỏ để dễ đối chiếu toàn trang.
- `audit-production.log`, `build.log`, `seo.log`: kết quả thực thi.
