import vscode = require('vscode');
import Resolver = require('../utils/resolver');
import Logger = require('../utils/logger');
import System = require('../utils/system');

import type {
  ESLintConfig,
  ESLintNamespace,
  FlatOptions,
  LegacyConfigWithParser,
  LegacyOptions,
  Options,
} from '../types';

type Falsey = undefined | null | false | 0 | '' | typeof NaN;

const isDefined = <T>(value: T): value is Exclude<T, Falsey> => {
  return (
    value !== undefined &&
    value !== null &&
    value !== false &&
    value !== 0 &&
    value !== '' &&
    !Number.isNaN(value)
  );
};

class ESLintFormatter {
  document: vscode.TextDocument;
  constructor(document: vscode.TextDocument) {
    this.document = document;
  }

  async formatString(text: string) {
    try {
      const { eslint, linter, config } = await ESLintFormatter.getESLint(this.document);

      const isIgnored = await eslint.isPathIgnored(this.document.fileName);
      const logPath = this.document.fileName.replace(System.workspaceRoot, '.');
      if (isIgnored) {
        Logger.warning(`[ESLint]: File is ignored: ${logPath}`);
        return text;
      }

      const results = linter.verifyAndFix(text, config, { filename: this.document.fileName });

      // Logger.info(`[ESLint]: Document formatted: ${logPath}`);

      return results.output;
    }
    catch (error) {
      const { stack, cause } = error as Error;
      Logger.error(`[ESLint]: ${stack}, ${cause}`);
      return text;
    }
  }

  static isLegacyConfigWithParser(config: ESLintConfig): config is LegacyConfigWithParser {
    return !Array.isArray(config) && isDefined((config as LegacyConfigWithParser).parser);
  }

  static getESLintOptions(config: ESLintConfig, configPath: string, workspace: string): Options {
    if (Array.isArray(config)) {
      return { cwd: workspace, overrideConfig: config, overrideConfigFile: configPath } as FlatOptions;
    }
    return {
      cwd: workspace,
      overrideConfig: config,
      overrideConfigFile: configPath,
      useEslintrc: true,
    } as LegacyOptions;
  }

  static async getESLint(document: vscode.TextDocument) {
    const workspace = System.getDocumentWorkspace(document) || System.workspaceRoot;
    const { configType, config, configPath } = await System.getESLintConfigData(document.fileName);
    const options = ESLintFormatter.getESLintOptions(config, configPath, workspace);

    const { loadESLint, Linter } = Resolver.eslint.require(document.fileName) as typeof ESLintNamespace;
    const ESLint = await loadESLint({ useFlatConfig: configType === 'flat' });

    Logger.info(`${ESLint.configType.toUpperCase()} config loaded from: file://${configPath}`);
    // @ts-expect-error - Bad types
    const eslint = new ESLint({ cwd: workspace, ...options });
    const linter = new Linter({ cwd: workspace, configType });

    if (ESLintFormatter.isLegacyConfigWithParser(config)) {
      const parser = config.parser;
      linter.defineParser(parser, Resolver.make(parser).require(document.fileName));
    }

    return { eslint, linter, config };
  }
}

export = ESLintFormatter;
