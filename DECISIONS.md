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

## Home page copy (copy/home.md)
- No personal name anywhere on the site. Say "Conceptual Studio";
  the voice stays "I". (Josh, 26 Oct 2026)
- Headline: "Brand identity and data visualisation for education and
  public institutions" (option A). (Josh)
- Three services: brand identity, data visualisation and reports,
  social media editing. 3D and motion is no longer a service; it
  stays in the portfolio. Each service has a three-rung pricing
  ladder (copy/pricing.md). (Josh)
- Pricing is set per project by scope and client. Day rate £350.
  Each service shows a "from" price and a "from" time, built from
  days x £350: brand identity from £4,900 and 14 days (Josh: a full
  identity takes at least that long solo). Other ladder rungs and
  times are proposed in copy/pricing.md. (proposed)
- Times on the site are always calendar time (first call to final
  files), never working days. (Josh)
- Social media editing is priced for someone new to selling it: single
  edit from £200, monthly pack (8 videos) from £1,200, retainer
  (12 videos, 3-month minimum) from £1,800 a month. (proposed)
- Data ladder is based on a real job: a 16-page report with charts,
  coated and uncoated print PDFs, accessible PDF and PNGs took 3 days
  (£1,050). Charts only from £700; charts and full report from
  £1,400; maps and recurring reports from £2,800. Retainer confirmed:
  12 videos a month, 3-month minimum. (Josh, prices proposed)
- There is a custom quote option on the home page and the pricing
  page, answered within three working days. (Josh)
- Availability pill says "Taking new projects" with no month, so it
  doesn't need monthly updates. (Josh)
- Reply time: within three working days. (Josh)
- Home testimonial: Alison Arnaud, Principal, Tower Hamlets College,
  verbatim. Its "the college" doesn't count against the
  once-per-page rule. (proposed)
- "Colleges" is used once in my own copy, in the "Who I work with"
  line. No universities, academy trusts or charities until there's
  work to show for them. (proposed)
- "Who I work with" lists colleges, adult learning, a language
  school, a Tokyo tech startup and corporate clients (New York
  General Group). No "musicians and artists": there's only one. (Josh)
- How I work: call and brief, design and feedback, revisions and
  finishing, handover. (Josh)
- Keep "View project" from the Framer site. Primary action is
  "Start a project". (proposed)

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

## /system/ page (26 Oct 2026, branch system-page)
- /system/ shows the design system at real size. It is not in the nav
  and is hidden from search engines.
- Night ground is #14110D, not #000 (the rebuild token was wrong).
  Paper 2 at night is #221D17. Secondary text is 62% ink mixed into
  paper (#5C554C on paper, 5.6:1), never a neutral grey.
- Threshold art is chinoiserie, not the Lairesse (Josh, 26 Oct: his
  favourites). Boucher on paper, a London chinoiserie at night:
  - Opening and light glass: La Chasse Chinoise (The Chinese Hunt),
    etching by Gabriel and Jacques Gabriel Huquier after Boucher, after
    1743. The Met 53.600.1009, public domain. Crops: the open sky and
    palm (page word sits on the sky), and the far pavilion and hills.
  - Night glass and dock: the Chinese building and Rotunda, Ranelagh
    Gardens, Chelsea, 1752. Hand-coloured etching by Charles Grignion
    after Canaletto. Rijksmuseum RP-P-1932-457, public domain. Tones are
    inverted so the etched lines glow gold on warm black.
  - Boucher's original paintings (Besançon) have no free-to-use files,
    so the prints made from them at the time are used instead.
  - Other free options found for later: Huquier's Le Jardin Chinois
    (The Met 53.600.1008); William Marlow's View of the Wilderness at
    Kew with Chambers's pagoda, 1763 (The Met 25.19.43).
- Gold duotone on paper runs #6E5024 to #F1DFC8 (#8A6A38 behind the
  page word, so the word stays the darkest thing). Both fade out top and
  bottom like the footer engraving.
- No hairline under the big page word: the descender of the "y" hangs
  below it and the rule looked detached. This overrides TASTE rule 3's
  "standing on a hairline". The credits row sits directly under the word.
- On phones the night etching is 860px tall so both the dock and the
  plate sit over the etching, never over plain black.
- Refraction must be visible, like iOS 27 and macOS Tahoe (Josh,
  26 Oct). This replaces TASTE.md's "library defaults, kept", which bent
  only the outer few pixels.
  - Plates (WebGL, every browser): a convex lens bezel 20% of the short
    side (14 to 48px) bends the art behind outward, up to 1.1× the
    bezel width at the rim. Red and blue split by 8% at the rim. Blur
    and tint drop on the rim (tint to a quarter) so the bend reads; the
    middle keeps the full blur and tint so text stays legible.
  - Dock and bars (CSS, over live content): SVG bend at -70, band up to
    half the short side, blur 5px, tint 42% while bending. Chromium
    only; Safari and Firefox show plain frosted glass.
- Plate glass as built: light tint 0.48; dark tint #14110D at 0.62;
  top-rim highlight 0.30 light and 0.20 dark, strongest at the top
  left; a 1px darkened inner edge at 10% light and 35% dark.
- The gold flourish on warm black gets one cast shadow, down and to
  the right, because the light comes from the top left. No glow and no
  pool of light behind it.
- Primary button: hover only swaps the label ("Book a call" to "Contact
  me ↗"). One change per hover. Pill: the arrow turns and the fill
  deepens, as on Framer. Pressed: the fill deepens and the button
  shrinks to 97%. Focus: a 2px ink ring, 3px out.
- Project card: image 16:9 on desktop (4:5 on phones) so the whole
  exhibit fits one screen at 1440. Corners 25px image, 16px inset,
  41px card; on phones 22px, 10px, 32px.
- Plate captions are 12px (the brief's minimum; TASTE allows 11 to 12).
- The Oxford shopfront photo is the old sign ("Before"), so it is not an
  exhibit. The card uses the bus shelter poster instead. [TBC: is there
  a photo of the new sign in place on the shopfront?]
- Copy email uses joshuamcdonald099@gmail.com, as on the Framer contact
  page. [TBC: a studio address instead?]

## Home prototypes (26 Oct 2026, /prototypes/)
- Built on main at Josh's request, not on a branch. /prototypes/ and
  its pages are hidden from search engines, not in the nav and not part
  of the site. Delete the folder once a direction is chosen.
- Four first screens (A Painting through glass, B Work first, C Live
  chart, D Quiet) and four featured work treatments (Light through
  glass, Threshold, Fixed field, Control), compared side by side on
  /prototypes/.
- "Never glass over a headline" is read as never glass laid on top of a
  headline, so A's headline sits inside its plate. This breaks TASTE 2
  (words straight onto the painting) on purpose. [TBC: Josh to confirm
  the reading.]
- In the featured work tests the Framer cards are the WebGL plate glass,
  over the Huquier hunt etching. Light and Fixed put glass on every card
  on purpose, against the TASTE never-do list, so the options can be
  compared.
- In Threshold only the large card is glass. The art has faded to paper
  before the pair begins, so the pair stays solid paper 2 (no glass on
  flat paper).
- Art strengths are baked into the image files (18%, 28%, and the
  threshold fade from the open-sky crop), so the glass samples exactly
  what the page shows.
- At 18% (Light through glass) the etching does not survive the blur,
  and the cards read as plain cream glass, even with the tint lowered
  to 0.30.
- A uses the open-sky crop (hunt-sky-gold), not the pavilion crop: the
  plate needs a quiet passage behind it (TASTE 2).
- Half-width cards (the pair) use a 5:4 image on desktop and 4:5 on
  phones, with 28px titles below 1100px.
- C's dataset: adult (19+) government-funded FE and skills participation
  in England, apprenticeships included, 2019/20 to 2024/25. Source: DfE,
  Further education and skills, Explore education statistics. Each year
  is as first published in its own release (2019/20 from the 2020/21
  release). [TBC: switch to the latest revised time series before
  launch.]
- The decided headline fits two lines at 1440 (44 to 72px Agatho) but
  needs three lines on a 390 phone at 30 to 31px. [TBC: accept three
  lines on phones, or write a shorter phone headline.]
- "Start a project" opens an email until /contact/ exists.
- Pandora Forever card keeps the old site's wording ("shown on
  billboards including Times Square in Hong Kong"). [TBC: confirm
  wording, as brief section 3 asks.]
- Work images restored from the old build's history: NCC Strategic
  Intent 02, NCC BSix consultation 02, Sherman Poon 06, KUT 04.
- The taste skill's lint flags the art fade mask, the credits hairline
  and the flourish's cast shadow. All three are required by TASTE.md and
  DECISIONS.md, so they stay.
- Recommendation (Claude, for Josh to decide): D's opening with B's
  work row directly under it, Threshold for featured work, A's plate for
  the closing CTA, C's chart inside the data visualisation service.
- Home page art (Josh, 26 Oct): Le Jardin Chinois (The Chinese Garden),
  etching by Jacques Gabriel Huquier after Boucher, after 1743. The Met
  53.600.1008, public domain. It's the etched version of INSPO/Chinese
  Chinoiserie 01. Duotoned #6E5024 to #F1DFC8, used in the hero and,
  faded, behind the featured work panes. No free etching of Chinese
  Chinoiserie 02 found yet.
- Home headline is option 3, "Brands & Data, Made Clear" (Josh, 26 Oct).
- "Worked with" runs as one line drifting left on a loop (Josh, 26 Oct),
  overriding TASTE 22's "nothing loops". It pauses on hover, and with
  reduced motion it stops and scrolls by hand.
- Home opening: the etching fills the screen at 60% strength, cropped so
  the trees and sky sit behind the card (Josh chose this "quiet" version
  over full strength and a half-page layout, 26 Oct). Featured work uses
  the same strength, fading to a soft tone behind the lower panes.

## Homepage build (26 Oct 2026, branch home)
- Built at / from Prototype A (the quiet etching). Still for now: no motion,
  and the glass is the static CSS tier on the nav and the hero plate only (no
  WebGL). The "Worked with" line is static until the motion pass.
- The nav sits inside the opening and scrolls away with it, so it can never
  cover a headline. The scroll dock comes with the motion pass.
- Featured work on paper: Oxford School of English (full card), then Pandora
  Forever and KUT Magazine as a pair. The cards are solid paper 2, never glass
  (brief section 4). The Jardin etching shows only at the chapter opening and
  fades out behind the first card.
- The warm black chapter is Strategic Intent (NCC, 2025): the black merger map
  suits the night ground and it is the core data service. The Ranelagh etching
  shows the Rotunda above the card, then three charts in a 2:1 grid.
  [TBC: Josh to confirm this is the case study for the night chapter.]
- Close and footer are one night chapter. The footer keeps the garden
  engraving and its fade, re-toned as a lamplit positive (dark lines on dim
  gold, #14110D to #6B5436). A straight inversion was tried and dropped: it
  turns the faces black. Footer text in #D9BE91. [TBC: source of the garden
  engraving for its credit line.]
- Services are set like a menu (taste skill blueprint): name and "from" price
  on one line, the time under it. Times follow copy/pricing.md (brand identity
  from 4 weeks, calendar time), not the 14 working days above. The Oxford
  student ID card mockup sits under the heading.
- Proof: client names grouped Education, then Companies and international,
  beside Alison Arnaud's quote verbatim. "Read the project" is left off until
  it is clear which project the quote is about. [TBC]
- How I work is a bento (Josh, 26 Oct: he disliked the stepped text): a real
  <ol> in two rows of filled paper 2 tiles, wide then narrow (7 and 5
  columns), then narrow then wide, 28px corners, title at the top and text at
  the foot. One column on phones. Overrides TASTE.md's never-do on bentos for
  this section only.
- About: the sentence and four facts. [TBC: a photograph, brief 6.1.]
- The email address is not shown as text on the page because it carries a
  personal name; the copy button and mailto links use it.
- Plate captions stay 12px. The inspector runs with --allow glass, pill-nav,
  shadow, gradient, micro-label, hairline, palette-cream (brief section 4),
  plus small-text (the 12px plate captions section 4 allows) and still-page
  (no motion yet, by request). Art fades carry taste-skill-ignore.
- Links to pages not built yet: /work/*, /services/*, /about/.
- The close has a detail of Lemoyne's Apotheosis of Hercules behind it
  (Josh, 26 Oct, in place of Ranelagh): Jupiter and the gods under the gold
  drape, about a 3x crop, toned #14110D to #9E8058 and faded top and bottom,
  so "Start a project" sits on its dark foot. [TBC: the source of the
  photograph in INSPO, for the credit line.]
- No art credits on the home page (Josh, 26 Oct). The etching, Lemoyne and
  footer engraving captions are removed; the plate captions under the work
  stay. The art's sources are kept in this file for the record.

## Glass, layer 1 (26 Oct 2026, branch glass)
- CSS glass, every browser: paper tint 66%, blur 24px, saturate 1.3. This
  replaces TASTE.md's Tier B values (68%, 18px, 1.6): above 1.3 saturate the
  paper turns peach, and 24px (2a7589f's bar) is needed to diffuse the
  etching's lines. [TBC: Josh to approve at step 1 review.]
- Rim: one 1px warm highlight on the top and left edges (light from the top
  left), plus a 1px gold darkened edge at 16% so the edge still shows on
  cream. Lift: a soft shadow falling down and right (3px 10px 28px, -16px).
- Over black chapters the glass is Paper 2 at night (#221D17) at 72%, one
  step above the ground so it has a body over plain black. A cream-gold rim
  replaces the dark edge and shadow, which vanish on black (brief 7.2).
- Worst-case contrast, worked out for pure black and pure white underneath:
  ink on light glass 7.0:1 or better, cream on dark glass 5.1:1 or better.
  Both pass AA without relying on prefers-reduced-transparency (Safari
  ignores it).
- Increase contrast: glass becomes 94% opaque, keeps the blur, and gets a
  2px ink outline drawn inside its edge.
- Browsers without backdrop-filter get a 92% tint.
- /glass/ is a review specimen (painting, paper, black). Hidden from search
  engines and not in the nav. The paper panel only exists for comparison:
  the site still never puts glass on flat paper. Delete /glass/ once the nav
  is built.
- The layer 2 refraction tint (42%) is below AA and gets fixed in step 3.
- Lens glass (Josh, 26 Oct, from Apple's Liquid Glass "New, universal
  design" image): nearly clear, the art bends and magnifies through a rim
  30% of the short side (14px minimum), red bending most and blue least so
  the rim splits colour, a bright rim top left with a weaker catch bottom
  right. No paper frosting (Josh, 26 Oct: "looks out of place"): the middle
  is only slightly blurred (4px in Chromium, about 3px in WebGL) with no
  tint, feathered into the sharp bent rim. Tint is 8% paper in Chromium and
  10% in WebGL (25% on night art).
  [TBC: words on clear glass rely on the art behind being light and soft.
  Over a dark or busy photo they may fail AA; the nav will need the
  scroll-edge band (TASTE glass spec) in step 2.]
- The lens is Chromium only (it needs SVG filters inside backdrop-filter).
  Safari, Firefox and iPhones get the frosted layer 1 glass. Turned on per
  element with data-lens; shown next to the frosted glass on /glass/.
  [TBC: Josh to choose which pieces get the lens: nav, dock, small round
  buttons, the availability pill.]
- On the /glass/ page the frosted copies are removed; every piece is lens
  glass. Lens pieces that can't bend (Firefox or Safari over plain paper or
  black) are clear too: 18% paper (30% Paper 2 at night), 5px blur.
- Lens bend is -48 (the edge refraction keeps -70): with the wider rim, -70
  smeared the etching into ripples. Lens blur 1.5px softens the fine lines.
- Firefox and Safari: a lens piece that sits wholly over a known painting
  uses the WebGL glass (liquid-glass.js), which bends that painting in every
  browser. Anywhere else (over live content, plain paper, plain black) they
  keep the frosted glass. Checked by forcing the non-Chromium path in
  Chromium; not yet seen in a real Firefox or Safari.
- Apple Music's web player (music.apple.com, checked 26 Oct) does not refract:
  its glass is backdrop-filter saturate(220%) blur(16px) over #F5F5F7 at 55%,
  a 1px inner stroke (black 5% on light, white 20% on dark) and a shadow,
  opaque under Increase Contrast. No SVG displacement and no WebGL. So the
  site's layer 1 glass already matches what Apple ships on the web; the
  bend is extra.
- Spacing (Josh, 26 Oct: "a bit too big"): dock labels are 44px targets with
  12px each side (24px between words, 18px at the ends); round buttons 56px;
  pill padding 20px; 16px between pieces.
