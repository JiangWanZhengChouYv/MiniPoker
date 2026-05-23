import { app, BrowserWindow, Tray, Menu, globalShortcut, Notification, ipcMain, nativeImage } from 'electron'
import path from 'path'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let appState = {
  isMinimized: false,
  windows: [] as { id: number; name: string; visible: boolean }[]
}

const createWindow = (name: string = 'main') => {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  win.on('close', (e: Electron.Event) => {
    if (process.platform === 'darwin') {
      e.preventDefault()
      win.hide()
    }
  })

  win.on('show', () => {
    updateWindowState(win.id, name, true)
  })

  win.on('hide', () => {
    updateWindowState(win.id, name, false)
  })

  return win
}

const createTray = () => {
  const trayIcon = nativeImage.createEmpty()
  tray = new Tray(trayIcon)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主窗口',
      click: () => {
        if (mainWindow) {
          mainWindow.show()
          mainWindow.focus()
        }
      }
    },
    {
      label: '发送测试通知',
      click: () => {
        sendNotification('MiniPoker', '这是一条测试通知！')
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit()
      }
    }
  ])

  tray.setToolTip('MiniPoker')
  tray.setContextMenu(contextMenu)

  tray.on('double-click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
        mainWindow.focus()
      }
    }
  })
}

const registerGlobalShortcuts = () => {
  globalShortcut.register('CommandOrControl+Shift+M', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
        mainWindow.focus()
      }
    }
  })

  globalShortcut.register('CommandOrControl+Shift+N', () => {
    sendNotification('MiniPoker', '全局快捷键触发！')
  })
}

const sendNotification = (title: string, body: string) => {
  if (Notification.isSupported()) {
    new Notification({ title, body }).show()
  }
}

const updateWindowState = (id: number, name: string, visible: boolean) => {
  const existingIndex = appState.windows.findIndex(w => w.id === id)
  if (existingIndex >= 0) {
    appState.windows[existingIndex].visible = visible
  } else {
    appState.windows.push({ id, name, visible })
  }

  broadcastState()
}

const broadcastState = () => {
  BrowserWindow.getAllWindows().forEach((win: BrowserWindow) => {
    win.webContents.send('state-updated', appState)
  })
}

app.whenReady().then(() => {
  mainWindow = createWindow('main')
  createTray()
  registerGlobalShortcuts()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow('main')
    } else if (mainWindow) {
      mainWindow.show()
      mainWindow.focus()
    }
  })

  ipcMain.handle('get-state', () => appState)
  ipcMain.handle('send-notification', (_: Electron.IpcMainInvokeEvent, title: string, body: string) => {
    sendNotification(title, body)
  })
  ipcMain.handle('create-window', (_: Electron.IpcMainInvokeEvent, name: string) => {
    const win = createWindow(name)
    return win.id
  })
  ipcMain.handle('close-window', (_: Electron.IpcMainInvokeEvent, id: number) => {
    const win = BrowserWindow.fromId(id)
    if (win) {
      win.close()
    }
  })
  ipcMain.handle('toggle-window', (_: Electron.IpcMainInvokeEvent, id: number) => {
    const win = BrowserWindow.fromId(id)
    if (win) {
      if (win.isVisible()) {
        win.hide()
      } else {
        win.show()
        win.focus()
      }
    }
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
