# Giới thiệu và Liên hệ — Điện Lạnh Minh Nhật

Hai trang được cập nhật theo hệ thống giao diện của trang Khu vực: navy, xanh dương, cyan, typography, nút hành động, card, header và footer dùng chung.

## Xem trước

- Giới thiệu: http://127.0.0.1:3001/about
- Liên hệ: http://127.0.0.1:3001/contact

Bản xem trước chạy từ production build trên cổng 3001. Cổng 3000 có các tiến trình sẵn có nên không được dùng để xác nhận bản mới.

## Files modified

- `apps/web/app/about/page.tsx`: hero, nội dung giới thiệu, giá trị phục vụ, hình ảnh dịch vụ và phần đặt lịch.
- `apps/web/app/contact/page.tsx`: hero, kênh liên hệ, form đặt lịch bốn trường, khu vực phục vụ và Google Maps.
- `apps/web/components/areas-reference/chrome.tsx`: thêm lựa chọn menu đang hoạt động cho Giới thiệu và Liên hệ.
- `apps/web/components/layout/site-chrome.tsx`: sử dụng header/footer của hệ thống giao diện Khu vực cho hai route mới.

## Files created

- `apps/web/components/company-reference/company.module.css`: style riêng cho bố cục Giới thiệu và Liên hệ, hỗ trợ desktop/tablet/mobile.
- `apps/web/scripts/company-reference-qa.mjs`: kiểm tra giao diện và tương tác trên trình duyệt.

Tái sử dụng `AreasHeader`, `AreasFooter`, `TrustBar`, `BookingSection` và `ServicesBookingForm`. Form giữ cơ chế kiểm tra dữ liệu và gửi API sẵn có.

## Generated assets

Không tạo thêm ảnh trong lần cập nhật này. Sử dụng các asset local đã có trong `home-reference`, `services-reference` và `areas`. Gallery Giới thiệu có chú thích hình ảnh minh họa.

## Visual QA

- Đã kiểm tra ảnh chụp hai trang ở chiều rộng 320, 390, 768, 880 và 1440 px.
- Ảnh desktop: [Giới thiệu](about-880.png), [Liên hệ](contact-880.png).
- Ảnh mobile: [Giới thiệu](about-390.png), [Liên hệ](contact-390.png).
- Không có mockup riêng của Giới thiệu hoặc Liên hệ để so sánh pixel. Giao diện được mở rộng từ phong cách trang Khu vực theo yêu cầu.
- Ảnh Contact được chụp với chiều cao viewport bằng toàn trang để Chrome vẽ đầy đủ iframe Google Maps. Kiểm tra responsive và tràn ngang thực hiện trước đó tại chiều cao viewport thông thường; chiều cao trang được kiểm tra lại sau khi mở rộng.

## Verification

- Production build và TypeScript: đạt.
- ESLint cho các file TSX/JS thay đổi: đạt.
- Kiểm tra trình duyệt: 20/20 đạt; chi tiết tại [qa-results.md](qa-results.md) và [qa-results.json](qa-results.json).
- Kiểm tra menu active, menu mobile, tìm khu vực, đóng dialog bằng Escape và khôi phục focus.
- Kiểm tra form thiếu dữ liệu, số điện thoại sai, trạng thái đang gửi, thành công, lỗi và gửi lại; bốn request thử nghiệm được chặn và mô phỏng phản hồi, không tạo lịch thật. Việc tiếp nhận lịch trên backend thực tế không thuộc lần kiểm tra này.
- Đã tải bản đồ và xác nhận URL điện thoại, email, Zalo, Facebook, Google Maps.
- Không ghi nhận lỗi JavaScript hoặc console của ứng dụng.
- Home, Dịch vụ và Khu vực giữ nguyên hình học, computed styles và nguồn ảnh so với baseline. 113 file/asset gốc được đối chiếu hash; chỉ hai file tích hợp header/chrome có thay đổi dự kiến.
- Screenshot Home trùng baseline; Dịch vụ và Khu vực có chênh lệch raster nhỏ dù hình học, style và nguồn ảnh trùng. Không khẳng định cả ba screenshot trùng pixel.

Chạy lại kiểm tra khi production preview hoạt động:

```sh
node apps/web/scripts/company-reference-qa.mjs
```
