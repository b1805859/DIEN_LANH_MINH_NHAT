import SwiftUI

public struct MainAdminContainerView: View {
    @EnvironmentObject private var env: AppEnvironment
    
    @State private var selectedTab: Int = 0
    @State private var canGoBack: Bool = false
    @State private var canGoForward: Bool = false
    @State private var isWebLoading: Bool = false
    @State private var showLogoutConfirm: Bool = false
    
    public var body: some View {
        TabView(selection: $selectedTab) {
            // Tab 1: Web CMS View
            NavigationStack {
                ZStack {
                    Color(red: 11/255, green: 23/255, blue: 39/255)
                        .ignoresSafeArea()
                    
                    if let targetURL = URL(string: "\(env.serverBaseURL)/admin/dashboard") {
                        AdminWebView(
                            url: targetURL,
                            accessToken: env.currentAccessToken,
                            refreshToken: env.currentRefreshToken,
                            canGoBack: $canGoBack,
                            canGoForward: $canGoForward,
                            isLoading: $isWebLoading,
                            onAuthExpired: {
                                env.logout()
                            }
                        )
                        .ignoresSafeArea(edges: .bottom)
                    }
                    
                    // Loading overlay bar
                    if isWebLoading {
                        VStack {
                            ProgressView()
                                .progressViewStyle(LinearProgressViewStyle(tint: Color(red: 56/255, green: 189/255, blue: 248/255)))
                                .frame(height: 2)
                            Spacer()
                        }
                    }
                }
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .navigationBarLeading) {
                        HStack(spacing: 8) {
                            BrandLogoView(size: 28)
                            Text("Quản trị")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.white)
                        }
                    }
                    
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Button {
                            showLogoutConfirm = true
                        } label: {
                            Image(systemName: "rectangle.portrait.and.arrow.right")
                                .foregroundColor(Color(red: 248/255, green: 113/255, blue: 113/255))
                        }
                    }
                }
            }
            .tabItem {
                Label("Bảng CMS", systemImage: "macwindow.on.rectangle")
            }
            .tag(0)
            
            // Tab 2: Native Quick Bookings
            QuickBookingsView()
                .tabItem {
                    Label("Lịch hẹn", systemImage: "calendar.badge.clock")
                }
                .tag(1)
            
            // Tab 3: Settings
            SettingsSheetView()
                .tabItem {
                    Label("Cài đặt", systemImage: "gearshape.fill")
                }
                .tag(2)
        }
        .tint(Color(red: 56/255, green: 189/255, blue: 248/255))
        .alert("Đăng xuất quản trị?", isPresented: $showLogoutConfirm) {
            Button("Huỷ", role: .cancel) {}
            Button("Đăng xuất", role: .destructive) {
                env.logout()
            }
        } message: {
            Text("Bạn có chắc chắn muốn đăng xuất khỏi phiên làm việc này không?")
        }
    }
}
