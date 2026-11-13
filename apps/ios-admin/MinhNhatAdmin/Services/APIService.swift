import Foundation

public enum APIError: LocalizedError {
    case invalidURL
    case networkError(String)
    case invalidResponse(Int)
    case decodingError
    case unauthorized
    
    public var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Địa chỉ máy chủ (URL) không hợp lệ."
        case .networkError(let message):
            return "Lỗi kết nối mạng: \(message)"
        case .invalidResponse(let statusCode):
            if statusCode == 401 {
                return "Tài khoản hoặc mật khẩu không chính xác."
            }
            return "Máy chủ phản hồi mã lỗi: \(statusCode)"
        case .decodingError:
            return "Không thể xử lý dữ liệu từ máy chủ."
        case .unauthorized:
            return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
        }
    }
}

public final class APIService {
    public static let shared = APIService()
    
    private init() {}
    
    public func login(baseURL: String, request: LoginRequest) async throws -> LoginResponse {
        guard let url = URL(string: "\(cleanBaseURL(baseURL))/api/auth/login") else {
            throw APIError.invalidURL
        }
        
        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.setValue("application/json", forHTTPHeaderField: "Accept")
        urlRequest.timeoutInterval = 15
        
        let encoder = JSONEncoder()
        urlRequest.httpBody = try encoder.encode(request)
        
        let (data, response) = try await URLSession.shared.data(for: urlRequest)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.networkError("Không nhận được phản hồi từ server.")
        }
        
        guard (200...299).contains(httpResponse.statusCode) else {
            throw APIError.invalidResponse(httpResponse.statusCode)
        }
        
        do {
            let decoder = JSONDecoder()
            return try decoder.decode(LoginResponse.self, data: data)
        } catch {
            throw APIError.decodingError
        }
    }
    
    public func refresh(baseURL: String, refreshToken: String) async throws -> RefreshResponse {
        guard let url = URL(string: "\(cleanBaseURL(baseURL))/api/auth/refresh") else {
            throw APIError.invalidURL
        }
        
        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.setValue("application/json", forHTTPHeaderField: "Accept")
        urlRequest.timeoutInterval = 15
        
        let body = RefreshRequest(refreshToken: refreshToken)
        urlRequest.httpBody = try JSONEncoder().encode(body)
        
        let (data, response) = try await URLSession.shared.data(for: urlRequest)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.networkError("Không nhận được phản hồi.")
        }
        
        guard (200...299).contains(httpResponse.statusCode) else {
            throw APIError.unauthorized
        }
        
        return try JSONDecoder().decode(RefreshResponse.self, data: data)
    }
    
    public func fetchRecentBookings(baseURL: String, accessToken: String) async throws -> [BookingSummary] {
        guard let url = URL(string: "\(cleanBaseURL(baseURL))/api/admin/bookings?limit=10") else {
            throw APIError.invalidURL
        }
        
        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "GET"
        urlRequest.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        urlRequest.setValue("application/json", forHTTPHeaderField: "Accept")
        
        let (data, response) = try await URLSession.shared.data(for: urlRequest)
        guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
            return []
        }
        
        // Try decoding array or { data: [...] }
        struct PagedResponse: Decodable {
            let data: [BookingSummary]?
            let items: [BookingSummary]?
        }
        
        if let paged = try? JSONDecoder().decode(PagedResponse.self, data: data) {
            return paged.data ?? paged.items ?? []
        }
        if let list = try? JSONDecoder().decode([BookingSummary].self, data: data) {
            return list
        }
        return []
    }
    
    private func cleanBaseURL(_ url: String) -> String {
        var clean = url.trimmingCharacters(in: .whitespacesAndNewlines)
        if clean.hasSuffix("/") {
            clean.removeLast()
        }
        return clean
    }
}
