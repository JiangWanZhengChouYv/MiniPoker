import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getState: () => ipcRenderer.invoke('get-state'),
  sendNotification: (title: string, body: string) => ipcRenderer.invoke('send-notification', title, body),
  createWindow: (name: string) => ipcRenderer.invoke('create-window', name),
  closeWindow: (id: number) => ipcRenderer.invoke('close-window', id),
  toggleWindow: (id: number) => ipcRenderer.invoke('toggle-window', id),
  onStateUpdated: (callback: (state: any) => void) => {
    ipcRenderer.on('state-updated', (_: Electron.IpcRendererEvent, state: any) => callback(state))
  },
  removeStateUpdatedListener: () => {
    ipcRenderer.removeAllListeners('state-updated')
  }
})
