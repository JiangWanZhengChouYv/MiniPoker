# MiniPoker 应用图标生成指南

## 已创建的SVG模板

本目录包含两个SVG模板文件，可用于生成应用图标：

1. **Electron托盘图标**: `icon.svg` (16x16px)
2. **macOS应用图标**: `AppIcon.svg` (512x512px)

## 使用方法

### 方案1: 使用在线转换工具

1. 访问以下在线SVG转PNG工具：
   - https://www.iloveimg.com/resize-image/resize-svg
   - https://cloudconvert.com/svg-to-png
   - https://www.online-convert.com/

2. 上传SVG文件

3. 根据需要设置尺寸

4. 下载PNG文件

### 方案2: 使用命令行工具 (macOS)

如果你安装了ImageMagick或sips，可以使用命令行：

```bash
# 使用ImageMagick (需要安装: brew install imagemagick)
cd /Users/markzhang/Documents/MiniPoker/apps/electron/electron/icon
magick icon.svg -resize 16x16 icon.png

# 使用sips (macOS内置)
cd /Users/markzhang/Documents/MiniPoker/apps/electron/electron/icon
sips -s format png icon.svg --out icon.png
```

### 方案3: 使用Sketch/Figma设计工具

1. 在设计工具中打开SVG文件
2. 根据需要调整设计
3. 导出为所需尺寸的PNG文件

## macOS图标尺寸要求

macOS应用需要以下尺寸的图标文件：

| 尺寸 | 文件名 | 用途 |
|------|--------|------|
| 16x16 | icon_16x16.png | 最小显示 |
| 16x16@2x | icon_16x16@2x.png | Retina显示器 |
| 32x32 | icon_32x32.png | 标准托盘 |
| 32x32@2x | icon_32x32@2x.png | Retina托盘 |
| 128x128 | icon_128x128.png | Dock图标 |
| 128x128@2x | icon_128x128@2x.png | Dock Retina |
| 256x256 | icon_256x256.png | 大图标 |
| 256x256@2x | icon_256x256@2x.png | 大图标 Retina |
| 512x512 | icon_512x512.png | 应用商店 |
| 512x512@2x | icon_512x512@2x.png | 应用商店 Retina |

## 设计说明

图标设计采用经典扑克牌风格：
- **主色调**: 红色(#e31b1b)和黑色(#1a1a1a)
- **核心元素**: 
  - 红心♥作为主视觉元素
  - 黑桃♠作为装饰
  - 字母A表示"Ace"（最大牌）
- **背景**: 白色/浅灰色扑克牌造型
- **风格**: 简洁、现代、专业

## 后续步骤

1. 使用SVG模板生成所有尺寸的PNG文件
2. 将macOS图标文件放入 `Assets.xcassets/AppIcon.appiconset/` 目录
3. 在Xcode中清理构建并查看效果
4. 根据需要调整SVG设计并重新生成
