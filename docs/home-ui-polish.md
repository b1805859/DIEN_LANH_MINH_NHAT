# Hoàn thiện UI/UX Home

Giữ nhận diện navy / blue / cyan, ảnh và thứ tự các section chính. Header dùng chung có đủ sáu mục, gồm Dự án tại `/#hinh-anh`.

## Các thay đổi

- Hero: thêm khoảng thở, headline 48–58px trên desktop, overlay tối để tăng khả năng đọc. Mobile đặt phần chữ trước ảnh.
- USP: glass container, radius 16px, icon đồng đều, divider nhẹ; mobile 2 × 2.
- Dịch vụ: năm card cùng chiều cao trên desktop; heading cùng baseline, description tối đa hai dòng; tablet dùng grid, mobile một cột. Hover nâng 3px và zoom ảnh 1.03.
- Vì sao chọn: ảnh phòng khách bên trái, nội dung ở giữa, video bên phải; tablet hai cột và mobile một cột. Ảnh phòng khách chỉ sử dụng phần bên trái của artwork gốc, tránh lặp ảnh kỹ thuật viên. Play button nằm chính giữa, caption nằm trong khung video.
- Quy trình: khoảng cách rộng hơn, overlay tối, mobile thành timeline dọc.
- Cam kết: ba nội dung lấy từ cam kết hiện có. Thống kê và review có cấu hình riêng, chỉ công bố sau khi xác nhận.
- Gallery: ratio 4:3, radius 16px, điều khiển dễ nhìn. Chú thích rõ ảnh minh hoạ vì tài sản hiện có được tạo từ mockup, không phải ảnh chứng thực công trình.
- CTA cuối: gọi hotline từ cấu hình và đặt lịch sửa chữa; mobile xếp nút dọc.
- Footer: font và line-height lớn hơn, hotline nổi bật, social icon trong cùng khung tròn.

## Quy tắc trình bày

Container tối đa 1320px. Section spacing desktop 88px, tablet 72px, mobile 56px. Body 15–17px, H2 30–38px, card heading 18–20px. Chỉ dùng micro-interaction; tôn trọng reduced motion.

CTA Home dùng gradient xanh đậm để chữ trắng có contrast trên 4.5:1 ở cả hai đầu gradient. Ảnh dưới fold tải lazy với `sizes` theo breakpoint; video dùng `preload="none"`. Hero giữ asset WebP hiện có với tải ưu tiên.

## Dữ liệu tạo niềm tin

`apps/web/components/home-reference/data.ts` chứa `homeTrust`:

- `statisticsVerified: false`: các giá trị 5+, 3000+, 4.9/5, 30 phút là giá trị dự thảo và chưa được công bố trong strip thống kê.
- Chỉ chuyển cờ sang `true` sau khi xác nhận số liệu.
- `reviews` mặc định rỗng. Chỉ nhập đánh giá có thật; mỗi bản ghi phải có `verified: true` mới được hiển thị. Tối đa ba review.

Preview local: http://127.0.0.1:3001/

## Kết quả hoàn thiện

- Bản build production và TypeScript hoàn thành.
- 14 nhóm kiểm tra trình duyệt và 3 lượt đối chiếu chữ mobile cuối cùng đều đạt, không có lỗi chưa xử lý.
- Home kiểm tra ở 1920, 1440, 1280, 1024, 768, 600, 390 và 320px.
- Đã xem lại ảnh desktop, tablet và mobile; ảnh/video ở phần Vì sao chọn không còn chồng nhau.
- Ảnh dưới fold dùng tải lazy; video không tải trước. Tổng resource ghi nhận khi tải Home khoảng 1.1MB ở desktop, 0.84MB ở mobile trong môi trường local. Đây không phải kết quả Core Web Vitals trên mạng thực tế.
- Kết quả chi tiết và ảnh chụp nằm trong `output/home-polish/`.
