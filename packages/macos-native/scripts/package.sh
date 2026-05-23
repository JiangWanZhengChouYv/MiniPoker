#!/bin/bash
set -e

# MiniPoker 完整打包脚本
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

usage() {
    echo "用法: $0 [选项]"
    echo "选项:"
    echo "  --no-sign                跳过代码签名"
    echo "  --no-notarize            跳过公证"
    echo "  --identity <identity>    签名身份"
    echo "  --team-id <team-id>      团队 ID"
    echo "  --apple-id <email>       Apple ID"
    echo "  --password <password>    应用专用密码"
    echo "  -h, --help               显示帮助信息"
    exit 1
}

NO_SIGN=false
NO_NOTARIZE=false
IDENTITY=""
TEAM_ID=""
APPLE_ID=""
PASSWORD=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --no-sign)
            NO_SIGN=true
            shift
            ;;
        --no-notarize)
            NO_NOTARIZE=true
            shift
            ;;
        --identity)
            IDENTITY="$2"
            shift; shift
            ;;
        --team-id)
            TEAM_ID="$2"
            shift; shift
            ;;
        --apple-id)
            APPLE_ID="$2"
            shift; shift
            ;;
        --password)
            PASSWORD="$2"
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

echo "=========================================="
echo "MiniPoker 完整打包流程"
echo "=========================================="
echo ""

# 1. 构建应用
echo "[1/4] 构建应用..."
"$SCRIPT_DIR/build.sh"
echo ""

# 2. 代码签名
if [ "$NO_SIGN" = false ]; then
    echo "[2/4] 代码签名..."
    SIGN_ARGS=()
    if [ -n "$IDENTITY" ]; then
        SIGN_ARGS+=(--identity "$IDENTITY")
    fi
    if [ -n "$TEAM_ID" ]; then
        SIGN_ARGS+=(--team-id "$TEAM_ID")
    fi
    "$SCRIPT_DIR/codesign.sh" "${SIGN_ARGS[@]}"
    echo ""
else
    echo "[2/4] 跳过代码签名"
    echo ""
fi

# 3. 公证
if [ "$NO_NOTARIZE" = false ] && [ "$NO_SIGN" = false ]; then
    echo "[3/4] 公证应用..."
    if [ -n "$APPLE_ID" ] && [ -n "$PASSWORD" ] && [ -n "$TEAM_ID" ]; then
        NOTARIZE_ARGS=(
            --apple-id "$APPLE_ID"
            --password "$PASSWORD"
            --team-id "$TEAM_ID"
        )
        "$SCRIPT_DIR/notarize.sh" "${NOTARIZE_ARGS[@]}"
    else
        echo "警告: 缺少公证所需参数，跳过去公证"
        echo "请使用 --apple-id、--password 和 --team-id 参数提供认证信息"
    fi
    echo ""
else
    echo "[3/4] 跳过公证"
    echo ""
fi

# 4. 创建分发 DMG
echo "[4/4] 创建分发 DMG..."
BUILD_DIR="$PROJECT_DIR/.build"
APP_NAME="MiniPoker"
APP_BUNDLE="$BUILD_DIR/$APP_NAME.app"
DMG_PATH="$BUILD_DIR/${APP_NAME}-$(date +%Y%m%d).dmg"

TEMP_DMG_DIR="$BUILD_DIR/temp_dmg"
mkdir -p "$TEMP_DMG_DIR"
cp -R "$APP_BUNDLE" "$TEMP_DMG_DIR/"

# 创建到 Applications 的链接
ln -s /Applications "$TEMP_DMG_DIR/Applications"

hdiutil create -volname "$APP_NAME" -srcfolder "$TEMP_DMG_DIR" -ov -format UDZO "$DMG_PATH"

# 清理
rm -rf "$TEMP_DMG_DIR"

echo ""
echo "=========================================="
echo "打包完成！"
echo "应用包: $APP_BUNDLE"
echo "DMG 镜像: $DMG_PATH"
echo "=========================================="
