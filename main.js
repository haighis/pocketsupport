const electron = require('electron')

const {ipcMain} = require('electron');

const ego = require('./ego');
const auth = ego();

// Attach listener in the main process with the given ID
ipcMain.on('request-mainprocess-action', (event, arg) => {
    // Displays the object sent from the renderer process:
    //{
    //    message: "Hi",
    //    someData: "Let's go"
    //}
    console.log(
        arg
    );

    auth.getAccessToken(
      ['https://www.googleapis.com/auth/drive.metadata.readonly','https://www.googleapis.com/auth/drive.appdata','https://www.googleapis.com/auth/drive.file'],
      '', // client id
      '', // client secret
      'urn:ietf:wg:oauth:2.0:oob' // redirect uri
    )
    .then(token => {
      console.log(' in get token', JSON.stringify(token))
      
    //	app.removeListener('will-quit', preventQuit);
    //	app.quit();
    })
    .catch(err => {
      console.log('error ' ,err.message);
    });  

    // Return some data to the renderer process with the mainprocess-response ID
    //event.sender.send('mainprocess-response', "Hello World!");
});

//const { ipcRenderer } = require('electron');

//console.log(' in load ', ipcMain)
//ipcRenderer.on('some-event-2', (evt) => console.log('test from ipc renderer')); // 'Yay'

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  
  require('./menu')
  console.log('in create window')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.