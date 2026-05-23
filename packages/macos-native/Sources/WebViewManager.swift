import WebKit

class WebViewManager: NSObject, ObservableObject {
    static let shared = WebViewManager()
    
    let webView: WKWebView
    private let messageHandler = ScriptMessageHandler()
    
    private override init() {
        let config = WKWebViewConfiguration()
        let userContentController = WKUserContentController()
        
        userContentController.add(messageHandler, name: "nativeBridge")
        config.userContentController = userContentController
        
        webView = WKWebView(frame: .zero, configuration: config)
        super.init()
        
        loadWebUI()
    }
    
    private func loadWebUI() {
        let fileManager = FileManager.default
        let currentPath = FileManager.default.currentDirectoryPath
        let webUIPath = currentPath + "/../electron-app/src/renderer/index.html"
        
        if fileManager.fileExists(atPath: webUIPath) {
            let url = URL(fileURLWithPath: webUIPath)
            let directory = url.deletingLastPathComponent()
            webView.loadFileURL(url, allowingReadAccessTo: directory)
        } else {
            let html = """
            <html>
            <body style="display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#1a1a1a;color:white;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
                <div style="text-align:center;">
                    <h1>MiniPoker</h1>
                    <p>Web UI 正在加载中...</p>
                </div>
            </body>
            </html>
            """
            webView.loadHTMLString(html, baseURL: nil)
        }
    }
    
    func sendToJavaScript(_ message: String) {
        webView.evaluateJavaScript("window.receiveNativeMessage(\(message))") { _, error in
            if let error = error {
                print("JS 通信错误: \(error)")
            }
        }
    }
}

class ScriptMessageHandler: NSObject, WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.name == "nativeBridge" else { return }
        
        if let body = message.body as? [String: Any] {
            handleMessage(body)
        }
    }
    
    private func handleMessage(_ body: [String: Any]) {
        guard let type = body["type"] as? String else { return }
        
        switch type {
        case "log":
            if let message = body["message"] as? String {
                print("[Web] \(message)")
            }
        default:
            MessageDispatcher.shared.dispatch(body)
        }
    }
}
