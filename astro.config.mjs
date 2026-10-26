import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  // Never inline scripts into the page: the CSP in public/_headers allows script files from this site only.
  vite: { build: { assetsInlineLimit: 0 } },
});
