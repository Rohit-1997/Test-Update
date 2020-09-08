const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });


//   console.log("Checking for updates in main")
  
  

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('Test event', 'hey there')
    autoUpdater.checkForUpdatesAndNotify();
  })
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});



ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});


autoUpdater.on('checking-for-update', () => {
    console.log("Checking for auto update")
})

autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('Test event', 'Inside update available')
});


autoUpdater.on('update-downloaded', (event) => {
    mainWindow.webContents.send('Test event', 'Inside update downloaded')
});


autoUpdater.on('error', (info) => {
    console.log("The error inauto update: ",info)
})