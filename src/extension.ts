import vscode = require('vscode');
import Logger = require('./utils/logger');
import DocumentFormatter = require('./formatter');
import packageJson = require('../package.json');
import supportedLanguages = require('./static');

async function activate(context: vscode.ExtensionContext) {
  for (const language of supportedLanguages) {
    const provider = vscode.languages.registerDocumentRangeFormattingEditProvider(language, {
      async provideDocumentRangeFormattingEdits(document: vscode.TextDocument): Promise<vscode.TextEdit[]> {
        return await DocumentFormatter.formatDocument(document);
      },
    });

    context.subscriptions.push(provider);
  }

  Logger.info(packageJson.displayName, 'version', packageJson.version);
}

function deactivate(context: vscode.ExtensionContext) {
  context.subscriptions.forEach((subscription) => subscription.dispose());
  Logger.dispose();
}

export = { activate, deactivate };
