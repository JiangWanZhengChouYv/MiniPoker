# MiniPoker 多人模式使用指南

## 快速开始

### 1. 启动服务器

在项目根目录下：

```bash
# 开发模式
pnpm dev:server

# 或先构建再启动
pnpm build:server
pnpm start:server
```

服务器默认在 `http://localhost:3000` 启动，并会自动显示局域网 IP 地址。

### 2. 启动游戏

```bash
pnpm dev:electron
```

### 3. 加入游戏

1. 选择「多人模式」
2. 输入服务器地址（默认 `http://localhost:3000`）
3. 点击「连接」
4. 创建房间或加入现有房间
5. 等待其他玩家加入
6. 房主点击「开始游戏」

## 局域网联机

### 同一局域网内

1. 确保所有设备连接到同一个 WiFi/网络
2. 一台设备启动服务器
3. 其他设备使用服务器显示的局域网 IP 地址连接（例如 `http://192.168.1.100:3000`）

### 跨网络/ZeroTier

1. 所有设备安装并连接到同一个 ZeroTier 网络
2. 获取服务器的 ZeroTier IP
3. 使用该 IP 连接游戏（例如 `http://10.147.18.1:3000`）

## 功能特性

- ✅ 支持斗地主、掼蛋、炸金花三款游戏
- ✅ 可自定义房间名称和最大玩家数
- ✅ 实时显示房间列表和玩家状态
- ✅ 房主权限管理（开始游戏）
- ✅ 玩家离开自动处理
- ✅ 与单人模式无缝切换

## 技术架构

### 后端
- Node.js + Express
- Socket.IO（WebSocket 通信）
- TypeScript

### 前端
- Electron + Vue 3
- Pinia（状态管理）
- Socket.IO Client

## 开发调试

查看服务器日志：
```bash
pnpm dev:server
```

服务器支持环境变量：
```bash
PORT=8080 pnpm dev:server
```
