const { app, BrowserWindow, dialog, ipcMain } = require('electron'); // import the electron app itself (BrowserWindow = the class representing a window in the app)
const path = require('path'); // native Node module to handle file paths cross-platform
const { spawn } = require('child_process'); // native Node module to launch external processes from the app, like my PHP server

// electron-reload initialization
require('electron-reload')(__dirname, {
  electron: path.join(__dirname, '../node_modules/.bin/electron')
});

let phpServer;

function startPhpServer() {
  // launch PHP's integrated dev server on port 8000, directed to the backend/ files
  phpServer = spawn('php', ['-S', 'localhost:8000', '-t', path.join(__dirname, '../backend')]);
  // event listeners on PHP server data and errors
  phpServer.stdout.on('data', (data) => console.log(`PHP: ${data}`));
  phpServer.stderr.on('data', (data) => console.error(`PHP Error: ${data}`));
}

// create a new window with IPC security enabled and load the React app from Vite's dev server
function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 750,
    webPreferences: {
      nodeIntegration: false, // disable the renderer's direct access to Node.js
      contextIsolation: true, // isolate the renderer for better security
      preload: path.join(__dirname, 'preload.js') // bridge for IPC communication between main and renderer processes
    }
  });

  win.loadURL('http://localhost:5173'); // load React app served by Vite
}

// listens to ipcRenderer messages on the "IPC canal" scan-pdfs, and executes the async callback in response
ipcMain.handle('scan-pdfs', async (event, folderPath) => {
  try {
    // encoreURIComponent ensures special characters don't break the URL
    const response = await fetch(`http://localhost:8000/scan.php?path=${encodeURIComponent(folderPath)}&type=pdf`);
    // after the fetch, parse the response in JSON
    const data = await response.json();
    // return the data not just locally, but to the renderer through the IPC
    return data;
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('select-directory', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  if (result.canceled) {
    return null;
  } else {
    return result.filePaths[0];
  }
})

// event triggering once electron is ready to create a window
app.whenReady().then(() => {
  startPhpServer(); // start PHP first, so that the backend is already set up when the window loads
  createWindow();
});

// listener triggering when all windows are closed
app.on('window-all-closed', () => {
  if (phpServer) phpServer.kill(); // so that the PHP doesn't continue in the background while the app is closed
  if (process.platform !== 'darwin') app.quit(); // electron convention for macOS
});