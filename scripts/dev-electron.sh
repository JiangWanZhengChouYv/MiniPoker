#!/bin/bash

# MiniPoker Electron 开发环境一键启动脚本
# 支持 macOS/Linux

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  MiniPoker Electron 开发环境启动${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 检查是否已安装 pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}错误: 未找到 pnpm${NC}"
    echo "请先安装 pnpm: https://pnpm.io/installation"
    exit 1
fi

echo -e "${GREEN}[1/4]${NC} 检查依赖..."
cd "$PROJECT_ROOT"

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}依赖未安装，正在安装...${NC}"
    pnpm install
else
    echo -e "${GREEN}依赖已安装${NC}"
fi

echo ""
echo -e "${GREEN}[2/4]${NC} 构建 game-core..."
pnpm --filter @minipoker/game-core build

echo ""
echo -e "${GREEN}[3/4]${NC} 启动多人服务器 (后台)..."
# 检查端口是否被占用
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}警告: 端口 3000 已被占用，假设服务器已在运行${NC}"
else
    pnpm --filter @minipoker/server dev &
    SERVER_PID=$!
    echo "服务器 PID: $SERVER_PID"
    # 等待服务器启动
    sleep 3
fi

echo ""
echo -e "${GREEN}[4/4]${NC} 启动 Electron 应用..."
echo ""

# 清理函数
cleanup() {
    echo ""
    echo -e "${YELLOW}正在停止服务...${NC}"
    if [ -n "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null || true
        wait $SERVER_PID 2>/dev/null || true
    fi
    echo -e "${GREEN}服务已停止${NC}"
}

# 捕获退出信号
trap cleanup EXIT INT TERM

# 启动 Electron
pnpm --filter @minipoker/electron-app dev
