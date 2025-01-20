const { defineConfig } = require('@vscode/test-cli');

module.exports = defineConfig({
  files: '../compiled/test/**/*.test.js',
  extensionDevelopmentPath: '../',
});
