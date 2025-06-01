/* eslint-disable import-x/no-nodejs-modules -- This file is not part of the application, but for the config of the web-dev-server, which is run by node */

import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fileURLToPath } from 'url';

// The following two are includes to be able to import old-style CommonJs modules
// See https://modern-web.dev/guides/dev-server/using-plugins/#commonjs
// The modules for which this should work have to explicitely mentioned in the commonjs plugin (see below)
import { fromRollup } from '@web/dev-server-rollup';
import rollupCommonjs from '@rollup/plugin-commonjs';

const commonjs = fromRollup(rollupCommonjs);

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  nodeResolve: true,
  open: '/',

  plugins: [
    commonjs({
      include: [
        '**/node_modules/colors/**/*',
        '**/node_modules/chroma-js/**/*',
      ],
    }),
    esbuildPlugin({
      ts: true,
      target: 'auto',
      tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
    }),
  ],
});
