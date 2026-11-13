import Foundation
import Security

public final class KeychainManager {
    public static let shared = KeychainManager()
    private let serviceName = "vn.dienlanhminhnhat.admin"
    
    private init() {}
    
    public enum Key: String {
        case accessToken = "auth_access_token"
        case refreshToken = "auth_refresh_token"
        case savedEmail = "auth_saved_email"
        case savedPassword = "auth_saved_password"
        case serverBaseUrl = "auth_server_base_url"
        case faceIdEnabled = "auth_face_id_enabled"
    }
    
    public func save(key: Key, value: String) {
        guard let data = value.data(using: .utf8) else { return }
        
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: serviceName,
            kSecAttrAccount as String: key.rawValue
        ]
        
        SecItemDelete(query as CFDictionary)
        
        var newQuery = query
        newQuery[kSecValueData as String] = data
        newQuery[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
        
        SecItemAdd(newQuery as CFDictionary, nil)
    }
    
    public func get(key: Key) -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: serviceName,
            kSecAttrAccount as String: key.rawValue,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        
        var dataTypeRef: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &dataTypeRef)
        
        if status == errSecSuccess, let data = dataTypeRef as? Data {
            return String(data: data, encoding: .utf8)
        }
        return nil
    }
    
    public func delete(key: Key) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: serviceName,
            kSecAttrAccount as String: key.rawValue
        ]
        SecItemDelete(query as CFDictionary)
    }
    
    public func clearAll() {
        delete(key: .accessToken)
        delete(key: .refreshToken)
        delete(key: .savedPassword)
    }
}
