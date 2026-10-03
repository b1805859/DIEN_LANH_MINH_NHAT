# Chuẩn giao diện website theo Home

Tài liệu này mô tả lượt chuẩn hóa trước khi polish Home. Phần hoàn thiện Home mới nhất được ghi ở [home-ui-polish.md](home-ui-polish.md); báo cáo tương ứng nằm trong `output/home-polish/qa-results.json`.

Trang Home hiện tại là nguồn thiết kế. Refactor áp dụng cho các trang công khai; phần quản trị giữ nguyên giao diện và luồng vận hành riêng.

## Nguồn dùng chung

- `apps/web/components/home-reference/home.module.css`: giao diện Home và header/footer gốc.
- `apps/web/components/home-reference/chrome.tsx`: triển khai dùng chung cho header, navigation, tìm kiếm, menu mobile và footer gốc Home.
- `apps/web/components/layout/site-chrome.tsx`: lắp ráp chung cho các route công khai. Các tên header/footer cũ trỏ về triển khai dùng chung.
- `apps/web/components/layout/site-footer.tsx`: dùng style footer Home, giữ nguyên thông tin liên hệ, mô tả và liên kết của từng nhóm trang; chiều cao tự giãn theo nội dung.
- `apps/web/app/public-theme.css`: token Home và quy tắc chung cho các trang nội dung.
- `apps/web/app/mockup.css`: bố cục trang đặt lịch/chi tiết dịch vụ dùng token chung; đã bỏ các phiên bản header/footer và style mockup cũ không còn dùng.
- CSS module của Services, Areas, Company và booking form: giữ bố cục/ảnh riêng, dùng typography, màu sắc, button, input và spacing chung.

## Quy tắc rút từ Home

| Thành phần                      | Chuẩn                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------- |
| Font                            | HomeRoboto, Arial, sans-serif; font Roboto local hiện có                              |
| Text chính / phụ                | `#0a2053` / `#213752`                                                                 |
| Primary / cyan / navy           | `#007bff` / `#48c9f4` / `#001c32`                                                     |
| Surface / border / input border | `#f8fcff` / `#b8dced` / `#93c5e0`                                                     |
| Focus                           | Outline 3px `#43cafa`, offset 4px                                                     |
| CTA chính                       | Gradient cyan → blue của Home; radius 30px; cao 40px, desktop lớn 46px                |
| Chữ CTA                         | 12px/600; desktop lớn 14px/600; CTA header giữ kích thước gốc Home                    |
| Card / input                    | Radius 11px / 8px; shadow nhẹ của Home                                                |
| H1 nội dung                     | 36px; từ 1200px scale đến 50px; mobile clamp 26–36px                                  |
| H2 / H3                         | 24px / 16px; desktop lớn 28px / 19px; mobile 26px / 15px                              |
| Body / small                    | 14px (desktop lớn 15px) / 12px                                                        |
| Gutter nội dung                 | Theo section dịch vụ Home: trái 4.395%, phải 3.61%; mobile 20px, màn hình ≤360px 16px |
| Khoảng cách chung               | Section 24px; heading/nội dung 16px; card 12px                                        |
| Breakpoint chính                | 760px, 960px, 1200px theo Home                                                        |
| Form                            | Chữ input 16px, chiều cao 46px; textarea tăng chiều cao theo nội dung                 |
| Motion                          | Transition 180ms của Home; tôn trọng reduced motion                                   |

Home giữ nguyên bố cục ảnh, các kích thước đặc thù và nhịp section gốc. Token cho trang nội dung sử dụng các giá trị tương ứng có sẵn trong Home; không ép các trang có cấu trúc nội dung giống nhau.

Header giữ logo, chiều cao, menu, CTA, font và breakpoint của Home. Trên các trang con, cùng header được đặt trong luồng tài liệu với lớp nền navy để chữ trắng đọc rõ và không che nội dung. Home giữ header phủ hero, không bổ sung sticky. Active state theo route, bao gồm các route con. Link Dự án trong footer luôn trỏ về cùng section trên Home.

## Nội dung và chức năng được giữ

Không sửa text, heading, ảnh, thứ tự section, metadata, canonical, route, API, backend, giá trị form hay validation. Header dùng menu Home theo yêu cầu. Footer đồng bộ cách trình bày theo Home nhưng giữ nội dung riêng của từng nhóm trang. Các nút liên hệ nổi và điều khiển phiên quản trị trước đây vẫn được giữ ở nhóm route tương ứng.

Sửa component `Reveal` để giữ class/style/ref của phần tử con khi dùng `asChild`. Component dùng `Slot` đã có sẵn trong dự án, tránh mất style card/FAQ và tránh khác markup giữa server/client với nội dung stream. Cấu hình hiệu ứng và nội dung không thay đổi.

## Kiểm tra

- `npm run lint --workspace @minhnhat/web`
- `npm run build:web` (bao gồm TypeScript và static generation)
- `UI_QA_URL=http://localhost:3001 node apps/web/scripts/ui-consistency-qa.mjs`

Script trình duyệt kiểm tra toàn bộ URL công khai thực tế, header/footer chung, active navigation, overflow, metadata, menu/search bằng bàn phím và validation form. Mọi request ghi dữ liệu bị chặn trong QA. Script đối chiếu nội dung source với baseline trước refactor, bỏ qua thuộc tính trình bày.

Kết quả và ảnh desktop/mobile được lưu trong `output/ui-consistency/`. Các file `qa-results.md` và `qa-results.json` ghi chính xác phạm vi và kết quả lượt kiểm tra mới nhất.
