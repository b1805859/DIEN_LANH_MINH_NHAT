import SwiftUI

public struct SettingsSheetView: View {
    @EnvironmentObject private var env: AppEnvironment
    @Environment(\.dismiss) private var dismiss
    
    @State private var serverInput: String = ""
    
    public var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 11/255, green: 23/255, blue: 39/255)
                    .ignoresSafeArea()
                
                ScrollView {
                    VStack(alignment: .leading, spacing: 24) {
                        // Server URL configuration
                        VStack(alignment: .leading, spacing: 10) {
                            Text("ĐỊA CHỈ MÁY CHỦ (SERVER URL)")
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(Color(red: 148/255, green: 163/255, blue: 184/255))
                                .tracking(1)
                            
                            HStack {
                                TextField("https://dienlanhminhnhat.vn", text: $serverInput)
                                    .keyboardType(.URL)
                                    .autocapitalization(.none)
                                    .disableAutocorrection(true)
                                    .foregroundColor(.white)
                                    .padding(12)
                            }
                            .background(Color(red: 15/255, green: 23/255, blue: 42/255))
                            .cornerRadius(10)
                            .overlay(
                                RoundedRectangle(cornerRadius: 10)
                                    .stroke(Color(red: 56/255, green: 189/255, blue: 248/255).opacity(0.3), lineWidth: 1)
                            )
                            
                            // Server presets
                            Text("Chọn nhanh môi trường:")
                                .font(.system(size: 12))
                                .foregroundColor(Color(red: 148/255, green: 163/255, blue: 184/255))
                                .padding(.top, 4)
                            
                            HStack(spacing: 8) {
                                Button("Website Chính Thức") {
                                    serverInput = "https://dienlanhminhnhat.vn"
                                }
                                .buttonStyle(PresetButtonStyle())
                                
                                Button("Local Wi-Fi (Dev)") {
                                    serverInput = "http://192.168.1.15:3000"
                                }
                                .buttonStyle(PresetButtonStyle())
                            }
                        }
                        .padding(18)
                        .auroraGlass(cornerRadius: 16)
                        
                        // Security & Biometrics
                        VStack(alignment: .leading, spacing: 14) {
                            Text("BẢO MẬT & SINH TRẮC HỌC")
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(Color(red: 148/255, green: 163/255, blue: 184/255))
                                .tracking(1)
                            
                            if env.isBiometricsAvailable {
                                Toggle(isOn: $env.faceIDEnabled) {
                                    HStack(spacing: 12) {
                                        Image(systemName: "faceid")
                                            .foregroundColor(Color(red: 56/255, green: 189/255, blue: 248/255))
                                            .font(.system(size: 20))
                                        VStack(alignment: .leading, spacing: 2) {
                                            Text("Sử dụng Face ID")
                                                .foregroundColor(.white)
                                                .font(.system(size: 14, weight: .medium))
                                            Text("Mở khoá tự động không cần nhập lại mật khẩu")
                                                .foregroundColor(Color(red: 148/255, green: 163/255, blue: 184/255))
                                                .font(.system(size: 12))
                                        }
                                    }
                                }
                                .tint(Color(red: 2/255, green: 132/255, blue: 199/255))
                                .onChange(of: env.faceIDEnabled) { newValue in
                                    KeychainManager.shared.save(key: .faceIdEnabled, value: newValue ? "true" : "false")
                                }
                            } else {
                                Text("Thiết bị này không hỗ trợ hoặc chưa kích hoạt Face ID.")
                                    .font(.system(size: 13))
                                    .foregroundColor(Color(red: 148/255, green: 163/255, blue: 184/255))
                            }
                        }
                        .padding(18)
                        .auroraGlass(cornerRadius: 16)
                        
                        // App Details
                        VStack(alignment: .leading, spacing: 8) {
                            Text("THÔNG TIN ỨNG DỤNG")
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(Color(red: 148/255, green: 163/255, blue: 184/255))
                                .tracking(1)
                            
                            HStack {
                                Text("Phiên bản:")
                                    .foregroundColor(Color(red: 148/255, green: 163/255, blue: 184/255))
                                Spacer()
                                Text("1.0.0 (Aurora iPhone 13 Edition)")
                                    .foregroundColor(.white)
                            }
                            .font(.system(size: 13))
                            
                            HStack {
                                Text("Thiết bị tối ưu:")
                                    .foregroundColor(Color(red: 148/255, green: 163/255, blue: 184/255))
                                Spacer()
                                Text("iPhone 13 (iOS 16+)")
                                    .foregroundColor(.white)
                            }
                            .font(.system(size: 13))
                        }
                        .padding(18)
                        .auroraGlass(cornerRadius: 16)
                    }
                    .padding(20)
                }
            }
            .navigationTitle("Cài đặt hệ thống")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Đóng") {
                        dismiss()
                    }
                    .foregroundColor(Color(red: 56/255, green: 189/255, blue: 248/255))
                }
                
                ToolbarItem(placement: .confirmationAction) {
                    Button("Lưu") {
                        env.setServerBaseURL(serverInput)
                        dismiss()
                    }
                    .bold()
                    .foregroundColor(Color(red: 56/255, green: 189/255, blue: 248/255))
                }
            }
        }
        .onAppear {
            serverInput = env.serverBaseURL
        }
    }
}

private struct PresetButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 12, weight: .medium))
            .foregroundColor(Color(red: 56/255, green: 189/255, blue: 248/255))
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .background(Color(red: 56/255, green: 189/255, blue: 248/255).opacity(0.12))
            .cornerRadius(8)
            .scaleEffect(configuration.isPressed ? 0.96 : 1.0)
    }
}
