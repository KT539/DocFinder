/*meant to be the secured bridge, and only point of contact, between the
the main process (Nodes) and the renderer process (Chromium+React)*/

// import both theipcRenderer object, and an API that allows to safely expose functions to the renderer
const { contextBridge, ipcRenderer } = require('electron');

// exposeInMainWorld creates an object in window
contextBridge.exposeInMainWorld('electronAPI', {
    // list of functions in electronAPI object
    // send the scan-pdfs function with a path as parameter, and wait for ipcMain's response
    scanPdfs: (folderPath) => ipcRenderer.invoke('scan-pdfs', folderPath)
});