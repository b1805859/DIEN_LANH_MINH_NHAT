import SwiftUI

public struct AuroraGlassModifier: ViewModifier {
    var cornerRadius: CGFloat = 20
    var strokeOpacity: Double = 0.2
    
    public func body(content: Content) -> some View {
        content
            .background(
                RoundedRectangle(cornerRadius: cornerRadius)
                    .fill(
                        LinearGradient(
                            colors: [
                                Color(red: 14/255, green: 26/255, blue: 45/255, opacity: 0.85),
                                Color(red: 10/255, green: 18/255, blue: 32/255, opacity: 0.90)
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
            )
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius)
                    .stroke(
                        LinearGradient(
                            colors: [
                                Color(red: 56/255, green: 189/255, blue: 248/255, opacity: strokeOpacity * 1.5),
                                Color(red: 2/255, green: 132/255, blue: 199/255, opacity: strokeOpacity * 0.5)
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ),
                        lineWidth: 1
                    )
            )
            .shadow(color: Color.black.opacity(0.35), radius: 16, x: 0, y: 10)
    }
}

public extension View {
    func auroraGlass(cornerRadius: CGFloat = 20, strokeOpacity: Double = 0.2) -> some View {
        self.modifier(AuroraGlassModifier(cornerRadius: cornerRadius, strokeOpacity: strokeOpacity))
    }
}
