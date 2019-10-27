const electron = require('electron')
const {ipcMain} = require('electron');
const {google} = require('googleapis');
const ego2 = require('./ego');
const auth = ego2();

const fs = require('fs');
const readline = require('readline');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly','https://www.googleapis.com/auth/drive.file'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

// Attach listener in the main process with the given ID
ipcMain.on('request-mainprocess-action', (event, arg) => {
    console.log(
        arg
    );

    auth.getAccessToken(
      ['https://www.googleapis.com/auth/drive.metadata.readonly','https://www.googleapis.com/auth/drive.file'],
      '61840473520-da0fmikphgj7kl1v5sg9332j8qjphja8.apps.googleusercontent.com', // client id
      '', // client secret TODO. Implement AppJS Auth https://github.com/openid/AppAuth-JS Client secret is not secure here in a desktop application
      'urn:ietf:wg:oauth:2.0:oob' // redirect uri
    )
    .then(code => {

      const oauth2Client = new google.auth.OAuth2(
        '61840473520-da0fmikphgj7kl1v5sg9332j8qjphja8.apps.googleusercontent.com',
        '', // client secret TODO. Implement AppJS Auth https://github.com/openid/AppAuth-JS Client secret is not secure here in a desktop application
        'urn:ietf:wg:oauth:2.0:oob'
      );

      oauth2Client.getToken(code, (err, token) => {
        if (err) {
          return console.error('Error retrieving access token', err);
        }

			  oauth2Client.setCredentials(token);
			
        getFiles(oauth2Client).then(function(someResult) {
          console.log('in get files ', someResult.data.files)
        })      

		  });
    })
    .catch(err => {
      console.log('error ' ,err.message);
    });  

    //Return some data to the renderer process with the mainprocess-response ID
    event.sender.send('mainprocess-response', "send a response back");
});

async function getFiles(auth) {
  let res = await new Promise((resolve, reject) => {
    const drive = google.drive({version: 'v3', auth});
    drive.files.list({
      pageSize: 5,
      fields: 'files(id, name)',
      orderBy: 'createdTime desc'
    }, function (err, res) {
      if (err) {
        reject(err);
      }
        resolve(res);
    });
  });
  console.log('files are',  res.data);
  return res;
}

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