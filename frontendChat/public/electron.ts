import { app, BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import * as path from 'path';
import { isDev } from './utils/constants';

interface WindowOptions {
  width: number;
  height: number;
  alwaysOnTop: boolean;
  frame: boolean;
  transparent: boolean;
}

class ElectronApp {
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    app.whenReady().then(() => this.createWindow());
    app.on('window-all-closed', this.onWindowAllClosed);
    app.on('activate', this.onActivate);
  }

  private createWindow(): void {
    const windowOptions: WindowOptions = {
      width: 1200,
      height: 800,
      alwaysOnTop: true,
      frame: false,
      transparent: true
    };

    this.mainWindow = new BrowserWindow({
      ...windowOptions,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
        preload: path.join(__dirname, 'preload.js')
      }
    });

    const startUrl = isDev 
      ? 'http://localhost:3000' 
      : `file://${path.join(__dirname, '../build/index.html')}`;
    
    this.mainWindow.loadURL(startUrl);
    this.mainWindow.setAlwaysOnTop(true, 'screen-saver');
    this.setupIpcHandlers();
  }

  private setupIpcHandlers(): void {
    ipcMain.handle('toggle-always-on-top', (_event: IpcMainEvent, flag: boolean) => {
      if (this.mainWindow) {
        this.mainWindow.setAlwaysOnTop(flag, 'screen-saver');
      }
    });

    ipcMain.handle('minimize-window', () => {
      if (this.mainWindow) {
        this.mainWindow.minimize();
      }
    });
  }

  private onWindowAllClosed = (): void => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  };

  private onActivate = (): void => {
    if (BrowserWindow.getAllWindows().length === 0) {
      this.createWindow();
    }
  };
}

new ElectronApp();