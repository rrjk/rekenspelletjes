import js from '@eslint/js';
import { importX } from 'eslint-plugin-import-x';
import globals from 'globals';
import { configs as tseslintConfigs } from 'typescript-eslint';
import { configs as wceslintConfigs } from 'eslint-plugin-wc';
import { configs as liteslintConfigs } from 'eslint-plugin-lit';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist/*', 'node_modules/*']),
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: { globals: globals.browser },
  },
  tseslintConfigs.recommended,
  wceslintConfigs['flat/recommended'],
  wceslintConfigs['flat/best-practice'],
  {
    settings: {
      wc: {
        elementBaseClasses: ['LitElement'], // Recognize `LitElement` as a Custom Element base class
      },
      lit: {
        elementBaseClasses: ['ClassExtendingLitElement'], // Recognize `ClassExtendingLitElement` as a sub-class of LitElement
      },
    },
  },
  liteslintConfigs['flat/all'],
  {
    rules: {
      'import-x/no-dynamic-require': 'warn',
      'import-x/no-nodejs-modules': 'warn',
      'import-x/extensions': ['error', 'never'],
      'no-param-reassign': ['error', { props: false }],
      'wc/guard-super-call': 'off',
      'lit/no-template-map': 'off',
      'lit/no-template-arrow': 'off',
      'lit/prefer-static-styles': 'off',
      'max-classes-per-file': 'error',
      'dot-notation': 'error',

      // will be introduced when stylistic is turned on
      '@typescript-eslint/no-empty-function': 'error',

      'lit/prefer-nothing': 'off',
      'lit/no-this-assign-in-render': 'off',
    },
  },
]);
