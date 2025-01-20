import vscode = require('vscode');
import PrettierFormatter = require('./prettier');
import ESLintFormatter = require('./eslint');
import Logger = require('../utils/logger');

class DocumentFormatter {
  document: vscode.TextDocument;
  constructor(document: vscode.TextDocument) {
    this.document = document;
  }

  static async formatDocument(document: vscode.TextDocument) {
    Logger.clear();
    const prettierOutput = await new PrettierFormatter(document).formatDocument();
    const eslintOutput = await new ESLintFormatter(document).formatString(prettierOutput);

    Logger.info(`Document formatted: file://${document.fileName}`);

    const firstLine = document.lineAt(0);
    const lastLine = document.lineAt(document.lineCount - 1);
    const fullRange = new vscode.Range(firstLine.range.start, lastLine.range.end);

    return [ vscode.TextEdit.replace(fullRange, eslintOutput) ];
  }
}

export = DocumentFormatter;
