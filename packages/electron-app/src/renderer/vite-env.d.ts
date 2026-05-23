/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface WindowState {
  id: number
  name: string
  visible: boolean
}

interface AppState {
  isMinimized: boolean
  windows: WindowState[]
}

interface ElectronAPI {
  getState: () => Promise<AppState>
  sendNotification: (title: string, body: string) => Promise<void>
  createWindow: (name: string) => Promise<number>
  closeWindow: (id: number) => Promise<void>
  toggleWindow: (id: number) => Promise<void>
  onStateUpdated: (callback: (state: AppState) => void) => void
  removeStateUpdatedListener: () => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
