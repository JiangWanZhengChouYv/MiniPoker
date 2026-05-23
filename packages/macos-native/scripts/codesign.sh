#!/bin/bash
set -e

# MiniPoker 代码签名脚本
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$PROJECT_DIR/.build"
APP_NAME="MiniPoker"
APP_BUNDLE="$BUILD_DIR/$APP_NAME.app"

# 默认配置
DEVELOPER_ID="${DEVELOPER_ID:-Apple Distribution}"
TEAM_ID="${TEAM_ID:-}"
ENTITLEMENTS="$PROJECT_DIR/MiniPoker.entitlements"

usage() {
    echo "用法: $0 [选项]"
    echo "选项:"
    echo "  -i, --identity <identity>    签名身份 (默认: Apple Distribution)"
    echo "  -t, --team-id <team-id>      团队 ID"
    echo "  -h, --help                   显示帮助信息"
    exit 1
}

while [[ $# -gt 0 ]]; do
    case $1 in
        -i|--identity)
            DEVELOPER_ID="$2"
            shift; shift
            ;;
        -t|--team-id)
            TEAM_ID="$2"
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

if [ ! -d "$APP_BUNDLE" ]; then
    echo "错误: 应用包不存在: $APP_BUNDLE"
    echo "请先运行 build.sh 构建应用"
    exit 1
fi

echo "=========================================="
echo "开始代码签名"
echo "=========================================="
echo "应用包: $APP_BUNDLE"
echo "签名身份: $DEVELOPER_ID"
if [ -n "$TEAM_ID" ]; then
    echo "团队 ID: $TEAM_ID"
fi
echo ""

# 检查签名身份是否可用
if ! security find-identity -v -p codesigning | grep -q "$DEVELOPER_ID"; then
    echo "警告: 未找到签名身份 '$DEVELOPER_ID'"
    echo "可用的签名身份:"
    security find-identity -v -p codesigning
    echo ""
    read -p "是否继续使用 ad-hoc 签名? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    DEVELOPER_ID="-"
fi

# 签名选项
SIGN_OPTS="--force --timestamp --options runtime"
if [ -f "$ENTITLEMENTS" ]; then
    SIGN_OPTS="$SIGN_OPTS --entitlements \"$ENTITLEMENTS\""
fi

# 签名框架（如果有）
if [ -d "$APP_BUNDLE/Contents/Frameworks" ]; then
    echo "签名框架..."
    find "$APP_BUNDLE/Contents/Frameworks" -name "*.framework" -o -name "*.dylib" | while read -r item; do
        echo "  签名: $item"
        codesign $SIGN_OPTS --sign "$DEVELOPER_ID" "$item"
    done
fi

# 签名可执行文件
echo "签名可执行文件..."
codesign $SIGN_OPTS --sign "$DEVELOPER_ID" "$APP_BUNDLE/Contents/MacOS/$APP_NAME"

# 签名整个应用包
echo "签名应用包..."
codesign $SIGN_OPTS --sign "$DEVELOPER_ID" "$APP_BUNDLE"

# 验证签名
echo ""
echo "验证签名..."
codesign -v --verify --verbose=4 "$APP_BUNDLE"

echo ""
echo "=========================================="
echo "代码签名完成！"
echo "=========================================="
