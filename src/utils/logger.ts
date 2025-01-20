import vscode = require('vscode');
import packageJson = require('../../package.json');

enum LoggerType {
  Info = 'info',
  Error = 'error',
  Warning = 'warning',
  Success = 'success',
}

class Logger {
  static info: (...messages: unknown[]) => void;
  static error: (...messages: unknown[]) => void;
  static warning: (...messages: unknown[]) => void;
  static success: (...messages: unknown[]) => void;
  static outputChannel: vscode.OutputChannel;

  static {
    this.info = this.makeLogger(LoggerType.Info);
    this.error = this.makeLogger(LoggerType.Error);
    this.warning = this.makeLogger(LoggerType.Warning);
    this.success = this.makeLogger(LoggerType.Success);
    this.outputChannel = vscode.window.createOutputChannel(packageJson.displayName, 'log');
  }

  static clear() {
    this.outputChannel.clear();
  }

  static show() {
    this.outputChannel.show();
  }

  static dispose() {
    this.outputChannel.dispose();
  }

  static makeLogger(type: LoggerType) {
    return (...messages: unknown[]): void => {
      const message = messages.join(' ');
      const timestamp = this.getTimestamp();
      this.outputChannel.appendLine(`${timestamp} [${type}] ${message}`);
    };
  }

  private static getDate() {
    const date = new Date();
    const y = date.getFullYear();
    const m = this.formatNumber(date.getMonth() + 1);
    const d = this.formatNumber(date.getDate());
    return `${y}-${m}-${d}`;
  }

  private static getTime() {
    const date = new Date();
    const h = this.formatNumber(date.getHours());
    const m = this.formatNumber(date.getMinutes());
    const s = this.formatNumber(date.getSeconds());
    const ms = this.formatNumber(date.getMilliseconds(), 3);
    return `${h}:${m}:${s}.${ms}`;
  }

  private static formatNumber(n: number, length = 2) {
    return n.toString().padStart(length, '0');
  }

  private static getTimestamp() {
    return `${this.getDate()} ${this.getTime()}`;
  }
}
export = Logger;
