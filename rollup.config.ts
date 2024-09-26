import html from '@web/rollup-plugin-html';
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
// MinifyHTML removed because it caused in some cases ; to be removed while it shouldn't be removed.
// import minifyHTML from 'rollup-plugin-minify-html-literals';
import { terser } from 'rollup-plugin-terser';
import summary from 'rollup-plugin-summary';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import commonjs from '@rollup/plugin-commonjs';

export default {
  output: {
    dir: 'dist',
    entryFileNames: 'src/[name]-[hash].js',
    chunkFileNames: 'src/[name]-[hash].js',
  },
  input: '*.html',
  plugins: [
    html({
      minify: true,
      transformHtml: [
        h =>
          h.replace(
            '<head>',
            '<head><link rel="apple-touch-icon" sizes="180x180" href="images/favicon-math-multicolor-180x180.png"/> <link rel="icon" sizes="16x16" href="images/favicon-math-multicolor-16x16.png"/> <link rel="icon" sizes="32x32" href="images/favicon-math-multicolor-32x32.png"/>'
          ),
      ],
    }),
    // MinifyHTML removed because it caused in some cases ; to be removed while it shouldn't be removed.
    // minifyHTML(),
    babel({ babelHelpers: 'bundled', extensions: ['.ts'] }),
    importMetaAssets(),
    nodeResolve({ extensions: ['.ts', 'mjs', 'js'] }),
    // The commonjs plugin allows to use npm packages that are still using the CommonJS packaging
    commonjs(),
    copy({
      targets: [
        {
          src: [
            'images/favicon-math-multicolor-16x16.png',
            'images/favicon-math-multicolor-32x32.png',
            'images/favicon-math-multicolor-180x180.png',
          ],
          dest: 'dist/Rekenspelletjes/images',
        },
      ],
    }),
    terser({ ecma: 2020, module: true }),
    summary({}),
  ],
};
