import js from '@eslint/js';
import { importX } from 'eslint-plugin-import-x';
import globals from 'globals';
import { configs as tseslintConfigs } from 'typescript-eslint';
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
  {
    rules: {
      'import-x/no-dynamic-require': 'warn',
      'import-x/no-nodejs-modules': 'warn',
      'import-x/extensions': ['error', 'never'],
      'no-param-reassign': ['error', { props: false }],
    },
  },
]);
