# Conceptual Studio website: build brief

You're building the new website for Conceptual Studio Limited, a one-person design studio in London run by Joshua (Josh) McDonald. It replaces the current Framer site at conceptualstudio.co.uk. You'll code it, Josh will run it, and it will be hosted on GitHub Pages.

Everything you need is in the folder this file sits in:

- `ASSETS/`: Agatho Medium (display face, Josh holds a commercial licence), Inter, and the gold-flow hero video in three versions (HEVC-alpha `.mov`, HEVC-alpha `.mp4`, VP9-alpha `.webm`; 1500×400, 60fps, 4.2s).
- `BRANDING/`: black and white logo PNGs (3000×800), the gold flourish on its own (1500×400 PNG), and some studio PDFs. The PDFs (SLA, client agreement, a client quote) are private. Never commit them.
- `CURRENT WEBSITE/`: the exported Framer pages. Use them for content, slugs and to see what exists. Don't port the markup.
- `INSPO/`: Josh's references. Look at every image before you design anything.
- `Conceptual Studio website research.md`: the research behind this brief, with sources. Read it once.

Josh's original Framer code component for the transparent video is reproduced in the appendix.

---

## 1. Working with Josh

- Josh is a designer and doesn't code. Explain decisions in plain words, show him screens rather than code, and keep him in the loop at each milestone in section 15.
- **Tell him before you run any command on his computer**, say what it does in a sentence, and wait for his OK. He objects to commands run without explanation.
- **Git authorship:** Josh must be the only contributor on the repo. Commits are authored as Josh. No `Co-Authored-By` lines, no "Generated with Claude" footers, no bot commits if it can be avoided (see section 10 on the CMS).
- He has given Claude's GitHub app access to all his repos. Only touch the website repo.
- Ask before anything that's hard to undo: DNS changes, switching the domain away from Framer, deleting anything, force-pushing.
- **Never invent facts.** No made-up clients, quotes, metrics, awards or outcomes. Where you need something he hasn't given you, write `[TBC: what's needed]` and add it to the list in section 14.
- **Never mention BBC, Chivas Regal or Papa Johns anywhere on the site.** They were university briefs, not clients.

## 2. Skills: which one, when

Use the skills installed in this account. They're part of the brief.

| Skill | Use it for |
|---|---|
| `ponytail` | All code. Smallest complete change, platform features before libraries, no speculative abstractions. Its "never cut" list (accessibility, security, validation) applies in full. |
| `design-taste-frontend` | The design process: subject inventory, the argument, the copy deck, the direction draw with `--keep palette,type`, building still before motion, `inspect.mjs` and the critique rounds. Read section 4 of this brief first: Josh's brand overrides some house rules on purpose. |
| `apple-design` (and its child references) | Restraint and motion budget. This is a flagship marketing surface, so scroll choreography is allowed, but glass is chrome only and everything has to earn its place. Use the materials, motion and accessibility references for the glass and the nav. |
| `humanizer` | Every piece of copy on the site, case studies above all. Josh's voice: plain British English, first person "I", short sentences, no em dashes (he reads them as AI), none of the agency clichés in section 3. |
| `web-design-guidelines` | A full audit of every page before launch. Fix everything it raises or note why not. |
| `dataviz` | Any chart, stat or the "live thing" in section 5.1. Accessible charts are a selling point for this studio. |
| `web-artifacts-builder` | Optional: quick interactive prototypes (the nav morph, the glass, the pricing ladder) for Josh to react to before you build them for real. These are for Josh only, never for clients. |
| `skill-creator` | At the end: a small skill that captures this site's design system, voice and the steps for adding a case study, so future sessions stay on brand. Propose it to Josh to save. |

## 3. The studio and what the site has to do

**Who:** Joshua McDonald, founder of Conceptual Studio Limited (UK Ltd), London. Trained at Kingston School of Art. Previously design lead at Fou Answer, a Tokyo tech startup. Full time on the studio since January 2026. It's just him, plus trusted print partners for anything from reports to building-scale prints (don't name them; one is white-label).

**Positioning (decided):** institutions first. Brand identity and data visualisation for UK colleges, education and public institutions. 3D and video stay in the portfolio as supporting work, not as headline services.

Why, briefly (details and sources in the research file): high-growth specialist firms out-earn generalists; in the UK *What Clients Think 2025* study, 70% of clients want a one-line summary on the homepage, 61% can't tell what an agency is best at from its website, and 79% want agencies to say which clients they want. Almost all of Josh's paid work is already for colleges. The current site says "brands, artists, and creators", which matches none of it.

**How these buyers buy:** usually a head of marketing or comms at a college, signing off with the Principal or CEO. Most projects at Josh's size go out as invited quotes (often 2 to 3 quotes above £5k to £10k). So the site's real job is to get him onto a shortlist and make him easy to approve as a supplier: clear services, a price guide, named clients, the person behind it, and company details in plain view.

**Repeat moments to write for:** college financial statements (published by 31 January), accountability statements (31 July), strategy and strategic intent documents, sustainability and climate action reports, mergers, prospectuses, campaign launches.

**Clients that can be named (logos or set in type):** New City College London, Southbank College Group, ACL Essex, Oxford School of English, Fou Answer, New York General Group. Testimonials also come from Tower Hamlets College (part of NCC) and Plus Pursuits.

**Outcomes that are true and can be used:**
- An NCC logo Josh designed was formally trademarked and ran across buses, tube and stations in central and east London for months (from the Principal of Tower Hamlets College, see appendix).
- The Oxford School of English rebrand is now a UK-registered trademark.
- Ten heat maps of London boroughs for Southbank College Group's CEO, showing learner distribution across adult vocational and apprenticeship subjects.
- Infographics for NCC's Strategic Intent document, used in executive merger communications.
- 3D visuals for Sherman Poon's music video "Pandora Forever", shown at Times Square, Hong Kong `[TBC: confirm wording]`.

**Voice:** "I", not "we" (practitioners lean this way for solo studios, and tenders check capacity anyway). Keep "Conceptual Studio" as the brand. Calm, specific, a little dry. Avoid: "elevate", "bring to life", "transform", "stand out in a crowded market", "passionate", "bespoke solutions", "deliver", "leverage", "robust", "seamless". Public-sector readers are used to GOV.UK plain English; write to that register with more warmth.

**Headline options** (each needs the plain sentence under it; test them at every width against the two-line rule):

1. **Brand and data design for education**
   *I'm Josh, and Conceptual Studio is my London practice. I design identities, reports and data visualisation for colleges, schools and public institutions.*
2. **Brands and data, made clear**
   *Conceptual Studio designs brand identities and data visualisation for colleges and public institutions. It's run by me, Josh McDonald, in London.*
3. **Identity and data for institutions**
   *From logos on London buses to the charts in a college's annual report. I'm Josh, and this is my studio.*

4. **Brand identity and data visualisation for colleges and public institutions** (the most literal; it'll need a smaller display size to stay within two lines)
   *Identities, annual reports and data maps for UK colleges, designed in London.*

Josh picks. Run the final choice through `humanizer`. Near the hero, add a short "Who I work with" line (colleges, universities, multi-academy trusts, charities and public bodies).

## 4. Brand overrides for the design-taste house rules

The `design-taste-frontend` house rules stand, **except** where Josh's brand needs these. Pass `--allow` to `inspect.mjs` for exactly these, and say so in your report:

| House rule | Override, and its limits |
|---|---|
| No glass, no floating pill nav | Allowed for the navigation, the availability pill and at most two hero-moment elements per page (section 7). Never on cards or content. |
| No pill badge | One: the availability pill with the green dot. |
| No shadows at rest | Only inside the glass material (rim highlight, soft lift). Nowhere else. |
| No gradients | Only inside the glass material. |
| No tiny uppercase labels, no index numbers, no thin rules | Allowed only as **plate captions** (section 5.6): the small engraved-plate style labels on images and in the footer, at 12px or larger. Not as eyebrows above headings. |
| No assistant palette (cream with terracotta) | Josh's cream is his brand colour. Keep it, but never add terracotta, rust or violet. |

Everything else holds: no eyebrows, no emoji, no icon-topped feature cards, no styled accent word in headlines (Agatho has no italic anyway), no monospace outside code, two typefaces only.

## 5. Art direction

The feeling: classical meets modern. Refined, quiet, expensive, never themed. Think of a museum that hired Apple to do its wayfinding.

**What the references actually are,** so you pick the right material:
- Josh says "Renaissance", but most of his picks are **Baroque and Rococo**: Lemoyne's *Apotheosis of Hercules* ceiling at Versailles (1730s), Gerard de Lairesse's grisaille *Allegory of the Sciences* (Dutch Golden Age), and two **Boucher chinoiserie** paintings (1740s). There's also a Bosch detail (Northern Renaissance). Look at 17th and 18th century European painting and engraving first, plus 18th century chinoiserie prints (Jean Pillement, Huquier after Boucher).
- His logo is **Art Nouveau**: the gold flourish is a whiplash line (the "coup de fouet"), rendered as modern liquid metal. That's the bridge between classical and modern, and the site should feel like it was built around that line.
- **Kombu** (in `INSPO/`): classical paintings used as full-bleed fields with cream type over them; a very large serif wordmark; small grotesk text. The closest single reference.
- **DARC** pin: a serif wordmark centred over a motion-blurred classical image, with small labels left and right.
- Pinterest board 01: candlelit dining, lilies on black, warm amber light. Mood for the dark chapters.
- Board 02: Hong Kong and Tokyo at night, goldfish, red interiors. Colour and atmosphere only, sparingly.
- Board 03 and the silver lion and tiger pins: engraved and embossed metal objects lit on black. This is how the gold logo should be treated in the dark chapters: an object, lit.
- Board 04: technical micrographics. Source of the plate captions.
- **LOEWE** after the 2025 redesign: editorial and product-led modules, a gutterless grid, craft presented with playfulness. Take the confidence and the grid, not the shop.
- **Apple:** the calm of the components. Navigation, buttons, forms, spacing.

### 5.1 The idea

Run `design-taste-frontend` step 4 properly, but here's a starting proposal to test against the competitor test:

> On this site, **the gold line from Josh's logo** becomes **the line that turns a table of numbers into a chart, and a brief into an identity**.

The **live thing** (one only): "From spreadsheet to clarity". A real open dataset about further education or London (for example DfE further education statistics or ONS borough data, credited) sits on screen as a plain table. One control turns it into a finished chart, the bars or line drawing in with a single gold stroke. Works with a thumb, has a no-script fallback (table and static chart), and never blocks reading. It shows in ten seconds what Josh does for a living. Put it on the Data visualisation service page and a smaller version on the homepage.

### 5.2 Colour

| Token | Value | Use |
|---|---|---|
| `--paper` | `#F1DFC8` | Ground. Josh's main studio colour. |
| `--ink` | `#000000` | All text on paper. 16.1:1 on paper. |
| `--paper-2` | a slightly darker step of paper, e.g. `#E8D3B8` (tune by eye) | Surfaces, separated by tone, not lines. |
| `--night` | `#000000` | Dark chapters. Text in `--paper` (16.1:1). |
| `--gold` | sampled from the logo, mid-tone `#926E34` | Ornament and accents only. 3.6:1 on paper (large text and graphics only, never body text); 4.5:1 on black. |
| `--live` | a green, e.g. `#1F9D55` | The availability dot only, always next to text. |

One ground, one ink, one accent (gold). Never set running text in gold on paper.

### 5.3 Dark chapters (decided: no full dark theme)

The site is light. A few deliberate black chapters give it rhythm: for example one featured case study on the homepage, the closing call to action and the footer. Black ground, paper-coloured text, the gold logo lit like an object. Glass over black chapters uses the dark tint in section 7. This replaces a site-wide dark mode, so there's no toggle and no theme storage. Implementation: define colour tokens with CSS `light-dark()` (for example ink as `light-dark(#000, #F1DFC8)`) and set `color-scheme: dark` on a dark section; everything inside flips, buttons, form controls and the glass included.

### 5.4 Type

- **Agatho Medium** for display only: headlines, the wordmark lockups, large statements. One weight, no italic. Set `font-synthesis: none` so browsers never fake bold or italic. Convert the OTF to WOFF2, subset to Latin, self-host. **Commit only the WOFF2, never the desktop OTF**, because the repo is public.
- **Inter** for everything else. Use the current Inter 4 variable WOFF2 (the TTF in `ASSETS/` is an older build), self-hosted, subset. Tabular figures for numbers that line up.
- Agatho has 219 glyphs: Latin, £, curly quotes, accents. No CJK. Sherman Poon's Chinese title (永遠潘朵拉) needs a CJK fallback in the stack (for example Noto Serif TC).
- Scale per `design-taste-frontend`: very large display (Agatho is beautiful big; Kombu sets its wordmark edge to edge), body 17 to 19px Inter, two or three sizes doing the work.

### 5.5 Imagery

1. **Josh's own work first**, large. Case-study images are the main pictures on the site.
2. **Classical paintings and engravings** from CC0 museum collections: the Met Open Access, Rijksmuseum, National Gallery of Art (Washington), Art Institute of Chicago, Yale Center for British Art. Artvee is good for browsing, but take the file from the museum and check the licence. Use them Kombu-style: one painting as a full field behind a section, cream type over it, a scrim only if contrast needs it. A painting is never presented as Josh's work.
3. **Credits** for every artwork on a Colophon page, linked from the footer.

### 5.6 Plate captions (the micrographics)

Josh loves micrographics. On this site they take the form of the captions printed under old engraved plates and museum labels. Small Inter, 12px or larger, tabular figures, generous tracking, used for: image captions on case studies (client, year, discipline, a line on what you're looking at), the footer, and the Colophon. Example: `Plate 4 · New City College London · Data visualisation · 2025 · 51.5072° N, 0.1276° W`. Keep it to these places so it reads as a system, not decoration.

### 5.7 The footer (Josh's favourite reference)

The `Footer Inspo.PNG` reference is a single-ink etching of a landscape filling the footer, with small serif links over the sky. Josh's version: **Wenceslaus Hollar's *Long View of London from Bankside* (1647)**, an etching of the Thames, London's river and the city Josh works in. Find a CC0 scan, duotone it to one ink (paper on black, or black on paper, test both), crop a long strip, and set the footer links and the company details in the open sky. On a phone, crop to the section around the Tower. If it doesn't work, try a Pillement chinoiserie engraving as the alternative.

Footer contents: the logo (white version on black), Work, Services, About, Contact, Colophon, Privacy, Accessibility, Instagram, TikTok, LinkedIn, email, and **the legal company details UK law requires on a company website**: Conceptual Studio Limited, registered in England and Wales, company number `[TBC]`, registered office `[TBC]`.

## 6. Site map and pages

```
/                      Home
/work/                 All work (filterable)
/work/[slug]/          Case study
/services/             Services overview
/services/brand-identity/
/services/data-visualisation/
/about/
/contact/
/colophon/             Artwork and type credits
/privacy/
/accessibility/        Accessibility statement
/404
```

Services are a collection, so Josh can add a third service later (he's mentioned social media and video) without code changes. Launch with two.

Optional, off until Josh has something to post: a small **Notes** collection for short, ungated pieces timed to the sector calendar (for example making annual accounts readable for non-accountants, before January). 73% of executives in the 2024 Edelman-LinkedIn study trust this kind of writing more than marketing material when judging a supplier. Don't launch it empty.

### 6.1 Home

Write the argument first (`design-taste-frontend` step 2). Expected shape, adjust if the argument says otherwise:

1. **Hero.** The gold-flow wordmark video (section 8), the handwritten "Studio" signature drawing itself once underneath (Josh to supply as SVG paths), the headline as the page's `h1`, the plain sentence, one primary action ("Start a project"), the availability pill, a quiet secondary link to the work.
2. **Trusted by.** The six clients in section 3, grouped by sector (education first, then commercial and international), set in type or as monochrome logos at equal optical size. Static. No marquee unless it genuinely looks better and respects reduced motion. Josh has approved the names; for logos, check each college's brand-use rules or get a quick written OK.
3. **Featured work.** Three or four case studies, big, each with one outcome line. One of them as a black chapter.
4. **Services.** Brand identity and Data visualisation, each with one sentence, "from £X" and a link to its page. Not two identical cards.
5. **Proof.** One testimonial set large, with name, role and organisation (people check these first). Testimonials also sit at the end of the relevant case study and beside the enquiry form, never on a separate page.
6. **How I work.** Four stages, short. A real `<ol>`, no 01/02/03 numerals.
7. **About.** Josh's photo (78% of clients are frustrated when the person in charge isn't shown), two sentences, link to About.
8. **Close.** Black chapter: a direct line, the action, the email with a copy button, then the footer.

No showreel in the hero: 68% of clients are unimpressed by showreels, while 63% like video inside case studies. On a phone, the positioning line, the client names and a thumb-reachable "Start a project" must all appear within the first two screens.

### 6.2 All work

- Filters: All, Brand identity, Data visualisation, 3D and motion, Archive. Animate the re-layout with GSAP Flip.
- **Archive** holds the Kingston School of Art projects (KUT Magazine, Exploring Mental Health Through 3D Storytelling, Detached, Rebirth, The Other Side), clearly labelled as student work. Josh can move anything in or out from the CMS.
- Layout from the dealt section blueprint, not a uniform card grid.

### 6.3 Case study template

Research says 66% of case studies miss the problem that was solved and 65% of clients want before and after. So every case study answers, in order:

1. Title, client, year, disciplines, one outcome line.
2. **The problem**, in the client's terms.
3. **What I did**, including the decisions and trade-offs.
4. **The work**, large: full-bleed images, image pairs, video, charts, each with a plate caption.
5. **Before and after** where it exists.
6. **What happened**: real outcomes only (trademarked, used in merger comms, ran on the tube).
7. The client's testimonial inline, if there is one.
8. Next project, then a call to action.

Write every case study with `humanizer`, from facts Josh gives you. Fix the current site's mistakes while porting: the NCC Strategic Intent entry carries the New York General Group description, "Toyko", "quite" for "quote", and the About page says Josh is still at Fou Answer (he was; use past tense).

### 6.4 Services overview and the pricing ladder

Josh likes the Apple idea of a ladder of options. Put it on each service page, not one page of every tier, or it gets confusing.

- `/services/`: what Josh does, who for, how projects work (stages, timelines, what the client needs to provide, how quotes and invoices work), then one entry per service.
- Each service page: what's included, the kinds of work (with real examples), the **ladder**, process, FAQs, related case studies, and the enquiry form preset to that service.

The ladder: three tiers plus Custom, side by side on desktop, swipeable on mobile, each with a "from £" price, what's included, a typical timeline and a button that opens the form with that tier selected. Prices show buyers a ballpark they can take to their budget holder (NN/g found hiding prices can read as concealment). Suggested tiers for Josh to rename and price:

| Brand identity | Data visualisation |
|---|---|
| **Refresh**: refine an existing logo, core colour and type, short guidelines. From £`[TBC]` | **Charts**: a set of charts or infographics in your brand. From £`[TBC]` |
| **Identity**: new identity system, guidelines, key templates. From £`[TBC]` | **Report**: a full report or document designed, charts and layout, accessible PDF. From £`[TBC]` |
| **Rebrand and rollout**: identity plus campaign, signage and digital rollout, trademark-ready files. From £`[TBC]` | **Maps and interactive**: heat maps, interactive maps, course finders, web-ready graphics. From £`[TBC]` |
| **Custom**: tell me what you need. | **Custom**: tell me what you need. |

State whether prices include VAT `[TBC]`.

**Price tiers to land under college quote bands.** College financial regulations count VAT and set quote bands at roughly £5k, £10k and £25k (above them, buyers need more quotes or a tender). A tier at £9,500 plus VAT costs the college £11,400 and drops into a harder band. If Josh is VAT-registered, ceilings of about £4,150, £8,300 and £20,800 plus VAT keep tiers under £5k, £10k and £25k including VAT. Tiers must be genuinely different scopes (colleges ban order splitting). Motion and 3D appear as add-ons inside tiers, which keeps them in a supporting role.

Add a short **"For procurement teams"** block on `/services/` (or its own small page): company name, number and registered office, VAT number if registered, insurance held `[TBC: PI and public liability amounts, only if Josh has them]`, 30-day payment terms and e-invoices accepted, accessibility of deliverables (WCAG 2.2 AA, tagged PDFs, charts with data tables), short data protection, quality and environmental statements, two references on request, "London-based, UK-registered SME", and "supplier pack on request". This is what gets a small studio through supplier set-up.

### 6.5 About

Josh's story in his voice: Kingston, Tokyo, the studio, the kind of work and clients he wants (say it plainly, 79% of clients want to know). A real photo. The clients list. No university brand briefs.

### 6.6 Contact

The form (section 11), "Book a 20-minute call", the email with a copy button, the availability pill, response time ("I reply within one working day" `[TBC: confirm]`), London time (the current site's live clock is a nice touch, keep it), and social links.

### 6.7 Small pages

Colophon (artwork credits, type credits, how the site was built, Josh's name), Privacy (what the form collects and who processes it, analytics and how to object), Accessibility statement (WCAG 2.2 AA target, known issues, contact), and a designed 404 that sends people to the work.

## 7. Navigation and liquid glass

### 7.1 The nav Josh loves

On the current site, the top of the page has a plain row (About ↓, Work ↓, Book a Call ↗) under the logo, and after scrolling it turns into a floating glass tab bar with icons and labels. On a phone it looks great. Keep the idea, make it better:

- **Desktop:** at the top, the wordmark, Work, Services, About, Contact, the availability pill and "Start a project". After the hero, it condenses into a centred floating glass bar with the same items.
- **Mobile:** at the top, the plain row. After the hero, a glass tab bar docks at the bottom in thumb reach: Work, Services, About, Contact, each icon with its label, plus the primary action. Respect `env(safe-area-inset-bottom)` and pad the page so it never covers content.
- **Once it appears, it stays.** NN/g's review of Apple's Liquid Glass warns against controls that appear and disappear unpredictably.
- Give it a `view-transition-name` so it stays put between pages.
- Real `<nav>` with links, `aria-current="page"`, visible focus, 44px targets. One consistent icon set with labels, never icons alone.

### 7.2 How to do liquid glass properly

Josh made liquid glass on his site before Apple did, and he wants **dashersw/liquid-glass-js** used. The research found it works, but within limits: it takes one html2canvas screenshot of `document.body` when the first glass element is created and never re-captures, so anything that changes after that (the playing hero video, scroll-reveal content, lazy images, hover states) looks wrong inside the glass. It has a single commit, no package, WebGL 1 despite the README, no high-DPI support, heavy per-pixel sampling on phones, and no accessibility. One cross-origin image without CORS silently breaks every glass element.

So build glass in three layers:

1. **Everyone:** CSS glass. `backdrop-filter: blur() saturate()` over a paper tint, a fine rim highlight, a soft lift. Works in all current browsers. Plain blur doesn't refract, which is why layer 2 exists.
2. **Chromium:** add real refraction of live content with an SVG `feDisplacementMap` in `backdrop-filter: url(#…)`. Safari and Firefox don't render the displacement yet (WebKit bug 245510 is still open), so enable it only on Chromium and check the detection.
3. **liquid-glass-js, where it shines:** contained hero moments over a known, still background. For example the availability pill and "Start a project" floating over a full-bleed painting on the Services or Contact page, or a case study's title plate over its cover image. At most two per page. Vendor a copy (MIT, keep the licence) and harden it:
   - capture only the element behind the glass, not the whole body, after `document.fonts.ready` and image decode;
   - re-capture only when the width changes, debounced (phone address bars fire resize while scrolling);
   - keep every image same-origin, or serve with CORS and `crossorigin`;
   - give `body` an opaque background (transparent pixels render black);
   - scale the canvas by `devicePixelRatio`, capped at 2, and cap capture size under the device's `MAX_TEXTURE_SIZE`;
   - one container with real `<a>` or `<button>` elements inside; canvas `aria-hidden`; no nested `Button` components (each runs its own WebGL context and animation loop);
   - pause rendering when idle or off screen;
   - change the default white tint and white text to Josh's tints below;
   - fall back to layer 1 if WebGL fails, and skip it entirely under `prefers-contrast: more` or `prefers-reduced-transparency`.
   - Try html2canvas-pro (maintained) in place of html2canvas 1.4.1; test before relying on it.

A liquid-glass-js tab bar is possible (the shader offsets by scroll, so a fixed bar lines up), but the frozen snapshot and an open scroll-performance issue make it risky. Build the nav on layers 1 and 2. Try a liquid-glass-js nav behind a flag, test it on a real iPhone, and ship it only if it holds 60fps and looks right.

**Placement:** glass is chrome only. Never over the hero wordmark, never in the content layer (Apple's own guidance). The bar's tint switches from cream to near-black as it crosses a dark chapter.

**Contrast:** text on glass must pass WCAG AA in the worst case (very dark or very bright content underneath). In light areas that needs a paper tint of about 55% opacity or more (70% for AAA). Over black chapters use a black tint of about 60 to 65% or more, with a light rim instead of a dark shadow. Under `prefers-contrast: more`, make glass nearly opaque. Safari doesn't support `prefers-reduced-transparency`, so the default tint has to be safe on its own.

## 8. The hero video component

Josh loves his component: it plays the transparent gold flow in Firefox, Safari, Chrome and the Instagram browser. Port it as a small vanilla custom element or Astro component (no React needed), keep what works, and fix three things.

**1. The iOS rule is wrong.** Every browser on iOS and iPadOS uses WebKit (Apple requires it), so Chrome on iOS, Firefox on iOS, Facebook, TikTok, LinkedIn and Gmail all currently get the WebM, and WebKit can't show VP9 transparency. Correct rule:
- any iOS or iPadOS device (including iPads that report as Macintosh with touch points) → HEVC with alpha;
- otherwise, a WebKit browser that isn't Chromium (Safari and WebKit webviews on macOS) → HEVC;
- everything else, including Chrome on macOS (it can pick the HEVC file but, in Josh's testing, drops the transparency) and all Android in-app browsers → VP9 WebM.
There is still no API that reports alpha support, so a user-agent engine check is the practical gate. Write a small test for the detection function with a table of real user agents.

**2. Fallbacks.** Show a still first and swap to the video once it plays. If `play()` rejects or no `playing` event arrives within about 1.2s (iOS Low Power Mode blocks autoplay), keep the still. Under `prefers-reduced-motion` or Save-Data, don't download the video at all: show the final frame. Josh to export two WebP or AVIF stills with alpha: first frame and final frame.

**3. Clean-up.** The original stores `currentTime` in React state on every `timeupdate`, which re-renders the component several times a second; drop it. Keep the play-pause-play nudge only if testing shows a browser still needs it. Load only the chosen source.

Also:
- Use precise type strings, for example `video/mp4; codecs="hvc1"` and `video/webm; codecs="vp9"`; a bare `video/mp4` can leave Chrome showing a black box with no error.
- `muted`, `playsinline`, no controls. The original has no `loop`, so it plays once and holds on the gold logo. Confirm with Josh.
- The `.mov` and `-hevc-safari.mp4` are the same HEVC stream; ship one `.mp4` tagged `hvc1` with `+faststart`. At about 4MB it's heavy for a hero: re-encode on Josh's Mac with `hevc_videotoolbox` and alpha (target about 1 to 1.5MB). The WebM is 527KB already.
- The video is decorative (`aria-hidden`); the page's `h1` is real text and the studio name is available to screen readers.
- Later, optionally: Jake Archibald's stacked-alpha video (one file, no sniffing, much smaller files: about 460KB in his test against 1.1MB for VP9 and 3.4MB for HEVC) once Josh is happy with everything else.

## 9. Motion

Restrained, physical, and off when people ask for it to be off.

- **Signature move:** the gold flow in the hero, then the "Studio" signature drawing itself once per visit.
- **Page transitions:** native cross-document View Transitions, `@view-transition { navigation: auto; }`. Works in Chrome, Edge and Safari 18.2+ (desktop and iOS), roughly 88% of visitors; Firefox gets a normal page load. A short crossfade (about 250 to 350ms), the nav held in place, and a case-study cover morphing into its hero via a shared `view-transition-name`. Wrap it all in `prefers-reduced-motion: no-preference`. Don't use Astro's `<ClientRouter />`: it breaks Astro's built-in CSP and makes every script re-initialise after navigation. Turn on Astro prefetch so pages arrive instantly.
- **Section entrances:** GSAP ScrollTrigger. Heading, then text, then image, 60 to 90ms apart, rising 16 to 24px, once. Content is never hidden if JavaScript fails.
- **All Work filters:** GSAP Flip.
- **Stats in data case studies:** a count-up when they enter view.
- **Feedback:** hover, press and focus states on every control.
- **No smooth-scroll library.** Native scrolling only (Lenis has known accessibility problems).
- **GSAP** is free for commercial use, all plugins included (SplitText, ScrollTrigger, Flip).
- **React Bits** (MIT plus Commons Clause, fine for this site): at most three components site-wide, only where GSAP or CSS can't do it as simply, each hydrated `client:visible` with a reduced-motion fallback. Good candidates: Gradual Blur (the soft edge behind the docked glass bar), Logo Loop (only if the client strip becomes a loop), Magnet (very subtly, on the primary action). Check current names at reactbits.dev. Don't add React to a page for something GSAP already does.
- **dqnamo.com/kitchen** has lovely pieces, but the page states no licence, so **don't copy its code**. Build your own versions of the ideas that fit, or Josh can ask the author: the self-drawing signature (for "Studio"), the button that resizes as its label changes (for the form's Send → Sending → Sent), and the soft-fade list edge (for All Work on mobile).

## 10. Editing the site after launch (decided: content only)

Josh wants to add projects, change text and images, update the availability line and reorder featured work without asking Claude. The design stays locked.

**Use Pages CMS** (pagescms.org): free, hosted, no login server to run, Josh signs in with GitHub, and it saves changes straight to the repo, which triggers a rebuild. Configure it with one `.pages.yml`:

- **Projects:** title, slug, client (reference), year, disciplines (select), sector (select), outcome line, featured (boolean), featured order (number), archive (boolean), cover image with required alt text, the problem, what I did, what happened, testimonial (reference), next project (reference), and a body made of **fixed blocks** only: text, full-bleed image, image pair, video, stat, quote, chart image, before/after. Every block has a plate caption field.
- **Services:** name, slug, summary, includes, ladder tiers (name, from price, includes, timeline), FAQs, related projects.
- **Testimonials:** quote, name, role, organisation.
- **Clients:** name, logo SVG (optional), show in "Trusted by" (boolean).
- **Settings:** availability on/off, availability text, email, social links, response-time line, company details.

Notes:
- Point the media folder into `src/assets/` so Astro optimises images (AVIF/WebP, responsive sizes). Files in `public/` are served as they are.
- **The repo is public** (Josh's choice on a free GitHub plan). Anything committed, including drafts saved in the CMS, is visible on GitHub. Unpublished or NDA client work must never go in. Tell Josh this clearly in the handover.
- **Video:** short loops and the hero video can live in the repo (GitHub warns at 50MB per file and blocks 100MB; browser uploads stop at 25MB). Longer films go on Cloudflare R2 (10GB free, no egress fees) on a subdomain like `media.conceptualstudio.co.uk`, as a URL field in the CMS.
- **Authorship:** check how Pages CMS commits appear on GitHub. If they show a bot or app rather than Josh, switch to **Sveltia CMS** (commits with Josh's own token) and tell him why.
- **Builder.io:** Josh asked about it. Not recommended here: there's no official Astro SDK, content lives on Builder's servers, you either fetch it in the browser (weaker for SEO and first load) or rebuild through a webhook relay, and its AI code editor overlaps with Claude and opens pull requests Josh can't easily judge. Real design changes come back to Claude.
- Write Josh a one-page guide (in the repo and as a PDF) with screenshots: how to add a case study, swap the availability line and reorder featured work.

## 11. Forms, booking and availability

- **Form:** Web3Forms (free, 250 submissions a month; its access key is public by design, so it's safe in the code) with Cloudflare Turnstile (free, contact and service pages only) and a honeypot field. Four required fields: name, work email, organisation, and what you need (preset from the service and tier clicked). Two optional: a budget band matching the college quote bands (under £5k, £5k to £10k, £10k to £25k, £25k to £50k, over £50k, not sure yet) with helper text such as "A rough band helps me suggest the right scope", and a "needed by" date. An optional tickbox: "I need a formal written quote for procurement". Proper `autocomplete` attributes. The free plan has no file uploads, so add "or email your brief" next to the form. Inline validation, an inline success state, no page reload. Web3Forms is a US company with unclear retention terms: name it as a processor in the privacy notice and have Josh read its data terms before launch.
- **Booking:** "Book a 20-minute call" as a plain link to Josh's Cal.com page (free, unlimited bookings, EU hosting available), shown as a secondary option and again on the form's thank-you screen. A link, not an embed, so no third-party script runs on the site.
- **Email:** a domain address (`hello@conceptualstudio.co.uk` `[TBC: Josh to set up or forward]`) looks far more credible to institutions than the current Gmail address. Visible, with a copy button.
- **Availability pill:** keep the green dot Josh loves, but make the words true and dated: for example "Booking new projects from February". Colleges plan around the academic year, so a month answers a real question, while "Available to book a call" says nothing (calls are always available). There's no evidence a vague pill lifts enquiries. Store it in the CMS as a month plus a short note, not free text, and hide it automatically once the month has passed (a weekly scheduled rebuild in GitHub Actions does this with no extra JavaScript). Keep the pulse slow and subtle, or try it static; show Josh both. The pulse stops under reduced motion.

## 12. Stack, repo and deployment

- **Astro** (current major, 7.x), static output, plain CSS with custom properties for tokens, React only as islands for React Bits. GSAP from npm.
- Deploy with GitHub Actions (`withastro/action` plus `actions/deploy-pages`), with Settings > Pages > Source set to GitHub Actions. Build and review on the repo's GitHub Pages URL first; switch the custom domain only when Josh approves. On the custom domain, set `site` to the domain and remove `base`, or links break. Pin the GSAP version (its licence is Webflow's own and can change).
- **Domain:** custom domain set in Pages settings, apex A records and `www` CNAME, **verify the domain in GitHub** (prevents takeover), tick **Enforce HTTPS**. Keep Framer live until the new site is checked.
- **Old URLs:** GitHub Pages can't send server redirects. Use Astro's `redirects` (static meta-refresh pages) from every old Framer slug (`/fou-answer`, `/new-city-college-infographics`, and the rest in `CURRENT WEBSITE/`) to the new `/work/…` pages.
- **SEO:** a title and description per page ("Brand identity and data visualisation for colleges | Conceptual Studio"), Open Graph images per case study, sitemap, robots, canonical URLs, `ProfessionalService` structured data with London as the area served (no street address unless Josh wants one), `lang="en-GB"`.
- **Analytics:** cookieless (Cloudflare Web Analytics or GoatCounter).
- **Not in the repo:** the `BRANDING/` PDFs, the Framer export, desktop font files, raw client source files, anything under NDA.

## 13. Security, privacy, accessibility and speed

**Security.** A static site with no logins has a small attack surface. Keep it that way:
- No secrets anywhere in the site; it shouldn't need any. Public-by-design keys (Web3Forms, Turnstile site key, analytics token) are fine.
- Before the first push, scan the repo and its history for secrets. If one is ever found: rotate it first, then purge history with `git-filter-repo --sensitive-data-removal`, then ask GitHub Support to clear cached refs.
- Secret scanning and push protection on (free for public repos), Dependabot alerts and version updates on.
- A Content Security Policy via Astro's `security.csp` (meta tag), allowing only what's used: Turnstile, Web3Forms, Cal.com, the R2 media domain, the analytics script. Add a referrer policy.
- GitHub Pages can't set custom response headers, and community reports say it doesn't send HSTS on custom domains, so there's no HSTS or frame protection from Pages itself. Accept that at launch. Putting Cloudflare's proxy in front would add them, but it can break GitHub's certificate renewal; only do it later if needed.
- **Cookies:** the site sets none of its own, so "secure session cookies" don't apply. Cookieless analytics plus click-to-load embeds mean no cookie banner is needed, but the privacy page must explain analytics and give a simple way to object (UK PECR as changed by the Data (Use and Access) Act 2025).
- Two-factor authentication on GitHub, the domain registrar, Cal.com, Web3Forms and Cloudflare.

**Accessibility (WCAG 2.2 AA).** Colleges and public bodies are bound by it, so it's also a selling point. Keyboard access everywhere, visible focus, skip link, landmarks, one `h1` per page, alt text required in the CMS, captions on any video with speech, form labels and errors announced, 44px targets, `prefers-reduced-motion` and `prefers-contrast` respected, charts with text alternatives and data tables. Test with VoiceOver on iPhone and Mac and with axe.

**Speed.** B2B sites that load in one second convert about three times better than at five seconds (Portent, 2022). Budgets on a mid-range phone over 4G: LCP under 2s (the hero still is the LCP element, the video loads after), CLS under 0.05, INP under 200ms, home page JavaScript around 90KB gzipped excluding video. Preload Agatho, `font-display: swap` with a metrics-matched fallback. Lighthouse mobile 95+ in every category.

## 14. What Josh needs to give you

- [ ] Final headline choice (section 3)
- [ ] Confirm the Agatho licence allows serving the web font from a public repository (anyone can download files from a public repo)
- [ ] Logos as SVG (black, white, gold), and the "Studio" signature as SVG paths
- [ ] First-frame and final-frame stills of the hero video, with alpha
- [ ] A recent photo of himself
- [ ] Case study material for each featured project: brief, what he did, outcomes, images, any before/after, permission to show
- [ ] Which projects are featured, and in what order (suggested: NCC Strategic Intent, Southbank College Group heat maps, Oxford School of English rebrand, the trademarked NCC logo campaign, NCC sustainability report if it's public, DoubleShot Studio identity, CMD Inc identity, Fou Answer)
- [ ] Prices for the ladder tiers, and whether they include VAT
- [ ] Company number, registered office, VAT status, insurance held. The registered office has to appear on the site by law; if it's a home address, consider a registered-office service before launch.
- [ ] Domain email address
- [ ] Response-time promise he can keep
- [ ] Client logos he wants shown (or names only)
- [ ] Social links (Instagram is currently @conceptual.pdf on the site, TikTok @conceptual.studio, LinkedIn)

## 15. Build order

Stop and show Josh at each step.

1. **Set-up:** repo, Astro, tokens, fonts, deploy to the GitHub Pages URL, CMS skeleton.
2. **Direction:** `design-taste-frontend` steps 1 to 5 (inventory, argument, three dealt directions with `--keep palette,type`, the idea, the copy deck). Show Josh the three directions as screenshots and let him choose.
3. **Home:** hero video, nav and glass, every section, built still first.
4. **Work:** All Work and the case-study template with two real case studies.
5. **Services:** overview, both service pages with ladders, the live thing, the form and booking.
6. **About, Contact, small pages, footer.**
7. **Motion layer** (section 9), then the CMS wired to every collection. Josh adds a test project himself from start to finish.
8. **Audits:** `inspect.mjs` (0 FAIL at 1440, 768, 390), `web-design-guidelines`, axe and keyboard and VoiceOver, Lighthouse, then real devices: iPhone Safari, Chrome on iPhone, Instagram and Facebook in-app on iPhone, Chrome on Android, Instagram on Android, Firefox desktop, Safari desktop, Low Power Mode on.
9. **Launch** with Josh's OK: domain switch, HTTPS check, redirects check, Framer retired.
10. **Handover:** Josh's editing guide, and the site skill via `skill-creator`.

**Done means:** every page works at every width, the transparent video is transparent on every browser in step 8, nothing on the site is invented, every `[TBC]` is resolved, and Josh has added a project on his own.

---

## Appendix A: existing testimonials (verbatim)

> "Everyone was so impressed with your concepts and overall branding - it was an easy pitch to the client. Thanks again for all your work on this - we're all really happy with the result."
> Laura De Vos, Marketing & Student Recruitment, New City College

> "The campaign was one of the biggest I've worked on - your logo appeared across buses, tubes, and stations in central and east London for months. Your design is now formally trademarked and integral to our brand. I'm hugely grateful you helped us avoid legal issues and added real value to the college"
> Alison Arnaud, Principal, Tower Hamlets College, New City College

> "Your work is excellent and looks great in the final document. I'll have no doubt recommending you. I'm really happy with all the others too, and really appreciate all your excellent work."
> Mark Silverman, Managing Director, Plus Pursuits

Keep quotes exactly as the clients wrote them.

## Appendix B: current project pages

`fou-answer`, `new-york-general-group`, `new-city-college-strategic-intent`, `new-city-college-infographics`, `acl-essex-infographics`, `oxford-school-of-english`, `sherman-poon-永遠潘朵拉`, `kut-magazine`, `exploring-mental-health-through-3d-storytelling`, `detatched`, `rebirth`, `the-other-side`, plus `about`, `contact`, `client-testimonials`. Text and images are in `CURRENT WEBSITE/`.

## Appendix C: Josh's original video component (Framer, verbatim)

```jsx
import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

export function MyVideo(props) {
    const videoRef = useRef(null)
    const [error, setError] = useState(false)
    const [lastTime, setLastTime] = useState(0)

    const updateMediaSource = () => {
        const movSource = props.movFileLight
        const webmSource = props.webmFileLight
        return { movSource, webmSource }
    }

    // Final corrected detection logic for transparent video support
    const supportsTransparentMov = () => {
        const ua = navigator.userAgent.toLowerCase()

        const isIOS = /iphone|ipad|ipod/i.test(ua)
        const isMacSafari = /^((?!chrome|android).)*safari/i.test(ua)
        const isEmbedded = /instagram|fbav|fban|tiktok|line|pinterest/i.test(ua)

        return (isIOS || isMacSafari) && !isEmbedded
    }

    useEffect(() => {
        const videoElement = videoRef.current
        const { movSource, webmSource } = updateMediaSource()

        if (videoElement) {
            videoElement.innerHTML = ""

            const userAgent = navigator.userAgent.toLowerCase()
            const isInstagram = /instagram/i.test(userAgent)
            const isIOS = /iphone|ipad|ipod/i.test(userAgent)

            if (isInstagram) {
                if (isIOS && movSource) {
                    const movSourceElement = document.createElement("source")
                    movSourceElement.src = movSource
                    movSourceElement.type = "video/quicktime"
                    videoElement.appendChild(movSourceElement)
                } else if (webmSource) {
                    const webmSourceElement = document.createElement("source")
                    webmSourceElement.src = webmSource
                    webmSourceElement.type = "video/webm"
                    videoElement.appendChild(webmSourceElement)
                }
            } else {
                const shouldUseMov = supportsTransparentMov()

                if (shouldUseMov && movSource) {
                    const movSourceElement = document.createElement("source")
                    movSourceElement.src = movSource
                    movSourceElement.type = "video/quicktime"
                    videoElement.appendChild(movSourceElement)
                } else if (webmSource) {
                    const webmSourceElement = document.createElement("source")
                    webmSourceElement.src = webmSource
                    webmSourceElement.type = "video/webm"
                    videoElement.appendChild(webmSourceElement)
                }
            }

            videoElement.load()
            videoElement.currentTime = lastTime

            videoElement
                .play()
                .then(() => {
                    videoElement.pause()
                    setTimeout(() => {
                        videoElement.play().catch((playError) => {
                            console.error("Video playback error:", playError)
                            setError(true)
                        })
                    }, 0)
                })
                .catch((playError) => {
                    console.error("Video playback error:", playError)
                    setError(true)
                })

            const updateLastTime = () => {
                setLastTime(videoElement.currentTime)
            }

            videoElement.addEventListener("timeupdate", updateLastTime)

            return () => {
                videoElement.removeEventListener("timeupdate", updateLastTime)
            }
        }
    }, [props.movFileLight, props.webmFileLight])

    return (
        <>
            {error ? (
                <div style={{ textAlign: "center" }}>
                    <img
                        src={props.webpFallbackLight}
                        alt="Fallback Image"
                        style={{ maxWidth: "100%", height: "auto" }}
                    />
                </div>
            ) : (
                <video
                    ref={videoRef}
                    style={{
                        objectFit: "contain",
                        backgroundColor: "transparent",
                        ...props.style,
                    }}
                    muted
                    playsInline
                    controls={false}
                    disablePictureInPicture
                    preload="auto"
                    webkitPlaysInline
                    x5PlaysInline
                >
                    Your browser does not support the video tag.
                </video>
            )}
        </>
    )
}

addPropertyControls(MyVideo, {
    movFileLight: {
        type: ControlType.File,
        title: "MOV File",
        allowedFileTypes: ["mov"],
        defaultValue: "",
    },
    webmFileLight: {
        type: ControlType.File,
        title: "WEBM File",
        allowedFileTypes: ["webm"],
        defaultValue: "",
    },
    webpFallbackLight: {
        type: ControlType.File,
        title: "WEBP Fallback",
        allowedFileTypes: ["webp"],
        defaultValue: "",
    },
})
```
