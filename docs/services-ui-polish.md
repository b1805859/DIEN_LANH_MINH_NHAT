# Services UI polish

Trang `/services` giữ nguyên concept, nội dung, dữ liệu dịch vụ và tất cả image assets. Header vẫn dùng component chung với Home; không thêm lại mục Dự án đã được người dùng yêu cầu xoá.

## Các thay đổi

- Container tối đa 1320px, gutter và khoảng cách section theo nhịp của Home: 88px desktop, 72px tablet, 56px mobile.
- Hero H1 48–58px trên desktop; badge, mô tả, hai CTA và trust items có khoảng cách rõ hơn. CTA cùng chiều cao 52px, giữ nguyên action đặt lịch và hotline 0939 370 109.
- Card radius 16px, border/shadow nhẹ; chữ 19px/15px, icon và arrow cùng vị trí, heading/description căn đều. Hover dịch card 3px và arrow 3px; không zoom hay phủ màu ảnh.
- Grid dịch vụ: 4 cột từ 1200px, 2 cột ở tablet, 1 cột từ 600px trở xuống. Các card cùng chiều cao; không cắt nội dung bằng ellipsis.
- Trust bar giữ navy, padding dọc 32px, icon circle đồng nhất, divider nhẹ.
- Quy trình 4 bước giữ nguyên nội dung; 4 cột desktop, 2×2 tablet, vertical mobile, có mũi tên theo thứ tự.
- Section đặt lịch cân đối hơn, giữ ảnh kỹ thuật viên; trên tablet đặt ảnh bên phải copy để tránh chồng chữ. Mobile giữ ảnh nền nhẹ và làm mềm mép dưới.
- Form hiện có được polish bằng token/rule chỉ trong trang Services: padding 24–32px, radius 16px, input/select 48px và radius 10px, label 14px, khoảng cách field rõ, CTA gradient cùng Home. Không sửa component form, schema, API, field, option hay validation.
- Footer giữ nguyên các nhóm/nội dung, chỉ thêm class scoped cho Services để chỉnh padding, font, hotline và icon. Home và footer các trang khác không nhận các rule này.
- Icon trang trí được đánh dấu aria-hidden; giữ focus ring, error messages và reduced-motion. Bổ sung khoảng trắng tại các line break bị ẩn trên mobile để chữ không dính nhau.

## Khoá ảnh dịch vụ

Không thay src, file, thứ tự, object-fit, object-position hoặc màu ảnh. Tỷ lệ frame desktop 1.49 và mobile 1.3 giữ nguyên. Ở khoảng 761–1199px, frame cũ có chiều cao 136px/138px trong grid 4 cột; CSS tính lại đúng tỷ lệ frame đó khi chuyển sang 2 cột để giữ vùng ảnh nhìn thấy, thay vì crop lại. Source ảnh trong JSX và config dịch vụ không đổi.

`output/services-polish/before-hashes.json` lưu SHA-256 của assets, service config, booking logic và header/navigation trước khi sửa. QA xác nhận tất cả hash không đổi và đối chiếu src, title, object-fit, object-position, tỷ lệ ảnh tại 1440/1024/768/390px với baseline.

## Kiểm tra

- Production build + TypeScript: thành công, 106 static pages.
- QA: 19 kiểm tra đạt, 0 lỗi; 11 viewport 320–1920px, không tràn ngang, card đều, CTA/input cùng chiều cao, tablet copy không đè ảnh kỹ thuật viên.
- Kiểm tra active menu, menu mobile, anchor đặt lịch, service links, focus/error state và success/error form. Booking POST được intercept để mô phỏng, không gửi yêu cầu thật.
- Kiểm tra 5 trang liên quan dùng header/form/footer chung; không có uncaught runtime error.
- Xem lại ảnh chụp desktop, tablet và mobile, gồm riêng section đặt lịch.

Script: `node apps/web/scripts/services-polish-qa.mjs`. Kết quả và ảnh chụp: `output/services-polish/qa-results.json`, `services-*.png`; baseline/source trước khi sửa ở thư mục `before/`.

Preview hiện tại: http://127.0.0.1:3001/services. Không thêm dependency hoặc deploy lên production.
