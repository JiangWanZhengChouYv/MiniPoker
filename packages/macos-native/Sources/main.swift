import AppKit
import SwiftUI
import UserNotifications

class AppDelegate: NSObject, NSApplicationDelegate, UNUserNotificationCenterDelegate {
    var statusItem: NSStatusItem?
    var statusItemMenu: NSMenu?
    
    func applicationDidFinishLaunching(_ notification: Notification) {
        setupStatusBar()
        requestNotificationPermission()
        UNUserNotificationCenter.current().delegate = self
    }
    
    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return false
    }
    
    private func setupStatusBar() {
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        
        if let button = statusItem?.button {
            button.image = NSImage(systemSymbolName: "suit.spade.fill", accessibilityDescription: "MiniPoker")
            button.action = #selector(toggleMainWindow)
        }
        
        statusItemMenu = NSMenu()
        
        statusItemMenu?.addItem(withTitle: "显示/隐藏", action: #selector(toggleMainWindow), keyEquivalent: "")
        statusItemMenu?.addItem(NSMenuItem.separator())
        
        let gameSubmenu = NSMenu()
        gameSubmenu.addItem(withTitle: "开始新游戏", action: #selector(startNewGame), keyEquivalent: "")
        gameSubmenu.addItem(withTitle: "保存进度", action: #selector(saveGameProgress), keyEquivalent: "")
        gameSubmenu.addItem(withTitle: "加载进度", action: #selector(loadGameProgress), keyEquivalent: "")
        
        let gameMenuItem = NSMenuItem(title: "游戏", action: nil, keyEquivalent: "")
        gameMenuItem.submenu = gameSubmenu
        statusItemMenu?.addItem(gameMenuItem)
        
        statusItemMenu?.addItem(NSMenuItem.separator())
        statusItemMenu?.addItem(withTitle: "退出", action: #selector(quit), keyEquivalent: "")
        
        statusItem?.menu = statusItemMenu
    }
    
    private func requestNotificationPermission() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
            if granted {
                print("通知权限已获取")
            } else if let error = error {
                print("获取通知权限失败: \(error)")
            }
        }
    }
    
    @objc func toggleMainWindow() {
        if let window = NSApplication.shared.windows.first {
            if window.isVisible {
                window.orderOut(nil)
            } else {
                window.makeKeyAndOrderFront(nil)
                NSApplication.shared.activate(ignoringOtherApps: true)
            }
        }
    }
    
    @objc func startNewGame() {
        let message: [String: Any] = [
            "type": "startNewGame"
        ]
        sendToWeb(message)
    }
    
    @objc func saveGameProgress() {
        let message: [String: Any] = [
            "type": "requestGameSave"
        ]
        sendToWeb(message)
    }
    
    @objc func loadGameProgress() {
        if let savedData = PersistenceManager.shared.loadGameProgress() {
            let message: [String: Any] = [
                "type": "loadGameProgress",
                "data": savedData
            ]
            sendToWeb(message)
        } else {
            sendNotification(title: "加载失败", body: "没有找到已保存的游戏进度")
        }
    }
    
    @objc func toggleFullscreen() {
        if let window = NSApplication.shared.windows.first {
            window.toggleFullScreen(nil)
        }
    }
    
    @objc func openHelp() {
        let message: [String: Any] = [
            "type": "openHelp"
        ]
        sendToWeb(message)
    }
    
    @objc func quit() {
        NSApplication.shared.terminate(nil)
    }
    
    private func sendToWeb(_ message: [String: Any]) {
        if let jsonData = try? JSONSerialization.data(withJSONObject: message),
           let jsonString = String(data: jsonData, encoding: .utf8) {
            WebViewManager.shared.sendToJavaScript(jsonString)
        }
    }
    
    func sendNotification(title: String, body: String) {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = .default
        
        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: nil)
        UNUserNotificationCenter.current().add(request)
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([.banner, .sound])
    }
}

class MainWindowController: NSWindowController {
    convenience init() {
        let window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 1200, height: 800),
            styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView],
            backing: .buffered,
            defer: false
        )
        window.center()
        window.title = "MiniPoker"
        window.titlebarAppearsTransparent = true
        window.isMovableByWindowBackground = true
        
        let contentView = ContentView()
        window.contentView = NSHostingView(rootView: contentView)
        
        self.init(window: window)
    }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
let windowController = MainWindowController()
windowController.showWindow(nil)
app.run()
