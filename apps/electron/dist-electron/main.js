"use strict";
const electron = require("electron");
const path = require("node:path");
let mainWindow = null;
let tray = null;
const createWindow = () => {
  mainWindow = new electron.BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
  mainWindow.on("close", (e) => {
    if (!electron.app.isQuitting) {
      e.preventDefault();
      mainWindow == null ? void 0 : mainWindow.hide();
    }
  });
};
const createTray = () => {
  tray = new electron.Tray(path.join(__dirname, "../electron/icon.png"));
  const contextMenu = electron.Menu.buildFromTemplate([
    {
      label: "显示主窗口",
      click: () => {
        mainWindow == null ? void 0 : mainWindow.show();
        mainWindow == null ? void 0 : mainWindow.focus();
      }
    },
    {
      type: "separator"
    },
    {
      label: "显示通知",
      click: () => {
        showNotification("Mini Poker", "这是一个桌面通知！");
      }
    },
    {
      type: "separator"
    },
    {
      label: "退出",
      click: () => {
        electron.app.isQuitting = true;
        electron.app.quit();
      }
    }
  ]);
  tray.setToolTip("Mini Poker");
  tray.setContextMenu(contextMenu);
  tray.on("double-click", () => {
    mainWindow == null ? void 0 : mainWindow.show();
    mainWindow == null ? void 0 : mainWindow.focus();
  });
};
const registerGlobalShortcuts = () => {
  electron.globalShortcut.register("CommandOrControl+Alt+M", () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });
  electron.globalShortcut.register("CommandOrControl+Alt+N", () => {
    showNotification("Mini Poker", "这是通过快捷键触发的通知！");
  });
};
const showNotification = (title, body) => {
  if (electron.Notification.isSupported()) {
    const notification = new electron.Notification({
      title,
      body,
      icon: path.join(__dirname, "../electron/icon.png")
    });
    notification.show();
  }
};
electron.app.whenReady().then(() => {
  createWindow();
  createTray();
  registerGlobalShortcuts();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  electron.ipcMain.handle("show-notification", (event, title, body) => {
    showNotification(title, body);
  });
});
electron.app.on("will-quit", () => {
  electron.globalShortcut.unregisterAll();
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
