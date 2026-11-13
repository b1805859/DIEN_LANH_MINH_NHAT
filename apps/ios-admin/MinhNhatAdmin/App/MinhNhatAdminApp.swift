import SwiftUI

@main
struct MinhNhatAdminApp: App {
    @StateObject private var env = AppEnvironment()
    @Environment(\.scenePhase) private var scenePhase
    
    init() {
        // Customize appearance for dark Aurora theme
        let appearance = UINavigationBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor(red: 11/255, green: 23/255, blue: 39/255, alpha: 1.0)
        appearance.titleTextAttributes = [.foregroundColor: UIColor.white]
        appearance.largeTitleTextAttributes = [.foregroundColor: UIColor.white]
        
        UINavigationBar.appearance().standardAppearance = appearance
        UINavigationBar.appearance().scrollEdgeAppearance = appearance
        UINavigationBar.appearance().compactAppearance = appearance
        
        let tabAppearance = UITabBarAppearance()
        tabAppearance.configureWithOpaqueBackground()
        tabAppearance.backgroundColor = UIColor(red: 11/255, green: 23/255, blue: 39/255, alpha: 0.95)
        UITabBar.appearance().standardAppearance = tabAppearance
        UITabBar.appearance().scrollEdgeAppearance = tabAppearance
    }
    
    var body: some Scene {
        WindowGroup {
            Group {
                if env.isAuthenticated {
                    MainAdminContainerView()
                } else {
                    LoginView()
                }
            }
            .environmentObject(env)
            .preferredColorScheme(.dark)
        }
        .onChange(of: scenePhase) { newPhase in
            if newPhase == .active && env.isAuthenticated && env.faceIDEnabled {
                // Re-verify with Face ID when waking up if preferred
            }
        }
    }
}
