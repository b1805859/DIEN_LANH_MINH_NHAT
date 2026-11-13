import SwiftUI

public struct QuickBookingsView: View {
    @EnvironmentObject private var env: AppEnvironment
    @State private var bookings: [BookingSummary] = []
    @State private var isLoading: Bool = false
    @State private var searchText: String = ""
    
    public var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 11/255, green: 23/255, blue: 39/255)
                    .ignoresSafeArea()
                
                if isLoading && bookings.isEmpty {
                    VStack(spacing: 12) {
                        ProgressView()
                            .tint(Color(red: 56/255, green: 189/255, blue: 248/255))
                        Text("Đang tải danh sách lịch hẹn…")
                            .font(.system(size: 13))
                            .foregroundColor(Color(red: 148/255, green: 163/255, blue: 184/255))
                    }
                } else if bookings.isEmpty {
                    VStack(spacing: 16) {
                        Image(systemName: "calendar.badge.clock")
                            .font(.system(size: 48))
                            .foregroundColor(Color(red: 56/255, green: 189/255, blue: 248/255).opacity(0.6))
                        Text("Chưa có lịch hẹn nào mới")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white)
                        Text("Lịch hẹn khách hàng đặt từ website sẽ xuất hiện tại đây.")
                            .font(.system(size: 13))
                            .foregroundColor(Color(red: 148/255, green: 163/255, blue: 184/255))
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 40)
                        
                        Button {
                            Task { await loadBookings() }
                        } label: {
                            Text("Tải lại danh sách")
                                .font(.system(size: 13, weight: .medium))
                                .foregroundColor(Color(red: 56/255, green: 189/255, blue: 248/255))
                                .padding(.horizontal, 16)
                                .padding(.vertical, 8)
                                .background(Color(red: 56/255, green: 189/255, blue: 248/255).opacity(0.12))
                                .cornerRadius(8)
                        }
                    }
                } else {
                    List {
                        ForEach(filteredBookings) { booking in
                            BookingCardRow(booking: booking)
                                .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                                .listRowBackground(Color.clear)
                                .listRowSeparator(.hidden)
                        }
                    }
                    .listStyle(.plain)
                    .refreshable {
                        await loadBookings()
                    }
                }
            }
            .navigationTitle("Lịch hẹn khách hàng")
            .navigationBarTitleDisplayMode(.inline)
            .searchable(text: $searchText, prompt: "Tìm theo tên hoặc số điện thoại")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        Task { await loadBookings() }
                    } label: {
                        Image(systemName: "arrow.clockwise")
                            .foregroundColor(Color(red: 56/255, green: 189/255, blue: 248/255))
                    }
                }
            }
        }
        .task {
            await loadBookings()
        }
    }
    
    private var filteredBookings: [BookingSummary] {
        if searchText.isEmpty { return bookings }
        return bookings.filter { item in
            (item.customerName?.localizedCaseInsensitiveContains(searchText) ?? false) ||
            (item.customerPhone?.contains(searchText) ?? false) ||
            (item.serviceName?.localizedCaseInsensitiveContains(searchText) ?? false)
        }
    }
    
    private func loadBookings() async {
        guard let token = env.currentAccessToken else { return }
        isLoading = true
        do {
            self.bookings = try await APIService.shared.fetchRecentBookings(
                baseURL: env.serverBaseURL,
                accessToken: token
            )
        } catch {
            // Keep existing bookings or display fallback
        }
        isLoading = false
    }
}

private struct BookingCardRow: View {
    let booking: BookingSummary
    
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text(booking.customerName ?? "Khách hàng")
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(.white)
                
                Spacer()
                
                Text(booking.status ?? "Mới")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(Color(red: 56/255, green: 189/255, blue: 248/255))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(Color(red: 56/255, green: 189/255, blue: 248/255).opacity(0.12))
                    .cornerRadius(6)
            }
            
            if let service = booking.serviceName {
                HStack(spacing: 6) {
                    Image(systemName: "wrench.and.screwdriver.fill")
                        .font(.system(size: 12))
                        .foregroundColor(Color(red: 56/255, green: 189/255, blue: 248/255))
                    Text(service)
                        .font(.system(size: 13))
                        .foregroundColor(Color(red: 226/255, green: 232/255, blue: 240/255))
                }
            }
            
            if let address = booking.address {
                HStack(spacing: 6) {
                    Image(systemName: "mappin.circle.fill")
                        .font(.system(size: 12))
                        .foregroundColor(Color(red: 148/255, green: 163/255, blue: 184/255))
                    Text(address)
                        .font(.system(size: 12))
                        .foregroundColor(Color(red: 148/255, green: 163/255, blue: 184/255))
                        .lineLimit(1)
                }
            }
            
            Divider()
                .background(Color(red: 56/255, green: 189/255, blue: 248/255).opacity(0.15))
            
            HStack {
                if let phone = booking.customerPhone, let url = URL(string: "tel:\(phone)") {
                    Link(destination: url) {
                        HStack(spacing: 6) {
                            Image(systemName: "phone.fill")
                                .font(.system(size: 12))
                            Text(phone)
                                .font(.system(size: 13, weight: .semibold))
                        }
                        .foregroundColor(Color(red: 56/255, green: 189/255, blue: 248/255))
                    }
                }
                
                Spacer()
                
                if let time = booking.scheduledAt {
                    Text(time)
                        .font(.system(size: 11))
                        .foregroundColor(Color(red: 148/255, green: 163/255, blue: 184/255))
                }
            }
        }
        .padding(14)
        .auroraGlass(cornerRadius: 14, strokeOpacity: 0.25)
    }
}
