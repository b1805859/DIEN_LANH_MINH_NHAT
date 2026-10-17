# Review carousel trang home — 14/10/2026

Phạm vi: mã hiện tại trong workspace và trang local http://localhost:3000. Đã xem cả ba slide ở 320, 390, 768, 800, 1024 và 1440px. Đây là review và kế hoạch đề xuất; chưa sửa mã ứng dụng. Các nhận xét thẩm mỹ dưới đây là đánh giá thiết kế, không phải kết quả đo chuyển đổi khách hàng.

## Các điểm cần cải thiện

1. **P1 — Carousel bị cắt bên phải ở tablet.** Ở viewport 1024px, hero rộng khoảng 1083px, mép phải tại 1101px; dịch vụ cuối vượt tới 1067px. `overflow-x: hidden` ở trang che phần tràn, khiến phép kiểm tra `scrollWidth > innerWidth` báo không tràn dù nội dung bị cắt. Nguyên nhân nằm ở kết hợp `aspect-ratio: 1.934` trong `redesign.css` và `min-height: 560px` trong `hero.module.css`. Cần ràng buộc chiều rộng theo container và tách chiều cao khỏi tỉ lệ tại breakpoint này.

2. **P1 — Thiếu phương án thay thế khi ảnh đầu tiên lỗi.** Chặn request album bằng trình duyệt cho thấy slide đầu có `naturalWidth: 0`, active vẫn là 0 và autoplay dừng. `imageFailed` chỉ đánh dấu lỗi và đặt `manualPaused`, không chuyển sang slide có ảnh tốt hoặc ảnh thay thế. Cần fallback cho ảnh đầu, bỏ qua slide lỗi và xác định cách phục hồi sau lỗi mạng tạm thời. Hiện trạng dừng vĩnh viễn sau lỗi cũng cần được xử lý vì hook không có đường đặt `manualPaused` trở lại false.

3. **P2 — Chú thích và chỉ báo chưa phản ánh slide đang hiển thị.** Khi cố ý làm chậm ảnh slide 3, `active=0`, `selected=2`, `aria-busy=true`, nhưng caption đã là “03 / 03 Dịch vụ chuyên nghiệp” trong khi heading vẫn là “Điện lạnh tận nơi tại Cần Thơ”. Cần dùng `active` cho caption và trạng thái slide hiện tại; thể hiện `selected` như đích đang chờ tải nếu cần.

4. **P2 — Mobile cao và chữ nhỏ.** Hero cao 885px ở 320/390px, 900px ở 768/800px. Mô tả chỉ 11px ở điện thoại; vùng dịch vụ nhanh và nội dung cam kết còn nhỏ hơn. Ảnh, chữ, caption và điều khiển tạo nhiều tầng dọc. Cần bố cục theo nội dung, tăng cỡ chữ mô tả khoảng 13–14px, giảm khoảng trống và xem lại mật độ tám mục dịch vụ nhanh. Không chỉ giảm chiều cao cố định vì sẽ dễ gây chồng nội dung.

5. **P2 — Nút liên hệ thay đổi theo slide.** Slide 1 chỉ có “Đặt lịch ngay”; slide 2 có “Gọi ngay” và “Chat Zalo”; slide 3 chỉ có “Khám phá dịch vụ”. Khách đang tìm cách liên hệ phải phụ thuộc slide hiện tại. Đề xuất giữ một nhóm hành động liên hệ ổn định, ưu tiên Gọi ngay/Zalo; liên kết đặt lịch hoặc xem dịch vụ là hành động bổ sung. Chốt số lượng nút theo không gian mobile để tránh làm hero dày hơn.

6. **P2 — H1 thay đổi theo trạng thái carousel.** `Heading = active ? 'h1' : 'h2'` khiến tiêu đề chính của trang luân phiên giữa ba thông điệp. Đề xuất một H1 ổn định mô tả dịch vụ và khu vực, các tiêu đề slide dùng cấp heading phù hợp. Đây là cải thiện cấu trúc nội dung; chưa có bằng chứng tác động tới thứ hạng tìm kiếm.

7. **P2 — Kiểm tra cũ không còn khớp mã hiện tại.** `hero-carousel-checks.mjs` và `hero-media-checks.mjs` vẫn giả định thứ tự family → services → local, trong khi hiện tại là local → family → services. Kết quả JSON cũ còn nhắc nút pause và dialog giới thiệu đã không xuất hiện trong component hiện tại. Cần cập nhật test và tạo lại kết quả trên bản mới; thêm phép kiểm tra tọa độ thực tế của khung và các phần tử con để bắt lỗi bị cắt dù trang giấu overflow.

8. **P3 — CSS và trạng thái chuyển động cần gọn hơn.** Hero chịu nhiều lớp override trong `redesign.css` lẫn module riêng; chiều cao mobile bị khai báo lại nhiều lần. Khoảng chuyển slide 7 giây được khai báo riêng ở TypeScript và CSS. `motionRunning` không xét hover/focus như `running`, nên hiệu ứng luồng khí vẫn chạy khi tự chuyển slide đã dừng. Cần gom quy tắc hero, dùng chung thời lượng và xác định hành vi chuyển động nhất quán. Cân nhắc dừng tự chuyển sau thao tác chủ động của khách trên mobile.

## Kế hoạch thực hiện

### Bước 1 — Sửa lỗi hiển thị và tải ảnh

- Ràng buộc khung tại dải 801–1100px; kiểm tra thêm 801, 834, 1024, 1100 và 1101px.
- Bổ sung fallback cho ảnh đầu và phục hồi khi ảnh lỗi; không để lỗi tải ảnh khóa tự chuyển vĩnh viễn.
- Đồng bộ caption, chỉ báo và thông báo trợ năng với slide đã hiển thị; tách trạng thái chờ tải.
- Nghiệm thu: không có phần nội dung chính hoặc dịch vụ nhanh bị cắt; ảnh lỗi vẫn có nội dung/ảnh thay thế dùng được; caption luôn khớp ảnh và tiêu đề.

### Bước 2 — Điều chỉnh trải nghiệm mobile và hành động liên hệ

- Sắp lại khối chữ, nhóm nút, ảnh và điều khiển theo nội dung thay vì nhiều tọa độ cố định.
- Tăng cỡ chữ, giảm khoảng trống; giữ các chủ thể quan trọng trong ba ảnh. Album desktop đang kể được bốn tình huống và nên được giữ nếu bố cục phù hợp.
- Giữ hành động liên hệ ổn định giữa các slide; giảm độ nổi của caption để ưu tiên thông điệp và nút chính.
- Nghiệm thu: 320/375/390/430/768px đọc dễ, không chồng nội dung; cùng một hành động liên hệ chính luôn sẵn sàng trên cả ba slide.

### Bước 3 — Chuẩn hóa cấu trúc và trạng thái

- Một H1 ổn định cho home; giữ `inert` và `aria-hidden` cho slide không hoạt động.
- Gom CSS của carousel, dùng chung thời lượng; thống nhất hover/focus/reduced-motion và hiệu ứng phụ.
- Nghiệm thu: bàn phím, vuốt, chế độ giảm chuyển động và dừng ngoài viewport hoạt động đúng; không phát sinh nhảy bố cục khi chuyển slide.

### Bước 4 — Kiểm chứng và gửi bản trước/sau

- Cập nhật test theo ID slide, hạn chế phụ thuộc thứ tự hoặc chuỗi tên nút cố định.
- Kiểm tra ảnh đầu lỗi, ảnh kế tiếp lỗi/chậm, bấm chuyển liên tục, autoplay, hover/focus và thao tác chạm.
- Chạy lint/build phù hợp sau thay đổi; chụp lại cả ba slide desktop, tablet và mobile; gửi bản so sánh trước/sau và kết quả test mới.

## Bằng chứng đã lưu

- `1024-page.png`: phần bên phải của carousel và dịch vụ cuối bị cắt.
- `1440-slide1.png`: bố cục desktop hiện tại.
- `390-slide1.png`, `390-slide2.png`, `390-slide3.png`: ba slide mobile.
- `pending-image.png`: chú thích đổi trước nội dung khi ảnh tải chậm.
- `layout.json`: tọa độ, kích thước, cỡ chữ và nút hành động của ba slide tại sáu chiều rộng.
