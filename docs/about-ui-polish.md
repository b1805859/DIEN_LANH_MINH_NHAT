# About UI polish

Trang `/about` giữ nhận diện, ảnh và concept hiện tại, đồng thời mở rộng nội dung để giới thiệu thương hiệu và cách phục vụ của Minh Nhật.

## Nội dung và bố cục

- Giữ heading hero “Điện Lạnh / Minh Nhật”, thông điệp tận tâm tại Cần Thơ và hai CTA với action cũ. Chỉnh H1 48–58px desktop, spacing, contrast và CTA cùng chiều cao 52px.
- Giới thiệu doanh nghiệp theo layout 40/60 trên desktop, chia thành hai paragraph ngắn và giữ link khu vực phục vụ.
- Giữ ba giá trị Tận tâm / Chu đáo / Phục vụ nhanh; card cùng chiều cao, icon 52px cùng stroke, radius 16px, shadow nhẹ và hover 2px.
- Kết hợp câu chuyện “Đồng hành cùng từng không gian sống” với bốn cam kết trong một section: tư vấn rõ ràng, kiểm tra trước khi xử lý, báo giá minh bạch và bảo hành rõ ràng. Nội dung dựa trên cách phục vụ/FAQ đã có trong project, không thêm lịch sử hay claim xếp hạng.
- Giữ ba ảnh và tiêu đề công việc; mô tả chuyển trọng tâm sang cách kiểm tra, chăm sóc và lắp đặt. Đây là các article giới thiệu cách phục vụ, không tạo thêm danh mục dịch vụ.
- Thêm section đội ngũ bằng text/icon về lắng nghe, trình tự xử lý và bàn giao. Không tạo nhân vật, hồ sơ nhân viên, chứng chỉ hay giải thưởng giả.
- Không hiển thị statistics khi chưa có dữ liệu xác minh. Giữ chú thích ảnh minh hoạ hiện có.
- Flow: hero → giới thiệu/giá trị → câu chuyện/cam kết → cách phục vụ → đội ngũ → trust bar → đặt lịch → footer.

## Reuse và phạm vi

- About dùng lại tokens của Services và container 1320px/gutter của Home, với spacing 88/72/56px theo breakpoint. Style mới trong `company.module.css` được scope vào About.
- `TrustBar` và `BookingSection` hiện có nhận tuỳ chọn `polished`; dùng cùng stylesheet với Services. Ảnh kỹ thuật viên của About vẫn là `/images/areas/technician-booking.webp`.
- `ServicesBookingForm` giữ nguyên component, field, schema, option, API và validation. Form About/Services khớp font, padding, radius, input/select, CTA và focus/error state.
- Footer vẫn dùng `SiteFooter` và nội dung của `AreasFooter`. Kiểu spacing đã polish được đổi tên thành `polishedFooter` để dùng chung cho Services và About; footer Home, Contact và Areas giữ nguyên.
- Header vẫn dùng component chung. Menu 5 mục hiện tại được giữ theo yêu cầu xoá Dự án trước đó; đã gửi câu hỏi làm rõ vì tệp About có liệt kê lại mục này.
- Không thay asset, thêm dependency, chỉnh business logic hoặc tạo component form/header/footer trùng lặp.

## Kiểm tra

- Production build và TypeScript thành công, 106 static pages.
- QA: 20 kiểm tra đạt, 0 lỗi, gồm 11 viewport 320–1920px; không tràn ngang, CTA/card/form phù hợp, đúng thứ tự section và ảnh gốc còn nguyên.
- So sánh form About với Services ở 1440/768/390px, gồm heading, field và CTA.
- Kiểm tra header active, menu mobile, route/anchor, metadata/canonical/JSON-LD, focus và error messages.
- Mô phỏng success/error của form bằng cách intercept booking POST; không gửi booking thật.
- SHA-256 xác nhận ảnh, logic form, Home/Services/Contact/Areas source và header/navigation không đổi. So sánh nội dung, chiều cao trang và form controls của bốn trang liên quan ở 1440/390px với baseline trước khi sửa.
- Lint các file TSX/QA đã sửa đạt; xem lại screenshots desktop, tablet và mobile.

Script: `node apps/web/scripts/about-polish-qa.mjs`. Baseline và kết quả tại `output/about-polish/`; báo cáo `qa-results.json`, ảnh toàn trang `about-*.png`, section đặt lịch `booking-*.png`.

Preview: http://127.0.0.1:3001/about. Chưa deploy lên production.
