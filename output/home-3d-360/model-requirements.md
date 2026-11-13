# Yêu cầu dựng lại mô hình hero Minh Nhật

## Trạng thái

Bản `scene.html` hiện tại chỉ kiểm chứng tương tác. Người dùng đã phản hồi không giống mockup và không đúng thực tế. Không dùng GLB hiện tại làm asset cho home, không coi bản thử là kết quả chuyển đổi hoàn chỉnh.

## Tham chiếu chuẩn

- Ảnh nhà đã duyệt: `apps/web/public/images/home-ice-blue/hd/house-fridge-approved-v4.webp`.
- Phần phòng tắm đã duyệt: `apps/web/public/images/home-ice-blue/hd/bath-connected-v1.webp`, đặt theo overlay hiện có trong `reference-art.tsx`/`home.module.css`.
- Giữ vị trí camera ban đầu, tỷ lệ nhà, chiều sâu phòng, bố cục hai tầng/bốn khu và phong cách vật liệu của ảnh. Không tự thay bằng nhà mái mở hoặc nhân vật hoạt hình.

## Các lỗi cần thay thế trong GLB thử

1. Mái bị cắt và khung nhà trống: dựng lại mái đầy đủ như tham chiếu; bố trí camera và mặt cắt phòng để thấy nội thất, không bỏ mái để khắc phục việc che khuất.
2. Nội thất, tường ngăn và chiều sâu phòng sai tỷ lệ: dựng theo vị trí và tỷ lệ tương đối trong ảnh chuẩn; kiểm tra trước ở góc nhìn hero rồi mới kiểm tra các góc khác.
3. Máy lạnh: vỏ, dàn trao đổi nhiệt, nắp mở và cánh đảo gió phải có cấu tạo hợp lý; thang có đủ chân, bậc và vị trí đứng vững; hai tay cầm dụng cụ đúng thao tác.
4. Máy giặt: thân, cửa trước, gioăng, lồng và bảng điều khiển đúng tỷ lệ; kỹ thuật viên tiếp cận đúng vị trí đang kiểm tra.
5. Tủ lạnh: giữ mẫu đã duyệt với ngăn đông trên đóng, cửa ngăn mát dưới mở; bản lề, kệ trong thân và khay cửa không xuyên nhau; không đổi thành hộp trắng có thực phẩm đặt phía ngoài.
6. Máy nước nóng: đường cấp lạnh đi vào máy, đường nóng đi ra bộ trộn; vòi và dây sen lấy nước tại bộ trộn, có kết nối liên tục. Không có vòi/ống lơ lửng hoặc vòi lấy nguồn độc lập với máy.
7. Nhân vật: đúng tỷ lệ cơ thể, khớp tay/chân và tư thế thao tác; đồng phục xanh và nhận diện đúng. Không dùng hình người khối hộp làm thành phẩm.
8. Vật liệu và ánh sáng: tường trắng ấm, kim loại có phản xạ vừa phải, cây có hình lá tự nhiên, vật dụng có bề dày và bóng tiếp xúc. Không dùng màu phẳng thay vật liệu hoàn thiện.

## Phần chưa có dữ liệu tham chiếu

Ảnh đơn không xác định được mặt sau, mặt trái và các phần bị che. Cần thống nhất thiết kế các mặt này hoặc cung cấp thêm tham chiếu trước khi coi mô hình 360° là chính xác. Không mô tả các mặt tự dựng là khôi phục từ ảnh.

## Tiêu chí nhận asset

- Kiểm tra hình render góc hero cạnh ảnh chuẩn ở cùng kích thước trước khi tích hợp.
- Kiểm tra thêm 90°, 180°, 270°: không vật thể xuyên nhau, không mặt rỗng, không kết nối đường nước sai, không người/dụng cụ sai tư thế.
- Bàn giao GLB cùng texture; kiểm tra lại trên mobile và desktop sau khi tối ưu hình học/texture, tránh giảm chất lượng trước khi duyệt hình.
- Tích hợp viewer sau khi asset đạt yêu cầu. Giữ ảnh hero hiện tại làm poster, tải 3D khi người dùng chọn; giữ nguyên khu vực, footer, Zalo và AI.

## Giới hạn công cụ của phiên làm việc

Hiện chưa có mô hình 3D chi tiết phù hợp hoặc công cụ chuyên dựng 3D từ ảnh được kết nối. Dựng hình học bằng mã hiện tại kiểm chứng được xoay 360°, nhưng chưa đáp ứng độ chân thực và độ giống ảnh mà người dùng yêu cầu. Cần asset 3D được dựng/chỉnh sửa chuyên dụng để hoàn tất phần hình ảnh; không thay thế bằng một lần dựng khối đơn giản khác.
