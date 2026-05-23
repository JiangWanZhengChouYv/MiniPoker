import Foundation
import AppKit
import UserNotifications

struct NativeMessage: Codable {
    let type: String
    let data: [String: AnyCodable]?
    
    enum CodingKeys: String, CodingKey {
        case type
        case data
    }
}

struct AnyCodable: Codable {
    let value: Any
    
    init(_ value: Any) {
        self.value = value
    }
    
    func encode(to encoder: Encoder) throws {
        if let intValue = value as? Int {
            var container = encoder.singleValueContainer()
            try container.encode(intValue)
        } else if let stringValue = value as? String {
            var container = encoder.singleValueContainer()
            try container.encode(stringValue)
        } else if let boolValue = value as? Bool {
            var container = encoder.singleValueContainer()
            try container.encode(boolValue)
        } else if let doubleValue = value as? Double {
            var container = encoder.singleValueContainer()
            try container.encode(doubleValue)
        } else if let dictValue = value as? [String: Any] {
            var container = encoder.singleValueContainer()
            let codableDict = dictValue.mapValues { AnyCodable($0) }
            try container.encode(codableDict)
        } else {
            var container = encoder.singleValueContainer()
            try container.encodeNil()
        }
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let intValue = try? container.decode(Int.self) {
            value = intValue
        } else if let stringValue = try? container.decode(String.self) {
            value = stringValue
        } else if let boolValue = try? container.decode(Bool.self) {
            value = boolValue
        } else if let doubleValue = try? container.decode(Double.self) {
            value = doubleValue
        } else if let dictValue = try? container.decode([String: AnyCodable].self) {
            value = dictValue.mapValues { $0.value }
        } else {
            value = NSNull()
        }
    }
}

class MessageDispatcher {
    static let shared = MessageDispatcher()
    
    func dispatch(_ message: [String: Any]) {
        guard let type = message["type"] as? String else { return }
        
        switch type {
        case "getSettings":
            handleGetSettings(message)
        case "saveSettings":
            handleSaveSettings(message)
        case "saveGameProgress":
            handleSaveGameProgress(message)
        case "loadGameProgress":
            handleLoadGameProgress(message)
        case "sendNotification":
            handleSendNotification(message)
        case "clearGameProgress":
            handleClearGameProgress(message)
        default:
            print("未处理的消息类型: \(type)")
        }
    }
    
    private func handleGetSettings(_ message: [String: Any]) {
        if let savedSettings = PersistenceManager.shared.loadSettings() {
            let response: [String: Any] = [
                "type": "settingsResponse",
                "data": savedSettings
            ]
            sendResponse(response)
        } else {
            let defaultSettings: [String: Any] = [
                "type": "settingsResponse",
                "data": ["theme": "dark", "soundEnabled": true]
            ]
            sendResponse(defaultSettings)
        }
    }
    
    private func handleSaveSettings(_ message: [String: Any]) {
        if let data = message["data"] as? [String: Any] {
            PersistenceManager.shared.saveSettings(data)
            let response: [String: Any] = [
                "type": "settingsSaved",
                "success": true
            ]
            sendResponse(response)
        }
    }
    
    private func handleSaveGameProgress(_ message: [String: Any]) {
        if let data = message["data"] as? [String: Any] {
            PersistenceManager.shared.saveGameProgress(data)
            let response: [String: Any] = [
                "type": "gameProgressSaved",
                "success": true
            ]
            sendResponse(response)
            
            sendNotification(title: "游戏已保存", body: "您的游戏进度已成功保存")
        }
    }
    
    private func handleLoadGameProgress(_ message: [String: Any]) {
        if let savedData = PersistenceManager.shared.loadGameProgress() {
            let response: [String: Any] = [
                "type": "gameProgressLoaded",
                "data": savedData
            ]
            sendResponse(response)
        } else {
            let response: [String: Any] = [
                "type": "gameProgressNotFound",
                "success": false
            ]
            sendResponse(response)
        }
    }
    
    private func handleSendNotification(_ message: [String: Any]) {
        if let data = message["data"] as? [String: Any],
           let title = data["title"] as? String,
           let body = data["body"] as? String {
            sendNotification(title: title, body: body)
        }
    }
    
    private func handleClearGameProgress(_ message: [String: Any]) {
        PersistenceManager.shared.clearGameProgress()
        let response: [String: Any] = [
            "type": "gameProgressCleared",
            "success": true
        ]
        sendResponse(response)
    }
    
    private func sendResponse(_ response: [String: Any]) {
        if let jsonData = try? JSONSerialization.data(withJSONObject: response),
           let jsonString = String(data: jsonData, encoding: .utf8) {
            WebViewManager.shared.sendToJavaScript(jsonString)
        }
    }
    
    private func sendNotification(title: String, body: String) {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = .default
        
        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: nil)
        UNUserNotificationCenter.current().add(request)
    }
}

class PersistenceManager {
    static let shared = PersistenceManager()
    private let defaults = UserDefaults.standard
    private let gameProgressKey = "MiniPokerGameProgress"
    private let settingsKey = "MiniPokerSettings"
    
    private init() {}
    
    func saveGameProgress(_ data: [String: Any]) {
        defaults.set(data, forKey: gameProgressKey)
        defaults.synchronize()
    }
    
    func loadGameProgress() -> [String: Any]? {
        return defaults.dictionary(forKey: gameProgressKey)
    }
    
    func clearGameProgress() {
        defaults.removeObject(forKey: gameProgressKey)
        defaults.synchronize()
    }
    
    func saveSettings(_ data: [String: Any]) {
        defaults.set(data, forKey: settingsKey)
        defaults.synchronize()
    }
    
    func loadSettings() -> [String: Any]? {
        return defaults.dictionary(forKey: settingsKey)
    }
}
