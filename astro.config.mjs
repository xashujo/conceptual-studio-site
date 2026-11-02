import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  // Fetch a page when its link is hovered or tapped, so navigating feels instant.
  prefetch: { prefetchAll: true },
  // Every pipeline image: sharp's default WebP is q80 effort 4; the engravings hold their linework at q68 for ~20% fewer bytes. AVIF smeared the linework, so it stays WebP.
  image: { service: { config: { webp: { quality: 68, effort: 6, smartSubsample: true } } } },
  // Never inline scripts into the page: the CSP in public/_headers allows script files from this site only.
  vite: { build: { assetsInlineLimit: 0 } },
});
