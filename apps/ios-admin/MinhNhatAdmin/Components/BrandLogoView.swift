import SwiftUI

public struct BrandLogoView: View {
    public var size: CGFloat = 64
    
    public init(size: CGFloat = 64) {
        self.size = size
    }
    
    public var body: some View {
        ZStack {
            // Radial Glow
            Circle()
                .fill(
                    RadialGradient(
                        colors: [
                            Color(red: 56/255, green: 189/255, blue: 248/255, opacity: 0.3),
                            Color.clear
                        ],
                        center: .center,
                        startRadius: 2,
                        endRadius: size * 0.8
                    )
                )
                .frame(width: size * 1.5, height: size * 1.5)
            
            // Stylized cooling crystal / "MN" mark
            VStack(spacing: 4) {
                Image(systemName: "snowflake")
                    .resizable()
                    .scaledToFit()
                    .frame(width: size * 0.5, height: size * 0.5)
                    .foregroundStyle(
                        LinearGradient(
                            colors: [
                                Color(red: 224/255, green: 242/255, blue: 254/255),
                                Color(red: 56/255, green: 189/255, blue: 248/255)
                            ],
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
            }
            .frame(width: size, height: size)
            .background(
                RoundedRectangle(cornerRadius: size * 0.28)
                    .fill(
                        LinearGradient(
                            colors: [
                                Color(red: 14/255, green: 30/255, blue: 56/255),
                                Color(red: 8/255, green: 15/255, blue: 28/255)
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
            )
            .overlay(
                RoundedRectangle(cornerRadius: size * 0.28)
                    .stroke(
                        LinearGradient(
                            colors: [
                                Color(red: 56/255, green: 189/255, blue: 248/255, opacity: 0.8),
                                Color(red: 2/255, green: 132/255, blue: 199/255, opacity: 0.2)
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ),
                        lineWidth: 1.5
                    )
            )
            .shadow(color: Color(red: 2/255, green: 132/255, blue: 199/255, opacity: 0.35), radius: 10, x: 0, y: 5)
        }
    }
}
