import Module = require('node:module');
import url = require('node:url');
import fs = require('node:fs/promises');

class Loader {
  static #require;

  static {
    this.#require = Module.createRequire(url.pathToFileURL(process.cwd() + '/index').href);
  }

  static async loadModule(moduleName: string, useCache = true) {
    const pathToModule = this.resolveModule(moduleName);

    try {
      return this.requireModule(pathToModule, useCache);
    }
    catch {
      return this.importModule(pathToModule, useCache);
    }
  }

  static resolveModule(moduleName: string) {
    try {
      return this.#require.resolve(moduleName);
    }
    catch {
      const sanitizedPath = this.normalizeFilePath(moduleName);
      return this.#require.resolve(sanitizedPath);
    }
  }

  private static async importModule(pathToModule: string, useCache = true) {
    const importPath = useCache ? pathToModule : `${pathToModule}?${Date.now()}`;
    const isJson = await this.isJson(pathToModule);

    switch (true) {
      case isJson: {
        return await this.parseJsonFile(pathToModule);
      }
      default: {
        return await this.dynamicImport(importPath);
      }
    }
  }

  private static requireModule(pathToModule: string, useCache = true) {
    if (!useCache) {
      delete this.#require.cache[this.#require.resolve(pathToModule)];
    }
    return this.#require(pathToModule);
  }

  static async isJson(pathToModule: string) {
    try {
      if (pathToModule.endsWith('.json')) {
        return true;
      }
      const content = await fs.readFile(pathToModule, 'utf-8');
      JSON.parse(content);
      return true;
    }
    catch {
      return false;
    }
  }

  static async parseJsonFile(pathToModule: string) {
    try {
      const content = await fs.readFile(pathToModule, 'utf-8');
      return JSON.parse(content);
    }
    catch (error) {
      throw new Error(`Error: Could not import JSON module: ${pathToModule}`, { cause: error });
    }
  }

  private static async dynamicImport(pathToModule: string) {
    try {
      const module = await import(pathToModule);
      return module.default || module;
    }
    catch (error) {
      throw new Error(`Error: Could not import module: ${pathToModule}`, { cause: error });
    }
  }

  private static normalizeFilePath(modulePath: string) {
    const fileUrl = url.pathToFileURL(modulePath).href;
    const filepath = url.fileURLToPath(fileUrl);
    return filepath;
  }
}

export = Loader;
