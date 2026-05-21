"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  showNotification: (title, body) => {
    return electron.ipcRenderer.invoke("show-notification", title, body);
  }
});
