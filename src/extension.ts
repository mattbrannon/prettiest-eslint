import vscode = require('vscode');
import Logger = require('./utils/logger');
import DocumentFormatter = require('./formatter');
import packageJson = require('../package.json');

const supportedLanguages = [
  'css',
  'graphql',
  'html',
  'javascript',
  'javascriptreact',
  'json',
  'jsonc',
  'less',
  'markdown',
  'mdx',
  'scss',
  'svelte',
  'typescript',
  'typescriptreact',
  'vue',
  'yaml',
];

async function activate(context: vscode.ExtensionContext) {
  Logger.show();
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
  Logger.info(packageJson.displayName, 'deactivated');
  context.subscriptions.forEach((subscription) => subscription.dispose());
  Logger.dispose();
}

export = { activate, deactivate };
