import Module = require('node:module');
import Logger = require('./logger');

class Resolver {
  moduleName: string;
  static prettier;
  static eslint;

  constructor(moduleName: string) {
    this.moduleName = moduleName;
  }

  static {
    this.prettier = Resolver.make('prettier');
    this.eslint = Resolver.make('eslint');
  }

  static make(moduleName: string) {
    return new Resolver(moduleName);
  }

  resolve(filepath: string) {
    try {
      return Module.createRequire(filepath).resolve(this.moduleName);
    }
    catch (error) {
      const e = error as Error;
      Logger.error(`[${this.moduleName}]: ${e.message}`);
      return null;
    }
  }

  require(filepath: string) {
    try {
      const modulePath = this.resolve(filepath);
      Logger.info(`Loaded ${this.moduleName} from: file://${modulePath}`);
      return require(modulePath!);
    }
    catch (error) {
      const e = error as Error;
      Logger.error(`[${this.moduleName}]: ${e.message}`);
      return null;
    }
  }
}

export = Resolver;
