import Foundation
import LocalAuthentication

public final class BiometricAuthService {
    public static let shared = BiometricAuthService()
    
    private init() {}
    
    public enum BiometricType {
        case none
        case touchID
        case faceID
    }
    
    public var biometricType: BiometricType {
        let context = LAContext()
        var error: NSError?
        
        guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
            return .none
        }
        
        switch context.biometryType {
        case .faceID:
            return .faceID
        case .touchID:
            return .touchID
        default:
            return .none
        }
    }
    
    public var isAvailable: Bool {
        biometricType != .none
    }
    
    public func authenticateWithFaceID(reason: String = "Xác thực Face ID để vào Bảng quản trị Minh Nhật") async -> Bool {
        let context = LAContext()
        context.localizedCancelTitle = "Huỷ"
        context.localizedFallbackTitle = "Nhập mật khẩu"
        
        var error: NSError?
        guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
            return false
        }
        
        do {
            return try await context.evaluatePolicy(
                .deviceOwnerAuthenticationWithBiometrics,
                localizedReason: reason
            )
        } catch {
            return false
        }
    }
}
