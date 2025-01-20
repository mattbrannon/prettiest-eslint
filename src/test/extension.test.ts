import assert = require('assert');
import DocumentFormatter = require('../formatter');
import path = require('path');
import vscode = require('vscode');
import packageJson = require('../../package.json');

// import Cache = require('../utils/cache');

suite('Extension Test Suite', () => {
  const extensionId = `${packageJson.publisher}.${packageJson.name}`;
  test('Extension is activated', async () => {
    const extension = vscode.extensions.getExtension(extensionId);
    await extension?.activate();
    assert.ok(extension?.isActive);
  });

  test('Formats a document', async () => {
    const filepath = vscode.Uri.file(path.resolve(process.cwd(), 'src/test/sample-file.ts'));
    const document = await vscode.workspace.openTextDocument(filepath);
    const editor = await vscode.window.showTextDocument(document);
    await editor.edit((editBuilder) => {
      editBuilder.insert(new vscode.Position(0, 0), 'var foo = 1');
    });
    const expected = 'const foo = 1;\n';
    const result = await DocumentFormatter.formatDocument(document);

    assert.equal(expected, result[0].newText);
  });
});
