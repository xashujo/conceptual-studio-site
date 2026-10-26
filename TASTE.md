# Taste rules

How to use this file:
- DECISIONS.md wins over this file. This file wins over any skill's defaults and over the brief.
- Every rule names its source. `INSPO/…` is a file in the References folder. `Framer /page` is conceptualstudio.co.uk, measured in a browser at 1440 and 390 wide on 26 Oct 2026.
- The measurements behind each rule are in TASTE-SOURCES.md.

The four feelings come from DECISIONS.md: wonder, preciousness, warmth, calm confidence.

---

## Wonder

1. **A threshold opens on one painted detail, not a whole painting.** Crop at least 3× into the source so a single passage fills the frame and the paint surface shows at 1440: craquelure, brushwork, the engraver's cut lines. Duotone it (DECISIONS). The garden engraving and the Lemoyne ceiling are the stock to crop from.
   *Source: INSPO/Classical Art 01 (one creature's head fills the frame, cracks visible); INSPO/Kombu 03 (a Rembrandt cropped to the figure's head and shoulders).*

2. **Words sit in the painting's empty part.** Pick crops with a quiet area covering a third of the frame or more (open sky, shadow, plain stone). Set the type there, straight onto the duotone, with no scrim and no glass. Type never covers a figure.
   *Source: INSPO/Kombu 03 (the figure fills the left 45%, the copy sits on the dark right side); INSPO/Kombu 05 (headline over the right half of the relief); INSPO/The Apotheosis of Hercules (the open sky at centre top is the natural place for words).*

3. **One big Agatho word per page, standing on a hairline.** The word is the page's name (About, Work, Contact), never "Conceptual Studio". Its cap height is at least 20× the body's. A 1px rule runs exactly margin to margin under it, with 24px text directly below the rule.
   *Source: Framer /about and /contact (Agatho at 509px and 407px over a full-width rule, 24px Inter Tight below); INSPO/Kombu 02 (wordmark 64% of the band's height and 95% of its width, ruled underneath).*

4. **One light, from the top left.** The glass rim highlight, the gold flourish's highlight and every shadow agree on it.
   *Source: INSPO/The Apotheosis of Hercules (light breaks in from the top); INSPO/Pintrest Board 03 (every object lit from the upper left); the rim term in liquid-glass-js.*

5. **The gold flourish appears twice at most: the opening, and one chapter title.** It is a still, lit object (DECISIONS), shown large on paper. It is never shrunk into an icon, a divider or a bullet.
   *Source: Framer / (the flourish wraps "Conceptual" in the hero and "Selected Works" at the chapter title, and nowhere else).*

## Preciousness

6. **One exhibit per screen, in the Framer card.** Title left, year right, hairline, disciplines, one-line description, "View project" pill, then the image at 1100px or wider on desktop and full content width on a phone. Nothing else competes in that viewport.
   *Source: Framer / (cards 1156px wide, image 1100px, card title Inter 40/48 bold with −2.1px tracking, disciplines 20/30); INSPO/Pin 04 and Pintrest Board 03 (one object per frame, centred, plenty of ground).*

7. **The work is shown in use, photographed like an object.** Signage, print and screens come first. A logo on a flat colour block is not an exhibit.
   *Source: DECISIONS; INSPO/Pin 02 (a brand mark forged into a real horseshoe, studio-lit on grey paper); Framer /oxford-school-of-english (the shopfront sign photo exists, but the card leads with the logo on gold).*

8. **A plate caption sits under every image, like a museum label.** These are the only small caps on the site: 11–12px, tracking +0.06em, two lines. Line one is the title, client and year in bold. Line two is the medium or discipline in brackets, light.
   *Source: INSPO/Kombu 02 (credits set as a bold name over a bracketed role: "ROBBERT SCHEFMAN / (DESIGN & ART DIRECTION)"); DECISIONS.*

9. **Night chapters are warm black with the work lit in amber.** The ground sits around #14110D, never #000. At least 80% of the screen is dark, and the light on the work comes from the top left.
   *Source: INSPO/Pin 01 (80% dark) and Pin 04 (86% dark); INSPO/Pintrest Board 01 (tungsten amber #915A41 against #221617); INSPO/Kombu 02 (#11120F, not black). The `rebuild` branch's dark paper token is #000000, which breaks this rule.*

10. **Texture comes from the three surfaces the site owns:** the engraving's cut lines, paint cracks in threshold crops, and the paper ground. There is no CSS noise or grain overlay.
    *Source: INSPO/Classical Art 01; INSPO/Footer Inspo (the engraved line is the texture); INSPO/Pin 03 (real paper folds behind the object).*

11. **Edges catch gold, not white.** Where glass, a frame or a rule needs a highlight, it is cream or gold.
    *Source: INSPO/Kombu 01 and Kombu 04 (the frame's rim is cream-gold #EDE5B5); the old glass's warm rim rgb(255 248 236) in commit 69b19e3.*

12. **Corners are concentric.** The outer radius is the inner radius plus the inset. Keep Framer's 25px image corner and set the card around it to 25px plus its inset (a 16px inset gives 41px). Pills are fully round.
    *Source: Framer / (card 33px, inset 28px, image 25px: not concentric, so the corners look pinched); Apple's concentric corners (apple-design skill).*

## Warmth

13. **Paper #F1DFC8, ink #000, and every grey is warm.** Secondary text is ink mixed into paper (about 60% ink), never a neutral grey.
    *Source: Framer / (descriptions are rgb(125 125 125), the one cold colour on the site); INSPO palettes are warm throughout (Kombu #222318 with #EDE5B5, Lairesse #837C67).*

14. **A project page takes its client's colour as its ground.**
    *Source: Framer /oxford-school-of-english (ground #D3AA62, the "Oxford Gold" from the case study); Framer /fou-answer (Fou's light grey).*

15. **The footer is a landscape, not a sitemap.** The garden engraving fills the bottom 70% of the footer in one ink (gold on paper) and dissolves upward with no top edge. The text sits in the top third, small, in that same ink.
    *Source: INSPO/Footer Inspo (the art starts 31% of the way down; ink covers 60% of the lower half and 1% of the top third; one violet ink for art and text alike); DECISIONS (keep the garden engraving and its fade).*

16. **Every button says the offer at rest and the action on hover.**
    *Source: Framer / ("Book a Call" becomes "Contact Me ↗"; "Joshua McDonald, Portfolio / 2025" becomes "About ↓"); Framer /contact ("● Available to Book a Call" shrinks to "↗ Email Me").*

17. **Status is live, shown with a coloured dot.** Green blinks for availability. Amber sits next to the live London time.
    *Source: Framer /contact (green #23B064 dot blinking in three steps; amber #F1A90F dot beside "London, UK: 08:57").*

## Calm confidence

18. **The hairline is the frame.** Every rule runs exactly margin to margin. The outer margins are equal and about 2.5% of the viewport: 36px at 1440, 16px minimum at 390. Full-bleed art runs past them; text never does.
    *Source: INSPO/Kombu 02 (margins 2.5% and 2.2%, rule margin to margin); INSPO/Kombu 05 (2.6%); Framer / (1100px rules).*

19. **The credits row is the house signature.** Three columns of 24px text under one hairline: who, what, the action. It opens the home page and comes back at chapter openings.
    *Source: Framer / (hero: "Joshua McDonald / Visual & Graphic Designer / Book a Call" under the rule); INSPO/Kombu 02 (three credit columns at left, a third across and right, under a rule).*

20. **Two sizes do the work on any screen: Agatho at word scale and Inter at 20–24px.** Card titles at 40px are the only size in between.
    *Source: Framer measured sizes 509 / 95 / 40 / 24 / 20 / 16px; Framer /about (509px over 24px in one view).*

21. **Left-aligned by default.** One centred moment per page at most, the opening.
    *Source: Framer / (cards and body all left); INSPO/Kombu 05 (headline set off-centre, over the quiet half).*

22. **Motion borrows Framer's: a label slides to its action, an arrow turns, a tint deepens.** One change per hover. Springs settle within 800ms. Nothing loops except the availability dot and the clock dot.
    *Source: Framer timings, listed below.*

23. **Mark the current page with brackets, not a pill or an underline:** "[About]" in the nav.
    *Source: INSPO/Kombu 05 ("[ABOUT]") and Kombu 01 ("[INDEX]"). Agatho is licensed in Medium only, so use upright brackets, not Kombu's italic.*

24. **The dock waits until it is needed.** It is hidden on arrival and rises once the visitor has scrolled 100px. It is glass because the page passes under it.
    *Source: Framer / (Nav Bar fixed 30px from the bottom, translated 120px down until scrollY ≥ 100).*

---

## Never do (these make it look like a template)

- A giant "Conceptual Studio" wordmark or hero logo lockup. *(DECISIONS)*
- Eyebrows and index labels: "N° 01", "02 / 06", "SELECTED WORK" in small caps above anything. *(Commit b641b7c had all three.)*
- Glass on flat paper, over the work, over a headline, or on every card. *(b641b7c put glass on cards, chips, the form and price cards. 2a7589f's desktop bar is glass over plain paper.)*
- A painting in full colour, or one painting per card. *(69b19e3 used Lemoyne and Boucher in full colour behind its glass.)*
- A logo on a flat colour block as the main project image. *(Framer / Oxford, NCC and KUT cards.)*
- Neutral greys, or pure #000 as a night ground. *(Framer rgb(125 125 125); the `rebuild` dark token.)*
- Purple, indigo, gradient text, glows, gradient blobs.
- CSS noise or grain overlays.
- Icon-topped feature cards, a services bento, rows of identical cards. *(2a7589f: "priced services bento".)*
- Sparkle or AI buttons. *(Framer /about: "Summarise ✨".)*
- Exclamation headlines and slogans. *(Framer /contact: "Say Hello, Let's Collaborate!")*
- Monospace or spec-sheet labels outside plate captions. *(INSPO/Pintrest Board 04 is tempting; it belongs in captions only.)*
- Pinned sections that leave the visitor scrolling past empty paper.

---

## Framer micro-interactions to rebuild

Measured frame by frame in Chromium at 1440 on 26 Oct 2026. "Settles" means the last frame that changed.

| Element (page) | Trigger | What happens | Measured | Rebuild with |
|---|---|---|---|---|
| Hero credits row (/) | Load | "Conceptual" and the "Studio" signature fade 0 → 1. Then the hairline fades in. Then the three credit columns drop 75px into place while fading 0.4 → 1. | Fade 490 → 1615ms. Rule 990 → 2000ms. Columns 1720 → 2740ms. | Same order and timings, with the flourish as a still (DECISIONS). |
| Hero credit, left and middle (/) | Hover | The label slides away and its action slides up from 55px below: "About ↓", "Work ↓". | Offset 55px → 6px in the first 210ms, settles at 710–780ms. No overshoot. | translateY 55px → 0, 700ms, cubic-bezier(0.16, 1, 0.3, 1). Out is the mirror. |
| "Book a Call" (/) | Hover | Text swaps to "Contact Me ↗", sliding in from 12px to the right. | Settles at 580ms. | translateX 12px → 0, 560ms, same curve. |
| "View Project" pill (cards) | Hover | Arrow turns → to ↗ (0° → −45°). Fill deepens from paper at 5% to paper at 20%. | 75% of the turn by 130ms, settles at about 500ms (spring). Fill takes 430ms. | rotate(−45deg), 180ms ease-out as DECISIONS says (it reads the same as Framer's spring). Fill 300ms. |
| "Back" pill (inner pages) | Hover | Arrow turns ← to ↖ (45°). A glass pill fades in (blur 5px, paper at 5%, shadow 0 4px 8px black at 15%). | Same curve as View Project: 78% of the turn in 155ms. | Same rotation and timing as View Project. |
| Availability pill (/contact) | Hover | "● Available to Book a Call" (310px) shrinks to "↗ Email Me" (162px). The dot becomes the arrow. The text turns green. | Width spring settles at 770–850ms. | Animate width with transform scale on a wrapper, 700ms spring. The label cross-fades in 150ms. |
| Availability dot | Always | Blinks in three steps (start, middle, end). | About 420–460ms per step. | Opacity keyframes over a 1.3s cycle. Stops under reduced motion. |
| London clock dot (/contact) | Always | The amber dot fades in and out. | 0.18 → 1 over about 6s. | Opacity 6s ease-in-out alternate. Stops under reduced motion. |
| Copy Email (/contact) | Hover | Fill darkens to black at 5%. | 540ms. | 300ms. |
| Copy Email (/contact) | Click | Email goes to the clipboard. The label becomes "Email Copied!". The pill widens 162 → 186px and darkens. It reverts on its own. | Text swaps within 60ms. Width 300–400ms. Reverts at 1.55s, shrinks back over about 400ms. | Same, with an `aria-live="polite"` region announcing the copy. |
| Dock (/) | Scroll ≥ 100px | Rises 120px from below the fold with a slight overshoot. | From crossing 100px: arrives in 170ms, overshoots 3.4px at 230ms, settles at 445ms. | translateY 120px → 0. Spring with mass 1, stiffness ≈ 420, damping ≈ 31 (worked out from the measured overshoot and timing). |
| Dock icons | Hover | Icon goes from ink at 50% to ink at 100%. A small label pill appears above ("About", "All Work"). | Instant (0ms). | 120ms colour. Label fades in over 120ms. |
| Dock menu icon | Click | The menu icon becomes "×" Close. A frosted panel opens with Agatho links: Projects, Personal Projects, Client Testimonials. The close button grows 32 → 38px, rounds off and gains its shadow. | 475ms. | Glass spec, plate tier. 400ms. |
| Project stack (/) | Scroll | Each card pins at the top. As the next one rises over it, the outgoing card scales 1 → 0.75, fades 1 → 0 and drops 113px. | Linear with scroll, over about 900px. | Scroll-driven animation (animation-timeline: view()), with a JS fallback. |
| "Selected Works" title (/) | Scroll | Fades out as the first card arrives. | 1 → 0 over 450px of scroll. | Same. |
| About statement (/) | Scroll | Pinned, then fades out. | Gone by about 1800px. | Same. Keep it readable for at least one full viewport. |
| Project images, "Continue to Work", "Read More", Next/Previous Project | Hover | No visible change. | None. | Add nothing. Leave them still. |

---

## Glass spec

**Best old version: commit `2a7589f`, the phone menu sheet.** It is light liquid glass over the gold-on-paper engraving. That is the exact pairing DECISIONS asks for: glass as the lens over duotoned art. The runner-up is `69b19e3`'s dark plates ("Tell me about your project", "Start a project"), which are the model for night chapters. All three pre-Figma commits use the same shader, an adaptation of dashersw/liquid-glass-js. They differ only in where they put it.

**What "identical to iOS 27" means here.** On iPhone, Liquid Glass is drawn by the system compositor, live, over whatever is behind it. A web page cannot do that. liquid-glass-js renders WebGL refraction of a captured image. CSS refraction only works in Chromium; Safari and Firefox get blur without the bend. So the target is to match what iOS 27 visibly changed and to say plainly where the web differs. Apple's announced iOS 27 changes are below; Apple published no numbers, so every value marked *tuned* is a starting point to adjust by eye.

- Clearer glass, with busy content behind it diffused more for legibility.
- A darkened edge around glass elements.
- Brighter specular highlights.
- Adapts to Reduce Transparency and Increase Contrast.
- A uniform bar appears behind floating bars when content scrolls under them (the scroll edge effect).

### Tier A: plate glass (WebGL, liquid-glass-js shader)
For CTA cards, project title plates and the phone menu sheet: anything sitting over a threshold image.

- **Sampling:** the known `<img>` behind the plate (as in 69b19e3), not liquid-glass-js's html2canvas snapshot. A snapshot is taken once and goes stale when the page changes. Render on demand, never in a loop. One WebGL context per plate, four plates per page at most.
- **Refraction (library defaults, kept):** edgeIntensity 0.01, rimIntensity 0.05, baseIntensity 0 (warp off), edgeDistance 0.15, rimDistance 0.8, baseDistance 0.1, cornerBoost 0.02, rippleEffect 0.1. Refraction scale is 2.4 × the plate's short side.
- **Blur:** 9-tap Gaussian at 4px spacing (σ ≈ 8px) on a mipmapped texture. Keep it: the diffusion is what makes text readable over the engraving's lines (iOS 27's "diffuses complex content").
- **Tint, light:** #F1DFC8. Was 0.58 opacity; *tuned* to 0.48 for iOS 27's clearer glass. The duotone behind is already low contrast.
- **Tint, dark:** #14110D (warm, per rule 9; was #0B0A09) at 0.62.
- **Specular, top rim:** rgb(255 250 240). Was 0.22 light / 0.14 dark; *tuned* to 0.30 / 0.20 (brighter, per iOS 27).
- **Darkened edge (new for iOS 27):** an inner 1px ring of black at 10% on light plates and 35% on dark ones. *Tuned.*
- **Shape:** radius 28px. Menu sheet radius 30px, inset 10px from the screen edges (2a7589f).
- **Text on glass:** ink on light plates, paper on dark ones. Measure contrast on the rendered plate and raise that plate's tint until it reads.

### Tier B: chrome glass (CSS, over live content)
For the dock and any bar that content scrolls under.

- `background: color-mix(in srgb, var(--paper) 68%, transparent)`
- `backdrop-filter: blur(18px) saturate(1.6)`
- **Chromium only:** SVG edge refraction (`feDisplacementMap` scale −45, band = the larger of the radius and 16px, capped at a third of the short side, quadratic falloff). With refraction on, the filter is `url(#refract) blur(14px) saturate(1.7)`. From 69b19e3.
- **Shadows (69b19e3, rims warmed):**
  - inset 0 1px 0.5px rgb(255 248 236 / 0.7)
  - inset 0 −1px 0.5px rgb(0 0 0 / 0.06)
  - inset 0 0 0 0.5px rgb(255 248 236 / 0.35)
  - 0 12px 32px −14px rgb(40 24 8 / 0.35)
- **Darkened edge (iOS 27):** add `inset 0 0 0 1px rgb(0 0 0 / 0.08)`. *Tuned.*
- **Dock shape:** fully round ends, 60px tall (Framer's dock is 322 × 60). Bars: radius 28px.
- **Scroll edge (iOS 27):** while content is passing under the dock, fade in a band of paper behind it (paper at 0 → 85%, 200ms), so labels never sit on a busy image.

### Everywhere
- Glass appears only where something sits behind it: never on flat paper, never over the work, never over a headline (DECISIONS).
- With `prefers-reduced-transparency: reduce`, glass becomes solid paper or ink. With `prefers-contrast: more`, it becomes solid with a 2px ink outline. iOS 27 does the same. Visitors only see this if they have asked for it in their settings, so the design itself is unchanged.
- If WebGL fails, Tier A falls back to Tier B.

---

## The hard test

If every rule above is followed, the homepage looks like this:

> At 1440 the page opens on paper-coloured #F1DFC8 with the gold flourish lit from the top left, large and still, wrapped through the name. Below it, one hairline runs exactly margin to margin over three columns of 24px Inter: Joshua McDonald, what he designs, and "Book a call". Hover any of them and the label slides up into its action ("About ↓", "Work ↓", "Contact me ↗"). Scroll 100px and a glass dock rises from the bottom with a 3px overshoot. The first exhibit is a Framer card, title left and year right over a rule, showing the Oxford School of English sign photographed on its shopfront in full colour, 1100px wide, with a two-line plate caption in small caps beneath it. Each card pins, and the next one slides over it as the last shrinks to three quarters and fades. A night chapter turns the page to warm black for the 3D and motion work, with the Sherman Poon music video stills glowing in the dark. A detail of the Lemoyne ceiling, duotoned gold on paper and cropped so the cracks show, holds a light glass plate with a gold-catching rim: "Tell me about your project", a green dot blinking "Available", which turns to "Email me" on hover. The page ends on the garden engraving rising from the bottom in gold ink and dissolving into the paper, with the small print set in that same gold in the top third.

**Could this describe any studio's site?** No. It depends on things that are only his: the flourish, the credits row and its label swaps, the Framer card and its stack, the availability pill, the Lemoyne and garden plates, and the gold-ink footer. It took a rewrite to get here, though. In the first draft, rules 6, 10, 18, 20 and 22 were generic ("one exhibit per screen", "texture from real surfaces", "equal margins", "two type sizes", "motion is feedback"). Any careful studio could have followed them. They were rewritten around the Framer card, the engraving and paint surfaces, the hairline, the Agatho and Inter pair, and Framer's label-swap motion.
