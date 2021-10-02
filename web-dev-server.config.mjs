import { esbuildPlugin } from '@web/dev-server-esbuild';

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  nodeResolve: true,
  open: '/',

  plugins: [
    esbuildPlugin({ ts: true, target: 'auto' }),
  ],
});
