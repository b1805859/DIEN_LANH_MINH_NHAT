# Kiểm tra độ nổi của box/card — 28/10/2026

Đã thêm thang bóng dùng chung trong `apps/web/app/elevation.css`, với mức riêng cho card, hover và panel trên nền sáng/tối. Các card dịch vụ, dự án/bài viết và quy trình dùng bóng mới trong stylesheet chung. Khung liên hệ, bản đồ, FAQ, hero và các kiểu card quản trị được đồng bộ.

## Xác minh

- 80 URL (79 trang công khai và trang đăng nhập quản trị), kiểm tra ở 1440px và 390px: 160 lượt, tất cả HTTP 200, không tràn ngang. Chi tiết: `route-validation.json`.
- Đã xem ảnh trang chủ, giới thiệu, liên hệ và FAQ trên desktop/mobile.
- `UI_AUDIT_DIST_DIR=.next-elevation-check npm run build:web`: thành công, 100 trang được tạo. Đã dọn thư mục build tạm và khôi phục các tệp cấu hình Next tự sửa.
- `npx eslint app components lib`: thành công. Lệnh lint toàn workspace quét cả thư mục build cũ `.next-aurora-review` và báo lỗi trong mã sinh tự động; kiểm tra mã nguồn riêng không có lỗi.
- Trang dịch vụ giữ transition 0s. Quy trình dạng timeline trên mobile giữ nền trong suốt, không áp bóng cho từng hàng.
- Card quản trị: xác minh CSS qua fixture DOM độc lập, ảnh `admin-surface-fixture.png`. Chưa kiểm tra các trang sau đăng nhập với dữ liệu quản trị thực.

Khối văn bản chính sách dạng đọc dài giữ nền phẳng. Các card FAQ có nền, viền bo và bóng riêng. Không thay đổi nội dung, logic gửi biểu mẫu hay dữ liệu.
