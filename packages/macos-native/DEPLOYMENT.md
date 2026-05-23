# MiniPoker macOS 打包部署指南

## 项目结构

```
macos-native/
├── Config.xcconfig          # Xcode 配置文件
├── MiniPoker.entitlements   # 应用权限配置
├── Makefile                 # 简化构建流程的 Makefile
├── Package.swift            # Swift Package Manager 配置
├── README.md                # 项目说明
├── DEPLOYMENT.md            # 本文档 - 打包部署指南
├── Sources/                 # 源代码
└── scripts/                 # 构建和部署脚本
    ├── build.sh             # 构建应用
    ├── codesign.sh          # 代码签名
    ├── notarize.sh          # Apple 公证
    └── package.sh           # 完整打包（构建+签名+公证+DMG）
```

## 使用方法

### 1. 构建应用

使用 Makefile 构建：

```bash
make build
```

或者直接使用脚本：

```bash
./scripts/build.sh
```

应用将生成在 `.build/MiniPoker.app`

### 2. 运行应用

```bash
make run
```

### 3. 代码签名

要对应用进行代码签名，需要 Apple Developer 证书：

```bash
# 查看可用的签名身份
security find-identity -v -p codesigning

# 使用 Makefile 签名（需要设置 DEVELOPER_ID 环境变量）
make sign DEVELOPER_ID="Apple Distribution: Your Name (TEAM_ID)"

# 或直接使用脚本
./scripts/codesign.sh --identity "Apple Distribution: Your Name (TEAM_ID)"
```

### 4. 公证应用

公证是 Apple 要求的步骤，用于验证应用的安全性：

```bash
./scripts/notarize.sh \
    --apple-id "your@email.com" \
    --password "app-specific-password" \
    --team-id "YOUR_TEAM_ID"
```

注意：需要在 Apple ID 账户中创建应用专用密码（App-specific password）。

### 5. 完整打包（推荐）

一步完成构建、签名、公证和创建 DMG 分发包：

```bash
./scripts/package.sh \
    --identity "Apple Distribution: Your Name (TEAM_ID)" \
    --team-id "YOUR_TEAM_ID" \
    --apple-id "your@email.com" \
    --password "app-specific-password"
```

如果暂时不需要签名和公证，可以跳过这些步骤：

```bash
./scripts/package.sh --no-sign --no-notarize
```

## 前置条件

1. **Xcode Command Line Tools**：
   ```bash
   xcode-select --install
   ```

2. **Apple Developer Account**（用于签名和公证）：
   - 注册 Apple Developer Program
   - 创建并下载代码签名证书
   - 创建应用专用密码（用于公证）

## 配置说明

### Config.xcconfig
- `DEVELOPMENT_TEAM`: 你的开发团队 ID
- `PRODUCT_BUNDLE_IDENTIFIER`: 应用 Bundle ID
- `MACOSX_DEPLOYMENT_TARGET`: 最低支持的 macOS 版本

### MiniPoker.entitlements
- 配置应用的沙盒权限
- 当前配置允许网络访问和用户文件读写

## 常见问题

### 构建时权限错误
如果遇到 `sandbox-exec: sandbox_apply: Operation not permitted` 错误，这是 Swift Package Manager 的沙箱问题。我们已经通过使用 `swiftc` 直接编译解决了这个问题。

### 签名错误
确保你的证书在 Keychain 中是有效的，并且你有正确的私钥。

### 公证失败
- 确保网络连接正常
- 检查 Apple ID 和应用专用密码是否正确
- 确保应用已正确签名

## 下一步

1. 配置你的开发者证书和团队 ID
2. 测试构建和签名流程
3. 进行完整的打包和公证测试
4. 分发应用

## 维护

- 更新应用版本：修改 `build.sh` 和 `Info.plist` 中的版本号
- 添加新的功能：在 `Sources/` 目录中添加代码
- 更新依赖：使用 Swift Package Manager 管理
