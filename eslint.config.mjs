import js from '@eslint/js';
import * as tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylistic,
  prettierConfig,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      'no-console': 'warn',
      '@typescript-eslint/prefer-readonly': ['warn', {
        onlyInlineLambdas: true,
      }],
      '@typescript-eslint/explicit-function-return-type': ['warn', {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true
      }],
      'import/order': ['warn', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        alphabetize: { order: 'asc', caseInsensitive: true },
        'newlines-between': 'always',
      }],
      '@typescript-eslint/no-useless-constructor': 'error',
      'prettier/prettier': 'error',
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      'import/no-unresolved': 'error',
      'eol-last': ['error', 'always'],
      '@typescript-eslint/no-misused-promises': ['error', {
        checksVoidReturn: false,
      }],
      'import/no-extraneous-dependencies': ['error', {
        devDependencies: true,
      }],
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      'no-restricted-syntax': ['error', {
        selector: 'ClassBody > PropertyDefinition[value.type="ArrowFunctionExpression"]',
        message: 'Use a regular instance method instead of an arrow function in class.',
      }],
    },
  },
];