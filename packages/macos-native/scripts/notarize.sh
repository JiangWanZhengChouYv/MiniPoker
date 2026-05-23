#!/bin/bash
set -e

# MiniPoker 公证脚本
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$PROJECT_DIR/.build"
APP_NAME="MiniPoker"
APP_BUNDLE="$BUILD_DIR/$APP_NAME.app"
DMG_PATH="$BUILD_DIR/$APP_NAME.dmg"

# 默认配置
BUNDLE_ID="com.minipoker.app"

usage() {
    echo "用法: $0 [选项]"
    echo "选项:"
    echo "  -u, --apple-id <email>       Apple ID 邮箱"
    echo "  -p, --password <password>    应用专用密码"
    echo "  -t, --team-id <team-id>      团队 ID"
    echo "  -b, --bundle-id <id>         Bundle ID (默认: com.minipoker.app)"
    echo "  -h, --help                   显示帮助信息"
    exit 1
}

while [[ $# -gt 0 ]]; do
    case $1 in
        -u|--apple-id)
            APPLE_ID="$2"
            shift; shift
            ;;
        -p|--password)
            APPLE_ID_PASSWORD="$2"
            shift; shift
            ;;
        -t|--team-id)
            TEAM_ID="$2"
            shift; shift
            ;;
        -b|--bundle-id)
            BUNDLE_ID="$2"
            shift; shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            echo "未知选项: $1"
            usage
            ;;
    esac
done

if [ -z "$APPLE_ID" ] || [ -z "$APPLE_ID_PASSWORD" ] || [ -z "$TEAM_ID" ]; then
    echo "错误: 必须提供 Apple ID、密码和团队 ID"
    usage
fi

if [ ! -d "$APP_BUNDLE" ]; then
    echo "错误: 应用包不存在: $APP_BUNDLE"
    echo "请先运行 build.sh 和 codesign.sh"
    exit 1
fi

echo "=========================================="
echo "开始公证流程"
echo "=========================================="
echo "应用包: $APP_BUNDLE"
echo "Bundle ID: $BUNDLE_ID"
echo "Apple ID: $APPLE_ID"
echo "团队 ID: $TEAM_ID"
echo ""

# 创建 DMG 用于公证
echo "创建 DMG 镜像..."
if [ -f "$DMG_PATH" ]; then
    rm -f "$DMG_PATH"
fi

# 创建临时目录
TEMP_DMG_DIR="$BUILD_DIR/temp_dmg"
mkdir -p "$TEMP_DMG_DIR"
cp -R "$APP_BUNDLE" "$TEMP_DMG_DIR/"

# 创建 DMG
hdiutil create -volname "$APP_NAME" -srcfolder "$TEMP_DMG_DIR" -ov -format UDZO "$DMG_PATH"

# 清理临时目录
rm -rf "$TEMP_DMG_DIR"

echo "DMG 创建完成: $DMG_PATH"
echo ""

# 上传公证
echo "上传到 Apple 进行公证..."
xcrun notarytool submit "$DMG_PATH" \
    --apple-id "$APPLE_ID" \
    --password "$APPLE_ID_PASSWORD" \
    --team-id "$TEAM_ID" \
    --wait

# 如果公证成功，装订票据
echo ""
echo "装订公证票据..."
xcrun stapler staple "$APP_BUNDLE"

# 验证公证
echo ""
echo "验证公证..."
xcrun stapler validate "$APP_BUNDLE"

echo ""
echo "=========================================="
echo "公证完成！"
echo "=========================================="
