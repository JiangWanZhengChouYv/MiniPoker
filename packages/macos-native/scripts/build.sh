#!/bin/bash
set -e

# MiniPoker 构建脚本
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$PROJECT_DIR/.build"
APP_NAME="MiniPoker"
APP_BUNDLE="$BUILD_DIR/$APP_NAME.app"
CONTENTS_DIR="$APP_BUNDLE/Contents"
MACOS_DIR="$CONTENTS_DIR/MacOS"
RESOURCES_DIR="$CONTENTS_DIR/Resources"
FRAMEWORKS_DIR="$CONTENTS_DIR/Frameworks"
SOURCES_DIR="$PROJECT_DIR/Sources"

echo "=========================================="
echo "开始构建 MiniPoker macOS 应用"
echo "=========================================="

# 创建目录结构
echo "创建目录结构..."
mkdir -p "$MACOS_DIR"
mkdir -p "$RESOURCES_DIR"
mkdir -p "$FRAMEWORKS_DIR"
mkdir -p "$BUILD_DIR/obj"

# 编译 Swift 代码
echo "编译 Swift 代码..."
cd "$PROJECT_DIR"

# 获取所有 Swift 源文件
SWIFT_FILES=()
while IFS=  read -r -d $'\0'; do
    SWIFT_FILES+=("$REPLY")
done < <(find "$SOURCES_DIR" -name "*.swift" -print0)

if [ ${#SWIFT_FILES[@]} -eq 0 ]; then
    echo "错误: 未找到 Swift 源文件"
    exit 1
fi

# 检测当前架构
ARCH=$(uname -m)
if [ "$ARCH" = "arm64" ]; then
    TARGET="arm64-apple-macos12.0"
elif [ "$ARCH" = "x86_64" ]; then
    TARGET="x86_64-apple-macos12.0"
else
    echo "错误: 不支持的架构 $ARCH"
    exit 1
fi

# 使用 swiftc 直接编译
swiftc -o "$MACOS_DIR/$APP_NAME" \
    -target "$TARGET" \
    -O \
    -sdk $(xcrun --show-sdk-path) \
    -framework Cocoa \
    -framework WebKit \
    "${SWIFT_FILES[@]}"

# 复制 Info.plist
echo "配置 Info.plist..."
cp "$SOURCES_DIR/Info.plist" "$CONTENTS_DIR/"

# 更新 Info.plist 中的值
/usr/libexec/PlistBuddy -c "Set :CFBundleExecutable MiniPoker" "$CONTENTS_DIR/Info.plist"
/usr/libexec/PlistBuddy -c "Set :CFBundleIdentifier com.minipoker.app" "$CONTENTS_DIR/Info.plist"
/usr/libexec/PlistBuddy -c "Set :CFBundleName MiniPoker" "$CONTENTS_DIR/Info.plist"
/usr/libexec/PlistBuddy -c "Set :CFBundlePackageType APPL" "$CONTENTS_DIR/Info.plist"
/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString 1.0.0" "$CONTENTS_DIR/Info.plist"
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion 1" "$CONTENTS_DIR/Info.plist"
/usr/libexec/PlistBuddy -c "Set :LSMinimumSystemVersion 12.0" "$CONTENTS_DIR/Info.plist"

# 创建 PkgInfo 文件
echo "创建 PkgInfo..."
echo "APPL????" > "$CONTENTS_DIR/PkgInfo"

echo ""
echo "=========================================="
echo "构建成功！"
echo "应用包位置: $APP_BUNDLE"
echo "=========================================="
