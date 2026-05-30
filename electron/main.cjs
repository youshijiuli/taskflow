const { app, BrowserWindow } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

let mainWindow = null;
let server = null;

const PORT = 18920;

function startServer() {
  const distPath = path.join(__dirname, '../dist');

  server = http.createServer((req, res) => {
    let filePath = path.join(distPath, req.url === '/' ? '/index.html' : req.url.split('?')[0]);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distPath, 'index.html');
    }
    const ext = path.extname(filePath);
    const mimeTypes = {
      '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
      '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json',
      '.webmanifest': 'application/json', '.ico': 'image/x-icon',
    };
    const mime = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': mime,
      'Access-Control-Allow-Origin': '*',
    });
    fs.createReadStream(filePath).pipe(res);
  });

  server.listen(PORT, '127.0.0.1', () => {
    console.log('TaskFlow server running on http://127.0.0.1:' + PORT);
    createWindow();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 480,
    height: 900,
    title: 'TaskFlow',
    backgroundColor: '#f8f9fb',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL('http://127.0.0.1:' + PORT);
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(startServer);

app.on('window-all-closed', () => {
  if (server) server.close();
  app.quit();
});
