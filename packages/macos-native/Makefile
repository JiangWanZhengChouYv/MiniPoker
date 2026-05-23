.PHONY: all build sign notarize package clean help run

# 构建配置
SCRIPTS_DIR := scripts
BUILD_DIR := .build
APP_NAME := MiniPoker
APP_BUNDLE := $(BUILD_DIR)/$(APP_NAME).app

all: build

help:
	@echo "MiniPoker macOS 构建系统"
	@echo ""
	@echo "可用目标："
	@echo "  make build      - 构建应用包 (.app)"
	@echo "  make run        - 构建并运行应用"
	@echo "  make sign       - 对应用进行代码签名"
	@echo "  make notarize   - 公证应用（需要 Apple 开发者账号）"
	@echo "  make package    - 完整打包流程（构建+签名+公证+DMG）"
	@echo "  make clean      - 清理构建产物"
	@echo "  make help       - 显示帮助信息"
	@echo ""
	@echo "代码签名和公证配置："
	@echo "  请在执行前设置以下环境变量："
	@echo "    DEVELOPER_ID    - 签名身份（默认: Apple Distribution）"
	@echo "    TEAM_ID         - 团队 ID"
	@echo "    APPLE_ID        - Apple ID 邮箱"
	@echo "    APPLE_ID_PASS   - 应用专用密码"
	@echo ""
	@echo "例如："
	@echo "  make build"
	@echo "  make sign DEVELOPER_ID=\"Apple Distribution: Team Name\" TEAM_ID=ABC123DEF4"
	@echo "  make package APPLE_ID=your@email.com APPLE_ID_PASS=your-app-password TEAM_ID=ABC123DEF4"

build:
	@$(SCRIPTS_DIR)/build.sh

run: build
	@open $(APP_BUNDLE)

sign:
	@$(SCRIPTS_DIR)/codesign.sh

notarize:
	@$(SCRIPTS_DIR)/notarize.sh

package:
	@$(SCRIPTS_DIR)/package.sh

clean:
	@echo "清理构建产物..."
	@rm -rf $(BUILD_DIR)
	@echo "清理完成"

