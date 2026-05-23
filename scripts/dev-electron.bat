@echo off
REM MiniPoker Electron 开发环境一键启动脚本
REM 支持 Windows

title MiniPoker Electron Dev Environment

echo ========================================
echo   MiniPoker Electron 开发环境启动
echo ========================================
echo.

REM 检查是否已安装 pnpm
where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未找到 pnpm
    echo 请先安装 pnpm: https://pnpm.io/installation
    pause
    exit /b 1
)

echo [1/4] 检查依赖...
cd /d "%~dp0.."

if not exist "node_modules" (
    echo 依赖未安装，正在安装...
    pnpm install
) else (
    echo 依赖已安装
)

echo.
echo [2/4] 构建 game-core...
pnpm --filter @minipoker/game-core build

echo.
echo [3/4] 启动多人服务器...
start "MiniPoker Server" cmd /k "pnpm --filter @minipoker/server dev"

REM 等待服务器启动
timeout /t 3 /nobreak >nul

echo.
echo [4/4] 启动 Electron 应用...
echo.

pnpm --filter @minipoker/electron-app dev

pause
