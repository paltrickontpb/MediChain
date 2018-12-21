const {app,BrowserWindow,ipcMain} = require('electron')

let loginScreen

function setVisitWindow() {

  visitWindow = new BrowserWindow({
    width: 600,
    height: 400,
    icon: './assets/app/icon64.png'
  })

  visitWindow.loadFile('dashboard/visits.html')

  visitWindow.on('closed', function () {

    visitWindow = null
  })
}

function createWindow () {

  loginScreen = new BrowserWindow({
    width: 1366, 
    height: 768,
    icon: './assets/app/icon64.png'
  })
  loginScreen.maximize()

  loginScreen.loadFile('index.html')

  loginScreen.webContents.openDevTools()

  loginScreen.on('closed', function () {

    loginScreen = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

//IPC Functions

ipcMain.on('channel1',(e,args) => {
  console.log(args)
  if (args == 'admin'){
    loginScreen.loadFile('dashboard/index.html')
  } else if (args == 'logout'){
    loginScreen.loadFile('index.html')
  } else if (args == 'dashboard'){
    loginScreen.loadFile('dashboard/index.html')
  }else if (args == 'query'){
    loginScreen.loadFile('dashboard/query.html')
  } else if (args == 'visit'){
    setVisitWindow();
  }
})

//Darwin Specific Func

app.on('activate', function () {
  if (loginScreen === null) {
    createWindow()
  }
})
