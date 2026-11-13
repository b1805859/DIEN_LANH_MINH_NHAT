import Foundation

public struct LoginRequest: Codable {
    public let email: String
    public let password: String
    
    public init(email: String, password: String) {
        self.email = email
        self.password = password
    }
}

public struct AdminUser: Codable, Identifiable {
    public let id: String
    public let email: String
    public let role: String
}

public struct LoginResponse: Codable {
    public let accessToken: String
    public let refreshToken: String
    public let user: AdminUser
}

public struct RefreshRequest: Codable {
    public let refreshToken: String
    
    public init(refreshToken: String) {
        self.refreshToken = refreshToken
    }
}

public struct RefreshResponse: Codable {
    public let accessToken: String
    public let refreshToken: String
    public let user: AdminUser?
}

public struct BookingSummary: Codable, Identifiable {
    public let id: String
    public let customerName: String?
    public let customerPhone: String?
    public let serviceName: String?
    public let status: String?
    public let scheduledAt: String?
    public let address: String?
    
    enum CodingKeys: String, CodingKey {
        case id
        case customerName
        case customerPhone
        case serviceName
        case status
        case scheduledAt
        case address
    }
}
