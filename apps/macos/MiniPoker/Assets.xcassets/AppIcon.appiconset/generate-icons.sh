#!/bin/bash

# MiniPoker图标生成脚本
# 使用方法: ./generate-icons.sh

set -e

echo "开始生成MiniPoker应用图标..."

# 检查是否安装了ImageMagick
if ! command -v magick &> /dev/null; then
    echo "警告: ImageMagick未安装。尝试使用sips..."
    HAS_IMAGEMAGICK=false
else
    HAS_IMAGEMAGICK=true
fi

# Electron托盘图标生成
ELECTRON_DIR="/Users/markzhang/Documents/MiniPoker/apps/electron/electron/icon"
cd "$ELECTRON_DIR"

echo "生成Electron托盘图标..."

if [ "$HAS_IMAGEMAGICK" = true ]; then
    # 使用ImageMagick
    magick icon.svg -resize 16x16 icon.png
    echo "✓ Electron托盘图标已生成: $ELECTRON_DIR/icon.png"
else
    # 使用sips (macOS内置)
    if [ -f icon.svg ]; then
        echo "sips不支持直接转换SVG，请安装ImageMagick: brew install imagemagick"
        echo "或使用在线工具将 icon.svg 转换为 16x16 的 icon.png"
    fi
fi

# macOS应用图标生成
MACOS_DIR="/Users/markzhang/Documents/MiniPoker/apps/macos/MiniPoker/Assets.xcassets/AppIcon.appiconset"
cd "$MACOS_DIR"

echo "生成macOS应用图标..."

if [ "$HAS_IMAGEMAGICK" = true ]; then
    # 生成所有需要的尺寸
    declare -a sizes=("16x16" "32x32" "128x128" "256x256" "512x512")
    declare -a retina_sizes=("16x16" "32x32" "128x128" "256x256" "512x512")
    
    for size in "${sizes[@]}"; do
        filename="icon_${size}.png"
        magick AppIcon.svg -resize "${size}" "$filename"
        echo "✓ 生成: $filename"
    done
    
    # 生成@2x版本
    for size in "${retina_sizes[@]}"; do
        # 提取数字部分
        num="${size%x*}"
        retina_size="${num}x2"
        filename="icon_${num}x${num}@2x.png"
        magick AppIcon.svg -resize "${num}x${num}" "$filename"
        echo "✓ 生成: $filename"
    done
    
    echo ""
    echo "✓ 所有macOS应用图标已生成！"
    echo "请在Xcode中清理构建: Product > Clean Build Folder"
else
    echo "⚠ ImageMagick未安装，无法自动生成图标"
    echo ""
    echo "请手动使用以下方法之一生成图标："
    echo "1. 使用在线工具: https://www.iloveimg.com/resize-image/resize-svg"
    echo "2. 安装ImageMagick: brew install imagemagick"
    echo "3. 使用设计工具(Sketch/Figma)打开AppIcon.svg并导出"
fi

echo ""
echo "图标生成完成！"
