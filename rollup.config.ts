import html from '@web/rollup-plugin-html';
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
// import { copy } from '@web/rollup-plugin-copy';
// MinifyHTML removed because it caused in some cases ; to be removed while it shouldn't be removed.
// import minifyHTML from 'rollup-plugin-minify-html-literals';
import { terser } from 'rollup-plugin-terser';
import summary from 'rollup-plugin-summary';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';

export default {
  output: {
    dir: 'dist',
    entryFileNames: 'src/[name]-[hash].js',
    chunkFileNames: 'src/[name]-[hash].js',
  },
  input: '*.html',
  plugins: [
    html({ minify: true }),
    // MinifyHTML removed because it caused in some cases ; to be removed while it shouldn't be removed.
    // minifyHTML(),
    babel({ babelHelpers: 'bundled', extensions: ['.ts'] }),
    importMetaAssets(),
    nodeResolve({ extensions: ['.ts', 'mjs', 'js'] }),
    // copy({ patterns: 'images/*.{svg,png}', exclude: '', rootDir: undefined }),
    terser({ ecma: 2020, module: true }),
    summary({}),
  ],
};
