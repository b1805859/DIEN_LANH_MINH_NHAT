import SwiftUI

public struct LoginView: View {
    @EnvironmentObject private var env: AppEnvironment
    
    @State private var email: String = "admin@dienlanhminhnhat.vn"
    @State private var password: String = ""
    @State private var showPassword: Bool = false
    @State private var rememberFaceID: Bool = true
    @State private var showSettingsSheet: Bool = false
    
    public var body: some View {
        ZStack {
            // Background Aurora gradient
            LinearGradient(
                colors: [
                    Color(red: 6/255, green: 12/255, blue: 24/255),
                    Color(red: 11/255, green: 23/255, blue: 39/255),
                    Color(red: 14/255, green: 30/255, blue: 56/255)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            // Background ambient glow
            GeometryReader { proxy in
                Circle()
                    .fill(Color(red: 2/255, green: 132/255, blue: 199/255).opacity(0.18))
                    .frame(width: proxy.size.width * 0.9)
                    .blur(radius: 70)
                    .position(x: proxy.size.width * 0.8, y: proxy.size.height * 0.2)
                
                Circle()
                    .fill(Color(red: 56/255, green: 189/255, blue: 248/255).opacity(0.12))
                    .frame(width: proxy.size.width * 0.8)
                    .blur(radius: 60)
                    .position(x: proxy.size.width * 0.2, y: proxy.size.height * 0.75)
            }
            .ignoresSafeArea()
            
            ScrollView(showsIndicators: false) {
                VStack(spacing: 24) {
                    // Header Logo & Branding
                    VStack(spacing: 12) {
                        BrandLogoView(size: 72)
                            .padding(.top, 20)
                        
                        Text("ĐIỆN LẠNH MINH NHẬT")
                            .font(.system(size: 22, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                            .tracking(1.5)
                        
                        Text("AURORA WORKSPACE CMS · iPHONE 13")
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundColor(Color(red: 56/255, green: 189/255, blue: 248/255))
                            .tracking(2)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 4)
                            .background(Color(red: 56/255, green: 189/255, blue: 248/255).opacity(0.12))
                            .cornerRadius(12)
                    }
                    .padding(.bottom, 8)
                    
                    // Main Login Card
                    VStack(alignment: .leading, spacing: 20) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Đăng nhập quản trị")
                                .font(.system(size: 20, weight: .bold))
                                .foregroundColor(.white)
                            
                            Text("Nhập tài khoản để quản lý lịch hẹn và dịch vụ.")
                                .font(.system(size: 13))
                                .foregroundColor(Color(red: 148/255, green: 163/255, blue: 184/255))
                        }
                        
                        // Email Field
                        VStack(alignment: .leading, spacing: 8) {
                            Text("EMAIL QUẢN TRỊ")
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(Color(red: 148/255, green: 163/255, blue: 184/255))
                                .tracking(0.5)
                            
                            HStack(spacing: 12) {
                                Image(systemName: "envelope.fill")
                                    .foregroundColor(Color(red: 56/255, green: 189/255, blue: 248/255))
                                    .frame(width: 20)
                                
                                TextField("admin@dienlanhminhnhat.vn", text: $email)
                                    .textContentType(.emailAddress)
                                    .keyboardType(.emailAddress)
                                    .autocapitalization(.none)
                                    .disableAutocorrection(true)
                                    .foregroundColor(.white)
                            }
                            .padding(.horizontal, 14)
                            .padding(.vertical, 12)
                            .background(Color(red: 15/255, green: 23/255, blue: 42/255).opacity(0.8))
                            .cornerRadius(12)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color(red: 56/255, green: 189/255, blue: 248/255).opacity(0.25), lineWidth: 1)
                            )
                        }
                        
                        // Password Field
                        VStack(alignment: .leading, spacing: 8) {
                            Text("MẬT KHẨU")
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(Color(red: 148/255, green: 163/255, blue: 184/255))
                                .tracking(0.5)
                            
                            HStack(spacing: 12) {
                                Image(systemName: "lock.fill")
                                    .foregroundColor(Color(red: 56/255, green: 189/255, blue: 248/255))
                                    .frame(width: 20)
                                
                                if showPassword {
                                    TextField("Mật khẩu", text: $password)
                                        .textContentType(.password)
                                        .autocapitalization(.none)
                                        .disableAutocorrection(true)
                                        .foregroundColor(.white)
                                } else {
                                    SecureField("Mật khẩu", text: $password)
                                        .textContentType(.password)
                                        .autocapitalization(.none)
                                        .disableAutocorrection(true)
                                        .foregroundColor(.white)
                                }
                                
                                Button {
                                    showPassword.toggle()
                                } label: {
                                    Image(systemName: showPassword ? "eye.slash.fill" : "eye.fill")
                                        .foregroundColor(Color(red: 148/255, green: 163/255, blue: 184/255))
                                }
                            }
                            .padding(.horizontal, 14)
                            .padding(.vertical, 12)
                            .background(Color(red: 15/255, green: 23/255, blue: 42/255).opacity(0.8))
                            .cornerRadius(12)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color(red: 56/255, green: 189/255, blue: 248/255).opacity(0.25), lineWidth: 1)
                            )
                        }
                        
                        // Face ID toggle
                        if env.isBiometricsAvailable {
                            Toggle(isOn: $rememberFaceID) {
                                HStack(spacing: 8) {
                                    Image(systemName: "faceid")
                                        .foregroundColor(Color(red: 56/255, green: 189/255, blue: 248/255))
                                    Text("Lưu đăng nhập bằng Face ID")
                                        .font(.system(size: 13, weight: .medium))
                                        .foregroundColor(Color(red: 226/255, green: 232/255, blue: 240/255))
                                }
                            }
                            .tint(Color(red: 2/255, green: 132/255, blue: 199/255))
                        }
                        
                        // Error message banner
                        if let error = env.errorMessage {
                            HStack(spacing: 10) {
                                Image(systemName: "exclamationmark.triangle.fill")
                                    .foregroundColor(.red)
                                Text(error)
                                    .font(.system(size: 13))
                                    .foregroundColor(.red)
                            }
                            .padding(12)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(Color.red.opacity(0.12))
                            .cornerRadius(10)
                        }
                        
                        // Submit Button
                        Button {
                            Task {
                                _ = await env.login(email: email, password: password, rememberFaceID: rememberFaceID)
                            }
                        } label: {
                            HStack {
                                if env.isLoading {
                                    ProgressView()
                                        .tint(.white)
                                } else {
                                    Text("Đăng nhập vào Aurora")
                                        .font(.system(size: 15, weight: .semibold))
                                    Image(systemName: "arrow.right")
                                }
                            }
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(
                                LinearGradient(
                                    colors: [
                                        Color(red: 2/255, green: 132/255, blue: 199/255),
                                        Color(red: 3/255, green: 105/255, blue: 161/255)
                                    ],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .cornerRadius(12)
                            .shadow(color: Color(red: 2/255, green: 132/255, blue: 199/255).opacity(0.4), radius: 8, x: 0, y: 4)
                        }
                        .disabled(env.isLoading || email.isEmpty || password.isEmpty)
                        .opacity((email.isEmpty || password.isEmpty) ? 0.6 : 1.0)
                        
                        // Face ID Quick Login Button if saved
                        if env.isBiometricsAvailable && env.faceIDEnabled {
                            Button {
                                Task {
                                    _ = await env.loginWithFaceID()
                                }
                            } label: {
                                HStack(spacing: 10) {
                                    Image(systemName: "faceid")
                                        .font(.system(size: 18))
                                    Text("Mở khoá nhanh bằng Face ID")
                                        .font(.system(size: 14, weight: .medium))
                                }
                                .foregroundColor(Color(red: 56/255, green: 189/255, blue: 248/255))
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 12)
                                .background(Color(red: 56/255, green: 189/255, blue: 248/255).opacity(0.12))
                                .cornerRadius(12)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(Color(red: 56/255, green: 189/255, blue: 248/255).opacity(0.3), lineWidth: 1)
                                )
                            }
                        }
                    }
                    .padding(24)
                    .auroraGlass(cornerRadius: 24, strokeOpacity: 0.3)
                    .padding(.horizontal, 20)
                    
                    // Server & Quick Settings Bar
                    HStack {
                        Button {
                            showSettingsSheet = true
                        } label: {
                            HStack(spacing: 6) {
                                Image(systemName: "server.rack")
                                Text("Máy chủ: \(shortServerName(env.serverBaseURL))")
                                    .lineLimit(1)
                                Image(systemName: "pencil")
                            }
                            .font(.system(size: 12))
                            .foregroundColor(Color(red: 148/255, green: 163/255, blue: 184/255))
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(Color(red: 15/255, green: 23/255, blue: 42/255).opacity(0.6))
                            .cornerRadius(16)
                        }
                    }
                    .padding(.bottom, 20)
                }
            }
        }
        .sheet(isPresented: $showSettingsSheet) {
            SettingsSheetView()
                .environmentObject(env)
        }
        .onAppear {
            if let saved = KeychainManager.shared.get(key: .savedEmail) {
                self.email = saved
            }
            // Auto-trigger Face ID if configured
            if env.faceIDEnabled && env.isBiometricsAvailable && KeychainManager.shared.get(key: .savedPassword) != nil {
                Task {
                    _ = await env.loginWithFaceID()
                }
            }
        }
    }
    
    private func shortServerName(_ urlString: String) -> String {
        guard let url = URL(string: urlString) else { return urlString }
        return url.host ?? urlString
    }
}
