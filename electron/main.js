const { app, BrowserWindow } = require('electron');
const path = require('path'); // Doit être AVANT electron-reload
const { spawn } = require('child_process');

// Initialisation de electron-reload
require('electron-reload')(__dirname, {
  electron: path.join(__dirname, '../node_modules/.bin/electron')
});

let phpServer;

function startPhpServer() {
  // Lance le serveur PHP 8 local pour la logique métier [cite: 29]
  phpServer = spawn('php', ['-S', 'localhost:8000', '-t', path.join(__dirname, '../backend')]);

  phpServer.stdout.on('data', (data) => console.log(`PHP: ${data}`));
  phpServer.stderr.on('data', (data) => console.error(`PHP Error: ${data}`));
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 750,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  startPhpServer(); // Lance PHP avant de créer la fenêtre
  createWindow();
});

// Très important : couper PHP quand on ferme l'app
app.on('window-all-closed', () => {
  if (phpServer) phpServer.kill();
  if (process.platform !== 'darwin') app.quit();
});