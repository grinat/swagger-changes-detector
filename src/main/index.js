import { app, BrowserWindow, ipcMain, dialog } from 'electron'
const fs = require('fs')
const path = require('path')
const appPackage = require('../../package')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 500,
    useContentSize: true,
    width: process.env.NODE_ENV !== 'development' ? 700 : 1100
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

const appDir = path.join(app.getPath('appData'), appPackage.name)
const createDirs = (dirs) => {
  if (!fs.existsSync(appDir)){
    fs.mkdirSync(appDir)
  }
  dirs.forEach(dir => {
    let fullPath = path.join(appDir, dir)
    if (!fs.existsSync(fullPath)){
      fs.mkdirSync(fullPath)
    }
  })
}

const send = (action, _queueId, data) => {
  mainWindow.send(action, {
    _queueId,
    ...data
  })
}

ipcMain.on('saveFile', (event, {data, name, _queueId}) => {
  let returnData = {}
  try {
    createDirs(['files'])
    let filePath = path.join(appDir, 'files', name)
    fs.writeFileSync(filePath, data, 'utf-8')
    returnData = {
      filePath
    }
  } catch (e) {
    returnData = {
      error: e.toString()
    }
  }
  send('saveFile', _queueId, returnData)
})

ipcMain.on('readFile', (event, {filePath, asString = true, _queueId}) => {
  let returnData = {}
  try {
    let data = fs.readFileSync(filePath)
    if (asString) {
      data = data.toString()
    }
    returnData = {
      data
    }
  } catch (e) {
    returnData = {
      error: e.toString()
    }
  }
  send('readFile', _queueId, returnData)
})

ipcMain.on('removeFile', (event, {filePath, _queueId}) => {
  let returnData = {}
  try {
    let result = fs.unlinkSync(filePath)
    returnData = {
      result
    }
  } catch (e) {
    returnData = {
      error: e.toString()
    }
  }
  send('removeFile', _queueId, returnData)
})
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  }

  dialog.showMessageBox(dialogOpts, (response) => {
    if (response === 0) autoUpdater.quitAndInstall()
  })
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})

app.commandLine.appendSwitch('remote-debugging-port', '9222')
