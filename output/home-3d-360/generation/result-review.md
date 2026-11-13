# Kết quả Meshy — 03/11/2026

## Đã thực hiện

- Xác thực API key từ môi trường local; không đưa khóa vào mã nguồn hoặc log. `.env.local` nằm trong gitignore.
- Gửi đúng một tác vụ Image-to-3D: `01a1a240-d38b-7384-9a8e-5f25d5f2efa2`, Meshy 7.1, có texture/PBR và remesh mục tiêu 100.000 polygon.
- Đầu vào: `../reference-poster.png`, ảnh chụp riêng hero đang dùng có cả phần phòng tắm đã sửa.
- API báo SUCCEEDED, progress=100, consumed_credits=30. Không gửi thêm tác vụ tạo mẫu khác.
- Tải `house-meshy.glb`: 20.014.272 byte (khoảng 19,1 MiB). GLB hợp lệ và GLTFLoader mở thành công.
- Trang xem riêng: http://localhost:3010/meshy-review.html. Có kéo xoay ngang 360°, mũi tên, tự xoay và tải GLB; không tự xoay khi vừa mở.
- Mô hình thực tế có 100.352 tam giác, 1 draw call, 3 texture theo renderer.info tại góc chính.

## Đánh giá hình ảnh

Mức độ nhận diện cảnh và vật liệu tốt hơn bản hình học giản lược trước: có ngôi nhà hai tầng, cây, nội thất, tủ lạnh mở, máy giặt, nhân vật và khu máy nước nóng.

**Chưa đạt yêu cầu giống mockup và đúng thực tế để thay hero:**

- Vị trí/tương quan người thợ đứng và máy lạnh bị lệch; thao tác không còn khớp như ảnh chuẩn.
- Một số mép kiến trúc và chi tiết nội thất bị biến dạng; hình học thiết bị/nhân vật chưa đủ chính xác.
- Các đường nước nhỏ và phụ kiện không đủ rõ để xác nhận kết nối vật lý đúng như ảnh phòng tắm đã duyệt.
- Mặt sau do AI suy dựng thành tường đơn giản, không có tham chiếu để xác nhận.
- File khoảng 19,1 MiB chưa được tối ưu để tải mặc định trên home/mobile.

Cần chỉnh sửa mô hình bằng công cụ dựng 3D theo `../model-requirements.md` trước khi coi là asset hoàn thiện. Không thể kết luận rằng một lần tạo tự động đã giải quyết các lỗi cấu tạo.

## Kiểm tra tương tác

Kết quả chi tiết ở `review-checks.json`/`.log`; ảnh 0/90/180/270 độ tại `angle-*.png`, desktop và mobile tại `desktop.png`, `mobile.png`.

Bản xem dùng góc ban đầu nghiêng 36° để quan sát hai mặt; giữ góc nghiêng camera và cho xoay ngang. Kiểm tra Chromium/SwiftShader, không thay thế thử nghiệm thiết bị thật.

## Phạm vi

Không thay đổi source home, khu vực, footer, Zalo/AI. Không deploy. Bản GLB gốc được giữ để đối chiếu, chưa được đưa vào tài nguyên public của ứng dụng Next.js.

Tài liệu đã đối chiếu: [Image to 3D](https://docs.meshy.ai/en/api/image-to-3d), [Balance API](https://docs.meshy.ai/en/api/balance).
