import js from '@eslint/js';
import { importX } from 'eslint-plugin-import-x';
import globals from 'globals';
import html from 'eslint-plugin-html';
import { configs as tseslintConfigs } from 'typescript-eslint';
import { configs as wceslintConfigs } from 'eslint-plugin-wc';
import { configs as liteslintConfigs } from 'eslint-plugin-lit';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

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
  {
    files: ['**/*.html'],
    plugins: { html },
  },
  tseslintConfigs.recommendedTypeCheckedOnly,
  tseslintConfigs.strict,
  tseslintConfigs.stylistic,
  wceslintConfigs['flat/recommended'],
  wceslintConfigs['flat/best-practice'],
  liteslintConfigs['flat/all'],
  eslintConfigPrettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          // This ensures that eslint.config.mjs and web-dev-server.config.mjs also are handled properly by eslint, even though not being mentioned in tsconfig.json
          allowDefaultProject: ['*.mjs'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      wc: {
        elementBaseClasses: ['LitElement'], // Recognize `LitElement` as a Custom Element base class
      },
      lit: {
        elementBaseClasses: ['ClassExtendingLitElement'], // Recognize `ClassExtendingLitElement` as a sub-class of LitElement
      },
    },
  },
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
      '@typescript-eslint/class-literal-property-style': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },
]);
