# Ứng Dụng Quản Trị Điện Lạnh Minh Nhật (iOS - Tối Ưu iPhone 13)

Ứng dụng Native iOS viết bằng **SwiftUI** (hỗ trợ iOS 16, 17, 18) dành riêng cho quản trị viên và kỹ thuật viên **Điện Lạnh Minh Nhật**, được thiết kế đo ni đóng giày cho màn hình **iPhone 13** (6.1 inch Super Retina XDR, Notch, Safe Area).

---

## 🌟 Tính Năng Nổi Bật Trên iPhone 13

1. **Đăng nhập siêu tốc bằng Face ID**:
   - Tích hợp chuẩn `LocalAuthentication` của Apple.
   - Khi đăng nhập lần đầu, bạn có thể bật "Lưu đăng nhập bằng Face ID".
   - Từ lần mở app sau, chỉ cần liếc nhìn màn hình iPhone 13 để vào ngay bảng quản trị, không cần gõ mật khẩu trên bàn phím cảm ứng.
2. **Lưu trữ bảo mật Apple Keychain**:
   - `accessToken` và `refreshToken` được mã hoá trong phân vùng bảo mật an toàn (`kSecClassGenericPassword`), tự động duy trì phiên đăng nhập.
3. **Cầu nối CMS Toàn diện (WKWebView Bridge)**:
   - Tự động tiêm (inject) Token xác thực vào `localStorage` ngay khi tải trang (`localStorage.setItem('accessToken', ...)`).
   - Truy cập đầy đủ các module: Bảng điều khiển, Quản lý lịch hẹn, Quản lý dịch vụ, Cẩm nang, Phân quyền, Lịch sử...
   - Tích hợp cử chỉ kéo xuống để tải lại trang (Pull-to-Refresh) chuẩn iOS.
4. **Bảng Lịch hẹn Nhanh (Native Quick View)**:
   - Tra cứu trực tiếp danh sách lịch hẹn khách hàng qua API tốc độ cao.
   - Nút gọi điện 1-chạm (`tel:`) kết nối ngay với khách hàng bằng ứng dụng Gọi điện thoại của iPhone.
5. **Chuyển đổi máy chủ linh hoạt (Server Switcher)**:
   - Chạy trực tiếp với máy chủ thật: `https://dienlanhminhnhat.vn`
   - Hoặc kết nối máy chủ phát triển nội bộ trong cùng mạng Wi-Fi: `http://192.168.1.xxx:3000`

---

## 🛠 Cấu Trúc Thư Mục

```
apps/ios-admin/
├── MinhNhatAdmin.xcodeproj/       # File dự án Xcode
│   └── project.pbxproj
├── MinhNhatAdmin/
│   ├── App/
│   │   ├── MinhNhatAdminApp.swift     # Entry point (@main)
│   │   └── AppEnvironment.swift       # Quản lý trạng thái xác thực & Server URL
│   ├── Services/
│   │   ├── APIService.swift           # Gọi API /api/auth/login, /api/auth/refresh
│   │   ├── KeychainManager.swift      # Quản lý Keychain iOS
│   │   └── BiometricAuthService.swift # Tích hợp Face ID
│   ├── Models/
│   │   └── AuthModels.swift           # Dữ liệu Token & Lịch hẹn
│   ├── Components/
│   │   ├── AuroraGlassCard.swift      # Hiệu ứng kính mờ Aurora Glassmorphism
│   │   └── BrandLogoView.swift        # Logo Điện Lạnh Minh Nhật
│   ├── Views/
│   │   ├── LoginView.swift            # Màn hình đăng nhập Native
│   │   ├── AdminWebView.swift         # Web view nhúng bảo mật
│   │   ├── QuickBookingsView.swift    # Danh sách lịch hẹn nhanh & gọi điện
│   │   ├── SettingsSheetView.swift    # Tuỳ chọn URL & Face ID
│   │   └── MainAdminContainerView.swift # Giao diện chính đa tab
│   ├── Assets.xcassets/               # App Icon (1024x1024) và màu sắc
│   └── Info.plist                     # Quyền Face ID & Cấu hình mạng
```

---

## 🚀 Hướng Dẫn Cài Đặt Lên iPhone 13

### Cách 1: Chạy trực tiếp từ Xcode lên iPhone 13 (Khuyên dùng)
1. Mở dự án trong Xcode:
   ```bash
   open apps/ios-admin/MinhNhatAdmin.xcodeproj
   ```
2. Cắm cáp kết nối iPhone 13 với máy Mac (hoặc kết nối qua Wi-Fi sau khi ghép nối).
3. Trong Xcode:
   - Tại mục **Target** `MinhNhatAdmin` ➔ tab **Signing & Capabilities**:
     - Chọn **Team**: Chọn Apple ID cá nhân của bạn (Miễn phí, không bắt buộc tài khoản trả phí \$99).
     - Bundle Identifier: Có thể để nguyên `vn.dienlanhminhnhat.admin` hoặc đổi tên miền riêng nếu trùng lặp.
   - Tại thanh công cụ trên cùng của Xcode:
     - Chọn thiết bị chạy là chiếc **iPhone 13** của bạn.
   - Nhấn nút **Play (Run)** hoặc phím tắt `Cmd + R`.
4. Trên iPhone 13:
   - Lần đầu cài đặt, vào **Cài đặt (Settings)** ➔ **Cài đặt chung (General)** ➔ **Quản lý VPN & Thiết bị (VPN & Device Management)**.
   - Chọn nhà phát triển Apple ID của bạn và chọn **Tin cậy (Trust)**.
   - Mở ứng dụng **Minh Nhật Admin** trên màn hình chính và bắt đầu sử dụng!

---

### Cách 2: Sử dụng Web App PWA (Không cần máy tính, cài trực tiếp trong 10 giây)
Nếu bạn đang cầm chiếc iPhone 13 và muốn dùng ngay mà không cần cắm vào máy Mac:
1. Mở trình duyệt **Safari** trên iPhone 13.
2. Truy cập vào trang quản trị:
   `https://dienlanhminhnhat.vn/admin/login` (hoặc địa chỉ IP máy chủ nội bộ).
3. Nhấn vào nút **Chia sẻ (Share)** ở thanh điều hướng dưới cùng của Safari (biểu tượng hình vuông có mũi tên chỉ lên).
4. Cuộn xuống và chọn **"Thêm vào Màn hình chính" (Add to Home Screen)**.
5. Nhấn **Thêm (Add)** ở góc trên bên phải.
6. Biểu tượng **Minh Nhật Admin** sẽ xuất hiện ngay trên màn hình chính iPhone 13 của bạn. Khi mở ra, ứng dụng sẽ chạy độc lập toàn màn hình (Standalone) không thanh địa chỉ Safari, lưu phiên đăng nhập và hỗ trợ tự động điền mật khẩu Face ID!
