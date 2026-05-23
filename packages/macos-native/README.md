# MiniPoker macOS Native App

使用 Swift + SwiftUI 构建的原生 macOS 应用，集成 WKWebView 加载 Web UI。

## 项目结构

```
macos-native/
├── Package.swift          # Swift Package Manager 配置
├── Sources/
│   ├── main.swift         # 应用入口
│   ├── ContentView.swift  # SwiftUI 主视图
│   ├── WebViewManager.swift # WKWebView 管理
│   ├── CommunicationProtocol.swift # 通信协议
│   └── Info.plist         # 应用配置
└── README.md              # 本文件
```

## 功能特性

1. ✅ Swift + SwiftUI 架构
2. ✅ 最低支持 macOS 12.0
3. ✅ WKWebView 集成
4. ✅ JavaScript ↔ Swift 双向通信
5. ✅ 通信协议封装

## 使用方法

### 方法一：在 Xcode 中创建新项目（推荐）

1. 打开 Xcode
2. 创建新的 "macOS App" 项目
3. 选择 "Swift" 和 "SwiftUI"
4. 配置最低部署版本为 macOS 12.0
5. 将 `Sources/` 目录下的所有 Swift 文件添加到项目中
6. 在项目设置中添加 `Info.plist`
7. 运行项目

### 方法二：使用 Swift Package Manager

在 Xcode 中选择 File → Add Package Dependencies，添加本地包。

## 通信 API

### JavaScript → Swift

```javascript
// 发送消息到 Swift
window.webkit.messageHandlers.nativeBridge.postMessage({
  type: 'log',
  message: 'Hello from Web!'
});
```

### Swift → JavaScript

```swift
// 发送消息到 JavaScript
WebViewManager.shared.sendToJavaScript("'Hello from Swift!'")
```

## JavaScript 接收消息

```javascript
window.receiveNativeMessage = function(message) {
  console.log('收到来自 Swift 的消息:', message);
};
```

## 开发说明

- Web UI 源文件位于 `../electron-app/src/renderer/`
- 项目支持本地文件加载
