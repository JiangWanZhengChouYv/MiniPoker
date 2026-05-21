# Electron托盘图标

## SVG模板
本目录包含 `icon.svg` 文件，可用于生成托盘图标。

## 生成步骤

### 使用ImageMagick:
```bash
cd /Users/markzhang/Documents/MiniPoker/apps/electron/electron/icon
magick icon.svg -resize 16x16 icon.png
```

### 使用在线工具:
1. 访问 https://www.iloveimg.com/resize-image/resize-svg
2. 上传 icon.svg
3. 设置尺寸为 16x16
4. 下载并保存为 icon.png

## 注意事项

- macOS菜单栏托盘图标通常需要 16x16 或 18x18 像素
- 图标需要支持高DPI显示，建议也生成 @2x 版本 (32x32)
- PNG格式，支持透明背景
