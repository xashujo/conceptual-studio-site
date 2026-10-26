# Decisions (override the brief wherever they disagree)

## Positioning
- I design brand identities and data visualisation.
- I lead with colleges and public institutions, but I also work with
  commercial and international clients (Fou Answer, New York General
  Group) and artists (3D and motion). Never present me as
  education-only. Mention colleges once per page at most.

## Base system: my Framer site
conceptualstudio.co.uk is the starting point, not something to
replace. Keep and refine:
- Project cards: title left, year right, hairline rule, disciplines,
  one-line description, pill "View project" button, large image.
- Button hover: arrow rotates → to ↗, about 180ms ease-out.
- Floating icon dock nav, availability pill with green dot,
  copy-email feedback.
Fix: "Toyko", remove "Ghost:", rewrite the contact text, no
"Let's Collaborate!".

## Creative direction: "Old masterpieces, seen through glass"
Feelings: wonder, preciousness, warmth, calm confidence. Every section
must still help a buyer understand, trust or enquire. Not an awards
site.

Museum model:
- Classical art is the architecture. Used at thresholds only (page
  openings, chapter breaks, footer). Always duotoned into the palette
  (gold on cream, or cream/gold on black) and faded into the page,
  like the old site's footer engraving. Never full colour. Never one
  painting per card.
- My work is the exhibit. Always full colour, large, shown in use
  (spreads, signage, mockups), not logos on flat colour blocks. Never
  placed over a painting. Plate caption under every image, like a
  museum label.
- Apple-style glass is the lens: nav, CTA cards and project title
  plates. Glass only where something sits behind it. Never glass on
  flat cream, never over the work image itself, never over a headline.
- Night chapters: warm near-black with amber light, not cold grey.

## Type
- Kombu's style without the giant wordmark. No huge "Conceptual
  Studio" header anywhere.
- Big Agatho type in one or two moments per page only. Real scale
  contrast: very large next to small.
- Small tracked caps only as plate captions, never as decoration
  (no "N° 01" labels).

## Copy
- Plain British English, "I", no em dashes, none of the banned words
  in brief section 3.
- Headlines say what I do or what the buyer gets. No slogans. Test:
  could a college marketing head repeat it to their Principal?
- Write like a person explaining their work over dinner, not a
  tagline. Vary sentence length; don't make every line short and
  punchy.

## Cancelled
- Hero video (brief section 8). The gold flourish is a still, lit
  brand object.
- The Figma-style glass from the first build.

## Kept from the old build (xashujo/conceptual-studio-site)
- The footer engraving and its fade.
- The best glass version from its git history: commit 2a7589f, its phone
  menu sheet (light liquid glass over the gold engraving). 69b19e3's dark
  plates are the model for night chapters. Identified 26 Oct; confirm.

## Build setup (26 Oct 2026)
- The new site replaces main's contents as ordinary commits on top of
  its history (no force-push), built on the `rebuild` branch first.
- Astro 7.4.2, static output, no integrations yet.
- Colour tokens use light-dark(). The site is light; a night chapter
  is a section with class "night", which switches it to the dark
  values (paper and ink swap). Gold stays the same in both.
- Fonts: Agatho Medium as a Latin subset WOFF2 (48 KB), Inter 4
  variable WOFF2, Latin only (48 KB). font-synthesis: none.
- Security headers (CSP, HSTS, nosniff, Referrer-Policy,
  frame-ancestors) live in Cloudflare's _headers file, not a meta tag.
  The CSP allows only the site itself for now; add Turnstile,
  Web3Forms, Cal.com, R2 and analytics as each is used.
- From the old footer, only the garden engraving and its fade were
  kept. Its old text ("for colleges, schools and public institutions")
  was dropped because it breaks the positioning rule.

## Glass and taste (26 Oct 2026)
- Glass is built on dashersw/liquid-glass-js and should match Apple's
  iOS 27 Liquid Glass as closely as the web allows. Full spec in TASTE.md.
- TASTE.md holds the taste rules; this file wins where they disagree.
