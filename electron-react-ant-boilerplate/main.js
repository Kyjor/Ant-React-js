"use strict";

// Import parts of electron to use
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Temporary fix broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === "win32") {
  app.commandLine.appendSwitch("high-dpi-support", "true");
  app.commandLine.appendSwitch("force-device-scale-factor", "1");
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    // You need to activate `nativeWindowOpen`
    webPreferences: { nativeWindowOpen: true },
  });

  // and load the index.html of the app.
  let indexPath;

  if (isDev && process.argv.indexOf("--noDevServer") === -1) {
    indexPath = url.format({
      protocol: "http:",
      host: "localhost:3100",
      pathname: "index.html",
      slashes: true
    });
  } else {
    indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "dist", "index.html"),
      slashes: true
    });
  }

  mainWindow.loadURL(indexPath);

  // Don't show until we are ready and loaded
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    // Open the DevTools automatically if developing
    if (isDev) {
      mainWindow.webContents.openDevTools();

      mainWindow.webContents.on("context-menu", (e, props) => {
        const { x, y } = props;

        Menu.buildFromTemplate([
          {
            label: "Inspect element",
            click: () => {
              mainWindow.inspectElement(x, y);
            }
          }
        ]).popup(mainWindow);
      });
    }
  });

  mainWindow.webContents.on('new-window',
    (event, url, frameName, disposition, options, additionalFeatures) =>
    {
      // This is the name we chose for our window. You can have multiple names for
      // multiple windows and each have their options
      if (frameName === 'NewWindowComponent ') {
        event.preventDefault();
        Object.assign(options, {
          // This will prevent interactions with the mainWindow
          parent: mainWindow,
          width: 300,
          height: 300,
          // You can also set `left` and `top` positions
        });
        event.newGuest = new BrowserWindow(options);
      }
    });

  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}
ipcMain.on('test', (event, arg) => {
  console.log('here 001', arg)
  mainWindow.send('test1', arg)
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('project:window',
  () =>{
    console.log('addinga i');
    createAddWindow
  }
);

ipcMain.on('MSG_FROM_RENDERER', (event,card) => {
    console.log('item text');
    console.log(card);
    createNewWindow();
  }
);

function createAddWindow() {
  console.log('making it')
  let addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add Shopping List Item',
    webPreferences: {
      nodeIntegration: true
      , enableRemoteModule: true
    }
  });



  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'timerWindow'),
    protocol: 'file:',
    slashes: true
  }));


  addWindow.on('close', function () {
    addWindow = null;
  });
}

function createTimerWindow(card)
{
  console.log(__dirname);
 let timerWindow = new BrowserWindow({
    width: 400,
    height: 250,
    title: 'NewTimerWindow',
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true
      , enableRemoteModule: true
    }
  });

  timerWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/src/screens/ProjectPage/ProjectPage.js'),
    protocol:'file:',
    slashes: true
  }));
  timerWindow.webContents.on('did-finish-load', () => {
    timerWindow.webContents.send('passNodeToTimer', card)
  })
  timerWindow.on('close', function(){
    // timerWindow.webContents.send('passNodeDataBack', nodeDict)
    timerWindow = null;
  });

}
let timerWindow;
function createNewWindow() {
  // Create the browser window.
  timerWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    // You need to activate `nativeWindowOpen`
    webPreferences: { nativeWindowOpen: true },
  });

  // and load the index.html of the app.
  let timerPath;

  if (isDev && process.argv.indexOf("--noDevServer") === -1) {
    timerPath = url.format({
      protocol: "http:",
      host: "localhost:3100",
      pathname: "timer.html",
      slashes: true
    });
  } else {
    timerPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "dist", "timer.html"),
      slashes: true
    });
  }

  timerWindow.loadURL(timerPath);

  // Don't show until we are ready and loaded
  timerWindow.once("ready-to-show", () => {
    timerWindow.show();

    // Open the DevTools automatically if developing
    if (isDev) {
      timerWindow.webContents.openDevTools();

      timerWindow.webContents.on("context-menu", (e, props) => {
        const { x, y } = props;

        Menu.buildFromTemplate([
          {
            label: "Inspect element",
            click: () => {
              timerWindow.inspectElement(x, y);
            }
          }
        ]).popup(timerWindow);
      });
    }
  });

  timerWindow.webContents.on('new-window',
    (event, url, frameName, disposition, options, additionalFeatures) =>
    {
      // This is the name we chose for our window. You can have multiple names for
      // multiple windows and each have their options
      if (frameName === 'NewWindowComponent ') {
        event.preventDefault();
        Object.assign(options, {
          // This will prevent interactions with the mainWindow
          parent: timerWindow,
          width: 300,
          height: 300,
          // You can also set `left` and `top` positions
        });
        event.newGuest = new BrowserWindow(options);
      }
    });

  // Emitted when the window is closed.
  timerWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    timerWindow = null;
  });
}
