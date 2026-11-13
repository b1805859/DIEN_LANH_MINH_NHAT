# Ngôi nhà 360° — bản thử riêng

Ngày 03/11/2026. Xem tại http://localhost:3010/scene.html.

Đây là **mô hình 3D dựng lại đơn giản từ ảnh tham chiếu**, không phải chuyển đổi chính xác ảnh thành mô hình hoàn thiện. Bản thử tập trung vào kiểm tra xoay ngang 360°, chuột, cảm ứng và khả năng đưa một ngôi nhà 3D lên web. Không sửa bất kỳ file nguồn nào của ứng dụng, không thay hero, khu vực, footer, Zalo/AI và không deploy.

## Có trong bản thử

- Kiến trúc hai tầng, bốn khu dịch vụ; thiết bị và nhân vật dạng giản lược.
- Mái cắt lớp để quan sát nội thất. Mặt sau và các chi tiết khuất được phác dựng thêm, không có trong ảnh nguồn.
- Kéo chuột/vuốt ngang; khóa góc nghiêng, không zoom để giữ khung hình.
- Nút xoay trái/phải 30°, phím mũi tên 15°, quay về góc ban đầu.
- Tự xoay chỉ khi người dùng bật. Dừng khi thao tác kéo; không chạy render liên tục khi đứng yên; tạm ngưng vòng lặp khi tab bị ẩn hoặc viewer ra khỏi màn hình.
- Ảnh tham chiếu dự phòng khi chưa tải được 3D. Ảnh được chụp từ hero hiện tại trên localhost:3000, không chỉnh sửa nội dung ảnh.
- Xuất GLB: `minh-nhat-house-prototype.glb` — 1,663,656 byte, 22 mesh/22 vật liệu. Đã tải lại bằng GLTFLoader để xác nhận file hợp lệ.

## Chạy

Mở `scene.html` bằng trình duyệt có WebGL, hoặc:

```sh
python3 -m http.server 3010 --bind 127.0.0.1 --directory output/home-3d-360
```

HTML dùng importmap ghim Three.js 0.180.0 từ jsDelivr, cần mạng khi tải thư viện lần đầu. Nếu tích hợp website thật, nên bundle thư viện trong ứng dụng và chỉ tải viewer khi người dùng chọn xem 3D.

## Kết quả kiểm tra

`node output/home-3d-360/verify.mjs` — PASS trên Chromium/SwiftShader:

- 5 viewport 360, 390, 768, 1440, 1920 px, không tràn ngang, canvas có kích thước phù hợp.
- Ảnh tĩnh kiểm chứng 0°, 90°, 180°, 270° qua hàm `renderAt`/query `?t=N` (N giây tương ứng N×45°).
- Kéo chuột thay đổi góc; cảm ứng ngang bằng CDP trên viewport điện thoại thay đổi góc.
- 12 lần nút xoay 30° đủ một vòng; bàn phím hoạt động.
- Không render thêm khi đứng yên; có render khi bật tự xoay; dừng render sau khi tắt.
- Tôn trọng reduced motion bằng mặc định không tự xoay.
- Xuất GLB, kiểm tra header/độ dài và mở lại bằng GLTFLoader thành công.
- Sau dispose: geometries=0, textures=0.
- Chặn CDN để kiểm tra ảnh dự phòng: PASS.
- Không lỗi JavaScript trong phiên kiểm tra bình thường.

Gộp hình học theo vật liệu giúp giảm từ 520 xuống **23 draw call** gồm cả nền, khoảng **51.562 tam giác** ở bản thử. Đây không phải kết quả benchmark FPS trên thiết bị thật.

## Để đạt chất lượng ảnh hiện tại

Cần mô hình GLB chi tiết hơn: thiết bị đúng cấu tạo, hình người/tư thế sửa chữa, vật liệu, ánh sáng và bố cục các mặt. Một ảnh đơn không xác định được toàn bộ hình học ở phía sau. Nên hoàn thiện mô hình theo nhiều góc tham chiếu, bake ánh sáng/texture rồi tối ưu trước khi đưa vào home. Bản thử này chưa dùng để thay ảnh hero sản phẩm.

Nếu đưa lên home: giữ ảnh hiện tại làm poster mặc định, tải mô hình khi người dùng chọn “Xem 360°”, giữ kích thước khung cố định để tránh nhảy bố cục, giữ nội dung và CTA bằng HTML. Không tự xoay liên tục khi vừa tải trang. Khu vực, footer, Zalo và AI giữ nguyên.

Tài liệu API đã đối chiếu: [OrbitControls](https://threejs.org/docs/pages/OrbitControls.html), [GLTFExporter](https://threejs.org/docs/pages/GLTFExporter.html).
