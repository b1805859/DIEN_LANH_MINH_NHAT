# Kiểm tra trải nghiệm mobile

Phạm vi: các trang công khai, giữ thiết kế và màu sắc hiện có. Kiểm tra bằng Chromium/Playwright ở 320, 390, 768px; kiểm tra bổ sung xoay ngang 844×390, chat 320×380 và desktop 1440×900. Giao diện cũng được xem lại trong trình duyệt của ứng dụng.

## Các bước và kết quả

1. Trang chủ — đã sửa hero bị ép theo chiều cao màn hình, chữ và nút nhỏ. Hero theo nội dung; ảnh giữ tỉ lệ; vùng bấm chính tối thiểu 44px. [Ảnh](final-390.png).
2. Menu — mở, đóng và chuyển từ trang chủ đến Liên hệ thành công; mở lại được nội dung sau khi đóng. Menu áp dụng đến 900px và cuộn được trên màn hình thấp. [Ảnh](menu.png).
3. Nội dung — 15 đường dẫn bên dưới trả HTTP 200; lượt kiểm tra 45 tổ hợp trang/kích thước không phát hiện tràn ngang hay lỗi JavaScript. Ảnh bài viết tại 320px đã hết vượt khỏi khung.
4. Biểu mẫu — các ô dùng chữ 16px, xếp một cột trên điện thoại; nhấn gửi khi chưa điền hiển thị 6 lỗi bắt buộc. Không gửi yêu cầu đặt lịch thật. [Ảnh](contact-final.png).
5. Chat — mở/đóng, nhập câu hỏi và nhận trả lời thành công. Khung co theo visualViewport để giữ ô nhập khi bàn phím thay đổi vùng nhìn thấy. Kiểm tra khung ở chiều cao 380 và 480px. [Ảnh](chat-short.png).
6. Liên hệ nổi và footer — thanh liên hệ sát đáy với safe area và khoảng đệm cuối trang; footer chia hai cột liên kết, thông tin cơ sở trải đủ chiều rộng. [Ảnh](footer-final.png).

## Các đường dẫn đã kiểm tra

- `/`
- `/about`
- `/services`
- `/services/sua-may-lanh`
- `/contact`
- `/booking`
- `/projects`
- `/projects/lap-dat-may-lanh-ninh-kieu`
- `/blog`
- `/blog/bao-lau-nen-ve-sinh-may-lanh-mot-lan`
- `/faq`
- `/privacy-policy`
- `/terms-of-service`
- `/areas/ninh-kieu`
- `/areas/ninh-kieu/sua-may-lanh`

## Kiểm tra mã

- ESLint các file TSX thay đổi: đạt.
- TypeScript `tsc --noEmit`: đạt.
- `git diff --check`: đạt.

Giới hạn: đây là kiểm tra trình duyệt mô phỏng, chưa phải thử trên iPhone/Android vật lý. Chưa xác nhận đầy đủ VoiceOver/TalkBack, Safari thực tế hoặc toàn bộ tổ hợp thiết bị; không khẳng định tuân thủ accessibility đầy đủ. Trang quản trị nằm ngoài phạm vi các trang công khai này.
