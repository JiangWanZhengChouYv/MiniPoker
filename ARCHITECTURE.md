# MiniPoker 架构设计文档

## 目录
1. [项目概述](#项目概述)
2. [核心逻辑共享方案](#核心逻辑共享方案)
3. [Electron 与 macOS 端实现差异](#electron-与-macos-端实现差异)
4. [WebView 通信协议](#webview-通信协议)
5. [多人模式后端统一接口](#多人模式后端统一接口)

---

## 项目概述

### 技术栈
- **Monorepo 管理**: pnpm workspace
- **核心游戏逻辑**: TypeScript
- **Electron 应用**: Electron + Vue 3 + Pinia + Vite
- **macOS 原生应用**: Swift + WKWebView
- **多人服务器**: Node.js + Express + Socket.IO

### 项目结构
```
MiniPoker/
├── packages/
│   ├── game-core/          # 共享游戏核心逻辑
│   ├── electron-app/       # Electron 桌面应用
│   ├── macos-native/       # macOS 原生应用
│   └── server/             # 多人模式后端服务器
├── package.json
├── pnpm-workspace.yaml
└── ARCHITECTURE.md
```

---

## 核心逻辑共享方案

### 设计原则
通过 `@minipoker/game-core` 包实现游戏逻辑的跨平台共享，确保：
1. 游戏规则在各平台保持一致
2. 代码复用率最大化
3. 维护成本最小化

### game-core 包结构
```
game-core/
├── src/
│   ├── types/              # TypeScript 类型定义
│   ├── card/               # 卡牌工具类
│   ├── deck/               # 牌堆管理
│   ├── hand/               # 牌型判断
│   ├── ai/                 # AI 玩家逻辑
│   ├── games/
│   │   ├── doudizhu/       # 斗地主游戏
│   │   ├── guandan/        # 掼蛋游戏
│   │   └── zhaojinhua/     # 炸金花游戏
│   └── index.ts
└── package.json
```

### 导出接口
```typescript
// 版本信息
export const gameCoreVersion = "1.0.0";

// 类型定义
export * from './types';

// 卡牌工具
export { CardUtil } from './card';

// 牌堆管理
export { Deck } from './deck';

// 牌型判断
export { HandUtil } from './hand';

// 游戏实现
export { DouDiZhuGame } from './games/doudizhu';
export { GuanDanGame } from './games/guandan';
export { ZhaJinHuaGame, ZhaJinHuaHandType } from './games/zhaojinhua';

// AI 玩家
export { SimpleAI } from './ai';
```

### 各平台集成方式
- **Electron**: 直接通过 workspace 依赖引入 `@minipoker/game-core`
- **macOS**: 通过 WebView 加载编译后的 JavaScript 包
- **Server**: 直接通过 workspace 依赖引入，用于游戏状态管理

---

## Electron 与 macOS 端实现差异

### 架构对比

| 特性 | Electron 实现 | macOS 原生实现 |
|------|--------------|---------------|
| **主进程** | Node.js (Electron Main) | Swift (AppDelegate) |
| **渲染进程** | Chromium WebView | WKWebView |
| **通信方式** | IPC (contextBridge) | WKScriptMessageHandler |
| **原生能力** | Electron API | Cocoa/AppKit |
| **打包工具** | Electron Forge | Xcode/Swift Package Manager |

### Electron 端架构
```
electron-app/
├── src/
│   ├── main/              # 主进程
│   │   └── index.ts       # 主进程入口
│   ├── preload/           # 预加载脚本
│   │   └── index.ts       # contextBridge API
│   └── renderer/          # 渲染进程 (Vue 3)
│       ├── components/    # Vue 组件
│       ├── views/         # 页面视图
│       ├── stores/        # Pinia 状态管理
│       ├── router/        # Vue Router
│       └── main.ts
```

### macOS 端架构
```
macos-native/
├── Sources/
│   ├── main.swift
│   ├── AppDelegate.swift
│   ├── ContentView.swift
│   ├── WebViewManager.swift
│   ├── CommunicationProtocol.swift
│   └── Info.plist
└── Package.swift
```

### 通信机制差异

#### Electron (IPC)
```typescript
// preload/index.ts - 暴露 API 到渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  getState: () => ipcRenderer.invoke('get-state'),
  sendNotification: (title, body) => ipcRenderer.invoke('send-notification', title, body),
  createWindow: (name) => ipcRenderer.invoke('create-window', name),
  closeWindow: (id) => ipcRenderer.invoke('close-window', id),
  toggleWindow: (id) => ipcRenderer.invoke('toggle-window', id),
  onStateUpdated: (callback) => {
    ipcRenderer.on('state-updated', (_, state) => callback(state))
  }
});
```

#### macOS (WKScriptMessageHandler)
```swift
// WebViewManager.swift
class WebViewManager: NSObject, ObservableObject {
    let webView: WKWebView
    private let messageHandler = ScriptMessageHandler()
    
    init() {
        let config = WKWebViewConfiguration()
        let userContentController = WKUserContentController()
        userContentController.add(messageHandler, name: "nativeBridge")
        config.userContentController = userContentController
        webView = WKWebView(frame: .zero, configuration: config)
    }
}
```

---

## WebView 通信协议

### 统一消息格式
为了实现跨平台统一，定义标准的消息格式：

```typescript
interface NativeMessage {
  type: string;
  data?: Record<string, any>;
}
```

### 消息类型定义

#### 从 Web 到 Native
| 消息类型 | 说明 | 参数 |
|---------|------|------|
| `log` | 日志输出 | `{ message: string }` |
| `getSettings` | 获取设置 | - |
| `saveSettings` | 保存设置 | `{ theme?: string, soundEnabled?: boolean }` |
| `saveGameProgress` | 保存游戏进度 | `{ ...gameState }` |
| `loadGameProgress` | 加载游戏进度 | - |
| `clearGameProgress` | 清除游戏进度 | - |
| `sendNotification` | 发送通知 | `{ title: string, body: string }` |

#### 从 Native 到 Web
| 消息类型 | 说明 | 参数 |
|---------|------|------|
| `settingsResponse` | 设置数据响应 | `{ theme: string, soundEnabled: boolean }` |
| `settingsSaved` | 设置保存成功 | `{ success: boolean }` |
| `gameProgressLoaded` | 游戏进度加载成功 | `{ ...gameState }` |
| `gameProgressSaved` | 游戏进度保存成功 | `{ success: boolean }` |
| `gameProgressNotFound` | 游戏进度未找到 | `{ success: boolean }` |
| `gameProgressCleared` | 游戏进度清除成功 | `{ success: boolean }` |

### JavaScript 实现 (跨平台适配层)
```typescript
// 平台检测
const isElectron = typeof window.electronAPI !== 'undefined';
const isMacOSNative = typeof window.webkit !== 'undefined' && 
  typeof window.webkit.messageHandlers !== 'undefined' &&
  typeof window.webkit.messageHandlers.nativeBridge !== 'undefined';

// 统一发送接口
function sendToNative(message: NativeMessage) {
  if (isElectron) {
    // Electron 通过 IPC
    // ...
  } else if (isMacOSNative) {
    // macOS 通过 WKWebView
    window.webkit.messageHandlers.nativeBridge.postMessage(message);
  }
}

// 统一接收接口
window.receiveNativeMessage = function(message: string) {
  const data = JSON.parse(message);
  // 处理消息
};
```

---

## 多人模式后端统一接口

### 服务器架构
```
server/
├── src/
│   ├── index.ts            # 服务器入口
│   ├── RoomManager.ts      # 房间管理
│   └── types.ts            # 类型定义
```

### Socket.IO 事件定义

#### 客户端 → 服务器 (ClientToServerEvents)
```typescript
interface ClientToServerEvents {
  'room:list': (callback: (rooms: Room[]) => void) => void;
  'room:create': (data: { 
    name: string; 
    gameType: GameType; 
    maxPlayers: number; 
    playerName: string 
  }, callback: (room: Room) => void) => void;
  'room:join': (data: { 
    roomId: string; 
    playerName: string 
  }, callback: (room: Room) => void) => void;
  'room:leave': () => void;
  'game:start': () => void;
  'game:action': (action: any) => void;
}
```

#### 服务器 → 客户端 (ServerToClientEvents)
```typescript
interface ServerToClientEvents {
  'room:playerJoined': (player: Player) => void;
  'room:playerLeft': (playerId: string) => void;
  'game:state': (state: any) => void;
  'game:started': () => void;
  'game:action': (action: any) => void;
  'error': (message: string) => void;
}
```

### 数据模型
```typescript
interface Player {
  id: string;
  name: string;
  socketId: string;
}

enum GameType {
  DOUDIZHU = 'doudizhu',
  GUANDAN = 'guandan',
  ZHAOJINHUA = 'zhaojinhua'
}

interface Room {
  id: string;
  name: string;
  players: Player[];
  maxPlayers: number;
  gameType: GameType;
  hostId: string;
  gameState: any;
  isPlaying: boolean;
}
```

### 工作流程
1. 客户端连接服务器
2. 获取房间列表
3. 创建或加入房间
4. 等待玩家就绪
5. 房主开始游戏
6. 游戏进行（实时同步状态）
7. 游戏结束，可选择重开或离开
