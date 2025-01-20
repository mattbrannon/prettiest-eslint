import type * as ESLintNamespace from 'eslint';

export type FlatConfig = ESLintNamespace.Linter.Config[];
export type LegacyConfig = ESLintNamespace.Linter.LegacyConfig;
export type ESLintConfig = FlatConfig | LegacyConfig;
export type ESLint = ESLintNamespace.ESLint;
export type Linter = ESLintNamespace.Linter;

export type * as ESLintNamespace from 'eslint';

export interface LegacyConfigWithParser extends LegacyConfig {
  parser: string;
}

export type LegacyOptions = ESLintNamespace.ESLint.LegacyOptions;
export type FlatOptions = ESLintNamespace.ESLint.Options;
export type Options = LegacyOptions | FlatOptions;
