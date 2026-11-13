# Hoạt cảnh nhân viên 2D — v2, 04/11/2026

Xem http://localhost:3011/ . Chỉ sửa bản thử riêng; chưa thay source home, khu vực, footer, Zalo/AI và chưa deploy.

## Thay đổi theo phản hồi

- Máy giặt: mở bảng điều khiển phía trên mặt trước để lộ bo mạch, tay cầm đầu dò hướng vào bo và tay còn lại cầm đồng hồ đo. Không còn soi vào lồng giặt.
- Máy nước nóng: mở khoang điện phía trước để lộ bộ phận điều khiển và đấu nối; người thợ đưa đầu dò vào khoang này. Không còn soi vòi hoặc đường ống phía dưới.
- Hai vùng bên phải được ghép từ ảnh chỉnh sửa vào ảnh gốc. Hai phòng bên trái được giữ bằng ảnh gốc: đối chiếu RGB vùng x<960 ở độ phân giải 1377×1142 cho 0 pixel thay đổi.
- Bốn tay chuyển động lặp liên tục đồng thời. Không có lịch chờ đến lượt hoặc khoảng nghỉ 12 giây. Nhịp qua lại riêng 2–2,8 giây nhằm giữ cử động nhẹ, không đồng bộ máy móc.
- Giữ nút dừng, ảnh tĩnh, reduced motion và tạm dừng khi ẩn tab/ra khỏi viewport.

Đây là hoạt cảnh cutout với chuyển động tay nhỏ, không phải mô phỏng thao tác kỹ thuật đầy đủ hoặc hoạt hình mọi khớp.

## Asset và nguồn

Dùng built-in image_gen cho cả hai lượt chỉnh sửa. Prompt nguyên văn ở `prompts-v2.txt`.

- `assets/electronics-edit-v2.png`: bản edit từ `exec-420f504b-c2cc-4ff4-8d18-39371c9734bb.png`.
- `assets/reference-v2.png`: ảnh tham chiếu dùng cho rig, chụp từ `reference-v2.html` ghép hai vùng bên phải; bên trái dùng `assets/reference.png` gốc.
- `assets/clean-plate-v2.png`: nền phụ từ `exec-1fda7358-d0ab-4b6d-b652-e7e207acab80.png`, chỉ lộ qua mask tay để tránh bóng đôi.
- `index.html`: bản đang xem; `index-v1.html`: bản cũ để đối chiếu.
- `detail-v2.png`, `preview-desktop.png`, `preview-mobile.png`: ảnh QA.

PNG đang phục vụ đối chiếu, chưa tối ưu tải cho production. Không dùng Meshy hoặc tiêu thêm credit Meshy trong lượt này.

## Kiểm tra

`node output/worker-motion/verify.mjs` PASS trên Chromium:

- 360, 390, 768, 1440, 1920 px không tràn ngang, không lỗi JavaScript.
- Cả bốn tay đều đổi transform trong ba khoảng 0→0.2, 4→4.2 và 8→8.2 giây: không còn khoảng chờ dài của bản trước.
- So sánh khung t=0 và t=0.6 ở độ rộng 1377 px: 7464 pixel thay đổi trong các vùng tay, 0 pixel thay đổi ngoài các vùng đó. Đây là kiểm tra sự ổn định giữa các khung hoạt cảnh.
- Dừng đóng băng tư thế; xem ảnh tĩnh hiện ảnh v2; reduced motion hiển thị ảnh v2 tĩnh và không phát hoạt cảnh.

Kết quả ở `checks.json`/`checks.log`. Chưa kiểm tra thiết bị thật.

Chạy lại:

```sh
python3 -m http.server 3011 --bind 127.0.0.1 --directory output/worker-motion
```
