import SwiftUI

struct ContentView: View {
    @State private var webView = WebView()
    
    var body: some View {
        webView
            .onAppear {
                loadWebUI()
            }
    }
    
    private func loadWebUI() {
        let electronDir = "/Users/markzhang/Documents/MiniPoker/apps/electron"
        let indexPath = "\(electronDir)/index.html"
        let fileURL = URL(fileURLWithPath: indexPath, isDirectory: false)
        let directoryURL = URL(fileURLWithPath: electronDir, isDirectory: true)
        
        webView.webView.loadFileURL(fileURL, allowingReadAccessTo: directoryURL)
    }
}

#Preview {
    ContentView()
}
