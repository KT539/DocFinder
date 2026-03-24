/* acts as the sole secure bridge between the main process (Node.js)
and the renderer process (Chromium+React), avoiding direct Node.js access from the renderer */

// import the ipcRenderer object, and the contextBridge module which allows to safely expose functions to the renderer
const { contextBridge, ipcRenderer } = require('electron');

// creates the window.electronAPI object, making it accessible from the renderer
contextBridge.exposeInMainWorld('electronAPI', {
    // each function sends a message to the main process via ipcRenderer.invoke and returns a promise
    scanPdfs: (folderPath) => ipcRenderer.invoke('scan-pdfs', folderPath),
    selectDirectory: () => ipcRenderer.invoke('select-directory'),
    getLibrary: () =>ipcRenderer.invoke('get-library'),
    addToLibrary: (pdf) => ipcRenderer.invoke('add-to-library', pdf),
    removeFromLibrary: (pdfPath) => ipcRenderer.invoke('remove-from-library', pdfPath),
    openPdf: (filePath) => ipcRenderer.invoke('open-pdf', filePath),
});