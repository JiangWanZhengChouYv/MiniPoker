# MiniPoker 打包发布指南

## 环境准备

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写相应信息：

```bash
cp .env.example .env
# 编辑 .env 文件
```

## macOS 打包

### 代码签名和公证前置要求

1. **Apple 开发者账号**：需要加入 Apple Developer Program
2. **开发者证书**：在 Keychain Access 中安装 "Developer ID Application" 证书
3. **专用密码**：在 Apple ID 账户设置中生成 App 专用密码
4. **团队 ID**：在 Apple Developer 网站获取团队 ID

### 打包命令

```bash
# 构建 Universal App (同时包含 x64 和 arm64)
pnpm build:mac:universal

# 分别构建 x64 或 arm64 版本
pnpm build:mac:x64
pnpm build:mac:arm64
```

## Windows 打包

### 前置要求

- Windows 系统或使用虚拟机/CI
- 可选：Windows 代码签名证书

### 打包命令

```bash
# 构建 Windows 版本
pnpm build:win
pnpm build:win:x64
pnpm build:win:arm64
```

## Linux 打包

### 前置要求

- Linux 系统（推荐 Ubuntu 或 Debian）
- 安装必要的构建工具：
  ```bash
  sudo apt install -y rpm fakeroot dpkg
  ```

### 打包命令

```bash
# 构建 Linux 版本
pnpm build:linux
pnpm build:linux:x64
pnpm build:linux:arm64
```

## 使用说明

### 生成的安装包

打包完成后，安装包将位于 `out/make` 目录：

- **macOS**: `MiniPoker-darwin-universal/MiniPoker.dmg`
- **Windows**: `MiniPoker-win32-x64/MiniPoker Setup 1.0.0.exe`
- **Linux**: `minipoker_1.0.0_amd64.deb` 和 `minipoker-1.0.0-1.x86_64.rpm`

### 发布到 GitHub

配置好 `GITHUB_TOKEN` 后，使用以下命令发布：

```bash
pnpm publish
```

## 图标资源

请在 `assets/` 目录放置以下图标文件：

- `icon.icns` - macOS 图标
- `icon.ico` - Windows 图标
- `icon.png` - Linux 图标 (推荐 512x512)
- `dmg-background.png` - macOS DMG 安装器背景图 (可选)
- `install.gif` - Windows 安装进度动画 (可选)

## 注意事项

1. **首次运行公证**：macOS 首次运行时需要联网完成公证验证
2. **跨平台打包**：建议使用 CI/CD（如 GitHub Actions）进行多平台打包
3. **测试**：打包完成后务必在目标平台上进行测试
