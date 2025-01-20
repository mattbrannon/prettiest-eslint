import Resolver = require('../utils/resolver');
import System = require('../utils/system');
import Logger = require('../utils/logger');

import type * as Prettier from 'prettier';
import type vscode from 'vscode';

class PrettierFormatter {
  prettier: typeof Prettier;
  document: vscode.TextDocument;
  constructor(document: vscode.TextDocument) {
    this.document = document;
    this.prettier = Resolver.prettier.require(document.fileName);
  }

  async isIgnored() {
    const ignorePath = System.searchUp(this.document.fileName, [ '.prettierignore' ]);
    const info = await this.prettier.getFileInfo(this.document.fileName, { ignorePath });
    return info.ignored;
  }

  async formatDocument() {
    const text = this.document.getText();
    const filepath = this.document.fileName;
    const logPath = filepath.replace(System.workspaceRoot, '.');

    if (await this.isIgnored()) {
      Logger.info(`[Prettier]: File is ignored: ${logPath}`);
      return text;
    }

    try {
      const config = (await this.prettier.resolveConfigFile(filepath)) || undefined;
      const options = await this.prettier.resolveConfig(filepath, { useCache: false, config });
      const formatted = await this.prettier.format(text, { ...options, filepath });
      // Logger.info(`[Prettier]: File formatted: ${logPath}`);
      return formatted;
    }
    catch (error) {
      const e = error as Error;
      Logger.error(`[Prettier]: ${e.message}`);
      return text;
    }
  }
}

export = PrettierFormatter;
