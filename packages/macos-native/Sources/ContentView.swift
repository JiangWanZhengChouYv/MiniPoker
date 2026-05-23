import SwiftUI
import WebKit

struct ContentView: View {
    var body: some View {
        WebViewContainer()
            .edgesIgnoringSafeArea(.all)
    }
}

struct WebViewContainer: NSViewRepresentable {
    func makeNSView(context: Context) -> WKWebView {
        let webView = WebViewManager.shared.webView
        return webView
    }
    
    func updateNSView(_ nsView: WKWebView, context: Context) {
    }
}
