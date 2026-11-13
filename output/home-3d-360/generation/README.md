# Chuẩn bị tạo mô hình từ ảnh đã duyệt

Trạng thái: chưa gửi yêu cầu tạo mô hình, chưa dùng credit, chưa có asset mới đạt yêu cầu.

## Đầu vào

Dùng `../reference-poster.png`, ảnh chụp riêng hero từ website hiện tại có cả tủ lạnh và overlay phòng tắm đã duyệt. Không dùng ảnh chụp màn hình chứa trình duyệt, chữ giao diện, khung đỏ hoặc mô hình hình học đã bị từ chối.

`request-template.json` là cấu hình tham khảo Meshy 7.1, xuất GLB có texture/PBR. Trường ảnh cần được thay bằng data URI từ đầu vào sau khi tài khoản được cấu hình. Không có API key trong bộ hồ sơ; chưa gọi API.

Tài liệu: https://docs.meshy.ai/en/api/image-to-3d và https://docs.meshy.ai/en/api/quick-start.

## Phần cần quyền truy cập

Chưa tìm thấy biến MESHY_API_KEY hoặc TRIPO_API_KEY có giá trị trong môi trường và các file env đã kiểm tra; chưa tìm thấy plugin tạo mesh phù hợp được kết nối. Chưa có Blender, bpy hoặc torch trên máy qua lần kiểm tra này.

Cần người dùng cấu hình quyền truy cập công cụ tạo 3D trên máy hoặc cung cấp GLB được dựng chuyên dụng. Không dán khóa API vào chat, không commit khóa vào repository.

## Điều kiện chấp nhận

Mô hình do AI tạo vẫn là ứng viên cần kiểm tra, không mặc định đúng thực tế. Đối chiếu góc ban đầu với ảnh; kiểm tra mái, phòng, thiết bị, tay/chân, tủ lạnh và kết nối đường nước theo `../model-requirements.md`. Xem thêm 90/180/270 độ. Nếu sai cấu tạo, cần chỉnh sửa asset bằng công cụ dựng 3D trước khi tích hợp.

Home và bản 3D thử hiện tại không được thay thế bằng asset chưa kiểm chứng.
