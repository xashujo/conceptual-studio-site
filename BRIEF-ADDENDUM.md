# Brief addendum: hosting

Hosting is Cloudflare, not GitHub Pages. The GitHub repo connects to
Cloudflare, and every push builds and deploys automatically.

- main = the live site. All work happens on branches. Cloudflare gives
  each branch a preview URL; share that with me for review. Merge to
  main only with my OK.
- Repo can be private (Cloudflare and Pages CMS both support this).
  Ask me which I want. Even if private, never commit the BRANDING/
  PDFs, the Framer export, desktop font files or NDA work.
- Ignore brief instructions about GitHub Pages: no `base` setting,
  no deploy-pages action, no meta-refresh redirects.
- Use Cloudflare's `_redirects` file for real 301 redirects from old
  Framer slugs.
- Use a `_headers` file for the Content Security Policy, HSTS,
  X-Content-Type-Options, Referrer-Policy and frame-ancestors.
- Analytics: Cloudflare Web Analytics.
- Domain: move DNS to Cloudflare only at launch, with my OK. Framer
  stays live until then.
