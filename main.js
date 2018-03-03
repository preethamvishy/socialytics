const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
require('dotenv').config();
exports.instalytics = require('instalytics');

let win = null;

app.on('ready', function () {

    win = new BrowserWindow({
        height: '600px',
        width: '800px',
    });

    win.maximize();

    if (process.env.PACKAGE === 'true') {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    } else {
        win.loadURL(process.env.HOST);
        win.webContents.openDevTools();
    }

    win.on('closed', function () {
        win = null;
    });

});

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

