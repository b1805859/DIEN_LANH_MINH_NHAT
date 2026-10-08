# Hạng Mục Dữ Liệu Kinh Doanh Cần Xác Nhận (Owner Confirmation)

Tài liệu này ghi nhận hiện trạng giữa **dữ liệu kinh doanh đã xác thực** và **các chi tiết cần chủ cơ sở Điện Lạnh Minh Nhật xác nhận chính thức** trước khi phát hành phiên bản production thương mại.

---

## 1. Dữ Liệu Đã Xác Thực (Verified Facts)

- **Tên cơ sở:** Điện Lạnh Minh Nhật
- **Thành phố hoạt động chính:** TP. Cần Thơ, Việt Nam
- **Số điện thoại hotline:** `0939 370 109` (hoặc `0939370109`)
- **Tài khoản Zalo:** `https://zalo.me/0939370109`
- **Khu vực phục vụ trọng tâm:** Các quận, huyện tại Cần Thơ (Ninh Kiều, Cái Răng, Bình Thủy, Ô Môn, Thốt Nốt, Phong Điền, Thới Lai, Cờ Đỏ, Vĩnh Thạnh).
- **Dịch vụ cung cấp:**
  1. Tháo lắp máy lạnh
  2. Vệ sinh máy lạnh
  3. Sửa máy lạnh
  4. Nạp gas máy lạnh
  5. Sửa tủ lạnh
  6. Sửa máy giặt
  7. Vệ sinh máy giặt
  8. Sửa chữa điện nước
  9. Sửa lắp máy nước uống nóng lạnh
  10. Sửa lắp máy nước nóng lạnh tắm
- **Chính sách hiển thị giá:** Tuyệt đối không hiển thị giá cụ thể, bảng giá hoặc nhãn tiền tệ ("0đ", "VNĐ") trên giao diện công khai theo quy định của chủ cơ sở. Khách hàng liên hệ để được kỹ thuật viên khảo sát hiện trạng và báo rõ phương án kỹ thuật trước khi làm.

---

## 2. Dữ Liệu Cần Chủ Cơ Sở Xác Nhận (Pending Confirmation)

| Hạng mục | Giá trị mặc định hiện tại | Nguồn / Ghi chú |
| :--- | :--- | :--- |
| **Địa chỉ trụ sở / cửa hàng vật lý** | `Cần Thơ, Việt Nam` (chưa có số nhà, tên đường cụ thể) | Có thể cấu hình qua biến môi trường `NEXT_PUBLIC_BUSINESS_ADDRESS` khi có địa chỉ đăng ký kinh doanh chính thức. |
| **Giờ làm việc / trực điện thoại** | `08:00 – 20:00 (T2 – CN)` | Cấu hình qua `NEXT_PUBLIC_BUSINESS_OPENING_HOURS`. Cần xác nhận xem có làm việc ngày lễ hoặc hỗ trợ ngoài giờ hay không. |
| **Email liên hệ** | `dienlanhminhnhat@gmail.com` | Cần xác nhận hòm thư này có đang hoạt động và nhận thư thường xuyên hay không. |
| **Trang Facebook Fanpage** | `https://www.facebook.com/le.qui.16718` | Cần xác nhận URL trang cá nhân/fanpage chính thức của cơ sở. |
| **Hình ảnh công trình thực tế** | Sử dụng ảnh minh họa với chú thích rõ ràng | Cần bổ sung ảnh chụp thực tế tại các công trình Cần Thơ khi thợ tác nghiệp để thay thế các ảnh minh họa hiện tại. |
| **Đánh giá / Feedback khách hàng** | Tạm ẩn / Chỉ hiển thị các cam kết cốt lõi | Hiện tại mảng `reviews` trong code được giữ trống với cờ `verified: false`. Chỉ kích hoạt khi có đánh giá thật từ khách hàng. |
| **Thời gian bảo hành cụ thể theo hạng mục** | Cam kết "Bảo hành trách nhiệm, dán tem theo dõi" | Cần xác nhận thời hạn bảo hành thực tế cho từng loại dịch vụ (sửa bo mạch, nạp gas, thay lốc, vệ sinh). |
