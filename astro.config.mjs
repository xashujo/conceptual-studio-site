// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// PREVIEW=1 builds a copy for a private preview link: no CSP (the preview host adds its own scripts).
const preview = process.env.PREVIEW === '1';

export default defineConfig({
  site: 'https://conceptualstudio.co.uk',
  trailingSlash: 'always',
  build: { format: 'directory' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [sitemap()],
  security: preview
    ? undefined
    : {
        csp: {
          directives: [
            "default-src 'self'",
            "img-src 'self' data: https://i.ytimg.com",
            "media-src 'self'",
            "font-src 'self'",
            "connect-src 'self' https://api.web3forms.com https://cloudflareinsights.com",
            "frame-src https://challenges.cloudflare.com",
            "form-action 'self' https://api.web3forms.com",
            "base-uri 'self'",
            "object-src 'none'",
            'upgrade-insecure-requests',
          ],
          scriptDirective: {
            resources: ["'self'", 'https://challenges.cloudflare.com', 'https://static.cloudflareinsights.com'],
          },
          styleDirective: {
            // style="" attributes carry CSS variables (layout and view-transition names); they can't run script.
            resources: ["'self'", { resource: "'unsafe-inline'", kind: 'attribute' }],
          },
        },
      },
});
