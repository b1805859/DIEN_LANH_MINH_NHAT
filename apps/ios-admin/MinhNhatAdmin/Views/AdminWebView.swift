import SwiftUI
import WebKit

public struct AdminWebView: UIViewRepresentable {
    public let url: URL
    public let accessToken: String?
    public let refreshToken: String?
    @Binding public var canGoBack: Bool
    @Binding public var canGoForward: Bool
    @Binding public var isLoading: Bool
    public var onAuthExpired: (() -> Void)?
    
    public func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    public func makeUIView(context: Context) -> WKWebView {
        let preferences = WKWebpagePreferences()
        preferences.allowsContentJavaScript = true
        
        let configuration = WKWebViewConfiguration()
        configuration.defaultWebpagePreferences = preferences
        configuration.allowsInlineMediaPlayback = true
        
        // Inject auth tokens into localStorage at start of document loading
        if let access = accessToken, let refresh = refreshToken {
            let scriptSource = """
            try {
                localStorage.setItem('accessToken', '\(access)');
                localStorage.setItem('refreshToken', '\(refresh)');
                window.dispatchEvent(new Event('minhnhat-auth-token-change'));
            } catch(e) {
                console.error('Failed to inject auth tokens:', e);
            }
            """
            let userScript = WKUserScript(
                source: scriptSource,
                injectionTime: .atDocumentStart,
                forMainFrameOnly: true
            )
            configuration.userContentController.addUserScript(userScript)
        }
        
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.allowsBackForwardNavigationGestures = true
        webView.isOpaque = false
        webView.backgroundColor = UIColor(red: 11/255, green: 23/255, blue: 39/255, alpha: 1.0)
        webView.scrollView.backgroundColor = UIColor(red: 11/255, green: 23/255, blue: 39/255, alpha: 1.0)
        
        // Setup Pull to Refresh on iPhone 13
        let refreshControl = UIRefreshControl()
        refreshControl.tintColor = UIColor(red: 56/255, green: 189/255, blue: 248/255, alpha: 1.0)
        refreshControl.addTarget(context.coordinator, action: #selector(Coordinator.handleRefreshControl(sender:)), for: .valueChanged)
        webView.scrollView.refreshControl = refreshControl
        
        context.coordinator.webView = webView
        
        var request = URLRequest(url: url)
        if let access = accessToken {
            request.setValue("Bearer \(access)", forHTTPHeaderField: "Authorization")
        }
        webView.load(request)
        
        return webView
    }
    
    public func updateUIView(_ uiView: WKWebView, context: Context) {
        // No-op or handle external reloads if needed
    }
    
    public final class Coordinator: NSObject, WKNavigationDelegate {
        var parent: AdminWebView
        weak var webView: WKWebView?
        
        init(_ parent: AdminWebView) {
            self.parent = parent
        }
        
        @objc func handleRefreshControl(sender: UIRefreshControl) {
            webView?.reload()
        }
        
        public func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
            DispatchQueue.main.async {
                self.parent.isLoading = true
            }
        }
        
        public func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            DispatchQueue.main.async {
                self.parent.isLoading = false
                self.parent.canGoBack = webView.canGoBack
                self.parent.canGoForward = webView.canGoForward
                webView.scrollView.refreshControl?.endRefreshing()
            }
            
            // Check if page redirected back to login due to expired token
            if let currentURL = webView.url?.absoluteString, currentURL.contains("/admin/login") {
                // If we were supposed to be authenticated, notify parent
                if self.parent.accessToken != nil {
                    // Page redirected to login => Session expired
                }
            }
        }
        
        public func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            DispatchQueue.main.async {
                self.parent.isLoading = false
                webView.scrollView.refreshControl?.endRefreshing()
            }
        }
        
        public func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            DispatchQueue.main.async {
                self.parent.isLoading = false
                webView.scrollView.refreshControl?.endRefreshing()
            }
        }
    }
}
