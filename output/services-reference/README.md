# Trang Dịch vụ — đối chiếu mockup

Trang chạy: http://localhost:3000/services

Tham chiếu: `/Users/macbookprom1/Downloads/Trang dịch vụ điện lạnh chuyên nghiệp.png`, kích thước 941 × 1672.

- [Ảnh kết quả ở 941 × 1672](services-941.png)
- [Đối chiếu: mockup bên trái, website bên phải](comparison-941.png)
- [Kết quả kiểm tra giao diện và thao tác](qa-results.md)
- [Số đo và dữ liệu kiểm tra](qa-results.json)

## Phạm vi

Triển khai riêng `/services` với header, hero, 8 thẻ dịch vụ, 4 cam kết, 4 bước, khu vực đặt lịch và footer. Thành phần và CSS mới nằm trong `apps/web/components/services-reference`. `site-chrome.tsx` chỉ thêm nhánh cho chính xác route `/services`. Không sửa trang chủ, các trang khác hoặc tài nguyên có sẵn trong lần triển khai này; các thay đổi có trước trong working tree được giữ nguyên.

Ảnh được tạo theo mockup và đặt tại `apps/web/public/images/services-reference`; nội dung, nút và form được dựng bằng HTML/CSS. Ảnh kỹ thuật viên và thiết bị vẫn có khác biệt chi tiết so với ảnh gốc; không khẳng định trùng khớp từng pixel.

## Kiểm chứng

- `npm run build:web`: đạt, TypeScript và 106 trang build thành công.
- `npm run lint --workspace @minhnhat/web`: đạt.
- `git diff --check`: đạt.
- `node apps/web/scripts/services-reference-qa.mjs`: 18/18 kiểm tra đạt; không có lỗi runtime.
- Kiểm tra 9 viewport: 320, 375, 390, 700, 768, 941, 1024, 1280 và 1440px; không tràn ngang và tất cả ảnh tải thành công.
- Tại 941px: các khu vực bắt đầu lần lượt tại y = 0, 409, 917, 1004, 1175, 1484; tổng chiều cao 1672px.
- Kiểm tra tìm kiếm không dấu, điều hướng, Escape/focus, menu di động, nút đặt lịch, xác thực form, trạng thái gửi, chặn gửi trùng và thử lại sau lỗi. Mọi POST đặt lịch trong QA được chặn và mô phỏng; không tạo lịch hẹn thật.
- Hash mã nguồn/tài nguyên có trước chỉ thay đổi ở hai file tích hợp được phép: `app/services/page.tsx` và `components/layout/site-chrome.tsx`.
- Ảnh trang chủ trước/sau có chênh lệch 0 pixel khi chụp cùng viewport 1024 × 900, full-page 1024 × 1536.

Chạy lại QA khi máy đang phục vụ ứng dụng ở cổng 3000. Có thể đặt `SERVICES_QA_URL` nếu dùng địa chỉ khác.
