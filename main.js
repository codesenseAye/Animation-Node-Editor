const { app, BrowserWindow } = require('electron')

const url = require('url') 
const path = require('path')  

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,

      frame: false,

      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      }
    })
    
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