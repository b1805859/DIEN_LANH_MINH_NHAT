import Foundation
import SwiftUI
import Combine

@MainActor
public final class AppEnvironment: ObservableObject {
    @Published public var isAuthenticated: Bool = false
    @Published public var currentUser: AdminUser?
    @Published public var serverBaseURL: String = "https://dienlanhminhnhat.vn"
    @Published public var isBiometricsAvailable: Bool = false
    @Published public var faceIDEnabled: Bool = true
    @Published public var isLoading: Bool = false
    @Published public var errorMessage: String?
    
    public var currentAccessToken: String? {
        KeychainManager.shared.get(key: .accessToken)
    }
    
    public var currentRefreshToken: String? {
        KeychainManager.shared.get(key: .refreshToken)
    }
    
    public init() {
        self.isBiometricsAvailable = BiometricAuthService.shared.isAvailable
        
        if let savedBaseURL = KeychainManager.shared.get(key: .serverBaseUrl), !savedBaseURL.isEmpty {
            self.serverBaseURL = savedBaseURL
        }
        
        if let savedFaceIdSetting = KeychainManager.shared.get(key: .faceIdEnabled) {
            self.faceIDEnabled = (savedFaceIdSetting == "true")
        }
        
        checkExistingSession()
    }
    
    public func checkExistingSession() {
        if let token = currentAccessToken, !token.isEmpty {
            self.isAuthenticated = true
        }
    }
    
    public func login(email: String, password: String, rememberFaceID: Bool = true) async -> Bool {
        isLoading = true
        errorMessage = nil
        
        do {
            let req = LoginRequest(email: email, password: password)
            let response = try await APIService.shared.login(baseURL: serverBaseURL, request: req)
            
            KeychainManager.shared.save(key: .accessToken, value: response.accessToken)
            KeychainManager.shared.save(key: .refreshToken, value: response.refreshToken)
            KeychainManager.shared.save(key: .savedEmail, value: email)
            
            if rememberFaceID {
                KeychainManager.shared.save(key: .savedPassword, value: password)
                KeychainManager.shared.save(key: .faceIdEnabled, value: "true")
                self.faceIDEnabled = true
            }
            
            self.currentUser = response.user
            self.isAuthenticated = true
            self.isLoading = false
            return true
        } catch let err as LocalizedError {
            self.errorMessage = err.errorDescription ?? err.localizedDescription
            self.isLoading = false
            return false
        } catch {
            self.errorMessage = error.localizedDescription
            self.isLoading = false
            return false
        }
    }
    
    public func loginWithFaceID() async -> Bool {
        guard faceIDEnabled, isBiometricsAvailable else { return false }
        
        guard let savedEmail = KeychainManager.shared.get(key: .savedEmail),
              let savedPassword = KeychainManager.shared.get(key: .savedPassword) else {
            return false
        }
        
        let success = await BiometricAuthService.shared.authenticateWithFaceID(
            reason: "Đăng nhập nhanh vào Quản trị Điện Lạnh Minh Nhật"
        )
        
        if success {
            return await login(email: savedEmail, password: savedPassword, rememberFaceID: true)
        }
        return false
    }
    
    public func setServerBaseURL(_ url: String) {
        var trimmed = url.trimmingCharacters(in: .whitespacesAndNewlines)
        if !trimmed.hasPrefix("http://") && !trimmed.hasPrefix("https://") {
            trimmed = "https://" + trimmed
        }
        self.serverBaseURL = trimmed
        KeychainManager.shared.save(key: .serverBaseUrl, value: trimmed)
    }
    
    public func logout() {
        KeychainManager.shared.clearAll()
        self.currentUser = nil
        self.isAuthenticated = false
    }
}
