const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron'); // import the needed electron modules
const path = require('path'); // native Node module to handle file paths cross-platform
const { spawn } = require('child_process'); // native Node module to launch external processes from the app, like my PHP server
const Store = require('electron-store'); // allows for persistent storage in a JSON file (%APPDATA%\docfinder\config.json)
const store = new Store();

// electron-reload initialization
require('electron-reload')(__dirname, {
  electron: path.join(__dirname, '../node_modules/.bin/electron')
});

let phpServer;

// launch PHP's integrated dev server on port 8000, directed to the backend/ folder
function startPhpServer() {
  phpServer = spawn('php', ['-S', 'localhost:8000', '-t', path.join(__dirname, '../backend')]);
  // event listeners on PHP server data and errors
  phpServer.stdout.on('data', (data) => console.log(`PHP: ${data}`));
  phpServer.stderr.on('data', (data) => console.error(`PHP Error: ${data}`));
}

// creates the main app window with IPC security enabled and load the React app from Vite's dev server
function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 750,
    webPreferences: {
      nodeIntegration: false, // disable the renderer's direct access to Node.js
      contextIsolation: true, // isolate the renderer for better security
      preload: path.join(__dirname, 'preload.js') // runs preload.js before the renderer
    }
  });

  win.loadURL('http://localhost:5173'); // load the React app served by Vite
}

// handles the 'scan-pdfs' call from the renderer : fetches the PHP backend and returns the list of pdfs
ipcMain.handle('scan-pdfs', async (event, folderPath) => {
  try {
    // encodeURIComponent ensures special characters in the path don't break the URL
    const response = await fetch(`http://localhost:8000/scan.php?path=${encodeURIComponent(folderPath)}&type=pdf`);
    // parse the PHP response as JSON
    const data = await response.json();
    // returned value is sent back to the renderer via the IPC
    return data;
  } catch (error) {
    return { error: error.message };
  }
});

// handles the 'select-directory' IPC call : opens the windows file explorer and returns the selected path
ipcMain.handle('select-directory', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  if (result.canceled) {
    return null; // return null if the user closed the dialog without selecting
  } else {
    return result.filePaths[0]; // return the selected folder path
  }
}),

// handles the 'get-library' IPC call : returns the saved library from the persistent store
ipcMain.handle('get-library', () => {
  return store.get('library', []); // empty array if no library has been saved yet
});

// handles the 'add-to-library' IPC call : adds a PDF to the library if it isn't already in it, then returns the updated library
ipcMain.handle('add-to-library', (event, pdf) => {
  const library = store.get('library', []);
  if (!library.find(p => p.path === pdf.path)) { // checks if the path already exists, to prevent duplicates
    library.push(pdf);
    store.set('library', library);
  }
  return store.get('library');
});

// handles the 'remove-from-library' IPC call : filters out the PDF with the given path, then returns the updated library
ipcMain.handle('remove-from-library', (event, pdfPath) => {
  const library = store.get('library', []);
  store.set('library', library.filter(p => p.path !== pdfPath));
  return store.get('library');
});

// handles the 'open-pdf' IPC call : opens the file at the given path with the OS default PDF viewer
ipcMain.handle('open-pdf', (event, filePath) => {
    shell.openPath(filePath);
})

// triggers once electron is initialized : start the PHP server, then create a window
app.whenReady().then(() => {
  startPhpServer();
  createWindow();
});

// triggers when all windows are closed
app.on('window-all-closed', () => {
  if (phpServer) phpServer.kill(); // terminate the PHP process so it doesn't keep running in the background
  if (process.platform !== 'darwin') app.quit(); // electron convention for macOS ; !! help from AI !!
});