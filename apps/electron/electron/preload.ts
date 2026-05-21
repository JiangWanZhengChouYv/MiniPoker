import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  showNotification: (title: string, body: string) => {
    return ipcRenderer.invoke('show-notification', title, body);
  }
});
