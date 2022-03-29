const { app, BrowserWindow } = require('electron')
require('@electron/remote/main').initialize()

const url = require('url') 
const path = require('path')  

const createWindow = () => {
    var win = new BrowserWindow({
      width: 800,
      height: 600,

      frame: false,

      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      }
    })
    
    require("@electron/remote/main").enable(win.webContents);
    
    win.loadURL(url.format ({ 
      pathname: path.join(__dirname, 'index.html'), 
      protocol: 'file:', 
      slashes: true 
    }))
  }

  app.on("ready", () => {
    createWindow()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })