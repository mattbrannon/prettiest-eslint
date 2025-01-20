import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { ignores: [ './compiled/**', './dist/**' ] },
  {
    name: 'blah',
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        project: true,
        // projectService: true,
        // tsconfigRootDir: "./configs/tsconfig.json",
        // project: "./configs/tsconfig.json",
        // projectService: {
        //   tsconfigRootDir: "./configs/tsconfig.json",
        // },
      },
    },

    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unnecessary-type-constraint': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-namespace': 'off',

      'nonblock-statement-body-position': [ 'error', 'beside' ],
      'no-var': 'error',
      'prefer-const': 'error',
      quotes: [ 'error', 'single', { avoidEscape: true }],
      'brace-style': [ 'error', 'stroustrup' ],
      semi: [ 'error', 'always' ],
      'space-before-function-paren': 'off',
      'comma-dangle': [ 'error', 'only-multiline' ],
      'no-unused-expressions': 'off',
      'no-sequences': 'off',
      eqeqeq: 'error',

      'object-property-newline': [
        'error',
        {
          allowAllPropertiesOnSameLine: true,
        },
      ],

      'object-curly-newline': [
        'error',
        {
          multiline: true,
          consistent: true,
        },
      ],

      'object-curly-spacing': [ 'error', 'always' ],

      'array-element-newline': [
        'error',
        {
          ArrayExpression: 'consistent',
          ArrayPattern: 'never',
        },
      ],

      'array-bracket-newline': [
        'error',
        {
          multiline: true,
        },
      ],

      'no-unneeded-ternary': 'error',

      indent: [
        'error',
        2,
        {
          flatTernaryExpressions: true,
          SwitchCase: 1,
          ignoredNodes: [ 'ConditionalExpression > *' ],
        },
      ],

      'newline-per-chained-call': [
        'error',
        {
          ignoreChainWithDepth: 3,
        },
      ],

      'array-bracket-spacing': [
        'error',
        'always',
        {
          arraysInArrays: false,
          objectsInArrays: false,
          singleValue: true,
        },
      ],
      'no-multiple-empty-lines': [
        'error',
        {
          max: 1,
          maxEOF: 1,
          maxBOF: 0,
        },
      ],
      'max-len': [
        'off',
        {
          code: 100,
          ignoreComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
    },
  },
];
