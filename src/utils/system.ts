import fs = require('fs');
import path = require('path');
import vscode = require('vscode');
import Loader = require('./loader');

import type { ESLintConfig } from '../types';

enum ESLintConfigType {
  FLAT = 'flat',
  ESLINTRC = 'eslintrc',
}

const flatConfigs = [ 'eslint.config.js', 'eslint.config.mjs', 'eslint.config.cjs' ];
const rcConfigs = [ '.eslintrc.js', '.eslintrc.cjs', '.eslintrc.json', '.eslintrc' ];

class System {
  static get workspaceRoot() {
    return System.getWorkspaceRoot();
  }

  static get files() {
    return System.traverse();
  }

  static getDocumentWorkspace(document: vscode.TextDocument) {
    return vscode.workspace.workspaceFolders?.find((folder) =>
      document.fileName.startsWith(folder.uri.fsPath),
    )?.uri.fsPath;
  }

  static traverse(root = System.workspaceRoot): string[] {
    return System.readDir(root)
      .map((file) => (System.isDirectory(file) ? System.traverse(file) : file))
      .flat(Infinity as 1)
      .filter((file) => System.isFile(file));
  }

  static getWorkspaceRoot() {
    const activeFile = vscode.window.activeTextEditor?.document.fileName;
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (activeFile && workspaceFolders && workspaceFolders.length > 1) {
      return (
        workspaceFolders.find((folder) => activeFile.startsWith(folder.uri.fsPath))?.uri.fsPath ||
        process.cwd()
      );
    }
    return workspaceFolders?.[0].uri.fsPath || process.cwd();
  }

  static isDirectory(filepath: string) {
    try {
      return fs.statSync(filepath).isDirectory() && !filepath.includes('node_modules');
    }
    catch (error) {
      return false;
    }
  }

  static isFile(filepath: string) {
    try {
      return fs.statSync(filepath).isFile() && !System.isDeclarationFile(filepath);
    }
    catch (error) {
      return false;
    }
  }

  static isDeclarationFile(file: string) {
    return /.*\.d\.[cm]*ts(\.map)?$/.test(file);
  }

  static readDir(directory: string): string[] {
    try {
      return fs.readdirSync(path.resolve(directory)).map((file) => path.resolve(directory, file));
    }
    catch (error) {
      return [];
    }
  }

  static getFilesInDirectory(dir: string) {
    return System.readDir(dir).filter((file) => System.isFile(file));
  }

  static getConfigNames() {
    const useFlatConfig = vscode.workspace.getConfiguration('eslint').get('useFlatConfig');
    const configNames =
      useFlatConfig === true
        ? flatConfigs
        : useFlatConfig === false
          ? rcConfigs
          : [ ...flatConfigs, ...rcConfigs ];
    return configNames;
  }

  static getESLintConfigPath(filepath: string) {
    const configNames = System.getConfigNames();
    const configPath = System.searchUp(filepath, configNames);
    if (!configPath) {
      throw new Error('ESLint config path not found');
    }
    return configPath;
  }

  static getESLintConfigType(config: ESLintConfig) {
    return Array.isArray(config) ? ESLintConfigType.FLAT : ESLintConfigType.ESLINTRC;
  }

  static async getESLintConfig(configPath: string) {
    return (await Loader.loadModule(configPath, false)) as ESLintConfig;
  }

  static async getESLintConfigData(filepath: string) {
    const configPath = System.getESLintConfigPath(filepath);
    const config = await System.getESLintConfig(configPath);
    const configType = System.getESLintConfigType(config);

    // Cache.files.set(filepath, { configPath, configType });
    // Cache.eslintConfigs.set(configPath, config);

    return {
      config,
      configPath,
      configType,
    };
  }

  static searchDirectory(currentFolder: string, fileNames: string[]) {
    const files = System.getFilesInDirectory(currentFolder);
    const file = fileNames.find((filename) => files.includes(path.resolve(currentFolder, filename)));
    return file ? path.resolve(currentFolder, file) : undefined;
    // return FileSystem.getFiles(currentFolder).find((file) => fileNames.includes(path.basename(file)));
  }

  static searchUp(filepath: string, fileNames: string[]) {
    const outOfBounds = path.resolve(System.getWorkspaceRoot(), '..');
    let currentFolder = System.isDirectory(filepath) ? filepath : path.dirname(filepath);
    while (currentFolder !== outOfBounds) {
      const matchingFile = System.searchDirectory(currentFolder, fileNames);
      if (matchingFile) {
        return matchingFile;
      }
      currentFolder = path.dirname(currentFolder);
    }
    return undefined;
  }
}

export = System;
