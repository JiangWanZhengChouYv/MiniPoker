
# MiniPoker - 跨平台扑克牌游戏系统

一个支持 Electron 桌面端和 macOS 原生端的扑克牌游戏系统，核心逻辑完全共享。

## 项目结构

```
MiniPoker/
├── packages/
│   ├── game-core/      # 共享核心游戏逻辑（TypeScript）
│   └── server/         # 多人游戏服务器（WebSocket）
├── apps/
│   ├── electron/       # Electron 桌面应用（Vue 3 + Vite）
│   └── macos/          # macOS 原生应用（SwiftUI + WebView）
└── package.json
```

## 支持的游戏

- 斗地主
- 掼蛋
- 炸金花
- （可选）蜘蛛纸牌 / 空当接龙

## 开发

### 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install
```

### 测试

```bash
cd packages/game-core
npm run test
```

### 运行 Electron 应用

```bash
cd apps/electron
npm run dev
```

## 架构说明

### 核心逻辑层

所有游戏逻辑都放在 `packages/game-core` 中，使用纯 TypeScript 实现，无任何 UI 或平台依赖。

### Electron 端

- 使用 Vue 3 + Vite 构建
- 集成 Pinia 状态管理
- 支持热重载开发
- 使用 `electron-updater` 实现自动更新

### macOS 原生端

- 使用 SwiftUI 构建原生界面
- WKWebView 嵌入共享 Web UI
- 通过 JavaScript &lt;-&gt; Swift 通信桥接共享核心逻辑
- 支持原生菜单栏、通知等系统特性

## 许可证

MIT
