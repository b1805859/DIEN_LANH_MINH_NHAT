# Design QA — bản mockup toàn trang

final result: passed

## Nguồn và bằng chứng

- Visual truth: ../selected-reference.png — ảnh do người dùng chọn, bộ Trắng băng – Xanh tin cậy.
- Implementation: http://localhost:3100; ảnh toàn trang tại ../screenshots/.
- Viewport: desktop 1440 × 1000 CSS px; PNG rộng 1425 px do thanh cuộn. Không có browser chrome.
- Source concept: 1374 × 1145 px. Dải bảng màu trên cùng là phần trình bày concept, không đưa vào giao diện website.
- So sánh đồng thời: ../reference-comparison.jpg. Cắt bỏ 85 px dải trình bày ở ảnh nguồn, chuẩn hóa chiều rộng hai phía còn 700 px, so vùng đầu trang và dịch vụ. Đây là yêu cầu áp dụng bảng màu vào source, không yêu cầu tái tạo concept theo từng pixel.
- Bằng chứng chi tiết: ../screenshots/006-booking.png và ../screenshots/013-services--sua-may-lanh.png đã mở riêng để đọc chữ, kiểm tra form và nội dung.
- 80 URL: ../route-validation.json; kích thước ảnh: ../image-manifest.json.
- Tổng quan 80 trang: ../overview-1.jpg đến ../overview-5.jpg, đã xem bằng công cụ ảnh.

## Lịch sử sửa và kiểm tra lại

1. Lần chụp đầu có ảnh dự án/quy trình ở vùng dưới trang chưa tải vì lazy loading — P1 cho bản mockup toàn trang. Đã bật eager loading và dùng ảnh nguồn trực tiếp trong bản sao; xuất lại các trang chính và kiểm tra 80/80 URL không còn ảnh thiếu.
2. Màu bản đồ tối khiến nhãn khó đọc trên nền sáng — P2. Đã chuyển nền polygon sang xanh băng, nhãn navy viền trắng và pin cobalt; bằng chứng sau sửa nằm trong ảnh trang chủ và các trang có vùng phục vụ.
3. Các mốc quy trình còn nền vuông xanh sau chuyển màu — P2. Đã giữ mốc tròn cobalt, bỏ nền vuông, xuất lại trước khi tạo bộ ảnh hoàn chỉnh.

## Năm bề mặt kiểm tra

- Font/chữ: giữ Be Vietnam Pro thực tế trong source, đầy đủ dấu tiếng Việt. H1, nội dung và nhãn form rõ, không dùng chữ từ ảnh tạo sinh.
- Bố cục/khoảng cách: giữ grid và thứ tự phần từ source. Toàn bộ 80 URL không tràn ngang. Header/footer cùng hệ màu; mọi ảnh lưu đủ chiều dài trang.
- Màu: kiểm tra DOM thực tế xác nhận nền rgb(245,249,252), CTA rgb(7,89,199), chữ CTA rgb(255,255,255) trên 80 URL. Chữ chính navy và accent teal áp dụng nhất quán. Màu sắc trong ảnh chụp có thể chịu quản lý màu của trình duyệt/hệ điều hành; CSS là thông số chuẩn.
- Hình ảnh: dùng logo vector có sẵn, icon hiện có, ảnh và minh họa hiện có. Đã xác nhận 0 ảnh chưa tải ở cả 80 URL. Không phát sinh placeholder mới.
- Nội dung: giữ dịch vụ, hotline, khu vực, bài viết và các đoạn thông tin pháp lý trong source. Nội dung dự án vẫn được ghi rõ là minh họa. Chuyên mục Điện Nước trống theo dữ liệu hiện hữu.

## Giới hạn và phần tinh chỉnh nhỏ

- Khác biệt kích thước hero, số thẻ dịch vụ và độ dài nội dung so với concept là do giữ source hiện có theo yêu cầu của người dùng. Mục tiêu pass ở đây là mockup áp dụng bảng màu trên mọi URL, không phải 1:1 concept.
- Chỉ xuất desktop; chưa làm bộ ảnh mobile đầy đủ.
- Form giữ trường nhập để duyệt nhưng chặn gửi ở bản sao. Không kiểm tra backend hay tạo booking.
- Trang gallery có 80 ảnh và tìm kiếm không dấu hoạt động; không có lỗi console trong gallery lúc kiểm tra.
- P3: khi triển khai thật có thể tinh chỉnh thêm lớp nền trắng ở hero và độ rộng tiêu đề dài theo từng dịch vụ.

## Checklist hoàn tất

- [x] Có ảnh tham chiếu đã chọn và ảnh chụp browser.
- [x] So sánh ảnh nguồn / giao diện trong cùng một ảnh.
- [x] Sửa ảnh chưa tải, màu bản đồ và mốc quy trình rồi chụp lại.
- [x] Đủ 80 URL, 16 kiểu bố cục, không có trang quản trị.
- [x] Mở các bản tổng quan và hai ảnh chi tiết để kiểm tra trực quan.
- [x] Kiểm tra màu nền/CTA, h1, ảnh và tràn ngang của 80 URL.
