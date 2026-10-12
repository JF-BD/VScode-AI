export class Logger {
  private static instance: Logger;
  private logs: Array<{ timestamp: number; level: 'info' | 'warn' | 'error' | 'debug'; message: string; data?: any }> = [];
  private listeners: Array<(log: { timestamp: number; level: 'info' | 'warn' | 'error' | 'debug'; message: string; data?: any }) => void> = [];

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public info(message: string, data?: any): void {
    this.addLog('info', message, data);
  }

  public warn(message: string, data?: any): void {
    this.addLog('warn', message, data);
  }

  public error(message: string, data?: any): void {
    this.addLog('error', message, data);
  }

  public debug(message: string, data?: any): void {
    this.addLog('debug', message, data);
  }

  private addLog(level: 'info' | 'warn' | 'error' | 'debug', message: string, data?: any): void {
    const entry = { timestamp: Date.now(), level, message, data };
    this.logs.push(entry);
    if (this.logs.length > 500) {
      this.logs.shift();
    }
    console.log(`[SI VsCode AI][${level.toUpperCase()}] ${message}`, data || '');
    this.listeners.forEach((fn) => fn(entry));
  }

  public getRecentLogs(count = 50) {
    return this.logs.slice(-count);
  }

  public onLog(listener: (log: any) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

export const logger = Logger.getInstance();
